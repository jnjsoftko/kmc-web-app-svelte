import dotenv from "dotenv";
const { KMC_APP_ROOT } = process.env;

const getEnv = () => {
  dotenv.config({ path: `${KMC_APP_ROOT}/.env` }); // 실행 경로에 있는 `.env`
  return process.env;
};

export { getEnv };