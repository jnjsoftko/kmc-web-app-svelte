import { loadJson, saveJson } from "jnj-lib-base";
import { getEnv } from "../../utils/env.js";
import { get, post, patch } from "../../utils/fetch.js";
import { resolvers as patientInfoResolvers } from "../patientInfo/resolvers.js";

// & Variable AREA
// &---------------------------------------------------------------------------
// * APP_ROOT/.env
const { KMC_APP_ROOT, JSONSERVER_ROOT, JSONSERVER_PATIENTS_NEO_FOLDER, VITE_APP_PROTOCOL, VITE_BASE_IP, VITE_JSONSERVER_DAILY_PATIENTS_PORT } = getEnv();

const JSON_DAILY = `${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:${VITE_JSONSERVER_DAILY_PATIENTS_PORT}`;
const JSON_SERVER_PATIENTS_PATH = `${KMC_APP_ROOT}/${JSONSERVER_ROOT}/${JSONSERVER_PATIENTS_NEO_FOLDER}/db.json`;

const FIRST_STATE = "B"; // 접수 상태 코드(Before)
// console.log(JSON_DAILY, JSON_SERVER_PATIENTS_PATH);

// daily data by date
const getPatientDailys = async (date) => {
  return await get({ url: `${JSON_DAILY}/${date}` });
};

const postPatientDailys = async (date, id) => {
  const url = `${JSON_DAILY}/${date}`;
  const data = {
    id,
    state: FIRST_STATE,
    bedNum: 0,
    remark: "",
  };
  // console.log("###postPatientDailys", url, data);
  return await post({ url, data });
};

const patchPatientDailys = async (date, id, data) => {
  const url = `${JSON_DAILY}/${date}/${id}`;
  return await patch({ url, data });
};

export const resolvers = {
  // * Query
  Query: {
    allPatientDailys: async (_source, args) => {
      console.log("allPatientDailys");
      return await getPatientDailys(args.date);
    },
    patientDaily: async (_source, args) => {
      const dailys = await getPatientDaily(args.date);
      return dailys.find((daily) => daily.id == args.id);
    },
  },
  // * Mutation
  Mutation: {
    addPatientDaily: async (_, { input }) => {
      const { date, id } = input;
      const daily = await postPatientDailys(date, id);
      return daily;
    },

    updatePatientDaily: async (_, { input }) => {
      const { date, id, bedNum, state, remark } = input; // input 객체 구조 분해 할당
      const daily = await patchPatientDailys(date, id, { bedNum, state, remark });
      return daily;
    },

    deletePatientDaily(_, args) {
      let daily = {
        ...args.dailyInput,
      };
      const dailys = loadJson(JSON_SERVER_PATIENTS_PATH).filter((_daily) => _daily.title != daily.title && _daily.author != daily.author);
      saveJson(JSON_SERVER_PATIENTS_PATH, dailys);
      return daily;
    },
  },
  Daily: {
    info: async (daily) => {
      // 이 부분은 당신의 API 구조와 데이터베이스에 따라 다를 수 있습니다.
      // 예를 들어, patient 데이터를 찾기 위한 함수나 API 호출 로직을 작성합니다.
      return await patientInfoResolvers.Query.patient(null, { id: daily.id });
    },
  },
};

// const date = "20240527";
// const data = await getPatientDailys(date);
// console.log(data);
