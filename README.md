# 🎬 YouTube Downloader Project

A modern, full-stack YouTube downloader with a sleek Next.js frontend and powerful Python backend.

## 🚀 Tech Stack

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

### Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![yt-dlp](https://img.shields.io/badge/yt--dlp-FF0000?style=for-the-badge&logo=youtube&logoColor=white)

## 🛠️ Development Phases

### 📦 Phase 1: Setup & Configuration

- ✅ Initialize Next.js with TypeScript
- ✅ Install shadcn/ui + Tailwind CSS
- ✅ Configure FastAPI backend with CORS
- ✅ Setup project structure and dependencies

### 🏗️ Phase 2: Core Architecture

- ✅ Create FastAPI REST endpoints
- ✅ YouTube video info extraction with yt-dlp
- ✅ Background download processing
- ✅ Type-safe API communication

### 🎨 Phase 3: UI Components

- 📝 **URL Input Component** - YouTube URL validation & submission
- 🎥 **Video Info Card** - Display video metadata & thumbnails
- 📥 **Download Options** - Format selection (MP4/MP3, qualities)
- 🎛️ **Progress Tracker** - Real-time download status
- 📱 **Responsive Layout** - Mobile-first design

### 🚀 Phase 4: Advanced Features

- ✅ **URL Validation** - Support for YouTube & YouTube Shorts
- 📊 **Metadata Extraction** - Title, views, likes, channel info
- 📥 **Multi-format Downloads** - Various video/audio qualities
- ❌ **Error Handling** - User-friendly error messages
- 🔄 **Status Polling** - Real-time download progress

## 💡 Key Features

### Frontend Features

- 🎯 **Modern UI/UX** with shadcn/ui components
- 📱 **Fully Responsive** design for all devices
- 🎥 **YouTube & Shorts** URL support
- 📊 **Real-time Progress** tracking
- 🔒 **Type-safe** with TypeScript
- ⚡ **Fast Navigation** with Next.js App Router

### Backend Features

- 🚀 **High Performance** with FastAPI & async operations
- 🎬 **Robust Video Processing** using yt-dlp
- 📥 **Background Downloads** with status tracking
- 🔄 **Multiple Format Support** (MP4: 1080p/720p/480p, MP3: 320kbps/128kbps)
- 🛡️ **Error Handling** & validation
- 📊 **RESTful API** design

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.8+
- **pnpm**

### Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Create virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Run the API server:**

```bash
python app.py
# Server starts at http://localhost:8000
```

5. **Verify API is running:**

```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy", "timestamp": "..."}
```

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Configure environment variables:**

```bash
# Create Env
cp .env.development .env.development.local
cp .env.production .env.production.local
```

4. **Run development server:**

```bash
pnpm run dev
```

5. **Open application:**

```
http://localhost:3000
```

## 📚 API Documentation

### Backend Endpoints

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| `GET`  | `/`                              | API health check             |
| `GET`  | `/video-info?url={youtube_url}`  | Get video metadata & formats |
| `POST` | `/download`                      | Start video download         |
| `GET`  | `/download-status/{download_id}` | Check download status        |
| `GET`  | `/health`                        | Health check endpoint        |

### Example API Usage

```typescript
// Get video information
const response = await fetch(
  `${API_URL}/video-info?url=${encodeURIComponent(url)}`
);
const data = await response.json();

// Start download
const downloadResponse = await fetch(`${API_URL}/download`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url, format_id: formatId }),
});

// Check download status
const statusResponse = await fetch(`${API_URL}/download-status/${downloadId}`);
```

## 🏁 Production Deployment

### Backend Deployment

```bash
# Using Docker
FROM python:3.9-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔧 Development Scripts

### Frontend

```bash
pnpm run dev          # Start development server with Turbopack for faster builds
pnpm run build        # Build optimized production bundle
pnpm run start        # Start production server from built files
```

### 🔍 Code Quality & Linting

```bash
pnpm run lint         # Run ESLint to check for code issues
pnpm run lint:fix     # Automatically fix ESLint issues where possible
pnpm run type:check   # Run TypeScript compiler to check for type errors
```

### 🎨 Code Formatting

```bash
pnpm run format       # Format all code files using Prettier
pnpm run format:check # Check if code is formatted correctly (CI/CD)
```

### 🧹 Maintenance

```bash
pnpm run clean        # Remove build artifacts (.next, out, dist folders)
pnpm run analyze      # Analyze bundle size and dependencies
```

### 🐳 Docker Development

```bash
# Production Docker
pnpm run docker:build     # Build production Docker image
pnpm run docker:run       # Run production container on port 3000

# Development Docker
pnpm run docker:build:dev # Build development Docker image with hot reload

# Platform-specific development containers
pnpm run docker:run:dev:cmd        # Windows Command Prompt
pnpm run docker:run:dev:powershell # Windows PowerShell
pnpm run docker:run:dev:mac        # macOS with volume mounting
pnpm run docker:run:dev:linux      # Linux with volume mounting
```

### Backend

```bash
python app.py        # Start development server
uvicorn app:app --reload  # Start with auto-reload
pytest               # Run tests (if configured)
```

## 🐛 Troubleshooting

### Common Issues

**1. CORS Errors**

- Ensure backend CORS is properly configured
- Check frontend API URL in `.env.local`

**2. yt-dlp Download Failures**

- Update yt-dlp: `pip install --upgrade yt-dlp`
- Check YouTube URL format

**3. Port Conflicts**

- Frontend: Change port in `package.json` dev script
- Backend: Modify port in `app.py`

**4. Missing Dependencies**

- Frontend: Delete `node_modules`, run `npm install`
- Backend: Check Python version, reinstall requirements

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Powerful YouTube downloader
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework for production
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

**Ready to build something awesome! 🚀**

For questions or support, please open an issue or reach out to the maintainers.
