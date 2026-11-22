// 复制本文件为 config.js，用来覆盖公开的 config.public.js（家里或树莓派）。
// 只填写项目网址和 anon 公钥（Project Settings → API）。
// 不要把 service_role 密钥写进这里，也不要提交 config.js。
// 没有这个文件，或里面是空的，页面会改用 config.public.js。两份都不可用时才以访客打开。
window.BILIPICKS_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
