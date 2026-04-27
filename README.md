# Hyperframes Test Repository

This repository is organized to support multiple video projects using [Hyperframes](https://github.com/heygen-com/hyperframes).

## Folder Structure

```
/
├── videos/
│   ├── welcome-demo/      # Example project
│   │   ├── index.html     # Composition
│   │   ├── meta.json      # Project metadata
│   │   └── assets/        # Local assets (images, video, audio)
│   └── [video-name]/      # Your new video projects
├── renders/               # Output directory for rendered MP4s
├── hyperframes.json       # Global configuration
└── README.md
```

## Usage

### Create a New Video
1. Create a new folder in `videos/`: `mkdir videos/my-new-video`
2. Add an `index.html` and `meta.json` (you can copy from `welcome-demo`).

### Preview
To preview a specific video:
```bash
npx hyperframes preview videos/welcome-demo
```

### Render
To render a specific video to MP4:
```bash
npx hyperframes render videos/welcome-demo
```

## Requirements
- **Node.js 22+**
- **FFmpeg** (installed and in PATH)
