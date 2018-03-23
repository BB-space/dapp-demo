import { ethEnv } from "../../common/constants/config";

export { ethEnv };

// 컨트랙트에 유지할 시드 수
export const NUMBER_OF_SEEDS = 20;

// 컨트랙트의 시드 검사 주기
export const INTERVAL_TO_REGEN_SEEDS = 1000 * 60; // 1min

// 한번에 입력을 시도할 시드 수
export const SEED_CHUNKS = 10;

// geth Unix socket
export const SOCK_GETH = '/data/files/chains/geth.ipc';

// Redis 서버 주소
export const REDIS_URL = {
	local: { url: 'redis://localhost:6379', password: undefined },
	npseth: { url: 'redis://eth3.npsdev.cloud:9379', password: 'spdhdnlwmfpeltm123' },
	testnet: { url: 'redis://localhost:6379', password: undefined }
};

export const REDIS_OPTIONS = {
    url: REDIS_URL[ethEnv].url,
    password: REDIS_URL[ethEnv].password,
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
};

// MQ 설정
export const MQCONFIG = {
    redis: {
        prefix: 'q',
        redis: REDIS_OPTIONS.url,
        auth: REDIS_OPTIONS.password,
        options: {
			retry_strategy: REDIS_OPTIONS.retry_strategy
		}
	},
    monitor: {
        enabled: true,
        host: '0.0.0.0',
        port: 8080,
    },
    jobs: {
        attempts: 1,
        concurrency: 5,
        max_age: 1000 * 60 * 60 * 24, // 1 day
        gc_interval: 1000 * 60 * 60,  // 1 hour
    }
};
