process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import PocketBase from 'pocketbase';
import { loadYaml } from 'jnj-lib-doc';
import { getEnv } from '../utils/env.js';

const { DEV_SETTINGS, KMC_APP_ROOT, VITE_BASE_IP, VITE_APP_PROTOCOL, VITE_POCKETBASE_HTTP_PORT, VITE_POCKETBASE_HTTPS_PORT } = getEnv();
const POCKETBASE_PORT = VITE_APP_PROTOCOL === "https" ? VITE_POCKETBASE_HTTPS_PORT : VITE_POCKETBASE_HTTP_PORT 

const pb = new PocketBase(`${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:${POCKETBASE_PORT}`);

// * SUCCESS
const resultList = await pb.collection('users').getList(1, 50, {});
console.log(resultList);

// * user ![NOTE] ERROR: ClientResponseError 400: Failed to authenticate.
const { email, password } = loadYaml(`${KMC_APP_ROOT}/_settings/app/accounts.yaml`).pocketbase.user;
const authData = await pb.collection('users').authWithPassword(email, password);
console.log(authData);

// // * super-admin SUCCESS
// const { Email, Password } = loadYaml(`${KMC_APP_ROOT}/_settings/app/accounts.yaml`).pocketbase.admin;
// const adminData = await pb.admins.authWithPassword(Email, Password);
// console.log(adminData);