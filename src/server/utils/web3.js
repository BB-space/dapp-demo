/**
 * @file web3.js
 * 
 * web3 객체 관리를 위한 구현 파일
 * 제대로 singleton을 구현한건 아니고, 편의상 그냥 global 객체에 넣어 둔다.
 * 향후 개선 필요
 */
import Web3 from 'web3';
import { nodeUrl } from '../../common/constants/config';
import { SOCK_GETH } from '../constants/config';
import net from 'net';
import fs from 'fs';

var connectionCallback;

console.log('>>> ether node URL:', nodeUrl);

/*
* IPC를 기본으로, Unix Socket 이 없을 경우만 WebSocket으로 연결한다.
*/
var retries = 0;
var reconnectionWaiting = false;
function createWeb3() {
    let wsp;
    if (fs.existsSync(SOCK_GETH)) {
        console.log('create IPC channel:', SOCK_GETH);
        wsp = new Web3.providers.IpcProvider(SOCK_GETH, net);
    } else {
        console.log('create websocket channel:', nodeUrl);
        wsp = new Web3.providers.WebsocketProvider(nodeUrl);
    }

    let rct = [0, 10, 10, 10, 30, 30, 30, 30, 60];

    function createNewWeb3Instance() {
        if (reconnectionWaiting)
            return;
        reconnectionWaiting = true;
        wsp.removeAllListeners();
        setTimeout(() => {
            console.log('>>> try to reconnect Web3');
            reconnectionWaiting = false;
            global.web3 = createWeb3();
        }, 1000 * rct[Math.min(retries++, rct.length)]);
    }

    //
    // 현재의 Web3-provider 의 이벤트 구현은 아래와 같다.
    // - data : on을 통해 복수의 핸들러를 등록할 수 있다.
    // - connect : on을 통해 하나의 핸들러만 등록할 수 있는데, 내부에는 핸들러가 없으므로 여기서 등록해 사용해도 된다.
    // - end : on을 통해 하나의 핸들러만 등록할 수 있는데, 여기서 사용해 버리면 내부의 기본 핸들러(onclose)가 무시된다.
    //         onclose의 기능은 등록된 data 핸들러들에게 e 객체를 전달하는 것이다.
    //         그러므로, data 핸들러에서 e 객체를 검사하면 일단 end 이벤트(close)에 대해서는 대응이 가능하다.
    // - error : on을 통해 하나의 핸들러만 등록할 수 있는데, 여기서 사용해 버리면 내부의 기본 핸들러(onclose)가 무시된다.
    //           기본 기능은 내부의 _timeout 함수를 호출하는 것이고, 이 이벤트는 end와 달리 data 핸들러로 전달해 주지 않는다.
    //
    // ※ 주의
    // 이 기능은 문서화 되어 있지 않다. 소스코드를 통해 분석한 내용이므로 추후 얼마든지 변경될 수 있다.
    // Web3 라이브러리 업데이트 후에는 구현 변경 여부를 필히 확인해야 한다!!!
    //
    // ※ 주의
    // 현재의 구현은 연결이 정상적으로 끊어진 경우에 대해서는 대처가 가능하지만,
    // 비정상적인 오류에 대해서는 대처가 불가능하다. (Websocket의 ping pong 기능이 구현되어 있지 않은 듯)
    // 안정성을 위해 서버에서는 IPC 를 사용하도록 한다.
    // 
    wsp.on('connect', () => {
        console.log('Web3 socket connected!!!');
        retries = 0;
        if (connectionCallback) {
            try {
                connectionCallback();
            } catch (e) {
                console.error(e);
            }
        }
    })
    wsp.on('data', (e) => {
        if (e) {
            console.log('WS-closed');
            // 연결이 종료된 경우
            // 이 경우는 에러가 아니라고 볼 수도 있지만 keepalive 시간이 지나면
            // 연결이 끊어질 수 있기 때문에 재연결 처리를 해야 한다.
            // 문제는 트랜잭션 처리 도중에 이 이벤트가 발생하는 경우인데...
            // 현재 시점에서는 어떻게 동작할지 알 수 없다.
            createNewWeb3Instance();
        }
    })
    // 현재까지 파악된 바로는 에러가 발생하면 error 와 end 이벤트가 모두 발생하기 때문에
    // 특별히 여기에 처리를 넣을 필요는 없어 보인다. (그래서 이 이벤트를 data 핸들러로 전달하지 않는 듯...)
    // wsp.on('error', e => {
    //     console.error('WS-Error:', e);
    //     wsp._timeout();
    //     createNewWeb3Instance();
    // })
    return new Web3(wsp);
}

exports.Web3 = Web3;
exports.createGlobalWeb3 = function() {
    global.web3 = createWeb3();
}
exports.registConnectionCallback = function(f) {
    connectionCallback = f;
}
