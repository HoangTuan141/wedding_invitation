/* =====================================================================
   CẤU HÌNH THIỆP CƯỚI
   ---------------------------------------------------------------------
   👉 Phần lớn nội dung (tên, ngày giờ, địa điểm, số tài khoản...) nằm ở
      file này. Sửa xong chỉ cần lưu lại và tải lại trang (F5).
   👉 Ảnh thì đặt vào thư mục /images theo đúng tên ghi trong index.html
      (xem danh sách đầy đủ ở images/README.md).
   ===================================================================== */

window.WEDDING = {
  /* ---------- CHÚ RỂ ---------- */
  groom: {
    short: 'Anh Tuấn',                       // Tên gọi ngắn — hiện ở bìa, tiêu đề lớn
    full: 'Hoàng Anh Tuấn',                // Họ tên đầy đủ
    role: 'Trưởng nam',                  // Trưởng nam / Thứ nam / Út nam...
    father: 'Hoàng Đăng Mẫn',               // Tên bố (đã có sẵn chữ "Ông" phía trước)
    mother: 'Nguyễn Thị Tỉnh',            // Tên mẹ (đã có sẵn chữ "Bà" phía trước)
    address: 'Nam Đồ Sơn, Hải Phòng',
    bio: 'Một chàng trai trầm tính, mê cà phê sáng và những chuyến đi xa. Người luôn tin rằng điều tuyệt vời nhất đời mình là được gặp em.',
  },

  /* ---------- CÔ DÂU ---------- */
  bride: {
    short: 'Yến Nhi',
    full: 'Trần Yến Nhi',
    role: 'Út nữ',
    father: 'Trần Gia Cảnh',
    mother: 'Nguyễn Thị Nguyệt',
    address: 'Khương Đình, Hà Nội',
    bio: 'Cô gái yêu hoa, yêu nắng và hay cười. Người đã khiến những ngày bình thường của anh trở nên đặc biệt hơn bao giờ hết.',
  },

  monogram: ['T', 'N'],                  // 2 chữ cái viết tắt hiện ở logo/màn mở thiệp
  city: 'Hà Nội',
  hashtag: '#TuanNhiWedding',

  /* ---------- ẢNH BÌA (SLIDE CHẠY VÔ TẬN) ----------
     📷 Điền bao nhiêu ảnh tùy ý, theo đúng thứ tự muốn hiển thị.
     Mỗi ảnh có thể viết 1 trong 2 kiểu:
       'images/abc.jpg'                                 → dùng 1 ảnh cho cả máy tính lẫn điện thoại
       { src: 'images/ngang.jpg', mobile: 'images/doc.jpg' }  → ảnh riêng cho điện thoại (ảnh DỌC)
     Thêm position: 'center 30%' nếu muốn chỉnh phần ảnh được giữ lại khi bị cắt
       (vd ảnh dọc hiện trên màn hình ngang: '50% 20%' = ưu tiên giữ phần trên).
     ⚠️ Tên file phân biệt HOA/thường khi đưa lên mạng (.JPG khác .jpg). */
  heroSlides: [
    'images/slide/slide1.jpg',
    'images/slide/slide2.jpg',
    'images/slide/slide3.jpg',
    'images/slide/slide4.jpg',
    'images/slide/slide5.jpg',
    'images/slide/slide6.jpg',
  ],
  heroMode: 'slide',      // 'slide'   = từng ảnh toàn màn hình trượt ngang, lặp vô tận
                          // 'marquee' = dải nhiều ảnh trôi ngang liên tục không dừng
  heroInterval: 3,        // (slide)   số giây mỗi ảnh đứng yên trước khi chuyển
  heroSpeed: 5,           // (marquee) số giây để mỗi ảnh trôi qua — số càng lớn càng chậm

  /* ---------- NGÀY CƯỚI ----------
     Giờ chính lễ / tiệc — dùng cho đồng hồ đếm ngược, lịch, tiêu đề.
     Định dạng: 'YYYY-MM-DDTHH:mm:00+07:00' (giữ nguyên +07:00 = giờ Việt Nam) */
  date: '2026-12-06T11:30:00+07:00',
  lunar: 'Tức ngày 28 tháng 10 năm Bính Ngọ',   // ⚠️ Nhớ kiểm tra lại ngày âm lịch
  rsvpDeadline: '25.11.2026',                   // Hạn khách xác nhận tham dự

  /* ---------- CÁC SỰ KIỆN ----------
     icon: 'rings' | 'home' | 'glass'
     hours: thời lượng (giờ) — dùng khi khách bấm "Lưu lịch"
     showMap: true  → địa điểm này sẽ hiện trên bản đồ lớn bên dưới
     mapUrl (không bắt buộc): dán link Google Maps chính xác của địa điểm
       (Google Maps → Chia sẻ → Sao chép đường liên kết) */
  events: [
    {
      icon: 'rings',
      title: 'Lễ Vu Quy',
      host: 'Tại nhà gái',
      date: '2026-11-28T11:00:00+07:00',
      place: 'Tư gia nhà gái',
      address: 'Số 345, đường Nguyễn Trãi, Khương Đình, Hà Nội',
      hours: 1.5,
      mapUrl: 'https://maps.app.goo.gl/EdCZq7hEx98DqXfV6'
    },
    {
      icon: 'home',
      title: 'Lễ Thành Hôn',
      host: 'Tại nhà trai',
      date: '2026-11-28T17:00:00+07:00',
      place: 'Tư gia nhà trai',
      address: 'Số 729, đường tỉnh 361, Nam Đồ Sơn, Hải Phòng',
      hours: 1.5,
      mapUrl: 'https://maps.app.goo.gl/fXcZLEncqaM5GgAx7'
    },
    {
      icon: 'glass',
      title: 'Tiệc Cưới',
      host: 'Trân trọng kính mời',
      date: '2026-12-06T11:30:00+07:00',
      place: 'Trung tâm hội nghị Quốc gia',
      address: 'Số 1 đường Phạm Hùng, Từ Liêm, Hà Nội',
      hours: 3,
      mapUrl: 'https://maps.app.goo.gl/SH6d7z6MhZDLrwjy8',
    },
  ],

  /* ---------- DRESS CODE ----------
     Các màu gợi ý trang phục cho khách. Để [] nếu không muốn hiển thị. */
  dressCode: ['#F3EDE4', '#E4D3BE', '#C9AE8F', '#8E9B88'],

  /* ---------- MỪNG CƯỚI ---------- */
  bank: {
    groom: { bank: 'Techcombank', number: '3926868688', owner: 'HOANG ANH TUAN' },
    bride: { bank: 'Techcombank', number: '9876543210', owner: 'TRAN YEN NHI' },
  },

  /* ---------- NHẠC NỀN ----------
     🎵 Đặt file nhạc vào music/song.mp3 (nên < 5MB). Để '' nếu không dùng nhạc. */
  music: 'music/song.mp3',

  /* ---------- LƯU XÁC NHẬN THAM DỰ & LỜI CHÚC ----------
     Dán link Web App của Google Apps Script vào đây để lưu về Google Sheets
     (hướng dẫn trong README.md, code mẫu ở google-apps-script.js).
     Để trống → lời chúc chỉ lưu tạm trên trình duyệt của khách. */
  rsvpEndpoint: '',

  petals: true,                          // Hiệu ứng cánh hoa rơi nhẹ
};
