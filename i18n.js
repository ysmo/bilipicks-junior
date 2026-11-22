/* BiliPicks 中文 / English。
   用法：t('key')；课程、阶段和即将上线的课用 field(obj, 'title')。
   选择记在 localStorage 的 bilipicks-lang（zh 或 en）。
   没有保存过时，浏览器语言以 zh 开头用中文，否则用英文。
   电视版也会加载这个文件，所以不用 ?. 、?? 这些较新的语法。 */
(function (global) {
  var KEY = 'bilipicks-lang';
  var M = { zh: {}, en: {} };

  function add(key, zh, en) {
    M.zh[key] = zh;
    M.en[key] = en;
  }

  add('meta.description',
    'BiliPicks — 一个网站，很多门课。家长给孩子选课，比如「从好奇到会看」和「初中生学 AI」。没有推荐算法。',
    'BiliPicks — one site, many courses. A parent picks a course for a child, such as “From Curiosity to Looking Closely” or “AI for Middle School.” No recommendation algorithm.');
  add('logo.home', 'BiliPicks 首页', 'BiliPicks home');
  add('nav.main', '主导航', 'Main navigation');
  add('nav.home', '首页', 'Home');
  add('nav.path', '路线', 'Path');
  add('nav.watch', '播放', 'Watch');
  add('nav.channels', '频道', 'Channels');
  add('nav.tierList', '频道榜', 'Channel list');
  add('nav.about', '关于', 'About');
  add('cat.path', '成长路线', 'Learning path');
  add('search.placeholder', '搜视频、UP 主、分类', 'Search videos, creators, or topics');
  add('search.aria', '搜索', 'Search');
  add('action.pickCourse', '选课', 'Courses');
  add('action.signIn', '登录', 'Sign in');
  add('action.close', '关闭', 'Close');
  add('action.back', '返回', 'Back');
  add('track.menuLead', '换一门课不会清掉其他课已经看过的记录。', 'Switching courses does not erase progress on the others.');
  add('boot.loading', '正在打开…', 'Opening…');

  add('gate.title', '课程中心', 'Course Center');
  add('gate.lead', '按孩子现在的年纪挑一门课。家长看着选；每门课的进度分开留着。', "Pick a course for your child's age. A parent chooses; progress is saved separately for each course.");
  add('gate.titleProfile', '给孩子选课', 'Choose courses for your child');
  add('gate.leadProfile', '写一个家里的称呼，再选一门或多门课。不写姓名、学校、电话或生日。换课不会清掉已经看过的进度。', 'Add a household nickname, then pick one or more courses. No legal name, school, phone, or birthday. Switching courses does not erase progress.');
  add('gate.nickname', '这个孩子在家里怎么叫', 'What do you call this child at home');
  add('gate.nicknamePh', '比如：姐姐、弟弟。不是姓名', 'For example: Big Sister, Little Brother — not a legal name');
  add('gate.start', '用这些课开始', 'Start with these courses');
  add('gate.login', '家长登录 / 注册', 'Parent sign in / register');
  add('gate.foot', '两岁前除了视频通话，宜尽量少看屏幕。任何年纪都请家长一起挑、一起看。', 'Before age two, skip screens except video calls. At every age, pick and watch together.');
  add('gate.pickOne', '先选一门课。可以多选。', 'Pick at least one course. You can choose more than one.');
  add('gate.openFail', '没有打开这门课。', 'This course could not be opened.');
  add('badge.soon', '正在准备', 'Coming soon');
  add('soon.toast', '这门课还在挑选视频，好了会放进课程中心。', 'This course is still being curated. It will appear here when it is ready.');
  add('chips.aria', '分类', 'Topics');

  add('theme.toLight', '换成浅色', 'Switch to light');
  add('theme.toDark', '换成深色', 'Switch to dark');
  add('theme.toLightKey', '换成浅色（D）', 'Switch to light (D)');
  add('theme.toDarkKey', '换成深色（D）', 'Switch to dark (D)');

  add('watch.prev', '上一条', 'Previous');
  add('watch.next', '下一条', 'Next');
  add('watch.prevHint', '快捷键 K', 'Shortcut K');
  add('watch.nextHint', '快捷键 J', 'Shortcut J');
  add('watch.listHint', '快捷键 L', 'Shortcut L');
  add('watch.tvHint', '快捷键 T', 'Shortcut T');
  add('watch.autoplay', '自动播放', 'Autoplay');
  add('watch.list', '列表', 'List');
  add('watch.playlist', '播放列表', 'Playlist');
  add('watch.closeList', '关闭列表', 'Close list');
  add('watch.theater', '大屏模式', 'Theater');
  add('watch.mirror', '投屏', 'Mirror');
  add('watch.tvHintBar', '← → 切换，H 去 B 站看高清，Esc 退出', '← → to switch, H for HD on Bilibili, Esc to exit');
  add('watch.hd', '去 B 站看高清', 'Watch HD on Bilibili');
  add('watch.exitTheater', '退出大屏', 'Exit theater');
  add('watch.exitMirror', '退出投屏', 'Exit mirror');
  add('watch.castHint', '先点画面播放，再横过来。请用控制中心「屏幕镜像」。不要用视频右下角的隔空播放，那样电视通常只有声音。', 'Start playback first, then turn the phone sideways. Use Control Center “Screen Mirroring.” Don’t use the AirPlay icon in the corner of the video — the TV often gets sound only.');
  add('watch.seen', '✓ 看过', '✓ Watched');
  add('watch.parts', '{n} 集', '{n} parts');
  add('watch.markDone', '✓ 看完了', '✓ Watched');
  add('track.current', '当前课程：{name}', 'Current course: {name}');
  add('track.none', '未选', 'None yet');

  add('hero.allDone', '{n} 条全看完了，{stages} 关通关', 'You have finished {n} videos and all {stages} stages');
  add('hero.reviewPath', '回看整条路线', 'Review the whole path');
  add('hero.seePath', '看整条路线', 'See the whole path');
  add('hero.continue', '接着看', 'Continue');
  add('hero.start', '从第 1 关开始', 'Start at stage 1');
  add('hero.stageNo', '第 {n} 关', 'Stage {n}');
  add('hero.watched', '已看 {d} / {n}', 'Watched {d} / {n}');
  add('hero.total', '一共 {n} 条', '{n} videos in all');
  add('hero.g1Done', '这条路线看完了。以后想看的时候，再打开一条就好，看完就停。', 'You have finished this path. When you come back, open one video, then stop.');
  add('hero.jhDone', '接下来别停在看视频上：找一个你想解决的小问题，自己写代码试一试。', 'Don’t stop at watching. Pick a small problem you care about, and try writing some code.');

  add('account.create', '建档', 'Create a profile');
  add('account.createAria', '给孩子建档', 'Create a child profile');
  add('account.signInAria', '登录', 'Sign in');
  add('account.ariaNamed', '账号，当前是{name}', 'Account, currently {name}');
  add('account.manage', '档案管理', 'Manage profiles');
  add('account.findName', '查找称呼', 'Find a nickname');
  add('account.add', '新增', 'Add');
  add('account.records', '学习记录', 'Learning record');
  add('account.delete', '删除', 'Delete');
  add('account.noCourse', '还没选课', 'No course yet');
  add('account.mergeTitle', '合并这台设备上的进度', 'Merge progress from this device');
  add('account.merge', '合并', 'Merge');
  add('account.mergeSkip', '先不合并', 'Not now');
  add('account.mergeLead', '登录前记在这台设备上的进度，可以并进某个孩子的档案。云端已经有的记录会保留，不会被清掉。不同的课可以交给不同的孩子。', 'Progress saved on this device before you signed in can be merged into a child’s profile. What is already in the cloud is kept. Different courses can go to different children.');
  add('account.mergeFail', '没有合并成功', 'The merge did not finish.');
  add('account.switchFail', '没有换成这门课', 'Could not switch to this course.');

  add('err.emailTaken', '这个邮箱已经注册过，请直接登录。', 'This email is already registered. Please sign in.');
  add('err.badLogin', '邮箱或密码不对。', 'That email or password is not right.');
  add('err.passwordShort', '密码至少 6 位。', 'Use at least 6 characters for the password.');
  add('err.badEmail', '这个邮箱看起来不对。', 'This email does not look right.');
  add('err.tooMany', '试得太勤了，请稍后再试。', 'Too many tries. Please wait a moment.');
  add('err.offlineAuth', '连不上登录服务。可以继续用访客模式，进度先存在这台设备上。', 'Cannot reach the sign-in service. You can keep going as a guest; progress stays on this device for now.');
  add('err.failed', '没有完成，请稍后再试。', 'That did not finish. Please try again in a moment.');
  add('err.failedPrefix', '没有完成：', 'That did not finish: ');
  add('err.parentEmail', '请填写家长或监护人的邮箱。', 'Please enter a parent or guardian email.');
  add('err.needNickname', '先写一个家里用的称呼，比如「姐姐」。', 'First add a household nickname, such as “Big Sister.”');
  add('err.nicknameLong', '称呼请短一点，24 个字以内。', 'Please keep the nickname under 24 characters.');
  add('err.nicknameNotEmail', '称呼不用写邮箱。', 'Please don’t use an email as the nickname.');
  add('err.noPhone', '不要填写电话号码。', 'Please don’t enter a phone number.');
  add('err.noBirthday', '不要填写出生日期。', 'Please don’t enter a date of birth.');
  add('err.unconfigured', '云端登录还没配置。公开页面用 config.public.js，本机的 config.js 可以覆盖它。', 'Cloud sign-in is not configured yet. The public site uses config.public.js; a local config.js can override it.');
  add('err.noCourse', '没有这门课。', 'This course is not available.');
  add('err.confirmEmail', '登录没有返回会话，请到邮箱确认后再试。', 'Sign-in did not return a session. Please confirm the email, then try again.');
  add('err.needLogin', '请先登录。', 'Please sign in first.');
  add('err.profileFailed', '没有建成档案，请稍后再试。', 'The profile could not be created. Please try again in a moment.');
  add('err.cloudOffline', '刚才没连上云端', 'The cloud could not be reached just now.');
  add('err.unconfiguredShort', '云端登录还没配置。公开站用 config.public.js，本机 config.js 可覆盖', 'Cloud sign-in is not configured yet. The public site uses config.public.js; a local config.js can override it.');
  add('toast.confirmEmail', '请到邮箱里确认，然后再登录', 'Please confirm the email, then sign in.');
  add('toast.needNickname', '先在网页上给孩子起个称呼', 'First add a nickname for the child on the website.');
  add('lang.aria', '语言', 'Language');
  add('lang.zh', '中文', '中文');
  add('lang.en', 'English', 'English');

  add('about.title', '为什么做 BiliPicks', 'Why BiliPicks');
  add('about.introPrefix', '算法推荐很容易把孩子（和大人）带偏。这份清单是', 'Recommendation algorithms can pull a child (and an adult) off course. This list is a hand-picked Bilibili doorway, chosen by ');
  add('about.introMid', '给', ' for a child who is ');
  add('about.introSuffix', '的孩子手选的 B 站入口。', '.');
  add('about.aimJoin', '目标不是「无限刷」，而是', 'The aim is not endless scrolling, but to ');
  add('about.aimStrong', '点开就看、看完就停', 'open a video, watch it, and stop');
  add('about.how', '怎么用', 'How to use it');
  add('about.thisCourse', '这门课', 'This course');
  add('about.play', '播放', 'Playback');
  add('about.playBody', '一屏一条视频，滑到哪条就播哪条。不想自动播，点顶上的「自动播放」关掉，之后要点封面才播。', 'One video per screen; whatever you swipe to is what plays. To stop autoplay, turn off “Autoplay” at the top; after that, tap the cover to play.');
  add('about.playPages', '播放器是 B 站官方的站外播放器，没有改动。', 'The player is Bilibili’s official embed. It has not been modified.');
  add('about.playLan', '这一份发现了同站的播放代理，所以用页面自己的播放器，不打开 B 站。', 'This copy found a playback proxy on the same site, so it uses the page’s own player and does not open Bilibili.');
  add('about.done', '看完了', 'Watched');
  add('about.doneBody', '看完一条点「✓ 看完了」，路线会记进度。', 'After a video, tap “✓ Watched” so the path can keep your progress.');
  add('about.hd', '去 B 站看高清', 'Watch HD on Bilibili');
  add('about.hdBody', 'B 站限制站外播放器最高 480P，点「看完了」旁边这个按钮到 B 站播放，登录后可看 1080P。', 'Bilibili limits the embed to 480p. Use the button next to “Watched” to open it on Bilibili; after sign-in you can watch in 1080p.');
  add('about.dark', '深色模式', 'Dark mode');
  add('about.darkBody', '右上角的月亮。', 'The moon in the top right.');
  add('about.devices', '不同设备上', 'On different devices');
  add('about.computer', '电脑', 'Computer');
  add('about.phone', '手机、平板', 'Phone and tablet');
  add('about.castPhone', '手机投到电视', 'Phone to a TV');
  add('about.tvProj', '电视、投影仪', 'TV and projector');
  add('about.tvLink', '电视版', 'TV edition');
  add('about.computerTv', '电脑接电视、投屏', 'Computer to a TV');
  add('about.switchDevice', '换设备', 'Switching devices');
  add('about.reposts', '关于搬运的视频', 'About re-uploaded videos');
  add('about.before', '使用前请知道', 'Please know this before you start');
  add('about.leftOut', '没放进来的', 'What is left out');
  add('about.log', '更新记录', 'Update notes');
  add('about.tristan', '目录思路参考', 'The catalog idea follows');
  add('about.tristanAfter', '：人来挑，不靠推荐。本站不是 B 站官方产品。', ': a person chooses, not an algorithm. This site is not an official Bilibili product.');
  add('about.creditAdapt', '本站改编自实践哥 Li 的 MIT 开源项目', 'This site is adapted from Li’s MIT-licensed project');
  add('about.creditAdaptAfter', '，不是原作者的官方站点。原项目也可以复制一份改成你自己的清单：改', ', and is not the original author’s official site. You can also copy the original project and turn it into your own list: edit');
  add('about.creditAdaptEnd', '就行。', 'and you are on your way.');

  /* Longer about / help passages that keep the same links in HTML. */
  add('about.computerHtml',
    '用滚轮，或者按 <kbd>J</kbd> <kbd>K</kbd> 切换上一条下一条，切过去就自动带声音播放。快捷键：<kbd>A</kbd> 开关自动播放，<kbd>L</kbd> 播放列表，<span class="pages-only"><kbd>H</kbd> 去 B 站看高清，</span><kbd>D</kbd> 深色模式。',
    'Use the scroll wheel, or press <kbd>J</kbd> <kbd>K</kbd> to go to the next or previous video; it starts with sound. Shortcuts: <kbd>A</kbd> autoplay, <kbd>L</kbd> playlist, <span class="pages-only"><kbd>H</kbd> HD on Bilibili, </span><kbd>D</kbd> dark mode.');
  add('about.phonePages',
    '往上滑是下一条，往下滑是上一条。滑到以后播放器已经加载好。iPhone、iPad 上要点一下画面才出声播放，这是苹果不允许网页自动开声音，本页改不了。手机横过来，视频在左边，说明在右边。',
    'Swipe up for the next video, down for the previous one. The player is already loaded when you arrive. On iPhone and iPad you need to tap the picture before sound starts — Apple does not allow websites to unmute automatically, and this page cannot change that. Turn the phone sideways: the video is on the left, the notes on the right.');
  add('about.phoneLan',
    '往上滑是下一条，往下滑是上一条。如果没有自动开播，点一下画面即可。手机横过来，视频在左边，说明在右边。',
    'Swipe up for the next video, down for the previous one. If it does not start on its own, tap the picture. Turn the phone sideways: the video is on the left, the notes on the right.');
  add('about.castPages',
    '播放时点「投屏」（外接键盘也可以按 <kbd>T</kbd>）。页面会铺满，并尽量收起浏览器自己的边栏。先点一下画面开始播放，再把手机横过来。然后用手机系统的「屏幕镜像」，不要用视频右下角的隔空播放或「只投这个视频」（那样电视通常只有声音）：iPhone 从右上角拉出控制中心，点「屏幕镜像」；安卓在系统里找「投屏」「镜像」或「智慧屏」，选镜像整个屏幕。B 站官方播放器在手机上不提供把这一条视频直接隔空播放（AirPlay）或 Cast 到电视的按钮，播放器角落的全屏也常常没反应；B 站 App 里不少片子还会提示「无法投屏」。那是 B 站和系统的限制，这个页面改不了，只能把铺满之后的画面镜像过去。镜像时手机要一直开着这一页。',
    'While a video is playing, tap “Mirror” (or press <kbd>T</kbd> on a keyboard). The page fills the screen and tries to tuck the browser chrome away. Start playback first, then turn the phone sideways. Use the phone’s system “Screen Mirroring,” not the AirPlay or “play this video only” icon in the corner of the video (the TV often gets sound only): on iPhone, open Control Center from the top right and tap “Screen Mirroring”; on Android, look for “Cast,” “Mirror,” or “Smart Screen,” and mirror the whole screen. Bilibili’s official player on a phone does not offer a button to AirPlay or Cast this one video to a TV, and the player’s own full-screen control often does nothing; in the Bilibili app, many videos also say they cannot be cast. Those are limits of Bilibili and the system. This page cannot change them, so it can only mirror the already filled screen. Keep this page open on the phone while you mirror.');
  add('about.castLan',
    '播放时点「投屏」（外接键盘也可以按 <kbd>T</kbd>）。页面会铺满，并尽量收起浏览器自己的边栏。先点一下画面开始播放，再把手机横过来。然后用手机系统的「屏幕镜像」，不要用视频右下角的隔空播放或「只投这个视频」（那样电视通常只有声音）：iPhone 从右上角拉出控制中心，点「屏幕镜像」；安卓在系统里找「投屏」「镜像」或「智慧屏」，选镜像整个屏幕。镜像时手机要一直开着这一页。',
    'While a video is playing, tap “Mirror” (or press <kbd>T</kbd> on a keyboard). The page fills the screen and tries to tuck the browser chrome away. Start playback first, then turn the phone sideways. Use the phone’s system “Screen Mirroring,” not the AirPlay or “play this video only” icon in the corner of the video (the TV often gets sound only): on iPhone, open Control Center from the top right and tap “Screen Mirroring”; on Android, look for “Cast,” “Mirror,” or “Smart Screen,” and mirror the whole screen. Keep this page open on the phone while you mirror.');
  add('about.tvHtml',
    '用遥控器的打开<a href="tv.html"><strong>电视版</strong></a>：一格一格的方块，方向键挑、<kbd>OK</kbd> 播放；播放时 <kbd>▲</kbd> 标记看完，<kbd>▼</kbd> 选集、换一条，返回键回首页；<kbd>◀</kbd> <kbd>▶</kbd> 在应用里是快退 / 快进，在浏览器里是换上一条 / 下一条。看完的进度和这里共用。安卓电视、投影仪可以装 BiliPicks 电视版应用（安装方法见<a href="https://github.com/limin112/bilipicks/tree/main/android" target="_blank" rel="noopener noreferrer">开源仓库</a>），打开就是电视版，<kbd>OK</kbd> 键能暂停，<kbd>◀</kbd> <kbd>▶</kbd> 能快退快进。',
    'Open the <a href="tv.html"><strong>TV edition</strong></a> with a remote: a grid of tiles, arrow keys to choose, <kbd>OK</kbd> to play. While playing, <kbd>▲</kbd> marks a video watched, <kbd>▼</kbd> opens the list to switch, and Back returns home. <kbd>◀</kbd> <kbd>▶</kbd> seek in the app, and go to the previous or next video in a browser. Progress is shared with this site. On Android TVs and projectors you can install the BiliPicks TV app (see the <a href="https://github.com/limin112/bilipicks/tree/main/android" target="_blank" rel="noopener noreferrer">open-source repo</a> for how to install). It opens straight into the TV edition; <kbd>OK</kbd> pauses, and <kbd>◀</kbd> <kbd>▶</kbd> seek.');
  add('about.computerTvHtml',
    '在电脑上按 <kbd>T</kbd> 或点「大屏模式」，只留视频和一条控制栏，<kbd>←</kbd> <kbd>→</kbd> 切换，<kbd>Esc</kbd> 退出。电脑上的大屏模式不会强行进入浏览器全屏。',
    'On a computer, press <kbd>T</kbd> or tap “Theater” to leave just the video and a control bar. <kbd>←</kbd> <kbd>→</kbd> switch videos, <kbd>Esc</kbd> exits. Theater mode on a computer does not force the browser into full screen.');
  add('about.beforeHtml',
    '这不是逐片审过的儿童白名单：视频按标题、简介、UP 主和口碑挑选，没有每一条都从头看到尾。年龄是编辑建议，不是官方分级。商单、猎奇标题、实验危险画面仍需家长挑选。<span class="pages-only">点「去 B 站看高清」之后会出现 B 站自己的推荐，建议关掉自动连播。</span><span class="lan-only" hidden>开了家里的播放代理时，视频在本站域名下播放。</span>',
    'This is not a clip-by-clip children’s whitelist: videos are chosen from titles, descriptions, creators, and reputation, and not every one has been watched from start to finish. Ages are an editor’s suggestion, not an official rating. Sponsored videos, sensational titles, and risky experiment footage still need a parent’s eye. <span class="pages-only">After you open “Watch HD on Bilibili,” Bilibili’s own recommendations appear; it is best to turn off autoplay.</span><span class="lan-only" hidden>When the household playback proxy is on, videos play under this site’s domain.</span>');
  add('about.leftOutBody',
    '低龄营销向动画、法律/职场/战争黑色幽默、地缘政治、志怪恐怖（含名字像儿童故事的）、纯数码评测、来源不明的同名杂号、标题写着「全 500 集」「学完就业」的卖课合集，都不收。',
    'We leave out marketing cartoons for little children, legal / workplace / war black comedy, geopolitics, ghost-story horror (including titles that sound like children’s tales), pure gadget reviews, unclear copycat channels, and course bundles whose titles promise “all 500 episodes” or a job at the end.');

  /* TV shell */
  add('tv.sub', '电视版', 'TV edition');
  add('tv.loading', '正在加载…', 'Loading…');
  add('tv.pickTitle', '选一门课', 'Pick a course');
  add('tv.pickLead', '换一门不会清掉其他课的进度', 'Switching does not erase progress on other courses');
  add('tv.switchCourse', '换一门课', 'Switch course');
  add('tv.switchHintOn', '现在是「{name}」。按 OK 换一门，其他课的进度还在', 'You are on “{name}.” Press OK to switch; progress on other courses stays.');
  add('tv.switchHintOff', '按 OK 选一门课', 'Press OK to pick a course');
  add('tv.needNickname', '先在网页上给孩子起个称呼', 'First add a nickname for the child on the website.');
  add('tv.profiles', '孩子档案', 'Child profiles');
  add('tv.parentAccount', '家长账号', 'Parent account');
  add('tv.currentChild', '当前是「{name}」', 'Currently “{name}”');
  add('tv.pressOkSwitch', '按 OK 换人或退出', 'Press OK to switch or sign out');
  add('tv.pressOkEmail', '按 OK 填写家长邮箱', 'Press OK to enter a parent email');
  add('tv.unconfigured', '云端登录还没配置（公开站用 config.public.js，本机 config.js 可覆盖），现在是访客', 'Cloud sign-in is not configured yet (the public site uses config.public.js; a local config.js can override it). You are a guest for now.');
  add('tv.current', '当前', 'Current');
  add('tv.settings', '设置', 'Settings');
  add('tv.browse', '随便看看', 'Browse');
  add('tv.continuePath', '继续闯关', 'Continue the path');
  add('tv.restartPath', '路线全部看完了，再看一遍', 'You have finished the path. Watch it again');
  add('tv.startPath', '从第 1 关开始', 'Start at stage 1');
  add('tv.step', '第 {n} 步', 'Step {n}');
  add('tv.stageNo', '第 {n} 关', 'Stage {n}');
  add('tv.pathProgress', '成长路线 已看 {d} / {n}', 'Learning path  {d} / {n} watched');
  add('tv.loadFail', '没加载出来', 'It did not load');
  add('tv.loadFailHint', '检查一下网络，按 OK 重试', 'Check the network, then press OK to try again');
  add('tv.seek', '快退 / 快进', 'Seek back / forward');
  add('tv.selectOrSwitch', '选集 · 换一条', 'List · next video');
  add('tv.needApp', '在电视上装 BiliPicks 应用才能用', 'Install the BiliPicks app on the TV to use this');
  add('tv.needUsb', '这一版要先用 U 盘或 adb 装一次新版', 'This version needs a new build installed once with a USB drive or adb');
  add('tv.updChecking', '正在检查…', 'Checking…');
  add('tv.updDownload', '正在下载 {n}%', 'Downloading {n}%');
  add('tv.updVerify', '正在校验…', 'Checking the file…');
  add('tv.updInstall', '在弹出的窗口里选「安装」', 'Choose “Install” in the window that opens');
  add('tv.updInstallHint', '装好后如果回到了桌面，再打开一次 BiliPicks 就是新版', 'If you land on the home screen after installing, open BiliPicks again for the new version');
  add('tv.updLatest', '已经是最新版', 'You already have the latest version');
  add('tv.updLatestToast', '已经是最新版了', 'You already have the latest version');
  add('tv.updAllow', '先允许安装，再按 OK', 'Allow installs first, then press OK');
  add('tv.updAllowHint', '请在打开的设置里允许 BiliPicks「安装未知应用」，然后回来再按一次', 'In the settings that opened, allow BiliPicks to install unknown apps, then come back and press OK again');
  add('tv.updFail', '更新没成功 · 按 OK 重试', 'The update did not finish · press OK to try again');
  add('tv.noteCatalog', '视频清单在网站上更新，不用重装应用', 'The video list updates on the website; you do not need to reinstall the app');
  add('tv.noteUnofficial', 'BiliPicks 不是 B 站官方产品', 'BiliPicks is not an official Bilibili product');

  /* Common video / path chrome that appears in several templates */
  add('path.mission', '动手任务', 'A task away from the screen');
  add('path.tips', '给家长的提醒', 'Notes for parents');
  add('path.later', '稍后再看更顺', 'Easier a little later');
  add('result.none', '没有找到合适的视频。', 'No matching videos.');
  add('result.count', '{n} 条', '{n} videos');


  add('cat.all', '全部', 'All');
  add('cat.allVideos', '全部视频', 'All videos');
  add('search.quoted', '搜索「{q}」', 'Search “{q}”');
  add('time.hoursMins', '{h} 小时 {m} 分钟', '{h} hr {m} min');
  add('time.mins', '{m} 分钟', '{m} min');
  add('time.hoursMinsShort', '{h} 小时 {m} 分', '{h} hr {m} min');
  add('series.total', '共 {n} 集', '{n} parts in all');
  add('series.first', '第 1 集 {dur}，共 {n} 集', 'Part 1, {dur}, {n} parts in all');
  add('tvBar.hintEsc', '← → 切换，Esc 退出', '← → to switch, Esc to exit');
  add('play.aria', '播放：{title}', 'Play: {title}');
  add('hero.totalStages', '一共 {n} 关', '{n} stages in all');
  add('hero.nodeAria', '第 {n} 关 {name}，已看 {d} / {all}', 'Stage {n}, {name}, watched {d} / {all}');
  add('result.path', '成长路线 {n} 步，按顺序排列', 'Learning path, {n} steps, in order');
  add('result.picked', '{n} 个手选视频，没有推荐算法', '{n} hand-picked videos, no recommendation algorithm');
  add('result.empty', '没找到「{q}」相关的视频。换个词，或者点上面的「全部」。', 'No videos matching “{q}.” Try another word, or tap “All” above.');
  add('tag.repost', '搬运', 'Re-upload');
  add('tag.repostComma', '，搬运', ', re-upload');
  add('age.plus', '{n} 岁+', '{n}+');
  add('mission.title', '动手任务', 'A task away from the screen');
  add('mission.done', '做完了', 'Done');
  add('mission.open', '打开 {name}', 'Open {name}');
  add('mission.site', '网站', 'the site');
  add('path.expand', '展开这一关的 {n} 条', 'Show this stage’s {n} videos');
  add('path.laterNote', '下面的关卡学过函数、会一点 Python 再看更顺。现在点开看看也没关系，看不懂很正常，知道山顶长什么样就好。', 'The stages below go more smoothly after you know functions and a little Python. It’s fine to peek now; not understanding is normal — just get a sense of what’s at the top.');
  add('path.progressAria', '路线进度', 'Path progress');
  add('path.tipsSummary', '给家长的 {n} 条建议', '{n} notes for parents');
  add('path.progressCloud', '进度记在当前孩子的云端档案里，手机、电视和其他浏览器登录同一个孩子就能接着看。换一门课不会清掉其他课的记录。', 'Progress is saved in this child’s cloud profile. A phone, a TV, or another browser signed in as the same child can pick up where you left off. Switching courses does not erase the others.');
  add('path.progressGuest', '还没登录时，每门课的进度分开记在这台设备上。清除浏览数据会丢。', 'Before you sign in, each course’s progress stays on this device. Clearing browsing data will erase it.');
  add('path.progressMark', '在播放页点「✓ 看完了」打勾，再点一次取消。', 'On the watch page, tap “✓ Watched” to check it off; tap again to undo.');
  add('kid.goNow', '✅ 现在就能看', '✅ Ready to watch now');
  add('kid.interest', '🔵 看孩子兴趣', '🔵 If the child is interested');
  add('kid.pick', '⚠️ 家长先挑', '⚠️ A parent should preview first');
  add('kid.later', '⏳ 先打好基础再看', '⏳ After the basics are in place');
  add('kid.unknown', '❔ 还没细看', '❔ Not reviewed closely yet');
  add('channel.fans', '{fans} 粉丝，{videos} 个视频', '{fans} followers, {videos} videos');
  add('channel.onSite', '本站有 {n} 条', '{n} on this site');
  add('badge.orig', '原', 'Orig.');
  add('channel.origTristan', '原频道 {orig}，Tristan 评 {tristan}', 'Original channel {orig}, Tristan rated {tristan}');
  add('channel.like', '对标：{like}', 'In the vein of: {like}');
  add('tier.heading', '{tier} 档：{label}', 'Tier {tier}: {label}');
  add('tiers.g1.title', '给家长的频道名单', 'A channel list for parents');
  add('tiers.jh.title', 'B 站频道榜', 'Bilibili channel list');
  add('chip.readyNow', '只看现在就能看的', 'Only what’s ready to watch now');
  add('section.originals', '原版频道的 B 站官方号', 'Official Bilibili channels of the originals');
  add('section.gaps', '还没找到好对应的方向', 'Directions we have not matched well yet');
  add('curator.default', '家长', 'a parent');
  add('about.creditLabel', '策展：', 'Curated by ');
  add('kpi.videos', '手选视频', 'Hand-picked videos');
  add('kpi.path', '成长路线', 'Learning path');
  add('kpi.stagesSteps', '{stages} 关 {steps} 步', '{stages} stages, {steps} steps');
  add('kpi.channels', '频道收录', 'Channels included');
  add('kpi.tierList', '频道榜收录', 'Channels on the list');
  add('path.goStage', '去路线页看这一关', 'See this stage on the path page');
  add('hero.stageStep', '第 {n} 关，第 {step} 步', 'Stage {n}, step {step}');
  add('by.repost', '原作者 {orig}，由 UP 主 {up} 搬运', 'Original: {orig}, re-uploaded by {up}');
  add('by.up', 'UP 主 {up}', 'Creator: {up}');
  add('caution.parent', '家长提示', 'A note for parents');
  add('watch.hdTitle', '站内播放器最高 480P；到 B 站登录后可看 1080P（快捷键 H）', 'The embed tops out at 480p; sign in on Bilibili for 1080p (shortcut H)');
  add('watch.swipeNext', '上滑看下一条', 'Swipe up for the next one');
  add('watch.last', '这是最后一条', 'This is the last one');
  add('watch.backFirst', '点这里回到第一条', 'Tap here to go back to the first');
  add('watch.doneOn', '✓ 已看完', '✓ Watched');
  add('watch.unmark', '再点一次取消', 'Tap again to undo');
  add('watch.markTitle', '标记为看完，路线会记进度', 'Mark as watched so the path can keep progress');
  add('play.fail', '暂时播不了，请稍后再试', 'It cannot play just now. Please try again in a moment.');
  add('auto.onTitle', '滑到哪条就自动播哪条，点一下关掉（快捷键 A）', 'Whatever you swipe to will play. Tap to turn this off (shortcut A)');
  add('auto.offTitle', '现在要点封面才播，点一下打开自动播放（快捷键 A）', 'Tap the cover to play. Tap here to turn autoplay on (shortcut A)');
  add('auto.onToast', '自动播放已打开', 'Autoplay is on');
  add('auto.offToast', '自动播放已关闭，点封面才播', 'Autoplay is off; tap the cover to play');
  add('empty.list', '这个列表里没有视频。', 'This list has no videos.');
  add('empty.pickHome', '回首页挑一条', 'Go home and pick one');
  add('toast.first', '已经是第一条了', 'This is already the first one');
  add('toast.last', '这是最后一条', 'This is the last one');
  add('toast.stageClear', '🎉 第 {n} 关通关！去路线页做这一关的动手任务', '🎉 Stage {n} is done! Go to the path page for this stage’s task.');
  add('toast.stageProgress', '第 {n} 关：已看 {d} / {all}', 'Stage {n}: watched {d} / {all}');
  add('toast.noted', '记下了', 'Saved');
  add('sheet.count', '{n} 条，看过 {d} 条', '{n} videos, {d} watched');
  add('nav.tvTitle', '给电视、投影仪用的遥控器界面', 'A remote-control interface for TVs and projectors');
  add('nav.tv', '电视版', 'TV edition');
  add('toast.missionDone', '第 {n} 关的动手任务完成，了不起', 'The task for stage {n} is done. Well done.');
  add('meta.y2', 'BiliPicks — 两岁看世界：给大约 2 岁的 5 关短片，请家长陪坐，无推荐算法。', 'BiliPicks — Seeing the World at Two: five stages of short films for about age 2, with a parent sitting alongside. No recommendation algorithm.');
  add('meta.g1', 'BiliPicks — 从好奇到会看：给大约 6～7 岁的 6 关小课，故事、小动物、博物馆和简单科学，无推荐算法。', 'BiliPicks — From Curiosity to Looking Closely: six little stages for about ages 6–7, with stories, animals, museums, and simple science. No recommendation algorithm.');
  add('meta.jh', 'BiliPicks — 初中生学 AI：从好奇到机器学习的 9 关，家长手选，没有推荐算法。', 'BiliPicks — AI for Middle School: nine stages from curiosity to machine learning, hand-picked by a parent. No recommendation algorithm.');
  add('cast.soundOnly', '电视若只有声音，请退出隔空播放，改用控制中心的「屏幕镜像」', 'If the TV has sound only, leave AirPlay and use Control Center “Screen Mirroring” instead.');
  add('cast.useMirror', '请用控制中心「屏幕镜像」。视频里的隔空播放常常只有声音，没有画面', 'Please use Control Center “Screen Mirroring.” AirPlay from the video itself often gives sound with no picture.');
  add('watch.mirrorTitle', '铺满屏幕，再用手机的屏幕镜像投到电视', 'Fill the screen, then use the phone’s screen mirroring to the TV');
  add('watch.mirrorAria', '投屏到电视', 'Mirror to a TV');
  add('watch.theaterAria', '大屏模式', 'Theater mode');
  add('account.kids', '孩子档案', 'Child profiles');
  add('account.now', '当前', 'Current');
  add('account.emptyManage', '还没有孩子。到档案管理里写一个家里的称呼。', 'No child yet. Add a household nickname in profile management.');
  add('account.switchHint', '点一个称呼就换成那个孩子。各门课的进度都留着。', 'Tap a nickname to switch to that child. Progress on every course is kept.');
  add('account.signOut', '退出登录', 'Sign out');
  add('account.noneQuery', '没有叫这个的孩子。', 'No child by that name.');
  add('account.noneYet', '还没有孩子。', 'No child yet.');
  add('account.manageLead', '可以查找称呼、新增孩子、查看学习记录，或删除档案。选课请回到首页。', 'You can find a nickname, add a child, read a learning record, or delete a profile. To pick a course, go back to the home page.');
  add('account.nicknamePh2', '比如姐姐、弟弟。不是姓名', 'For example: Big Sister, Little Brother — not a legal name');
  add('account.saveChild', '保存这个孩子', 'Save this child');
  add('account.addHint', '只写称呼，不写姓名、学校、电话或生日。新建后先记着现在这门课，要换课回到首页选。', 'Use a nickname only — no legal name, school, phone, or birthday. A new child starts with the current course; to change it, go back to the home page.');
  add('account.createFail', '没有建成。', 'It could not be created.');
  add('account.noRecords', '还没有学习记录。回到首页选一门课，看完点「看完了」，就会记在这里。', 'There is no learning record yet. Go home, pick a course, and tap “Watched” after a video; it will show up here.');
  add('account.lastSeen', '上次看到 {time}', 'Last watched to {time}');
  add('account.finished', '看完', 'Finished');
  add('account.playedTo', '播到 {time}', 'played to {time}');
  add('account.watchedTo', '看到 {time}', 'Watched to {time}');
  add('account.hasRecord', '有记录', 'Has a record');
  add('account.noWatch', '这门课还没有观看记录。', 'This course has no watch history yet.');
  add('account.finishedCount', '看完 {n} 条', 'Finished {n}');
  add('account.recordsLoading', '正在读已经记下的进度…', 'Reading the saved progress…');
  add('account.recordsFail', '没有读到学习记录。', 'The learning record could not be read.');
  add('account.thisChild', '这个孩子', 'this child');
  add('account.deleteAsk', '删除「{name}」的档案和云端进度？这台设备上的访客记录还在。', 'Delete the profile and cloud progress for “{name}”? Guest records on this device will stay.');
  add('account.cancel', '取消', 'Cancel');
  add('account.deleteProfile', '删除档案', 'Delete profile');
  add('account.deleteFail', '没有删掉，请稍后再试。', 'It could not be deleted. Please try again in a moment.');
  add('account.pipl', '不满 14 周岁的孩子，请由家长或监护人注册并管理这个账号（个人信息保护法）。这里只保存监护人邮箱和家里的称呼，不收集姓名、学校、电话或出生日期。', 'If the child is under 14, a parent or guardian should register and manage this account (Personal Information Protection Law). Only a guardian email and a household nickname are stored — no legal name, school, phone, or date of birth.');
  add('account.cloudTitle', '云端登录', 'Cloud sign-in');
  add('account.cloudMissing', '云端登录还没配置。公开的 GitHub Pages 使用仓库里的 <b>config.public.js</b>（anon 公钥，数据由行级安全保护）。本机的 <b>config.js</b> 可以覆盖它。两份现在都不可用，可以继续用访客模式。', 'Cloud sign-in is not configured. The public GitHub Pages site uses <b>config.public.js</b> in the repo (the anon key; data is protected by row-level security). A local <b>config.js</b> can override it. Neither is available now, so you can keep going as a guest.');
  add('account.cloudMissing2', '进度只存在这台设备上。每门课各记各的。', 'Progress stays on this device only. Each course is stored separately.');
  add('account.offlineGuest', '刚才没连上云端，这台设备先按访客使用。进度还在浏览器里，连上之后再登录即可同步。', 'The cloud could not be reached just now, so this device will work as a guest. Progress is still in the browser; sign in again when you are back online to sync.');
  add('account.parentSignIn', '家长登录', 'Parent sign-in');
  add('account.authLead', '一个邮箱下面可以有几个孩子，进度按孩子、按课分开。', 'One email can have several children. Progress is kept per child and per course.');
  add('account.email', '邮箱', 'Email');
  add('account.password', '密码', 'Password');
  add('account.register', '注册', 'Register');
  add('account.toRegister', '改为注册', 'Switch to register');
  add('account.toSignIn', '改为登录', 'Switch to sign in');
  add('account.mailSent', '注册邮件已发出。请到邮箱里确认，然后再回来登录。', 'The registration email has been sent. Please confirm it, then come back to sign in.');
  add('account.mergeCount', '{title}，这台设备有 {n} 条记录', '{title}: this device has {n} records');
  add('account.mergeNone', '不合并', 'Don’t merge');
  add('boot.catalogFail', '清单没有加载出来。请刷新再试。', 'The catalog did not load. Please refresh and try again.');

  add('list.join', '、', ', ');
  add('account.nickname', '家里的称呼', 'Household nickname');
  add('account.initial', '孩', 'C');
  add('series.suffix', '，共 {n} 集', ', {n} parts in all');


  add('tv.prevNext', '上一条 / 下一条', 'Previous / Next');
  add('tv.pauseContinue', '暂停 / 继续', 'Pause / play');
  add('tv.markDoneKey', '标记看完', 'Mark watched');
  add('tv.pickList', '选集', 'Playlist');
  add('tv.backKey', '返回', 'Back');
  add('tv.backHome', '回首页', 'Back home');
  add('tv.paused', '已暂停，按 OK 继续', 'Paused. Press OK to resume');
  add('tv.panelHint', 'OK 确认 · 上下移动 · 返回键关闭', 'OK to confirm · Up/down to move · Back to close');
  add('tv.loginHint', '按 OK 登录。要注册，先按右再按 OK', 'Press OK to sign in. To register, press Right, then OK');
  add('tv.manageNote', '添加、删除和查看学习记录，请用手机或电脑打开网页里的「档案管理」。这里只换当前的孩子。', 'To add or delete a child, or read a learning record, open “Manage profiles” on the website from a phone or computer. Here you only switch the current child.');
  add('tv.authNote', '不满 14 周岁由家长注册。不收集孩子的姓名、学校、电话或生日。', 'If the child is under 14, a parent should register. We do not collect a legal name, school, phone, or birthday.');
  add('tv.offlineShort', '刚才没连上云端', 'The cloud could not be reached just now');
  add('tv.lastItem', '已经是最后一条了', 'This is already the last one');
  add('tv.seenSuffix', ' · ✓ 看过', ' · ✓ Watched');

  add('boot.pageFail', '页面没有打开。请刷新再试。', 'The page did not open. Please refresh and try again.');

  add('about.aim.y2', '目标是请家长陪着，一起看完一条短片，然后去做一件真事。', 'The aim is for a parent to sit alongside, finish one short film together, then go do something real.');
  add('about.aim.g1', '目标是一起听故事、看小动物、走进博物馆，再问一问「为什么会这样」。', 'The aim is to listen to stories, watch little animals, walk through a museum, and ask “why does this happen?”');
  add('about.aim.jh', '目标是培养科学兴趣，并走向理解机器学习。所以先看 AI 有多厉害，再弄懂它怎么学，然后自己动手；旁边配上自然、科学、历史、数学这些开眼界的内容。', 'The aim is to grow a scientific curiosity and move toward understanding machine learning. So we first see what AI can do, then how it learns, then try it ourselves — with nature, science, history, and math alongside to open the eyes.');
  add('about.route.y2', '「两岁看世界」一共 5 关，都是很短的官方短片。请家长陪坐，每次看完一条就停。每一关最后有一个离开屏幕的小任务。', '“Seeing the World at Two” has five stages of very short official films. Please sit with your child, and stop after each one. Each stage ends with a small task away from the screen.');
  add('about.route.g1', '「从好奇到会看」一共 6 关，都是现在就能看的小片子。每一关最后有一个在家里做的小任务，比如折纸、看云、数一数，不用打开国外的网站。', '“From Curiosity to Looking Closely” has six stages of short videos you can watch now. Each stage ends with a small task at home — folding paper, looking at clouds, counting — with no need to open a site abroad.');
  add('about.route.jh', '「初中生学 AI」里的路线叫「从好奇到机器学习」，一共 9 关。前几关现在就能看；神经网络和 GPT 关，学过函数再看更顺；大师课要先会一点 Python。每一关最后有一个动手任务。', 'In “AI for Middle School,” the path is called “From Curiosity to Machine Learning,” with nine stages. The early ones are ready now; the neural-network and GPT stages go more smoothly after you know functions; the master-class videos need a little Python first. Each stage ends with a hands-on task.');
  add('about.sync.cloud', '登录之后，看完的进度、动手任务、自动播放、深色模式和播放位置记在当前孩子的档案里，按课程分开。手机、电视和其他浏览器登录同一个孩子就能接着看。换一门课不会清掉其他课。', 'After you sign in, watched progress, tasks, autoplay, dark mode, and playback position are stored in this child’s profile, separately per course. A phone, a TV, or another browser signed in as the same child can pick up where you left off. Switching courses does not erase the others.');
  add('about.sync.guest', '还没登录时，看完的进度、动手任务、自动播放和深色模式只存在这台设备上，每门课各记各的。换设备不同步，清除浏览数据会丢。家长登录后可以同步到云端。', 'Before you sign in, watched progress, tasks, autoplay, and dark mode stay on this device only, separately per course. They do not sync to a new device, and clearing browsing data will erase them. After a parent signs in, they can sync to the cloud.');
  add('about.repost.y2', '本清单主要收动物园、植物园和博物馆官方号里的短片。如果有搬运、译制的片子，播放页上会标「搬运」并写明原作者。搬运的视频有可能被下架，失效的会自动从页面上隐藏。', 'This list mainly uses short films from official zoo, botanic garden, and museum channels. If a video is a re-upload or a translation, the watch page marks it “Re-upload” and names the original author. Re-uploads may be taken down; if they are, they are hidden automatically.');
  add('about.repost.g1', '本清单主要收博物馆、科技馆、动物园和教材出版社的官方视频。如果有搬运、译制的片子，播放页上会标「搬运」并写明原作者。搬运的视频有可能被下架，失效的会自动从页面上隐藏。', 'This list mainly uses official videos from museums, science centers, zoos, and textbook publishers. If a video is a re-upload or a translation, the watch page marks it “Re-upload” and names the original author. Re-uploads may be taken down; if they are, they are hidden automatically.');
  add('about.repost.jh', '卡帕西（Andrej Karpathy）、李宏毅、吴恩达、李飞飞这些老师没有在 B 站开官方号，他们的公开课和演讲只有别人译制上传的版本。这类内容收的是字幕清楚、播放稳定的搬运版，播放页上会标「搬运」并写明原作者。3Blue1Brown、Veritasium、StatQuest、Mark Rober 这些有 B 站官方号的，一律用官方号。搬运的视频有可能被下架，失效的会自动从页面上隐藏。', 'Teachers such as Andrej Karpathy, Hung-yi Lee, Andrew Ng, and Fei-Fei Li do not have official Bilibili channels, so their lectures and talks exist here only as translations other people have uploaded. We keep the ones with clear subtitles and stable playback, mark them “Re-upload,” and name the original author. Channels that do have an official Bilibili presence, such as 3Blue1Brown, Veritasium, StatQuest, and Mark Rober, are used in their official form. Re-uploads may be taken down; if they are, they are hidden automatically.');
  add('about.tasks.y2', '每一关最后的小任务都是离开屏幕去做的：学熊猫走路、洗手、拍手，或看一看窗外的天。请家长陪着，不要把屏幕接着往下刷。', 'The little task at the end of each stage is away from the screen: walk like a panda, wash hands, clap, or look at the sky. Please stay with your child, and don’t keep scrolling.');
  add('about.tasks.g1', '动手任务都在家里完成，不依赖 Google、python.org 或 Scratch 编辑器，这些网站在国内常常打不开，对一年级也太难。实验和折纸请家长陪着；不要模仿刀、锯和火，也不要把水或水果弄到电器上。', 'The hands-on tasks are all done at home, and do not depend on Google, python.org, or the Scratch editor, which are often blocked in this country and too hard for first grade anyway. Please sit with your child for experiments and paper-folding. Don’t copy knives, saws, or fire, and keep water and fruit away from electronics.');
  add('about.tasks.jh', '动手任务里的 Quick, Draw!、Teachable Machine、TensorFlow Playground 是 Google 的网站，Python 在线壳是 python.org 的页面，有的网络打不开。分类浏览里的 Scratch 入门在麻省理工的网站上练习，同样可能打不开。', 'The tasks include Quick, Draw!, Teachable Machine, and TensorFlow Playground, which are Google sites, and a Python shell on python.org; some networks cannot open them. The Scratch introduction in the topic list is practiced on MIT’s site, which may also be blocked.');
  add('about.log.y2', '2026-11-22 加上「两岁看世界」：5 关共 31 条官方短片，请家长陪坐，每次看完一条就停。本站是改编版，不是原作者站点。', '22 Nov 2026: “Seeing the World at Two” was added — five stages, 31 official short films. Sit with your child, and stop after each one. This site is an adaptation, not the original author’s site.');
  add('about.log.g1', '2026-11-15 按大约 6～7 岁排了 6 关「从好奇到会看」。这门课在本站里。原来的一年级网址以后可以转到 ?track=g1。本站是改编版，不是原作者站点。', '15 Nov 2026: six stages of “From Curiosity to Looking Closely” were arranged for about ages 6–7. This course lives on this site. The older first-grade URL can later redirect to ?track=g1. This site is an adaptation, not the original author’s site.');
  add('about.log.jh', '2026-11-15 按初中（初一到初三）重排成长路线：补上初中物理关，编程主路改为 Python，把神经网络和 GPT 关标成「学过函数 / 先会 Python 再看更顺」。本站是改编版，不是原作者站点。原项目更新记录：2026-11-08 整理频道与代表作；11-09 按小升初筛选；11-10 加入成长路线和频道榜；11-12 原版路线重排成 9 关并加入动手任务。', '15 Nov 2026: the path was rearranged for middle school (grades 7–9): a middle-school physics stage was added, the main coding path became Python, and the neural-network and GPT stages were marked as smoother after functions / a little Python. This site is an adaptation, not the original author’s site. In the original project: 8 Nov 2026, channels and signature works were arranged; 9 Nov, a filter for the late-elementary to early-middle years; 10 Nov, the learning path and channel list; 12 Nov, the original path became nine stages with hands-on tasks.');
  add('tiers.g1.lead', '这里只收博物馆、科技馆、动物园和温和的儿童向官方号，方便家长自己再挑。S 是现在就能一起看，A 先挑短的，B 按需打开。分档是编辑建议，不是官方分级；粉丝数 {built} 更新。', 'This list only includes official museum, science-center, zoo, and gentle children’s channels, so a parent can choose further. S is ready to watch together now, A means start with the short ones, and B is as needed. The tiers are an editor’s suggestion, not an official rating. Follower counts were updated {built}.');
  add('tiers.jh.leadBefore', '参考', 'Following the idea of');
  add('tiers.jh.leadAfter', '的思路：看重讲得深、制作好、能讲给外行听、有动手的工程味。S 是杰作，A 开眼界、旧视频值得补完，B 基本每期都好，C 有很多好片，D 喜欢就看。分档是编辑判断（按内容方向和口碑，没有逐个看片）；粉丝数 {built} 更新。', ': depth, craft, the ability to explain to a non-specialist, and a hands-on engineering feel. S is a masterwork, A opens the eyes and older videos are worth catching up, B is solid most episodes, C has many good films, and D is worth watching if you like it. The tiers are an editor’s judgment (by topic and reputation, not a clip-by-clip watch). Follower counts were updated {built}.');
  add('tiers.g1.policy', '这个名单只收机构或作者自己经营的官方号。低龄营销动画、早教机带货、鬼畜和猎奇鉴定、初中以上的编程和人工智能课，都没有放进来。', 'This list only includes official channels run by the institution or the author. Marketing cartoons for little children, ads for early-learning gadgets, meme-remix and sensational IDs, and coding or AI lessons aimed above elementary school are left out.');
  add('tiers.jh.policy', '这个榜只收 UP 主自己经营的频道。Primitive Technology、Stuff Made Here、Kiwami Japan 这些原版频道在 B 站只有搬运号，不进榜。公开课和演讲是另一回事：卡帕西、李宏毅、吴恩达没有 B 站官方号，路线里收了字幕清楚的搬运版，并标出原作者。', 'This list only includes channels the creators run themselves. Original channels such as Primitive Technology, Stuff Made Here, and Kiwami Japan exist on Bilibili only as re-uploads, so they are not on the list. Lectures and talks are a different case: Karpathy, Hung-yi Lee, and Andrew Ng have no official Bilibili channel, so the path keeps clearly subtitled re-uploads and names the original author.');
  add('tiers.g1.origSub', '一年级版没有把成人 STEM 频道作为主清单', 'The first-grade course does not use adult STEM channels as its main list');
  add('tiers.jh.origSub', 'Tristan 榜单里 156 个频道，在 B 站有官方号的只有这几个', 'Of 156 channels on Tristan’s list, only these have an official Bilibili channel');

  add('tv.backAgain', '再按一次返回键退出', 'Press Back again to exit');
  add('tv.repostParen', '（搬运）', ' (re-upload)');
  add('tv.playFail', '暂时播不了，请稍后再试', 'It cannot play just now. Please try again in a moment.');
  add('tv.markedDone', '✓ 记为看完了', '✓ Marked as watched');
  add('tv.listDone', '这个列表看完了，按返回回首页', 'This list is finished. Press Back to go home.');
  add('tv.stageClear', '🎉 第 {n} 关看完了！休息一下，做做这一关的动手任务', '🎉 Stage {n} is done! Take a break, and try this stage’s task.');
  add('tv.seekFwd', '⏩ 快进 {n} 秒', '⏩ Forward {n} s');
  add('tv.seekBack', '⏪ 快退 {n} 秒', '⏪ Back {n} s');
  add('tv.usePlayerPause', '请用播放器自己的按钮暂停', 'Please use the player’s own pause control');
  add('tv.doneOn', '✓ 看完了 · 第 {n} 关 {d} / {all}', '✓ Watched · stage {n} {d} / {all}');
  add('tv.noted', '✓ 记下了', '✓ Saved');
  add('tv.undone', '已取消「看完了」', '“Watched” was undone');
  add('tv.countShort', '{n} 条', '{n} videos');
  add('tv.guestProgress', '还没登录，进度在这台设备上', 'Not signed in; progress is on this device');
  add('tv.currentChildName', '当前孩子：{name}', 'Current child: {name}');
  add('tv.updTo', '更新到 {name}', 'Update to {name}');
  add('tv.updNow', '现在是 {cur}', 'You have {cur}');
  add('tv.updNotes', '新版：{notes}', 'What’s new: {notes}');
  add('tv.updPress', '按 OK 更新', 'Press OK to update');
  add('tv.updCheck', '检查更新', 'Check for updates');
  add('tv.updPressCheck', '按 OK 检查', 'Press OK to check');
  add('tv.updHasApp', '有新版应用 {name}', 'A new app version is available: {name}');
  add('tv.updApp', '应用更新', 'App update');
  add('tv.updManual', '这一版不能一键更新：用 U 盘或 adb 装一次新版（{url}），之后就能在这里一键更新', 'This version cannot update in one tap. Install a new build once with a USB drive or adb ({url}); after that, updates can be done here.');
  add('tv.updApk', '安卓电视 / 投影仪应用', 'Android TV / projector app');
  add('tv.updApkHint', '下载 {url}，用 U 盘装上：遥控器更顺手，OK 能暂停，◀ ▶ 能快进', 'Download {url} and install it from a USB drive: the remote is smoother, OK pauses, and ◀ ▶ seek.');
  add('tv.signOut', '退出登录', 'Sign out');
  add('tv.emailPh', '家长或监护人邮箱', 'Parent or guardian email');
  add('tv.passPh', '密码，至少 6 位', 'Password, at least 6 characters');
  add('err.failedShort', '没有完成', 'That did not finish');


  var lang = 'zh';
  var listeners = [];

  function detect() {
    try {
      var saved = global.localStorage && localStorage.getItem(KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) {}
    var nav = '';
    try {
      nav = String((global.navigator && (navigator.language || navigator.userLanguage)) || 'zh').toLowerCase();
    } catch (e2) {}
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  function htmlLang(code) {
    return code === 'en' ? 'en' : 'zh-Hans';
  }

  function interpolate(s, vars) {
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (_, k) {
      return vars[k] == null ? '' : String(vars[k]);
    });
  }

  function t(key, vars) {
    var table = M[lang] || M.zh;
    var s = table[key];
    if (s == null && M.zh) s = M.zh[key];
    if (s == null) return key;
    return interpolate(s, vars);
  }

  function current() {
    return lang;
  }

  function applyHtmlLang() {
    try {
      if (global.document && document.documentElement) {
        document.documentElement.lang = htmlLang(lang);
        document.documentElement.setAttribute('data-lang', lang);
      }
    } catch (e) {}
  }

  function setLang(code, silent) {
    lang = code === 'en' ? 'en' : 'zh';
    try {
      if (global.localStorage) localStorage.setItem(KEY, lang);
    } catch (e) {}
    applyHtmlLang();
    if (!silent) {
      var i;
      for (i = 0; i < listeners.length; i++) {
        try { listeners[i](lang); } catch (err) {}
      }
    }
    return lang;
  }

  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  function pick(zh, en) {
    return lang === 'en' && en ? en : (zh || '');
  }

  function field(obj, name) {
    if (!obj) return '';
    if (lang === 'en' && obj[name + 'En']) return obj[name + 'En'];
    return obj[name] || '';
  }

  function each(root, sel, fn) {
    if (!root || !root.querySelectorAll) return;
    var list = root.querySelectorAll(sel);
    var i;
    for (i = 0; i < list.length; i++) fn(list[i]);
  }

  function applyStatic(root) {
    root = root || (global.document ? document : null);
    if (!root) return;
    each(root, '[data-i18n]', function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    each(root, '[data-i18n-html]', function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    each(root, '[data-i18n-placeholder]', function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    each(root, '[data-i18n-aria]', function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    each(root, '[data-i18n-title]', function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    try {
      var meta = root.querySelector ? root.querySelector('meta[name="description"]') : null;
      if (!meta && global.document) meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', t('meta.description'));
    } catch (e) {}
  }

  /* English overlays for path / tips / stages / missions / categories / tiers.
     Chinese in the data files stays the source. Official Bilibili titles are not rewritten. */
  var CAT_EN = {
    '熊猫朋友': 'Panda friends',
    '动物宝宝': 'Baby animals',
    '鸟儿朋友': 'Bird friends',
    '花开天气': 'Flowers and weather',
    '故事识字': 'Stories and words',
    '自然动物': 'Nature and animals',
    '科学好奇': 'Everyday science',
    '历史文博': 'History and museums',
    '动手创造': 'Making things',
    'AI 入门': 'AI, first steps',
    'AI 进阶': 'AI, going further',
    '计算机编程': 'Computers and coding',
    '地理天文': 'Geography and the sky',
    '科学实验': 'Science experiments',
    '数学': 'Math'
  };

  var AUDIENCE_EN = {
    '大约 2 岁': 'about age 2',
    '小学一年级': 'first grade, about 6–7',
    '初中（初一到初三）': 'middle school (grades 7–9)'
  };

  var CURATOR_EN = { '爸爸': 'Dad' };

  var TIER_EN = {
    '现在就能和孩子一起看': 'Ready to watch together now',
    '植物园和动物园官方号，先挑短的': 'Official zoo and botanic garden channels; start with the short ones',
    '官方儿歌号要非常挑，先不要点合集': 'Official nursery-rhyme channels need a careful eye; skip the long compilations for now',
    '博物馆和科技馆官方号，先挑短的': 'Official museum and science-center channels; start with the short ones',
    '认字、自然课，按需打开': 'Phonics and nature lessons, open when you need them',
    '杰作': 'Masterworks',
    '开眼界，旧视频值得一口气补完': 'Eye-opening; older videos are worth catching up on',
    '基本每期都好': 'Most episodes are good',
    '很多好片，不是每期都惊艳': 'Many good videos, not every episode is a standout',
    '好内容，喜欢就看': 'Good work — watch if you like it'
  };

  var PATH_EN = {
    y2: {
      title: 'Seeing the World at Two',
      intro: 'Five little stages for a child of about two. Please sit beside them. The shorts come from official zoo, botanic garden, and museum channels: pandas, baby animals, little birds, plus flowers, rain, and snow. Each stage ends with a small task away from the screen. This is one course inside BiliPicks, not a separate site.',
      tips: [
        'Please sit with your child. Before age two, it is best to skip screens except video calls with family (guidance from the WHO, Hong Kong Family Health Service, and the Mayo Clinic). This course is for children of about two, with a parent sitting alongside.',
        'Watch one short video, then stop. Don’t follow the recommendations, and don’t use the screen as a pacifier.',
        'From ages 2 to 5, screen time is best kept to about an hour a day, and less is better. After watching, go do something real: clap, sing a line, look out the window, wash hands, or open a paper book.',
        'After you tap “Watch HD on Bilibili,” Bilibili’s own recommendations appear. Please come back when the video ends, and don’t keep scrolling.',
        'If you are not signed in, progress stays in this browser only. After you sign in, it can sync, so another phone can pick up where you left off.',
        'This is not a clip-by-clip children’s whitelist: videos were chosen from titles, the kind of picture, and official sources. If your child dislikes one, or it feels too loud, stop anytime.'
      ],
      stages: [
        { name: 'Start with pandas', age: 'about age 2 · sit with your child', goal: 'Quietly finish a short film of a panda eating, walking, or sleeping.', mission: 'After the video, walk a few slow steps together and wobble like a panda. You can also clap for it.' },
        { name: 'Babies at the zoo', age: 'about age 2 · sit with your child', goal: 'Watch other little animals eat, walk, and stay close to a parent.', mission: 'After the video, go wash hands. Count together as you wash: palms, backs, between the fingers. Then drink a little water.' },
        { name: 'Here come the birds', age: 'about age 2 · sit with your child', goal: 'Watch how birds walk, dance, or sit in a nest.', mission: 'After the video, clap together, or hum a song you already know. Then go to a window and see if a bird is outside.' },
        { name: 'Flowers, rain, and snow', age: 'about age 2 · sit with your child', goal: 'Watch flowers open, and rain or snow falling.', mission: 'Go to a window or balcony. Is the sky clear, cloudy, or rainy? Tell your child one thing you see.' },
        { name: 'Watch one, then do something real', age: 'about age 2 · sit with your child', goal: 'Choose just one video today, watch it quietly, then put the screen away.', mission: 'Watch only this one today. Then turn the screen off, and open a paper book together, or look once more at a real tree and the sky.' }
      ]
    },
    g1: {
      title: 'From Curiosity to Looking Closely',
      intro: 'Six little stages for first grade (about ages 6–7). Stories, little animals, museums, and simple “why” questions, all of which you can watch with a parent. Each stage ends with a small task you can do at home, with no need to open a site abroad.',
      tips: [
        'Watch one or two videos, then stop. Finishing one is better than scrolling through many.',
        'Please sit with your child. Videos marked “watch with a parent” may be a little longer, or show skeletons or experiments.',
        'The hands-on tasks are all at home: folding paper, looking at clouds, counting, trying a bowl of water. A parent should be there. Keep water and fruit away from electronics, and don’t copy knives, saws, or fire.',
        'After you tap “Watch HD on Bilibili,” Bilibili’s own recommendations appear. Please come back when the video ends, and don’t keep scrolling.',
        'Progress stays in this browser on this device. A new phone, or clearing the history, means starting the check-ins again.',
        'This is not a clip-by-clip children’s whitelist: videos were chosen from titles, descriptions, and official sources. If a picture feels scary, stop anytime.'
      ],
      stages: [
        { name: 'Listen to a story, notice the words', age: 'first grade · ready now', goal: 'Finish a short story, then look at how the characters are drawn.', mission: 'Tell today’s story to someone at home. You can use your hands while you tell it.' },
        { name: 'Little animals nearby', age: 'first grade · ready now', goal: 'Quietly finish a film of one small animal, and say what it is doing.', mission: 'Go to a window or downstairs with a parent. Look at the clouds and say what they look like. Then count how many birds you can see.' },
        { name: 'Into the museum', age: 'first grade · ready now', goal: 'Look at a treasure or a dinosaur, and remember how it looks.', mission: 'After the video, draw your favorite treasure or dinosaur, and tell someone at home its name and what you like about it.' },
        { name: 'Why does this happen?', age: 'first grade · ready now', goal: 'Guess first, then see how it really works.', mission: 'Fill a bowl with clean water. Guess which things will float or sink, then set them in gently. Don’t put electronics or plugs in the water.' },
        { name: 'Make something', age: 'first grade · sit with a parent', goal: 'Watch someone else make a thing, then make a small one with a parent.', mission: 'Fold a paper airplane or a jumping frog with a parent. Find an open space, toss it gently, and count how far it goes.' },
        { name: 'Sit down and finish one', age: 'first grade · sit with a parent', goal: 'Choose just one video today, and watch it quietly all the way through.', mission: 'Watch only one video today. Then tell a parent: what did you remember, and what do you still want to ask?' }
      ]
    },
    jh: {
      title: 'From Curiosity to Machine Learning',
      intro: 'A path for grades 7–9. First see what AI can do now, then how it learns, then use scientific thinking and math to pave the way, and write some code yourself. The early stages are ready now. The neural-network and GPT stages go more smoothly if you already know functions. The last stage’s master-class videos are easier after a little Python.',
      tips: [
        'Three or four sessions a week, 20–30 minutes each, work better than one long binge on the weekend.',
        'Each stage ends with a hands-on task. Doing the task matters more than watching one more video.',
        'Stages 6 and 7 can run together: after a look at how computers work, open Python and write a small program.',
        'It is normal not to understand everything. Let a first impression settle; a year or two later, it may suddenly click.',
        'Videos marked as re-uploads are public lectures, talks, or documentaries that someone else translated and posted. They may disappear; if they do, they are hidden automatically.',
        'The videos are only a start. Solid math, asking why, and making things all matter more than how many videos you watch.'
      ],
      stages: [
        { name: 'Wow, AI can do that', age: 'grade 7+ · ready now', goal: 'Skip the theory at first. See what AI has learned on its own: hide-and-seek, Snake, Go, and a 50-year puzzle in protein folding.', mission: 'Play a round of “you draw, I guess” with an AI: open Quick, Draw!, make 6 drawings, and see how many it gets. For one it misses, think about why.' },
        { name: 'How AI learns', age: 'grade 7+', goal: 'AI is not written out as a long list of rules. It “learns” from many examples. This stage is about how that works, and about not believing it blindly.', mission: 'Train an AI yourself: open Teachable Machine, take 50 photos each of rock, scissors, and paper, then play against it. Try again with only 5 photos each, and see if it gets worse.' },
        { name: 'Think like a scientist', age: 'grade 7+', goal: 'Scientists and AI researchers spend their days asking questions, running experiments, and learning from failure. Practice that way of thinking — not by taking a supermarket toy apart.', mission: 'Run your own experiment. Ask something you do not already know (for example, “If I fold a paper airplane’s wings a little wider, will it fly farther?”). Guess first, try it 10 times under the same conditions, write the numbers down, and see whether they support your guess.' },
        { name: 'Middle-school physics opens up', age: 'grade 7+ · lined up with class mechanics, optics, and electricity', goal: 'Open middle-school physics with everyday questions: work and energy, balanced forces, how images form, why a circuit breaker trips. Build intuition first; leave the formulas for class.', mission: 'Look at the breaker panel at home. Point out the ordinary breaker and the residual-current (GFCI) one — the kind with a “press once a month” test button — and say what each one protects. Press the test button only with a parent beside you.' },
        { name: 'Math is the language of AI', age: 'grade 7+', goal: 'At bottom, AI is math. First build an intuition for chance, then see why math class is not wasted.', mission: 'Play the Monty Hall (three-door) problem 30 times with someone at home: hide a candy under 1 of 3 cups, try 15 times without switching and 15 times with a switch, and count which way wins more often.' },
        { name: 'Start writing code: Python', age: 'grade 7+ · can run alongside stage 7', goal: 'Deep learning uses Python. The main path starts there. If you have never programmed, you can first try the Scratch introduction below, then come back. Zhihui-jun’s bicycle and robot arm are here to open your eyes.', mission: 'Write a number-guessing game in Python: the program picks an integer from 1 to 100, you guess, it says “too high” or “too low,” and it counts your tries. You can write it right in a web page.' },
        { name: 'How a computer works', age: 'grade 7+ · alongside stage 6', goal: 'See how 0s and 1s become games, videos, and AI. Watch two or three short episodes a week.', mission: 'Write your birthday in binary (for example, December 25 is month 1100, day 11001), then see if someone at home can read it.' },
        { name: 'How a neural network learns', age: 'smoother after you know functions', goal: 'A first look inside deep learning. Skip math you don’t follow and keep an impression; it will go more smoothly when you come back after learning functions.', mission: 'In TensorFlow Playground, take on the “spiral” data set: add layers and neurons until the two colors are separated. Write down how many layers you used.' },
        { name: 'Understand GPT, then write some yourself', age: 'a little Python first · smoother after functions', goal: 'First build some intuition for linear algebra and convolutions, then listen to Karpathy and Hung-yi Lee explain GPT carefully. Andrew Ng’s machine-learning course, Karpathy’s micrograd, and Mu Li’s “Dive into Deep Learning” sit near the end of this stage — you will want some Python first. One course can take months; there is no rush.', mission: 'Type your way through Karpathy’s micrograd, then change one thing and watch what happens. The later lessons in this stage all need a little Python first.' }
      ]
    }
  };

  function cloneJson(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function localizePath(path, track) {
    if (!path) return path;
    if (lang !== 'en') return path;
    var over = PATH_EN[track];
    if (!over) return path;
    var out = cloneJson(path);
    if (over.title) out.title = over.title;
    if (over.intro) out.intro = over.intro;
    if (over.tips && out.tips) {
      var i;
      for (i = 0; i < out.tips.length && i < over.tips.length; i++) out.tips[i] = over.tips[i];
    }
    if (over.stages && out.stages) {
      var s, st, src;
      for (s = 0; s < out.stages.length && s < over.stages.length; s++) {
        st = out.stages[s];
        src = over.stages[s];
        if (src.name) st.name = src.name;
        if (src.age) st.age = src.age;
        if (src.goal) st.goal = src.goal;
        if (src.mission && st.mission) st.mission.text = src.mission;
        else if (src.mission) st.mission = { text: src.mission };
      }
    }
    return out;
  }

  function localizeText(map, value) {
    if (lang !== 'en' || !value) return value || '';
    return map[value] || value;
  }

  function localizeCategory(name) {
    return localizeText(CAT_EN, name);
  }

  function localizeAudience(name) {
    return localizeText(AUDIENCE_EN, name);
  }

  function localizeCurator(name) {
    return localizeText(CURATOR_EN, name);
  }

  function localizeTierLabel(name) {
    return localizeText(TIER_EN, name);
  }

  function localizeGap(text) {
    var GAPS = {
      '低龄营销动画、早教机和故事机带货': 'Marketing cartoons for little children, and ads for early-learning gadgets',
      '非官方的儿歌、动画片合集和搬运盘': 'Unofficial nursery-rhyme or cartoon compilations, and ripped collections',
      '需要大会员才能看的动画剧集': 'Cartoon series that require a premium membership',
      '惊吓、打斗、猎奇和猛禽近距离恫吓画面': 'Jump scares, fighting, sensational images, and close-up intimidation by birds of prey',
      '把屏幕当成“电子奶嘴”的长时间刷片': 'Long scrolling that turns the screen into a pacifier',
      '鬼畜、恐怖、猎奇生物鉴定': 'Meme-remix “gachi,” horror, and sensational creature IDs',
      '初中以上的物理、编程和人工智能课': 'Physics, coding, and AI lessons aimed above elementary school',
      '需要翻墙才能用的在线编程或绘画网站': 'Online coding or drawing sites that need a VPN',
      '精密机加工、钟表制作（Clickspring、This Old Tony）': 'Precision machining and watchmaking (Clickspring, This Old Tony)',
      '化学合成（NileRed）：搜到的化学号偏危险实验，没收': 'Chemical synthesis (NileRed): the chemistry channels we found leaned on risky experiments, so they were left out',
      '工业事故调查动画（USCSB）': 'Industrial-accident investigation animations (USCSB)',
      '火箭、航模的主动控制（BPS.space）': 'Active control for rockets and model aircraft (BPS.space)',
      '乐高机械（Akiyuki、Brick Experiment Channel）': 'LEGO machines (Akiyuki, Brick Experiment Channel)',
      '军事史动画（The Operations Room）': 'Military-history animations (The Operations Room)',
      '游戏速通分析（Pannen、Bismuth）': 'Game speedrun analysis (Pannen, Bismuth)'
    };
    return localizeText(GAPS, text);
  }

  lang = detect();
  applyHtmlLang();

  global.BiliPicksI18n = {
    t: t,
    lang: current,
    setLang: setLang,
    onChange: onChange,
    pick: pick,
    field: field,
    applyStatic: applyStatic,
    localizePath: localizePath,
    localizeCategory: localizeCategory,
    localizeAudience: localizeAudience,
    localizeCurator: localizeCurator,
    localizeTierLabel: localizeTierLabel,
    localizeGap: localizeGap,
    KEY: KEY,
    messages: M
  };
  if (global.document && document.body) applyStatic();
})(typeof window !== 'undefined' ? window : this);
