/* Finalize when InitGame event emitted */
// TODO: seed-hash management in database

import { gameABI, gameAddress } from '../common/constants/contracts';
import { coinbase, privateKey } from './constants/wallets';
import { stringToBytes32 } from '../common/utils';
import { makeSignedTransaction } from './utils';
import { Redis } from './db/redis';
import { MQ } from './db/redismq';

// 처리 순서:
// Contract -> LISTEN_Q -> FINALIZE_Q -> finalize
const LISTEN_Q = 'ListenQ';
const FINALIZE_Q = 'FinalizeQ';

// Contract Callback
export default function listenAndFinalize(web3) {
	let gameInstance = new web3.eth.Contract(gameABI, gameAddress);
	
	gameInstance.events.InitGame(async (err, result) => {
		if (err) {
			console.error(err);
		} else {
			const {
				serverHash,
				player,
				playerSeed,
				betLines
			} = result.returnValues;
			
			console.log('InitGame event has been emitted!!');
			console.log('Dealer Hash:', serverHash);

			try {
				// 일단 ListenQ에 넣는다.
				await MQ.produce(LISTEN_Q, {
					title: serverHash,
					betLines: betLines,
					dealerHash: serverHash,
					player: player,
					playerSeed: playerSeed
				});
			} catch (e) {
				console.log(e);
			}
		}
	});
}

async function prepareTransaction(job) {
	try {
		var cli = Redis.client;
		var dealerHash = job.data.dealerHash;
		var dealerSeed = await cli.hget(gameAddress, dealerHash);
		if (dealerSeed === undefined || dealerSeed == null) {
			// TODO:
			// 치명적인 에러이므로 처리를 어떻게 할건지 협의 필요
			throw new Error("not found seed:" + dealerHash);
		}
		console.log('Original Seed:', dealerSeed);
		job.data.dealerSeed = dealerSeed;
		await MQ.produce(FINALIZE_Q, job.data);
	} catch (e) {
		console.error(e);
		// 여기에서 발생한 에러는 처리 불가
		// 로그만 남기고 종료한다.
	} finally {
		if (dealerSeed) {
			// 트랜잭션 성공 여부와 관계 없이 블록체인 내의 시드는 지워지므로 
			// 서버의 저장값도 여기서 바로 지워버린다.
			// (어차피 dealerSeed를 넣어서 큐로 보냈으므로 이제 필요 없음)
			console.log('delete hash item:', dealerHash);
			try {
				await cli.hdel(gameAddress, dealerHash);
			} catch (e) {

			}
		}
	}
}

MQ.consume(LISTEN_Q, async (job) => {
	try {
		// finalize 트랜잭션 처리를 위한 준비 작업
		await prepareTransaction(job);
	} catch(e) {
		console.error(e);
		throw e; // Job을 실패처리하고 재시도한다.
	}
});

async function executeFinalizeTransaction(job) {
	let gameInstance = new web3.eth.Contract(gameABI, gameAddress);

	const dealerHash = job.data.dealerHash;
	const dealerSeed = job.data.dealerSeed;

	var cli = Redis.client;

	const txData = gameInstance
		.methods
		.finalize(
			dealerHash,
			stringToBytes32(dealerSeed)
		)
		.encodeABI();

	const nonce = await web3.eth.getTransactionCount(coinbase);

	await makeSignedTransaction(
		coinbase,
		privateKey,
		gameAddress,
		'0',
		nonce,
		txData
	)
	.once('transactionHash', hash => {
		console.log('finalize transaction hash');
		console.log(hash);
	})
	.once('receipt', receipt => {
		console.log('reciept');
		console.log(receipt);
	})
	.on('confirmation', (confNumber, receipt) => {
		console.log('confirmation');
		console.log(confNumber, ':', receipt);
	})
	.on('error', error => {
		console.log('TransactionError', error);
	})
	.catch (error => {
		throw new Error(error);
	});

	console.log('Finalized:' + dealerHash);
}

MQ.consume(FINALIZE_Q, async (job) => {
	try {
		// 큐에서 꺼낸 Job으로 finalize 트랜잭션 처리 
		await executeFinalizeTransaction(job);
	} catch(e) {
		console.error(e);
		throw e; // Job을 실패처리하고 재시도한다.
	}
});

