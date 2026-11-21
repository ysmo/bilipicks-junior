# BiliPicks · 从好奇到机器学习（初中版）

这是给初中（初一到初三，大约 12～15 岁）孩子用的 BiliPicks 改编版：家长手选 B 站视频，主线 9 关闯关，看完打卡升级。没有推荐算法，只播清单里的视频。

本站改编自实践哥 Li 的 MIT 开源项目 [limin112/bilipicks](https://github.com/limin112/bilipicks)，不是原作者的官方站点。原版面向小升初（五六年级～初一），示范站在 <https://minlibuilds.com/bili/>。

## 怎么打开

不需要构建，也不需要注册。任选一种方式即可：

1. 直接用浏览器打开 `index.html`（双击也行）。
2. 在本目录启动一个本地静态服务器，再访问首页和电视版，例如：

```bash
python3 -m http.server 8765
```

然后打开 <http://127.0.0.1:8765/>（网页版）或 <http://127.0.0.1:8765/tv.html>（电视版）。

看完进度、动手任务勾选、深色模式和自动播放都只存在这台设备的浏览器里（键名带 `bilipicks-jh-` 前缀，不会和原版站点抢同一份记录）。换设备不同步，清除浏览数据会丢。

公开的 GitHub Pages 用 B 站官方嵌入播放器，不抓取、不代理视频流。B 站限制站外播放最高约 480P，点「去 B 站看高清」可到 B 站看更高清晰度。家里的树莓派如果提供同源的 `/proxy/`，同一份页面会改用本地播放器，见下文「家里的树莓派」。

电视、投影仪可以用 `tv.html` 的遥控器界面；安卓电视 / 投影仪的安装方法见原仓库 [`android/`](https://github.com/limin112/bilipicks/tree/main/android)。本目录里也拷了一份 `android/`，但没有改 APK。

手机要把正在看的视频放到电视上：在播放页点「投屏」，先点一下画面开始播放，把手机横过来，再用系统的「屏幕镜像」（iPhone 在控制中心，安卓是系统里的投屏或镜像，选镜像整个屏幕）。没有 `/proxy/` 时用的是 B 站官方播放器。它不让网页把这一条视频直接 AirPlay 或 Cast 到电视，不少片子在 B 站 App 里也会提示不能投屏。那是 B 站的限制。本站能做的是把官方播放器铺满屏幕，再由手机把这一页镜像过去。电脑上的「大屏模式」还是原来的样子，不会强行进入浏览器全屏。开了家里的播放代理时，「投屏」仍是先铺满这一页，说明见下一节。

## 家里的树莓派（局域网）

公开站点 <https://ysmo.github.io/bilipicks-junior/> 始终用官方嵌入播放器。页面在 `github.io` 上不会改去探测或使用 `/proxy/`。

同一份 `index.html` 和 `tv.html` 放到家里的树莓派上之后，只有同源的 `/proxy/` 真的在应答时，才改用页面里的 `<video>`：

- 静态文件放在网站根目录。这台树莓派上的目录是 `/srv/share/bilipicks-junior`。
- 本机的 nginx 把浏览器请求的 `/proxy/` 转到 `127.0.0.1:8788` 上的媒体代理。页面会访问 `/proxy/play`、`/proxy/cover` 和 `/proxy/view`。代理只给家里用，局域网主机名不要接到 Cloudflare，也不要发布到公网。
- 打开页面时会请求 `/proxy/play?bvid=&p=1`，最多等大约 2 秒。响应的 `Content-Type` 是 JSON，才进入本地播放。普通静态服务器返回 HTML，继续用官方嵌入播放器。代理应在本机直接拒绝空的 `bvid`（返回 JSON 即可），不要为了这次探测去拉视频流。
- Safari（包括 iPhone）能自己播 HLS，就直接把地址交给 `<video>`。其他浏览器这时才加载 `vendor/hls.min.js`。这是官方 [hls.js](https://github.com/video-dev/hls.js) 1.7.4 的 UMD 构建（`dist/hls.min.js`，Apache-2.0，许可见 `vendor/hls.LICENSE`）。公开站点不下载这个文件。
- 手机上点「投屏」：先请求整个页面全屏（页面、然后 `body`、然后播放区）。都失败时（iPhone 上常见）再调用视频的 `webkitEnterFullscreen`。`<video>` 带 `x-webkit-airplay="allow"`。先点一下画面开始播放，把手机横过来，再用系统的「屏幕镜像」，不要选「只投这个视频」。电脑上的「大屏模式」仍然不会强行进入浏览器全屏。
- 代理的令牌和口令留在树莓派上，不要放进这个仓库，也不要写进 nginx 配置后提交。

路径前缀要和代理进程一致。下面只说明形状，不是那台机器上的完整配置：

```nginx
# 浏览器请求 /proxy/play。proxy_pass 末尾有没有斜杠，决定转给 8788 时还留不留 /proxy 前缀。
location /proxy/ {
    proxy_pass http://127.0.0.1:8788;
}
```

`tools/` 里的 Quick, Draw!、Teachable Machine、TensorFlow Playground 和 Python 练习页目前只在树莓派上，不在这个仓库里。`data.js` 里的动手任务仍指向原来的公开网站。

## 路线概要

路线名：**从好奇到机器学习**，一共 9 关。前几关现在就能看；神经网络和 GPT 关，学过函数再看更顺；最后一关的大师课，先会一点 Python 再上。

1. **哇，AI 还能这样** — 先看能力：捉迷藏、贪吃蛇、AlphaFold、AlphaGo。任务：Quick, Draw!
2. **AI 是怎么学会的** — 李永乐入门、TED-Ed、李飞飞认图、StatQuest、3Blue1Brown 讲大模型，以及 AI 也会说错。任务：Teachable Machine 猜拳。
3. **像科学家一样想问题** — 吴姥姥共振、中科院实验、蓝 LED、毕导。任务：自己做一次对照实验。
4. **初中物理打开了** — 李永乐、妈咪说的力学 / 功和能 / 光学 / 家庭电路。任务：分清家里的空气开关和漏电保护开关。
5. **数学是 AI 的语言** — 概率直觉、程序验证概率、漫士「为什么还要学数学」、贝叶斯。任务：三门问题实验。
6. **开始写代码：Python** — 主路走哈佛 CS50 Python；从来没接触过编程可先看 Scratch 入门。任务：用 Python 写一个猜数字游戏（可在 <https://www.python.org/shell/> 里写）。
7. **计算机是怎么工作的** — Crash Course 计算机科学、Ele实验室搭计算机。可和第 6 关同时进行。
8. **神经网络怎么学习** — 飞天闪客、漫士、3Blue1Brown、StatQuest、Playground、AlexNet。任务：TensorFlow Playground。学过函数再看更顺。
9. **看懂 GPT，再到亲手写** — 线性代数的本质、卷积、卡帕西、李宏毅；吴恩达、micrograd、李沐是偏后的终点站，要先会 Python。

分类浏览里还留了适合初中的自然、地理、历史和开眼界内容。小约翰可汗、地球知识局在频道榜里，涉及战争或地缘政治，请家长先挑，不进主线。

动手任务里的 Quick, Draw!、Teachable Machine、TensorFlow Playground 是 Google 的网站，有的网络打不开。Python 在线壳是 python.org 的页面，同样可能打不开。

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 页面、样式和交互逻辑 |
| `tv.html` | 电视版：遥控器界面，数据也读 `data.js` |
| `data.js` | 所有内容：视频、成长路线、频道榜、策展人信息（必须保持 `const DATA = {...};` 单行，以便 `update.py` 读写） |
| `update.py` | 维护脚本：检查失效视频、补封面和时长、添加新视频（只用 Python 标准库） |
| `android/` | 原项目的安卓电视应用，本改编版未改 APK |
| `vendor/hls.min.js` | 官方 hls.js 1.7.4。只在家里的 `/proxy/` 播放 HLS、而浏览器自己不会播时加载。许可见 `vendor/hls.LICENSE` |

加视频或检查失效：

```bash
python3 update.py add BV1xxxxxxxxx --cat 科学实验 --age 12 --reason "为什么推荐"
python3 update.py --check    # 只出报告，不改文件
```

## 许可与出处

代码许可为 MIT，见 [LICENSE](LICENSE)。清单内容（推荐理由、路线编排、频道分档）在原项目基础上按初中重排和增删，请勿冒充为原作者实践哥 Li / @MinLiBuilds 的站点。
