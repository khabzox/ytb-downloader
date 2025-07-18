"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardPaste, AlertCircle, CheckCircle, Film, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  youtubeUrlSchema,
  YouTubeUrlFormData,
  validateYouTubeUrl,
  YouTubeUrlValidation,
} from "@/lib/validators";

export default function UrlInput() {
  const [realTimeValidation, setRealTimeValidation] = useState<YouTubeUrlValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger,
    setError,
    clearErrors,
  } = useForm<YouTubeUrlFormData>({
    resolver: zodResolver(youtubeUrlSchema),
    mode: "onChange",
  });

  const urlValue = watch("url");

  // Real-time validation as user types
  useEffect(() => {
    if (!urlValue || urlValue.trim() === "") {
      setRealTimeValidation(null);
      setSubmitError(null);
      return;
    }

    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      const validation = validateYouTubeUrl(urlValue);
      setRealTimeValidation(validation);
      setIsValidating(false);

      // Clear submit errors when validation changes
      if (validation.isValid) {
        setSubmitError(null);
        clearErrors("url");
      }
    }, 300); // Debounce validation

    return () => clearTimeout(timeoutId);
  }, [urlValue, clearErrors]);

  const onSubmit: SubmitHandler<YouTubeUrlFormData> = async data => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Double-check validation before submitting
      const validation = validateYouTubeUrl(data.url);

      if (!validation.isValid) {
        setError("url", {
          type: "manual",
          message: validation.error || "Invalid YouTube URL",
        });
        setSubmitError(validation.error || "Please enter a valid YouTube URL");
        setIsSubmitting(false);
        return;
      }

      // Simulate processing time (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to download page with validated data
      const searchParams = new URLSearchParams({
        url: encodeURIComponent(validation.normalizedUrl || data.url),
        videoId: validation.videoId || "",
        isShort: validation.isShort ? "true" : "false",
      });

      router.push(`/download?${searchParams.toString()}`);
    } catch (error) {
      console.error("Download submission error:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paste from clipboard handler
  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("url", text, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      await trigger("url");
    } catch (err) {
      // Silently handle clipboard access errors
      console.warn("Clipboard access denied or failed");
    }
  };

  // Get validation icon and styling
  const getValidationStatus = () => {
    if (isValidating) {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
        borderColor: "border-blue-300",
      };
    }

    if (realTimeValidation?.isValid && !errors.url) {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        borderColor: "border-green-500",
      };
    }

    if ((realTimeValidation && !realTimeValidation.isValid) || errors.url || submitError) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        borderColor: "border-red-500",
      };
    }

    return {
      icon: null,
      borderColor: "border-border",
    };
  };

  const validationStatus = getValidationStatus();
  const hasError = errors.url || (realTimeValidation && !realTimeValidation.isValid) || submitError;
  const errorMessage = errors.url?.message || realTimeValidation?.error || submitError;

  // Button should be enabled only when URL is valid and not submitting
  const isDownloadDisabled = !realTimeValidation?.isValid || isSubmitting || !isValid || hasError;

  return (
    <div className="mx-auto mb-8 max-w-2xl">
      <Card className="bg-card border-primary border p-6 shadow-lg">
        <CardContent className="p-0">
          {/* Error message at the top of the card */}
          {hasError && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success message with video info */}
          {realTimeValidation?.isValid && !hasError && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {/* <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" /> */}
              <Film className="h-4 w-4 text-green-500" />
              <div className="flex flex-col gap-1 text-start">
                <span>Valid YouTube {realTimeValidation.isShort ? "Short" : "Video"} detected</span>
                <span className="text-xs text-green-600">
                  Video ID: {realTimeValidation.videoId}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex flex-1">
              <Input
                type="url"
                placeholder="Paste YouTube URL here (videos & shorts supported)..."
                className={`bg-input text-foreground h-12 flex-1 border-2 pr-20 text-base transition-colors ${validationStatus.borderColor}`}
                {...register("url")}
                disabled={isSubmitting}
              />

              {/* Validation status icon */}
              {validationStatus.icon && (
                <div className="absolute top-1/2 right-12 -translate-y-1/2">
                  {validationStatus.icon}
                </div>
              )}

              {/* Paste button */}
              <button
                type="button"
                onClick={handlePasteClick}
                disabled={isSubmitting}
                className="hover:bg-accent absolute top-1/2 right-2 -translate-y-1/2 rounded p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                title="Paste from clipboard"
                tabIndex={0}
              >
                <ClipboardPaste className="text-muted-foreground h-4 w-4" />
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isDownloadDisabled}
              className="bg-primary text-primary-foreground h-12 w-full border-0 px-8 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </>
              )}
            </Button>
          </form>

          <div className="mt-3 space-y-1">
            <p className="text-muted-foreground text-sm">
              Supports YouTube videos, YouTube Shorts, and all quality formats
            </p>

            {/* Show supported formats */}
            {/* <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
              <span className="bg-muted rounded px-2 py-1">youtube.com/watch</span>
              <span className="bg-muted rounded px-2 py-1">youtube.com/shorts</span>
              <span className="bg-muted rounded px-2 py-1">youtu.be</span>
              <span className="bg-muted rounded px-2 py-1">m.youtube.com</span>
            </div> */}

            {/* Show validation status */}
            {urlValue && (
              <div className="text-muted-foreground pt-1 text-xs">
                Status:{" "}
                {isValidating
                  ? "Validating..."
                  : realTimeValidation?.isValid
                    ? "✓ Ready to download"
                    : hasError
                      ? "✗ Please fix errors above"
                      : "Enter a YouTube URL"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
