/**
 * @file redismq.js
 * Message Queue 사용을 위한 Wrapper
 * 몇가지 검토하다 최종적으로 Kue 를 사용하는 것으로 결정
 * 
 * TODO:
 * 동시처리를 위한 Concurrency가 1보다 클 경우, attempts 설정을 통한 재시도에 문제가 있는 것으로 보인다.
 * 현재는 attempts를 1로 사용...
 */
import { MQNAME, MQCONFIG, MQOPTIONS } from '../constants/config';
import Redis from './redis';
import url from 'url';
var kue = require('kue');

import { promisify } from 'util';

// Kue 초기화
var options = options || MQCONFIG.redis;
if (typeof options.redis === 'string') {
    var conn = url.parse(options.redis, true);
    options = {
        prefix: options.prefix,
        redis: {
            host: conn.hostname,
            port: conn.port,
            auth: options.auth,
            db: (conn.pathname ? conn.pathname.substr(1) : null) || conn.query.db || 0,
            options: options.options ? options.options : conn.query
        }
    }
}
var queue = kue.createQueue(options);

queue.on('error', err => {
    console.error('Queue error:', err);
});

// function exitHook() {
//     queue.shutdown(5000, function(err) {
//         console.log( 'Kue shutdown: ', err || '' );
//         process.exit(0);
//     });
// }

// process.once('SIGTERM', sig => {
//     exitHook();
// });
// process.once('SIGINT', sig => {
//     exitHook();
// });

// process stuck job
queue.watchStuckJobs(1000);
queue.active(function(err, ids) {
    if (ids) {
        console.log('Stuck jobs:', ids);
        ids.forEach(function(id) {
            kue.Job.get(id, function(err, job) {
                // Your application should check if job is a stuck one
                job.inactive();
            });
        });
    }
});

// Set monitoring page
if (MQCONFIG.monitor.enabled) {
    let name = require('../../../package.json').name;
    kue.app.set('title', name);
    kue.app.listen(MQCONFIG.monitor.port);
}

// clenaup
function cleanupQueue() {
    const now = new Date();
    queue.complete(function(err, ids) {
        ids.forEach(function(id, index) {
            kue.Job.get(id, function(err, job) {
                const created = new Date(parseInt(job.created_at));
                const age = parseInt(now - created);
                if (age > MQCONFIG.jobs.max_age) {
                    console.log('remove outdated job:', job.id);
                    job.remove(() => {});
                }
            });
        });
    });
}
setInterval(cleanupQueue, MQCONFIG.jobs.gc_interval);

/**
 * @class MQ
 * 
 * Message Queue 사용을 위한 정적 객체
 */

class MQ {

    /**
     * 새로운 데이터를 MQ에 저장
     * 
     * @param {*} channel 
     * @param {*} data 
     */
    static async produce(channel, data) {
        return new Promise((resolve) => {
            let job = queue.create(channel, data)
            .attempts(MQCONFIG.jobs.attempts)
            .save(err => {
                if (err) {
                    Promise.reject(err);
                } else {
                    resolve(job);
                }
            });
        });
    }

    /**
     * MQ에 저장된 데이터를 처리하는 핸들러 등록
     * 
     * @param {*} channel 
     * @param {*} handler function (job) { }
     */
    static consume(channel, handler) {
        queue.process(channel, MQCONFIG.jobs.concurrency, function(job, done) {
            handler(job)
            .then(done)
            .catch(done);
        });
    }
}

exports.MQ = MQ;
