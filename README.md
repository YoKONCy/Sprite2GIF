# GIF 帧图集生成器（React）

一个基于 React + Vite 的网页工具：上传一张包含动作序列的雪碧图（帧图集），按 N×N 自动切分并生成 GIF，支持预览与一键“下载到本地”。

**功能概述**
- 上传单张帧图集（支持 `PNG/JPEG/GIF/WebP`）。
- 设定网格大小（`N×N`，如 `3×3`、`4×4`、`5×5`）。
- 播放方向（正向、反向、乒乓），帧间隔与缩放比例。
- 实时预览动画效果。
- 生成 GIF 并自动下载到本地。

**运行环境**
- `Node.js >= 16`
- 推荐使用 Chrome/Edge 最新版本

**安装与启动**
- 安装依赖：`npm install`
- 启动开发：`npm run dev`
- 本地访问：浏览器打开 `http://localhost:5173/`

**使用步骤**
- 在页面左侧“帧图集上传”处选择或拖拽单张雪碧图（例如 4×4 的角色动作帧）。
- 在“参数设置”中调整：
  - `网格大小`：统一设置 `N×N`，行列保持一致。
  - `帧间隔`：每帧的时间（秒）。
  - `循环模式`：`播放一次` 或 `无限循环`。
  - `播放方向`：`正向`、`反向`、`乒乓`。
  - `缩放比例`：预览与导出尺寸按比例缩放。
- 在右侧预览区确认动画效果。
- 点击“下载到本地”按钮，等待生成完成后浏览器会自动保存 `animation_<时间戳>.gif`。

**注意事项**
- 仅支持上传单张雪碧图；若存在边距或间距，请联系我添加参数以精确裁剪。
- 网格大小为 `N×N`，行与列强制一致。
- 首次生成 GIF 可能需要数秒，取决于帧数与图片尺寸。

**命令行工具（可选）**
- 项目附带 Python 脚本 `spritesheet_to_gif.py`，用于本地离线转换：
  - 基本用法：`python spritesheet_to_gif.py 输入图集 输出gif --rows N --cols N`
  - 示例：`python spritesheet_to_gif.py spritesheet.png out.gif --rows 4 --cols 4 --duration 80 --loop 0 --pingpong --scale 1.5`
  - 参数：`--duration`(ms)、`--loop`(0为无限)、`--reverse`、`--pingpong`、`--scale`、`--no-optimize`。

**目录结构**
- `src/components/`：上传、参数面板、预览组件
- `src/pages/HomePage.tsx`：页面整合与下载逻辑
- `src/utils/gifGenerator.ts`：切片与 GIF 生成
- `src/types/gif.ts`：类型定义
- `src/index.css`：样式与滑条自定义

**常见问题**
- 无法下载或生成失败：
  - 检查雪碧图是否为规则网格；
  - 刷新页面重新上传；
  - 若浏览器拦截下载，请允许网站自动保存文件。
- 开发环境 worker 加载问题：项目已通过 `gif.js/dist/gif.worker.js?url` 正确绑定，无需额外配置。

**示例输入/输出**
- 示例输入（雪碧图）：
  - `src/img/1.png`
  - ![示例输入雪碧图](src/img/1.png)
- 示例输出（生成的 GIF）：
  - `src/img/1.gif`
  - ![示例输出GIF](src/img/1.gif)

**许可证**
- 本项目用于学习与演示，素材版权归原作者所有，请勿用于商业用途。
