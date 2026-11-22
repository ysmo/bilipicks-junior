// 用 node account-config.test.js 检查配置加载顺序。不访问网络。
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, 'account.js'), 'utf8');
const publicSrc = fs.readFileSync(path.join(__dirname, 'config.public.js'), 'utf8');

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL', msg);
    process.exitCode = 1;
  }
}

function payloadOf(jwt) {
  return JSON.parse(Buffer.from(String(jwt).split('.')[1], 'base64url').toString('utf8'));
}

const publicCode = publicSrc.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
assert(!/service_role/i.test(publicCode), 'public config must not contain a service_role key');
assert(!/sb_secret/i.test(publicCode), 'public config must not contain a secret key');

const pubBox = { window: {} };
pubBox.window = pubBox;
vm.runInNewContext(publicSrc, pubBox);
const pub = pubBox.window.BILIPICKS_CONFIG;
assert(pub.supabaseUrl === 'https://gqcyngwpvuxteqncygoz.supabase.co', 'public url');
const pubPayload = payloadOf(pub.supabaseAnonKey);
assert(pubPayload.role === 'anon', 'public key role is anon');
assert(pubPayload.ref === 'gqcyngwpvuxteqncygoz', 'public key ref matches the project');

const USABLE = {
  supabaseUrl: 'https://override.example.supabase.co',
  supabaseAnonKey: 'abcdefghijklmnopqrstuvwxyz012345'
};
const LOCALHOST = {
  supabaseUrl: 'http://localhost:54321',
  supabaseAnonKey: 'abcdefghijklmnopqrstuvwxyz012345'
};

function openWith(opts) {
  const requested = [];
  const storage = Object.create(null);
  const context = {
    console: console,
    URL: URL,
    URLSearchParams: URLSearchParams,
    Promise: Promise,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    location: { search: '', href: 'http://127.0.0.1/', pathname: '/' },
    localStorage: {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null; },
      setItem: function (k, v) { storage[k] = String(v); },
      removeItem: function (k) { delete storage[k]; }
    },
    document: {
      hidden: false,
      head: {
        appendChild: function (el) {
          requested.push(el.src);
          const spec = opts.files[el.src];
          if (!spec) {
            if (el.onerror) el.onerror();
            return el;
          }
          if (typeof spec === 'function') spec(context);
          if (el.onload) el.onload();
          return el;
        }
      },
      createElement: function () {
        return { src: '', onload: null, onerror: null };
      },
      addEventListener: function () {}
    }
  };
  context.window = context;
  if (opts.preset) context.BILIPICKS_CONFIG = opts.preset;
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.BiliPicksAccount.open().then(function (view) {
    return { view: view, requested: requested, config: context.BILIPICKS_CONFIG };
  });
}

function assign(cfg) {
  return function (context) { context.BILIPICKS_CONFIG = cfg; };
}

const cases = [
  openWith({ preset: USABLE, files: {} }).then(function (r) {
    assert(r.view.configured === true, 'preset usable config is used');
    assert(r.requested.length === 0, 'preset usable config does not load scripts');
    assert(r.config.supabaseUrl === USABLE.supabaseUrl, 'preset url is kept');
  }),
  openWith({
    preset: { supabaseUrl: '', supabaseAnonKey: '' },
    files: { 'config.js': assign(USABLE) }
  }).then(function (r) {
    assert(r.requested.join(',') === 'config.js', 'unusable preset still tries config.js and stops');
    assert(r.view.configured === true && r.config.supabaseUrl === USABLE.supabaseUrl, 'config.js overrides an empty preset');
  }),
  openWith({ files: {} }).then(function (r) {
    assert(r.requested.join(',') === 'config.js,config.public.js', 'missing config.js falls through to public');
    assert(r.view.configured === false, 'both missing stays guest');
  }),
  openWith({
    files: {
      'config.public.js': assign({
        supabaseUrl: 'https://gqcyngwpvuxteqncygoz.supabase.co',
        supabaseAnonKey: pub.supabaseAnonKey
      })
    }
  }).then(function (r) {
    assert(r.requested[0] === 'config.js' && r.requested[1] === 'config.public.js', '404 config.js then public');
    assert(r.view.configured === true, 'public config enables login');
    assert(payloadOf(r.config.supabaseAnonKey).role === 'anon', 'loaded public key is anon');
  }),
  openWith({
    files: {
      'config.js': assign({ supabaseUrl: 'https://x.supabase.co', supabaseAnonKey: '' }),
      'config.public.js': assign(USABLE)
    }
  }).then(function (r) {
    assert(r.requested.join(',') === 'config.js,config.public.js', 'empty config.js falls through');
    assert(r.config.supabaseUrl === USABLE.supabaseUrl, 'public config replaces empty local values');
  }),
  openWith({
    files: {
      'config.js': assign({ supabaseUrl: 'https://YOUR_PROJECT.supabase.co', supabaseAnonKey: 'YOUR_ANON_KEY_IS_LONG_ENOUGH' }),
      'config.public.js': assign(USABLE)
    }
  }).then(function (r) {
    assert(r.config.supabaseUrl === USABLE.supabaseUrl, 'YOUR_ placeholders are unusable');
  }),
  openWith({
    files: {
      'config.js': assign({ supabaseUrl: 'http://example.com', supabaseAnonKey: USABLE.supabaseAnonKey }),
      'config.public.js': assign(USABLE)
    }
  }).then(function (r) {
    assert(r.config.supabaseUrl === USABLE.supabaseUrl, 'non-local http is unusable');
  }),
  openWith({
    files: {
      'config.js': assign({ supabaseUrl: 'https://ok.supabase.co', supabaseAnonKey: 'short' }),
      'config.public.js': assign(USABLE)
    }
  }).then(function (r) {
    assert(r.config.supabaseUrl === USABLE.supabaseUrl, 'short keys are unusable');
  }),
  openWith({
    files: {
      'config.js': assign(LOCALHOST),
      'config.public.js': assign(USABLE)
    }
  }).then(function (r) {
    assert(r.requested.join(',') === 'config.js', 'usable localhost config.js stops the fallback');
    assert(r.config.supabaseUrl === LOCALHOST.supabaseUrl, 'localhost http stays allowed');
  }),
  openWith({ files: { 'config.js': assign(USABLE) } }).then(function (r) {
    assert(r.requested.join(',') === 'config.js', 'usable config.js does not load the public file');
    assert(r.view.configured === true, 'local override configures login');
  })
];

Promise.all(cases).then(function () {
  if (!process.exitCode) console.log('config ok');
}).catch(function (err) {
  console.error('FAIL', err);
  process.exitCode = 1;
});
