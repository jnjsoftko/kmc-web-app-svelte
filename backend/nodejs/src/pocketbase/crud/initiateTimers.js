pocketbase serve --dir="/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte/backend/db/pocketbase/sqlite" --http="localhost:8090"
// pocketbase serve --dir="{APP_ROOT}/backend/db/pocketbase/sqlite" --http="localhost:8090"

import PocketBase from "pocketbase";

// Pocketbase 클라이언트 인스턴스 생성
const pb = new PocketBase("http://localhost:8090");

const collectionName = "txRoomTimers"
const TOTAL_BEDS = 7
const TIMER_UNIT = {
    timerId: "timer_",
    name: "치료대기",
    duration: 900,
    // startTime: "",
    remaining: 900,
    state: "N",
    schedules: []
}

// const objects = [{a_: 11, b:12, c:13}, {a_: 21, b:22, c:23}, {a_: 31, b:32, c:33}]
// const objects2 = [{a: 11, b:12, c:13}, {a: 21, b:22, c:23}, {a: 31, b:32, c:33}]

// map함수를 이용해서 objects를 objects2로 변경하고 싶어요. 즉, 'a_' 키를 'a'로 변경하고 싶어요.

const timers = Array(TOTAL_BEDS).fill().map((v,i)=>i+1).map((v,i)=>({...TIMER_UNIT, timerId: `timer_${i+1}`}))
// console.table(timers)

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
//   bulkInsert({objects: timers, collectionName});

const objects = [{a_: 11, b:12, c:13}, {a_: 21, b:22, c:23}, {a_: 31, b:32, c:33}];

const objects2 = objects.map(obj => {
  const { a_, ...rest } = obj;  // Destructure to extract a_ and the rest of the properties
  return { a: a_, ...rest };    // Create a new object with 'a' instead of 'a_'
});

console.log(objects2);