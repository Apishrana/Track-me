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

DEBUG=True
EOF
    echo "backend/.env created/updated"
fi

cd ./backend/
python main.py