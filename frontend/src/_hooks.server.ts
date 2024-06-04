// src/hooks.server.js
import PocketBase from 'pocketbase';

export async function handle({ event, resolve }) {
	event.locals.pb = new PocketBase('http://localhost:8090');
	const response = await resolve(event);
	return response;
}
