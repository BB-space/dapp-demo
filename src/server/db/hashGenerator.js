/**
 * @file 
 * Hash generator for server side seed management.
 *
 * 지정된 카운트만큼의 시드 데이터를 유지하기 위한 기능
 */

import { ethEnv } from '../../common/constants/config';
import { serviceWeb3 } from '../../app/utils/web3';
import { stringToBytes32 } from '../../common/utils';
import { gameABI, gameAddress } from '../../common/constants/contracts';

const redis = require('redis');
const { promisify } = require('util');

async function calculateItemsToInsert(cli, totalCount) {
    const hlenAsync = promisify(cli.hlen).bind(cli, ethEnv);

    let currentCount = await hlenAsync();
    let itemsToInsert = totalCount - currentCount;
    itemsToInsert = 10;
    return itemsToInsert > 0 ? itemsToInsert : 0;
}

async function deleteItems(cli, items) {
    const hdelAsync = promisify(cli.hdel).bind(cli, ethEnv);

    return await hdelAsync(items);
}

async function generateNewHashItems(cli, count) {
    const game = new web3.eth.Contract(gameABI, gameAddress).methods;
    const hsetnxAsync = promisify(cli.hsetnx).bind(cli, ethEnv);

    // 시드 생성
    // 먼저 redis에 저장을 시도하고, 성공한 시드만 contract에 추가한다.
    // redis에 문제가 없는데 실패했다면 duplicate
	let items = [];
	while (count > 0) {
		const seed = (Math.random() * Math.pow(10, 18)).toFixed().toString(16);

        console.log('try to hash', ethEnv, ',', seed);
		const hashed = await game.encryptSeeds(stringToBytes32(seed)).call();
		console.log("hashed", seed, ':', hashed);

		if (await hsetnxAsync(hashed, seed)) {
            items.push(hashed);
			count--;
		}
    }

    if (items.length > 0) {
        try {
            // contract 추가 시도
            await game.pushHashes(items).call();
            return items.length;
        } catch (e) {
            // 실패할 경우 redis의 데이터도 삭제한다.
            console.log('catch', e);
            let deleted = await deleteItems(cli, items);
            console.log('Deleted count: ', deleted);
            return 0;
        }
    }
}

module.exports = {
    /**
     * @function generate
     * 현재 저장된 시드 수가 지정된 수보다 적을 경우 모자라는 수만큼 새롭게 생성해 저장한다.
     * 
     * @param totalCount number of items insert
     * @return number of items inserted
     */
	generate : async function(totalCount) {
        const cli = redis.createClient();
        try {
            let count = await calculateItemsToInsert(cli, totalCount);
            console.log('Items to insert: ', count);

            if (count > 0) {
                var inserted = await generateNewHashItems(cli, count);
                console.log('Newly inserted count: ', inserted);
            }
            return inserted;
        } catch (e) {
            console.log(e);
        } finally {
            cli.quit();
        }
    }
};