# Hyperframes Test

This repository is set up to test [Hyperframes](https://github.com/heygen-com/hyperframes), a tool for rendering videos using HTML, CSS, and JavaScript.

## Setup

- **Node.js**: Version 22 or higher is required.
- **FFmpeg**: Must be installed and available in your system's PATH.

## Project Structure

- `index.html`: The main composition file. Defines the layout and animations (using GSAP).
- `hyperframes.json`: Configuration for the Hyperframes tool.
- `meta.json`: Metadata for the video composition.

## Usage

### Preview
To preview the video in your browser:
```bash
npx hyperframes preview
```

### Render
To render the video to an MP4 file:
```bash
npx hyperframes render
```

The output will be saved as `main.mp4` (or as configured in `meta.json`).

## Demo Features
- Modern UI with Google Fonts (Outfit & Space Grotesk)
- GSAP-powered entrance and pulse animations
- Glassmorphism effects
- Responsive 1080p composition
