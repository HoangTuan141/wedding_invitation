# 💍 Thiệp cưới online

Website thiệp cưới một trang, phong cách editorial tối giản. Chỉ dùng HTML, CSS và JS thuần, không cần cài đặt gì.

## Cấu trúc

```
wedding-invitation/
├── index.html              ← bố cục trang + chú thích vị trí từng ảnh (tìm 📷)
├── css/style.css           ← giao diện (đổi màu ở :root đầu file)
├── js/config.js            ← ✏️ TÊN, NGÀY GIỜ, ĐỊA ĐIỂM, SỐ TÀI KHOẢN... sửa ở đây
├── js/main.js              ← logic (không cần sửa)
├── images/                 ← 📷 đặt ảnh vào đây (danh sách: images/README.md)
├── music/song.mp3          ← 🎵 nhạc nền
└── google-apps-script.js   ← code lưu RSVP vào Google Sheets (tùy chọn)
```

## Bắt đầu

1. Mở `index.html` bằng trình duyệt để xem thử. Khung ảnh nào trống sẽ hiện tên file cần thêm.
2. Sửa thông tin trong **`js/config.js`**.
3. Sửa phần **Chuyện tình yêu** (ngày, tiêu đề, nội dung) trực tiếp trong `index.html`.
4. Đặt ảnh vào `images/` theo đúng tên (xem `images/README.md`).
5. Đặt nhạc vào `music/song.mp3`.

## Các phần của thiệp

Màn mở thiệp (kèm tên khách) → Ảnh bìa → Lời mời của hai gia đình + đếm ngược → Cô dâu & chú rể → Chuyện tình yêu → Dải ảnh trích dẫn → Lịch + sự kiện + bản đồ + dress code → Album (bấm để phóng to) → Xác nhận tham dự + sổ lưu bút → Hộp mừng cưới (QR) → Lời cảm ơn.

## Link riêng cho từng khách

Thêm `?to=Tên khách` vào cuối link, màn hình mở thiệp sẽ hiện *"Trân trọng kính mời [Tên khách]"*:

```
https://ten-mien-cua-ban.com/?to=Anh Minh & Chị Lan
```

(Zalo/Messenger tự mã hoá dấu cách và tiếng Việt, cứ dán bình thường.)

## Lưu xác nhận tham dự vào Google Sheets (tùy chọn)

Nếu không cấu hình bước này, lời chúc chỉ lưu tạm trên máy của từng khách và bạn sẽ **không** nhận được.

1. Tạo một Google Sheet mới → menu **Tiện ích mở rộng → Apps Script**.
2. Xoá code mẫu, dán toàn bộ nội dung file `google-apps-script.js`, rồi bấm Lưu.
3. Bấm **Triển khai → Tùy chọn triển khai mới** → chọn loại **Ứng dụng web**:
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
4. Bấm Triển khai, cấp quyền, rồi copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
5. Dán URL vào `rsvpEndpoint: '...'` trong `js/config.js`.

Từ đó mọi xác nhận sẽ nằm trong sheet `RSVP`, và sổ lưu bút hiển thị lời chúc của tất cả mọi người.

## Đưa thiệp lên mạng (miễn phí)

- **Netlify Drop** (dễ nhất): vào https://app.netlify.com/drop rồi kéo thả cả thư mục `wedding-invitation` vào. Bạn có link ngay.
- **Vercel** hoặc **GitHub Pages**: đẩy thư mục lên GitHub rồi bật Pages.
- Có link rồi thì đổi `og:image` trong `index.html` thành đường dẫn đầy đủ, để ảnh xem trước hiện khi gửi qua Zalo/Facebook.

## Tuỳ biến nhanh

- **Đổi tông màu:** sửa `--accent`, `--bg`... ở đầu `css/style.css`. Ví dụ tông xanh sage: `--accent: #7C8C74; --accent-2: #B5C0AC; --accent-soft: #E6EBE1;`
- **Tắt cánh hoa rơi:** đặt `petals: false` trong `config.js`.
- **Thêm/bớt ảnh album:** copy hoặc xoá một dòng `<figure class="g ...">` trong `index.html`.
- **Thêm/bớt sự kiện:** thêm hoặc xoá một khối `{ ... }` trong mục `events` của `config.js`.
