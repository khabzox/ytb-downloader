# 🎬 YouTube Downloader - Frontend

A modern, responsive Next.js frontend for the YouTube Downloader application with sleek UI/UX and real-time download tracking.

## 🚀 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

## 💡 Key Features

- 🎯 **Modern UI/UX** with shadcn/ui components
- 📱 **Fully Responsive** design for all screen sizes
- 🎥 **YouTube & Shorts** URL support with validation
- 📊 **Real-time Progress** tracking and status updates
- 🔒 **Type-safe** development with TypeScript
- ⚡ **Fast Performance** with Next.js App Router
- 🎨 **Dark/Light Mode** support
- 🔄 **Optimistic UI** updates for better UX

## 🛠️ Development Phases

### 📦 Phase 1: Setup & Configuration

- ✅ Initialize Next.js with TypeScript
- ✅ Install and configure shadcn/ui
- ✅ Setup Tailwind CSS with custom theme
- ✅ Configure project structure and linting

### 🏗️ Phase 2: Core Architecture

- ✅ Create type-safe API communication layer
- ✅ Implement custom hooks for state management
- ✅ Setup theme provider and responsive layouts
- ✅ Configure routing and navigation

### 🎨 Phase 3: UI Components

- 📝 **URL Input Component** - YouTube URL validation & submission
- 🎥 **Video Info Card** - Display video metadata, thumbnails, and channel info
- 📥 **Download Options** - Interactive format selection with size estimates
- 🎛️ **Progress Tracker** - Real-time download status with progress bars
- 📱 **Responsive Layout** - Mobile-first design with adaptive components

### 🚀 Phase 4: Advanced Features

- ✅ **Real-time Updates** - WebSocket or polling for download progress
- 🔄 **Error Boundaries** - Graceful error handling and user feedback
- 🎯 **Performance Optimization** - Code splitting and lazy loading
- 📊 **Analytics Integration** - User interaction tracking
- 🔐 **Input Validation** - Robust form validation and sanitization

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **pnpm** 8.0 or higher

### Installation

1. **Install dependencies:**

```bash
pnpm install
```

2. **Configure environment variables:**

```bash
# Create Env
cp .env.development .env.development.local
cp .env.production .env.production.local
```

3. **Run the development server:**

```bash
pnpm run dev
# Server starts with Turbopack for faster builds
```

4. **Open your browser:**

```
http://localhost:3000
```

## 📚 Available Scripts

### 🚀 Development Scripts

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

## 🎨 Component Architecture

### Core Components

**URL Input Component (`components/url-input.tsx`)**

- YouTube URL validation
- Real-time feedback
- Support for various URL formats
- Loading states and error handling

**Video Info Card (`components/video-info-card.tsx`)**

- Video metadata display
- Responsive thumbnail
- Channel information
- View count and duration

**Download Options (`components/download-options.tsx`)**

- Format selection (MP4/MP3)
- Quality options with size estimates
- Recommended format highlighting
- Interactive selection interface

**Progress Tracker (`components/progress-tracker.tsx`)**

- Real-time download progress
- Status indicators
- Error state handling
- Download completion feedback

### Custom Hooks

**useDownload (`hooks/use-download.ts`)**

```typescript
const { videoData, downloadOptions, isLoading, error, startDownload, checkStatus } = useDownload();
```

**useDebounce (`hooks/use-debounce.ts`)**

```typescript
const debouncedValue = useDebounce(inputValue, 300);
```

## 🔧 Configuration

### Tailwind CSS Setup

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        // ... custom color scheme
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile (320px+)**: Single column layout, touch-friendly controls
- **Tablet (768px+)**: Two-column layout, enhanced spacing
- **Desktop (1024px+)**: Multi-column layout, hover interactions
- **Large (1280px+)**: Wide layout with maximum content width

## 🎯 Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const VideoPlayer = dynamic(() => import('./video-player'), {
  loading: () => <VideoPlayerSkeleton />
});
```

### Image Optimization

```typescript
// Next.js Image component for optimized loading
<Image
  src={thumbnail}
  alt={title}
  width={640}
  height={360}
  priority
  className="rounded-lg"
/>
```

### Bundle Analysis

```bash
npm run analyze  # View bundle size breakdown
```

## 🔍 Type Safety

### API Types

```typescript
// types/video.ts
export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  upload_date: string;
  description: string;
  channel: ChannelInfo;
}

export interface DownloadOption {
  type: "MP4" | "MP3";
  quality: string;
  size: string;
  format_id: string;
  recommended: boolean;
}
```

### API Communication

```typescript
// lib/api.ts
export async function fetchVideoInfo(url: string): Promise<VideoInfoResponse> {
  const response = await fetch(`${API_URL}/video-info?url=${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error("Failed to fetch video info");
  return response.json();
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 👨‍💻 Author

**Abdelkabir** - _Full Stack Developer_

🎨 Specialized in modern React development with Next.js and TypeScript  
🎭 Expert in UI/UX design with shadcn/ui and Tailwind CSS  
📱 Passionate about responsive design and user experience  
🔗 Experienced in API integration and state management

_Connect with me:_

- 💼 [LinkedIn](https://linkedin.com/in/khabzox)
- 🐱 [GitHub](https://github.com/khabzox)
<!-- - 🌐 [Portfolio](https://your-website.com) -->
<!-- - 📧 [Email](mailto:your-email@domain.com) -->

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write meaningful component names and props
- Add proper TypeScript types for all components
- Test components on multiple screen sizes
- Ensure accessibility standards (WCAG 2.1)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Built with ❤️ using Next.js and modern web technologies**
