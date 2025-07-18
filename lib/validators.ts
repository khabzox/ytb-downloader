import { z } from "zod";

// Comprehensive YouTube URL regex that handles:
// - Regular videos: youtube.com/watch?v=VIDEO_ID
// - YouTube Shorts: youtube.com/shorts/VIDEO_ID
// - Short URLs: youtu.be/VIDEO_ID
// - Embedded videos: youtube.com/embed/VIDEO_ID
// - Mobile URLs: m.youtube.com
// - Various protocols and subdomains
export const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})([&?][a-zA-Z0-9_=&-]*)?$/i;

// More permissive regex for basic YouTube domain detection
export const YOUTUBE_DOMAIN_REGEX = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\/.+$/i;

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmedUrl = url.trim();

  // Try comprehensive regex first
  const match = trimmedUrl.match(YOUTUBE_URL_REGEX);
  if (match && match[5]) {
    return match[5];
  }

  // Fallback patterns for edge cases
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, // ?v= parameter
    /\/embed\/([a-zA-Z0-9_-]{11})/, // embed format
    /\/v\/([a-zA-Z0-9_-]{11})/, // /v/ format
    /\/shorts\/([a-zA-Z0-9_-]{11})/, // shorts format
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // short URL format
  ];

  for (const pattern of patterns) {
    const match = trimmedUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Determine if URL is a YouTube Short
 */
export function isYouTubeShort(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return /\/shorts\/[a-zA-Z0-9_-]{11}/.test(url.trim());
}

/**
 * Validate YouTube URL and extract metadata
 */
export interface YouTubeUrlValidation {
  isValid: boolean;
  videoId?: string;
  isShort?: boolean;
  originalUrl?: string;
  normalizedUrl?: string;
  error?: string;
}

export function validateYouTubeUrl(url: string): YouTubeUrlValidation {
  if (!url || typeof url !== "string") {
    return {
      isValid: false,
      error: "URL is required",
    };
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return {
      isValid: false,
      error: "URL cannot be empty",
    };
  }

  // Check if it's a YouTube domain
  if (!YOUTUBE_DOMAIN_REGEX.test(trimmedUrl)) {
    return {
      isValid: false,
      error: "Please enter a valid YouTube URL",
    };
  }

  // Extract video ID
  const videoId = extractYouTubeVideoId(trimmedUrl);

  if (!videoId) {
    return {
      isValid: false,
      error: "Could not extract video ID from URL",
    };
  }

  // Check if it's a short
  const isShort = isYouTubeShort(trimmedUrl);

  // Create normalized URL
  const normalizedUrl = isShort
    ? `https://www.youtube.com/shorts/${videoId}`
    : `https://www.youtube.com/watch?v=${videoId}`;

  return {
    isValid: true,
    videoId,
    isShort,
    originalUrl: trimmedUrl,
    normalizedUrl,
  };
}

/**
 * Zod schema for form validation
 */
export const youtubeUrlSchema = z.object({
  url: z
    .string()
    .min(1, "YouTube URL is required")
    .refine(
      (url: string) => validateYouTubeUrl(url).isValid,
      {
        message: "Please enter a valid YouTube URL",
      },
    ),
});

export type YouTubeUrlFormData = z.infer<typeof youtubeUrlSchema>;

/**
 * React Hook Form resolver for YouTube URL validation
 */
export const youtubeUrlResolver = (data: any) => {
  try {
    const parsed = youtubeUrlSchema.parse(data);
    return { values: parsed, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        values: {},
        errors: error.issues.reduce((acc, issue) => {
          const path = issue.path.join(".");
          acc[path] = { message: issue.message };
          return acc;
        }, {} as any),
      };
    }
    return { values: {}, errors: { url: { message: "Invalid URL" } } };
  }
};

/**
 * Server action helper
 */
export async function validateYouTubeUrlServer(formData: FormData) {
  const url = formData.get("url") as string;
  const validation = validateYouTubeUrl(url);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  return {
    success: true,
    data: {
      videoId: validation.videoId,
      isShort: validation.isShort,
      normalizedUrl: validation.normalizedUrl,
    },
  };
}
