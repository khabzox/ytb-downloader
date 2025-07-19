"use server";

import { validateYouTubeUrl, YouTubeUrlValidation } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export interface ValidateUrlResponse {
  success: boolean;
  data?: YouTubeUrlValidation;
  error?: string;
}

/**
 * Server action to validate YouTube URL
 */
export async function validateUrl(formData: FormData): Promise<ValidateUrlResponse> {
  try {
    const url = formData.get("url") as string;

    if (!url) {
      return {
        success: false,
        error: "URL is required"
      };
    }

    // Validate the YouTube URL
    const validation = validateYouTubeUrl(url);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "Invalid YouTube URL"
      };
    }

    return {
      success: true,
      data: validation
    };

  } catch (error) {
    console.error("URL validation error:", error);
    return {
      success: false,
      error: "Failed to validate URL. Please try again."
    };
  }
}

/**
 * Server action to validate YouTube URL from string
 */
export async function validateUrlFromString(url: string): Promise<ValidateUrlResponse> {
  try {
    if (!url) {
      return {
        success: false,
        error: "URL is required"
      };
    }

    const validation = validateYouTubeUrl(url);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "Invalid YouTube URL"
      };
    }

    // Log successful validation
    console.log("URL validated successfully:", {
      videoId: validation.videoId,
      isShort: validation.isShort,
      originalUrl: validation.originalUrl
    });

    return {
      success: true,
      data: validation
    };

  } catch (error) {
    console.error("URL validation error:", error);
    return {
      success: false,
      error: "Failed to validate URL. Please try again."
    };
  }
}

/**
 * Server action to batch validate multiple URLs
 */
export async function validateMultipleUrls(urls: string[]): Promise<{
  results: ValidateUrlResponse[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
}> {
  const results = await Promise.all(
    urls.map(url => validateUrlFromString(url))
  );

  const summary = {
    total: results.length,
    valid: results.filter(r => r.success).length,
    invalid: results.filter(r => !r.success).length
  };

  return { results, summary };
}