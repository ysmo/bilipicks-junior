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

const mergeData = context.BiliPicksAccount.mergeData;
const kept = mergeData(
  {},
  { tracks: { jh: { done: { b: 2 } } } },
  { tracks: { g1: { done: { a: 9 } } } }
);
assert(kept.tracks.jh.done.b === 2, 'other course progress stays when this course syncs');
assert(kept.tracks.g1.done.a === 9, 'incoming course progress stays');

const extra = mergeData(
  {},
  { tracks: { extra: { done: { z: 4 } } } },
  { tracks: { g1: { done: { a: 1 } } } }
);
assert(extra.tracks.extra.done.z === 4, 'unknown course id is kept');

const sel = mergeData(
  {},
  { selected: ['g1', 'jh'], selectedAt: 10, tracks: { g1: { done: { a: 1 } } } },
  { tracks: { g1: { done: { a: 1 } } } }
);
assert(sel.selected.indexOf('g1') >= 0 && sel.selected.indexOf('jh') >= 0, 'selected courses survive a progress sync');

const newerSel = mergeData(
  { selected: ['g1'], selectedAt: 1 },
  { selected: ['g1'], selectedAt: 1 },
  { selected: ['g1', 'jh'], selectedAt: 20 }
);
assert(newerSel.selected.length === 2, 'newer course list wins');

const courses = context.BiliPicksAccount.COURSES;
assert(courses.g1.prefix === 'bilipicks-g1' && courses.g1.legacyPrefix === 'bilipicks-g1', 'grade-1 guest keys stay put');
assert(courses.jh.prefix === 'bilipicks-jh' && courses.jh.legacyPrefix === 'bilipicks-jh', 'junior guest keys stay put');
assert(courses.g1.title === '从好奇到会看', 'elementary course title');
assert(courses.jh.title === '初中生学 AI', 'junior course title');
assert(courses.y2 && courses.y2.title === '两岁看世界' && courses.y2.file === 'data-y2.js' && courses.y2.prefix === 'bilipicks-y2', 'toddler course is registered');
assert(courses.y2.stage === 'early' && courses.g1.stage === 'primary' && courses.jh.stage === 'junior', 'live courses have the right stage');
const stages = context.BiliPicksAccount.STAGES || [];
assert(stages.map(s => s.id).join(',') === 'early,primary,junior', 'STAGES has early, primary, junior in that order');
const catalog = context.BiliPicksAccount.courseList();
const catalogIds = catalog.map(c => c.id);
assert(catalogIds.join(',') === 'y2,g1,jh', 'courseList is the live courses only');
assert(catalogIds.indexOf('snd') < 0 && catalogIds.indexOf('why') < 0, 'upcoming ids stay out of the catalog');
assert(!courses.snd && !courses.why, 'upcoming courses are not in COURSES');
const upcoming = context.BiliPicksAccount.UPCOMING || [];
assert(upcoming.some(c => c.id === 'snd' && c.stage === 'early') && upcoming.some(c => c.id === 'why' && c.stage === 'primary'), 'upcoming courses are listed separately');
assert(catalog.every(c => c.stage), 'courseList exposes stage for the UI');
assert(code.indexOf("s.src = src") >= 0 && code.indexOf("loadScript('config.js'") >= 0 && code.indexOf("loadScript('config.public.js'") >= 0, 'loadConfig tries config.js then config.public.js');
assert(code.indexOf('service_role') < 0, 'account.js has no service role key');

context.localStorage = {
  store: {},
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(this.store, k) ? this.store[k] : null; },
  setItem: function (k, v) { this.store[k] = String(v); },
  removeItem: function (k) { delete this.store[k]; }
};
courses.demo = { id: 'demo', title: 'demo', prefix: 'bilipicks-c-demo', legacyPrefix: 'bilipicks-old-demo', file: 'data-demo.js' };
context.localStorage.setItem('bilipicks-old-demo-done-v1', '{"a":1}');
context.localStorage.setItem('bilipicks-c-demo-missions-v1', '{"kept":1}');
context.BiliPicksAccount.migrateGuestStorage();
assert(context.localStorage.getItem('bilipicks-c-demo-done-v1') === '{"a":1}', 'legacy guest key is copied');
assert(context.localStorage.getItem('bilipicks-old-demo-done-v1') === '{"a":1}', 'legacy guest key is not deleted');
assert(context.localStorage.getItem('bilipicks-c-demo-missions-v1') === '{"kept":1}', 'existing new key is not overwritten');
delete courses.demo;

if (!process.exitCode) console.log('merge ok');
