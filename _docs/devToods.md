- [X] # pocketbase http

- [X] ## git branch

```sh
cd APP_ROOT

git checkout dev
# 포켓베이스 환경 구현
git branch feature/pocketbase
git checkout feature/pocketbase
```

- [X] ## pocketbase [backend]
- [X] ### pocketbase 설치

> https://pocketbase.io/docs/

- [X] ### data.db 복사(기존 설정된 파일)
    - `$KMC_APP_ROOT/backend/db/pocketbase/sqlite/data.db`
    - admin id/pw
    - Auth providers: google

    """
    {APP_ROOT}/backend/db/pocketbase/sqlite/data.db
    """

- [X] ### pocketbase serve
```sh
pocketbase serve --dir="{APP_ROOT}/backend/db/pocketbase/sqlite" --http="localhost:8090"

├─ REST API: http://localhost:8090/api/
└─ Admin UI: http://localhost:8090/_/
```

- [X] ## `.env`

- [X] ## `/bat/s.sh`

- [X] ## chmod
```sh
cd APP_ROOT/bat
chmod +x ./s.sh

./s.sh
```

- [X] ## browser

"""
http://192.168.0.6:8090/_/

/~settings/app/accounts.yaml
"""

- [X] # pocketbase https(macOS)

- [X] ## caddy 설치
```sh
brew install caddy
```

- [X] ## Caddyfile

- `/Users/youchan/Dev/Jnj-soft/_Settings/caddy/Caddyfile`
```
https://localhost:8091, https://192.168.0.6:8091 {
    tls /Users/youchan/Dev/Jnj-soft/_Settings/mkcert/localhost+2.pem /Users/youchan/Dev/Jnj-soft/_Settings/mkcert/localhost+2-key.pem
    reverse_proxy localhost:8090
}
```

- [X] ## Caddy 실행
```sh
cd /Users/youchan/Dev/Jnj-soft/_Settings/caddy
sudo caddy run
```

* 포트(8091)가 구동중인지 확인
```sh
sudo lsof -nP -iTCP:8091 -sTCP:LISTEN
```

- [X] ## browser

"""
https://192.168.0.6:8091/_/

moondevnode@gmail.com
A********!
"""

- [X] ## `sudo caddy run` 실행시 암호 물어보지 않도록 설정
```sh
sudo visudo
```

> 파일 맨 밑에 아래 내용추가
    * /opt/homebrew/bin/caddy <= `which caddy`

```
youchan ALL=(ALL) NOPASSWD: /opt/homebrew/bin/caddy
```

- [!] ## Caddyfile 파일 없이 명령행에서 `sudo caddy run`을 설정 포함 실행
  - AI(chatGPT, claud.ai, gemini)에게 질의하여 여러 시도를 하였으나 전부 실패

=====

- [X] # install sveltekit [frontend]

```sh
cd {APP_ROOT}
npm create svelte@latest frontend
```

"""
◇  Which Svelte app template?
│  Skeleton project
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◇  Select additional options (use arrow keys/space bar)
│  Add ESLint for code linting, Add Prettier for code formatting
│
└  Your project is ready!

Next steps:
  1: cd frontend
  2: npm install
  4: npm run dev -- --open
"""

=====

- [X] # install project(macOS)

- [X] ## 환경 변수 설정(macOS)
> ~/.zshrc
```
export KMC_APP_ROOT="/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte"
```

```sh
source ~/.zshrc
```

- [X] ## create project
```sh
# github
cd /Users/youchan/Dev/Jnj-soft/Projects/external
# create remote repository & git clone
github -u jnjsoftko -n kmc-web-app-svelte -e initRepo
cd kmc-web-app-svelte
```

- [X] ## git branch

```sh
cd /Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte

# git branch dev(개발)
git branch dev
git checkout dev
```

- [X] ### edit files
> `.gitignore`
> `.env`
> _docs/devTodos.md
