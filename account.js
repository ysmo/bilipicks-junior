/* BiliPicks 账号和进度。
   访客继续用原来的 localStorage（小学 bilipicks-g1-*，初中 bilipicks-jh-*）。
   公开页面用 config.public.js 里的 Supabase 网址和 anon 公钥；本机的 config.js 可以覆盖。
   只使用 anon 公钥。换一个 Supabase 项目，或换成同一套 Auth / REST 的服务时，改配置文件即可。
   电视版会加载这个文件，所以不用 ?. 、?? 这些较新的语法。 */
(function (global) {
  var TRACKS = {
    g1: { id: 'g1', label: '小学', title: '从好奇到会看', pageTitle: 'BiliPicks · 从好奇到会看', file: 'data-g1.js', prefix: 'bilipicks-g1' },
    jh: { id: 'jh', label: '初中', title: '从好奇到机器学习', pageTitle: 'BiliPicks · 从好奇到机器学习', file: 'data.js', prefix: 'bilipicks-jh' }
  };
  var TRACK_KEY = 'bilipicks-track';
  var AUTH_KEY = 'bilipicks-auth-v1';
  var PROFILE_KEY = 'bilipicks-profile-v1';
  var CACHE_KEY = 'bilipicks-cloud-v1';
  var MERGE_KEY = 'bilipicks-merge-v1';

  var config = null;
  var session = null;
  var profiles = [];
  var profile = null;
  var mode = 'guest';
  var currentTrack = '';
  var cloudData = emptyData();
  var cloudBase = emptyData();
  var opened = null;
  var refreshing = null;
  var pushTimer = null;
  var pollTimer = null;
  var pulling = false;

  function storageKeys(track) {
    var p = TRACKS[track].prefix;
    return {
      done: p + '-done-v1',
      missions: p + '-missions-v1',
      theme: p + '-theme',
      autoplay: p + '-autoplay',
      covers: p + '-covers-v1',
      position: p + '-pos-v1'
    };
  }

  function emptyTrack() {
    return { done: {}, missions: {}, position: {}, autoplay: null, autoplayAt: 0, theme: null, themeAt: 0 };
  }
  function emptyData() {
    return { tracks: { g1: emptyTrack(), jh: emptyTrack() } };
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
    if (tracks) {
      out.tracks.g1 = normalizeTrack(tracks.g1);
      out.tracks.jh = normalizeTrack(tracks.jh);
    }
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
  function mergeData(base, local, remote) {
    base = normalizeData(base);
    local = normalizeData(local);
    remote = normalizeData(remote);
    return {
      tracks: {
        g1: mergeTrackState(base.tracks.g1, local.tracks.g1, remote.tracks.g1),
        jh: mergeTrackState(base.tracks.jh, local.tracks.jh, remote.tracks.jh)
      }
    };
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
    var g1 = readGuest('g1');
    var jh = readGuest('jh');
    return [
      ids(g1.done), ids(g1.missions), ids(g1.position),
      ids(jh.done), ids(jh.missions), ids(jh.position)
    ].join('|');
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
  function trackFromUrl() {
    try { return normalizeTrackId(new URLSearchParams(location.search).get('track')); }
    catch (e) { return ''; }
  }
  function rememberedTrack() {
    try { return normalizeTrackId(localStorage.getItem(TRACK_KEY)); }
    catch (e) { return ''; }
  }
  function rememberTrack(track) {
    if (!TRACKS[track]) return;
    try { localStorage.setItem(TRACK_KEY, track); } catch (e) {}
  }
  function peekTrack() {
    return trackFromUrl() || rememberedTrack();
  }
  function fileFor(track) {
    return TRACKS[track] ? TRACKS[track].file : '';
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
        profile: { id: profile.id, display_name: profile.display_name, track: profile.track },
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
    return '';
  }
  function friendly(err) {
    var m = (err && err.message) ? String(err.message) : '';
    var low = m.toLowerCase();
    if (low.indexOf('already') >= 0 || low.indexOf('registered') >= 0 || low.indexOf('exists') >= 0) return '这个邮箱已经注册过，请直接登录。';
    if (low.indexOf('invalid login') >= 0 || low.indexOf('invalid_grant') >= 0 || low.indexOf('credentials') >= 0) return '邮箱或密码不对。';
    if (low.indexOf('password') >= 0 && (low.indexOf('short') >= 0 || low.indexOf('least') >= 0 || low.indexOf('weak') >= 0)) return '密码至少 6 位。';
    if (low.indexOf('email') >= 0 && (low.indexOf('valid') >= 0 || low.indexOf('invalid') >= 0)) return '这个邮箱看起来不对。';
    if (low.indexOf('rate') >= 0 || low.indexOf('too many') >= 0) return '试得太勤了，请稍后再试。';
    if (low.indexOf('failed to fetch') >= 0 || low.indexOf('network') >= 0 || low.indexOf('load failed') >= 0) return '连不上登录服务。可以继续用访客模式，进度先存在这台设备上。';
    if (!m) return '没有完成，请稍后再试。';
    return '没有完成：' + m;
  }
  function checkEmailPassword(email, password) {
    email = String(email || '').trim();
    password = String(password || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '请填写家长或监护人的邮箱。';
    if (password.length < 6) return '密码至少 6 位。';
    return '';
  }
  function checkName(name) {
    name = String(name || '').replace(/\s+/g, ' ').trim();
    if (!name) return '先写一个家里用的称呼，比如「姐姐」。';
    if (name.length > 24) return '称呼请短一点，24 个字以内。';
    if (name.indexOf('@') >= 0) return '称呼不用写邮箱。';
    if (/[0-9]{6,}/.test(name)) return '不要填写电话号码。';
    if (/\d{4}[-/.年]\d{1,2}/.test(name)) return '不要填写出生日期。';
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
  var UNCONFIGURED = '云端登录还没配置。公开页面用 config.public.js，本机的 config.js 可以覆盖它。';
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

  function loadProfiles() {
    return api('/rest/v1/profiles?select=id,display_name,track,created_at&order=created_at.asc').then(function (rows) {
      profiles = Array.isArray(rows) ? rows : [];
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
    });
  }
  // 页面拿着 done / missions / position 的对象引用。同步时只改里面的键，不换对象。
  function installData(next) {
    var prev = currentTrack ? JSON.stringify(cloudData.tracks[currentTrack]) : '';
    var id, dst, src;
    next = normalizeData(next);
    for (id in TRACKS) {
      if (!Object.prototype.hasOwnProperty.call(TRACKS, id)) continue;
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
    cloudBase = clone(cloudData);
    writeCache();
    if (currentTrack && prev !== JSON.stringify(cloudData.tracks[currentTrack]) && view && typeof view.onChange === 'function') {
      view.onChange(cloudData.tracks[currentTrack]);
    }
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
    }, function (err) {
      if (cacheOk) adoptCloud(cache.data, cache.base || cache.data);
      else throw err;
    });
  }
  function schedulePush() {
    writeCache();
    if (mode !== 'cloud' || !profile || !session) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushNow, 700);
  }
  function pushNow() {
    if (mode !== 'cloud' || !profile || !session) return Promise.resolve();
    return api('/rest/v1/progress?on_conflict=profile_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: { profile_id: profile.id, user_id: session.user.id, data: cloudData }
    }).then(function () {
      cloudBase = clone(cloudData);
      writeCache();
    }, function () {
      clearTimeout(pushTimer);
      pushTimer = setTimeout(pushNow, 8000);
    });
  }
  function pull() {
    if (pulling || mode !== 'cloud' || !profile) return;
    pulling = true;
    api('/rest/v1/progress?profile_id=eq.' + encodeURIComponent(profile.id) + '&select=data,updated_at').then(function (rows) {
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

  function fillFromGuest(track) {
    var data = emptyData();
    data.tracks[track] = readGuest(track);
    installData(data);
  }
  function viewOf(track, needsProfile, suggested) {
    var tr = track && cloudData.tracks[track] ? cloudData.tracks[track] : emptyTrack();
    view.track = track || '';
    view.file = track ? TRACKS[track].file : '';
    view.mode = mode;
    view.needsProfile = !!needsProfile;
    view.configured = !!config;
    view.suggestedTrack = suggested || '';
    view.user = session ? { id: session.user.id, email: session.user.email } : null;
    view.profile = profile ? { id: profile.id, display_name: profile.display_name, track: profile.track } : null;
    view.profiles = profiles.map(function (p) {
      return { id: p.id, display_name: p.display_name, track: p.track };
    });
    view.keys = track ? storageKeys(track) : null;
    view.done = tr.done;
    view.missions = tr.missions;
    view.position = tr.position;
    view.theme = tr.theme;
    view.autoplay = tr.autoplay;
    view.label = track ? TRACKS[track].label : '';
    view.pageTitle = track ? TRACKS[track].pageTitle : 'BiliPicks';
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
  function setTrack(track) {
    if (!TRACKS[track]) return;
    rememberTrack(track);
    var next = urlWithTrack(track);
    var job = Promise.resolve();
    if (mode === 'cloud' && profile && profile.track !== track) {
      job = api('/rest/v1/profiles?id=eq.' + encodeURIComponent(profile.id), {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: { track: track }
      }).then(function () { profile.track = track; }, function () {});
    }
    job.then(function () { location.href = next; }, function () { location.href = next; });
  }
  function signUp(email, password) {
    var bad = checkEmailPassword(email, password);
    if (bad) return Promise.resolve({ ok: false, error: bad });
    if (!config) return Promise.resolve({ ok: false, error: UNCONFIGURED });
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
    if (!config) return Promise.resolve({ ok: false, error: UNCONFIGURED });
    return api('/auth/v1/token?grant_type=password', {
      method: 'POST',
      token: config.anonKey,
      body: { email: String(email).trim(), password: String(password) }
    }).then(function (data) {
      if (!captureSession(data)) return { ok: false, error: '登录没有返回会话，请到邮箱确认后再试。' };
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
      view.user = session ? { id: session.user.id, email: session.user.email } : null;
      view.profile = profile ? { id: profile.id, display_name: profile.display_name, track: profile.track } : null;
      view.profiles = profiles.map(function (p) {
        return { id: p.id, display_name: p.display_name, track: p.track };
      });
      view.needsProfile = !profile;
      return { ok: true, needsProfile: !profile, profile: view.profile };
    });
  }
  function signOut() {
    var job = session && config
      ? api('/auth/v1/logout', { method: 'POST', body: {} }).catch(function () {})
      : Promise.resolve();
    return job.then(function () {
      clearAuth();
      try { localStorage.removeItem(PROFILE_KEY); } catch (e) {}
      try { localStorage.removeItem(CACHE_KEY); } catch (e2) {}
      location.reload();
    });
  }
  function createProfile(name, track) {
    var shown = String(name || '').replace(/\s+/g, ' ').trim();
    var bad = checkName(shown);
    if (bad) return Promise.resolve({ ok: false, error: bad });
    if (!TRACKS[track]) track = suggestedOr('jh');
    if (!session) return Promise.resolve({ ok: false, error: '请先登录。' });
    return api('/rest/v1/profiles', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: { user_id: session.user.id, display_name: shown, track: track }
    }).then(function (rows) {
      var row = Array.isArray(rows) ? rows[0] : null;
      if (!row) return { ok: false, error: '没有建成档案，请稍后再试。' };
      profile = row;
      profiles.push(row);
      mode = 'cloud';
      try { localStorage.setItem(PROFILE_KEY, row.id); } catch (e) {}
      return { ok: true, profile: row };
    }, function (err) {
      return { ok: false, error: friendly(err) };
    });
  }
  function suggestedOr(fallback) {
    return view.suggestedTrack || currentTrack || rememberedTrack() || fallback;
  }
  function selectProfile(id) {
    var i, next = null;
    for (i = 0; i < profiles.length; i++) if (profiles[i].id === id) next = profiles[i];
    if (!next) return;
    profile = next;
    try { localStorage.setItem(PROFILE_KEY, next.id); } catch (e) {}
    var track = TRACKS[next.track] ? next.track : 'jh';
    rememberTrack(track);
    location.href = urlWithTrack(track);
  }
  function deleteProfile(id) {
    return api('/rest/v1/profiles?id=eq.' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' }
    }).then(function () {
      if (profile && profile.id === id) {
        try { localStorage.removeItem(PROFILE_KEY); } catch (e) {}
        try { localStorage.removeItem(CACHE_KEY); } catch (e2) {}
      }
      location.reload();
    });
  }
  function mergePlan() {
    if (mode !== 'cloud' || !profile || !session) return null;
    var fp = guestFingerprint();
    if (!fp || fp === '|||||') return null;
    if (fp === readMergeMark()) return null;
    var g1 = countTrack(readGuest('g1'));
    var jh = countTrack(readGuest('jh'));
    if (!g1 && !jh) return null;
    return {
      g1: g1,
      jh: jh,
      profileId: profile.id,
      profiles: view.profiles.slice()
    };
  }
  function mergeGuest(choices) {
    choices = choices || {};
    var byProfile = {};
    clearTimeout(pushTimer);
    ['g1', 'jh'].forEach(function (track) {
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
          if (profile && pid === profile.id) remote = mergeData(cloudBase, cloudData, remote);
          for (trackId in byProfile[pid]) {
            if (!Object.prototype.hasOwnProperty.call(byProfile[pid], trackId)) continue;
            remote.tracks[trackId] = mergeTrackState({}, remote.tracks[trackId], byProfile[pid][trackId]);
          }
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
    mergePlan: mergePlan,
    mergeGuest: mergeGuest,
    dismissMerge: dismissMerge,
    mergeTrackState: mergeTrackState,
    TRACKS: TRACKS
  };

  function boot() {
    var urlTrack = trackFromUrl();
    var remembered = rememberedTrack();
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
        var track = urlTrack || (TRACKS[profile.track] ? profile.track : '') || remembered || 'jh';
        currentTrack = track;
        rememberTrack(track);
        var patch = (urlTrack && profile.track !== urlTrack)
          ? api('/rest/v1/profiles?id=eq.' + encodeURIComponent(profile.id), {
              method: 'PATCH',
              headers: { Prefer: 'return=minimal' },
              body: { track: urlTrack }
            }).then(function () { profile.track = urlTrack; }, function () {})
          : Promise.resolve();
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
    TRACKS: TRACKS
  };
})(typeof window !== 'undefined' ? window : this);
