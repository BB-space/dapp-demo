/**
 * @file hashGenerator.js
 * Hash generator for server side seed management.
 *
 * 지정된 카운트만큼의 시드 데이터를 유지하기 위한 기능
 */

import { SEED_CHUNKS } from '../../common/constants/config';
import { serviceWeb3 } from '../../app/utils/web3';
import { stringToBytes32 } from '../../common/utils';
import { makeSignedTransaction } from '../utils';
import { gameABI, gameAddress } from '../../common/constants/contracts';
import { coinbase, privateKey } from '../constants/wallets';
import { Redis } from './redis';

const game = new serviceWeb3.eth.Contract(gameABI, gameAddress).methods;

async function calculateItemsToInsert(cli, totalCount) {
    let currentCount = await cli.hlen(gameAddress);
    let itemsToInsert = totalCount - currentCount;
    return itemsToInsert > 0 ? itemsToInsert : 0;
}

async function deleteItems(cli, items) {
    return await cli.hel(gameAddress, items);
}

async function generateNewHashItems(cli, count) {
    // 시드 생성
    // 먼저 redis에 저장을 시도하고, 성공한 시드만 contract에 추가한다.
    // redis에 문제가 없는데 실패했다면 duplicate 이므로 다른 시드를 생성하면 된다.
	let items = [];
	while (count > 0) {
        // TODO:
        // 시드 생성 로직은 협의 후 변경 필요
		const seed = (Math.random() * Math.pow(10, 18)).toFixed().toString(16);

		const hashed = await game.encryptSeeds(stringToBytes32(seed)).call();
		console.log("hashed", seed, ':', hashed);

		if (await cli.hsetnx(gameAddress, hashed, seed)) {
            items.push(hashed);
			count--;
		}
    }

    if (items.length > 0) {
        try {
            // contract 추가 시도
            await pushHashes(items);
            return items.length;
        } catch (e) {
            // 실패할 경우 redis의 데이터도 삭제한다.
            console.error(e);
            let deleted = await deleteItems(cli, items);
            console.log('Deleted count: ', deleted);
            return 0;
        }
    }
}

async function pushHashes(items) {
    const txData = game.pushHashes(items).encodeABI();
    const nonce = await serviceWeb3.eth.getTransactionCount(coinbase);

    await makeSignedTransaction(
        coinbase,
        privateKey,
        gameAddress,
        '0',
        nonce,
        txData
    )
    .once('transactionHash', hash => {
        console.log('pushHashes transaction hash');
        console.log(hash);
    })
    .once('receipt', receipt => {
        console.log('pushHashes reciept');
        console.log(receipt);
    })
    .on('confirmation', (confNumber, receipt) => {
        console.log('pushHashes confirmation');
        console.log(confNumber, ':', receipt);
    })
    .on('error', error => {
        console.error(error);
    })
    .catch (error => {
        throw new Error(error);
    });
}

module.exports = {
    /**
     * @function generate
     * 현재 저장된 시드 수가 지정된 수보다 적을 경우 모자라는 수만큼 새롭게 생성해 저장한다.
     * 
     * @param totalCount number of items to insert
     * @return number of items inserted
     */
	generate : async function(totalCount) {
        // async sleep
        var sleep = function (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        try {
            var cli = Redis.createClient();
            cli.on('connect', function() {
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                console.log('>> connected!!!');
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            })
            await cli.auth();

            let count = await calculateItemsToInsert(cli, totalCount);
            console.log('Items to insert: ', count);

            // 트랜잭션 처리에 시간이 오래 걸리기 때문에 SEED_CHUNKS 크기만큼 끊어서 처리를 시도한다.
            // 실패하면 10초 후 다시 시도, 3번 시도 해도 실패하면 종료하고 다음 턴에서 처리
            let totalInserted = 0;
            for (let retries = 0; count > 0 && retries < 3; ) {
                let chunk = Math.min(SEED_CHUNKS, count);
                let inserted = await generateNewHashItems(cli, chunk);
                if (inserted > 0) {
                    count -= inserted;
                    totalInserted += inserted;
                    console.log('Inserted items: ', inserted);
                } else {
                    retries++;
                    await sleep(1000 * 10);
                }
            }
            return totalInserted;
        } catch (e) {
            console.error(e);
        } finally {
            cli.quit();
        }
    }
};
