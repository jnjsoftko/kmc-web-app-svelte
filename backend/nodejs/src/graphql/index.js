import fs from "fs";
import path from "path";
import https from "https";
import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import { getEnv } from "../utils/env.js";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { VITE_GRAPHQLSERVER_PORT, DEV_SETTINGS } = getEnv();
// const { DEV_SETTINGS } = getEnv();
// const VITE_GRAPHQLSERVER_PORT = 5006;

// SSL/TLS 인증서 경로
const keyPath = path.resolve(`${DEV_SETTINGS}/mkcert`, "localhost+2-key.pem");
const certPath = path.resolve(`${DEV_SETTINGS}/mkcert`, "localhost+2.pem");

// Express 애플리케이션 생성
const app = express();

// Apollo Server 인스턴스 생성
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 서버를 시작하고 미들웨어를 적용
server.start().then(() => {
  server.applyMiddleware({ app });

  // HTTPS 설정을 위한 옵션
  const httpsOptions = {
    key: fs.readFileSync(keyPath), // 개인 키 파일 경로
    cert: fs.readFileSync(certPath), // 인증서 파일 경로
  };

  // HTTPS 서버 생성
  const httpsServer = https.createServer(httpsOptions, app);

  // HTTPS 서버 시작
  // httpsServer.listen({ port: VITE_GRAPHQLSERVER_PORT }, () =>
  //   console.log(`🚀 Server is running on https://localhost:${VITE_GRAPHQLSERVER_PORT}${server.graphqlPath}`)
  // );

  httpsServer.listen({ port: VITE_GRAPHQLSERVER_PORT, ip: "0.0.0.0" }, () =>
    console.log(`🚀 Server is running on https://0.0.0.0:${VITE_GRAPHQLSERVER_PORT}${server.graphqlPath}`)
  );
});

// const VITE_GRAPHQLSERVER_PORT = 5005;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// const { url } = await startStandaloneServer(server, {
//   listen: { port: VITE_GRAPHQLSERVER_PORT, ip: "0.0.0.0" },
// });

// console.log(`🚀  Server ready at: ${url}`);
