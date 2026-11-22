// 用 node account-profiles.test.js 检查档案管理：列表、学习记录、删除不会动访客进度。不访问网络。
const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(__dirname + '/account.js', 'utf8');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const tv = fs.readFileSync(__dirname + '/tv.html', 'utf8');
const schema = fs.readFileSync(__dirname + '/supabase/schema.sql', 'utf8');
const context = { window: {}, console };
context.window = context;
vm.createContext(context);
vm.runInContext(code, context);
const api = context.BiliPicksAccount;

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL', msg);
    process.exitCode = 1;
  }
}

const kids = [
  { id: '1', display_name: '晨宝' },
  { id: '2', display_name: '弟弟' },
  { id: '3', display_name: '晨曦' }
];
const hit = api.filterProfiles(kids, '晨');
assert(hit.length === 2 && hit[0].display_name === '晨宝' && hit[1].display_name === '晨曦', 'name filter keeps matching nicknames');
assert(api.filterProfiles(kids, '弟弟').length === 1, 'name filter can select one child');
assert(api.filterProfiles(kids, '  ').length === 3, 'blank filter lists every child');
assert(api.filterProfiles(kids, '宝弟').length === 0, 'unrelated query lists nobody');
assert(api.filterProfiles(kids, ' 晨 宝 ').length === 1, 'spaces in the query still match the nickname');

const record = api.learningRecord(
  { id: 'p1', display_name: '晨宝', track: 'jh', courses: ['jh', 'g1'] },
  {
    tracks: {
      jh: {
        done: { BV1: 20, BV2: 10 },
        position: { BV2: { t: 15, at: 5 }, BV3: { t: 40, at: 30 } }
      },
      g1: { done: {}, position: {} }
    }
  },
  { BV1: '甲', BV2: '乙', BV3: '丙' }
);
assert(record.name === '晨宝', 'record keeps the nickname');
assert(record.courses.length === 2, 'enrolled courses are listed even with no plays');
assert(record.courses[0].id === 'jh' && record.courses[0].title === '初中生学 AI', 'current course title comes from the catalog');
assert(record.courses[0].completedCount === 2 && record.courses[0].videoCount === 3, 'watched and completed videos are counted');
assert(record.courses[0].enrolled === true, 'a selected course stays enrolled');
const done1 = record.courses[0].videos.filter(v => v.id === 'BV1')[0];
const half = record.courses[0].videos.filter(v => v.id === 'BV3')[0];
assert(done1.completed && done1.title === '甲' && done1.completedAt === 20, 'completed video keeps its title and time');
assert(!half.completed && half.positionSeconds === 40, 'a video with only a position is not marked finished');
assert(record.courses[0].last && record.courses[0].last.id === 'BV3' && record.courses[0].last.seconds === 40, 'latest position is the last watch');
assert(record.courses[1].id === 'g1' && record.courses[1].completedCount === 0 && record.courses[1].last === null, 'the other enrolled course keeps an empty record');

const extra = api.learningRecord(
  { display_name: '晨宝', track: 'g1', courses: ['g1'] },
  { tracks: { jh: { done: { BV9: 3 }, position: { BV9: { t: 8, at: 4 } } } } },
  {}
);
const extraJh = extra.courses.filter(c => c.id === 'jh')[0];
assert(extra.courses[0].id === 'g1' && extra.courses[0].enrolled, 'enrolled course stays first');
assert(extraJh && extraJh.enrolled === false && extraJh.completedCount === 1 && extraJh.last.seconds === 8, 'progress outside the course list is still shown');
assert(!Object.prototype.hasOwnProperty.call(record, 'phone') && !Object.prototype.hasOwnProperty.call(record, 'school'), 'records are not a new profile form');

const ids = api.profileCourseIds({ track: 'jh', courses: ['g1'] });
assert(ids[0] === 'jh' && ids.indexOf('g1') >= 0, 'the saved course stays with the child when listing courses');

const delStart = code.indexOf('function deleteProfile');
const delEnd = code.indexOf('function mergePlan');
const del = code.slice(delStart, delEnd);
assert(del.indexOf("method: 'DELETE'") >= 0, 'delete sends DELETE');
assert(del.indexOf('/rest/v1/profiles?id=eq.') >= 0, 'delete removes the profile row');
assert(del.indexOf('bilipicks-g1') < 0 && del.indexOf('bilipicks-jh') < 0, 'delete does not touch guest course keys');
assert(del.indexOf('PROFILE_KEY') >= 0 && del.indexOf('CACHE_KEY') >= 0, 'the current profile cache is cleared after delete');
assert(/profile_id uuid primary key references public\.profiles \(id\) on delete cascade/.test(schema), 'progress rows are removed with the profile');

assert(code.indexOf('function setCourses') < 0, 'course list editing is not an account action');
assert(code.indexOf('opts.activate !== false') >= 0, 'adding a child can leave the current child selected');

const sw = html.slice(html.indexOf('function renderSwitcher'), html.indexOf('function manageItem'));
assert(sw.indexOf('档案管理') >= 0, 'everyday sheet opens 档案管理');
assert(sw.indexOf('删除') < 0 && sw.indexOf('调整') < 0, 'everyday sheet has no delete and no course editor');
assert(html.indexOf('调整') < 0 && html.indexOf('setCourses') < 0 && html.indexOf('course-edit') < 0, 'the site no longer offers course adjustment');
assert(html.indexOf('查找称呼') >= 0 && html.indexOf('>新增<') >= 0, 'management can filter and add');
assert(html.indexOf('学习记录') >= 0 && html.indexOf('id="delete-confirm"') >= 0, 'records and confirmed delete live in management');
assert(html.split('个人信息保护法').length === 2, 'the under-14 note stays on the login form only');
assert(html.indexOf('id="gate-choices"') >= 0, 'the first screen still lists courses');
assert(html.indexOf('课程中心') >= 0, 'the first screen is the course center');
assert(html.indexOf('正在准备') >= 0, 'upcoming courses are marked as being prepared');
assert(html.indexOf('class="choice soon"') >= 0 || html.indexOf("soon ? ' soon'") >= 0 || html.indexOf("soon ? ' soon' : ''") >= 0, 'upcoming cards use the soon style');
assert(html.indexOf('github.io') >= 0 && html.indexOf("location.protocol === 'file:'") >= 0, 'lan probe still skips github.io and file');

assert(tv.indexOf('deleteProfile') < 0 && tv.indexOf('setCourses') < 0 && tv.indexOf('调整') < 0, 'tv settings do not adjust courses or delete a profile');
assert(tv.indexOf('档案管理') >= 0, 'tv points profile changes to the website');
assert(tv.indexOf('换一门课') >= 0, 'tv can still pick a course');

const reSrc = (html.match(/const re = (\/[\s\S]*?\/g);/) || [])[1];
assert(reSrc, 'title scan exists');
const re = eval(reSrc);
const sample = '{"id": "BV1abc", "title": "小熊猫"} {"id": "BVx", "title": "他说\\"你好\\""}';
const found = {};
let m;
while ((m = re.exec(sample))) found[m[1]] = JSON.parse('"' + m[2] + '"');
assert(found.BV1abc === '小熊猫' && found.BVx === '他说"你好"', 'catalog titles can be read without running the catalog script');

if (!process.exitCode) console.log('profiles ok');
