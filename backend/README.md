# YouTube Downloader API Usage Guide

## Installation

1. Install Python 3.8 or higher
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the API:

```bash
python app.py
# or
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### 1. Get Video Information

**GET** `/video-info?url={youtube_url}`

Returns video metadata and available download formats.

**Example Request:**

```bash
curl "http://localhost:8000/video-info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Example Response:**

```json
{
  "video_data": {
    "id": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up (Official Video)",
    "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "duration": "3:32",
    "views": "1,234,567,890",
    "likes": "12,345,678",
    "upload_date": "2009-10-25",
    "description": "The official video for 'Never Gonna Give You Up' by Rick Astley...",
    "channel": {
      "name": "Rick Astley",
      "avatar": "https://yt3.ggpht.com/...",
      "subscribers": "2,500,000",
      "verified": true,
      "bio": "Official Rick Astley YouTube Channel",
      "social_links": {
        "youtube": "https://youtube.com/@RickAstley",
        "twitter": "",
        "website": ""
      }
    }
  },
  "download_options": [
    {
      "type": "MP4",
      "quality": "1080p",
      "size": "245 MB",
      "format_id": "137+140",
      "recommended": true
    },
    {
      "type": "MP4",
      "quality": "720p",
      "size": "156 MB",
      "format_id": "136+140",
      "recommended": false
    },
    {
      "type": "MP3",
      "quality": "320kbps",
      "size": "12 MB",
      "format_id": "140",
      "recommended": false
    }
  ]
}
```

### 2. Start Download

**POST** `/download`

Starts a background download task.

**Request Body:**

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format_id": "137+140"
}
```

**Response:**

```json
{
  "download_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "pending",
  "message": "Download started"
}
```

### 3. Check Download Status

**GET** `/download-status/{download_id}`

**Response:**

```json
{
  "download_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "message": "Download completed successfully",
  "created_at": "2024-01-15T10:30:00"
}
```

## Status Values

- `pending`: Download queued
- `downloading`: Download in progress
- `completed`: Download finished successfully
- `failed`: Download failed (check message for details)

## JavaScript/Frontend Integration

```javascript
// Get video info
async function getVideoInfo(url) {
  const response = await fetch(`/video-info?url=${encodeURIComponent(url)}`);
  return await response.json();
}

// Start download
async function startDownload(url, formatId) {
  const response = await fetch("/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, format_id: formatId }),
  });
  return await response.json();
}

// Check download status
async function checkDownloadStatus(downloadId) {
  const response = await fetch(`/download-status/${downloadId}`);
  return await response.json();
}

// Usage example
const videoData = await getVideoInfo(
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
);
const download = await startDownload(videoData.video_data.id, "137+140");
const status = await checkDownloadStatus(download.download_id);
```

## Features

✅ **Video Information Extraction**

- Title, description, duration
- View count, like count
- Channel information
- Thumbnail URLs

✅ **Multiple Format Support**

- MP4 (Various qualities: 1080p, 720p, 480p)
- MP3 (320kbps, 128kbps)
- Automatic size estimation

✅ **Background Downloads**

- Non-blocking download process
- Status tracking with unique IDs
- Progress monitoring

✅ **RESTful Design**

- Clean endpoints
- Proper HTTP status codes
- JSON responses

✅ **Error Handling**

- URL validation
- Graceful error messages
- Exception handling

## Notes

- Downloads are saved to the `downloads/` directory
- The API uses yt-dlp for video processing
- CORS is enabled for frontend integration
- Thread pool handles blocking operations
- Files are named with download ID + extension
