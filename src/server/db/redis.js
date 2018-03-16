/**
 * @file redis.js
 * Redis wrapper class file
 */

import { ethEnv, REDIS_URL } from '../constants/config';
import RedisClient from 'redis';
import { promisify } from 'util';

/**
 * @class Redis
 * 
 * async/await 에 대응하고, 자체 환경에 맞도록 RedisClient를 Wrapping 한다.
 */
class Redis {
    
    constructor(options) {
        var cli = RedisClient.createClient(options.host, 
            options.password ? { password: options.password } : undefined);
        this.auth_ = promisify(cli.auth).bind(cli);
        this.append_ = promisify(cli.append).bind(cli);
        this.bitcount_ = promisify(cli.bitcount).bind(cli);
        this.bitfield_ = promisify(cli.bitfield).bind(cli);
        this.hlen_ = promisify(cli.hlen).bind(cli);
        this.hget_ = promisify(cli.hget).bind(cli);
        this.hdel_ = promisify(cli.hdel).bind(cli);
        this.hset_ = promisify(cli.hset).bind(cli);
        this.hsetnx_ = promisify(cli.hsetnx).bind(cli);
        this.incr_ = promisify(cli.incr).bind(cli);
        this.incrby_ = promisify(cli.incrby).bind(cli);
        this.decr_ = promisify(cli.decr).bind(cli);
        this.decrby_ = promisify(cli.decrby).bind(cli);
        this.on_ = cli.on.bind(cli);
        this.quit_ = cli.quit.bind(cli);

        cli.on('error', error => {
            // redis 에서 에러가 발생하면 일단 로그만 찍는다.
            // 연결에 성공하면 이후 코드가 실행될 것이므로...
            console.log(error);
        });
        this.client_ = cli;
    }

    get client() {
        return this.client_;
    }

    async auth() {
        if (this.password_) {
            return this.auth_(this.password_);
        }
    }

    async append(...args) {
        return this.append_(...args);
    }

    async bitcount(...args) {
        return this.bitcount_(...args);
    }

    async bitfield(...args) {
        return this.bitfield_(...args);
    }

    async hlen(...args) {
        return this.hlen_(...args);
    }

    async hget(...args) {
        return this.hget_(...args);
    }

    async hdel(...args) {
        return this.hdel_(...args);
    }

    async hset(...args) {
        return this.hset_(...args);
    }

    async hsetnx(...args) {
        return this.hsetnx_(...args);
    }

    async incr(...args) {
        return this.incr_(...args);
    }

    async incrby(...args) {
        return this.incrby_(...args);
    }

    async decr(...args) {
        return this.decr_(...args);
    }

    async decrby(...args) {
        return this.decrby_(...args);
    }

    on(...args) {
        return this.on_(...args);
    }

    quit() {
        this.quit_();
    }

    static createClient(options) {
        return new Redis(options ? options : REDIS_URL[ethEnv]);
    }
}

exports.Redis = Redis;
