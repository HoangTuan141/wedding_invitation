#!/bin/zsh
# Nháy đúp file này trong Finder để chạy thiệp cưới ở http://localhost:8080
# Đóng cửa sổ Terminal (hoặc bấm Ctrl + C) để dừng.

cd "$(dirname "$0")"
PORT=8080

if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Server đã chạy sẵn ở cổng $PORT, mở trình duyệt..."
  open "http://localhost:$PORT"
  exit 0
fi

IP=$(ipconfig getifaddr en0 2>/dev/null)
echo "💍 Thiệp cưới đang chạy:"
echo "   Máy này:   http://localhost:$PORT"
[ -n "$IP" ] && echo "   Điện thoại (cùng WiFi): http://$IP:$PORT"
echo ""
echo "Đóng cửa sổ này hoặc bấm Ctrl + C để dừng."

(sleep 1 && open "http://localhost:$PORT") &
python3 dev-server.py $PORT
