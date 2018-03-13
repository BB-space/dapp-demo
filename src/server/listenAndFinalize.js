/* Finalize when InitGame event emitted */
// TODO: seed-hash management in database

import { gameABI, gameAddress } from '../common/constants/contracts';
import { coinbase, privateKey } from './constants/wallets';
import { stringToBytes32 } from '../common/utils';
import { makeSignedTransaction } from './utils';
import { ethEnv } from '../common/constants/config';

const redis = require('redis');
const { promisify } = require('util');



let seedMap = {
	'0xdcaddd55043dce1a34357e873f5fc7ecfcaf2de23127b48ef2bd55172630cb3d': '1',
	'0x81f4bb8774c5c25c60ee666ed91449d0fe77ea15b018c58fca8d9946684d4e7a': '2',
	'0xddcfeeaf0105f9553c30dcd9c7be76a6f3e79728d1d3f3557fa63b5c5b1072eb': '3',
	'0x4a0ed17120ba64749280d002a74d49c966c01cfc2fcc53e72f8a6ca31b9c117b': '4',
	'0x0b61afd541802da7a5a207c71c2fb080011f4c1f7025d70a934a1d32e8d81f3e': '5',
	'0x3a0740360def08efe172f6b246b3c0703f9d448bdd83598eeb942d7d674a18c7': '6',
	'0x2a4704d8074a5b0e1d98009a8c4fd9301358fca5d3b7221f406909f7589d9178': '7',
	'0xbd2f2d1eec3e3c8b6f8aaf2e484b8b29ed19e3de05f2d160c493f0c2b8f84ee4': '8',
	'0xd2f32c45ad4a1f78adb02a09978d1393bf234a6d8d93d153cd2cc27f94101a7c': '9',
	'0x51eb3bd795b165fe617a260aed1c2807d8f2d365ab8fa444c7d53c2968724660': '0',
	'0xdfd1b59a80b362aeb910f35967542e3cac02e57c351ec804b490efd80b627d2f': 'q',
	'0xbe090c2f6e896c4d55578d81bf4ffc420865b09ca37898317f43e0182e3ed7fe': 'w',
	'0xf3796a9b13558a5be4d10932238c862cc18fbec559db6b50273e6174f44d003f': 'e',
	'0xec74de114b90f22c29a1d0e2308c93d90dbfe8ba8d1ac7c1297293bc78ede6d8': 'r',
	'0x24024eb2e36fd80ce65906771d04818f361030b687e5f84cbab7ab0f7489b60f': 't',
	'0x185fe5d267fde94f9f82765e471b37ef330912c412499d4c0d98e6bf01200c80': 'y',
	'0xac354f2cef7078657587a3c647fd2a853222d17550c9ef94a2ab6ad4942fb539': 'u',
	'0xaf2c9ee630c0ccff59e33ed7b8c14ef53db8b1826bcd74a05edbea2e9011b636': 'i',
	'0xdd6889b144b542e3585d1e69aca7ec06432cc10f852693d3733c6522455058c2': 'o',
	'0x50ce6a402fd10277e524902f84758804f74cd6e586a5ead3518f4d34c9bde62c': 'p',
	'0x14f2ae7a302c45ab5cbae57245cb0fc6bcdedabda29bfd5125e2598ffd9f164c': 'a',
	'0x29a41f4fed1a7a054f17b143eafb7651d6c2df769ae46be2bba33721a69023bd': 's',
	'0x389e594dcde303c5925cf51853872c5bea10e5b0cc067564a46ec4c4eaadc1d1': 'd',
	'0x4a3388a4a13a1081011ed63a4793d5efe7c32ed94c43fc65ff849c3442249ee2': 'f',
	'0xe62f3483d65258d4fb50c42e7e296f002a72a48f2426490c0a806936358d36b1': 'g',
	'0xd5efb36f3305a52a0eff2816cdf501a5365625e0eced21947411ca467d43fd10': 'h',
	'0x143a3e1052e7ece865bcc10020722adda395be7bda3fe287caccb2d31f763efe': 'j',
	'0x34c78e86c699b85702d57aa435c605c160c699e1f5eedc8ba3d641305f39ad63': 'k',
	'0xbb8b93870498c2cb288569198b6da636a2b364a074218ce51e7a55d301ba9a76': 'l',
	'0xc8d6e28a678a1339411fb443964a7400ffdc6c12abc7cf5f4841b4aad2868a5b': 'z',
	'0x2bdf9dcc5cc956642f26569c04b0a482427b9c7712dd92ad6528d688700612a9': 'x',
	'0xcc1db05b0ef9a0e08cbe1ae1dd5afbc3548878b661203aabefee96d8e027e2ae': 'c',
	'0x1c2dd395753ce49e7e31a3f07e10083171c31af179e5ab8b917a26f428db7926': 'v',
	'0xe8be74063ad7b17db5ba1581277a4a377b3d5bb79e8fcd6d277ae413dcfa5513': 'b',
	'0x099d28a047667686aaf90f5c328b5bdb9cfd740769461413a45da3184bd06959': 'n',
	'0xca1e471436d429718bd6feaccd49474e70ca4711d726c5b1a7a4eefc6069d0a2': 'm',
	'0xa4ad943aa19e7d5d1bee36290645f0c0bede17abb0990a218ac31fa30cc93562': '11',
	'0x01473de8d2316dc22fdc7eb43493edd8fd47e1299f16abd9ab8556ce5fb4f399': '22',
	'0x78ddede9895db98a33314666d52bc65d2462eef57773c75cfcac39b6b9cd0aa2': '33',
	'0x1c19bb104f70628d53d440edc877beaf3fe34bc3f5c18fa91c4df41e76831946': '44',
	'0xf1db3d3d10459271c30b90a998e5612e927bbcc570fd59a5535a30db11dbec03': '55',
	'0x4955449b17cda2caec9f2a230971f87184eb1149a554dcf52306ca27f471b00b': '66',
	'0x3868f059fba02300bcd1657a443c9e06a8f073a1b9e087a788d24ad12c73e520': '77',
	'0xe485cdc768747614235d9e5e76ff3be1e428db9994c7e10e1dc415ca643cb75f': '88',
	'0xdc35cc40b2830dde431162f93aed6142b0dd3d62d523942ef1dca010e9edd15e': '99',
	'0x844632defc40271aad5a51cf736e71feb2a6704d03a93cc38e7e798266bb0753': '100',
	'0xf02e2f5a0f96d0c6e7613a092db8b036af65be4feb29df084fb8025491d1b910': '111',
	'0x472e324fe0a3d839ff62fb9dac67e3685e0277bbe58a79c3f26693b85f8b5b35': '222',
	'0x9443d5f42d235cc94733a86239ffc70c7ea3c7f3951dafaf70e2feaba69eef15': '333',
	'0xf8f694b41552a53b8e23159c4ba4f30e5b0614a507d11a0d576bf41599bc33f0': '444',
	'0xddbe2f557416d65d5edcd7e2bf325bec1ce67c334d9d30007b7216b24419101a': '555',
	'0xd63050c1c93898c0e2c1748ea657551e5f07cf7ba9a372f89216659fc8ac5e02': '666',
	'0xbe3c3a06b0398f4217b82aa906f81050d27cffd1715b11967d50f3e1abd5d8fa': '777',
	'0xb723c4a35cb79e6533f422391f773106c0841fef54b59543a7f6790aef27a55e': '888',
	'0xedb663271f6c488193646199f3baeae60cf86f0e38cd0a227ef30fd944208922': '999',
	'0x64f5fb02ad4714907fe70ed5d4ec1bb9d739f33989bdf663ab14696a9ce3375f': '1111',
	'0xed82869dd5923005b345d6ddafe495b7dc39d4f1dc2d2c7982aed9d32a4af926': '2222',
	'0x415eea96aa88cfe4d98b9acb53f893afda77badc0ac00fd17e0b909dcf0f548e': '3333',
	'0xcbd7dac9b8017ce3dfc28358c245f1e72e6cef5771628a03a401ab7eee0cdba6': '4444',
	'0x4075bcab80163a12e5960fec04bba9f00c3a8dff4697df3894f955f911584ef3': '5555',
	'0xfec61ba200e7f46a7dbadb771ae6f139428d3bcd1418647a50d58b3b08d409b7': '6666',
	'0x5ae8a47e453f6cc494582e1ad78e239815cbc9e23456efad4b4970e5714c5b26': '7777',
	'0x0d7097da765a109848b76268354ff14482e6b8e12276f8c6b2e64464a47c8d49': '8888',
	'0xa8af9bbaf6f24524cfe01be873e879acdff48bb61e95f27a2209ab05edce14e6': '9999'
};


export default function listenAndFinalize(web3) {
	let gameInstance = new web3.eth.Contract(gameABI, gameAddress);
	
	gameInstance.events.InitGame(async (err, result) => {
		if (err) {
			console.error(err);
		} else {
			const {
				betData,
				dealerHash,
				player,
				playerSeed
			} = result.returnValues;
			const cli = redis.createClient();
			const hgetAsync = promisify(cli.hget).bind(cli, ethEnv);
			const hdelAsync = promisify(cli.hdel).bind(cli, ethEnv);

			console.log('InitGame event has been emitted!!');
			console.log('Dealer Hash:', dealerHash);

			try {
				// const dealerSeed = seedMap[dealerHash];
				const dealerSeed = await hgetAsync(dealerHash);
				if (dealerSeed === undefined || dealerSeed == null) {
					// TODO:
					// 치명적인 에러이므로 처리를 어떻게 할건지 협의 필요
					throw new Error("not found seed:" + dealerHash);
				}
				console.log('Original Seed:', dealerSeed);

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
					console.error(error);
				});
			} catch(e) {
				console.error(e);
			} finally {
				// 트랜잭션 성공 여부와 관계 없이 블록체인 내의 시드는 지워지므로 
				// 서버의 저장값도 여기서 지워버린다.
				console.log('delete hash item:', dealerHash);
				await hdelAsync(dealerHash);
				cli.quit();
			}
		}
	});
}
