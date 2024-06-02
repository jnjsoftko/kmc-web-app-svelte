import { loadJson, saveJson } from "jnj-lib-base";
import { getEnv } from "../../utils/env.js";
// import { get, post, patch } from "../../utils/fetch.js";

// & Variable AREA
// &---------------------------------------------------------------------------
// * APP_ROOT/.env
const { KMC_APP_ROOT, JSONSERVER_ROOT, VITE_APP_PROTOCOL, VITE_BASE_IP, VITE_JSONSERVER_DAILY_TXS_PORT, JSONSERVER_DAILY_TXS_FOLDER } = getEnv();
const JSON_PATH = `${KMC_APP_ROOT}/backend/db/json/dailyTxs/db.json`;
const JSON_URL = `${VITE_APP_PROTOCOL}://${VITE_BASE_IP}:${VITE_JSONSERVER_DAILY_TXS_PORT}`;

// const JSON_SERVER_PATIENTS_PATH = `${KMC_APP_ROOT}/${JSONSERVER_ROOT}/${JSONSERVER_PATIENTS_NEO_FOLDER}/db.json`;
// console.log(JSON_URL, JSON_SERVER_PATIENTS_PATH);

let allDailyTxs = loadJson(JSON_PATH);

const createDateTxs = (date) => {
  const key = `${date}`;
  if (!(key in allDailyTxs)) {
    allDailyTxs[key] = [];
    saveJson(txsJsonPath, allDailyTxs);
  }
};

const getAllDailyTxs = () => {
  return loadJson(JSON_PATH);
};

const getAllTxsByDate = (date) => {
  return allDailyTxs[date];
  // return await get({ url: `${JSON_URL}/${date}` });
};

// * dailyPatient => filter
const getAllTxsByChartId = (id) => {
  const dailys = getAllDailyTxs();
  let _txs = {};
  for (let [date, txs] of Object.entries(dailys)) {
    for (let tx of txs) {
      if (tx.id == id) {
        _txs[date] = tx.txs;
      }
    }
  }
  return _txs;
};

const getTxsByDateAndChartId = ({ date, id }) => {
  return allDailyTxs[date].find((tx) => tx.id == id).txs;
};

const getLastTxsById = (id) => {
  const allTxs = getAllTxsByChartId(id);
  const dates = Object.keys(allTxs).reverse();
  return allTxs == {} ? [] : allTxs[dates[0]];
  // if (allTxs == {}) {
  //   // console.log(`이전 기록이 없습니다`)
  //   return [];
  // } else {
  //   return date == dates[0] ? allTxs[dates[1]] : allTxs[dates[0]];
  // }
};

//* add, update, delete
const postDailyTxItem = ({ date, id, tx }) => {
  createDateTxs(date);
  const txs = allDailyTxs[date].find((txs) => txs.id == id);
  console.table(txs);

  if (!txs) {
    console.log(`create txs for ${id}:`);
    allDailyTxs[date].push({ id, txs: [tx] });
  } else {
    if (txs.txs.find((_tx) => _tx.name == tx.name)) {
      // 기존에 있으면 변경?
      // console.log("치료 내용이 존재합니다!")
      return {};
    } else {
      // console.log("치료 내용 추가")
      txs.txs.push(tx);
    }
  }
  saveJson(JSON_PATH, allDailyTxs);
  return tx;
};

const postDailyTxs = ({ date, id, txs }) => {
  createDateTxs(date);
  const _txs = allDailyTxs[date].find((txs) => txs.id == id);
  console.table(_txs);

  if (!_txs) {
    // console.log(`create txs for ${id}:`)
    allDailyTxs[date].push({ id, txs });
    saveJson(JSON_PATH, allDailyTxs);
  } else {
    // console.log("치료 내용이 존재합니다!")
    txs = [];
  }
  return txs;
};

// * txItem 덮어쓰기
const patchDailyTxItem = ({ date, id, tx }) => {
  const dailyTxs = allDailyTxs[date].find((txs) => txs.id == id);
  const index = dailyTxs.txs.findIndex((_tx) => _tx.name === tx.name);

  if ("start" in tx) {
    tx.start = tx.start.replaceAll(`"`, "");
  }
  if ("end" in tx) {
    tx.end = tx.end.replaceAll(`"`, ""); // !TODO: end가 있는 경우
  }
  if (index !== -1) {
    dailyTxs.txs[index] = { ...dailyTxs.txs[index], ...tx };
  }

  saveJson(JSON_PATH, allDailyTxs);
  return tx;
};

// * txs([txItem]) 덮어쓰기
const patchDailyTxs = ({ date, id, txs }) => {
  for (let tx of txs) {
    patchDailyTxItem({ date, id, tx });
  }
  return txs;
};

export const resolvers = {
  // * Query
  Query: {
    allTxsByDate: (_, { date }) => {
      return getAllTxsByDate(date);
    },
    allTxsByChartId: (_, { id }) => {
      return getAllTxsByChartId(id);
    },
    txsByDateAndChartId: (_, { date, id }) => {
      return getTxsByDateAndChartId({ date, id });
    },
    lastTxsById: (_, { id }) => {
      return getLastTxsById(id);
    },
  },

  // * Mutation
  Mutation: {
    addDailyTxItem: async (_, { date, id, tx }) => {
      return postDailyTxItem({ date, id, tx });
    },
    addDailyTxs: async (_, { date, id, txs }) => {
      return postDailyTxs({ date, id, txs });
    },
    updateDailyTxItem: async (_, { date, id, tx }) => {
      return patchDailyTxItem({ date, id, tx });
    },
    updateDailyTxs: async (_, { date, id, txs }) => {
      return patchDailyTxs({ date, id, txs });
    },
  },
};

// console.table(getAllTxsByDate("20240528"))
// console.table(getAllTxsByChartId("0000974"))

// """
// 일별 치료 내용 추가 (ex) date: '20240416', id: '0001562')
// """
// addDailyTxItem(input: DailyTxItemInput): TxItem
// """
// 일별 치료 내용 추가 (ex) date: '20240416', id: '0001562')
// """
// addDailyTxs(input: DailyTxsInput): Txs
// """
// 일별 치료 내용 변경 (ex) date: '20240416', id: '0001562')
// """
// # updateDailyPatient(date: String, id: String, bedNum: Int, state: String, remark: String): Daily
// updateDailyTxItem(input: DailyTxItemInput): TxItem
// """
// 일별 치료 내용 변경 (ex) date: '20240416', id: '0001562')
// """
// # updateDailyPatient(date: String, id: String, bedNum: Int, state: String, remark: String): Daily
// updateDailyTxs(input: DailyTxsInput): Txs
// """
// 일별 치료 내용 삭제 (ex) date: '20240416', id: '0001562')
// """
// deleteDailyTxs({date: String, id: String}): Txs

// // * TEST
// const date = "20240528";
// const id = "0000261";
// // const txs = getAllTxsByDate(date);
// const txs = getAllTxsByChartId(id);
// // const txs = getTxsByDateAndChartId(date, id);
// console.table(txs);
