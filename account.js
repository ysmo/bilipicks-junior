/* BiliPicks 账号和进度。
   一个网站里有多门课。访客继续用原来的 localStorage
   （从好奇到会看：bilipicks-g1-*，初中生学 AI：bilipicks-jh-*）。
   换一门课不会清掉另一门课的进度。
   公开页面用 config.public.js 里的 Supabase 网址和 anon 公钥；本机的 config.js 可以覆盖。
   只使用 anon 公钥。换一个 Supabase 项目，或换成同一套 Auth / REST 的服务时，改配置文件即可。
   电视版会加载这个文件，所以不用 ?. 、?? 这些较新的语法。

   再加一门能上的课：在 COURSES 里加一项（id、标题、清单文件、localStorage 前缀、
   所属阶段 stage：early / primary / junior），再准备一份和 data.js 一样的清单。
   进度按课程 id 分开存放。旧键要接着用的话，把 legacyPrefix 设成原来的前缀，
   打开页面时会拷到新前缀，不会删掉旧键。
   还在准备、还不能看的课放在 UPCOMING，不要进 COURSES，也不要建空的清单文件。 */
(function (global) {
  var COURSES = {
    g1: {
      id: 'g1',
      stage: 'primary',
      title: '从好奇到会看',
      titleEn: 'From Curiosity to Looking Closely',
      ages: '大约 6～7 岁',
      agesEn: 'about 6–7',
      blurb: '故事、小动物、博物馆，和简单的「为什么」。6 关，现在就能看。',
      blurbEn: 'Stories, little animals, museums, and simple “why” questions. Six stages, ready to watch now.',
      pageTitle: 'BiliPicks · 从好奇到会看',
      pageTitleEn: 'BiliPicks · From Curiosity to Looking Closely',
      file: 'data-g1.js',
      prefix: 'bilipicks-g1',
      legacyPrefix: 'bilipicks-g1',
      icon: '📖',
      color: '#2fa866',
      color2: '#1d7446'
    },
    jh: {
      id: 'jh',
      stage: 'junior',
      title: '初中生学 AI',
      titleEn: 'AI for Middle School',
      ages: '大约 12～15 岁',
      agesEn: 'about 12–15',
      blurb: '从好奇走到机器学习。9 关；学过函数再看后面几关更顺。',
      blurbEn: 'From curiosity to machine learning. Nine stages; the later ones go more smoothly if you already know functions.',
      pageTitle: 'BiliPicks · 初中生学 AI',
      pageTitleEn: 'BiliPicks · AI for Middle School',
      file: 'data.js',
      prefix: 'bilipicks-jh',
      legacyPrefix: 'bilipicks-jh',
      icon: '🧠',
      color: '#2f86e0',
      color2: '#1d5ea8'
    },
    y2: {
      id: 'y2',
      stage: 'early',
      title: '两岁看世界',
      titleEn: 'Seeing the World at Two',
      ages: '大约 2 岁',
      agesEn: 'about age 2',
      blurb: '熊猫、动物宝宝、小鸟，还有花、雨和雪。5 关共 31 条短片，请家长陪着，看完一条就停。',
      blurbEn: 'Pandas, baby animals, little birds, plus flowers, rain, and snow. Five stages, 31 short films. Sit with your child, and stop after each one.',
      pageTitle: 'BiliPicks · 两岁看世界',
      pageTitleEn: 'BiliPicks · Seeing the World at Two',
      file: 'data-y2.js',
      prefix: 'bilipicks-y2',
      icon: '🐼',
      color: '#e8943a',
      color2: '#b86a1d'
    }
  };
  var COURSE_ORDER = ['y2', 'g1', 'jh'];
  var STAGES = [
    {
      id: 'early',
      title: '幼儿',
      titleEn: 'Little ones',
      ages: '大约 2～5 岁',
      agesEn: 'about 2–5',
      lede: '请家长陪坐。每次只看一条，看完去做一件真事。',
      ledeEn: 'Sit with your child. Watch one short video, then go do something real.',
      color: '#e8943a',
      color2: '#b86a1d'
    },
    {
      id: 'primary',
      title: '小学',
      titleEn: 'Primary school',
      ages: '大约 6～11 岁',
      agesEn: 'about 6–11',
      lede: '从故事和身边的事物，慢慢走到「为什么会这样」。',
      ledeEn: 'From stories and everyday things, toward “why does this happen?”',
      color: '#2fa866',
      color2: '#1d7446'
    },
    {
      id: 'junior',
      title: '初中',
      titleEn: 'Middle school',
      ages: '大约 12～15 岁',
      agesEn: 'about 12–15',
      lede: '把好奇留住，再走到机器学习和把想法做成东西。',
      ledeEn: 'Keep the curiosity, then walk toward machine learning and making things.',
      color: '#2f86e0',
      color2: '#1d5ea8'
    }
  ];
  var UPCOMING = [
    {
      id: 'snd',
      stage: 'early',
      title: '听，世界在响',
      titleEn: 'Listen, the World Is Sounding',
      ages: '大约 3～5 岁',
      agesEn: 'about 3–5',
      blurb: '雨、鸟、虫鸣，还有厨房里的声音。请家长陪着，听完一条就去找那种声音。',
      blurbEn: 'Rain, birds, insects, and the sounds of the kitchen. Sit with your child, then go find that sound.',
      icon: '🎧',
      color: '#d9844a',
      color2: '#a85a28',
      badge: '正在准备'
    },
    {
      id: 'why',
      stage: 'primary',
      title: '问个为什么',
      titleEn: 'Ask Why',
      ages: '大约 8～11 岁',
      agesEn: 'about 8–11',
      blurb: '光、水、磁铁，和博物馆里的旧东西。看完可以在家里试一个小实验。',
      blurbEn: 'Light, water, magnets, and old things in museums. After watching, you can try a small experiment at home.',
      icon: '🧪',
      color: '#3aa37a',
      color2: '#1c6e52',
      badge: '正在准备'
    }
  ];
  var GUEST_SUFFIXES = ['done-v1', 'missions-v1', 'theme', 'autoplay', 'covers-v1', 'pos-v1'];
  function t(key, fallback) {
    var i18n = global.BiliPicksI18n;
    if (i18n && typeof i18n.t === 'function') {
      var s = i18n.t(key);
      if (s && s !== key) return s;
    }
    return fallback;
  }
  var TRACK_KEY = 'bilipicks-track';
  var AUTH_KEY = 'bilipicks-auth-v1';
  var PROFILE_KEY = 'bilipicks-profile-v1';
  var CACHE_KEY = 'bilipicks-cloud-v1';
  var MERGE_KEY = 'bilipicks-merge-v1';
  var PENDING_KEY = 'bilipicks-pending-courses-v1';

  var config = null;
  var session = null;
  var profiles = [];
  var profile = null;
  var mode = 'guest';
  var currentTrack = '';
  var coursesColumn = true;
  var cloudProfileId = '';
  var cloudData = emptyData();
  var cloudBase = emptyData();
  var opened = null;
  var refreshing = null;
  var pushTimer = null;
  var pollTimer = null;
  var pulling = false;

  function courseIdOk(id) {
    id = String(id || '');
    if (!/^[a-z0-9][a-z0-9_-]{0,31}$/.test(id)) return false;
    if (id === 'constructor' || id === 'prototype') return false;
    return true;
  }
  function courseIds() {
    var ids = [];
    var i, id;
    for (i = 0; i < COURSE_ORDER.length; i++) {
      if (COURSES[COURSE_ORDER[i]]) ids.push(COURSE_ORDER[i]);
    }
    for (id in COURSES) {
      if (Object.prototype.hasOwnProperty.call(COURSES, id) && ids.indexOf(id) < 0 && courseIdOk(id)) ids.push(id);
    }
    return ids;
  }
  function coursePublic(id) {
    var c = COURSES[id];
    return {
      id: c.id,
      title: c.title,
      titleEn: c.titleEn,
      ages: c.ages,
      agesEn: c.agesEn,
      blurb: c.blurb,
      blurbEn: c.blurbEn,
      pageTitle: c.pageTitle,
      pageTitleEn: c.pageTitleEn,
      icon: c.icon,
      color: c.color,
      color2: c.color2,
      stage: c.stage
    };
  }
  function courseList() {
    var out = [];
    courseIds().forEach(function (id) { out.push(coursePublic(id)); });
    return out;
  }
  function publicProfile(p) {
    return {
      id: p.id,
      display_name: p.display_name,
      track: p.track,
      courses: (p.courses || []).slice()
    };
  }
  function listIds(raw) {
    var out = [];
    var i, id;
    if (typeof raw === 'string') {
      raw = raw.replace(/[{}"]/g, '');
      raw = raw ? raw.split(',') : [];
    }
    if (!raw || typeof raw.length !== 'number') return out;
    for (i = 0; i < raw.length; i++) {
      id = String(raw[i] || '').toLowerCase().replace(/^\s+|\s+$/g, '');
      if (courseIdOk(id) && out.indexOf(id) < 0) out.push(id);
    }
    return out;
  }
  function sameList(a, b) {
    var i;
    a = a || [];
    b = b || [];
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  function sameSet(a, b) {
    var i;
    a = a || [];
    b = b || [];
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) if (b.indexOf(a[i]) < 0) return false;
    return true;
  }
  function profileCourseIds(p) {
    var ids = listIds(p && p.courses);
    var track = storedTrack(p && p.track);
    if (track && ids.indexOf(track) < 0) ids.unshift(track);
    return ids;
  }
  function filterProfiles(list, query) {
    var q = String(query || '').replace(/\s+/g, '').toLowerCase();
    var out = [];
    var i, p, name;
    list = list || [];
    if (!q) {
      for (i = 0; i < list.length; i++) out.push(list[i]);
      return out;
    }
    for (i = 0; i < list.length; i++) {
      p = list[i];
      name = String(p && p.display_name || '').replace(/\s+/g, '').toLowerCase();
      if (name.indexOf(q) >= 0) out.push(p);
    }
    return out;
  }
  function learningRecord(p, data, titles) {
    var enrolled = profileCourseIds(p);
    var ids = enrolled.slice();
    var courses = [];
    var i, id, tr, done, position, seen, key, videos, item, last, completedCount;
    data = normalizeData(data);
    titles = titles || {};
    for (id in data.tracks) {
      if (!Object.prototype.hasOwnProperty.call(data.tracks, id)) continue;
      if (ids.indexOf(id) >= 0) continue;
      tr = data.tracks[id] || {};
      if (Object.keys(tr.done || {}).length || Object.keys(tr.position || {}).length || Object.keys(tr.missions || {}).length) ids.push(id);
    }
    for (i = 0; i < ids.length; i++) {
      id = ids[i];
      tr = data.tracks[id] || emptyTrack();
      done = tr.done || {};
      position = tr.position || {};
      seen = {};
      videos = [];
      last = null;
      completedCount = 0;
      for (key in done) if (Object.prototype.hasOwnProperty.call(done, key)) seen[key] = 1;
      for (key in position) if (Object.prototype.hasOwnProperty.call(position, key)) seen[key] = 1;
      for (key in seen) {
        if (!Object.prototype.hasOwnProperty.call(seen, key)) continue;
        item = {
          id: key,
          title: titles[key] || '',
          completed: !!done[key],
          completedAt: typeof done[key] === 'number' ? done[key] : 0,
          positionSeconds: position[key] && typeof position[key].t === 'number' ? position[key].t : 0,
          positionAt: position[key] && typeof position[key].at === 'number' ? position[key].at : 0
        };
        if (item.completed) completedCount++;
        videos.push(item);
        if (item.positionAt && (!last || item.positionAt > last.positionAt)) last = item;
      }
      videos.sort(function (a, b) {
        return (b.completedAt || b.positionAt || 0) - (a.completedAt || a.positionAt || 0);
      });
      courses.push({
        id: id,
        title: COURSES[id] ? COURSES[id].title : id,
        enrolled: enrolled.indexOf(id) >= 0,
        completedCount: completedCount,
        videoCount: videos.length,
        last: last ? { id: last.id, title: last.title, seconds: last.positionSeconds, at: last.positionAt } : null,
        videos: videos
      });
    }
    return { name: p && p.display_name || '', courses: courses };
  }

  function storageKeys(track) {
    var c = COURSES[track];
    var p = c ? c.prefix : ('bilipicks-c-' + track);
    return {
      done: p + '-done-v1',
      missions: p + '-missions-v1',
      theme: p + '-theme',
      autoplay: p + '-autoplay',
      covers: p + '-covers-v1',
      position: p + '-pos-v1'
    };
  }
  function migrateGuestStorage() {
    courseIds().forEach(function (id) {
      var c = COURSES[id];
      if (!c || !c.legacyPrefix || c.legacyPrefix === c.prefix) return;
      GUEST_SUFFIXES.forEach(function (name) {
        var from = c.legacyPrefix + '-' + name;
        var to = c.prefix + '-' + name;
        try {
          if (localStorage.getItem(to) == null) {
            var v = localStorage.getItem(from);
            if (v != null) localStorage.setItem(to, v);
          }
        } catch (e) {}
      });
    });
  }

  function emptyTrack() {
    return { done: {}, missions: {}, position: {}, autoplay: null, autoplayAt: 0, theme: null, themeAt: 0 };
  }
  function emptyData() {
    var tracks = {};
    courseIds().forEach(function (id) { tracks[id] = emptyTrack(); });
    return { selected: [], selectedAt: 0, tracks: tracks };
  }
  function clone(v) {
    return JSON.parse(JSON.stringify(v == null ? null : v));
  }
  function copyInto(dst, src) {
    var k;
    src = src || {};
    for (k in dst) {
      if (Object.prototype.hasOwnProperty.call(dst, k) && !Object.prototype.hasOwnProperty.call(src, k)) delete dst[k];
    }
    for (k in src) {
      if (Object.prototype.hasOwnProperty.call(src, k)) dst[k] = src[k];
    }
  }
  function normalizeTrack(raw) {
    var t = emptyTrack();
    raw = raw || {};
    if (raw.done && typeof raw.done === 'object') t.done = raw.done;
    if (raw.missions && typeof raw.missions === 'object') t.missions = raw.missions;
    if (raw.position && typeof raw.position === 'object') t.position = raw.position;
    if (typeof raw.autoplay === 'boolean') t.autoplay = raw.autoplay;
    if (typeof raw.autoplayAt === 'number') t.autoplayAt = raw.autoplayAt;
    if (raw.theme === 'dark' || raw.theme === 'light') t.theme = raw.theme;
    if (typeof raw.themeAt === 'number') t.themeAt = raw.themeAt;
    return t;
  }
  function normalizeData(raw) {
    var out = emptyData();
    var tracks = raw && raw.tracks;
    var id;
    if (tracks && typeof tracks === 'object') {
      for (id in tracks) {
        if (!Object.prototype.hasOwnProperty.call(tracks, id)) continue;
        if (!courseIdOk(id)) continue;
        out.tracks[id] = normalizeTrack(tracks[id]);
      }
    }
    out.selected = listIds(raw && raw.selected);
    if (raw && typeof raw.selectedAt === 'number') out.selectedAt = raw.selectedAt;
    return out;
  }

  function tsOf(v) {
    if (v == null || v === false) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'object') {
      if (typeof v.at === 'number') return v.at;
      if (typeof v.t === 'number') return v.t;
    }
    return 0;
  }
  function mergeMap(base, local, remote) {
    base = base || {};
    local = local || {};
    remote = remote || {};
    var keys = {};
    var k, b, l, r, hasB, hasL, hasR, out = {};
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) keys[k] = 1;
    for (k in local) if (Object.prototype.hasOwnProperty.call(local, k)) keys[k] = 1;
    for (k in remote) if (Object.prototype.hasOwnProperty.call(remote, k)) keys[k] = 1;
    for (k in keys) {
      if (!Object.prototype.hasOwnProperty.call(keys, k)) continue;
      hasB = Object.prototype.hasOwnProperty.call(base, k);
      hasL = Object.prototype.hasOwnProperty.call(local, k);
      hasR = Object.prototype.hasOwnProperty.call(remote, k);
      b = hasB ? base[k] : undefined;
      l = hasL ? local[k] : undefined;
      r = hasR ? remote[k] : undefined;
      if (l == null) hasL = false;
      if (r == null) hasR = false;
      if (b == null) hasB = false;
      if (!hasL && !hasR) continue;
      if (hasL && !hasR) {
        if (hasB) {
          if (tsOf(l) > tsOf(b)) out[k] = l;
        } else out[k] = l;
        continue;
      }
      if (!hasL && hasR) {
        if (hasB) {
          if (tsOf(r) > tsOf(b)) out[k] = r;
        } else out[k] = r;
        continue;
      }
      out[k] = tsOf(l) >= tsOf(r) ? l : r;
    }
    return out;
  }
  function mergeScalar(base, local, remote, localAt, remoteAt) {
    if (local === remote) return local;
    if (local == null && remote == null) return null;
    if (local == null) return remote;
    if (remote == null) return local;
    if (base === local && base !== remote) return remote;
    if (base === remote && base !== local) return local;
    return (localAt || 0) >= (remoteAt || 0) ? local : remote;
  }
  function mergeTrackState(base, local, remote) {
    base = normalizeTrack(base);
    local = normalizeTrack(local);
    remote = normalizeTrack(remote);
    var themeAt = (local.themeAt || 0) >= (remote.themeAt || 0) ? (local.themeAt || remote.themeAt || 0) : (remote.themeAt || 0);
    var autoAt = (local.autoplayAt || 0) >= (remote.autoplayAt || 0) ? (local.autoplayAt || remote.autoplayAt || 0) : (remote.autoplayAt || 0);
    var theme = mergeScalar(base.theme, local.theme, remote.theme, local.themeAt, remote.themeAt);
    var autoplay = mergeScalar(base.autoplay, local.autoplay, remote.autoplay, local.autoplayAt, remote.autoplayAt);
    return {
      done: mergeMap(base.done, local.done, remote.done),
      missions: mergeMap(base.missions, local.missions, remote.missions),
      position: mergeMap(base.position, local.position, remote.position),
      theme: theme,
      themeAt: theme ? themeAt : 0,
      autoplay: autoplay,
      autoplayAt: typeof autoplay === 'boolean' ? autoAt : 0
    };
  }
  function mergeSelected(base, local, remote) {
    var ls = local.selected || [];
    var rs = remote.selected || [];
    var bs = base.selected || [];
    var pickL = true;
    if (sameList(ls, rs)) pickL = true;
    else if (!ls.length && rs.length) pickL = false;
    else if (!rs.length && ls.length) pickL = true;
    else if (sameList(bs, ls) && !sameList(bs, rs)) pickL = false;
    else if (sameList(bs, rs) && !sameList(bs, ls)) pickL = true;
    else pickL = (local.selectedAt || 0) >= (remote.selectedAt || 0);
    return {
      selected: (pickL ? ls : rs).slice(),
      selectedAt: pickL ? (local.selectedAt || 0) : (remote.selectedAt || 0)
    };
  }
  function mergeData(base, local, remote) {
    var ids = {};
    var id, picked;
    var out = { selected: [], selectedAt: 0, tracks: {} };
    base = normalizeData(base);
    local = normalizeData(local);
    remote = normalizeData(remote);
    for (id in base.tracks) if (Object.prototype.hasOwnProperty.call(base.tracks, id)) ids[id] = 1;
    for (id in local.tracks) if (Object.prototype.hasOwnProperty.call(local.tracks, id)) ids[id] = 1;
    for (id in remote.tracks) if (Object.prototype.hasOwnProperty.call(remote.tracks, id)) ids[id] = 1;
    for (id in ids) {
      if (!Object.prototype.hasOwnProperty.call(ids, id) || !courseIdOk(id)) continue;
      out.tracks[id] = mergeTrackState(base.tracks[id], local.tracks[id], remote.tracks[id]);
    }
    picked = mergeSelected(base, local, remote);
    out.selected = picked.selected;
    out.selectedAt = picked.selected.length ? picked.selectedAt : 0;
    return out;
  }

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null || raw === '') return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
  function readGuest(track) {
    var keys = storageKeys(track);
    var done = readJson(keys.done);
    var missions = readJson(keys.missions);
    var position = readJson(keys.position);
    var autoplay = readJson(keys.autoplay);
    var theme = null;
    try { theme = localStorage.getItem(keys.theme); } catch (e) {}
    return normalizeTrack({
      done: done && typeof done === 'object' ? done : {},
      missions: missions && typeof missions === 'object' ? missions : {},
      position: position && typeof position === 'object' ? position : {},
      autoplay: typeof autoplay === 'boolean' ? autoplay : null,
      theme: theme === 'dark' || theme === 'light' ? theme : null
    });
  }
  function writeGuest(track) {
    var keys = storageKeys(track);
    var tr = cloudData.tracks[track];
    if (!tr) return;
    try {
      localStorage.setItem(keys.done, JSON.stringify(tr.done || {}));
      localStorage.setItem(keys.missions, JSON.stringify(tr.missions || {}));
      localStorage.setItem(keys.position, JSON.stringify(tr.position || {}));
      if (typeof tr.autoplay === 'boolean') localStorage.setItem(keys.autoplay, JSON.stringify(tr.autoplay));
      if (tr.theme === 'dark' || tr.theme === 'light') localStorage.setItem(keys.theme, tr.theme);
    } catch (e) {}
  }
  function countTrack(tr) {
    tr = tr || {};
    return Object.keys(tr.done || {}).length + Object.keys(tr.missions || {}).length + Object.keys(tr.position || {}).length;
  }
  function guestFingerprint() {
    function ids(obj) { return Object.keys(obj || {}).sort().join(','); }
    var parts = [];
    courseIds().forEach(function (id) {
      var g = readGuest(id);
      parts.push(ids(g.done), ids(g.missions), ids(g.position));
    });
    return parts.join('|');
  }
  function guestHasProgress() {
    var parts = guestFingerprint().split('|');
    var i;
    for (i = 0; i < parts.length; i++) if (parts[i]) return true;
    return false;
  }
  function mergeMarkId() {
    if (!session || !profile) return '';
    return MERGE_KEY + ':' + session.user.id + ':' + profile.id;
  }
  function readMergeMark() {
    try { return localStorage.getItem(mergeMarkId()) || ''; } catch (e) { return ''; }
  }
  function writeMergeMark(fp) {
    try { localStorage.setItem(mergeMarkId(), fp); } catch (e) {}
  }

  function normalizeTrackId(raw) {
    var q = String(raw || '').toLowerCase();
    if (q === 'g1' || q === 'grade1' || q === 'elementary' || q === 'xiaoxue') return 'g1';
    if (q === 'jh' || q === 'junior' || q === 'chuzhong') return 'jh';
    return '';
  }
  function knownTrack(raw) {
    var id = normalizeTrackId(raw);
    if (id && COURSES[id]) return id;
    id = String(raw || '').toLowerCase();
    if (COURSES[id]) return id;
    return '';
  }
  function storedTrack(raw) {
    var known = knownTrack(raw);
    if (known) return known;
    var id = String(raw || '').toLowerCase();
    if (courseIdOk(id)) return id;
    return '';
  }
  function trackFromUrl() {
    try { return knownTrack(new URLSearchParams(location.search).get('track')); }
    catch (e) { return ''; }
  }
  function rememberedTrack() {
    try { return knownTrack(localStorage.getItem(TRACK_KEY)); }
    catch (e) { return ''; }
  }
  function rememberTrack(track) {
    if (!COURSES[track]) return;
    try { localStorage.setItem(TRACK_KEY, track); } catch (e) {}
  }
  function peekTrack() {
    return trackFromUrl() || rememberedTrack();
  }
  function fileFor(track) {
    return COURSES[track] ? COURSES[track].file : '';
  }
  function urlWithTrack(track) {
    var u = new URL(location.href);
    u.searchParams.set('track', track);
    u.hash = '';
    return u.pathname + '?' + u.searchParams.toString();
  }

  function readAuth() {
    var v = readJson(AUTH_KEY);
    if (!v || !v.access_token || !v.user || !v.user.id) return null;
    return v;
  }
  function writeAuth() {
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(session)); } catch (e) {}
  }
  function clearAuth() {
    session = null;
    try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
  }
  function readCache() {
    var v = readJson(CACHE_KEY);
    if (!v || !v.profileId || !v.data) return null;
    return v;
  }
  function writeCache() {
    if (!profile || !session) return;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        userId: session.user.id,
        profileId: profile.id,
        profile: publicProfile(profile),
        data: cloudData,
        base: cloudBase
      }));
    } catch (e) {}
  }

  function messageOf(data) {
    if (!data) return '';
    if (typeof data.msg === 'string') return data.msg;
    if (typeof data.error_description === 'string') return data.error_description;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (typeof data.code === 'string' && data.hint) return data.message || data.code;
    return '';
  }
  function friendly(err) {
    var m = (err && err.message) ? String(err.message) : '';
    var low = m.toLowerCase();
    if (low.indexOf('already') >= 0 || low.indexOf('registered') >= 0 || low.indexOf('exists') >= 0) return t('err.emailTaken', '这个邮箱已经注册过，请直接登录。');
    if (low.indexOf('invalid login') >= 0 || low.indexOf('invalid_grant') >= 0 || low.indexOf('credentials') >= 0) return t('err.badLogin', '邮箱或密码不对。');
    if (low.indexOf('password') >= 0 && (low.indexOf('short') >= 0 || low.indexOf('least') >= 0 || low.indexOf('weak') >= 0)) return t('err.passwordShort', '密码至少 6 位。');
    if (low.indexOf('email') >= 0 && (low.indexOf('valid') >= 0 || low.indexOf('invalid') >= 0)) return t('err.badEmail', '这个邮箱看起来不对。');
    if (low.indexOf('rate') >= 0 || low.indexOf('too many') >= 0) return t('err.tooMany', '试得太勤了，请稍后再试。');
    if (low.indexOf('failed to fetch') >= 0 || low.indexOf('network') >= 0 || low.indexOf('load failed') >= 0) return t('err.offlineAuth', '连不上登录服务。可以继续用访客模式，进度先存在这台设备上。');
    if (!m) return t('err.failed', '没有完成，请稍后再试。');
    return t('err.failedPrefix', '没有完成：') + m;
  }
  function checkEmailPassword(email, password) {
    email = String(email || '').trim();
    password = String(password || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t('err.parentEmail', '请填写家长或监护人的邮箱。');
    if (password.length < 6) return t('err.passwordShort', '密码至少 6 位。');
    return '';
  }
  function checkName(name) {
    name = String(name || '').replace(/\s+/g, ' ').trim();
    if (!name) return t('err.needNickname', '先写一个家里用的称呼，比如「姐姐」。');
    if (name.length > 24) return t('err.nicknameLong', '称呼请短一点，24 个字以内。');
    if (name.indexOf('@') >= 0) return t('err.nicknameNotEmail', '称呼不用写邮箱。');
    if (/[0-9]{6,}/.test(name)) return t('err.noPhone', '不要填写电话号码。');
    if (/\d{4}[-/.年]\d{1,2}/.test(name)) return t('err.noBirthday', '不要填写出生日期。');
    return '';
  }

  function usableConfig(c) {
    if (!c) return false;
    var url = String(c.supabaseUrl || '').trim().replace(/\/+$/, '');
    var key = String(c.supabaseAnonKey || '').trim();
    if (!url || !key) return false;
    if (url.indexOf('YOUR_') >= 0 || key.indexOf('YOUR_') >= 0) return false;
    // 正式环境用 https。本机兼容接口可以是 http://127.0.0.1 或 http://localhost。
    if (!/^https:\/\//i.test(url) && !/^http:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/i.test(url)) return false;
    if (key.length < 20) return false;
    return { url: url, anonKey: key };
  }
  function unconfigured() { return t('err.unconfigured', '云端登录还没配置。公开页面用 config.public.js，本机的 config.js 可以覆盖它。'); }
  // 已有能用的配置就用它。否则先试本机 config.js；404 或值不可用时再读 config.public.js。
  function loadConfig() {
    return new Promise(function (resolve) {
      var ready = usableConfig(global.BILIPICKS_CONFIG);
      if (ready) {
        resolve(ready);
        return;
      }
      function loadScript(src, next) {
        var s = document.createElement('script');
        var done = false;
        function finish() {
          if (done) return;
          done = true;
          next();
        }
        s.src = src;
        s.onload = finish;
        s.onerror = finish;
        document.head.appendChild(s);
      }
      loadScript('config.js', function () {
        var local = usableConfig(global.BILIPICKS_CONFIG);
        if (local) {
          resolve(local);
          return;
        }
        loadScript('config.public.js', function () {
          resolve(usableConfig(global.BILIPICKS_CONFIG) || null);
        });
      });
    });
  }

  function api(path, opts, didRetry) {
    opts = opts || {};
    var headers = {};
    var name, token;
    if (opts.headers) {
      for (name in opts.headers) if (Object.prototype.hasOwnProperty.call(opts.headers, name)) headers[name] = opts.headers[name];
    }
    token = opts.token || (session && session.access_token) || (config && config.anonKey);
    headers.apikey = config.anonKey;
    headers.Authorization = 'Bearer ' + token;
    headers.Accept = 'application/json';
    if (opts.body != null && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    return fetch(config.url + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body != null ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store'
    }).then(function (r) {
      return r.text().then(function (text) {
        var data = null;
        if (text) {
          try { data = JSON.parse(text); }
          catch (e) { data = { message: text.slice(0, 180) }; }
        }
        if (r.status === 401 && !didRetry && session && path.indexOf('/auth/v1/token') !== 0) {
          return refresh().then(function () {
            opts.token = session.access_token;
            return api(path, opts, true);
          });
        }
        if (!r.ok) {
          var err = new Error(messageOf(data) || ('HTTP ' + r.status));
          err.status = r.status;
          throw err;
        }
        return data;
      });
    });
  }
  function captureSession(data) {
    if (!data) return null;
    var tok = data.access_token ? data : (data.session && data.session.access_token ? data.session : null);
    if (!tok) return null;
    var user = data.user || tok.user || {};
    var exp = tok.expires_at;
    if (!exp && tok.expires_in) exp = Math.floor(Date.now() / 1000) + Number(tok.expires_in);
    session = {
      access_token: tok.access_token,
      refresh_token: tok.refresh_token,
      expires_at: exp || 0,
      user: { id: user.id, email: user.email || '' }
    };
    writeAuth();
    return session;
  }
  function refresh() {
    if (!session || !session.refresh_token || !config) return Promise.reject(new Error('no session'));
    if (refreshing) return refreshing;
    refreshing = api('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      token: config.anonKey,
      body: { refresh_token: session.refresh_token }
    }, true).then(function (data) {
      refreshing = null;
      if (!captureSession(data)) throw new Error('refresh failed');
      return session;
    }, function (err) {
      refreshing = null;
      clearAuth();
      throw err;
    });
    return refreshing;
  }
  function restoreSession() {
    session = readAuth();
    if (!session) return Promise.resolve(null);
    var now = Math.floor(Date.now() / 1000);
    if (!session.expires_at || session.expires_at < now + 60) {
      return refresh().then(function () { return session; }, function () { return null; });
    }
    return Promise.resolve(session);
  }

  function columnMissing(err) {
    var m = (err && err.message) ? String(err.message) : '';
    var low = m.toLowerCase();
    if (low.indexOf('courses') < 0) return false;
    return low.indexOf('does not exist') >= 0 || low.indexOf('schema cache') >= 0 || low.indexOf('could not find') >= 0 || low.indexOf('42703') >= 0 || low.indexOf('pgrst204') >= 0;
  }
  function normalizeProfile(row) {
    var track = storedTrack(row && row.track);
    var courses = listIds(row && row.courses);
    if (track && courses.indexOf(track) < 0) courses.unshift(track);
    if (!track && courses.length) track = courses[0];
    return {
      id: row.id,
      display_name: row.display_name,
      track: track,
      courses: courses,
      created_at: row.created_at || ''
    };
  }
  function loadProfiles() {
    var cols = coursesColumn
      ? 'id,display_name,track,courses,created_at'
      : 'id,display_name,track,created_at';
    return api('/rest/v1/profiles?select=' + cols + '&order=created_at.asc').then(function (rows) {
      profiles = [];
      (Array.isArray(rows) ? rows : []).forEach(function (row) { profiles.push(normalizeProfile(row)); });
      var pid = '';
      var i;
      try { pid = localStorage.getItem(PROFILE_KEY) || ''; } catch (e) {}
      profile = null;
      for (i = 0; i < profiles.length; i++) if (profiles[i].id === pid) profile = profiles[i];
      if (!profile && profiles.length) profile = profiles[0];
      if (profile) {
        try { localStorage.setItem(PROFILE_KEY, profile.id); } catch (e2) {}
      }
      return profiles;
    }, function (err) {
      if (coursesColumn && columnMissing(err)) {
        coursesColumn = false;
        return loadProfiles();
      }
      throw err;
    });
  }
  // 页面拿着 done / missions / position 的对象引用。同步时只改里面的键，不换对象。
  function installData(next) {
    var prev = currentTrack && cloudData.tracks[currentTrack] ? JSON.stringify(cloudData.tracks[currentTrack]) : '';
    var id, dst, src, seen = {};
    next = normalizeData(next);
    cloudData.selected = next.selected.slice();
    cloudData.selectedAt = next.selectedAt || 0;
    for (id in next.tracks) {
      if (!Object.prototype.hasOwnProperty.call(next.tracks, id)) continue;
      seen[id] = 1;
      if (!cloudData.tracks[id]) cloudData.tracks[id] = emptyTrack();
      dst = cloudData.tracks[id];
      src = next.tracks[id];
      copyInto(dst.done, src.done);
      copyInto(dst.missions, src.missions);
      copyInto(dst.position, src.position);
      dst.autoplay = src.autoplay;
      dst.autoplayAt = src.autoplayAt;
      dst.theme = src.theme;
      dst.themeAt = src.themeAt;
    }
    for (id in cloudData.tracks) {
      if (Object.prototype.hasOwnProperty.call(cloudData.tracks, id) && !seen[id]) delete cloudData.tracks[id];
    }
    cloudBase = clone(cloudData);
    writeCache();
    if (mode === 'cloud' && profile) cloudProfileId = profile.id;
    if (currentTrack && cloudData.tracks[currentTrack] && prev !== JSON.stringify(cloudData.tracks[currentTrack]) && view && typeof view.onChange === 'function') {
      view.onChange(cloudData.tracks[currentTrack]);
    }
  }
  function adoptCloud(data, base) {
    installData(data);
    if (base) cloudBase = clone(normalizeData(base));
  }
  function loadProgress() {
    if (!profile) return Promise.resolve();
    var cache = readCache();
    var cacheOk = cache && session && cache.userId === session.user.id && cache.profileId === profile.id;
    return api('/rest/v1/progress?profile_id=eq.' + encodeURIComponent(profile.id) + '&select=data,updated_at').then(function (rows) {
      var row = Array.isArray(rows) ? rows[0] : null;
      var remote = normalizeData(row && row.data);
      if (cacheOk) {
        var merged = mergeData(cache.base, cache.data, remote);
        installData(merged);
        if (JSON.stringify(cloudData) !== JSON.stringify(remote)) schedulePush();
      } else {
        installData(remote);
      }
      reconcileSelection();
    }, function (err) {
      if (cacheOk) adoptCloud(cache.data, cache.base || cache.data);
      else throw err;
      reconcileSelection();
    });
  }
  function schedulePush() {
    writeCache();
    if (mode !== 'cloud' || !profile || !session) return;
    if (cloudProfileId && profile.id !== cloudProfileId) return;
    clearTimeout(pushTimer);
    var pid = profile.id;
    pushTimer = setTimeout(function () { pushNow(pid); }, 700);
  }
  function pushNow(pid) {
    clearTimeout(pushTimer);
    if (mode !== 'cloud' || !profile || !session) return Promise.resolve();
    if (pid && pid !== profile.id) return Promise.resolve();
    if (cloudProfileId && profile.id !== cloudProfileId) return Promise.resolve();
    return api('/rest/v1/progress?on_conflict=profile_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: { profile_id: profile.id, user_id: session.user.id, data: cloudData }
    }).then(function () {
      cloudBase = clone(cloudData);
      writeCache();
    }, function () {
      clearTimeout(pushTimer);
      var again = profile.id;
      pushTimer = setTimeout(function () { pushNow(again); }, 8000);
    });
  }
  function pull() {
    if (pulling || mode !== 'cloud' || !profile) return;
    if (cloudProfileId && profile.id !== cloudProfileId) return;
    pulling = true;
    var pid = profile.id;
    api('/rest/v1/progress?profile_id=eq.' + encodeURIComponent(pid) + '&select=data,updated_at').then(function (rows) {
      if (profile.id !== pid) return;
      var row = Array.isArray(rows) ? rows[0] : null;
      var remote = normalizeData(row && row.data);
      var merged = mergeData(cloudBase, cloudData, remote);
      var sameRemote = JSON.stringify(merged) === JSON.stringify(remote);
      installData(merged);
      if (!sameRemote) schedulePush();
    }).then(function () { pulling = false; }, function () { pulling = false; });
  }
  function startPoll() {
    if (pollTimer) return;
    pollTimer = setInterval(function () {
      if (typeof document !== 'undefined' && document.hidden) return;
      pull();
    }, 20000);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) pull();
      });
    }
  }
  function reconcileSelection() {
    var cur = [];
    var pending = null;
    function add(id) {
      if (courseIdOk(id) && cur.indexOf(id) < 0) cur.push(id);
    }
    try { pending = readJson(PENDING_KEY); } catch (e) {}
    if (pending && profile && pending.profileId === profile.id) {
      listIds(pending.courses).forEach(add);
      try { localStorage.removeItem(PENDING_KEY); } catch (e2) {}
    }
    (profile && profile.courses || []).forEach(add);
    (cloudData.selected || []).forEach(add);
    if (currentTrack && COURSES[currentTrack]) add(currentTrack);
    if (!profile || mode !== 'cloud') {
      cloudData.selected = cur.slice();
      return;
    }
    var cloudSame = sameSet(cur, cloudData.selected);
    var profileSame = sameSet(cur, profile.courses);
    if (cloudSame && profileSame) return;
    if (!cloudSame) {
      cloudData.selected = cur.slice();
      cloudData.selectedAt = Date.now();
      schedulePush();
    }
    profile.courses = cur.slice();
    if (view && view.profile && view.profile.id === profile.id) view.profile.courses = cur.slice();
    view.courses = cur.slice();
    writeCache();
    if (!profileSame && coursesColumn) {
      patchProfile({ track: profile.track, courses: cur.slice() }).then(function () {}, function (err) {
        if (columnMissing(err)) coursesColumn = false;
      });
    }
  }

  function fillFromGuest(track) {
    var data = emptyData();
    if (COURSES[track]) data.tracks[track] = readGuest(track);
    installData(data);
  }
  function viewOf(track, needsProfile, suggested) {
    var tr = track && cloudData.tracks[track] ? cloudData.tracks[track] : emptyTrack();
    var course = COURSES[track] || null;
    if (track && !cloudData.tracks[track]) cloudData.tracks[track] = tr;
    view.track = track || '';
    view.file = course ? course.file : '';
    view.mode = mode;
    view.needsProfile = !!needsProfile;
    view.configured = !!config;
    view.suggestedTrack = suggested || '';
    view.user = session ? { id: session.user.id, email: session.user.email } : null;
    view.profile = profile ? publicProfile(profile) : null;
    view.profiles = profiles.map(publicProfile);
    view.courses = profile ? (profile.courses || []).slice() : (track ? [track] : []);
    view.catalog = courseList();
    view.keys = track ? storageKeys(track) : null;
    view.done = tr.done;
    view.missions = tr.missions;
    view.position = tr.position;
    view.theme = tr.theme;
    view.autoplay = tr.autoplay;
    view.label = course ? course.title : '';
    view.pageTitle = course ? course.pageTitle : 'BiliPicks';
    view.ages = course ? course.ages : '';
    view.blurb = course ? course.blurb : '';
    return view;
  }

  function save(patch) {
    if (!currentTrack || !cloudData.tracks[currentTrack]) return;
    var tr = cloudData.tracks[currentTrack];
    patch = patch || {};
    if (patch.done && patch.done !== tr.done) copyInto(tr.done, patch.done);
    if (patch.missions && patch.missions !== tr.missions) copyInto(tr.missions, patch.missions);
    if (patch.position && patch.position !== tr.position) copyInto(tr.position, patch.position);
    if (typeof patch.autoplay === 'boolean') {
      tr.autoplay = patch.autoplay;
      tr.autoplayAt = Date.now();
    }
    if (patch.theme === 'dark' || patch.theme === 'light') {
      tr.theme = patch.theme;
      tr.themeAt = Date.now();
    }
    if (mode === 'guest') writeGuest(currentTrack);
    else schedulePush();
  }
  function patchProfile(body) {
    return api('/rest/v1/profiles?id=eq.' + encodeURIComponent(profile.id), {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: body
    });
  }
  function saveSelection(track, courseList, andGo) {
    var selected, body, sameProfile;
    if (!COURSES[track]) return Promise.resolve({ ok: false, error: t('err.noCourse', '没有这门课。') });
    selected = listIds(courseList);
    if (selected.indexOf(track) < 0) selected.unshift(track);
    rememberTrack(track);
    if (mode !== 'cloud' || !profile || !session) {
      if (andGo) location.href = urlWithTrack(track);
      return Promise.resolve({ ok: true, track: track });
    }
    sameProfile = cloudProfileId === profile.id;
    body = { track: track };
    if (coursesColumn) body.courses = selected.slice();
    function afterPatch() {
      profile.track = track;
      profile.courses = selected.slice();
      if (view.profile && view.profile.id === profile.id) {
        view.profile.track = track;
        view.profile.courses = selected.slice();
      }
      view.courses = selected.slice();
      if (sameProfile) {
        cloudData.selected = selected.slice();
        cloudData.selectedAt = Date.now();
        writeCache();
        return pushNow(profile.id);
      }
      // 新建或刚换的档案还没装进这份进度。不要把上一个孩子的缓存写到新 id 上。
      try { localStorage.removeItem(CACHE_KEY); } catch (e0) {}
      try { localStorage.setItem(PENDING_KEY, JSON.stringify({ profileId: profile.id, courses: selected })); } catch (e) {}
      return null;
    }
    return patchProfile(body).then(afterPatch, function (err) {
      if (!(coursesColumn && columnMissing(err))) throw err;
      coursesColumn = false;
      return patchProfile({ track: track }).then(afterPatch);
    }).then(function () {
      if (andGo) location.href = urlWithTrack(track);
      return { ok: true, track: track };
    }, function (err) {
      return { ok: false, error: friendly(err) };
    });
  }
  function setTrack(track) {
    var selected = [];
    if (profile && profile.courses) selected = selected.concat(profile.courses);
    if (cloudData && cloudData.selected) selected = selected.concat(cloudData.selected);
    return saveSelection(track, selected, true);
  }
  function signUp(email, password) {
    var bad = checkEmailPassword(email, password);
    if (bad) return Promise.resolve({ ok: false, error: bad });
    if (!config) return Promise.resolve({ ok: false, error: unconfigured() });
    return api('/auth/v1/signup', {
      method: 'POST',
      token: config.anonKey,
      body: { email: String(email).trim(), password: String(password) }
    }).then(function (data) {
      if (captureSession(data)) return afterAuth();
      return { ok: true, confirm: true };
    }, function (err) {
      return { ok: false, error: friendly(err) };
    });
  }
  function signIn(email, password) {
    var bad = checkEmailPassword(email, password);
    if (bad) return Promise.resolve({ ok: false, error: bad });
    if (!config) return Promise.resolve({ ok: false, error: unconfigured() });
    return api('/auth/v1/token?grant_type=password', {
      method: 'POST',
      token: config.anonKey,
      body: { email: String(email).trim(), password: String(password) }
    }).then(function (data) {
      if (!captureSession(data)) return { ok: false, error: t('err.confirmEmail', '登录没有返回会话，请到邮箱确认后再试。') };
      mode = 'cloud';
      return afterAuth();
    }, function (err) {
      return { ok: false, error: friendly(err) };
    });
  }
  function afterAuth() {
    mode = 'cloud';
    return loadProfiles().then(function () {
      view.mode = 'cloud';
      view.configured = true;
      view.catalog = courseList();
      view.user = session ? { id: session.user.id, email: session.user.email } : null;
      view.profile = profile ? publicProfile(profile) : null;
      view.profiles = profiles.map(publicProfile);
      view.needsProfile = !profile;
      view.courses = profile ? profile.courses.slice() : [];
      return { ok: true, needsProfile: !profile, profile: view.profile };
    });
  }
  function signOut() {
    var job = session && config
      ? api('/auth/v1/logout', { method: 'POST', body: {} }).catch(function () {})
      : Promise.resolve();
    clearTimeout(pushTimer);
    return job.then(function () {
      clearAuth();
      try { localStorage.removeItem(PROFILE_KEY); } catch (e) {}
      try { localStorage.removeItem(CACHE_KEY); } catch (e2) {}
      location.reload();
    });
  }
  function createProfile(name, track, courseList, opts) {
    var shown = String(name || '').replace(/\s+/g, ' ').trim();
    var bad = checkName(shown);
    var selected, body, keep, activate;
    opts = opts || {};
    if (bad) return Promise.resolve({ ok: false, error: bad });
    selected = listIds(courseList);
    if (!COURSES[track]) track = selected.length && COURSES[selected[0]] ? selected[0] : suggestedOr('jh');
    if (selected.indexOf(track) < 0) selected.unshift(track);
    if (!session) return Promise.resolve({ ok: false, error: t('err.needLogin', '请先登录。') });
    keep = profile;
    // 已经有当前孩子时，档案管理里新增不必把他换成当前，也不要掐掉正在上传的进度。
    activate = !keep || opts.activate !== false;
    if (activate) clearTimeout(pushTimer);
    body = { user_id: session.user.id, display_name: shown, track: track };
    if (coursesColumn) body.courses = selected.slice();
    return api('/rest/v1/profiles', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: body
    }).then(function (rows) {
      var row = Array.isArray(rows) ? rows[0] : null;
      var created;
      if (!row) return { ok: false, error: t('err.profileFailed', '没有建成档案，请稍后再试。') };
      if (!row.courses) row.courses = selected.slice();
      created = normalizeProfile(row);
      if (!created.courses.length) created.courses = selected.slice();
      profiles.push(created);
      if (activate) {
        profile = created;
        mode = 'cloud';
        view.courses = profile.courses.slice();
        try { localStorage.setItem(PROFILE_KEY, profile.id); } catch (e) {}
        try { localStorage.setItem(PENDING_KEY, JSON.stringify({ profileId: profile.id, courses: profile.courses })); } catch (e2) {}
      }
      view.needsProfile = !profile;
      view.mode = 'cloud';
      view.profile = profile ? publicProfile(profile) : null;
      view.profiles = profiles.map(publicProfile);
      return { ok: true, profile: publicProfile(created), active: !!(profile && profile.id === created.id) };
    }, function (err) {
      if (coursesColumn && columnMissing(err)) {
        coursesColumn = false;
        return createProfile(shown, track, selected, opts);
      }
      return { ok: false, error: friendly(err) };
    });
  }
  function suggestedOr(fallback) {
    return view.suggestedTrack || currentTrack || rememberedTrack() || fallback;
  }
  function selectProfile(id) {
    var i, next = null, track = '';
    for (i = 0; i < profiles.length; i++) if (profiles[i].id === id) next = profiles[i];
    if (!next) return;
    clearTimeout(pushTimer);
    profile = next;
    cloudProfileId = '';
    try { localStorage.setItem(PROFILE_KEY, next.id); } catch (e) {}
    if (COURSES[next.track]) track = next.track;
    if (!track && next.courses) {
      for (i = 0; i < next.courses.length; i++) if (COURSES[next.courses[i]]) { track = next.courses[i]; break; }
    }
    if (!track) track = rememberedTrack() || 'jh';
    rememberTrack(track);
    location.href = urlWithTrack(track);
  }
  function loadProfileProgress(id) {
    if (!session) return Promise.resolve({ ok: false, error: t('err.needLogin', '请先登录。') });
    if (profile && profile.id === id) return Promise.resolve({ ok: true, data: normalizeData(clone(cloudData)) });
    return api('/rest/v1/progress?profile_id=eq.' + encodeURIComponent(id) + '&select=data,updated_at').then(function (rows) {
      var row = Array.isArray(rows) ? rows[0] : null;
      return { ok: true, data: normalizeData(row && row.data) };
    }, function (err) {
      return { ok: false, error: friendly(err) };
    });
  }
  // 进度表用外键挂在档案上，并设置了 on delete cascade。删掉档案这一行，云端进度跟着走。
  // 这里不清理访客记在这台设备上的进度。
  function deleteProfile(id) {
    clearTimeout(pushTimer);
    return api('/rest/v1/profiles?id=eq.' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' }
    }).then(function () {
      if (profile && profile.id === id) {
        try { localStorage.removeItem(PROFILE_KEY); } catch (e) {}
        try { localStorage.removeItem(CACHE_KEY); } catch (e2) {}
      }
      location.reload();
      return { ok: true };
    }, function (err) {
      return { ok: false, error: friendly(err) };
    });
  }
  function mergePlan() {
    var courses = [];
    var plan;
    if (mode !== 'cloud' || !profile || !session) return null;
    if (!guestHasProgress()) return null;
    if (guestFingerprint() === readMergeMark()) return null;
    plan = { courses: courses, profileId: profile.id, profiles: view.profiles.slice(), g1: 0, jh: 0 };
    courseIds().forEach(function (id) {
      var n = countTrack(readGuest(id));
      plan[id] = n;
      if (n) courses.push({ id: id, title: COURSES[id].title, count: n });
    });
    if (!courses.length) return null;
    return plan;
  }
  function attachCourse(pid, trackId, remote) {
    var list = listIds(remote.selected);
    var row = null;
    var i, courses, body;
    if (list.indexOf(trackId) < 0) list.push(trackId);
    remote.selected = list;
    remote.selectedAt = Date.now();
    for (i = 0; i < profiles.length; i++) if (profiles[i].id === pid) row = profiles[i];
    if (!coursesColumn) return Promise.resolve();
    courses = listIds(row && row.courses);
    if (courses.indexOf(trackId) < 0) courses.push(trackId);
    if (row && sameSet(courses, row.courses)) return Promise.resolve();
    body = { courses: courses };
    if (row && row.track) body.track = row.track;
    return api('/rest/v1/profiles?id=eq.' + encodeURIComponent(pid), {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: body
    }).then(function () {
      if (row) row.courses = courses;
    }, function (err) {
      if (columnMissing(err)) coursesColumn = false;
    });
  }
  function mergeGuest(choices) {
    choices = choices || {};
    var byProfile = {};
    clearTimeout(pushTimer);
    courseIds().forEach(function (track) {
      var pid = choices[track];
      var guest;
      if (!pid) return;
      guest = readGuest(track);
      if (!countTrack(guest)) return;
      if (!byProfile[pid]) byProfile[pid] = {};
      byProfile[pid][track] = guest;
    });
    var chain = Promise.resolve();
    Object.keys(byProfile).forEach(function (pid) {
      chain = chain.then(function () {
        return api('/rest/v1/progress?profile_id=eq.' + encodeURIComponent(pid) + '&select=data').then(function (rows) {
          var row = Array.isArray(rows) ? rows[0] : null;
          var remote = normalizeData(row && row.data);
          var trackId;
          var sub = Promise.resolve();
          if (profile && pid === profile.id) remote = mergeData(cloudBase, cloudData, remote);
          for (trackId in byProfile[pid]) {
            if (!Object.prototype.hasOwnProperty.call(byProfile[pid], trackId)) continue;
            remote.tracks[trackId] = mergeTrackState({}, remote.tracks[trackId], byProfile[pid][trackId]);
          }
          Object.keys(byProfile[pid]).forEach(function (id) {
            sub = sub.then(function () { return attachCourse(pid, id, remote); });
          });
          return sub.then(function () {
            return api('/rest/v1/progress?on_conflict=profile_id', {
              method: 'POST',
              headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
              body: { profile_id: pid, user_id: session.user.id, data: remote }
            }).then(function () {
              if (profile && pid === profile.id) installData(remote);
            });
          });
        });
      });
    });
    return chain.then(function () {
      writeMergeMark(guestFingerprint());
      if (currentTrack && view && typeof view.onChange === 'function') view.onChange(cloudData.tracks[currentTrack]);
      return { ok: true };
    }, function (err) {
      return { ok: false, error: friendly(err) };
    });
  }
  function dismissMerge() {
    writeMergeMark(guestFingerprint());
  }

  var view = {
    onChange: null,
    save: save,
    setTrack: setTrack,
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    createProfile: createProfile,
    selectProfile: selectProfile,
    deleteProfile: deleteProfile,
    loadProfileProgress: loadProfileProgress,
    mergePlan: mergePlan,
    mergeGuest: mergeGuest,
    dismissMerge: dismissMerge,
    mergeTrackState: mergeTrackState,
    catalog: courseList(),
    courses: [],
    TRACKS: COURSES,
    COURSES: COURSES
  };

  function boot() {
    var urlTrack = trackFromUrl();
    var remembered = rememberedTrack();
    migrateGuestStorage();
    if (!config) {
      mode = 'guest';
      currentTrack = urlTrack || remembered;
      if (urlTrack) rememberTrack(urlTrack);
      if (currentTrack) fillFromGuest(currentTrack);
      return viewOf(currentTrack, false, remembered);
    }
    return restoreSession().then(function (sess) {
      if (!sess) {
        mode = 'guest';
        currentTrack = urlTrack || remembered;
        if (urlTrack) rememberTrack(urlTrack);
        if (currentTrack) fillFromGuest(currentTrack);
        return viewOf(currentTrack, false, remembered);
      }
      mode = 'cloud';
      return loadProfiles().then(function () {
        if (!profile) {
          currentTrack = '';
          return viewOf('', true, urlTrack || remembered);
        }
        var stored = storedTrack(profile.track);
        var track = urlTrack || (COURSES[stored] ? stored : '') || remembered || 'jh';
        var patch = Promise.resolve();
        if (!COURSES[track]) track = 'jh';
        currentTrack = track;
        rememberTrack(track);
        if (urlTrack && stored !== urlTrack) {
          var courses = listIds(profile.courses);
          var body;
          if (courses.indexOf(urlTrack) < 0) courses.push(urlTrack);
          profile.courses = courses;
          body = { track: urlTrack };
          if (coursesColumn) body.courses = courses.slice();
          patch = patchProfile(body).then(function () {
            profile.track = urlTrack;
          }, function (err) {
            if (!(coursesColumn && columnMissing(err))) return;
            coursesColumn = false;
            return patchProfile({ track: urlTrack }).then(function () { profile.track = urlTrack; }, function () {});
          });
        }
        return patch.then(function () { return loadProgress(); }).then(function () {
          startPoll();
          return viewOf(track, false, track);
        });
      });
    }).catch(function () {
      mode = 'guest';
      currentTrack = urlTrack || remembered;
      if (currentTrack) fillFromGuest(currentTrack);
      view.offline = true;
      return viewOf(currentTrack, false, remembered);
    });
  }

  function open() {
    if (!opened) opened = loadConfig().then(function (cfg) { config = cfg; return boot(); });
    return opened;
  }

  global.BiliPicksAccount = {
    peekTrack: peekTrack,
    fileFor: fileFor,
    urlWithTrack: urlWithTrack,
    open: open,
    mergeTrackState: mergeTrackState,
    mergeData: mergeData,
    courseList: courseList,
    filterProfiles: filterProfiles,
    profileCourseIds: profileCourseIds,
    learningRecord: learningRecord,
    migrateGuestStorage: migrateGuestStorage,
    COURSES: COURSES,
    TRACKS: COURSES,
    STAGES: STAGES,
    UPCOMING: UPCOMING
  };
})(typeof window !== 'undefined' ? window : this);
