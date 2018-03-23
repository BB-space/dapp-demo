import Tx from 'ethereumjs-tx';
import { promisify } from 'util';

export function makeSignedTransaction(
	wallet,
	privateKey,
	toAddress,
	valueWei,
	nonce,
	txData=''
) {
	privateKey = new Buffer(privateKey.substring(2), 'hex')

	const rawTx = {
		nonce,
		gasLimit: '0xf4240',  // 1,000,000
		gasPrice: '0x4a817c800',  // 20 gwei
		to: toAddress,
		value: web3.utils.numberToHex(valueWei), // in hex
		data: txData
	}

	const tx = new Tx(rawTx);
	tx.sign(privateKey);
	
	const serializedTx = tx.serialize();

	return web3.eth.sendSignedTransaction(
		'0x' + serializedTx.toString('hex')
	);
}

/*
 * TODO:
 * web3의 getTransactionCount 가 pending transaction 의 수를 알려 주지 못하기 때문에
 * 동시에 여러 트랜잭션을 처리하려고 하면 문제가 발생한다.
 * 우선 pending transaction 수를 geth로 부터 가져올 수 있는 방법이 있는지 찾아서
 * 적용해 봤지만 원하는대로 동작하지 않는 듯 하다...
 * 우선 문제점만 이슈화하고, 추후 메타마스크처럼 자체적으로 트랜잭션 목록을 관리해야 할
 * 것으로 보이는데, 아직은 조금 더 리서치가 필요할 듯...
 */
export async function getNonce(address) {
	let txCount = await web3.eth.getTransactionCount(address);
	let sendRpc = promisify(web3.currentProvider.send).bind(web3.currentProvider);
	let pool = await sendRpc({
		method: "txpool_content",
		params: [],
		jsonrpc: "2.0",
		id: new Date().getTime()
	});
	if (pool && pool.result && pool.result.pending) {
		let pending = pool.result.pending;
		if (pending[address]) {
			console.log('>>> has pending transactions:',  Object.keys(pending[address]).length);
			txCount += Object.keys(pending[address]).length;
		}
	}
	return txCount;
}
