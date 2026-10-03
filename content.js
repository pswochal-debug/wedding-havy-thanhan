/* =====================================================================
   NỘI DUNG & CẤU HÌNH — đây là file DUY NHẤT bạn cần sửa để đổi nội dung.
   Mọi mục có chữ "[GIẢ ĐỊNH]" là dữ liệu mẫu, hãy thay bằng thông tin thật.
   ===================================================================== */
window.WEDDING = {
  // ---- Cấu hình hệ thống ------------------------------------------------
  draft: true,                 // true = hiện dải "đang cập nhật thông tin" ở đầu trang. Đổi thành false khi đã điền xong.
  sheetEndpoint: "https://script.google.com/macros/s/AKfycbxUb4McyvI7342potavdUJEdgcNttLDRT3e-7Qt6PbmohkSaQPZzEkAQbT06bpEKCUT/exec",         // Dán URL Google Apps Script (xem HUONG_DAN.md). Để trống = chế độ DEMO (chỉ lưu trên máy này).
  adminKey: "hayvy1010",       // Mật khẩu trang /admin. Nếu dùng Google Sheet, đặt GIỐNG hệt ADMIN_KEY trong apps-script/Code.gs.
  rsvpDeadline: "2026-10-07T23:59:59+07:00", // Hạn chót RSVP
  contactPhone: "0900 000 000",              // [GIẢ ĐỊNH] Số liên hệ khi cần gấp

  // ---- Cặp đôi & sự kiện ------------------------------------------------
  couple: { a: "Hà Vy", b: "Thanh An" },
  tagline: "Chúng tôi sắp kết hôn — và muốn bạn ở đó.",
  event: {
    title: "Đám cưới Hà Vy & Thanh An",
    start: "2026-10-10T17:00:00+07:00",   // [GIẢ ĐỊNH] giờ bắt đầu
    end:   "2026-10-10T22:30:00+07:00",   // [GIẢ ĐỊNH] giờ kết thúc
    dateLabel: "10 · 10 · 2026",
    weekday: "Thứ Bảy"
  },
  venue: {
    name: "Tên địa điểm tổ chức",                         // [GIẢ ĐỊNH]
    address: "Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành", // [GIẢ ĐỊNH]
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wedding+venue", // [GIẢ ĐỊNH] dán link Google Maps thật
    notes: [
      "Có bãi đỗ xe máy và ô tô ngay tại sảnh (cập nhật nếu khác).",
      "Khuyến khích đi taxi/xe công nghệ để thuận tiện."
    ]
  },

  // ---- Our Story --------------------------------------------------------
  story: [
    { year: "2019", title: "Lần đầu gặp nhau",  text: "[GIẢ ĐỊNH] Một buổi chiều bình thường, một cuộc trò chuyện không định trước — và không ai trong hai chúng tôi biết nó sẽ kéo dài đến vậy." },
    { year: "2021", title: "Bắt đầu cùng nhau", text: "[GIẢ ĐỊNH] Những chuyến đi nhỏ, những quán cà phê quen, và dần dần là một thói quen: luôn muốn kể mọi chuyện cho người kia nghe đầu tiên." },
    { year: "2025", title: "Lời cầu hôn",       text: "[GIẢ ĐỊNH] Không có màn hình lớn hay pháo hoa. Chỉ là một buổi tối yên tĩnh, một câu hỏi và một cái gật đầu." },
    { year: "2026", title: "Ngày chúng tôi chọn", text: "[GIẢ ĐỊNH] Và bây giờ, 10.10 — ngày chúng tôi muốn chia sẻ với những người đã đi cùng mình suốt chặng đường." }
  ],

  // ---- Lịch trình ngày cưới --------------------------------------------
  schedule: [   // [GIẢ ĐỊNH] toàn bộ giờ giấc
    { time: "16:30", title: "Đón khách",            text: "Check-in, nhận chỗ ngồi, thưởng thức đồ uống chào mừng." },
    { time: "17:00", title: "Lễ thành hôn",         text: "Nghi thức ngắn, trong không gian ấm cúng." },
    { time: "18:00", title: "Tiệc tối",             text: "Thực đơn thiết kế riêng cho buổi tối." },
    { time: "19:30", title: "Lời cảm ơn & Cắt bánh", text: "Vài lời chia sẻ và khoảnh khắc ngọt ngào." },
    { time: "20:00", title: "Âm nhạc & Nhảy",       text: "Playlist do chính khách mời gợi ý." },
    { time: "22:30", title: "Kết thúc",             text: "Hẹn gặp lại và về nhà an toàn." }
  ],

  // ---- Dress code -------------------------------------------------------
  dresscode: {
    title: "Semi-formal · Sắc màu đất",
    text: "Chúng tôi mong bạn mặc đẹp và thoải mái. Gợi ý bảng màu bên dưới — hãy tránh trắng và kem để dành cho cô dâu.",
    palette: [
      { name: "Sage",  hex: "#9CAF88" },
      { name: "Olive", hex: "#6B705C" },
      { name: "Sand",  hex: "#D9C5A0" },
      { name: "Clay",  hex: "#B5835A" },
      { name: "Ink",   hex: "#2B2B2B" }
    ],
    tips: ["Đường vào có thể có sỏi/cỏ — nên chọn giày dễ đi.", "Tối trời se lạnh nhẹ, bạn có thể mang thêm áo khoác mỏng."]
  },

  // ---- Gallery ----------------------------------------------------------
  // Thêm ảnh thật: bỏ file vào thư mục images/ rồi điền src, ví dụ src: "images/anh1.webp".
  // Để src trống sẽ hiện khung màu mẫu.
  gallery: [
    { src: "", alt: "Ảnh 01", ratio: "3/4" }, { src: "", alt: "Ảnh 02", ratio: "1/1" },
    { src: "", alt: "Ảnh 03", ratio: "4/5" }, { src: "", alt: "Ảnh 04", ratio: "4/3" },
    { src: "", alt: "Ảnh 05", ratio: "3/4" }, { src: "", alt: "Ảnh 06", ratio: "1/1" },
    { src: "", alt: "Ảnh 07", ratio: "4/5" }, { src: "", alt: "Ảnh 08", ratio: "3/4" }
  ],
  heroImage: "",   // ví dụ "images/hero.webp" — để trống dùng nền màu

  // ---- Q&A (câu hỏi thường gặp) ----------------------------------------
  faq: [
    { q: "Tôi có thể mang theo trẻ em không?", a: "[GIẢ ĐỊNH] Rất vui nếu bé đi cùng! Hãy ghi số người và tên bé khi RSVP để chúng tôi sắp chỗ." },
    { q: "Có chỗ đỗ xe không?", a: "[GIẢ ĐỊNH] Có bãi đỗ tại địa điểm. Vào giờ cao điểm, bạn nên đi sớm hoặc dùng xe công nghệ." },
    { q: "Tôi bị dị ứng/ăn chay thì sao?", a: "Hãy ghi vào ô “Ăn uống” khi RSVP, nhà hàng sẽ chuẩn bị riêng cho bạn." },
    { q: "Tôi có cần mang quà không?", a: "Sự hiện diện của bạn là món quà lớn nhất. Nếu muốn gửi gì đó, chúng tôi sẽ rất trân trọng." },
    { q: "Hạn chót RSVP là khi nào?", a: "Hết ngày 07.10.2026. Sau đó vui lòng liên hệ trực tiếp với chúng tôi." }
  ]
};
