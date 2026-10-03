(function () {
  var C = window.WEDDING;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };
  var pad = function (n) { return n < 10 ? "0" + n : "" + n; };

  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("show"); }, 3800);
  }

  /* ---------- Nội dung tĩnh ---------- */
  function render() {
    document.title = C.couple.a + " & " + C.couple.b + " — " + C.event.dateLabel.replace(/ · /g, ".");
    if (C.draft) $("draft").hidden = false;
    $("brand").textContent = C.couple.a.charAt(0) + " & " + C.couple.b.charAt(0);
    $("heroNames").innerHTML = esc(C.couple.a) + "<em>&amp;</em>" + esc(C.couple.b);
    $("heroDate").textContent = C.event.weekday + " · " + C.event.dateLabel;
    $("heroTag").textContent = C.tagline;
    if (C.heroImage) { $("heroBg").style.backgroundImage = "url('" + C.heroImage + "')"; $("heroBg").classList.add("has-img"); }

    $("timeline").innerHTML = C.story.map(function (s) {
      return '<li class="reveal"><span class="yr">' + esc(s.year) + '</span><div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></li>';
    }).join("");

    $("schedule").innerHTML = C.schedule.map(function (s) {
      return '<li class="reveal"><span class="t">' + esc(s.time) + '</span><div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></li>';
    }).join("");

    $("venueName").textContent = C.venue.name;
    $("venueAddr").textContent = C.venue.address;
    $("venueNotes").innerHTML = C.venue.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
    $("mapsLink").href = C.venue.mapsUrl;

    $("dcTitle").textContent = C.dresscode.title;
    $("dcText").textContent = C.dresscode.text;
    $("palette").innerHTML = C.dresscode.palette.map(function (p) {
      return '<li><i style="background:' + esc(p.hex) + '"></i>' + esc(p.name) + '</li>';
    }).join("");
    $("dcTips").innerHTML = C.dresscode.tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

    var tones = ["#b9a98a", "#8d9a7a", "#c7b79a", "#9c7c5c", "#a7b095", "#7d8467"];
    $("galleryGrid").innerHTML = C.gallery.map(function (g, i) {
      var inner = g.src
        ? '<img class="ph" loading="lazy" src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" style="aspect-ratio:' + esc(g.ratio) + ';object-fit:cover">'
        : '<div class="ph" role="img" aria-label="' + esc(g.alt) + '" style="aspect-ratio:' + esc(g.ratio) + ';background:linear-gradient(145deg,' + tones[i % tones.length] + ',' + tones[(i + 2) % tones.length] + ')">' + esc(g.alt) + '</div>';
      return '<button type="button" data-i="' + i + '" class="reveal" aria-label="Xem ảnh ' + (i + 1) + '">' + inner + '</button>';
    }).join("");

    $("faqList").innerHTML = C.faq.map(faqItem).join("");
    $("rsvpIntro").textContent = "Vui lòng xác nhận trước " + new Date(C.rsvpDeadline).toLocaleDateString("vi-VN") + ". Bạn có thể quay lại để chỉnh sửa bất cứ lúc nào trước hạn.";
    $("footNames").textContent = C.couple.a + " & " + C.couple.b;
    $("footContact").textContent = "Cần hỗ trợ gấp trong ngày cưới: " + C.contactPhone;
  }
  function faqItem(f) { return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>"; }

  /* ---------- Nav, reveal, countdown ---------- */
  function ui() {
    var nav = $("nav"), links = $("navLinks"), tg = $("navToggle");
    window.addEventListener("scroll", function () { nav.classList.toggle("scrolled", window.scrollY > 10); }, { passive: true });
    tg.addEventListener("click", function () {
      var open = links.classList.toggle("open"); tg.setAttribute("aria-expanded", open);
    });
    links.addEventListener("click", function (e) { if (e.target.tagName === "A") { links.classList.remove("open"); tg.setAttribute("aria-expanded", false); } });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });

    var target = new Date(C.event.start).getTime(), cd = $("countdown");
    function tick() {
      var d = target - Date.now();
      if (d <= 0) { cd.innerHTML = '<div><b>Hôm nay</b><span>là ngày cưới</span></div>'; return; }
      var s = Math.floor(d / 1000);
      var parts = [[Math.floor(s / 86400), "Ngày"], [Math.floor(s % 86400 / 3600), "Giờ"], [Math.floor(s % 3600 / 60), "Phút"], [s % 60, "Giây"]];
      cd.innerHTML = parts.map(function (p) { return "<div><b>" + pad(p[0]) + "</b><span>" + p[1] + "</span></div>"; }).join("");
      setTimeout(tick, 1000);
    }
    tick();

    // Lightbox
    var lb = $("lightbox"), lbi = $("lightboxImg");
    $("galleryGrid").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-i]"); if (!b) return;
      var g = C.gallery[+b.dataset.i];
      lbi.style.setProperty("--r", g.ratio);
      var ph = b.querySelector(".ph");
      lbi.style.background = "";
      if (g.src) { lbi.className = "lightbox__img"; lbi.style.backgroundImage = "url('" + g.src + "')"; lbi.textContent = ""; }
      else { lbi.className = "lightbox__img ph"; lbi.style.background = ph.style.background; lbi.textContent = g.alt; }
      lb.hidden = false; lb.querySelector("button").focus();
    });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.tagName === "BUTTON") lb.hidden = true; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.hidden = true; });
  }

  /* ---------- Lưu vào lịch ---------- */
  function calendar() {
    var fmt = function (iso) { return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    var s = fmt(C.event.start), e = fmt(C.event.end);
    var loc = C.venue.name + ", " + C.venue.address;
    $("gcalLink").href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(C.event.title) +
      "&dates=" + s + "/" + e + "&location=" + encodeURIComponent(loc) + "&details=" + encodeURIComponent("Hẹn gặp bạn tại đám cưới của " + C.couple.a + " & " + C.couple.b);
    var ics = function (t) { return String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n"); };
    $("icsBtn").addEventListener("click", function () {
      var body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//HaVy-ThanhAn//Wedding//VI", "BEGIN:VEVENT",
        "UID:wedding-20261010@havy-thanhan", "DTSTAMP:" + fmt(new Date().toISOString()), "DTSTART:" + s, "DTEND:" + e,
        "SUMMARY:" + ics(C.event.title), "LOCATION:" + ics(loc), "DESCRIPTION:" + ics("Hẹn gặp bạn tại đám cưới của " + C.couple.a + " & " + C.couple.b),
        "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Ngày mai là đám cưới Hà Vy & Thanh An", "END:VALARM",
        "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
      a.download = "dam-cuoi-ha-vy-thanh-an.ics";
      document.body.appendChild(a); a.click(); a.remove();
    });
  }

  /* ---------- Form helpers ---------- */
  function showErr(id, msg) { var el = $(id); el.textContent = msg || ""; el.hidden = !msg; }
  function busy(form, on) { var b = form.querySelector("button[type=submit]"); b.disabled = on; }
  function after(res) { toast(res.queued ? "Chưa có mạng — dữ liệu đã lưu và sẽ tự gửi lại." : "Đã gửi. Cảm ơn bạn!"); }

  /* ---------- RSVP ---------- */
  function rsvp() {
    var form = $("rsvpForm"), done = $("rsvpDone"), closed = $("rsvpClosed");
    var isClosed = Date.now() > new Date(C.rsvpDeadline).getTime();
    var yes = $("yesFields");

    function sync() { yes.hidden = form.elements.attending.value === "no"; }
    form.addEventListener("change", sync);

    function show() {
      var mine = Store.mine("rsvp")[0];
      if (mine) {
        form.hidden = true; done.hidden = false;
        var line = mine.attending === "yes"
          ? "Bạn đã xác nhận tham dự cùng <b>" + esc(mine.guests) + "</b> người."
          : "Bạn đã báo không thể tham dự. Chúng tôi sẽ nhớ đến bạn.";
        done.innerHTML = '<h3 class="h3">Cảm ơn ' + esc(mine.name) + '!</h3><p>' + line + '</p>' +
          (isClosed ? '<p class="small">RSVP đã đóng. Cần thay đổi, hãy liên hệ ' + esc(C.contactPhone) + '.</p>'
                    : '<button class="btn btn--ghost" id="editRsvp" type="button">Chỉnh sửa</button>');
        var eb = $("editRsvp");
        if (eb) eb.onclick = function () {
          ["name", "guests", "companions", "diet", "message"].forEach(function (k) { form.elements[k].value = mine[k] || (k === "guests" ? 1 : ""); });
          form.elements.attending.value = mine.attending; sync();
          form.hidden = false; done.hidden = true; form.elements.name.focus();
        };
      } else if (isClosed) {
        form.hidden = true;
        closed.hidden = false;
        closed.textContent = "RSVP đã đóng. Nếu bạn vẫn muốn tham dự, vui lòng liên hệ trực tiếp: " + C.contactPhone + ".";
      } else { form.hidden = false; done.hidden = true; }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault(); showErr("rsvpError");
      var f = form, name = f.elements.name.value.trim();
      if (f.website.value) { toast("Đã gửi. Cảm ơn bạn!"); return; }
      if (!name) { showErr("rsvpError", "Vui lòng nhập họ và tên."); f.elements.name.focus(); return; }
      if (!f.attending.value) { showErr("rsvpError", "Vui lòng chọn bạn có tham dự hay không."); return; }
      var mine = Store.mine("rsvp")[0] || {};
      var att = f.attending.value;
      var rec = {
        id: mine.id, createdAt: mine.createdAt, name: name, attending: att,
        guests: att === "yes" ? Math.min(10, Math.max(1, parseInt(f.guests.value, 10) || 1)) : 0,
        companions: att === "yes" ? f.companions.value.trim() : "",
        diet: att === "yes" ? f.diet.value.trim() : "",
        message: f.message.value.trim()
      };
      busy(f, true);
      Store.submit("rsvp", rec).then(function (r) { after(r); show(); window.scrollTo({ top: $("rsvp").offsetTop - 60, behavior: "smooth" }); })
        .catch(function () { showErr("rsvpError", "Có lỗi khi gửi. Vui lòng thử lại."); })
        .then(function () { busy(f, false); });
    });
    sync(); show();
  }

  /* ---------- Bài hát ---------- */
  function songs() {
    var form = $("songForm"), list = $("mySongs");
    function draw() {
      var m = Store.mine("song");
      list.innerHTML = m.map(function (s) { return "<li><b>" + esc(s.title) + "</b> — " + esc(s.artist) + "</li>"; }).join("");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault(); showErr("songError");
      if (form.website.value) { toast("Đã gửi. Cảm ơn bạn!"); return; }
      var title = form.elements.title.value.trim(), artist = form.artist.value.trim();
      if (!title || !artist) { showErr("songError", "Vui lòng nhập tên bài hát và nghệ sĩ."); return; }
      busy(form, true);
      Store.submit("song", { title: title, artist: artist, by: form.by.value.trim() })
        .then(function (r) { after(r); form.elements.title.value = ""; form.artist.value = ""; draw(); })
        .catch(function () { showErr("songError", "Có lỗi khi gửi. Vui lòng thử lại."); })
        .then(function () { busy(form, false); });
    });
    draw();
  }

  /* ---------- Q&A ---------- */
  function qa() {
    var form = $("qForm");
    Store.faq().then(function (rows) {
      if (rows.length) $("faqList").insertAdjacentHTML("beforeend", rows.map(function (r) { return faqItem({ q: r.text, a: r.answer }); }).join(""));
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); showErr("qError");
      if (form.website.value) { toast("Đã gửi. Cảm ơn bạn!"); return; }
      var text = form.text.value.trim();
      if (!text) { showErr("qError", "Vui lòng nhập câu hỏi."); return; }
      busy(form, true);
      Store.submit("question", { text: text, by: form.by.value.trim(), answer: "" })
        .then(function (r) { after(r); form.text.value = ""; })
        .catch(function () { showErr("qError", "Có lỗi khi gửi. Vui lòng thử lại."); })
        .then(function () { busy(form, false); });
    });
  }

  render(); ui(); calendar(); rsvp(); songs(); qa();
})();

