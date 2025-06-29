# Music Wallpaper - 音乐壁纸应用

这是一款结合了动态/静态壁纸、音乐播放和白噪音功能于一体的桌面美化应用。它旨在为您创造一个沉浸式、个性化的桌面环境，无论工作还是休闲，都能带来愉悦的视听体验。

**在线体验地址：**[Music Wallpaper](https://musicwallpaper.wctw.fun/)

## ✨ 主要功能

- **🖼️ 壁纸引擎**:
  - 支持视频 (动态壁纸) 和图片 (静态壁纸)。
  - 壁纸画廊，分类展示所有可用壁纸。
  - 平滑的壁纸切换效果。
  - ![壁纸引擎](https://github.com/user-attachments/assets/ae101543-aef8-48f2-8065-841dfdfe1319)


- **🎵 音乐播放器**:
  - 现代化的三栏式布局：曲库、播放列表、播放器控件。
  - 完整播放功能：播放/暂停、上/下一首、进度条、音量控制。
  - 多种播放模式：顺序播放、单曲循环、随机播放。
  - 从本地文件动态加载音乐库。
  - ![音乐播放器](https://github.com/user-attachments/assets/320f182d-50e0-4624-a242-a47e3a42bc35)


- **🎧 白噪音/音频控制**:
  - 侧边栏音频面板，可播放多个环境音轨（如下雨、篝火）。
  - 每个音轨独立的音量控制。
  - "拖动即播放"的便捷交互。
  - ![白噪音/音频控制](https://github.com/user-attachments/assets/7d282e79-03e7-4c66-91cc-95a720f0ac3b)


- **🧩 桌面小组件**:
  - 可拖拽的时钟和倒计时器小组件。
  - 组件位置记忆。
  - 倒计时器支持自定义时长和结束提示音。
  - ![桌面小组件](https://github.com/user-attachments/assets/b0f2ef0e-44ee-4c6e-a3d5-2c88f508ec7c)


- **💎 现代化UI/UX**:
  - 整体采用通透的毛玻璃拟态风格。
  - 流畅的 `framer-motion` 动画效果。
  - 屏幕边缘热区交互，自动呼出/隐藏功能面板。
  - 响应式布局，确保在不同屏幕尺寸下的体验。
  - Logo会随着音频的播放而旋转。
  - ![现代化UI/UX](https://github.com/user-attachments/assets/401a939b-5436-4ea4-9ee6-462fab56083e)


## 🛠️ 技术栈

- **前端框架**: [React](https://react.dev/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/)
- **弹窗通知**: [Sonner](https://sonner.emilkowal.ski/)

## 🚀 本地开发

### 环境准备

- [Node.js](https://nodejs.org/en) (建议使用 v18 或更高版本)
- [pnpm](https://pnpm.io/installation)

### 操作步骤

1.  **克隆仓库**
    ```bash
    git clone <your-repository-url>
    cd music-wallpaper
    ```

2.  **安装依赖**
    ```bash
    pnpm install
    ```

3.  **启动开发服务器**
    ```bash
    pnpm run dev
    ```

4.  在浏览器中访问 `http://localhost:5173` (或Vite指定的其他端口)。


## 📂 如何添加自定义媒体

您可以轻松地添加自己的壁纸和音乐文件，只需将它们放入 `public` 文件夹下的相应目录即可。应用启动时会自动扫描并加载这些资源。

-   **静态壁纸 (图片)**:
    将 `.jpg`, `.png`, `.webp` 等格式的图片文件放入 `public/wallpapers/static/` 目录。

-   **动态壁纸 (视频)**:
    将 `.mp4`, `.webm` 等格式的视频文件放入 `public/wallpapers/dynamic/` 目录。

-   **音乐**:
    将 `.mp3`, `.wav`, `.ogg` 等格式的音频文件放入 `public/music/` 目录。文件名将被用作歌曲名称。

-   **白噪音**:
    将环境音效文件（如风声、雨声）放入 `public/audio/` 目录。

-   **倒计时提示音**:
    替换 `public/alarm/alarm.mp3` 文件为您自己的提示音。

---
祝您使用愉快！

