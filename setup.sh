python3 -m venv venv
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    source venv/bin/activate
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    echo "Unsupported OS"
    exit 1
fi

pip install --upgrade pip
pip install -r requirements.txt

if [[ ! -f backend/.env ]] || \
   ! grep -q "^FIREBASE_CREDENTIALS=" backend/.env || \
   ! grep -q "^DEBUG=" backend/.env || \
   ! grep -q "^SUPABASE_URL=" backend/.env || \
   ! grep -q "^SUPABASE_KEY=" backend/.env || \
   ! grep -q "^BACKEND_HOST=" backend/.env || \
   ! grep -q "^BACKEND_PORT=" backend/.env; then
cat > backend/.env <<EOF
# Supabase
SUPABASE_URL=Use Your Url
SUPABASE_KEY=Use Your Key

# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Auth
SECRET_KEY=Generate A Key Using `openssl rand -hex 32`
ALGORITHM=HS256
TOKEN_EXPIRATION_TIME_MINUTS=525600

# Firebase
FIREBASE_CREDENTIALS=Use Your firebase.json

DEBUG=True
EOF
    echo "backend/.env created/updated"
fi

if [[ ! -f App/.env ]] || \
   ! grep -q "^EXPO_PUBLIC_BACKEND_URL=" App/.env || \
   ! grep -q "^EXPO_PUBLIC_MAPTILER_KEY=" App/.env; then
cat > App/.env <<EOF
EXPO_PUBLIC_BACKEND_URL=http://0.0.0.0:8000
EXPO_PUBLIC_MAPTILER_KEY=your_key_here
EOF
    echo "App/.env created/updated"
fi


(
    cd ./backend || exit 1
    exec python main.py
) &
BACKEND_PID=$!

trap '
kill -TERM $BACKEND_PID 2>/dev/null
pkill -P $BACKEND_PID 2>/dev/null
wait $BACKEND_PID 2>/dev/null
' EXIT INT TERM

cd ./app || exit 1
npm install && npm start