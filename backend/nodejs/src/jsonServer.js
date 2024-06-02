/* USAGE
```sh
cd KMC_APP_ROOT
node backend/nodejs/src/jsonServer.js --db=users --port=3001
```
*/
import * as fs from "fs";
import * as https from "https";
import jsonServer from "json-server";
import path from "path";
import { loadJson, saveJson } from "jnj-lib-base";
import { getEnv } from "./utils/env.js";

const { DEV_SETTINGS, KMC_APP_ROOT, JSONSERVER_ROOT } = getEnv();
const JSON_SERVER_BASE_FOLDER = `${KMC_APP_ROOT}/${JSONSERVER_ROOT}`;
console.log(`JSON_SERVER_BASE_FOLDER: ${JSON_SERVER_BASE_FOLDER}`);

// 인증서와 키 파일의 경로 설정
const keyPath = path.resolve(`${DEV_SETTINGS}/mkcert`, "localhost+2-key.pem");
const certPath = path.resolve(`${DEV_SETTINGS}/mkcert`, "localhost+2.pem");

// 커맨드 라인 인자 파싱
const args = process.argv.slice(2).reduce((acc, curr) => {
  const [key, value] = curr.split("=");
  acc[key.replace("--", "")] = value;
  return acc;
}, {});

const dbPath = `${JSON_SERVER_BASE_FOLDER}/${args.db}/db.json` || `${JSON_SERVER_BASE_FOLDER}/daily/db.json`; // 기본값 설정
const port = args.port || 3000; // 기본 포트 설정

console.log(`dbPath: ${dbPath}`);

function getSeoulDate() {
  const seoulDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const dateParts = new Date(seoulDate).toISOString().split("T")[0].split("-");
  return dateParts[0] + dateParts[1] + dateParts[2];
}

const server = jsonServer.create();
const router = jsonServer.router(dbPath); // 동적 경로 사용
const middlewares = jsonServer.defaults();

const options = {
  cert: fs.readFileSync(certPath),
  key: fs.readFileSync(keyPath),
};

server.use(middlewares);
server.use(router);

https.createServer(options, server).listen(port, "0.0.0.0", () => {
  console.log(`JSON Server is running on https://0.0.0.0:${port}`);
});
