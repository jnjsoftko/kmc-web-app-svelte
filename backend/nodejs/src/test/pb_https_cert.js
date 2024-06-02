
import fs from 'fs';
import https from 'https';
import PocketBase from 'pocketbase';
import { loadFile } from 'jnj-lib-base';
import { loadYaml } from 'jnj-lib-doc';
import { getEnv } from '../utils/env.js';
import path from 'path';

const caPath = path.resolve('/Users/youchan/Library/Application Support/mkcert/rootCA.pem'); // mkcert -CAROOT로 찾은 경로를 사용
const CA_PATH = '/Users/youchan/Library/Application Support/mkcert/rootCA.pem';


const { DEV_SETTINGS, KMC_APP_ROOT, VITE_BASE_IP, VITE_APP_PROTOCOL, VITE_POCKETBASE_HTTP_PORT, VITE_POCKETBASE_HTTPS_PORT } = getEnv();
const POCKETBASE_PORT = VITE_APP_PROTOCOL === "https" ? VITE_POCKETBASE_HTTPS_PORT : VITE_POCKETBASE_HTTP_PORT 

const agentOptions = {
    // ca: loadFile(CA_PATH),
    ca: fs.readFileSync(caPath),
};


const agent = new https.Agent(agentOptions);

const pb = new PocketBase(`https://localhost:8091`, {
    httpAgent: agent,
});

// const pb = new PocketBase(`https://127.0.0.1:8091`, {
//     httpAgent: agent,
// });

// const pb = new PocketBase(`https://192.168.0.6:8091/`, {
//     httpAgent: agent,
// });

// // `https://localhost:8091`는 되는데, `https://192.168.0.6:8091`는 에러가 발생하네요.

// 현재 `http://192.168.0.6:8090`는 nodejs로 접근이 가능합니다.

// 웹(브라우저)으로는 `https://192.168.0.6:8091/_/`가 접속됩니다.


// console.table(pb)

// (async () => {
//     try {
//         const resultList = await pb.collection('users').getList(1, 50, {});
//         console.log(resultList);
//     } catch (err) {
//         console.error(err);
//     }
// })();


// const pb = new PocketBase(`${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:${POCKETBASE_PORT}`);
// console.log(pb.baseUrl)

// const pb = new PocketBase(`${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:${POCKETBASE_PORT}`, {
//     httpAgent: agent,
// });

const resultList = await pb.collection('users').getList(1, 50, {});
console.log(resultList);

// (async () => {
//     try {
//         const resultList = await pb.collection('users').getList(1, 50, {});
//         console.log(resultList);
//     } catch (err) {
//         console.error(err);
//     }
// })();

// const resultList = await pb.collection('users').getList(1, 50, {});
// console.log(resultList);
// const { email, password } = loadYaml(`${KMC_APP_ROOT}/_settings/app/accounts.yaml`).pocketbase.admin;
// console.log(email, password);

// const authData = await pb.collection('users').authWithPassword(
//     email,
//     password,
// );

// // fetch a paginated records list
// const resultList = await pb.collection('users').getList(1, 50, {
//     filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
// });

// // you can also fetch all records at once via getFullList
// const records = await pb.collection('users').getFullList({
//     sort: '-created',
// });

// // or fetch only the first record that matches the specified filter
// const record = await pb.collection('users').getFirstListItem('someField="test"', {
//     expand: 'relField1,relField2.subRelField',
// });

// // list and filter "example" collection records
// const result = await pb.collection('example').getList(1, 20, {
//     filter: 'status = true && created > "2022-08-01 10:00:00"'
// });

// authenticate as auth collection record
// const userData = await pb.collection('users').authWithPassword(email, password);

// // or as super-admin
// const adminData = await pb.admins.authWithPassword(email, password);

// and much more...