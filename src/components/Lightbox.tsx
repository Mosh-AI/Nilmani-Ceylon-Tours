"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/data/gallery";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  const image = images[currentIndex];
  const total = images.length;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          onNext();
          break;
      }
    },
    [onClose, onPrevious, onNext],
  );

  // Lock body scroll and trap focus
  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    // Focus the close button on mount
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to previously focused element
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!image) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${currentIndex + 1} of ${total}: ${image.alt}`}
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center",
        "bg-black/90 backdrop-blur-sm",
        "animate-in fade-in duration-300",
      )}
      onClick={handleOverlayClick}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-10",
          "flex h-11 w-11 items-center justify-center rounded-full",
          "bg-white/10 text-white/80 backdrop-blur-sm",
          "transition-all duration-200",
          "hover:bg-white/20 hover:text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        )}
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Previous button */}
      {total > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className={cn(
            "absolute left-4 top-1/2 z-10 -translate-y-1/2",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "bg-white/10 text-white/80 backdrop-blur-sm",
            "transition-all duration-200",
            "hover:bg-white/20 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            "max-sm:h-10 max-sm:w-10 max-sm:left-2",
          )}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 max-sm:h-5 max-sm:w-5" />
        </button>
      )}

      {/* Next button */}
      {total > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className={cn(
            "absolute right-4 top-1/2 z-10 -translate-y-1/2",
            "flex h-12 w-12 items-center justify-center rounded-full",
            "bg-white/10 text-white/80 backdrop-blur-sm",
            "transition-all duration-200",
            "hover:bg-white/20 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            "max-sm:h-10 max-sm:w-10 max-sm:right-2",
          )}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 max-sm:h-5 max-sm:w-5" />
        </button>
      )}

      {/* Image container */}
      <div
        className="flex max-h-[85vh] max-w-[90vw] flex-col items-center gap-4 md:max-w-[80vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative animate-in zoom-in-95 fade-in duration-300">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="max-h-[75vh] w-auto rounded-lg object-contain"
            sizes="(max-width: 768px) 90vw, 80vw"
            priority
          />
        </div>

        {/* Caption and counter */}
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <p className="max-w-2xl text-sm leading-relaxed text-white/70">
            {image.alt}
          </p>
          <p className="text-xs font-medium tracking-wider text-white/40">
            {currentIndex + 1} / {total}
          </p>
        </div>
      </div>
    </div>
  );
}
