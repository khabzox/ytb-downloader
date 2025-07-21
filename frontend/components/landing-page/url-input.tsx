"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardPaste } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import Link from "next/link";

import { useForm, SubmitHandler } from "react-hook-form";
interface FormValues {
  url: string;
}

export default function UrlInput() {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

  // Paste from clipboard handler
  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("url", text, { shouldValidate: true });
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <div className="mx-auto mb-8 max-w-2xl">
      <Card className="bg-card border-primary border p-6 shadow-lg">
        <CardContent className="p-0">
          {/* Error message at the top of the card */}
          {errors.url && (
            <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <svg
                className="text-primary h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.995-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.995L19 4H5c-1.054 0-1.918.816-1.995 1.85L3 6v12c0 1.054.816 1.918 1.85 1.995L5 20zm7-8v2m0 4h.01"
                />
              </svg>
              <span>Please enter a valid YouTube URL. This field is required.</span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex flex-1">
              <Input
                type="url"
                placeholder="Paste YouTube URL here..."
                className="bg-input border-border text-foreground h-12 flex-1 border-2 text-base pr-12"
                {...register("url", { required: true })}
              />
              <button
                type="button"
                onClick={handlePasteClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-accent transition-colors"
                title="Paste from clipboard"
                tabIndex={0}
              >
                <ClipboardPaste className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <Link href="/download" type="submit">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground h-12 w-full border-0 px-8 font-semibold sm:w-auto"
              >
                <Download className="mr-2 h-5 w-5" />
                Download
              </Button>
            </Link>
          </form>
          <p className="text-muted-foreground mt-3 text-sm">
            Supports all YouTube video formats and qualities
          </p>
        </CardContent>
      </Card>
    </div>
  );
}