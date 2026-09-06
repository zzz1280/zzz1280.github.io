# 张伟 (Alex Zhang) 的个人主页

基于 **GitHub Pages** 托管的现代化、响应式个人主页。
纯原生 HTML / CSS / JavaScript 实现，**零依赖、零构建**，克隆即可运行。

👉 线上地址：`https://zzz1280.github.io/`（部署后替换为你的用户名）

## 目录结构

```text
.
├── index.html          # 主页面（全部内容都在这一个页面里）
├── css/
│   └── style.css       # 全部样式（暗色系 + 蓝色渐变主题）
├── js/
│   └── script.js       # 全部交互（打字机、滚动高亮、动画、表单校验等）
├── assets/             # 图片等静态资源
│   ├── avatar.svg      # 头像占位图（✏️ 替换为你的照片）
│   ├── project-1.svg   # 项目配图占位（✏️ 替换）
│   ├── project-2.svg   # 项目配图占位（✏️ 替换）
│   ├── project-3.svg   # 项目配图占位（✏️ 替换）
│   └── favicon.svg     # 网站图标（✏️ 可替换）
└── README.md
```

## 本地预览

直接双击 `index.html` 用浏览器打开即可；
或者起一个本地服务器（推荐，路径行为与线上一致）：

```bash
# 任选其一
npx serve .
python -m http.server 8000
```

然后访问终端里提示的地址（如 http://localhost:8000）。

## 部署到 GitHub Pages（分步指南）

### 第 1 步：在 GitHub 上创建仓库

1. 登录 [github.com](https://github.com)，点击右上角 **`+` → New repository**。
2. 仓库名必须填 **`<你的GitHub用户名>.github.io`**（例如用户名是 `alexzhang`，仓库名就是 `alexzhang.github.io`，大小写要完全一致）。
3. 可见性选 **Public**，不要勾选任何初始化选项（README / .gitignore / license 都不要加）。
4. 点击 **Create repository**。

### 第 2 步：本地初始化并推送

在本项目文件夹下打开终端（Git Bash / PowerShell 均可）：

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "feat: 初始化个人主页"

# 关联远程仓库（把 zzz1280 换成你的 GitHub 用户名）
git branch -M main
git remote add origin https://github.com/zzz1280/zzz1280.github.io.git

# 推送到 GitHub
git push -u origin main
```

> 首次推送会弹出 GitHub 登录窗口（或要求 Personal Access Token），
> 按提示登录即可。后续更新只需 `git add . && git commit -m "update" && git push`。

### 第 3 步：开启 GitHub Pages

1. 打开你的仓库页面，进入 **Settings → Pages**（左侧栏）。
2. **Source** 选择 `Deploy from a branch`。
3. **Branch** 选择 `main`，目录选择 `/ (root)`，点击 **Save**。
   （`用户名.github.io` 仓库通常会自动按此配置启用，确认一遍即可。）
4. 等待 1~3 分钟，仓库的 **Actions** 标签页会出现一次 "pages build and deployment" 运行。

### 第 4 步：验证部署

- 浏览器访问 **`https://zzz1280.github.io/`**。
- 打开开发者工具（F12）→ **Network** 标签 → 刷新页面：
  `index.html`、`css/style.css`、`js/script.js` 及图片均应返回 **200**。
- 看不到更新时按 **Ctrl + F5** 强制刷新（GitHub Pages 有 CDN 缓存，最长约 10 分钟）。

## 让表单真正收到邮件（可选）

GitHub Pages 是纯静态托管，联系表单默认为**演示模式**（不会真的发信）。
推荐接入 [Formspree](https://formspree.io)：

1. 注册 Formspree 并新建表单，得到形如 `https://formspree.io/f/xxxxxx` 的地址。
2. 修改 `index.html` 中的 `<form id="contact-form">`：

   ```html
   <form class="contact-form" id="contact-form"
         action="https://formspree.io/f/xxxxxx" method="POST">
   ```

3. 删除 `js/script.js` 中「7. 联系表单」里 `form.reset()` 前后的演示逻辑
   （保留校验也可以，把提交改为 `fetch` 到 Formspree 地址即可，官方文档有示例）。

## 常见问题排查

| 现象 | 原因与解决 |
| --- | --- |
| 访问 404 | ① 仓库名与用户名不完全一致；② Pages 未启用或分支/目录选错；③ `index.html` 不在仓库根目录；④ 刚推送，等 1~3 分钟再到 Actions 页看部署状态。 |
| 样式 / 脚本没加载（页面裸奔） | ① **文件名大小写不一致**——GitHub Pages 服务器区分大小写，`Style.css` ≠ `style.css`；② 路径写成了绝对路径 `/css/...`，请保持相对路径 `css/...`；③ F12 → Network 里找红色 404 的资源名，逐一核对。 |
| 更新后内容没变 | CDN 缓存：等最多 10 分钟，并 Ctrl + F5 强刷；确认推送成功（`git push` 无报错）。 |
| 图片不显示 | 检查 `assets/` 目录名、文件名大小写与 HTML 中引用是否完全一致。 |
| 推送被拒绝 | 先 `git pull --rebase origin main` 再 `git push`；或确认远程地址拼写正确。 |

## 自定义指南

- **配色**：全部颜色集中在 `css/style.css` 顶部的 `:root` 变量里，
  改 `--primary` / `--primary-2` 即可整体换色（例如换成紫色系 `#8b5cf6` + `#ec4899`）。
- **内容**：在 `index.html` 中搜索 `✏️`，所有需要替换的占位内容都有标注。
- **技能**：修改 `.skill-card` 的名称、百分比文本和 `--level` 变量（三者保持一致）。
- **项目**：替换 `assets/project-*.svg` 为你的截图（建议 800×500），更新卡片文字与链接。
- **头像**：把照片（如 `avatar.jpg`）放进 `assets/`，并修改 `index.html` 中头像 `<img>` 的 `src`。
- **绑定自定义域名（可选）**：仓库根目录添加 `CNAME` 文件写入你的域名，
  在域名服务商处添加 CNAME 记录指向 `zzz1280.github.io`，
  再到 Settings → Pages → Custom domain 填入并开启 Enforce HTTPS。

## 技术说明

- 纯静态、无框架、无外部 CDN 依赖，国内访问速度不受额外资源影响。
- 兼容 Chrome / Firefox / Safari / Edge 现代版本；遵循 W3C 语义化标签。
- 无障碍：跳转链接、ARIA 标签、键盘焦点样式、`prefers-reduced-motion` 适配。
- SEO：meta 描述、Open Graph、canonical、语义化标题层级。
