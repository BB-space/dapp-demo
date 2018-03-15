import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import serviceWeb3 from  '../../utils/web3';
import { reconstructResult, fromWei } from '../../../common/utils';
import { gameABI, gameAddress } from '../../../common/constants/contracts';
import Dice from '../common/Dice';



export default class Results extends Component {
	static propTypes = {
		initGameTxHash: PropTypes.string,
		hasFailed: PropTypes.bool,
		initTransacted: PropTypes.bool,
		finalized: PropTypes.bool,
		clientSeed: PropTypes.string,
		serverSeed: PropTypes.string,
		hashedServerSeed: PropTypes.string,
		reward: PropTypes.string
	};
	
	constructor(props) {
		super(props);
	}


	getDiceComponent(numbers) {
		return (
			<div className="dice-box validation">
				{ numbers.map((num, idx) => (
					<Dice key={idx} face={num} />
				)) }
			</div>
		);
	}

	render() {
		const {
			initGameTxHash,
			hasFailed,
			initTransacted,
			finalized,
			clientSeed,
			serverSeed,
			hashedServerSeed,
			reward,
			...restProps
		} = this.props;
		
		const result = reconstructResult(serverSeed, clientSeed);

		const waitingElem = (
			<div {...restProps}>
				결과를 받는 중 입니다... <br />
				<a target="_blank" href={`https://rinkeby.etherscan.io/tx/${initGameTxHash}`}>etherscan 에서 확인</a> <br />
				{ initTransacted && <span>(결과 정산 중...)</span> }
			</div>
		);

		const resultElem = (
			<div {...restProps}>
				<ul>
					<li>
						축하합니다. {reward}에 당첨되셨습니다.
					</li>
					<li>
						{ this.getDiceComponent(result) }
					</li>
					<li>
						Client Seed : {clientSeed} <br/>
						Server Seed : {serverSeed} <br/>
						Server Seed (Hashed): {hashedServerSeed}
					</li>
				</ul>
			</div>
		);


		return finalized ? resultElem : waitingElem;
	}
}
