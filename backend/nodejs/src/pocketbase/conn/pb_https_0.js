process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import PocketBase from 'pocketbase';
import { getEnv } from '../utils/env.js';

const { DEV_SETTINGS, KMC_APP_ROOT, VITE_BASE_IP, VITE_APP_PROTOCOL, VITE_POCKETBASE_HTTP_PORT, VITE_POCKETBASE_HTTPS_PORT } = getEnv();
const POCKETBASE_PORT = VITE_APP_PROTOCOL === "https" ? VITE_POCKETBASE_HTTPS_PORT : VITE_POCKETBASE_HTTP_PORT 

const pb = new PocketBase(`${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:${POCKETBASE_PORT}`);
const resultList = await pb.collection('users').getList(1, 50, {});
console.log(resultList);
