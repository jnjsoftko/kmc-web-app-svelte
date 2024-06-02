import { requestGet } from "jnj-lib-web";
import { getEnv } from '../utils/env.js';

const { DEV_SETTINGS, KMC_APP_ROOT, VITE_BASE_IP, VITE_APP_PROTOCOL, VITE_POCKETBASE_HTTP_PORT, VITE_POCKETBASE_HTTPS_PORT } = getEnv();
const url = `${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:3001/employees`;

const allUsers = async () => {
  const res = await requestGet({ url });
  return res.map((user) => {
    return { name: `${user.firstName} ${user.lastName}`, email: user.email };
  });
};

console.table(await allUsers())