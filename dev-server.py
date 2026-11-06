"""Server chạy thử thiệp cưới ở máy mình.

Khác `python3 -m http.server` ở chỗ: luôn báo trình duyệt KHÔNG lưu cache,
nên sửa config.js / ảnh / CSS xong chỉ cần F5 là thấy ngay.

Chạy: python3 dev-server.py [cổng]   (mặc định 8080)
"""
import http.server
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    http.server.ThreadingHTTPServer(("", port), NoCacheHandler).serve_forever()
