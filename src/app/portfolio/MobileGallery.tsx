"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

interface Props {
  images: string[];
  title: string;
  activeImage: number;
  onSlideChange: (idx: number) => void;
}

export default function MobileGallery({ images, title, activeImage, onSlideChange }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Sync external activeImage changes → swiper (e.g. keyboard nav)
  useEffect(() => {
    const sw = swiperRef.current;
    if (sw && sw.activeIndex !== activeImage) {
      sw.slideTo(activeImage, 300);
    }
  }, [activeImage]);

  return (
    <div
      className="flex-shrink-0 w-full"
      style={{ height: "55vh", minHeight: 260 }}
    >
      <style>{`
        /* Swiper's vertical-pagination defaults (top: 50%, right) combined
           with the overrides below stretched this box over the lower half
           of the slides, swallowing swipes — pin it to the bullets only. */
        .mobile-gallery .swiper-pagination {
          position: absolute;
          top: auto !important;
          right: auto !important;
          bottom: 12px !important;
          left: 50% !important;
          width: auto !important;
          height: auto !important;
          transform: translateX(-50%) !important;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 5px;
          pointer-events: none;
        }
        .mobile-gallery .swiper-pagination-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          opacity: 1;
          transition: all 0.25s ease;
          margin: 0 !important;
          pointer-events: auto;
        }
        .mobile-gallery .swiper-pagination-bullet-active {
          width: 18px;
          border-radius: 3px;
          background: rgba(255,255,255,0.9);
        }
      `}</style>

      <Swiper
        className="mobile-gallery w-full h-full"
        modules={[Pagination]}
        direction="vertical"
        spaceBetween={6}
        touchReleaseOnEdges
        // Too many bullets would overflow the width — the counter below covers it
        pagination={images.length <= 12 ? { clickable: true } : false}
        onSwiper={(sw) => { swiperRef.current = sw; }}
        onSlideChange={(sw) => onSlideChange(sw.activeIndex)}
        initialSlide={activeImage}
        style={{ background: "#000" }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${title} ${i + 1}`}
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
