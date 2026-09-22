"use client";
// MIRADOR — LadderImage: next/image with the pre-graded AVIF ladder loader
// (PRF-3). The function-valued `loader` prop cannot cross the server/client
// RSC boundary — server components (hero, story) render THROUGH this client
// wrapper instead of passing the loader down.
import Image, { type ImageProps } from "next/image";
import { miradorImageLoader } from "@/lib/image-loader";

export function LadderImage({ alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} loader={miradorImageLoader} />;
}
