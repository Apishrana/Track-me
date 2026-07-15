if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    source venv/bin/activate
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    echo "Unsupported OS"
    exit 1
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
npm start