import { ethEnv } from "../../common/constants/config";

export { ethEnv };

// 컨트랙트에 유지할 시드 수
export const NUMBER_OF_SEEDS = 20;

// 컨트랙트의 시드 검사 주기
export const INTERVAL_TO_REGEN_SEEDS = 1000 * 60; // 1min

// 한번에 입력을 시도할 시드 수
export const SEED_CHUNKS = 10;

// Redis 서버 주소
export const REDIS_URL = {
	local: { host: 'redis://localhost:6379', password: undefined },
	npseth: { host: 'redis://eth3.npsdev.cloud:9379', password: 'spdhdnlwmfpeltm123' },
	testnet: { host: 'redis://localhost:6379', password: undefined }
}

// MQ 이름
export const MQNAME = 'dicemq';

// MQ 설정
export const MQCONFIG = {
    redis: {
        redis: REDIS_URL[ethEnv].host,
        auth: REDIS_URL[ethEnv].password,
        options: {
			// see https://github.com/mranney/node_redis#rediscreateclient
		}
	},
    monitor: {
        enabled: true,
        host: '0.0.0.0',
        port: 8080,
    },
};
