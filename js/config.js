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
    bio: 'Một người mang đến cảm giác an tâm, biến những điều bình dị thành niềm vui và biến một người thành nơi để trở về.',
  },

  /* ---------- CÔ DÂU ---------- */
  bride: {
    short: 'Yến Nhi',
    full: 'Trần Yến Nhi',
    role: 'Út nữ',
    father: 'Trần Gia Cảnh',
    mother: 'Nguyễn Thị Nguyệt',
    address: 'Khương Đình, Hà Nội',
    bio: 'Một người yêu cái đẹp, trân trọng những điều nhỏ bé và tin rằng hạnh phúc được tạo nên từ những điều bình dị.',
  },

  monogram: ['T', 'N'],                  // 2 chữ cái viết tắt hiện ở logo/màn mở thiệp
  city: 'Hà Nội',
  // Địa điểm hiện ngay dưới dòng "Hôn lễ được cử hành vào lúc ..." (phần lời mời)
  venue: {
    room: 'Tại phòng 313',                    // để '' nếu không cần
    place: 'Trung tâm Hội nghị Quốc gia',
    address: 'Số 1 đường Phạm Hùng, Từ Liêm, Hà Nội',
  },
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
    'images/slide/slide7.jpg',
    'images/slide/slide8.jpg',
  ],
  heroMode: 'marquee',    // 'slide'   = từng ảnh toàn màn hình trượt ngang, lặp vô tận
                          // 'marquee' = dải nhiều ảnh trôi ngang liên tục không dừng
  heroInterval: 3,        // (slide)   số giây mỗi ảnh đứng yên trước khi chuyển
  heroSpeed: 12,          // (marquee) số giây để mỗi ảnh trôi qua — số càng lớn càng chậm

  /* ---------- NGÀY CƯỚI ----------
     Giờ chính lễ / tiệc — dùng cho đồng hồ đếm ngược, lịch, tiêu đề.
     Định dạng: 'YYYY-MM-DDTHH:mm:00+07:00' (giữ nguyên +07:00 = giờ Việt Nam) */
  date: '2026-12-06T11:00:00+07:00',
  lunar: 'Tức ngày 28 tháng 10 năm Bính Ngọ',   // ⚠️ Nhớ kiểm tra lại ngày âm lịch
  rsvpDeadline: '26.11.2026',                   // Hạn khách xác nhận tham dự

  /* ---------- CÁC SỰ KIỆN ----------
     icon: 'rings' | 'home' | 'glass'
     hours: thời lượng (giờ) — dùng khi khách bấm "Lưu lịch"
     showMap: true  → địa điểm này sẽ hiện trên bản đồ lớn bên dưới
     mapUrl (không bắt buộc): dán link Google Maps chính xác của địa điểm
       (Google Maps → Chia sẻ → Sao chép đường liên kết)
     mapCoords: 'vĩ độ,kinh độ' → ghim đúng vị trí trên bản đồ lớn (lấy từ link Google Maps, sau dấu @)
     directions: false → ẩn nút "Chỉ đường" của sự kiện đó
     main: true → sự kiện chính, hiện thành thẻ lớn ở cuối dòng thời gian
       (các sự kiện khác là mốc nhỏ). room: số phòng, hiện trên thẻ chính */
  events: [
    {
      icon: 'rings',
      title: 'Lễ Vu Quy',
      host: 'Tại nhà gái',
      date: '2026-11-28T11:00:00+07:00',
      place: 'Tư gia nhà gái',
      address: '',
      directions: false,
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
      directions: false,
      hours: 1.5,
      mapUrl: 'https://maps.app.goo.gl/fXcZLEncqaM5GgAx7'
    },
    {
      icon: 'glass',
      title: 'Tiệc Cưới',
      host: 'Trân trọng kính mời',
      date: '2026-12-06T11:00:00+07:00',
      main: true,                 // thẻ lớn cuối dòng thời gian
      room: 'Phòng 313',
      place: 'Trung tâm Hội nghị Quốc gia',
      address: 'Số 1 đường Phạm Hùng, Từ Liêm, Hà Nội',
      hours: 3,
      mapUrl: 'https://maps.app.goo.gl/SH6d7z6MhZDLrwjy8',
      mapCoords: '21.0060568,105.7876365',
    },
  ],

  /* ---------- DRESS CODE ----------
     Các màu gợi ý trang phục cho khách. Để [] nếu không muốn hiển thị. */
  dressCode: [],  // đang tắt. Bật lại: ['#F3EDE4', '#E4D3BE', '#C9AE8F', '#8E9B88']

  /* ---------- MỪNG CƯỚI ---------- */
  bank: {
    groom: { bank: 'Techcombank', number: '3926868688', owner: 'HOANG ANH TUAN', qr: 'images/qr-bank/qr-tuan.jpg' },
    bride: { bank: 'Techcombank', number: '241200', owner: 'TRAN YEN NHI', qr: 'images/qr-bank/qr-nhi.JPG' },
  },
  gift: 'bride',                         // Hộp mừng cưới hiện tài khoản của ai: 'bride' hoặc 'groom'
  guestSide: 'Nhà gái',                  // Chọn sẵn "Bạn là khách của" trong form xác nhận (link tiệc cưới)
  guestLineWe: 'chúng mình',             // Cách xưng ở câu "Cùng hai gia đình, ... trân trọng báo tin" và "...niềm vui và vinh hạnh của ..."
  rsvpEvent: 'tiệc cưới',               // Phần xác nhận: "Xác nhận tham dự ..." và "Bạn sẽ đến dự ... chứ?"

  /* ---------- NHẠC NỀN ----------
     🎵 Đặt file nhạc vào music/song.mp3 (nên < 5MB). Để '' nếu không dùng nhạc. */
  music: 'music/i_do.mp3',
  musicVolume: 0.3,                      // Âm lượng nhạc nền: 0 = tắt, 1 = to nhất (đang để 30%)
  musicFadeIn: 5,                        // Số giây nhạc to dần từ im lặng tới mức trên

  /* ---------- LƯU XÁC NHẬN THAM DỰ & LỜI CHÚC ----------
     Dán link Web App của Google Apps Script vào đây để lưu về Google Sheets
     (hướng dẫn trong README.md, code mẫu ở google-apps-script.js).
     Để trống → lời chúc chỉ lưu tạm trên trình duyệt của khách. */
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbxmc3dNjgI7t8sdExXH4KrMiscZfG4K9LA2MD_wv0OFYsrH_kB8qyOSCL4_Fhpp3r3L/exec', // Sheet TIỆC CƯỚI (06.12)

  petals: true,                          // Hiệu ứng cánh hoa rơi nhẹ

  /* =====================================================================
     HAI LINK THIỆP
       • .../wedding_invitation/tiec-cuoi/  → dùng thông tin phía trên (06.12, TT Hội nghị Quốc gia)
       • .../wedding_invitation/thanh-hon/  → dùng thông tin phía trên, GHI ĐÈ bởi mục 'thanh-hon' dưới đây
     Mục nào không ghi trong 'thanh-hon' thì dùng chung (ảnh, tên, album...).
     Ảnh + tiêu đề xem trước khi gửi Zalo/Facebook sửa trong thanh-hon/index.html và tiec-cuoi/index.html
     ===================================================================== */
  sides: {
    'thanh-hon': {
      date: '2026-11-28T17:00:00+07:00',             // Giờ tiệc nhà trai: đếm ngược, lịch, ảnh bìa...
      lunar: 'Tức ngày 20 tháng 10 năm Bính Ngọ',     // ⚠️ Suy ra từ 06.12 = 28/10 âm, nhớ kiểm tra lại
      rsvpDeadline: '24.11.2026',                     // Hạn phản hồi riêng cho link thành hôn
      city: 'Hải Phòng',
      venue: {
        room: '',
        place: 'Tư gia nhà trai',
        address: 'Số 729, đường tỉnh 361, Nam Đồ Sơn, Hải Phòng',
      },
      gift: 'groom',                                  // Hộp mừng cưới hiện QR chú rể
      guestSide: 'Nhà trai',                          // Chọn sẵn "Bạn là khách của" trong form
      guestLineWe: 'chúng tôi',                       // Link thành hôn xưng "chúng tôi" (gửi cả người lớn tuổi)
      rsvpEvent: 'lễ thành hôn',                      // "Xác nhận tham dự lễ thành hôn"
      // Link Web App của Google Sheet riêng cho lễ thành hôn (file "Xác nhận tham dự lễ thành hôn 28/11")
      rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbwmJBggE7ePIT0UPSAIVolKVXqzfQ4bTgEzcT0WETlToJNMf1KdsccLjcZVoIX8k3-m/exec',
      events: [
        {
          icon: 'rings',
          title: 'Lễ Vu Quy',
          host: 'Tại nhà gái',
          date: '2026-11-28T11:00:00+07:00',
          place: 'Tư gia nhà gái',
          address: '',
          directions: false,
          hours: 1.5,
        },
        {
          icon: 'glass',
          title: 'Tiệc Cưới',
          host: 'Trân trọng kính mời',
          date: '2026-11-28T17:00:00+07:00',
          main: true,
          place: 'Tư gia nhà trai',
          address: 'Số 729, đường tỉnh 361, Nam Đồ Sơn, Hải Phòng',
          hours: 3,
          mapUrl: 'https://maps.app.goo.gl/fXcZLEncqaM5GgAx7',
          mapCoords: '20.7092753,106.7378015',
        },
      ],
    },
  },
};
