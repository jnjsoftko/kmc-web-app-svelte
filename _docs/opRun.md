
## Sveltekit Server
```sh
cd {KMC_APP_ROOT}/frontend
frontend$ npm run dev 
```

## Pocketbase Server
```sh
pocketbase serve --dir="{KMC_APP_ROOT}/backend/db/pocketbase/sqlite" --http="localhost:8090"
ROOT/frontend$ npm run dev 
```

## Caddy 실행
```sh
cd {DEV_SETTINGS}/caddy
sudo caddy run
```