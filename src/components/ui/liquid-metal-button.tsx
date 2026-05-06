"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  active?: boolean;
}

const W      = 200;
const H      = 54;
const RADIUS = 12;

export function LiquidMetalButton({
  label  = "Button",
  onClick,
  active = true,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples]     = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef  = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shaderMount = useRef<any>(null);
  const buttonRef  = useRef<HTMLButtonElement>(null);
  const rippleId   = useRef(0);

  /* ── Shader init ── */
  useEffect(() => {
    const styleId = "lmb-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id    = styleId;
      style.textContent = `
        .lmb-shader canvas {
          width: 100% !important; height: 100% !important;
          display: block !important; position: absolute !important;
          top: 0 !important; left: 0 !important;
          border-radius: ${RADIUS}px !important;
        }
        @keyframes lmb-ripple {
          0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.5; }
          100% { transform: translate(-50%,-50%) scale(5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    if (shaderRef.current) {
      shaderMount.current?.destroy?.();
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness:   0.5,
          u_shiftRed:   0.3,
          u_shiftBlue:  0.3,
          u_distortion: 0,
          u_contour:    0,
          u_angle:      45,
          u_scale:      8,
          u_shape:      1,
          u_offsetX:    0.1,
          u_offsetY:    -0.1,
        },
        undefined,
        active ? 0.5 : 0.25,
      );
    }

    return () => {
      shaderMount.current?.destroy?.();
      shaderMount.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Speed sync with active / hover ── */
  useEffect(() => {
    if (!shaderMount.current) return;
    if (!active && !isHovered) shaderMount.current.setSpeed?.(0.25);
    else if (!active && isHovered) shaderMount.current.setSpeed?.(0.6);
    else shaderMount.current.setSpeed?.(isHovered ? 1.2 : 0.5);
  }, [active, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(active ? 1.2 : 0.6);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(active ? 0.5 : 0.25);
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    shaderMount.current?.setSpeed?.(2.8);
    setTimeout(() => shaderMount.current?.setSpeed?.(active ? (isHovered ? 1.2 : 0.5) : 0.25), 300);
    if (buttonRef.current) {
      const rect   = buttonRef.current.getBoundingClientRect();
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 700);
    }
    onClick?.();
  };

  return (
    <div style={{ position: "relative", display: "inline-block", perspective: "1000px" }}>
      <div
        style={{
          position:       "relative",
          width:          W,
          height:         H,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Thick glass frost — blurs page behind, gives glass body */}
        <div
          style={{
            position:       "absolute",
            inset:          0,
            borderRadius:   RADIUS,
            backdropFilter: "blur(22px) saturate(1.6)",
            WebkitBackdropFilter: "blur(22px) saturate(1.6)",
            background:     isHovered
              ? "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.10) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.07) 100%)",
            boxShadow:      isHovered
              ? "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.20), inset 1px 0 0 rgba(255,255,255,0.18), inset -1px 0 0 rgba(0,0,0,0.10), 0 12px 36px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.25)"
              : "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.18), inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(0,0,0,0.08), 0 8px 28px rgba(0,0,0,0.32), 0 2px 6px rgba(0,0,0,0.20)",
            transform:      `translateZ(0px) ${isPressed ? "scale(0.97)" : "scale(1)"}`,
            transition:     "transform 0.15s ease, background 0.3s ease, box-shadow 0.3s ease",
            zIndex:         5,
          }}
        />

        {/* Shader rim — liquid metal shimmer on top of glass */}
        <div
          style={{
            position:   "absolute",
            inset:      0,
            opacity:    isHovered ? 0.32 : 0.20,
            mixBlendMode: "screen",
            transform:  `translateZ(6px) ${isPressed ? "scale(0.97)" : "scale(1)"}`,
            transition: "transform 0.15s ease, opacity 0.3s ease",
            zIndex:     10,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width:      W,
              height:     H,
              borderRadius: RADIUS,
              boxShadow:  isHovered
                ? "0 0 0 1px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.25)"
                : "0 0 0 1px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)",
              transition: "box-shadow 0.3s ease",
            }}
          >
            <div
              ref={shaderRef}
              className="lmb-shader"
              style={{
                borderRadius: RADIUS,
                overflow:     "hidden",
                position:     "relative",
                width:        W,
                height:       H,
              }}
            />
          </div>
        </div>

        {/* Glass inner fill */}
        <div
          style={{
            position:       "absolute",
            top:            2,
            left:           2,
            width:          W - 4,
            height:         H - 4,
            borderRadius:   RADIUS,
            background:     "transparent",
            transform:      `translateZ(12px) ${isPressed ? "scale(0.97)" : "scale(1)"}`,
            transition:     "transform 0.15s ease, background 0.3s ease",
            zIndex:         20,
          }}
        />

        {/* Text */}
        <div
          style={{
            position:      "absolute",
            inset:         0,
            display:       "flex",
            alignItems:    "center",
            justifyContent:"center",
            transform:     "translateZ(22px)",
            zIndex:        30,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize:      13,
              fontWeight:    700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color:         "rgba(255, 255, 255, 0.92)",
              textShadow:    "0 1px 4px rgba(0,0,0,0.6)",
              whiteSpace:    "nowrap",
            }}
          >
            {label}
          </span>
        </div>

        {/* Click target */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          style={{
            position:     "absolute",
            inset:        0,
            background:   "transparent",
            border:       "none",
            cursor:       "pointer",
            outline:      "none",
            zIndex:       40,
            transform:    "translateZ(28px)",
            overflow:     "hidden",
            borderRadius: RADIUS,
          }}
          aria-label={label}
        >
          {ripples.map((r) => (
            <span
              key={r.id}
              style={{
                position:     "absolute",
                left:         r.x,
                top:          r.y,
                width:        16,
                height:       16,
                borderRadius: "50%",
                background:   "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)",
                pointerEvents:"none",
                animation:    "lmb-ripple 0.7s ease-out",
              }}
            />
          ))}
        </button>
      </div>
    </div>
  );
}
