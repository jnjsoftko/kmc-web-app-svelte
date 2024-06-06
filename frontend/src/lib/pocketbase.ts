// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// const url = `http://localhost:8090`;
const url = `https://192.168.0.6:8091`;
console.log(`url: ${url}`);
import { onMount, onDestroy } from 'svelte';
import PocketBase from 'pocketbase';

const PB = new PocketBase(url);

export { PB };