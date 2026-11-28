(function () {
  'use strict';

  var FT = window.FT || {};
  var LIB = FT.library || { categories: [], books: [], sources: [], arTopics: [] };
  var PLANTS = FT.plants || [];
  var KNOW = FT.knowledge || [];
  var DISCLAIMER = FT.plantsDisclaimer || '';

  var view = document.getElementById('view');
  var titleEl = document.getElementById('title');

  /* ---------- أدوات ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[ً-ْـ]/g, '')
      .replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
  }
  function matchAll(hay, q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return true;
    var h = norm(hay);
    for (var i = 0; i < words.length; i++) if (h.indexOf(words[i]) === -1) return false;
    return true;
  }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('ftl:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ftl:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  var favs = new Set(store.get('favs', []));
  var custom = store.get('custom', []);
  function saveFavs() { store.set('favs', Array.from(favs)); }
  function saveCustom() { store.set('custom', custom); }

  function openUrl(u) {
    var B = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
    if (B && B.open) { B.open({ url: u }); } else { window.open(u, '_blank'); }
  }
  function catName(id) {
    for (var i = 0; i < LIB.categories.length; i++) if (LIB.categories[i].id === id) return LIB.categories[i].n;
    return 'أخرى';
  }

  /* ---------- محركات البحث الخارجية ---------- */
  var ENG = {
    scholar: { n: 'Google Scholar', u: function (q) { return 'https://scholar.google.com/scholar?q=' + q; } },
    ss: { n: 'Semantic Scholar', u: function (q) { return 'https://www.semanticscholar.org/search?q=' + q; } },
    ol: { n: 'Open Library', u: function (q) { return 'https://openlibrary.org/search?q=' + q; } },
    ia: { n: 'Internet Archive', u: function (q) { return 'https://archive.org/search?query=' + q; } },
    fao: { n: 'FAO', u: function (q) { return 'https://openknowledge.fao.org/search?query=' + q; } },
    pmc: { n: 'PubMed Central', u: function (q) { return 'https://pmc.ncbi.nlm.nih.gov/search/?term=' + q; } },
    man: { n: 'دار المنظومة', u: function (q) { return 'https://search.mandumah.com/Search/Results?lookfor=' + q + '&type=AllFields'; } }
  };
  function engBtn(key, q) {
    return '<button class="btn" data-url="' + esc(ENG[key].u(q)) + '">' + ENG[key].n + '</button>';
  }
  function engineRow(rawQuery, lang) {
    var q = encodeURIComponent(rawQuery);
    var keys = lang === 'ar' ? ['man', 'scholar', 'ia', 'fao'] : lang === 'en' ? ['ol', 'scholar', 'ss', 'ia', 'fao', 'pmc'] : ['scholar', 'man', 'ol', 'ss', 'fao', 'ia'];
    return keys.map(function (k) { return engBtn(k, q); }).join('');
  }

  /* ---------- المكتبة ---------- */
  var libState = { q: '', lang: 'all', cat: 'all' };

  function bookCard(b) {
    var en = b.lang === 'en';
    var q = encodeURIComponent(b.title + (b.author && en ? ' ' + b.author : ''));
    var key = 'b:' + b.id;
    var btns = (en ? ['ol', 'scholar', 'ia'] : ['man', 'scholar', 'ia']).map(function (k) { return engBtn(k, q); }).join('');
    if (b.url) btns = '<button class="btn fill" data-url="' + esc(b.url) + '">فتح الرابط</button>' + btns;
    return '<article class="card">' +
      '<div class="row"><h3' + (en ? ' class="ltr" dir="ltr"' : '') + '>' + esc(b.title) + '</h3>' +
      '<button class="star' + (favs.has(key) ? ' on' : '') + '" data-fav="' + esc(key) + '" aria-label="مفضلة">★</button></div>' +
      '<p class="meta">' + esc(b.author || '') + (b.year ? ' · ' + esc(b.year) : '') + '</p>' +
      '<p class="tags"><span class="tag">' + (en ? 'English' : 'عربي') + '</span><span class="tag">' + esc(catName(b.cat)) + '</span>' +
      (b.custom ? '<span class="tag">أضفتُه أنا</span>' : '') + '</p>' +
      (b.note ? '<p class="note">' + esc(b.note) + '</p>' : '') +
      '<div class="btns">' + btns +
      (b.custom ? '<button class="btn danger" data-delc="' + esc(b.id) + '">حذف</button>' : '') + '</div></article>';
  }

  function allBooks() {
    return LIB.books.concat(custom.map(function (c) { var o = {}; for (var k in c) o[k] = c[k]; o.custom = true; return o; }));
  }

  function viewLibrary() {
    titleEl.textContent = 'المكتبة';
    view.innerHTML =
      '<div class="search"><input id="libq" type="search" placeholder="ابحث في المراجع…" value="' + esc(libState.q) + '"></div>' +
      '<div id="libchips"></div><div id="libonline"></div><div id="liblist"></div>' +
      '<h2>📖 مصادر مفتوحة ومستودعات</h2><div id="libsrc"></div>' +
      '<h2>🔤 اختصارات بحث عربية</h2><div class="chips" id="libar"></div>';
    document.getElementById('libq').addEventListener('input', function (e) { libState.q = e.target.value; updateLib(); });
    document.getElementById('libsrc').innerHTML = LIB.sources.map(function (s) {
      return '<div class="card"><div class="row"><h3' + (s.lang === 'en' ? ' class="ltr" dir="ltr"' : '') + '>' + esc(s.n) + '</h3></div>' +
        '<p class="note">' + esc(s.d) + '</p><div class="btns"><button class="btn fill" data-url="' + esc(s.u) + '">فتح</button></div></div>';
    }).join('');
    document.getElementById('libar').innerHTML = LIB.arTopics.map(function (t) {
      return '<button class="chip" data-libq="' + esc(t) + '">' + esc(t) + '</button>';
    }).join('');
    updateLib();
  }

  function updateLib() {
    var s = libState;
    var langs = [['all', 'الكل'], ['ar', 'عربي'], ['en', 'English']];
    var chips = '<div class="chips">' + langs.map(function (l) {
      return '<button class="chip' + (s.lang === l[0] ? ' on' : '') + '" data-lang="' + l[0] + '">' + l[1] + '</button>';
    }).join('') + '</div><div class="chips"><button class="chip' + (s.cat === 'all' ? ' on' : '') + '" data-cat="all">كل التصنيفات</button>' +
      LIB.categories.map(function (c) {
        return '<button class="chip' + (s.cat === c.id ? ' on' : '') + '" data-cat="' + c.id + '">' + esc(c.n) + '</button>';
      }).join('') + '</div>';
    document.getElementById('libchips').innerHTML = chips;

    var list = allBooks().filter(function (b) {
      if (s.lang !== 'all' && b.lang !== s.lang) return false;
      if (s.cat !== 'all' && b.cat !== s.cat) return false;
      return matchAll([b.title, b.author, b.note, catName(b.cat)].join(' '), s.q);
    });
    var online = '';
    if (s.q.trim()) {
      online = '<div class="card"><p class="meta">ابحث عن «' + esc(s.q) + '» في الإنترنت:</p><div class="btns">' + engineRow(s.q, s.lang) + '</div></div>';
    }
    document.getElementById('libonline').innerHTML = online;
    var hasAr = allBooks().some(function (b) { return b.lang === 'ar'; });
    var emptyMsg = '<div class="empty">لا توجد نتائج.' + ((s.lang === 'ar' && !hasAr) ? '<br>أضف مراجعك العربية من تبويب «محفوظاتي»، واستخدم اختصارات البحث العربية أدناه.' : '') + '</div>';
    document.getElementById('liblist').innerHTML = list.length ? list.map(bookCard).join('') : emptyMsg;
  }

  /* ---------- المصانع ---------- */
  function viewPlants() {
    titleEl.textContent = 'دليل المصانع';
    view.innerHTML = '<div class="warn">' + esc(DISCLAIMER) + '</div>' + PLANTS.map(function (p) {
      return '<a class="card head" href="#/plant/' + esc(p.id) + '"><span class="big">' + p.emoji + '</span><div><h3>' + esc(p.title) + '</h3>' +
        '<p class="meta">' + esc(p.tagline) + '</p><p class="meta">' + esc(p.scale) + '</p></div></a>';
    }).join('');
  }

  function sectionHtml(sec, open) {
    var body = '';
    if (sec.text) body += '<p>' + esc(sec.text) + '</p>';
    if (sec.list) body += '<ul>' + sec.list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (sec.steps) body += '<ol>' + sec.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>';
    if (sec.rows) body += '<div>' + sec.rows.map(function (r) { return '<div class="kv"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>'; }).join('') + '</div>';
    return '<details' + (open ? ' open' : '') + '><summary>' + esc(sec.h) + '</summary>' + body + '</details>';
  }

  function viewPlant(id) {
    var p = null;
    for (var i = 0; i < PLANTS.length; i++) if (PLANTS[i].id === id) p = PLANTS[i];
    if (!p) { location.hash = '#/plants'; return; }
    titleEl.textContent = p.title;
    var key = 'p:' + p.id;
    view.innerHTML = '<a class="back" href="#/plants">→ كل المصانع</a>' +
      '<div class="head"><span class="big">' + p.emoji + '</span><div style="flex:1"><h2 style="margin:0">' + esc(p.title) + '</h2><p class="meta">' + esc(p.scale) + '</p></div>' +
      '<button class="star' + (favs.has(key) ? ' on' : '') + '" data-fav="' + esc(key) + '" aria-label="مفضلة">★</button></div>' +
      '<div class="warn">' + esc(DISCLAIMER) + '</div>' +
      p.sections.map(function (s, idx) { return sectionHtml(s, idx === 0); }).join('');
  }

  /* ---------- المعرفة ---------- */
  function viewKnowledge(openId) {
    titleEl.textContent = 'المعرفة: المعامل والمواد والعمليات';
    view.innerHTML = KNOW.map(function (g) {
      return '<details id="g-' + esc(g.id) + '"' + (openId === g.id ? ' open' : '') + '><summary>' + g.emoji + ' ' + esc(g.title) + '</summary>' +
        '<p class="meta">' + esc(g.intro) + '</p>' +
        g.items.map(function (it) { return '<div class="kv"><b>' + esc(it.t) + '</b><span>' + esc(it.d) + '</span></div>'; }).join('') + '</details>';
    }).join('');
    if (openId) { var el = document.getElementById('g-' + openId); if (el && el.scrollIntoView) el.scrollIntoView(); }
  }

  /* ---------- البحث الشامل ---------- */
  var searchIndex = null;
  function buildIndex() {
    var idx = [];
    PLANTS.forEach(function (p) {
      idx.push({ type: 'مصنع', title: p.title, text: p.tagline + ' ' + p.scale, href: '#/plant/' + p.id });
      p.sections.forEach(function (s) {
        var items = [];
        if (s.text) items.push(s.text);
        (s.list || []).forEach(function (x) { items.push(x); });
        (s.steps || []).forEach(function (x) { items.push(x); });
        (s.rows || []).forEach(function (r) { items.push(r[0] + ' — ' + r[1]); });
        items.forEach(function (t) { idx.push({ type: 'مصنع', title: p.title + ' › ' + s.h, text: t, href: '#/plant/' + p.id }); });
      });
    });
    KNOW.forEach(function (g) {
      g.items.forEach(function (it) { idx.push({ type: 'معرفة', title: it.t, text: it.d, href: '#/knowledge/' + g.id }); });
    });
    allBooks().forEach(function (b) {
      idx.push({ type: 'مرجع', title: b.title, text: [b.author, b.note, catName(b.cat)].join(' '), libq: b.title });
    });
    return idx;
  }

  var searchQ = '';
  function viewSearch() {
    titleEl.textContent = 'بحث شامل';
    view.innerHTML = '<div class="search"><input id="gq" type="search" placeholder="ابحث في المصانع والمعرفة والمراجع…" value="' + esc(searchQ) + '"></div><div id="gres"></div>';
    var input = document.getElementById('gq');
    input.addEventListener('input', function (e) { searchQ = e.target.value; runSearch(); });
    searchIndex = buildIndex();
    runSearch();
  }
  function runSearch() {
    var box = document.getElementById('gres');
    if (!box) return;
    if (!searchQ.trim()) { box.innerHTML = '<div class="empty">اكتب كلمة مثل: تعقيم، هستامين، منفحة، Brix، زيت…</div>'; return; }
    var res = searchIndex.filter(function (e) { return matchAll(e.title + ' ' + e.text, searchQ); });
    var shown = res.slice(0, 40);
    var html = shown.map(function (e) {
      var attr = e.libq ? ' data-libq="' + esc(e.libq) + '" href="#/library"' : ' href="' + esc(e.href) + '"';
      var snip = e.text.length > 140 ? e.text.slice(0, 140) + '…' : e.text;
      return '<a class="card"' + attr + '><span class="type">' + esc(e.type) + '</span><h3>' + esc(e.title) + '</h3><p class="snip">' + esc(snip) + '</p></a>';
    }).join('');
    if (res.length > shown.length) html += '<div class="empty">عُرض ' + shown.length + ' من ' + res.length + ' نتيجة. دقّق البحث.</div>';
    html += '<div class="card"><p class="meta">لم تجد ما تريد؟ ابحث في الإنترنت:</p><div class="btns">' + engineRow(searchQ, 'all') + '</div></div>';
    box.innerHTML = shown.length ? html : '<div class="empty">لا نتائج داخل التطبيق.</div>' + html;
  }

  /* ---------- محفوظاتي ---------- */
  function viewMe() {
    titleEl.textContent = 'محفوظاتي';
    var favBooks = allBooks().filter(function (b) { return favs.has('b:' + b.id); });
    var favPlants = PLANTS.filter(function (p) { return favs.has('p:' + p.id); });
    var html = '<h2>⭐ المفضلة</h2>';
    if (!favBooks.length && !favPlants.length) html += '<div class="empty">اضغط ★ على أي مرجع أو مصنع لحفظه هنا.</div>';
    favPlants.forEach(function (p) {
      html += '<a class="card head" href="#/plant/' + esc(p.id) + '"><span class="big">' + p.emoji + '</span><div><h3>' + esc(p.title) + '</h3><p class="meta">' + esc(p.tagline) + '</p></div></a>';
    });
    html += favBooks.map(bookCard).join('');
    html += '<h2>➕ أضف مرجعاً (كتاب/ملف/رابط)</h2>' +
      '<form class="form" id="addform">' +
      '<input name="title" placeholder="عنوان المرجع" required>' +
      '<input name="author" placeholder="المؤلف (اختياري)">' +
      '<select name="lang"><option value="ar">عربي</option><option value="en">English</option></select>' +
      '<select name="cat">' + LIB.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.n) + '</option>'; }).join('') + '</select>' +
      '<input name="url" type="url" placeholder="رابط (اختياري) https://…" dir="ltr">' +
      '<textarea name="note" rows="2" placeholder="ملاحظات (اختياري)"></textarea>' +
      '<button class="btn fill" type="submit" style="width:100%;padding:12px">حفظ المرجع</button></form>';
    html += '<h2>📌 مراجعي المضافة (' + custom.length + ')</h2>';
    html += custom.length ? custom.map(function (c) { var o = {}; for (var k in c) o[k] = c[k]; o.custom = true; return bookCard(o); }).join('') : '<div class="empty">لا شيء بعد.</div>';
    html += '<div class="warn">التطبيق لا يضم كتباً محمية بحقوق النشر. أضف هنا مراجعك العربية والأجنبية وروابطها، وتُحفظ على جهازك فقط.</div>';
    view.innerHTML = html;
    var form = document.getElementById('addform');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var title = String(f.get('title') || '').trim();
      if (!title) return;
      custom.unshift({
        id: 'c' + Date.now(), title: title, author: String(f.get('author') || '').trim(),
        lang: String(f.get('lang')), cat: String(f.get('cat')), url: String(f.get('url') || '').trim(), note: String(f.get('note') || '').trim()
      });
      saveCustom();
      viewMe();
    });
  }

  /* ---------- التوجيه ---------- */
  function setTab(name) {
    var links = document.querySelectorAll('#tabs a');
    for (var i = 0; i < links.length; i++) {
      links[i].classList.toggle('on', links[i].getAttribute('data-tab') === name);
    }
  }
  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('/');
    var name = parts[0] || 'library';
    var arg = parts[1];
    window.scrollTo(0, 0);
    if (name === 'plant') { setTab('plants'); viewPlant(arg); }
    else if (name === 'plants') { setTab('plants'); viewPlants(); }
    else if (name === 'knowledge') { setTab('knowledge'); viewKnowledge(arg); }
    else if (name === 'search') { setTab('search'); viewSearch(); }
    else if (name === 'me') { setTab('me'); viewMe(); }
    else { setTab('library'); viewLibrary(); }
  }
  window.addEventListener('hashchange', route);

  /* ---------- أحداث النقر ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-url],[data-fav],[data-lang],[data-cat],[data-libq],[data-delc]') : null;
    if (!t) return;
    var d = t.dataset;
    if (d.url) { e.preventDefault(); openUrl(d.url); return; }
    if (d.fav) {
      e.preventDefault();
      if (favs.has(d.fav)) favs.delete(d.fav); else favs.add(d.fav);
      saveFavs();
      var on = favs.has(d.fav);
      t.classList.toggle('on', on);
      if (location.hash.indexOf('#/me') === 0) viewMe();
      return;
    }
    if (d.lang) { libState.lang = d.lang; updateLib(); return; }
    if (d.cat) { libState.cat = d.cat; updateLib(); return; }
    if (d.libq !== undefined) {
      libState.q = d.libq; libState.lang = 'all'; libState.cat = 'all';
      if (location.hash === '#/library' || location.hash === '' || location.hash === '#') { viewLibrary(); window.scrollTo(0, 0); }
      else { location.hash = '#/library'; }
      return;
    }
    if (d.delc) {
      e.preventDefault();
      custom = custom.filter(function (c) { return c.id !== d.delc; });
      favs.delete('b:' + d.delc);
      saveCustom(); saveFavs();
      if (location.hash.indexOf('#/me') === 0) viewMe(); else updateLib();
    }
  });

  route();
})();
