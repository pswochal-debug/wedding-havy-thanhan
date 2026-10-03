/* Lớp lưu dữ liệu dùng chung cho website và trang admin.
   - Có sheetEndpoint: gửi/đọc qua Google Apps Script (Google Sheet).
   - Không có: chế độ DEMO, lưu trong localStorage của trình duyệt này.
   Bản sao phía khách luôn được giữ lại để mở lại vẫn thấy dữ liệu của mình. */
(function () {
  var C = window.WEDDING, P = "hvta:";
  var ls = {
    get: function (k, d) { try { var v = localStorage.getItem(P + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) {} }
  };
  var live = function () { return !!C.sheetEndpoint; };
  var uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };

  function upsert(arr, rec) {
    var i = arr.findIndex(function (r) { return r.id === rec.id; });
    if (i >= 0) arr[i] = Object.assign(arr[i], rec); else arr.push(rec);
    return arr;
  }

  function send(payload) {
    return fetch(C.sheetEndpoint, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
  }

  function flush() {
    if (!live()) return;
    var q = ls.get("queue", []);
    if (!q.length) return;
    ls.set("queue", []);
    q.forEach(function (p) { send(p).catch(function () { ls.set("queue", ls.get("queue", []).concat([p])); }); });
  }
  window.addEventListener("online", flush);

  function get(params) {
    var u = C.sheetEndpoint + "?" + new URLSearchParams(params).toString();
    return fetch(u).then(function (r) { return r.json(); });
  }

  window.Store = {
    live: live,
    uid: uid,
    mine: function (type) { return ls.get("mine:" + type, []); },

    // Lưu 1 bản ghi (rsvp | song | question). Trả về Promise<{queued:boolean}>.
    submit: function (type, rec) {
      rec.id = rec.id || uid();
      rec.createdAt = rec.createdAt || new Date().toISOString();
      rec.updatedAt = new Date().toISOString();
      ls.set("mine:" + type, upsert(ls.get("mine:" + type, []), rec));
      if (!live()) {
        ls.set("db:" + type, upsert(ls.get("db:" + type, []), rec));
        return Promise.resolve({ queued: false });
      }
      var payload = { action: "save", type: type, record: rec };
      return send(payload).then(function () { return { queued: false }; }).catch(function () {
        ls.set("queue", ls.get("queue", []).concat([payload]));
        return { queued: true };
      });
    },

    // Admin: đọc toàn bộ bản ghi
    list: function (type, key) {
      if (!live()) return Promise.resolve(ls.get("db:" + type, []));
      return get({ action: "list", type: type, key: key }).then(function (r) {
        if (r.error) throw new Error(r.error);
        return r.rows;
      });
    },

    // Admin: trả lời câu hỏi
    answer: function (id, text, key) {
      if (!live()) {
        var db = ls.get("db:question", []);
        db.forEach(function (r) { if (r.id === id) r.answer = text; });
        ls.set("db:question", db);
        return Promise.resolve();
      }
      return send({ action: "answer", id: id, answer: text, key: key });
    },

    // Công khai: các câu hỏi đã được trả lời
    faq: function () {
      if (!live()) return Promise.resolve(ls.get("db:question", []).filter(function (r) { return r.answer; }));
      return get({ action: "faq" }).then(function (r) { return r.rows || []; }).catch(function () { return []; });
    },

    flush: flush
  };
  flush();
})();
