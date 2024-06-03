import fs from 'fs';
import https from 'https';
import PocketBase from 'pocketbase';
import path from 'path';

const caPath = path.resolve('/Users/youchan/Library/Application Support/mkcert/rootCA.pem');

const agentOptions = {
    ca: fs.readFileSync(caPath),
};

const agent = new https.Agent(agentOptions);

const pb = new PocketBase('https://localhost:8091', {
    httpAgent: agent,
});

(async () => {
    try {
        const resultList = await pb.collection('users').getList(1, 50, {});
        console.log(resultList);
    } catch (err) {
        console.error(err);
    }
})();