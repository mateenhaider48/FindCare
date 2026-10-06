import type { CSSProperties } from "react";

// Ported from the DoctorAvatar.dc.html design component.
// Keyframes (fcBreathe, fcBlink, fcTalk, fcDot, fcTilt, fcNod, fcBob) live in app/globals.css.

export type DoctorAvatarState = "idle" | "listening" | "thinking" | "speaking";
export type DoctorAvatarHair = "short" | "bun" | "long" | "hijab";

export type DoctorAvatarProps = {
  state?: DoctorAvatarState;
  hair?: DoctorAvatarHair;
  skin?: string;
  skinShade?: string;
  hairColor?: string;
  /** Eyebrow colour when hair is "hijab" (otherwise brows use hairColor). */
  browColor?: string;
  scarf?: string;
  /** Scrubs and pen colour. */
  accent?: string;
  glasses?: boolean;
  beard?: boolean;
  /** "head" crops to head and shoulders, for small round avatars (chat headers, lists). */
  framing?: "full" | "head";
  /** Accessible label. Pass an empty string to mark the avatar as decorative. */
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const headAnimation: Record<DoctorAvatarState, string> = {
  idle: "none",
  listening: "fcNod 3.2s ease-in-out infinite",
  thinking: "fcTilt 3s ease-in-out infinite",
  speaking: "fcBob 1.6s ease-in-out infinite",
};

const blink: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
  animation: "fcBlink 5s infinite",
};

const round = { strokeLinecap: "round" } as const;

/**
 * Animated doctor illustration. Fills its container (aligned to the bottom),
 * so size it with the wrapper, e.g. `className="h-[350px] w-[320px]"`.
 */
export default function DoctorAvatar({
  state = "listening",
  hair = "bun",
  skin = "#E9B48F",
  skinShade = "#D29872",
  hairColor = "#000000",
  browColor = "#2B1D18",
  scarf = "#A9D0F5",
  accent = "#3E8EDE",
  glasses = true,
  beard = false,
  framing = "full",
  label = "Doctor",
  className,
  style,
}: DoctorAvatarProps) {
  const hijab = hair === "hijab";
  const ears = hair === "short" || hair === "bun";
  const brow = hijab ? browColor : hairColor;
  const thinking = state === "thinking";

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg
        viewBox={framing === "head" ? "50 22 140 140" : "0 0 240 262"}
        preserveAspectRatio={framing === "head" ? "xMidYMid slice" : "xMidYMax meet"}
        role={label ? "img" : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        className="fc-avatar"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
          animation: "fcBreathe 4s ease-in-out infinite",
        }}
      >
        {/* Neck and coat */}
        <rect x="104" y="124" width="32" height="44" rx="12" fill={skinShade} />
        <path
          d="M28 262 L30 212 Q32 170 84 160 L156 160 Q208 170 210 212 L212 262 Z"
          fill="#FFFFFF"
          stroke="#C9DCEF"
          strokeWidth={2}
        />
        <polygon points="98,160 142,160 120,204" fill={accent} />
        <g fill="#FFFFFF" stroke="#C9DCEF" strokeWidth={2} strokeLinejoin="round">
          <polygon points="98,160 120,204 104,250 82,166" />
          <polygon points="142,160 120,204 136,250 158,166" />
        </g>

        {/* Pocket, pen, name tag */}
        <rect x="160" y="214" width="30" height="5" rx="2.5" fill="#DCE9F6" />
        <rect x="168" y="200" width="5" height="17" rx="2.5" fill="#3E8EDE" />
        <rect
          x="56"
          y="210"
          width="32"
          height="12"
          rx="3"
          fill="#EEF5FC"
          stroke="#C9DCEF"
          strokeWidth={1.5}
        />

        {/* Stethoscope */}
        <g fill="none" stroke="#4B5D73" strokeWidth={4} {...round}>
          <path d="M100 164 Q86 206 110 222 Q120 228 130 222 Q154 206 140 164" />
          <path d="M120 226 Q118 238 124 244" />
        </g>
        <circle cx="126" cy="249" r="8" fill="#DCE9F6" stroke="#4B5D73" strokeWidth={3} />

        {hijab && <path d="M68 100 Q62 162 92 178 L148 178 Q178 162 172 100 Z" fill={scarf} />}

        {/* Head */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "50% 92%",
            animation: headAnimation[state],
          }}
        >
          {hair === "long" && (
            <path
              d="M74 96 Q72 40 120 40 Q168 40 166 96 L172 156 Q120 166 68 156 Z"
              fill={hairColor}
            />
          )}
          {hair === "bun" && <circle cx="120" cy="44" r="17" fill={hairColor} />}
          {hijab && <ellipse cx="120" cy="96" rx="57" ry="61" fill={scarf} />}
          {ears && (
            <>
              <circle cx="77" cy="100" r="9" fill={skinShade} />
              <circle cx="163" cy="100" r="9" fill={skinShade} />
            </>
          )}
          <ellipse cx="120" cy="96" rx="44" ry="48" fill={skin} />
          {beard && (
            <path
              d="M78 104 Q82 150 120 152 Q158 150 162 104 Q150 132 120 134 Q90 132 78 104 Z"
              fill={hairColor}
            />
          )}
          {ears && (
            <path
              d="M75 96 Q72 44 120 44 Q168 44 165 96 Q154 68 120 66 Q90 66 75 96 Z"
              fill={hairColor}
            />
          )}
          {hair === "long" && (
            <path
              d="M76 98 Q74 44 120 44 Q166 44 164 98 Q154 64 128 60 Q100 70 76 98 Z"
              fill={hairColor}
            />
          )}
          {hijab && (
            <path
              d="M74 94 Q76 46 120 46 Q164 46 166 94 Q150 64 120 62 Q90 64 74 94 Z"
              fill={scarf}
            />
          )}

          {/* Face */}
          <rect x="95" y="82" width="17" height="4" rx="2" fill={brow} />
          <rect x="128" y="82" width="17" height="4" rx="2" fill={brow} />
          <g transform={thinking ? "translate(3 -4)" : "translate(0 0)"}>
            <ellipse cx="104" cy="100" rx="4.5" ry="5.5" fill="#0F2540" style={blink} />
            <ellipse cx="136" cy="100" rx="4.5" ry="5.5" fill="#0F2540" style={blink} />
          </g>
          <circle cx="95" cy="116" r="7" fill="#F09A92" opacity={0.35} />
          <circle cx="145" cy="116" r="7" fill="#F09A92" opacity={0.35} />
          <path
            d="M120 104 Q116 112 121 113"
            fill="none"
            stroke={skinShade}
            strokeWidth={2.5}
            {...round}
          />

          {(state === "listening" || state === "idle") && (
            <path
              d="M110 121 Q120 129 130 121"
              fill="none"
              stroke="#0F2540"
              strokeWidth={3}
              {...round}
            />
          )}
          {state === "speaking" && (
            <ellipse
              cx="120"
              cy="124"
              rx="8"
              ry="5.5"
              fill="#7A2E35"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "fcTalk .32s ease-in-out infinite",
              }}
            />
          )}
          {thinking && (
            <path
              d="M113 124 Q120 122 128 122"
              fill="none"
              stroke="#0F2540"
              strokeWidth={3}
              {...round}
            />
          )}

          {glasses && (
            <g fill="none" stroke="#0F2540" strokeWidth={2.5}>
              <circle cx="104" cy="100" r="11" />
              <circle cx="136" cy="100" r="11" />
              <path d="M115 100 L125 100" />
            </g>
          )}
        </g>

        {/* Thought bubbles */}
        {thinking && (
          <g fill="#A9D0F5">
            <circle cx="180" cy="60" r="4" style={{ animation: "fcDot 1.2s ease-in-out infinite" }} />
            <circle
              cx="193"
              cy="45"
              r="5.5"
              style={{ animation: "fcDot 1.2s ease-in-out .2s infinite" }}
            />
            <circle
              cx="210"
              cy="28"
              r="7"
              style={{ animation: "fcDot 1.2s ease-in-out .4s infinite" }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
