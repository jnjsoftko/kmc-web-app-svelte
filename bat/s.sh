#!/bin/bash
# ~/.zshrc
# KMC_APP_ROOT=/Users/youchan/Dev/Jnj-soft/Projects/external/kmc-web-app-svelte
# DEV_SETTINGS=/Users/youchan/Dev/Jnj-soft/_Settings

# .env 파일 위치 설정
ENV_FILE="../.env"

# 불러올 환경 변수 목록 설정
VARIABLES="VITE_BASE_IP VITE_POCKETBASE_HTTP_PORT"

# .env 파일에서 유효한 설정만 읽어 환경 변수로 설정
while IFS="=" read -r var value; do
    for v in $VARIABLES; do
        if [ "$var" = "$v" ]; then
            export "$var=$value"
        fi
    done
done < "$ENV_FILE"

# 사용할 포트
ports=($VITE_POCKETBASE_HTTP_PORT)

for port in "${ports[@]}"; do
    # 포트 사용 여부 확인
    lsof_output=$(lsof -i :$port)
    if [ -z "$lsof_output" ]; then
        echo "Port $port is not in use."
    else
        echo "Port $port is in use. Attempting to release..."

        # 포트를 사용 중인 프로세스 ID 확인
        pid=$(echo "$lsof_output" | awk 'NR==2 {print $2}')

        # 프로세스 종료
        kill -9 $pid

        # 포트 해제 확인
        lsof_output=$(lsof -i :$port)
        if [ -z "$lsof_output" ]; then
            echo "Port $port has been released."
        else
            echo "Failed to release port $port."
        fi
    fi
done

# pocketbase serve
echo "pocketbase serve --dir='$KMC_APP_ROOT/backend/db/pocketbase/sqlite' --http='localhost:$VITE_POCKETBASE_HTTP_PORT'"
osascript -e 'tell app "Terminal"
    do script "pocketbase serve --dir='$KMC_APP_ROOT/backend/db/pocketbase/sqlite' --http='localhost:$VITE_POCKETBASE_HTTP_PORT'"
end tell' &

# pocketbase http => https
# ![NOTE] 포트 확인: sudo lsof -nP -iTCP:8091 -sTCP:LISTEN
# ![NOTE] 포트 변경시 $DEV_SETTINGS/caddy/Caddyfile 수정 필요
echo "cd '$DEV_SETTINGS/caddy' && sudo caddy run"
osascript -e 'tell app "Terminal"
    do script "cd '$DEV_SETTINGS/caddy' && sudo caddy run"
end tell' &
