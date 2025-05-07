# Image Compressor App

A fast and modern image compression web app built with **Astro**, **Vite**, **TypeScript**, and **React**. Users can compress and convert multiple images using **Sharp**, download them in bulk using **JSZip**, and save locally via **FileSaver.js**. Styled with the elegant **shadcn/ui** library. Containerized using **Docker** for easy deployment.

## 🚀 Features

- 🔄 Compress and convert multiple images at once using a drag and drop interface or uploading files directly from your computer
- 📦 Download compressed files individually or as a ZIP archive
- 💅 Stylish and accessible UI with shadcn
- ⚡ Fast development with Vite and Astro
- 🐳 Docker support for containerized deployment

## 📦 Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://reactjs.org/), [shadcn/ui](https://ui.shadcn.com/)
- **Compression & Export**: [Sharp](https://sharp.pixelplumbing.com/), [JSZip](https://stuk.github.io/jszip/), [FileSaver.js](https://github.com/eligrey/FileSaver.js)
- **Deployment**: [Docker](https://www.docker.com/)

## 📥 Cloning the Repository

To get started locally:

```bash
git clone https://github.com/aronhawkins-4/image-compressor.git
cd image-compressor
npm install
```

## 🛠️ Scripts

To run and manage the project locally or in production, use the following scripts:

| Script           | Description                            |
|------------------|----------------------------------------|
| `npm run dev`     | Starts the dev server (hot reload)      |
| `npm run build`   | Builds the app for production           |
| `npm run preview` | Previews the production build           |
| `npm run astro`   | Runs Astro CLI commands manually        |
| `npm run docker`  | Builds and runs the Docker container    |

## 🐳 Docker Usage

The `npm run docker` script runs the following commands:

```bash
docker build -t image-compressor . && docker run -p 4322:4322 image-compressor
```
This will start a Docker container with your application and run it at http://localhost:4322

## 🧪 Contributing
Feel free to fork, submit issues, or open pull requests. Contributions are welcome!