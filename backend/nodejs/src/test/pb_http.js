import PocketBase from 'pocketbase';
const pb = new PocketBase(`http://192.168.0.6:8090`);
// const pb = new PocketBase(`http://localhost:8090`);
const resultList = await pb.collection('users').getList(1, 50, {});
console.log(resultList);