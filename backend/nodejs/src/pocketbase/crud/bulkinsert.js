// C:\JnJ-soft\Projects\external\bw-kmc-app\backend\db\pocketbase\sqlite\data.db
// const PocketBase = require("pocketbase");
import PocketBase from "pocketbase";

// Pocketbase 클라이언트 인스턴스 생성
const pb = new PocketBase("http://127.0.0.1:8090");
const collectionName = "txRoomTimers";

// 예제 JSON 데이터
const jsonData = [
  {
    timerId: "timer_1",
    name: "물리치료",
    duration: 900,
    startTime: "2024-05-31T06:01:06.045Z",
    remaining: 711.1179999999854,
    state: "P",
    schedules: [
      {
        name: "물리치료",
        duration: 15,
        state: "N",
      },
      {
        name: "핫팩",
        duration: 15,
        state: "N",
      },
      {
        name: "침",
        duration: 15,
        state: "N",
      },
      {
        name: "온뜸",
        duration: 15,
        state: "N",
      },
    ],
  },
  {
    timerId: "timer_2",
    name: "물리치료",
    duration: 900,
    startTime: "2024-06-03T00:26:04.869Z",
    remaining: 900,
    state: "N",
    schedules: [
      {
        name: "물리치료",
        duration: 15,
        state: "N",
      },
      {
        name: "핫팩",
        duration: 15,
        state: "N",
      },
      {
        name: "침",
        duration: 15,
        state: "N",
      },
      {
        name: "온뜸",
        duration: 15,
        state: "N",
      },
    ],
  },
];

// 데이터 삽입 함수
async function bulkInsert() {
  try {
    // 각 데이터를 컬렉션에 삽입
    for (let data of jsonData) {
      await pb.collection(collectionName).create(data);
    }
    console.log("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

// * bulk insert
bulkInsert();

// // * list
// // const resultList = await pb.collection("txRoomTimers").getList(1, 50, {});
// // console.table(resultList);
// const records = await pb.collection("txRoomTimers").getFullList({
//   sort: "-created",
// });
// console.table(records.map((r) => JSON.stringify(r.schedules[0].duration)));
