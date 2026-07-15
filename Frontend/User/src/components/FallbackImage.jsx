import { useState } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";

export default function FallbackImage({ src, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc || FALLBACK}
      alt={alt || "Image"}
      className={className}
      onError={() => {
        if (imgSrc !== FALLBACK) setImgSrc(FALLBACK);
      }}
      {...props}
    />
  );
}
