# BiliPicks

家长手选的 B 站视频，没有推荐算法。这是**一个网站**，里面有很多门课。打开后先进入**课程中心**，按孩子现在的年纪挑课。不是「小学站」和「初中站」两套网站。

课程中心按三个年龄阶段排列：

- **幼儿 · 大约 2～5 岁**。请家长陪坐。每次只看一条，看完去做一件真事。
- **小学 · 大约 6～11 岁**。从故事和身边的事物，慢慢走到「为什么会这样」。
- **初中 · 大约 12～15 岁**。把好奇留住，再走到机器学习和把想法做成东西。

现在可以看的课有三门：

- **两岁看世界**（幼儿）。大约 2 岁，5 关共 31 条短片：熊猫、动物园的宝宝、小鸟，还有花、雨和雪。请家长陪着，每次一条就停。清单在 `data-y2.js`。
- **从好奇到会看**（小学）。大约 6～7 岁，6 关：故事识字、小动物、博物馆和简单的「为什么」。清单在 `data-g1.js`，来自 [ysmo/bilipicks-grade1](https://github.com/ysmo/bilipicks-grade1)。
- **初中生学 AI**（初中）。大约 12～15 岁，9 关，从好奇走到神经网络。清单在 `data.js`。课里面的路线标题仍是「从好奇到机器学习」。

另外两门还在准备，课程中心会看到，但还不能打开，也还没有清单文件：

- **听，世界在响**（幼儿，大约 3～5 岁）。雨、鸟、虫鸣，还有厨房里的声音。
- **问个为什么**（小学，大约 8～11 岁）。光、水、磁铁，和博物馆里的旧东西。

本站支持中文和 English。网页顶栏有「中文 | English」开关，电视版在设置里也可以切换。选择记在这台浏览器里（`bilipicks-lang`）。没有选过时，浏览器语言以 zh 开头就用中文，否则用英文。

公开页面：<https://ysmo.github.io/bilipicks-junior/>。

本站改编自实践哥 Li 的 MIT 开源项目 [limin112/bilipicks](https://github.com/limin112/bilipicks)，不是原作者的官方站点。原版面向小升初（五六年级～初一），示范站在 <https://minlibuilds.com/bili/>。

长期是这一个网站。[ysmo/bilipicks-grade1](https://github.com/ysmo/bilipicks-grade1) 这次没有改动。以后旧的一年级网址 <https://ysmo.github.io/bilipicks-grade1/> 可以转到这里，例如 `https://ysmo.github.io/bilipicks-junior/?track=g1`。在那之前，两个网址还会各打开各的。

## 怎么选课

第一次打开（还没选过、地址里也没写）会看到课程中心，按幼儿、小学、初中分段，不是「选小学或初中」。正在准备的课会标明「正在准备」，点开不会换成那门课。可以看的课选中后会记住：

- 还没登录：记在这台浏览器里，键名 `bilipicks-track`。
- 登录之后：记在当前孩子的档案上。一个孩子可以选一门或多门课，每门课的进度分开。换设备登录同一个孩子，会打开他上次用的那门。

地址上可以写 `?track=y2`（两岁看世界）、`?track=g1`（从好奇到会看）或 `?track=jh`（初中生学 AI），电视版同样认，例如 `tv.html?track=y2`。这就是以后从旧的一年级网址跳过来时可以用的参数。小学课和初中课的编号仍用 `g1` 和 `jh`，这样旧链接和原来的本地进度键不用改。

顶栏可以换成另一门。换课不会清掉其他课已经看过的记录。

再加一门能上的课：准备一份和 `data.js` 一样的清单，然后在 `account.js` 的 `COURSES` 里加一项（编号、标题、清单文件、localStorage 前缀，以及所属阶段 `stage`：`early` / `primary` / `junior`）。进度按课程编号分开存。如果新编号要沿用旧的本地键，把 `legacyPrefix` 设成原来的前缀，打开页面时会拷过去，不会删掉旧键。如果这门课先前在「正在准备」里，从 `UPCOMING` 里拿掉，不要另建空的清单文件。档案的 `track` 现在接受类似 `y2` 这样的编号；已有项目如果还没放过宽，再执行一次 [`supabase/migrate-courses.sql`](supabase/migrate-courses.sql)。这次课程中心不用新的数据库迁移。

## 怎么打开

不需要构建。任选一种方式即可：

1. 直接用浏览器打开 `index.html`（双击也行）。
2. 在本目录启动一个本地静态服务器，再访问首页和电视版，例如：

```bash
python3 -m http.server 8765
```

然后打开 <http://127.0.0.1:8765/>（网页版）或 <http://127.0.0.1:8765/tv.html>（电视版）。

没登录时，进度只在这台设备上。两岁看世界用 `bilipicks-y2-*`，从好奇到会看用原来的 `bilipicks-g1-*`，初中生学 AI 用原来的 `bilipicks-jh-*`（看完、动手任务、自动播放、深色模式、封面缓存）。这些键还能接着用，不会把几门课的记录混在一起。播放位置如果已经记下，会多一个 `bilipicks-y2-pos-v1`、`bilipicks-g1-pos-v1` 或 `bilipicks-jh-pos-v1`。

公开的 GitHub Pages 用 B 站官方嵌入播放器，不抓取、不代理视频流。B 站限制站外播放最高约 480P，点「去 B 站看高清」可到 B 站看更高清晰度。家里的树莓派如果提供同源的 `/proxy/`，同一份页面会改用本地播放器，见下文「家里的树莓派」。每门课用的是同一套播放器。

电视、投影仪可以用 `tv.html` 的遥控器界面；安卓电视 / 投影仪的安装方法见原仓库 [`android/`](https://github.com/limin112/bilipicks/tree/main/android)。本目录里也拷了一份 `android/`，但没有改 APK。电视版会跟着网页记住的课走；还没选过时，遥控器左右挑选、OK 确认。

## 家长账号和云端进度

可以不登录，继续当访客用。要让手机、电视和其他浏览器共用进度，用家长或监护人的邮箱注册。一个账号下面可以有几个孩子。每个孩子有自己的称呼、选中的课和每门课的进度（看完的视频、动手任务、自动播放、深色模式、播放位置）。家里如果两个孩子上不同的课，就建两个档案，不要共用一个。

注册页上写了：不满 14 周岁的孩子，应由家长或监护人创建并管理账号（个人信息保护法）。这里只保存监护人邮箱和家里用的称呼，不收集孩子的姓名、学校、电话或出生日期。这句话只出现在登录和注册，不放进档案管理。

登录后点右上角的称呼，可以换成另一个孩子，或进入「档案管理」。档案管理里按称呼查找、新增、查看学习记录，确认后才能删除。学习记录用的是已经存着的进度：选过的课、看完的视频、上次播到哪里。选课在首页的课程列表，不在档案里改。电视的设置里同样只换当前的孩子；添加、删除和学习记录在网页的档案管理里做。

登录之后，如果这台设备上还有未登录时的进度，会问要并进哪个孩子。不同的课可以交给不同的孩子。云端已经有的记录会留下来，不会被静默盖掉。合并过一次之后，这个孩子的进度就在各设备之间同步。

公开的 GitHub Pages 使用仓库里已提交的 `config.public.js`（这个项目的网址和 anon 公钥）。anon 公钥本来就可以出现在网页里，孩子的进度靠数据库的行级安全保护，不靠藏起这把公钥。页面会先用已经放好、并且能用的 `window.BILIPICKS_CONFIG`；没有的话先读本机的 `config.js`（家里或树莓派可以用它覆盖公开配置）；这个文件不存在，或里面是空的、不能用，再读 `config.public.js`。两份都不可用时，登录按钮会说明云端登录还没配置，站点仍按访客使用。

### 建一个免费的 Supabase 项目

1. 在 [supabase.com](https://supabase.com) 注册，新建一个项目。数据库口令只留在 Supabase 里。
2. 打开 Authentication → Providers，确认 Email 打开了。家人用的话，可以关掉 “Confirm email”，注册完就能登录；如果留着，就要先到邮箱里点确认链接。
3. Authentication → URL Configuration：Site URL 填 `https://ysmo.github.io/bilipicks-junior/`。家里的 HTTPS 站点如果也要登录，把它的源加进 Redirect URLs。不要把内网主机名写进这个仓库。
4. 打开 SQL Editor，把 [`supabase/schema.sql`](supabase/schema.sql) 整段执行。它会建 `profiles`（孩子档案，含当前课 `track` 和选中的课 `courses`）和 `progress`（进度），并打开行级安全：家长只能读写自己的行。
5. 如果这个项目以前已经执行过旧的 `schema.sql`，不用重做表。合并之后再执行一次 [`supabase/migrate-courses.sql`](supabase/migrate-courses.sql)。它给 `profiles` 加上 `courses`，并放宽 `track`，让以后的新课编号也能存。原来的 `g1`、`jh` 行会留下。在执行之前，这两门课的切换和各自的进度已经能用。
6. Project Settings → API 里复制 Project URL 和 `anon` `public` 密钥。不要复制 `service_role`。公开页面已经提交了这个项目的 `config.public.js`，一般不用再改。
7. 家里或树莓派若要换一个 Supabase 项目，把 `config.example.js` 复制成 `config.js` 再填这两项。`config.js` 已在 `.gitignore` 里，不会提交，并且会覆盖 `config.public.js`。

```js
window.BILIPICKS_CONFIG = {
  supabaseUrl: 'https://你的项目.supabase.co',
  supabaseAnonKey: '你的 anon 公钥'
};
```

Supabase 的接口在海外，有的大陆网络会慢，或者打不开。打不开时，页面仍可以当访客用，进度先留在这台设备上。公开站的登录地址和 anon 公钥在 `config.public.js`。要换成另一个 Supabase 项目，或换成提供同一套 Auth（`/auth/v1`）和 PostgREST（`/rest/v1`）的服务，在本机写一份 `config.js` 即可，不用改页面。不要把 `service_role` 写进这些文件。

## 家里的树莓派（局域网）

公开站点始终用官方嵌入播放器。页面在 `github.io` 上不会探测，也不会请求 `/proxy/`。

同一份静态文件放到家里的树莓派上之后，只有同源的 `/proxy/` 真的在应答时，才改用页面里的 `<video>`。每门课都是这样：

- 静态文件放在网站根目录。这台树莓派上的目录是 `/srv/share/bilipicks-junior`。
- 本机的 nginx 把浏览器请求的 `/proxy/` 转到 `127.0.0.1:8788` 上的媒体代理。页面会访问 `/proxy/play`、`/proxy/cover` 和 `/proxy/view`。代理只给家里用，局域网主机名不要接到 Cloudflare，也不要发布到公网。
- 打开一门课之后会请求 `/proxy/play?bvid=&p=1`，最多等大约 2 秒。响应的 `Content-Type` 是 JSON，才进入本地播放。普通静态服务器返回 HTML，继续用官方嵌入播放器。代理应在本机直接拒绝空的 `bvid`（返回 JSON 即可），不要为了这次探测去拉视频流。
- Safari（包括 iPhone）能自己播 HLS，就直接把地址交给 `<video>`。其他浏览器这时才加载 `vendor/hls.min.js`。这是官方 [hls.js](https://github.com/video-dev/hls.js) 1.7.4 的 UMD 构建（`dist/hls.min.js`，Apache-2.0，许可见 `vendor/hls.LICENSE`）。公开站点不下载这个文件。
- 手机上点「投屏」：先请求整个页面全屏（页面、然后 `body`、然后播放区）。都失败时（iPhone 上常见）再调用视频的 `webkitEnterFullscreen`。`<video>` 带 `x-webkit-airplay="allow"`。先点一下画面开始播放，把手机横过来，再用控制中心的「屏幕镜像」。不要用视频右下角的隔空播放或「只投这个视频」：那样电视通常只有声音，没有画面。电脑上的「大屏模式」仍然不会强行进入浏览器全屏。
- 代理的令牌和口令留在树莓派上，不要放进这个仓库，也不要写进 nginx 配置后提交。

路径前缀要和代理进程一致。下面只说明形状，不是那台机器上的完整配置：

```nginx
# 浏览器请求 /proxy/play。proxy_pass 末尾有没有斜杠，决定转给 8788 时还留不留 /proxy 前缀。
location /proxy/ {
    proxy_pass http://127.0.0.1:8788;
}
```

`tools/` 里的 Quick, Draw!、Teachable Machine、TensorFlow Playground 和 Python 练习页目前只在树莓派上，不在这个仓库里。`data.js` 里的动手任务仍指向原来的公开网站。

## 课程概要

### 两岁看世界

一共 5 关、31 条短片，请家长陪坐。每次只看一条就停，然后去做真事；不要当电子奶嘴。两岁前除视频通话外宜尽量少看屏幕，这门课给大约 2 岁、家长陪着使用。

1. **先看熊猫** — 走路吃竹子、雪天、幼崽、母子饮水、玩冰、阳光。看完学熊猫走路或拍手。
2. **动物园的宝宝** — 小长颈鹿、小河马、小熊吃瓜、小企鹅、南美貘宝宝、小熊猫「三三」。看完洗手。
3. **鸟儿来了** — 故宫的鸭子、白腹锦鸡、黑颈鹤一家与齐舞、湿地里的巢。看完拍手或哼歌，再看窗外。
4. **花、雨和雪** — 故宫的雪、海棠、牡丹，植物园的雨、桂花、荷花和红叶。看完去窗边看天。
5. **看完一条，去做真事** — 雪地里的金丝猴和大熊猫、园林四季的声音、给小黑熊做冰棍。看完关机，翻纸书或看真的树和天。

### 从好奇到会看

一共 6 关，都是现在就能看的小片子。每一关最后有一个在家里做的小任务，不用打开 Google、python.org 或 Scratch 编辑器。

1. **听故事，认字** — 成语小故事、甲骨文、一起写「人」「大」「天」。
2. **身边的小动物** — 熊猫、长颈鹿、小河马、小企鹅。
3. **走进博物馆** — 恐龙骨架、四羊方尊、骨笛、陶狗。骨架比较大，请一起看。
4. **为什么会这样** — 浮沉、水流、彩虹、钢琴怎样发声。
5. **动手做一做** — 纸花、纸陀螺、折扇。鲁班锁只看，不要模仿刀和锯。
6. **坐下来看完一条** — 故宫的雪、园林四季；稍长的片子请周末陪看。

### 初中生学 AI

课里的路线叫「从好奇到机器学习」，一共 9 关。前几关现在就能看；神经网络和 GPT 关，学过函数再看更顺；最后一关的大师课，先会一点 Python 再上。

1. **哇，AI 还能这样** — 捉迷藏、贪吃蛇、AlphaFold、AlphaGo。任务：Quick, Draw!
2. **AI 是怎么学会的** — 李永乐、TED-Ed、李飞飞、StatQuest、3Blue1Brown，以及 AI 也会说错。任务：Teachable Machine。
3. **像科学家一样想问题** — 吴姥姥、中科院实验、蓝 LED、毕导。
4. **初中物理打开了** — 力学、功和能、光学、家庭电路。
5. **数学是 AI 的语言** — 概率、三门问题、贝叶斯。
6. **开始写代码：Python** — 哈佛 CS50 Python；没接触过编程可先看 Scratch。
7. **计算机是怎么工作的** — Crash Course 计算机科学、Ele实验室。可和第 6 关同时进行。
8. **神经网络怎么学习** — 飞天闪客、漫士、3Blue1Brown、Playground。学过函数再看更顺。
9. **看懂 GPT，再到亲手写** — 线性代数、卷积、卡帕西、李宏毅；吴恩达、micrograd、李沐要先会 Python。

分类浏览里还留了适合这门课的自然、地理、历史和开眼界内容。频道榜里的小约翰可汗、地球知识局涉及战争或地缘政治，请家长先挑，不进主线。

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 页面、样式和交互。先选课，再按访客或已登录的孩子显示对应清单 |
| `tv.html` | 电视版。跟网页用同一门课、同一份进度 |
| `account.js` | 课程名单、Supabase 登录、孩子档案、按课分开的进度。先用已有配置，再试 `config.js`，最后用 `config.public.js` |
| `config.public.js` | 公开 GitHub Pages 用的 Supabase 网址和 anon 公钥。anon 公钥可以公开，数据由行级安全保护 |
| `config.example.js` | 本机覆盖用的示例。复制成 `config.js` 再填；`config.js` 不提交 |
| `supabase/schema.sql` | 档案表、进度表和行级安全。新项目整段执行；文末的升级对旧表也安全 |
| `supabase/migrate-courses.sql` | 已有项目补上 `courses`、放宽 `track`。不重做表，不改已有进度 |
| `data.js` | 「初中生学 AI」清单（必须保持 `const DATA = {...};` 单行，以便 `update.py` 读写） |
| `data-g1.js` | 「从好奇到会看」清单，格式和 `data.js` 一样 |
| `data-y2.js` | 「两岁看世界」清单，格式和 `data.js` 一样 |
| `update.py` | 维护脚本：检查失效视频、补封面和时长、添加新视频（只用 Python 标准库） |
| `android/` | 原项目的安卓电视应用，本改编版未改 APK |
| `vendor/hls.min.js` | 官方 hls.js 1.7.4。只在家里的 `/proxy/` 播放 HLS、而浏览器自己不会播时加载 |

加视频或检查失效：

```bash
python3 update.py --check
python3 update.py --data data-g1.js --check
python3 update.py --data data-y2.js --check
python3 update.py add BV1xxxxxxxxx --cat 科学实验 --age 12 --reason "为什么推荐"
python3 update.py --data data-g1.js add BV1xxxxxxxxx --cat 科学好奇 --age 6 --reason "为什么推荐"
python3 update.py --data data-y2.js add BV1xxxxxxxxx --cat 熊猫朋友 --age 2 --reason "为什么推荐"
```

合并是否会丢掉一门课的进度，可以用 `node account-merge.test.js` 在本地看一眼。档案列表、学习记录，以及删除档案时访客记录还在不在，可以用 `node account-profiles.test.js`。配置先读哪一份，可以用 `node account-config.test.js`。

## 许可与出处

代码许可为 MIT，见 [LICENSE](LICENSE)。`vendor/hls.min.js` 是 Apache-2.0，见 `vendor/hls.LICENSE`。清单内容在原项目基础上按课程重排，请勿冒充为原作者实践哥 Li / @MinLiBuilds 的站点。
