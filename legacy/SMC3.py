import itertools, pprint, operator, math, random

SCATTER = 0     # 0 base
WILD    = 1
SEVEN   = 2
BAR3    = 3
BAR2    = 4
BAR1    = 5
CHERRY  = 6
NONE    = 7

def nCk(n, k):
    return float(math.factorial(n)) / math.factorial(k) / math.factorial(n - k)

class SMC:
    SYMBOLS = 8
    REELS = 3

    ALL_SYMBOLS = (SCATTER, WILD, SEVEN, BAR3, BAR2, BAR1, CHERRY, NONE)

    SYMBOL_NAMES = (
        'Scatter',
        'Wild',
        'Seven',
        'Bar3',
        'Bar2',
        'Bar1',
        'Cherry',
        'None',
    )

    REEL_DISTS = (
            #   SCATTER WILD    SEVEN   BAR3    BAR2    BAR1    CHERRY  NONE
            (   1,      1,      1,      1,      1,      1,      1,      7),     # Reel1
            (   1,      1,      1,      1,      1,      1,      1,      7),     # Reel2
            (   1,      1,      1,      1,      1,      1,      1,      7),     # Reel3
            #(3,1,3,2,1,6,2,18),
            #(3,1,3,2,1,6,2,18),
            #(3,1,3,2,2,6,1,18),
    )

    FREESPIN_REEL_DISTS = (
            #   SCATTER WILD    SEVEN   BAR3    BAR2    BAR1    CHERRY  NONE
            (   0,      1,      1,      1,      1,      1,      1,      6),     # Reel1
            (   0,      1,      1,      1,      1,      1,      1,      6),     # Reel2
            (   0,      1,      1,      1,      1,      1,      1,      6),     # Reel3
            #(0,1,2,1,1,2,1,8),
            #(0,1,2,1,1,1,2,8),
            #(0,1,2,1,1,2,1,8),
    )

    WINNING_COMBINATIONS = (
        ('3 Wilds', (WILD,   WILD,   WILD), 1000, 0),

        ('3 Sevens W0', (SEVEN,  SEVEN,  SEVEN), 70 * 1, 0),
        ('3 Sevens W1', (SEVEN,  SEVEN,  WILD),  70 * 2, 0),
        ('3 Sevens W2', (SEVEN,  WILD,   WILD),  70 * 3, 0),

        ('3 Bar3 W0', (BAR3,   BAR3,   BAR3),  30 * 1, 0),
        ('3 Bar3 W1', (BAR3,   BAR3,   WILD),  30 * 2, 0),
        ('3 Bar3 W2', (BAR3,   WILD,   WILD),  30 * 3, 0),

        ('3 Bar2 W0', (BAR2,   BAR2,   BAR2),  25 * 1, 0),
        ('3 Bar2 W1', (BAR2,   BAR2,   WILD),  25 * 2, 0),
        ('3 Bar2 W2', (BAR2,   WILD,   WILD),  25 * 3, 0),

        ('3 Bar1 W0', (BAR1,   BAR1,   BAR1),  5 * 1, 0),
        ('3 Bar1 W1', (BAR1,   BAR1,   WILD),  5 * 2, 0),
        ('3 Bar1 W2', (BAR1,   WILD,   WILD),  5 * 3, 0),

        ('3 Cherries W0', (CHERRY, CHERRY,  CHERRY), 5 * 1, 0),
        ('3 Cherries W1', (CHERRY, CHERRY,  WILD),   5 * 2, 0),
        ('3 Cherries W2', (CHERRY, WILD,    WILD),   5 * 3, 0),

        ('Any Bars W0', (BAR3,   BAR3,   (BAR2,BAR1)), 3 * 1, 0),
        ('Any Bars W0', (BAR2,   BAR2,   (BAR3,BAR1)), 3 * 1, 0),
        ('Any Bars W0', (BAR1,   BAR1,   (BAR3,BAR2)), 3 * 1, 0),
        ('Any Bars W0', (BAR3,   BAR2,   BAR1),        3 * 1, 0),
        ('Any Bars W1', (BAR3,   BAR2,   WILD),        3 * 2, 0),
        ('Any Bars W1', (BAR3,   BAR1,   WILD),        3 * 2, 0),
        ('Any Bars W1', (BAR2,   BAR1,   WILD),        3 * 2, 0),

        ('2 Cherries W0', (CHERRY, CHERRY,  (SCATTER,SEVEN,BAR3,BAR2,BAR1,NONE)),  2 * 1, 0),
        ('2 Cherries W1', (CHERRY, WILD,    (SCATTER,SEVEN,BAR3,BAR2,BAR1,NONE)),  2 * 2, 0),

        ('1 Cherry S0',   (CHERRY, (SEVEN,BAR3,BAR2,BAR1,NONE), (SEVEN,BAR3,BAR2,BAR1,NONE)),  1, 0),
        ('1 Cherry S1',   (CHERRY, SCATTER, (SEVEN,BAR3,BAR2,BAR1,NONE)),                      1, 0),
        ('1 Cherry S2',   (CHERRY, SCATTER, SCATTER),                                          1, 5),    # line payout + free spins

        ('2 Scatters', (SCATTER, SCATTER, (WILD,SEVEN,BAR3,BAR2,BAR1,NONE)),         0, 5),
        ('3 Scatters', (SCATTER, SCATTER, SCATTER),                             0, 8),
    )

    #FREESPIN_COMBINATIONS = (
    #    ('3 Scatters', (SCATTER, SCATTER, SCATTER), 8),
    #    #('2 Scatters', (SCATTER, SCATTER, (WILD,SEVEN,BAR3,BAR2,BAR1,CHERRY,NONE)), 5),
    #    ('2 Scatters', (SCATTER, SCATTER, (SEVEN,BAR3,BAR2,BAR1,CHERRY,NONE)), 5),
    #)

    FREESPIN_SYMBOLS =              (WILD, SEVEN, BAR3, BAR2, BAR1, CHERRY, NONE)
    FREESPIN_COLLECTION_SYMBOLS =   (WILD, SEVEN, BAR3, BAR2, BAR1, CHERRY)
    FREESPIN_COLLECTION_PAYOUTS =   (#  S0  S1  S2  S3  S4  S5  S6  S7
                                         0, 9,  6,  5,  3,  2,  1,  0)

    def __init__(self):
        self.winning_combs = []
        for wname, wcomb, wmult, wfree in self.WINNING_COMBINATIONS:
            assert len(wcomb) == self.REELS
            tmp = []
            for symb in wcomb:
                if isinstance(symb, int):
                    tmp.append([symb])
                else:
                    tmp.append(list(symb))
            srt = []
            for comb in itertools.product(*tmp):
                comb = list(comb)
                comb.sort()
                comb = tuple(comb)
                if comb not in srt:
                    srt.append(comb)
            srt.sort()
            self.winning_combs.append((wname, tuple(srt), wmult, wfree))
        #pprint.pprint(self.winning_combs)
        self.verify_winning_combinations()

        #self.reels = []
        #self.nstops = []                        # number of stops per reel
        #for rdist in self.REEL_DISTS:
        #    assert len(rdist) == self.SYMBOLS
        #    tmp = []
        #    for sidx, scnt in enumerate(rdist): # symbol index and count
        #        tmp += [sidx] * scnt
        #    self.nstops.append(len(tmp))
        #    self.reels.append(tmp)
        ##pprint.pprint(self.reels)
        #self.ncombs_stops = reduce(operator.mul, self.nstops)

        #self.freespin_reels = []                # real reels with symbols
        #self.freespin_nstops = []               # number of stops per reel
        #for rdist in self.FREESPIN_REEL_DISTS:
        #    assert len(rdist) == self.SYMBOLS
        #    tmp = []
        #    for sidx, scnt in enumerate(rdist): # symbol index and count
        #        tmp += [sidx] * scnt
        #    self.freespin_reels.append(tmp)
        #    self.freespin_nstops.append(len(tmp))
        #self.freespin_ncombs_stops = reduce(operator.mul, self.freespin_nstops)
        ##pprint.pprint(self.freespin_reels)
        ##pprint.pprint(self.freespin_nstops)
        ##pprint.pprint(self.freespin_ncombs_stops)

    # call me when the WINNING_COMBINATIONS changes
    #
    def verify_winning_combinations(self):
        tmp = {}
        for wname, wcombs, wmult, wfree in self.winning_combs:
            for wcomb in wcombs:
                if wcomb in tmp: assert False
                tmp[wcomb] = 1
        #pprint.pprint(tmp)

    def calculate_with_reeltables(self, rtables, chances, freespin_rtables, freespin_chances):
        # freespin tables first
        rdistss = [self.rdists_from_rtable(rtable) for rtable in freespin_rtables]
        FPMEfs = [self.calculate_freespin_FPME(rdists) for rdists in rdistss]
        for tidx, (rdists, FPME) in enumerate(zip(rdistss, FPMEfs)):
            self.print_freespin_FPME(tidx, rdists, FPME)

        FPMEfs = self.calculate_freespin_chances(FPMEfs, freespin_chances)
        self.print_freespin_FPME_chances(FPMEfs, freespin_chances)
        Efs = sum(FPMEfs[0][3]) + sum(FPMEfs[1][3]) # E of 1 freespin

        # spin tables
        rdistss = [self.rdists_from_rtable(rtable) for rtable in rtables]
        FPMEsp = [self.calculate_spin_probability(rdists, Efs) for rdists in rdistss]
        for tidx, (rdists, FPME) in enumerate(zip(rdistss, FPMEsp)):
            self.print_spin_FPME(tidx, rdists, FPME)
        FPMEsp = self.calculate_spin_chances(FPMEsp, chances)
        self.print_spin_FPME_chances(FPMEsp, chances)

    def calculate_freespin_FPME(self, rdists):
        ALL = float(reduce(operator.mul, [sum(rdist) for rdist in rdists]))
        Fline = [self.Combinations(rdists, wcombs) for _, wcombs, _, _ in self.winning_combs]
        Fline = [int(ALL) - sum(Fline)] + Fline
        Pline = [freq / ALL for freq in Fline]
        Mline = [0] + [wmult for _, _, wmult, _ in self.winning_combs]
        Eline = [prob * mult for prob, mult in zip(Pline, Mline)]

        n, k = len(self.FREESPIN_COLLECTION_SYMBOLS), 3
        Ps = nCk(n - 1, k - 1) / nCk(n, k)
        Fcoll = [0] * self.SYMBOLS
        Pcoll = [0.] * self.SYMBOLS
        for rdist in rdists:
            ALL = float(sum(rdist))
            for symb in self.FREESPIN_COLLECTION_SYMBOLS:
                Fcoll[symb] += rdist[symb]
                Pcoll[symb] += rdist[symb] / ALL * Ps
        Mcoll = self.FREESPIN_COLLECTION_PAYOUTS
        Ecoll = [prob * mult for prob, mult in zip(Pcoll, Mcoll)]

        return ((Fline, Pline, Mline, Eline), (Fcoll, Pcoll, Mcoll, Ecoll))

    def calculate_freespin_FPME2(self, rdists):
        line_payout = {}     # { wcomb: wmult }
        for _, wcomb, wmult, _ in self.winning_combs:
            for comb in wcomb:
                line_payout[comb] = wmult
        coll_payout = self.FREESPIN_COLLECTION_PAYOUTS

        payout_result = {}
        for comb in itertools.product(self.FREESPIN_SYMBOLS, repeat=self.REELS):
            occr = reduce(operator.mul, (rdists[ridx][symb] for ridx, symb in zip(range(self.REELS), comb)))
            #print comb, occr, ':'
            comb = list(comb)
            comb.sort()
            comb = tuple(comb)
            line = line_payout.get(comb, 0)
            #coll = [sum(_) for _ in itertools.product(*[(coll_payout[symb] * comb.count(symb), 0) for symb in set(comb) if symb in self.FREESPIN_COLLECTION_SYMBOLS])]
            coll = [sum(_) for _ in itertools.product(*[(coll_payout[symb] * comb.count(symb), 0) for symb in set(comb)])]
            coll = coll * (2 ** self.REELS / len(coll))
            for c in coll:
                #if c + line == 1030: print comb,coll, 111111111111111111111
                payout_result[c+line] = payout_result.setdefault(c+line, 0) + occr
        #pprint.pprint(payout_result)

    def calculate_spin_probability(self, rdists, Efs):
        ALL = float(reduce(operator.mul, [sum(rdist) for rdist in rdists]))
        Fline = [self.Combinations(rdists, wcombs) for _, wcombs, _, _ in self.winning_combs]
        Fline = [int(ALL) - sum(Fline)] + Fline
        Pline = [freq / ALL for freq in Fline]
        Mline = [0] + [wmult + wfree * Efs for _, _, wmult, wfree in self.winning_combs]
        Eline = [prob * mult for prob, mult in zip(Pline, Mline)]
        return (Fline, Pline, Mline, Eline)

    def calculate_freespin_chances(self, FPMEfs, chances):
        assert str(sum(chances)) == '1.0'

        FPMEline = []
        for i in range(len(FPMEfs[0][0])):
            FPMEline.append([sum(map(operator.mul, chances, values)) for values in zip(*(FPME[i] for FPME, _ in FPMEfs))])

        FPMEcoll = []
        for i in range(len(FPMEfs[0][1])):
            FPMEcoll.append([sum(map(operator.mul, chances, values)) for values in zip(*(FPME[i] for _, FPME in FPMEfs))])

        return (tuple(FPMEline), tuple(FPMEcoll))

    def calculate_spin_chances(self, FPMEsp, chances):
        assert str(sum(chances)) == '1.0'

        FPMEline = []
        for i in range(len(FPMEsp[0])):
            FPMEline.append([sum(map(operator.mul, chances, values)) for values in zip(*(FPME[i] for FPME in FPMEsp))])

        return tuple(FPMEline)

    def print_freespin_FPME(self, tidx, rdists, FPMEfs):
        print 'FREESPIN_TABLE_%d LINE PAY' % (tidx)
        FPME = FPMEfs[0]    # line payout
        ALL = float(reduce(operator.mul, [sum(rdist) for rdist in rdists]))
        wnames = ['None'] + [wcombs[0] for wcombs in self.winning_combs]
        print '%-8s%-16s%16s%16s%16s%16s' % ('', '', 'F', 'P', 'M', 'E')
        for widx, (wname, (freq, prob, mult, expt)) in enumerate(zip(wnames, zip(*FPME))):
            print '%-8d%-16s%16d%16f%16d%16f' % (widx, wname, freq, prob, mult, expt)
        print '%-8s%-16s%16d%16f%16s%16f' % ('', '', sum(FPME[0]), sum(FPME[1]), '', sum(FPME[3]))

        print 'FREESPIN_TABLE_%d SYMBOL COLLECTION' % (tidx)
        FPME = FPMEfs[1]      # symbol collection
        print '%-8s%-16s%16s%16s%16s%16s' % ('', '', 'F', 'P', 'M', 'E')
        for sidx, (sname, (freq, prob, mult, expt)) in enumerate(zip(self.SYMBOL_NAMES, zip(*FPME))):
            print '%-8d%-16s%16d%16f%16d%16f' % (sidx, sname, freq, prob, mult, expt)
        print '%-8s%-16s%16d%16f%16s%16f' % ('', '', sum(FPME[0]), sum(FPME[1]), '', sum(FPME[3]))

        Eline = sum(FPMEfs[0][3])
        Ecoll = sum(FPMEfs[1][3])
        print
        print '%-8s%-16s%16s%16s%16s%16f' % ('', '', '', '', '', Eline + Ecoll)
        #print 111111111111111111111, self.E_freespin_by_run(rdists), '(E_freespin_by_run)'
        print

    def print_spin_FPME(self, tidx, rdists, FPMEsp):
        print 'TABLE_%d LINE PAY' % (tidx)
        FPME = FPMEsp
        wnames = ['None'] + [wcombs[0] for wcombs in self.winning_combs]
        print '%-8s%-16s%16s%16s%16s%16s' % ('', '', 'F', 'P', 'M', 'E')
        for widx, (wname, (freq, prob, mult, expt)) in enumerate(zip(wnames, zip(*FPME))):
            print '%-8d%-16s%16d%16f%16f%16f' % (widx, wname, freq, prob, mult, expt)
        print '%-8s%-16s%16d%16f%16s%16f' % ('', '', sum(FPME[0]), sum(FPME[1]), '', sum(FPME[3]))

    def print_spin_FPME_chances(self, FPMEsp, chances):
        assert str(sum(chances)) == '1.0'

        FPME = FPMEsp
        wnames = ['None'] + [wcombs[0] for wcombs in self.winning_combs]
        print 'TABLES LINE PAY with CHANCES of %r' % (chances,)
        print '%-8s%-16s%16s%16s%16s%16s' % ('', '', 'F', 'P', 'M', 'E')
        for widx, (wname, (freq, prob, mult, expt)) in enumerate(zip(wnames, zip(*FPME))):
            print '%-8d%-16s%16f%16f%16f%16f' % (widx, wname, freq, prob, mult, expt)
        print '%-8s%-16s%16d%16f%16s%16f' % ('', '', sum(FPME[0]), sum(FPME[1]), '', sum(FPME[3]))

    def print_freespin_FPME_chances(self, FPMEfs, chances):
        assert str(sum(chances)) == '1.0'

        FPME = FPMEfs[0]
        wnames = ['None'] + [wcombs[0] for wcombs in self.winning_combs]
        print 'FREESPIN_TABLES LINE PAY with CHANCES of %r' % (chances,)
        print '%-8s%-16s%16s%16s%16s%16s' % ('', '', 'F', 'P', 'M', 'E')
        for widx, (wname, (freq, prob, mult, expt)) in enumerate(zip(wnames, zip(*FPME))):
            print '%-8d%-16s%16f%16f%16d%16f' % (widx, wname, freq, prob, mult, expt)
        print '%-8s%-16s%16d%16f%16s%16f' % ('', '', sum(FPME[0]), sum(FPME[1]), '', sum(FPME[3]))

        FPME = FPMEfs[1]
        print 'FREESPIN_TABLES SYMBOL COLLECTION with CHANCES of %r' % (chances,)
        print '%-8s%-16s%16s%16s%16s%16s' % ('', '', 'F', 'P', 'M', 'E')
        for sidx, (sname, (freq, prob, mult, expt)) in enumerate(zip(self.SYMBOL_NAMES, zip(*FPME))):
            print '%-8d%-16s%16f%16f%16d%16f' % (sidx, sname, freq, prob, mult, expt)
        print '%-8s%-16s%16d%16f%16s%16f' % ('', '', sum(FPME[0]), sum(FPME[1]), '', sum(FPME[3]))

        print
        print '%-8s%-16s%16s%16s%16s%16f' % ('', '', '', '', '', sum(FPMEfs[0][3]) + sum(FPMEfs[1][3]))
        print

    def rdists_from_rtable(self, rtable):
        rdists = []
        for reel in rtable:
            rdist = [0] * self.SYMBOLS
            for symb in reel: rdist[symb] += 1
            assert sum(rdist) == rdist[NONE] * 2
            rdists.append(rdist)
        return rdists

    def do_spins(self, nspins):
        wcombs = {}     # { wcomb: wmult }
        for wname, wmult, wcomb in self.winning_combs:
            for comb in wcomb:
                wcombs[comb] = wmult
        bcombs = {}     # { wcomb: #bspins }
        for wname, wmult, wcomb in self.freespin_combs:
            for comb in wcomb:
                bcombs[comb] = wmult

        poff = 0
        for i in range(nspins):
            comb = [random.choice(reel) for reel in self.reels]
            comb.sort()
            comb = tuple(comb)
            poff += wcombs.get(comb, 0)

            bspins = bcombs.get(comb, 0)
            if bspins == 0: continue

            colls = range(1, 7)
            random.shuffle(colls)
            colls = colls[:3]
            for i in range(bspins):
                comb = [random.choice(reel) for reel in self.freespin_reels]
                comb.sort()
                comb = tuple(comb)
                poff += wcombs.get(comb, 0)
                poff += sum(self.FREESPIN_COLLECTION_PAYOUTS[symb] if symb in colls else 0 for symb in comb)

        return (poff) / float(nspins)       # expected value for player

    def count_all(self):
        #counts = [0] * len(self.winning_combs)
        #total = 0
        #for prod in self.product():
        #   total += 1
        #   prod = list(prod)
        #   prod.sort()
        #   prod = tuple(prod)
        #   for widx, (wname, wmult, wcombs) in enumerate(self.winning_combs):
        #       if prod in wcombs:
        #           counts[widx] += 1
        #           break

        #rvalue = 0.
        #for widx, (wname, wmult, wcombs) in enumerate(self.winning_combs):
        #   p = counts[widx] / float(total)
        #   print '%2d: %20s %10d %16f %16f' % (widx, wname, counts[widx], ] / total, counts[widx] / total * wmult)
        pass

    def E_by_run(self):
        wcombs = {}     # { wcomb: widx }
        for widx, (wname, wmult, wcomb) in enumerate(self.winning_combs):
            for comb in wcomb:
                wcombs[comb] = widx

        wbonus = {}     # { wbonus: widx }
        for widx, (wname, wmult, wcomb) in enumerate(self.freespin_combs):
            for comb in wcomb:
                wbonus[comb] = len(self.winning_combs) + widx

        wfreqs = [0] * len(self.winning_combs + self.freespin_combs)   # freqs of winning comb
        for comb in itertools.product(*self.reels):
            comb = list(comb)
            comb.sort()
            comb = tuple(comb)
            if comb in wcombs: wfreqs[wcombs[comb]] += 1
            if comb in wbonus: wfreqs[wbonus[comb]] += 1
        #pprint.pprint(wfreqs)

        wprobs = [float(wfreq) / self.ncombs_stops for wfreq in wfreqs]
        wmults = [wcomb[1] for wcomb in self.winning_combs + self.freespin_combs]

        e_bonus_spin = self.E_bonus_spin_by_run()
        for i in range(len(self.freespin_combs)):
            wmults[len(self.winning_combs) + i] *= e_bonus_spin

        wpoffs = [prob * mult for prob, mult in zip(wprobs, wmults)]

        s = []
        s.append('%-8s%-16s%8s%16s%16s%16s' % ('', 'Name', 'Freq', 'Prob', 'Mult', 'Expected'))
        for i, wcomb in enumerate(self.winning_combs + self.freespin_combs):
            s.append('%-8d%-16s%8d%16f%16f%16f' % (i, wcomb[0], wfreqs[i], wprobs[i], wmults[i], wpoffs[i]))
        s.append('%-8s%-16s%8s%16f%16s%16f' % ('', '', '', sum(wprobs), '',  sum(wpoffs)))
        return '\n'.join(s)

    def E_freespin_by_run(self, rdists):
        wcombs = {}     # { wcomb: wmult }
        for widx, (_, wcomb, wmult, _) in enumerate(self.winning_combs):
            for comb in wcomb:
                wcombs[comb] = wmult

        reels = [reduce(operator.add, [[sidx] * scnt for sidx, scnt in enumerate(rdist)]) for rdist in rdists]
        spins = 0
        pout1 = pout2 = 0
        smpl1 = {}
        smpl2 = {}
        smpl = {}
        N = 0
        for colls in itertools.combinations(self.FREESPIN_COLLECTION_SYMBOLS, self.REELS):
            N += 1
            for comb in itertools.product(*reels):
                spins += 1
                comb = list(comb)
                comb.sort()
                comb = tuple(comb)
                p1 = wcombs.get(comb, 0)
                p2 = sum(self.FREESPIN_COLLECTION_PAYOUTS[symb] for symb in comb if symb in colls)
                pout1 += p1
                pout2 += p2
                smpl1[p1]   = smpl1.setdefault(p1, 0) + 1
                smpl2[p2]   = smpl2.setdefault(p2, 0) + 1
                smpl[p1+p2] = smpl.setdefault(p1+p2, 0) + 1
                #if p1 + p2 == 99: print N, colls, comb, 11111111111111111111111111111111

        spins = float(spins)
        E = (pout1 + pout2) / spins
        mu1, mu2, mu = pout1 / spins, pout2 / spins, (pout1 + pout2) / spins
        sd1 = math.sqrt(sum((p - mu1) ** 2 * c for p, c in smpl1.iteritems()) / spins)
        sd2 = math.sqrt(sum((p - mu2) ** 2 * c for p, c in smpl2.iteritems()) / spins)
        sd  = math.sqrt(sum((p - mu ) ** 2 * c for p, c in smpl.iteritems()) / spins)
        #print 'E_freespin_by_run'
        #print 'mu1=%f, mu2=%f, sd1=%f, sd2=%f, sd=%f, sd1+sd2=%f' % (mu1, mu2, sd1, sd2, sd, sd1+sd2)
        #print 'smpl1'
        #pprint.pprint(smpl1)
        #print 'smpl2'
        #pprint.pprint(smpl2)
        #print 'smpl'

        #pprint.pprint(smpl)
        return E

    def E_by_calc(self):
        wfreqs = [self.Combinations(self.REEL_DISTS, wcomb[2]) for wcomb in self.winning_combs + self.freespin_combs]
        wprobs = [float(wfreq) / self.ncombs_stops for wfreq in wfreqs]
        wmults = [wcomb[1] for wcomb in self.winning_combs + self.freespin_combs]

        e_bonus_spin = self.E_bonus_spin_by_calc()
        for i in range(len((self.freespin_combs))):
                wmults[len(self.winning_combs) + i] *= e_bonus_spin

        wpoffs = [prob * mult for prob, mult in zip(wprobs, wmults)]

        d = 0.  # standard deviation
        e = sum(wpoffs)
        s = []
        s.append('%-8s%-16s%8s%16s%16s%16s' % ('', 'Name', 'Freq', 'Prob', 'Mult', 'Expected'))
        for i, wcomb in enumerate(self.winning_combs + self.freespin_combs):
            s.append('%-8d%-16s%8d%16f%16f%16f' % (i, wcomb[0], wfreqs[i], wprobs[i], wmults[i], wpoffs[i]))
            d += (wmults[i] - e) ** 2 * wfreqs[i]
        d += (0 - e) ** 2 * (self.ncombs_stops - sum(wfreqs))
        d = math.sqrt(d / self.ncombs_stops)
        s.append('%-8s%-16s%8s%16f%16s%16f (d=%f)' % ('', '', '', sum(wprobs), '', e, d))
        return '\n'.join(s)

    # E of one bonus spin by calc
    #
    def E_bonus_spin_by_calc(self):
        # by symbol collection
        E1 = sum(
                sum(
                    map(
                        operator.mul, map(lambda scnt: float(scnt) / nstop, rdist), self.FREESPIN_COLLECTION_PAYOUTS
                    )
                )
                for rdist, nstop in zip(self.FREESPIN_REEL_DISTS, self.freespin_nstops)
            )
        n = len(self.FREESPIN_COLLECTION_SYMBOLS)
        p = nCk(n - 1, 2) / nCk(n, 3)   # P of S to be chosen as a collection symbol
        E1 *= p

        # by payline
        wfreqs = [self.Combinations(self.FREESPIN_REEL_DISTS, wcomb[2]) for wcomb in self.winning_combs]
        wprobs = [float(wfreq) / self.freespin_ncombs_stops for wfreq in wfreqs]
        wmults = [wcomb[1] for wcomb in self.winning_combs]
        wpoffs = [prob * mult for prob, mult in zip(wprobs, wmults)]
        E2 = sum(wpoffs)

        #print 'E_bonus_spin_by_calc', E1, E2
        return E1 + E2

    def Combinations(self, rdists, wcombs):
        return sum(self.Combinations_1(rdists, wcomb) for wcomb in wcombs)

    def Combinations_1(self, rdists, wcomb):
        assert len(rdists) == len(wcomb) == self.REELS
        # S0 < S1 < S2
        #
        # (S0, S0, S0) -> ((S0, 3))
        # (S0, S0, S1) -> ((S0, 2), (S1, 1))
        # (S0, S1, S1) -> ((S0, 1), (S1, 2))
        # (S0, S1, S2) -> ((S0, 1), (S1, 1), (S2, 1))

        s0, s1, s2 = wcomb
        if s0 == s1:
            if s1 == s2:    terms = ((s0, 3),)
            else:           terms = ((s0, 2), (s2, 1))
        else:
            if s1 == s2:    terms = ((s0, 1), (s1, 2))
            else:           terms = ((s0, 1), (s1, 1), (s2, 1))

        return self.Combinations_2(rdists, terms)

    def Combinations_2(self, rdists, terms):

        def combinations(recur, reels, terms, result, temp):
            #print '  ' * recur, 'reels', reels, 'terms', terms, 'temp', temp, 'result', result
            if terms:
                for comb in itertools.combinations(reels, terms[0][1]):
                    combinations(recur + 1, tuple(set(reels) - set(comb)), terms[1:], result, temp + [(reel, terms[0][0]) for reel in comb])
            else:
                result.append(temp)
                #print '  ' * recur, 'result', result

        C = 0
        for reels in itertools.combinations(range(self.REELS), sum(term[1] for term in terms)):
            combs = []
            combinations(0, reels, terms, combs, [])
            #pprint.pprint(combs)
            for comb in combs:
                c = 1
                for reel, symb in comb:
                    #print reel, symb, rdists[reel][symb]
                    c *= rdists[reel][symb]
                C += c
        return C

    def simulate_with_reeltables(self, rtables, chances, freespin_rtables, freespin_chances):
        chances = list(chances)
        for i in range(1, len(chances)): chances[i] += chances[i - 1]

        freespin_chances = list(freespin_chances)
        for i in range(1, len(freespin_chances)): freespin_chances[i] += freespin_chances[i - 1]

        wcombs = {}     # { wcomb: (widx, wmult, wfree) }
        for widx, (_, wcomb, wmult, wfree) in enumerate(self.winning_combs):
            for _ in wcomb: wcombs[_] = (widx + 1, wmult, wfree)

        def select_rtable():
            r = random.random()
            for i, v in enumerate(chances):
                if r < v: break
            return rtables[i]

        def select_freespin_rtable():
            r = random.random()
            for i, v in enumerate(freespin_chances):
                if r < v: break
            return freespin_rtables[i]

        freqs = [0] * (1 + len(self.WINNING_COMBINATIONS))
        nspins = 0
        payout = 0
        nspins_f = 0
        payout_f = 0
        while True:
            nspins += 1
            rtable = select_rtable()
            symbols = [random.choice(reel) for reel in rtable]
            symbols.sort()
            widx, wmult, wfree = wcombs.get(tuple(symbols), (0, 0, 0))
            freqs[widx] += 1
            payout += wmult

            if wfree:
                collection_symbols = list(self.FREESPIN_COLLECTION_SYMBOLS)
                random.shuffle(collection_symbols)
                collection_symbols = collection_symbols[:3]

            for i in range(wfree):
                nspins_f += 1
                rtable = select_freespin_rtable()
                symbols = [random.choice(reel) for reel in rtable]
                symbols.sort()
                widx, wmult, wfree = wcombs.get(tuple(symbols), (0, 0, 0))
                assert wfree == 0
                payout_f += wmult
                payout_f += sum(self.FREESPIN_COLLECTION_PAYOUTS[symbol] for symbol in symbols if symbol in collection_symbols)

            if not (nspins & 0xffffff):
                print (payout + payout_f) / float(nspins), payout_f / float(nspins_f)
                #pprint.pprint(['%f' % (f / float(nspins),) for f in freqs])
                ans = (0.748025, 0.000047, 0.000184, 0.000377, 0.000240, 0.000201, 0.000392, 0.000240, 0.000347, 0.000510, 0.000258, 0.002931, 0.002312, 0.000584, 0.000433, 0.000647, 0.000305, 0.002133, 0.002642, 0.007138, 0.003120, 0.000878, 0.001874, 0.001977, 0.015569, 0.015263, 0.156246, 0.024041, 0.000969, 0.009848, 0.000268)
                #ans = (0.682870, 0.000021, 0.000043, 0.000107, 0.000086, 0.000171, 0.000257, 0.000129, 0.000021, 0.000064, 0.000064, 0.003858, 0.002058, 0.000364, 0.000857, 0.000814, 0.000236, 0.001715, 0.000493, 0.006173, 0.001457, 0.000257, 0.001457, 0.000729, 0.025934, 0.014875, 0.186557, 0.045117, 0.002701, 0.019740, 0.000772)
                assert len(ans) == len(freqs)
                pprint.pprint(map(lambda f, a: '%.2f' % (f / float(nspins) / a), freqs, ans))


    def print_for_ini(self, rtables, chances, freespin_rtables, freespin_chances):

        def tostring(v):
            if type(v) == type(tuple()):
                return ','.join(str(x) for x in v)
            else:
                return str(v)

        print ';'
        print '; DO NOT EDIT. SMC.PY GENERATED.'
        print ';'
        print '[SYMBOL_NAMES]'
        for i, name in enumerate(self.SYMBOL_NAMES):
            print '%d = %s' % (i, name)

        print ';'
        print '; DO NOT EDIT. SMC.PY GENERATED.'
        print ';'
        print '[COLLECTION_SYMBOL_PAYOUT]'
        for symb in self.FREESPIN_COLLECTION_SYMBOLS:
            print '%d = %d' % (symb, self.FREESPIN_COLLECTION_PAYOUTS[symb])

        print ';'
        print '; DO NOT EDIT. SMC.PY GENERATED.'
        print ';'
        print '[WINNING_COMBINATION_PAYOUT]'
        print ';index = S0,S1,S2=Rule,Payout,FreeSpins'
        index = 0
        for wrule, (wname, wcomb, wmult, wfree) in enumerate(self.winning_combs):
            print ';'
            print '; %s'% (wname, )
            for comb in wcomb:
                print '%d = %s=%d,%d,%d' % (index, ','.join(str(x) for x in comb), wrule + 1, wmult, wfree)
                index += 1

        print ';'
        print '; DO NOT EDIT. SMC.PY GENERATED.'
        print ';'
        print '[DISPLAY_PAYTABLE]'
        index = 0
        excludes = [''.join(x) for x in itertools.product(['W', 'S'], ['1', '2'])]
        include = {}
        for wrule, (wname, wcomb, wmult, wfree) in enumerate(self.winning_combs):
            tmp = wname.split()
            if tmp[-1] in excludes: continue
            if wname in include: continue
            if wmult == 0: continue
            include[wname] = True
            print '%d = %-8d ; %s' % (index, wmult, wname)
            index += 1

        print ';'
        print '; DO NOT EDIT. SMC.PY GENERATED.'
        print ';'
        for ti, rt in enumerate(rtables):
            print '[REEL_TABLE_%d]' % (ti,)
            for ri, rl in enumerate(rt):
                print '%d = %s' % (ri, ','.join(str(rs) for rs in rl))

        print ';'
        print '; DO NOT EDIT. SMC.PY GENERATED.'
        print ';'
        for ti, rt in enumerate(freespin_rtables):
            print '[FREE_REEL_TABLE_%d]' % (ti,)
            for ri, rl in enumerate(rt):
                print '%d = %s' % (ri, ','.join(str(rs) for rs in rl))

        print ';'
        print '; DO NOT EDIT. SMC.PY GENERATED.'
        print ';'
        print '[REEL_TABLE_CHANCE_0]'
        for idx in range(10):
            print '%d = %s' % (idx, ','.join(str(int(ch * 100)) for ch in chances[0 if idx < 6 else 1]))

        print '[REEL_TABLE_FREESPIN_CHANCE_0]'
        for idx in range(10):
            print '%d = %s' % (idx, ','.join(str(int(ch * 100)) for ch in freespin_chances[0 if idx < 6 else 1]))

        print '[TOURNAMENT_REEL_TABLE_CHANCE_0]'
        print '0 = %s' % (','.join(str(int(ch * 100)) for ch in chances[-1]))           # the last one = the largest RTP

        print '[TOURNAMENT_REEL_TABLE_FREESPIN_CHANCE_0]'
        print '0 = %s' % (','.join(str(int(ch * 100)) for ch in freespin_chances[-1]))

    def check_reeltables(self, rtables, freespin_rtables):
        for rt in rtables:
            for r in rt:
                even = r[0] == NONE
                for i, s in enumerate(r):
                    assert SCATTER <= s <= NONE
                    if (even and i & 1 == 0) or (not even and i & 1 == 1): assert s == NONE
        for rt in freespin_rtables:
            for r in rt:
                even = r[0] == NONE
                for i, s in enumerate(r):
                    assert WILD <= s <= NONE
                    if (even and i & 1 == 0) or (not even and i & 1 == 1): assert s == NONE



    #def E_of_freespin(self):
    #    # by symbol collection
    #    E1 = sum(
    #            sum(
    #                map(
    #                    operator.mul, map(lambda scnt: float(scnt) / nstop, rdist), self.FREESPIN_COLLECTION_PAYOUTS
    #               )
    #            )
    #           for rdist, nstop in zip(self.FREESPIN_REEL_DISTS, self.freespin_nstops)
    #       )
    #    n = len(self.FREESPIN_COLLECTION_SYMBOLS)
    #    p = nCk(n - 1, 2) / nCk(n, 3)   # P of S to be chosen as a collection symbol
    #    E1 *= p

    #    # by payline
    #    E2 = sum(self.Combinations(self.FREESPIN_REEL_DISTS, combs) / float(self.freespin_ncombs_stops) * mult for _, mult, combs in self.winning_combs)

    #    print 'E_of_freespin', E1, E2
    #    return E1 + E2

if __name__ == '__main__':
    #rt = ReelTable()
    #s1 = rt.E_by_calc()
    #s2 = rt.E_by_run()
    ###assert s1 == s2
    #print s1
    #print s2
    ###rt.print_for_ini()

    #rt.E_bonus_spin_by_calc()
    #rt.E_of_freespin()

REELTABLES = (
		(
			(3,7,0,7,5,7,1,7,5,7,6,7,0,7,5,7,3,7,0,7,5,7,2,7,3,7,2,7,5,7,4,7,5,7,2,7),
			(7,0,7,6,7,1,7,6,7,3,7,0,7,0,7,5,7,5,7,0,7,5,7,3,7,2,7,5,7,5,7,5,7,4,7,0),
			(0,7,0,7,0,7,1,7,6,7,3,7,5,7,0,7,6,7,5,7,5,7,5,7,3,7,2,7,5,7,4,7,4,7,2,7),
		),
		(
			(3,7,2,7,5,7,0,7,2,7,3,7,5,7,5,7,4,7,5,7,1,7,6,7,3,7,2,7,5,7,0,7,1,7,0,7),
			(7,0,7,5,7,0,7,2,7,3,7,5,7,5,7,4,7,5,7,5,7,6,7,3,7,2,7,1,7,0,7,1,7,0,7,0),
			(0,7,0,7,5,7,5,7,2,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,1,7,0,7,4,7,5,7),
		),
		(
			(3,7,6,7,0,7,0,7,2,7,3,7,5,7,5,7,4,7,5,7,6,7,5,7,3,7,2,7,6,7,4,7,1,7,0,7),
			(7,0,7,6,7,0,7,6,7,3,7,5,7,5,7,4,7,5,7,5,7,6,7,3,7,2,7,5,7,4,7,1,7,0,7,6),
			(0,7,6,7,6,7,5,7,2,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,1,7,6,7,1,7,0,7),
		),
		(
			(3,7,3,7,0,7,0,7,3,7,6,7,5,7,5,7,4,7,5,7,4,7,5,7,3,7,2,7,5,7,1,7,6,7,2,7),
			(7,0,7,5,7,0,7,4,7,6,7,5,7,3,7,4,7,5,7,5,7,4,7,3,7,2,7,5,7,1,7,1,7,2,7,0),
			(0,7,3,7,0,7,3,7,4,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,4,7,1,7,2,7,0,7),
		),
		(
			(0,7,0,7,0,7,0,7,3,7,6,7,5,7,5,7,4,7,5,7,4,7,5,7,3,7,2,7,0,7,1,7,6,7,5,7),
			(7,0,7,0,7,0,7,0,7,6,7,5,7,3,7,4,7,5,7,5,7,4,7,3,7,2,7,5,7,1,7,1,7,5,7,0),
			(0,7,0,7,0,7,3,7,4,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,1,7,6,7,2,7,0,7),
		),
		(
			(1,7,1,7,0,7,0,7,3,7,6,7,5,7,5,7,4,7,5,7,4,7,5,7,3,7,2,7,5,7,1,7,6,7,2,7),
			(7,0,7,5,7,0,7,4,7,6,7,5,7,3,7,4,7,5,7,5,7,4,7,3,7,2,7,5,7,1,7,1,7,2,7,0),
			(0,7,1,7,0,7,3,7,4,7,3,7,6,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,1,7,4,7,2,7,0,7),
		),
)
REELTABLES_CHANCES = (
    (0.50, 0.00, 0.40, 0.10, 0.00, 0.00),
    (0.25, 0.00, 0.35, 0.30, 0.10, 0.00),
)


FREESPIN_REELTABLES = (
		(
			(6,7,4,7,5,7,1,7,5,7,6,7,4,7,5,7,3,7,4,7,5,7,2,7,3,7,2,7,5,7,4,7,5,7,6,7),
			(7,6,7,6,7,1,7,6,7,3,7,4,7,4,7,5,7,5,7,4,7,5,7,3,7,2,7,5,7,5,7,5,7,6,7,4),
			(4,7,5,7,6,7,1,7,6,7,3,7,5,7,4,7,4,7,5,7,5,7,5,7,3,7,2,7,5,7,4,7,4,7,6,7),
		),
		(
			(6,7,6,7,5,7,3,7,2,7,3,7,5,7,5,7,4,7,5,7,1,7,6,7,3,7,2,7,5,7,4,7,1,7,2,7),
			(7,6,7,5,7,3,7,2,7,3,7,5,7,5,7,4,7,5,7,5,7,6,7,3,7,2,7,1,7,4,7,1,7,2,7,5),
			(3,7,6,7,5,7,5,7,2,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,1,7,4,7,6,7,5,7),
		),
		(
			(6,7,6,7,5,7,3,7,2,7,3,7,5,7,5,7,4,7,5,7,6,7,5,7,3,7,2,7,5,7,4,7,1,7,2,7),
			(7,6,7,5,7,3,7,5,7,3,7,5,7,5,7,4,7,5,7,5,7,6,7,3,7,2,7,5,7,4,7,1,7,2,7,5),
			(3,7,6,7,5,7,5,7,2,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,1,7,6,7,1,7,5,7),
		),
		(
			(1,7,6,7,5,7,3,7,3,7,3,7,5,7,5,7,4,7,5,7,4,7,5,7,3,7,2,7,5,7,4,7,6,7,2,7),
			(7,6,7,5,7,3,7,4,7,3,7,5,7,3,7,4,7,5,7,5,7,4,7,3,7,2,7,5,7,4,7,1,7,2,7,5),
			(3,7,6,7,5,7,3,7,4,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,4,7,4,7,1,7,6,7),
		),
		(
			(1,7,6,7,5,7,3,7,3,7,3,7,5,7,5,7,4,7,5,7,4,7,5,7,3,7,2,7,5,7,4,7,6,7,2,7),
			(7,6,7,5,7,3,7,4,7,3,7,5,7,3,7,4,7,5,7,5,7,4,7,3,7,2,7,5,7,4,7,1,7,2,7,5),
			(3,7,6,7,5,7,3,7,4,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,4,7,4,7,1,7,6,7),
		),
		(
			(1,7,6,7,5,7,3,7,3,7,3,7,5,7,5,7,4,7,5,7,4,7,5,7,3,7,2,7,5,7,4,7,6,7,2,7),
			(7,6,7,5,7,3,7,4,7,3,7,5,7,3,7,4,7,5,7,5,7,4,7,3,7,2,7,5,7,4,7,1,7,2,7,5),
			(3,7,6,7,5,7,3,7,4,7,3,7,5,7,5,7,4,7,4,7,5,7,2,7,3,7,2,7,4,7,4,7,1,7,6,7),
		),
)
FREESPIN_REELTABLES_CHANCES = (
    (0.15, 0.30, 0.10, 0.25, 0.10, 0.10),
    (0.15, 0.30, 0.10, 0.25, 0.10, 0.10),
)


slot = SMC()
#slot.check_reeltables(REELTABLES, FREESPIN_REELTABLES)

assert len(REELTABLES_CHANCES) == len(FREESPIN_REELTABLES_CHANCES)
for CHANCE in range(len(REELTABLES_CHANCES)):
    print
    print('--------------------------------------------------------------------------------------------------------------')
    print('REELTABLE_CHANCE', REELTABLES_CHANCES[CHANCE], 'FREESPIN_REELTABLE_CHANCE', FREESPIN_REELTABLES_CHANCES[CHANCE])
    print('--------------------------------------------------------------------------------------------------------------')
    print(slot.calculate_with_reeltables(REELTABLES, REELTABLES_CHANCES[CHANCE], FREESPIN_REELTABLES, FREESPIN_REELTABLES_CHANCES[CHANCE]))

#slot.print_for_ini(REELTABLES, REELTABLES_CHANCES, FREESPIN_REELTABLES, FREESPIN_REELTABLES_CHANCES)

#slot.simulate_with_reeltables(REELTABLES, REELTABLES_CHANCES[CHANCE], FREESPIN_REELTABLES, FREESPIN_REELTABLES_CHANCES[CHANCE])
#slot.calculate_freespin_FPME2(slot.rdists_from_rtable(FREESPIN_REELTABLES[0]))
#slot.E_freespin_by_run(slot.rdists_from_rtable(FREESPIN_REELTABLES[0]))
