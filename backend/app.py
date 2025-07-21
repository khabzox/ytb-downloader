from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
import yt_dlp
import re
import os
import uuid
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor
import humanize

app = FastAPI(title="YouTube Downloader API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class VideoInfo(BaseModel):
    id: str
    title: str
    thumbnail: str
    duration: str
    views: str
    likes: str
    upload_date: str
    description: str
    channel: Dict[str, Any]

class DownloadOption(BaseModel):
    type: str
    quality: str
    size: str
    format_id: str
    recommended: bool = False

class VideoDataResponse(BaseModel):
    video_data: VideoInfo
    download_options: List[DownloadOption]

class DownloadRequest(BaseModel):
    url: str
    format_id: str

class DownloadResponse(BaseModel):
    download_id: str
    status: str
    message: str

# Thread pool for blocking operations
executor = ThreadPoolExecutor(max_workers=4)

# Store download tasks
download_tasks = {}

def extract_video_id(url: str) -> str:
    """Extract video ID from YouTube URL"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
        r'youtube\.com\/.*v=([^&\n?#]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    raise ValueError("Invalid YouTube URL")

def format_duration(seconds: int) -> str:
    """Convert seconds to MM:SS format"""
    if not seconds:
        return "0:00"
    
    minutes = seconds // 60
    secs = seconds % 60
    return f"{minutes}:{secs:02d}"

def format_number(num: int) -> str:
    """Format large numbers with commas"""
    if num is None:
        return "0"
    return f"{num:,}"

def get_video_info(url: str) -> Dict[str, Any]:
    """Extract video information using yt-dlp"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
            return info
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to extract video info: {str(e)}")

def process_video_data(info: Dict[str, Any]) -> VideoDataResponse:
    """Process yt-dlp info into our API format"""
    
    # Format upload date
    upload_date = info.get('upload_date', '')
    if upload_date:
        try:
            date_obj = datetime.strptime(upload_date, '%Y%m%d')
            formatted_date = date_obj.strftime('%Y-%m-%d')
        except:
            formatted_date = upload_date
    else:
        formatted_date = "Unknown"
    
    # Build video data
    video_data = VideoInfo(
        id=info.get('id', ''),
        title=info.get('title', 'Unknown Title'),
        thumbnail=info.get('thumbnail', ''),
        duration=format_duration(info.get('duration', 0)),
        views=format_number(info.get('view_count', 0)),
        likes=format_number(info.get('like_count', 0)),
        upload_date=formatted_date,
        description=info.get('description', '')[:500] + '...' if info.get('description', '') else '',
        channel={
            "name": info.get('uploader', 'Unknown Channel'),
            "avatar": info.get('uploader_avatar', ''),
            "subscribers": format_number(info.get('channel_follower_count', 0)),
            "verified": info.get('channel_is_verified', False),
            "bio": info.get('channel_description', '')[:200] + '...' if info.get('channel_description', '') else '',
            "social_links": {
                "youtube": info.get('uploader_url', ''),
                "twitter": "",
                "website": ""
            }
        }
    )
    
    # Process formats for download options
    download_options = []
    formats = info.get('formats', [])
    
    # Filter and sort video formats
    video_formats = []
    audio_formats = []
    
    for fmt in formats:
        if fmt.get('vcodec') != 'none' and fmt.get('acodec') != 'none':  # Video + Audio
            video_formats.append(fmt)
        elif fmt.get('vcodec') == 'none' and fmt.get('acodec') != 'none':  # Audio only
            audio_formats.append(fmt)
    
    # Add video options (MP4)
    quality_priorities = ['1080', '720', '480', '360', '240']
    added_qualities = set()
    
    for quality in quality_priorities:
        for fmt in video_formats:
            height = fmt.get('height', 0)
            if str(height).startswith(quality) and quality not in added_qualities:
                filesize = fmt.get('filesize') or fmt.get('filesize_approx', 0)
                size_mb = filesize / (1024 * 1024) if filesize else 100  # Default estimate
                
                download_options.append(DownloadOption(
                    type="MP4",
                    quality=f"{height}p" if height else f"{quality}p",
                    size=f"{size_mb:.0f} MB",
                    format_id=str(fmt.get('format_id', '')),
                    recommended=(quality == '1080')
                ))
                added_qualities.add(quality)
                break
    
    # Add audio options (MP3)
    audio_qualities = [('320', '320kbps'), ('128', '128kbps')]
    for quality_code, quality_label in audio_qualities:
        # Find best audio format for this quality
        best_audio = None
        for fmt in audio_formats:
            abr = fmt.get('abr', 0)
            if abs(abr - int(quality_code)) < 50:  # Within 50 kbps
                best_audio = fmt
                break
        
        if not best_audio and audio_formats:
            best_audio = audio_formats[0]  # Fallback to first audio format
        
        if best_audio:
            filesize = best_audio.get('filesize') or best_audio.get('filesize_approx', 0)
            size_mb = filesize / (1024 * 1024) if filesize else (int(quality_code) * info.get('duration', 180) / 1000)
            
            download_options.append(DownloadOption(
                type="MP3",
                quality=quality_label,
                size=f"{size_mb:.0f} MB",
                format_id=str(best_audio.get('format_id', '')),
                recommended=False
            ))
    
    return VideoDataResponse(
        video_data=video_data,
        download_options=download_options
    )

async def download_video(url: str, format_id: str, download_id: str):
    """Download video in background"""
    try:
        download_tasks[download_id]['status'] = 'downloading'
        
        # Create downloads directory
        os.makedirs('downloads', exist_ok=True)
        
        ydl_opts = {
            'format': format_id,
            'outtmpl': f'downloads/{download_id}.%(ext)s',
            'quiet': True,
            'no_warnings': True,
        }
        
        def download_sync():
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
        
        # Run download in thread pool
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(executor, download_sync)
        
        download_tasks[download_id]['status'] = 'completed'
        download_tasks[download_id]['message'] = 'Download completed successfully'
        
    except Exception as e:
        download_tasks[download_id]['status'] = 'failed'
        download_tasks[download_id]['message'] = f'Download failed: {str(e)}'

@app.get("/")
async def root():
    return {"message": "YouTube Downloader API", "version": "1.0.0"}

@app.get("/video-info")
async def get_video_info_endpoint(url: str) -> VideoDataResponse:
    """Get video information and available download formats"""
    try:
        # Validate URL
        video_id = extract_video_id(url)
        
        # Get video info in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        info = await loop.run_in_executor(executor, get_video_info, url)
        
        # Process and return data
        return process_video_data(info)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/download")
async def download_video_endpoint(request: DownloadRequest, background_tasks: BackgroundTasks) -> DownloadResponse:
    """Start video download"""
    try:
        # Generate download ID
        download_id = str(uuid.uuid4())
        
        # Initialize task tracking
        download_tasks[download_id] = {
            'status': 'pending',
            'message': 'Download queued',
            'created_at': datetime.now().isoformat()
        }
        
        # Start download in background
        background_tasks.add_task(download_video, request.url, request.format_id, download_id)
        
        return DownloadResponse(
            download_id=download_id,
            status='pending',
            message='Download started'
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start download: {str(e)}")

@app.get("/download-status/{download_id}")
async def get_download_status(download_id: str):
    """Get download status"""
    if download_id not in download_tasks:
        raise HTTPException(status_code=404, detail="Download not found")
    
    task = download_tasks[download_id]
    return {
        "download_id": download_id,
        "status": task['status'],
        "message": task['message'],
        "created_at": task['created_at']
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)