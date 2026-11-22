// 用 node account-merge.test.js 检查进度合并。不访问网络。
const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(__dirname + '/account.js', 'utf8');
const context = { window: {}, console };
context.window = context;
vm.createContext(context);
vm.runInContext(code, context);
const merge = context.BiliPicksAccount.mergeTrackState;

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL', msg);
    process.exitCode = 1;
  }
}

const union = merge(
  {},
  { done: { a: 1 }, missions: {}, position: {} },
  { done: { b: 2 }, missions: { 1: 3 }, position: {} }
);
assert(union.done.a === 1 && union.done.b === 2, 'union keeps both done marks');
assert(union.missions[1] === 3, 'union keeps guest mission');

const newer = merge(
  { done: { a: 1 } },
  { done: { a: 4 } },
  { done: { a: 9 } }
);
assert(newer.done.a === 9, 'newer timestamp wins');

const localDelete = merge(
  { done: { a: 5 } },
  { done: {} },
  { done: { a: 5 } }
);
assert(!localDelete.done.a, 'unchanged remote does not restore a local unmark');

const remoteRemark = merge(
  { done: { a: 5 } },
  { done: {} },
  { done: { a: 8 } }
);
assert(remoteRemark.done.a === 8, 'a newer remote mark survives a local unmark');

const remoteAdd = merge(
  { done: { a: 1 } },
  { done: { a: 1 } },
  { done: { a: 1, b: 2 } }
);
assert(remoteAdd.done.b === 2, 'remote addition is kept');

const cloudAuto = merge(
  {},
  { autoplay: true, autoplayAt: 10 },
  { autoplay: false, autoplayAt: 0 }
);
assert(cloudAuto.autoplay === true, 'newer cloud autoplay wins over an older guest value');

const fillAuto = merge(
  {},
  { autoplay: null },
  { autoplay: false, autoplayAt: 0 }
);
assert(fillAuto.autoplay === false, 'guest autoplay fills an empty cloud value');

const pos = merge(
  {},
  { position: { a: { t: 3, at: 1 } } },
  { position: { a: { t: 20, at: 9 } } }
);
assert(pos.position.a.t === 20, 'later watch position wins');

if (!process.exitCode) console.log('merge ok');
