"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  POSE,
  buildAvatar,
  mouthD,
  n,
  type AvatarLook,
  type AvatarModel,
  type AvatarState,
} from "./avatar/geometry";

// Avatar v2, ported from the "FindCare Doctor Avatar" design component.
// Separate male/female anatomy, six skin tones, layered hair/hijab, and a
// micro-animation layer (blinks, gaze saccades, nods, phrase-paced speech).
// Keyframes (fcBreath, fcSwayA/B/S) live in app/globals.css.

export type {
  AvatarAge,
  AvatarBeard,
  AvatarEyeColor,
  AvatarFemaleHair,
  AvatarFrameColor,
  AvatarGender,
  AvatarGlasses,
  AvatarHairColor,
  AvatarLook,
  AvatarMaleHair,
  AvatarScarf,
  AvatarScrubs,
  AvatarSkinTone,
  AvatarState,
} from "./avatar/geometry";

export type DoctorAvatarState = AvatarState;

export type DoctorAvatarProps = AvatarLook & {
  state?: AvatarState;
  /** "headshot" crops to head and shoulders, for small round avatars. */
  framing?: "portrait" | "headshot";
  /** Set false to freeze the avatar (also respects prefers-reduced-motion). */
  animated?: boolean;
  /** Accessible label. Pass an empty string to mark the avatar as decorative. */
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const ease = (x: number) => x * x * (3 - 2 * x);
const q = (v: number) => Math.round(v * 20) / 20;

type Refs = Record<string, SVGElement | null>;

/**
 * Animated doctor illustration. Fills its container (aligned to the bottom),
 * so size it with the wrapper, e.g. `className="h-[350px] w-[320px]"`.
 */
export default function DoctorAvatar({
  state = "listening",
  framing = "portrait",
  animated = true,
  label = "Doctor",
  className,
  style,
  ...look
}: DoctorAvatarProps) {
  const uid = "fca" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const lookKey = JSON.stringify(look);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const v = useMemo(() => buildAvatar(look, uid, framing), [lookKey, uid, framing]);

  const [els] = useState<Refs>(() => ({}));
  const setRef = (k: string) => (el: SVGElement | null) => {
    els[k] = el;
  };
  const live = useRef({ v, state, animated });
  const stepRef = useRef<(t: number, dt: number, still: boolean) => void>(() => {});
  const timeRef = useRef(0);
  const resetRef = useRef<(t: number) => void>(() => {});

  useLayoutEffect(() => {
    live.current = { v, state, animated };
  });

  // Animation engine (set up once; reads the latest props through `live`).
  useEffect(() => {
    const S = { ...POSE.listening, open: 0, energy: 0, flash: 0, gxC: 0, gyC: 0 };
    const A = { nextBlink: 1.2, blinkAt: -9, queued: -1, nextSacc: 0.8, gTx: 0, gTy: 0, nextNod: 2, nodAt: -9, sylEnd: 0, openT: 0, phraseEnd: 2, pauseEnd: 0 };
    const cache: Record<string, string> = {};
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const amp = reduce ? 0.3 : 1;

    const set = (ref: string, a: string, val: string) => {
      const el = els[ref];
      if (!el) return;
      const key = ref + a;
      if (cache[key] === val && (cache as Record<string, unknown>)[key + "$"] === el) return;
      cache[key] = val;
      (cache as Record<string, unknown>)[key + "$"] = el;
      el.setAttribute(a, val);
    };

    const step = (t: number, dt: number, still: boolean) => {
      const { v: M, state: stateNow } = live.current;
      const G = M.G;
      const st = POSE[stateNow] ? stateNow : "listening";
      const T = POSE[st];
      const k = still ? 1 : 1 - Math.exp(-dt / 0.55);
      (Object.keys(T) as (keyof typeof T)[]).forEach((key) => {
        S[key] += (T[key] - S[key]) * k;
      });
      let blink = 0;
      let nod = 0;
      let open = 0;
      if (!still) {
        if (t >= A.nextBlink) {
          A.blinkAt = t;
          A.queued = Math.random() < 0.18 ? t + 0.26 : -1;
          A.nextBlink = t + rnd(2.2, 6.4) * (st === "thinking" ? 1.35 : st === "speaking" ? 0.85 : 1);
        }
        if (A.queued > 0 && t >= A.queued) {
          A.blinkAt = t;
          A.queued = -1;
        }
        const bd = (t - A.blinkAt) / 0.17;
        if (bd >= 0 && bd < 1) blink = bd < 0.38 ? ease(bd / 0.38) : 1 - ease((bd - 0.38) / 0.62);
        if (t >= A.nextSacc) {
          const glance = st === "speaking" && Math.random() < 0.18;
          A.gTx = glance ? (Math.random() < 0.5 ? -1.3 : 1.3) : rnd(-0.55, 0.55) * (st === "listening" ? 0.5 : 1);
          A.gTy = glance ? 0.35 : rnd(-0.35, 0.3) * (st === "listening" ? 0.5 : 1);
          A.nextSacc = t + (glance ? rnd(0.5, 0.8) : rnd(1.1, st === "thinking" ? 2.6 : 3.8));
        }
        const gk = 1 - Math.exp(-dt / 0.045);
        S.gxC += (S.gx + A.gTx - S.gxC) * gk;
        S.gyC += (S.gy + A.gTy - S.gyC) * gk;
        if (st === "listening" && t >= A.nextNod) {
          A.nodAt = t;
          A.nextNod = t + rnd(3.4, 6.8);
        }
        const nd = (t - A.nodAt) / 1.1;
        if (nd >= 0 && nd < 1) nod = Math.sin(Math.PI * nd) * (st === "listening" ? 1 : 0);
        if (S.talk > 0.02) {
          if (t >= A.phraseEnd && A.pauseEnd < A.phraseEnd) A.pauseEnd = t + rnd(0.28, 0.7);
          const pausing = t < A.pauseEnd;
          if (!pausing && t >= A.phraseEnd) {
            A.phraseEnd = t + rnd(1.3, 3.4);
            S.flash = 1;
          }
          if (t >= A.sylEnd) {
            A.sylEnd = t + rnd(0.11, 0.21);
            A.openT = pausing ? 0 : Math.random() < 0.2 ? rnd(0, 0.1) : rnd(0.28, 0.95);
          }
        } else A.openT = 0;
        S.open += (A.openT - S.open) * (1 - Math.exp(-dt / 0.055));
        S.energy += (S.open - S.energy) * (1 - Math.exp(-dt / 0.4));
        S.flash *= Math.exp(-dt / 0.4);
        open = S.open * S.talk;
      } else {
        S.gxC = S.gx;
        S.gyC = S.gy;
      }

      const sp = S.energy * Math.sin(t * 1.7);
      const r = q(S.tilt + sp * 0.45 * amp);
      const tx = q(S.yaw * 0.4);
      const ty = q(nod * 0.9 * amp - S.energy * 0.3 * amp);
      const fx = q(S.yaw);
      const fy = q(nod * 0.4 * amp);
      set("head", "transform", `translate(${tx} ${ty + 13}) rotate(${r} 120 150)`);
      const follow = `translate(${q(tx * 0.4)} ${q(ty * 0.4)}) rotate(${q(r * 0.3)} 120 150)`;
      set("back", "transform", "translate(0 13) " + follow);
      set("drape", "transform", "translate(0 10) " + follow);
      set("feat", "transform", `translate(${fx} ${fy})`);
      set("glasses", "transform", `translate(${q(fx * 1.1)} ${fy})`);
      set("nose", "transform", `translate(${q(fx * 0.4)} 0)`);
      set("ears", "transform", `translate(${q(-fx * 0.5)} 0)`);
      const s = 1 - 0.93 * blink;
      set("eyeL", "transform", `translate(0 ${n(G.eyeL.pivot * (1 - s))}) scale(1 ${n(s)})`);
      set("eyeR", "transform", `translate(0 ${n(G.eyeR.pivot * (1 - s))}) scale(1 ${n(s)})`);
      const gz = `translate(${q(S.gxC)} ${q(S.gyC)})`;
      set("irisL", "transform", gz);
      set("irisR", "transform", gz);
      const fl = -(S.flash * 0.6 + nod * 0.35) * amp;
      set("browL", "transform", `translate(0 ${q(S.bl + fl + blink * 0.25)})`);
      set("browR", "transform", `translate(0 ${q(S.br + fl + blink * 0.25)})`);
      const md = mouthD(G.mouth, q(S.smile), Math.round(open * 25) / 25, q(S.asym));
      set("mUpper", "d", md.upper);
      set("mLower", "d", md.lower);
      set("mCav", "d", md.cav);
      set("cavClip", "d", md.cav);
      set("mTeeth", "d", md.teeth);
      set("mSeam", "d", md.seam);
      set("mShadow", "d", md.shadow);
      set("mHi", "d", md.hi);
      set("mCorners", "d", md.corners);
      set("mSeam", "opacity", String(n(md.seamOp)));
    };
    stepRef.current = step;
    resetRef.current = (t: number) => {
      A.nextBlink = t + 0.12;
      A.nextNod = t + 1.2;
      A.nextSacc = t + 0.05;
    };

    const t0 = performance.now();
    let last = t0;
    let visible = true;
    let raf = 0;
    step(0, 0, true);

    const root = els.fig?.ownerSVGElement;
    let io: IntersectionObserver | undefined;
    if (root && "IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
      });
      io.observe(root);
    }
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 40) return;
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      if (!visible || live.current.animated === false || document.hidden) return;
      timeRef.current = (now - t0) / 1000;
      step(timeRef.current, dt, false);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [els]);

  // React to prop changes: re-seed timers on state change, repaint when frozen.
  useEffect(() => {
    resetRef.current(timeRef.current);
    if (!animated) stepRef.current(timeRef.current, 1, true);
  }, [state, animated, v]);

  const { G, ids, u, c, h, s, gl, hair, hj, scrub, eye, beard, look: lk } = v as AvatarModel;
  const play = animated ? "running" : "paused";
  // Longhand animation properties only: mixing the `animation` shorthand with
  // animationPlayState makes React warn when pausing re-renders the style.
  const motion = (name: string, duration: string, extra: CSSProperties = {}, delay = "0s"): CSSProperties => ({
    animationName: name,
    animationDuration: duration,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationDelay: delay,
    animationPlayState: play,
    ...extra,
  });
  const sway: CSSProperties = { transformBox: "view-box", transformOrigin: "120px 152px" };
  const stopC = (offset: number | string, color: string, opacity?: number) => (
    <stop offset={offset} stopColor={color} stopOpacity={opacity} />
  );
  const thin = (x: number) => ({ strokeWidth: x, strokeLinecap: "round" as const });

  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", ...style }}
    >
      <svg
        viewBox={v.viewBox}
        preserveAspectRatio={v.par}
        role={label ? "img" : "presentation"}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        style={{ width: "100%", height: "100%", maxHeight: "100vh", display: "block" }}
      >
        <defs>
          <clipPath id={ids.face}><path d={G.face} /></clipPath>
          <clipPath id={ids.eyeL}><path d={G.eyeL.sclera} /></clipPath>
          <clipPath id={ids.eyeR}><path d={G.eyeR.sclera} /></clipPath>
          <clipPath id={ids.cav}><path ref={setRef("cavClip")} /></clipPath>
          <clipPath id={ids.neckC}><path d={G.body.neck} /></clipPath>
          <linearGradient id={ids.top} x1="0" y1="0" x2="0" y2="1">{stopC(0, c.deep, 0.42)}{stopC(1, c.deep, 0)}</linearGradient>
          <linearGradient id={ids.sideR} x1="0" y1="0" x2="1" y2="0">{stopC(0, c.shade, 0)}{stopC(0.55, c.shade, 0.55)}{stopC(1, c.deep, 0.7)}</linearGradient>
          <linearGradient id={ids.sideL} x1="0" y1="0" x2="1" y2="0">{stopC(0, c.shade, 0.5)}{stopC(1, c.shade, 0)}</linearGradient>
          <linearGradient id={ids.jaw} x1="0" y1="0" x2="0" y2="1">{stopC(0, c.deep, 0)}{stopC(1, c.deep, 0.5)}</linearGradient>
          <linearGradient id={ids.neck} gradientUnits="userSpaceOnUse" x1="0" y1="146" x2="0" y2="194">{stopC(0, c.shade)}{stopC(0.5, c.ear)}{stopC(1, c.vskin)}</linearGradient>
          <linearGradient id={ids.neckSide} gradientUnits="userSpaceOnUse" x1="98" y1="0" x2="142" y2="0">
            {stopC(0, c.deep, 0.06)}{stopC(0.19, c.deep, 0.32)}{stopC(0.33, c.deep, 0)}{stopC(0.67, c.deep, 0)}{stopC(0.81, c.deep, 0.4)}{stopC(1, c.deep, 0.08)}
          </linearGradient>
          <linearGradient id={ids.jawSh} x1="0" y1="0" x2="0" y2="1">{stopC(0, c.deep, 0.5)}{stopC(0.7, c.deep, 0.36)}{stopC(1, c.deep, 0)}</linearGradient>
          <linearGradient id={ids.coatL} x1="0" y1="0" x2="1" y2="0">{stopC(0, "#DCE4EE")}{stopC(0.55, "#F7F9FC")}{stopC(1, "#FFFFFF")}</linearGradient>
          <linearGradient id={ids.coatR} x1="0" y1="0" x2="1" y2="0">{stopC(0, "#FCFDFE")}{stopC(0.5, "#F3F6FA")}{stopC(1, "#D6DFEA")}</linearGradient>
          <linearGradient id={ids.metal} x1="0" y1="0" x2="1" y2="1">{stopC(0, "#EEF2F6")}{stopC(1, "#93A0AE")}</linearGradient>
          <linearGradient id={ids.scarf} x1="0" y1="0" x2="1" y2="0">{stopC(0, s.hi)}{stopC(0.45, s.base)}{stopC(1, s.sh)}</linearGradient>
          <linearGradient id={ids.drape} x1="0" y1="0" x2="0" y2="1">{stopC(0, s.sh)}{stopC(0.5, s.base)}{stopC(1, s.base)}</linearGradient>
          <linearGradient id={ids.beard} x1="0" y1="0" x2="0" y2="1">{stopC(0, beard.fill, 0.35)}{stopC(0.32, beard.fill, 0.9)}{stopC(1, beard.deep, 1)}</linearGradient>
          <radialGradient id={ids.blush}>{stopC(0, c.blush, 0.55)}{stopC(1, c.blush, 0)}</radialGradient>
          <radialGradient id={ids.socket}>{stopC(0, c.deep, 0.5)}{stopC(1, c.deep, 0)}</radialGradient>
          <radialGradient id={ids.hi}>{stopC(0, c.hi, 0.75)}{stopC(1, c.hi, 0)}</radialGradient>
        </defs>

        <g ref={setRef("fig")} data-fcmotion="1" style={motion("fcBreath", "4.8s")}>
          {/* body / coat back */}
          <path d={G.body.back} fill="#F4F7FB" stroke="#CBD6E2" strokeWidth={0.9} />
          <path d={G.body.collar} fill="#E3EAF2" />

          {/* back hair */}
          <g ref={setRef("back")}>
            <g data-fcmotion="1" style={motion("fcSwayS", "11.3s", sway)}>
              <path d={hair.backBody} fill={h.sh} />
            </g>
          </g>

          {/* neck */}
          <path d={G.body.neck} fill={u.neck} />
          <g clipPath={u.neckC}>
            <path d={G.body.neck} fill={u.neckSide} />
            <ellipse cx={119.4} cy={G.neckHiY} rx={4.6} ry={5.2} fill={u.hi} opacity={0.22} />
            <path d={G.neckShadow} fill={u.jawSh} />
          </g>

          {/* coat */}
          <path d={G.body.scrub} fill={scrub.base} />
          <path d={G.body.notch} fill="none" stroke={c.deep} strokeWidth={0.9} strokeLinecap="round" opacity={0.35} />
          <path d={G.body.piping} fill="none" stroke={c.deep} strokeWidth={3.6} strokeLinejoin="round" opacity={0.2} />
          <path d={G.body.piping} fill="none" stroke={scrub.dark} strokeWidth={2.2} strokeLinejoin="round" />
          <path d={G.body.coatL} fill={u.coatL} />
          <path d={G.body.coatR} fill={u.coatR} />
          <path d={G.body.arms} fill="none" stroke="#D3DCE7" strokeWidth={1.1} strokeLinecap="round" />
          <path d={G.body.folds} fill="none" stroke="#E0E7EF" strokeWidth={1.3} strokeLinecap="round" />
          <path d={G.body.lapels} fill="#1E3550" transform="translate(1.1 1.6)" opacity={0.06} />
          <path d={G.body.lapels} fill="#F0F4F8" stroke="#D2DCE7" strokeWidth={0.8} strokeLinejoin="round" />
          <path d={G.body.pen} fill={scrub.accent} />
          <path d={G.body.penClip} fill="none" stroke="#A2AEBB" strokeWidth={0.8} strokeLinecap="round" />
          <path d={G.body.pocket} fill="#F7F9FC" stroke="#D0DAE5" strokeWidth={0.85} strokeLinejoin="round" />
          <path d={G.body.pocketSeam} fill="none" stroke="#DFE6EE" strokeWidth={0.8} />
          <rect x={G.badge.x} y={G.badge.y} width={21} height={13.5} rx={1.6} fill="#FFFFFF" stroke="#CFD9E4" strokeWidth={0.8} />
          <path d={`M${G.badge.x} ${G.badge.y + 1.6}Q${G.badge.x} ${G.badge.y} ${G.badge.x + 1.6} ${G.badge.y}L${G.badge.x + 19.4} ${G.badge.y}Q${G.badge.x + 21} ${G.badge.y} ${G.badge.x + 21} ${G.badge.y + 1.6}L${G.badge.x + 21} ${G.badge.y + 3.4}L${G.badge.x} ${G.badge.y + 3.4}Z`} fill={scrub.accent} />
          <path d={`M${G.badge.x + 3} ${G.badge.y + 7}L${G.badge.x + 14} ${G.badge.y + 7}M${G.badge.x + 3} ${G.badge.y + 10.2}L${G.badge.x + 10} ${G.badge.y + 10.2}`} fill="none" stroke="#A9B7C6" strokeWidth={1.2} strokeLinecap="round" />

          {/* stethoscope */}
          <g fill="none" strokeLinecap="round">
            <path d={G.st.tubes} stroke="#14202E" transform="translate(.9 1.7)" strokeWidth={3.6} opacity={0.13} />
            <path d={G.st.bin} stroke="#8592A1" strokeWidth={1.7} />
            <path d={G.st.tubes} stroke="#2F3B4A" strokeWidth={3.1} />
            <path d={G.st.tubes} stroke="#71839A" transform="translate(-.7 -.5)" strokeWidth={0.8} opacity={0.75} />
          </g>
          <path d={G.st.yoke} fill="#8F9CAA" />
          <path d={G.st.tips} fill="#26303B" />
          <path d={G.st.pieceShadow} fill="#14202E" opacity={0.12} />
          <path d={G.st.piece} fill={u.metal} stroke="#7D8A98" strokeWidth={0.7} />
          <path d={G.st.diaphragm} fill="#DCE2E8" stroke="#B0BAC5" strokeWidth={0.5} />
          <path d={G.st.pieceHi} fill="none" stroke="#FFFFFF" strokeWidth={0.8} strokeLinecap="round" opacity={0.8} />

          {/* hijab drape + tied ponytail */}
          <g ref={setRef("drape")}>
            <g data-fcmotion="1" style={motion("fcSwayS", "11.3s", sway)}>
              <path d={hj.drape} fill={u.drape} />
              <path d={hj.wrap} fill={s.wrap} />
              <path d={hj.drapeFolds} fill="none" stroke={s.fold} strokeWidth={1.1} strokeLinecap="round" opacity={0.55} />
              <path d={hair.pony} fill={h.base} />
              <path d={hair.ponyStrands} fill="none" stroke={h.sh} strokeWidth={0.8} strokeLinecap="round" opacity={0.7} />
              <path d={hair.tie} fill={h.sh} />
            </g>
          </g>

          {/* head */}
          <g ref={setRef("head")}>
            <g data-fcmotion="1" style={motion("fcSwayA", "11.3s", sway)}>
              <g data-fcmotion="1" style={motion("fcSwayB", "7.1s", sway, "-2.4s")}>
                <path d={hair.bun} fill={h.base} />
                <path d={hair.bunShade} fill={h.sh} opacity={0.4} />
                <path d={hair.bunHi} fill={h.hi} opacity={0.28} />
                <path d={hair.bunStrands} fill="none" stroke={h.sh} strokeWidth={0.7} strokeLinecap="round" opacity={0.3} />
                <path d={hair.backHead} fill={h.sh} />

                {/* ears */}
                <g ref={setRef("ears")}>
                  <path d={G.ears} fill={c.ear} />
                  <path d={G.earInner} fill="none" stroke={c.deep} strokeWidth={0.9} strokeLinecap="round" opacity={0.45} />
                </g>

                {/* face */}
                <path d={G.face} fill={c.base} />

                {/* facial shading */}
                <g clipPath={u.face}>
                  <rect x={84} y={52} width={72} height={30} fill={u.top} />
                  <rect x={128} y={52} width={30} height={108} fill={u.sideR} />
                  <rect x={84} y={52} width={13} height={108} fill={u.sideL} />
                  <rect x={84} y={126} width={72} height={32} fill={u.jaw} opacity={lk.jaw} />
                  <ellipse cx={105.5} cy={101.5} rx={10} ry={6} fill={u.socket} opacity={lk.socket} />
                  <ellipse cx={134.8} cy={101} rx={10} ry={6} fill={u.socket} opacity={lk.socket} />
                  <ellipse cx={101} cy={118} rx={11} ry={7} fill={u.blush} opacity={lk.blush} />
                  <ellipse cx={140} cy={117.5} rx={10} ry={7} fill={u.blush} opacity={lk.blush} />
                  <ellipse cx={113} cy={80} rx={15} ry={8} fill={u.hi} opacity={0.55} />
                  <ellipse cx={101} cy={111.5} rx={6.5} ry={3.5} fill={u.hi} opacity={0.5} />
                  <ellipse cx={120} cy={G.chinHiY} rx={6} ry={2.8} fill={u.hi} opacity={0.45} />
                  <path d={G.contours} fill="none" stroke={c.shade} strokeWidth={2.2} strokeLinecap="round" opacity={lk.contour} />
                  <path d={G.lines} fill="none" stroke={c.deep} strokeWidth={0.8} strokeLinecap="round" opacity={lk.lines} />
                  <path d={G.nasolabial} fill="none" stroke={c.deep} strokeWidth={0.9} strokeLinecap="round" opacity={lk.naso} />
                </g>

                {/* beard */}
                <path d={G.beard} fill={u.beard} opacity={beard.op} />

                <g ref={setRef("feat")}>
                  {/* eyes */}
                  <path d={G.creases} fill="none" stroke={c.deep} strokeWidth={0.8} strokeLinecap="round" opacity={0.3} />
                  <path d={G.lowLids} fill="none" stroke={c.deep} strokeWidth={0.7} strokeLinecap="round" opacity={0.32} />
                  {([["L", G.eyeL, "eyeL", "irisL"], ["R", G.eyeR, "eyeR", "irisR"]] as const).map(([k, E, eref, iref]) => (
                    <g key={k} ref={setRef(eref)}>
                      <path d={E.sclera} fill="#F2EDE8" />
                      <g clipPath={u[eref]}>
                        <g ref={setRef(iref)}>
                          <circle cx={E.cx} cy={E.cy} r={G.ir} fill={eye.iris} stroke={eye.rim} strokeWidth={0.5} />
                          <circle cx={E.cx} cy={E.cy} r={G.pr} fill="#120D0B" />
                          <circle cx={E.hx} cy={E.hy} r={0.62} fill="#FFFFFF" opacity={0.92} />
                        </g>
                        <path d={E.up} fill="none" stroke="#2A1B15" strokeWidth={2.6} opacity={0.22} />
                      </g>
                      <path d={E.up} fill="none" stroke={c.lid} strokeWidth={G.lidW} strokeLinecap="round" />
                      <path d={E.lash} fill="none" stroke={c.lid} strokeWidth={0.9} strokeLinecap="round" />
                    </g>
                  ))}

                  {/* eyebrows */}
                  <g ref={setRef("browL")}><path d={G.browL} fill={h.brow} stroke={h.brow} strokeWidth={0.35} strokeLinejoin="round" opacity={0.94} /></g>
                  <g ref={setRef("browR")}><path d={G.browR} fill={h.brow} stroke={h.brow} strokeWidth={0.35} strokeLinejoin="round" opacity={0.94} /></g>

                  {/* nose */}
                  <g ref={setRef("nose")}>
                    <g transform={G.noseT}>
                      <path d="M121.8 104C122.6 108.4 123.2 112.6 123.4 116.4" fill="none" stroke={c.shade} {...thin(1.3)} opacity={0.4} />
                      <path d="M122.6 106C123.8 111 125.2 115.4 126.4 119C126 120.6 124.8 121.1 123.8 120.5C123.6 115.2 123.1 110.2 122.6 106Z" fill={c.shade} opacity={0.5} />
                      <ellipse cx={119.4} cy={119.8} rx={2} ry={1.4} fill={c.hi} opacity={0.55} />
                      <path d="M116.6 117.6C114.7 118.7 114.2 121.4 115.9 122.6C116.7 123.2 117.7 123.2 118.5 122.8" fill="none" stroke={c.deep} {...thin(0.95)} opacity={0.5} />
                      <path d="M123.6 117.4C125.7 118.5 126.4 121.2 124.8 122.5C124 123.1 123 123.2 122.2 122.8" fill="none" stroke={c.deep} {...thin(1)} opacity={0.65} />
                      <path d="M117.8 123.1C119 123.9 121.2 123.9 122.6 123.1" fill="none" stroke={c.deep} {...thin(1.1)} opacity={0.55} />
                    </g>
                  </g>

                  {/* mouth */}
                  <path d="M119.3 125.6L119.6 130.4M121.5 125.6L121.3 130.4" fill="none" stroke={c.shade} {...thin(0.8)} opacity={0.35} />
                  <path ref={setRef("mShadow")} fill="none" stroke={c.shade} {...thin(1.3)} opacity={0.5} />
                  <path ref={setRef("mCav")} fill="#4A2527" />
                  <g clipPath={u.cav}><path ref={setRef("mTeeth")} fill="#EDE5DE" /></g>
                  <path ref={setRef("mLower")} fill={c.lipLow} />
                  <path ref={setRef("mUpper")} fill={c.lipUp} />
                  <path ref={setRef("mSeam")} fill="none" stroke={c.seam} {...thin(0.85)} />
                  <path ref={setRef("mHi")} fill="none" stroke={c.hi} {...thin(0.8)} opacity={0.35} />
                  <path ref={setRef("mCorners")} fill="none" stroke={c.deep} {...thin(0.7)} opacity={0.45} />
                </g>

                {/* front hair */}
                <path d={hair.front} fill={h.base} />
                <path d={hair.sheen} fill={h.hi} opacity={0.3} />
                <path d={hair.strands} fill="none" stroke={h.sh} strokeWidth={0.7} strokeLinecap="round" opacity={0.45} />
                <path d={hair.part} fill="none" stroke={h.sh} strokeWidth={1} strokeLinecap="round" opacity={0.7} />
                <path d={hair.wisp} fill="none" stroke={h.base} strokeWidth={0.7} strokeLinecap="round" opacity={0.85} />

                {/* glasses */}
                <g ref={setRef("glasses")}>
                  <path d={gl.lenses} fill="none" stroke={c.deep} transform="translate(.6 1.8)" strokeWidth={1.4} opacity={0.14} />
                  <path d={gl.lenses} fill="#FFFFFF" opacity={0.07} />
                  <path d={gl.glare} fill="none" stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" opacity={0.38} />
                  <path d={gl.arms} fill="none" stroke={gl.color} strokeWidth={gl.w} strokeLinecap="round" />
                  <path d={gl.lenses} fill="none" stroke={gl.color} strokeWidth={gl.w} strokeLinejoin="round" />
                  <path d={gl.bridge} fill="none" stroke={gl.color} strokeWidth={gl.w} strokeLinecap="round" />
                  <path d={gl.top} fill="none" stroke={gl.hi} strokeWidth={0.5} strokeLinecap="round" opacity={0.6} />
                </g>

                {/* hijab head */}
                <path d={hj.opening} fill="none" stroke={c.deep} strokeWidth={3.4} opacity={0.3} />
                <path d={hj.rim} fill={u.scarf} fillRule="evenodd" />
                <path d={hj.band} fill={s.band} />
                <path d={hj.folds} fill="none" stroke={s.fold} strokeWidth={1.1} strokeLinecap="round" opacity={0.55} />
                <path d={hj.crown} fill="none" stroke={s.hi} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
