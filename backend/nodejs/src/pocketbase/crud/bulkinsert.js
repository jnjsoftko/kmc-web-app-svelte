// C:\JnJ-soft\Projects\external\bw-kmc-app\backend\db\pocketbase\sqlite\data.db
// const PocketBase = require("pocketbase");
import PocketBase from "pocketbase";
import { loadJson } from 'jnj-lib-base'

// Pocketbase 클라이언트 인스턴스 생성
const pb = new PocketBase("http://localhost:8090");
const paitentsPath = "/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte/backend/db/jsonserver/patientsNeo/db.json";
const dailyPaitentsPath = "/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte/backend/db/jsonserver/dailyPatients/db.json";
// const collectionName = "patients";
const collectionName = "dailyPatients";

let patients = loadJson(paitentsPath).all;
patients = patients.map(patient => {
  const { id, txCount, ...rest } = patient;  // Destructure to extract a_ and the rest of the properties
  return { chartId: id, count: txCount, ...rest };    // Create a new object with 'a' instead of 'a_'
});
// console.table(patients.slice(0,2))


const dailyPaitents = loadJson(dailyPaitentsPath)
// console.table(dailyPaitents)
let dailyPTs = [];
for (let [date, _dailyPaitents] of Object.entries(dailyPaitents)) {
  for (let _dailyPaitent of _dailyPaitents) {
    const { id, state, bedNum, remark } = _dailyPaitent;
    dailyPTs.push({date, chartId: id, state, bedNum, remark});
  }
}

// {
//   "id": "0000663",
//   "state": "S",
//   "bedNum": 0,
//   "remark": ""
// }

// 데이터 삽입 함수
async function bulkInsert({objects, collectionName}) {
  try {
    // 각 데이터를 컬렉션에 삽입
    for (let obj of objects) {
      await pb.collection(collectionName).create(obj);
    }
    console.log("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

// * bulk insert
// bulkInsert({objects: patients, collectionName});
console.table(dailyPTs.slice(0,2))
bulkInsert({objects: dailyPTs, collectionName});
// // * list
// // const resultList = await pb.collection("txRoomTimers").getList(1, 50, {});
// // console.table(resultList);
// const records = await pb.collection("txRoomTimers").getFullList({
//   sort: "-created",
// });
// console.table(records.map((r) => JSON.stringify(r.schedules[0].duration)));
