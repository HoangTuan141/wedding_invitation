/* =====================================================================
   GOOGLE APPS SCRIPT — lưu Xác nhận tham dự & Lời chúc vào Google Sheets
   ---------------------------------------------------------------------
   File này KHÔNG chạy trên website. Copy toàn bộ nội dung vào
   Google Sheets → Tiện ích mở rộng → Apps Script (xem hướng dẫn trong README.md).
   ===================================================================== */

const SHEET_NAME = 'RSVP';
const HEADERS = ['Thời gian', 'Họ tên', 'Tham dự', 'Số người', 'Khách của', 'Lời chúc'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

const json_ = (data) =>
  ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);

// Website gửi xác nhận tham dự
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter;
    getSheet_().appendRow([
      new Date(),
      String(p.name || '').slice(0, 80),
      p.attend || '',
      p.attend === 'Có' ? p.guests || 1 : 0,
      p.side || '',
      String(p.wish || '').slice(0, 500),
    ]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Website lấy danh sách lời chúc để hiển thị trong "Sổ lưu bút"
function doGet() {
  const rows = getSheet_().getDataRange().getValues().slice(1);
  const wishes = rows
    .filter((r) => r[5])
    .map((r) => ({ time: r[0], name: r[1], wish: r[5] }))
    .reverse()
    .slice(0, 200);
  return json_(wishes);
}
