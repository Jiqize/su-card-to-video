# su-card-to-video

这是一个最小 AI 图卡视频 Skill / 模板。

它帮你用 HTML/CSS 制作 16:9 图卡，用 HyperFrames/GSAP 或其他网页渲染方式做简单动效，再用 FFmpeg 把画面和音频合成视频。

它不绑定剪映，不需要真人出镜，但也不包含任何语音复刻 API。你可以自己录音，也可以使用任意 TTS、声音复刻或音频生成方式；准备好音频后，就可以生成一条最简单的 AI 视频。

## Demo

无配音 demo：

[demo/demo-no-audio.mp4](demo/demo-no-audio.mp4)

## 适合做什么

- 用图卡形式快速做一条 16:9 AI 视频
- 把文案、字幕、知识点做成简单动态图卡
- 给不想出镜、不想手动剪辑的人一个本地可跑的起点
- 给 Codex 或其他 Agent 一个可复制的图卡视频工作流

## 不包含什么

- 不包含语音复刻 API
- 不包含自动写稿、选题、发布流程
- 不包含剪映工程
- 不包含完整内容工厂

## 需要提前安装

### 1. Node.js 22+

macOS:

```bash
brew install node
```

如果你使用 `nvm`，也可以自行切到 Node.js 22+。

### 2. FFmpeg

macOS:

```bash
brew install ffmpeg
```

### 3. HyperFrames

HyperFrames 是开源的 HTML 视频渲染工具。

你可以全局安装：

```bash
npm install -g hyperframes
```

也可以不全局安装，直接用 `npx`：

```bash
npx hyperframes doctor
```

参考链接：

- HyperFrames GitHub: https://github.com/heygen-com/hyperframes
- HyperFrames CLI: https://hyperframes.heygen.com/packages/cli

## 快速开始

```bash
npm install
npm run doctor
npm run render
```

默认 demo 会在没有音频文件时生成一段静音占位，确保你先跑通流程。

如果你已经准备好了自己的音频：

```bash
npm run render -- ./my-voice.mp3
```

输出文件：

```text
examples/basic-16x9/output/final.mp4
```

## 工作流

```text
文案/字幕
  -> HTML/CSS 图卡
  -> HyperFrames/GSAP 动效渲染
  -> FFmpeg 合成音频
  -> MP4 视频
```

## 在 Codex 中使用

推荐把**整个仓库**交给 Codex 使用，或在仓库根目录中让 Codex 读取 `skill/SKILL.md` 后执行。

不要只把 `skill/SKILL.md` 单独复制到 `~/.codex/skills/` 使用：这个 Skill 会引用仓库内的 `examples/basic-16x9/index.html`、`scripts/` 和输出目录；如果只复制单个文件，这些路径不会存在。

你可以这样告诉 Codex：

```text
请在这个 su-card-to-video 仓库根目录中使用 skill/SKILL.md 的工作流，根据我的文案修改 examples/basic-16x9/index.html，并用 npm run render 生成视频。
```

## 在其他 Agent 里使用

如果你不用 Codex，也可以把下面这段话复制给你正在使用的 Agent：

```text
请按 su-card-to-video 的工作流帮我生成一条最小 AI 图卡视频：用 HTML/CSS 制作 16:9 图卡画面，用 GSAP 或你可用的网页动效方式制作简单转场，用 FFmpeg 把画面和我提供的音频合成为 MP4。不要调用图像模型，不要要求真人出镜，不要使用剪映。优先保持流程简单、可本地运行、可复用。

你需要完成三件事：
1. 根据我的文案生成 index.html，里面包含 16:9 图卡画面和基础动效。
2. 使用 HyperFrames、Playwright、Puppeteer、浏览器录制或其他可用方式把 HTML 渲染成视频画面。
3. 使用 FFmpeg 合成我提供的音频，输出 MP4。
```

## 改自己的内容

优先改这几个地方：

- `examples/basic-16x9/index.html`：图卡画面、文字、颜色和动效
- `examples/basic-16x9/output/`：渲染输出目录
- `scripts/render.sh`：渲染参数和合成逻辑

## 音频说明

这个模板不限制音频来源。你可以：

- 自己录一段口播音频
- 使用任意 TTS 工具生成音频
- 使用你自己的声音复刻工具生成音频
- 先用静音占位跑通流程，再替换成正式音频

准备好音频后，运行：

```bash
npm run render -- ./path/to/audio.mp3
```
