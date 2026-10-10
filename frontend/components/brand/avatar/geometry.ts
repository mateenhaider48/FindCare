// Geometry, palettes and pose data for the FindCare doctor avatar (v2).
// Ported from the "FindCare Doctor Avatar" design component. No React in here.

export type AvatarGender = "female" | "male";
export type AvatarState = "idle" | "listening" | "thinking" | "speaking";
export type AvatarAge = "young" | "adult" | "mature";
export type AvatarFaceShape = "balanced" | "structured";
export type AvatarSkinTone = "porcelain" | "light" | "medium" | "olive" | "brown" | "deep";
export type AvatarEyeColor = "brown" | "dark" | "hazel" | "blueGrey" | "green";
export type AvatarFemaleHair = "short" | "long" | "bun" | "tied" | "hijab";
export type AvatarMaleHair = "short" | "sidePart" | "textured" | "mature";
export type AvatarHairColor = "black" | "darkBrown" | "brown" | "auburn" | "blonde" | "grey" | "salt";
export type AvatarBeard = "none" | "stubble" | "short";
export type AvatarScarf = "navy" | "blue" | "mist" | "slate" | "sand";
export type AvatarGlasses = "none" | "rectangular" | "rounded" | "oval";
export type AvatarFrameColor = "charcoal" | "tortoise" | "gold";
export type AvatarScrubs = "blue" | "teal" | "navy";

export type AvatarLook = {
  gender?: AvatarGender;
  age?: AvatarAge;
  faceShape?: AvatarFaceShape;
  skinTone?: AvatarSkinTone;
  eyeColor?: AvatarEyeColor;
  femaleHair?: AvatarFemaleHair;
  maleHair?: AvatarMaleHair;
  hairColor?: AvatarHairColor;
  beard?: AvatarBeard;
  scarf?: AvatarScarf;
  glasses?: AvatarGlasses;
  frameColor?: AvatarFrameColor;
  scrubs?: AvatarScrubs;
};

const TONES = {
  porcelain: { base: "#F1D5C2", shade: "#E0B59C", deep: "#C38C74", lip: "#C9877D", hi: "#FBEADF", blush: "#E59A8B" },
  light: { base: "#EAC2A3", shade: "#D6A281", deep: "#B67F61", lip: "#BD7A6C", hi: "#F6DCC7", blush: "#DF8E78" },
  medium: { base: "#D6A37E", shade: "#BF865F", deep: "#9D6948", lip: "#A6665A", hi: "#E8C1A2", blush: "#D27E66" },
  olive: { base: "#C5946A", shade: "#AC7B54", deep: "#8A5E3F", lip: "#9A5D4F", hi: "#DAB28D", blush: "#C27459" },
  brown: { base: "#A46F4C", shade: "#8C593A", deep: "#6C422A", lip: "#80483C", hi: "#BF8E6B", blush: "#A85A45" },
  deep: { base: "#7A4C34", shade: "#653C28", deep: "#4B2B1C", lip: "#5C3328", hi: "#97684C", blush: "#8A4634" },
};
const HAIRC: Record<string, string> = { black: "#1E1A19", darkBrown: "#36261F", brown: "#573C2D", auburn: "#6C3A25", blonde: "#A8875F", grey: "#8E8A86", salt: "#5F5B58" };
const EYEC: Record<string, string> = { brown: "#4A2F21", dark: "#2C1E17", hazel: "#6A5030", blueGrey: "#4E6576", green: "#51603F" };
const SCARF: Record<string, string> = { navy: "#34557A", blue: "#4F86C0", mist: "#A9C2DC", slate: "#4C5765", sand: "#C4AC8D" };
const FRAME: Record<string, string> = { charcoal: "#25292F", tortoise: "#5A3924", gold: "#A8864F" };
const SCRUB: Record<string, string> = { blue: "#2E5B88", teal: "#2C6870", navy: "#27384F" };

const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
export const mix = (a: string, b: string, t: number) => {
  const A = hx(a);
  const B = hx(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
};
export const n = (v: number | string) => +(+v).toFixed(2);
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${n(cx - rx)} ${n(cy)}A${rx} ${ry} 0 1 0 ${n(cx + rx)} ${n(cy)}A${rx} ${ry} 0 1 0 ${n(cx - rx)} ${n(cy)}Z`;

type FaceP = { top: number; tw: number; cw: number; cy: number; jw: number; jy: number; chy: number; chw: number; a: number };
const FACES: Record<AvatarGender, Record<AvatarFaceShape, FaceP>> = {
  male: {
    balanced: { top: 56, tw: 29.5, cw: 30, cy: 112, jw: 23, jy: 139, chy: 154, chw: 7, a: 0.5 },
    structured: { top: 56, tw: 30, cw: 30.5, cy: 113, jw: 25.5, jy: 141, chy: 154.5, chw: 9.5, a: 0.5 },
  },
  female: {
    balanced: { top: 58, tw: 28.5, cw: 28.6, cy: 111, jw: 19.5, jy: 139, chy: 151.5, chw: 5, a: 0.4 },
    structured: { top: 58, tw: 29, cw: 29.6, cy: 110, jw: 18.5, jy: 138, chy: 151, chw: 4, a: 0.4 },
  },
};

function faceD(P: FaceP) {
  const c = 120;
  const { top, tw, cw, cy, jw, jy, chy, chw, a } = P;
  return (
    `M${c} ${top}C${n(c + tw * 0.6)} ${top} ${n(c + tw)} ${top + 14} ${n(c + tw + 0.5)} 88C${n(c + cw + 0.3)} 98 ${n(c + cw + 0.3)} 106 ${n(c + cw)} ${cy}` +
    `C${n(c + cw - 0.6)} ${cy + 11} ${n(c + jw + 3.5)} ${jy - 6} ${n(c + jw)} ${jy}C${n(c + jw - 5)} ${jy + 7} ${n(c + chw + 4)} ${n(chy - 0.8)} ${n(c + 0.6)} ${chy}` +
    `C${n(c - chw - 4 - a * 0.5)} ${n(chy - 0.6)} ${n(c - jw + 5 - a)} ${jy + 7} ${n(c - jw - a)} ${n(jy + 0.5)}C${n(c - jw - 3.5 - a)} ${jy - 6} ${n(c - cw + 0.6 - a)} ${cy + 11} ${n(c - cw - a)} ${n(cy + 0.4)}` +
    `C${n(c - cw - 0.3 - a)} 106 ${n(c - cw - 0.3 - a)} 98 ${n(c - tw - 0.5 - a * 0.5)} 88C${n(c - tw - a * 0.5)} ${top + 14} ${n(c - tw * 0.6)} ${top} ${c} ${top}Z`
  );
}
function beardD(P: FaceP) {
  const c = 120;
  const { cw, jw, jy, chy, chw, a } = P;
  return (
    `M${n(c - cw - a + 0.6)} 115C${n(c - cw - a + 0.2)} 121 ${n(c - jw - 3.4 - a)} ${jy - 6} ${n(c - jw - 0.3 - a)} ${jy + 0.8}C${n(c - jw + 4.6 - a)} ${jy + 8} ${n(c - chw - 4)} ${n(chy + 0.8)} ${c + 0.4} ${n(chy + 0.8)}` +
    `C${n(c + chw + 4)} ${n(chy + 0.7)} ${n(c + jw - 4.6)} ${jy + 8} ${n(c + jw + 0.4)} ${jy + 0.8}C${n(c + jw + 3.4)} ${jy - 6} ${n(c + cw - 0.2)} 121 ${n(c + cw - 0.6)} 115` +
    `C${n(c + cw - 5)} 124 ${n(c + cw - 11)} 128 ${c + 10.5} 128.4C${c + 8} 128.2 ${c + 5} 126.4 ${c + 0.6} 126.6C${c - 4} 126.4 ${c - 8} 128.2 ${c - 10.5} 128.4C${n(c - cw + 11)} 128 ${n(c - cw + 5)} 124 ${n(c - cw - a + 0.6)} 115Z`
  );
}

type Eye = { sclera: string; up: string; low: string; crease: string; lash: string; cx: number; cy: number; hx: number; hy: number; pivot: number };
function eyeG(cx: number, cy: number, w: number, h: number, d: number, lift: number, lash: boolean): Eye {
  const ox = cx + (d * w) / 2;
  const oy = cy - lift;
  const ix = cx - (d * w) / 2;
  const iy = cy + 0.35;
  const up = `M${n(ox)} ${n(oy)}C${n(ox - d * w * 0.2)} ${n(cy - h * 0.98)} ${n(ix + d * w * 0.34)} ${n(cy - h * 1.12)} ${n(ix)} ${n(iy)}`;
  const lowC = `C${n(ix + d * w * 0.3)} ${n(cy + h * 0.62)} ${n(ox - d * w * 0.26)} ${n(cy + h * 0.58)} ${n(ox)} ${n(oy)}`;
  const icy = cy - h * 0.12;
  const ir = h * 0.62;
  return {
    sclera: up + lowC + "Z",
    up,
    low: `M${n(ix)} ${n(iy)}` + lowC,
    crease: `M${n(ox - d * w * 0.06)} ${n(oy - h * 0.6)}C${n(ox - d * w * 0.22)} ${n(cy - h * 1.8)} ${n(ix + d * w * 0.36)} ${n(cy - h * 1.9)} ${n(ix + d * w * 0.05)} ${n(cy - h * 0.98)}`,
    lash: lash ? `M${n(ox)} ${n(oy)}C${n(ox + d * 0.8)} ${n(oy - 0.3)} ${n(ox + d * 1.6)} ${n(oy - 0.9)} ${n(ox + d * 2.2)} ${n(oy - 1.7)}` : "",
    cx: n(cx),
    cy: n(icy),
    hx: n(cx + ir * 0.42),
    hy: n(icy - ir * 0.42),
    pivot: cy + h * 0.4,
  };
}

const NOSE_F = "translate(14.4 13.72) scale(.88)";
const BROWS = {
  male: [
    "M113.5 97.8C113 95.4 111.5 94.3 108.5 94C104 93.6 99.5 94.3 95.8 96.8C99.5 95.9 104 96 108 96.6C110.5 97 112 97.6 113.5 97.8Z",
    "M126.5 97.3C127 94.9 128.5 93.7 131.5 93.4C136 93 140.5 93.8 144.4 96.4C140.6 95.4 136 95.4 132 96C129.5 96.4 128 97 126.5 97.3Z",
  ],
  female: [
    "M112.6 97C112.2 95.2 111 94.2 108.6 93.6C105.4 92.6 101.4 92.4 97.2 95.6C101.2 93.9 104.8 94.2 108 95.1C110.2 95.7 111.6 96.4 112.6 97Z",
    "M127.4 96.6C127.8 94.8 129 93.8 131.4 93.2C134.6 92.2 138.6 92.1 142.8 95.4C138.8 93.6 135.2 93.8 132 94.7C129.8 95.3 128.4 96 127.4 96.6Z",
  ],
};

type BodyKeys = "back" | "collar" | "neck" | "scrub" | "notch" | "piping" | "coatL" | "coatR" | "lapels" | "arms" | "folds" | "pen" | "penClip" | "pocket" | "pocketSeam";
type Body = Record<BodyKeys, string> & { badge: { x: number; y: number } };
const BODY: Record<AvatarGender, Body> = {
  male: {
    back: "M10 280C12 236 22 212 50 200C70 192 92 184 104 172L136 172C148 184 170 192 190 200C218 212 228 236 230 280Z",
    collar: "M99 176C102 164 110 160 120 160C130 160 138 164 141 176L136 182L104 182Z",
    neck: "M104.5 128C105 142 105.3 154 105.3 160C105.3 165 104 168.6 101.4 171.4C99.8 173.2 98.4 175.2 97 177.4L97 202L143 202L143 177.4C141.6 175.2 140.2 173.2 138.6 171.4C136 168.6 134.7 165 134.7 160C134.7 154 135 142 135.5 128Z",
    scrub: "M96.6 176.6C100 174 102.4 172.6 104.2 172.2C107.8 181 113.4 191 120 199.4C126.6 191 132.2 181 135.8 172.2C137.6 172.6 140 174 143.4 176.6L152 280L88 280Z",
    notch: "M116.4 181Q120 183.6 123.6 181",
    piping: "M103.4 172C107 181.2 113 191.6 120 200.6C127 191.6 133 181.2 136.6 172",
    coatL: "M10 280C12 236 22 212 50 200C70 192 90 184 101 174C104 196 107 226 111 256L113 280Z",
    coatR: "M230 280C228 236 218 212 190 200C170 192 150 184 139 174C136 196 133 226 129 256L127 280Z",
    lapels: "M101 174C96 182 91 190 86 198L92 203L88 209C96 226 104 242 111 256C108 228 105 200 101 174ZM139 174C144 182 149 190 154 198L148 203.5L152 209.5C144 226 136 242 129 256C132 228 135 200 139 174Z",
    arms: "M48 224C51 242 53 262 53.5 280M192 224C189 242 187 262 186.5 280",
    folds: "M64 212C70 220 74 230 76 242M176 212C170 220 166 230 164 242",
    pen: "M162 226L162 212.7Q162 211 163.7 211Q165.4 211 165.4 212.7L165.4 226Z",
    penClip: "M166.2 212.6L166.2 220.4",
    pocket: "M155 224.6L180.4 223L181.4 239.4C173 241.6 163 241.8 156 241Z",
    pocketSeam: "M155.3 227.6L180.6 226",
    badge: { x: 60, y: 227 },
  },
  female: {
    back: "M18 280C20 240 30 216 56 204C74 196 94 188 107 176L133 176C146 188 166 196 184 204C210 216 220 240 222 280Z",
    collar: "M102 178C105 167 112 163 120 163C128 163 135 167 138 178L134 184L106 184Z",
    neck: "M105.6 128C106.2 142 106.6 154 106.6 161.6C106.6 167 105.8 171.4 104.4 174.6C103.6 176.4 102.8 178.2 102 180L98 190L100.4 200L139.6 200L142 190L138 180C137.2 178.2 136.4 176.4 135.6 174.6C134.2 171.4 133.4 167 133.4 161.6C133.4 154 133.8 142 134.4 128Z",
    scrub: "M100 178.8C103.4 176.2 105.6 174.6 107.6 174.2C110.6 181.6 115 189.6 120 196.4C125 189.6 129.4 181.6 132.4 174.2C134.4 174.6 136.6 176.2 140 178.8L148 280L92 280Z",
    notch: "",
    piping: "M106.8 174C110 181.8 114.6 190 120 197.6C125.4 190 130 181.8 133.2 174",
    coatL: "M18 280C20 240 30 216 56 204C74 196 92 188 104 177C107 198 109 226 112 256L114 280Z",
    coatR: "M222 280C220 240 210 216 184 204C166 196 148 188 136 177C133 198 131 226 128 256L126 280Z",
    lapels: "M104 177C99 185 94 192 90 199L95.5 203.5L92 209C99 225 106 241 112 256C109.5 228 107 202 104 177ZM136 177C141 185 146 192 150 199L144.5 203.5L148 209C141 225 134 241 128 256C130.5 228 133 202 136 177Z",
    arms: "M54 226C57 244 58.6 262 59 280M186 226C183 244 181.4 262 181 280",
    folds: "M70 214C75 222 78.6 231 80.4 242M170 214C165 222 161.4 231 159.6 242",
    pen: "M159 227.6L159 214.4Q159 212.8 160.6 212.8Q162.2 212.8 162.2 214.4L162.2 227.6Z",
    penClip: "M163 214.2L163 221.6",
    pocket: "M153 226.6L175.6 225.2L176.4 240.6C169 242.6 160 242.8 154 242Z",
    pocketSeam: "M153.3 229.4L175.8 228",
    badge: { x: 66, y: 229 },
  },
};

function stetho(f: boolean) {
  const s = f
    ? {
        tl: "M106.4 167.2C104.8 171.6 102.8 176.6 101.2 182.6C99.6 190 98.8 198.6 98.6 207.4C98.4 217 98.8 227 100.2 235.2C100.9 239.4 101.8 242.6 102.8 245.4",
        tr: "M133.6 167.4C135.2 171.8 137.2 176.8 138.8 182.8C140.6 189.2 142.2 196.4 143 203.4C143.5 206.8 143.8 209.8 143.9 212.4",
        y: [144, 214],
        b1: "M143 214.6C140.4 222 139 229 138.8 235",
        b2: "M145 214.6C148 221 150 227 150.8 233",
        t1: [138.8, 237.4],
        t2: [151, 235.4],
        p: [103.2, 251.8],
      }
    : {
        tl: "M105.2 165.4C103.6 170.4 101.2 176 99.2 182.6C97 190 95.6 199 95.2 208C94.6 218 95 228 96.6 235.6C97.3 239 98 241.4 98.9 243.4",
        tr: "M134.8 165.6C136.4 170.8 139 176.6 141.6 182.6C144.2 189 146 195.8 147 202.8C147.4 205.6 147.6 208 147.6 210.4",
        y: [147.6, 212],
        b1: "M146.6 212.6C144 220 142.6 227 142.4 233",
        b2: "M148.6 212.6C151.6 219 153.6 225 154.4 231",
        t1: [142.4, 235.4],
        t2: [154.6, 233.4],
        p: [99.6, 249.8],
      };
  const [px, py] = s.p;
  return {
    tubes: s.tl + s.tr,
    bin: s.b1 + s.b2,
    yoke: ell(s.y[0], s.y[1], 2.1, 1.7),
    tips: ell(s.t1[0], s.t1[1], 2.2, 2.4) + ell(s.t2[0], s.t2[1], 2.2, 2.4),
    piece: ell(px, py, 7, 7),
    pieceShadow: ell(px + 1, py + 1.8, 7, 7),
    diaphragm: ell(px, py, 4.8, 4.8),
    pieceHi: `M${n(px - 4.8)} ${n(py - 3)}A5.7 5.7 0 0 1 ${n(px + 1.6)} ${n(py - 5.5)}`,
  };
}

type HairStyle = Partial<
  Record<"backBody" | "backHead" | "front" | "sheen" | "strands" | "part" | "wisp" | "bun" | "bunStrands" | "bunShade" | "bunHi" | "pony" | "ponyStrands" | "tie", string>
> & { ears?: boolean };

const MALE_HAIR: Record<AvatarMaleHair, HairStyle> = {
  short: {
    front: "M89 106C86.5 94 85.5 80 89.5 69C95 55 107 47.5 121 47.5C135.5 47.5 147.5 54.5 151.5 67C155 78 154.5 93 151.5 106L149.6 106C149.2 98 148.6 90 146.4 83C143 76.5 136.5 73 128.5 72.4C121 71.6 112 72 105 74.2C98.6 76.4 94.4 81 92.8 88C91.8 94 91.2 100 90.8 106Z",
    sheen: "M100 60C108 53.5 122 51.5 134 54.5C140 56 144 59 146 62C138 58 124 56.5 112 59C107 60 103 62 100 64Z",
    strands: "M108 56C112 60 116 66 118 71.5M126 52.5C130 58 134 64 137 72.5M96 66C98 70 99 74 100 77M143 62C145 68 146 74 146.5 80",
  },
  sidePart: {
    front: "M89 106C86 92 84.5 77 89 66C95 52 109 44 124 44.5C139 45 150.5 52.5 154 64.5C157 76 155.5 92 151.6 106L149.6 106C149.4 97 148.8 88 146.6 81C143 72 134 67.5 122 68C112 68.6 104 70.4 99 74C95 77.4 93 83 92.4 90C91.8 96 91.2 101 90.8 106Z",
    part: "M104 50C102 56 100.5 63 99.5 70.5",
    sheen: "M106 52C116 47.5 132 47 144 53C146 54.5 148 57 149 59.5C138 54 122 52.5 108 56Z",
    strands: "M106 55C116 52.5 130 54 142 62M103.5 61C114 58.5 128 60.5 140 68.5M101.5 67C112 64.5 124 66 134 69.5M92 80C94 72 97 66 101 61",
  },
  textured: {
    front: "M89 106C86 93 84.5 79 88.5 68C90.5 61 94 56.5 98.5 54C100.5 50 105 48 109.5 48.6C112.5 45.4 118 44.6 122 46.4C126 44.2 132 45 135.5 48C140.5 47.6 145.5 50.8 147.8 55.4C152.8 59.4 155.6 66.6 155.4 76C155.6 86 154.4 96 151.6 106L149.6 106C149.2 97 148.4 89 145.8 82.4C143 77 138.6 74.6 134 74.4C131 72.6 127 72.6 124 73.8C120.4 72 115.6 72.4 112.4 74C108 73 102.6 74.4 99 77.6C95.4 80.4 93.4 84.6 92.6 89.6C91.8 95 91.2 100 90.8 106Z",
    sheen: "M104 56C112 50.5 126 49.5 138 53C130 53 116 54 106 59Z",
    strands: "M100 60C103 64 105 68 106 73M112 52C114 58 116 64 117 72M126 50C127 57 128 64 129 72M139 54C140 60 141 66 140.5 74M147 62C148 68 148.5 74 147.5 80",
  },
  mature: {
    front: "M89.5 104C87 92 86.5 78 90.5 67.5C96 55 107.5 49 121 49C134.5 49 146 55 150.5 66.5C154.5 77.5 153.6 91 151 104L149.6 104C149 95 148.4 86 146.6 78C145 70 142.4 65 138 64.2C133.6 63.6 129.6 66.6 124.8 67.4C121.6 68 118.4 67.8 115.4 67C110.6 65.6 106.4 63 102.4 64.2C98.4 65.6 95.4 70 93.8 77C92.2 85 91.4 94 90.8 104Z",
    sheen: "M104 56C112 51.5 128 51 140 55.5C132 54.5 118 54.6 108 58.6Z",
    strands: "M110 57.5C112 60.5 113 63.5 114 66M130 57C131 60 132 62.5 133 64.5M96 72C97 76 97.6 80 97.8 84M144 71C144.6 75 144.8 79 144.6 83",
  },
};

const F_PULLED =
  "M88.6 106C85.6 92 85 77 90.4 66C96.6 53.4 108 46.4 121 46.4C134.6 46.4 146.4 53 151 65C155.6 77 154.8 92 151.8 106L149.6 106C149 96 147.6 87 144.6 80.4C140.4 73.6 132.6 69.8 124 69.4C115.6 69 106.4 71 100.6 75.6C95.4 80 93 87 92 94C91.4 98 91 102 90.8 106Z";
const F_SWEPT_L =
  "M121 46C101 46 86.5 57 84.5 79C82.6 100 83.6 124 85.6 146C87 162 85.6 178 81 192C89.6 190.4 96 182 98.2 170C97 150 94.6 128 93.4 110C92.6 96 95 82 100.6 76C104 72.4 108 70.6 112.4 70.8C124.4 71.6 138.6 77.4 147.2 90.6C149.4 106 148 124 146.2 146C145 162 148 178 156.6 192C160.6 180 158.6 164 156.6 148C156.2 124 158.4 100 156.2 82C152.6 58 139 46 121 46Z";
const F_SHEEN =
  "M116 50C128 48.6 140 53 147 62C150 67 151.4 72 152 77C147 66 138 57.4 126 54C122 53 118.6 52.6 116 52.6ZM88.5 82C89 70 94 60 102 54C96 62 92.4 72 91 84Z";

const FEMALE_HAIR: Record<AvatarFemaleHair, HairStyle> = {
  long: {
    backBody: "M86 92C82 118 83 150 80 176C78.5 188 76 196 72 204C84 210 98 206 106 196L134 196C142 206 156 210 168 204C164 196 161.5 188 160 176C157 150 158 118 154 92Z",
    front: F_SWEPT_L,
    part: "M110 48.5C110.6 56 111.4 63 112.4 70.6",
    sheen: F_SHEEN,
    strands: "M114 72.5C126 74.5 138 80.5 146 92M120 52C134 56 146 66 152 84M151 100C153 124 151 150 153 176M90 98C88 122 90 150 88 178M104 56C96 64 92 76 90 92",
    ears: false,
  },
  short: {
    backHead: "M86 96C84 120 85 140 88 152C100 158 140 158 152 152C155 140 156 120 154 96Z",
    front: "M121 46C101 46 86 57 84 79C82 101 83 127 86.6 147.6C90 154 97.6 154.4 101.4 149C97.4 135 94.6 121 93.4 108C92.6 96 95 82 100.6 76C104 72.4 108 70.6 112.4 70.8C124.4 71.6 138.6 77.4 147.2 90.6C149 108 146.8 128 141.2 148.4C145.2 154.6 153 153.6 156 147C159 126 159.2 102 157 80C153.6 58 139.6 46 121 46Z",
    part: "M110 48.5C110.6 56 111.4 63 112.4 70.6",
    sheen: F_SHEEN,
    strands: "M114 72.5C126 74.5 138 80.5 146 92M120 52C134 56 146 66 152 84M151.5 98C153.5 118 152.5 134 150 148M89.5 98C88.5 116 89.5 134 92 148",
    ears: false,
  },
  bun: {
    bun: ell(121.5, 39.5, 14.5, 10.5),
    bunStrands: "M110.8 38.6C114.6 34.6 122 33.4 129.4 36.4",
    bunShade: "M107.2 41.6C109 47.4 115 50 121.5 50C128 50 134 47.4 135.8 41.6C132.6 45.4 127.4 47 121.5 47C115.6 47 110.4 45.4 107.2 41.6Z",
    bunHi: "M112 34.4C115.2 31 119.4 29.8 123.6 30C127.6 30.2 130.8 31.6 132.6 33.6C129 32.4 125.4 32 121.8 32.4C118.2 32.8 115 33.6 112 34.4Z",
    front: F_PULLED,
    sheen: "M100 60C108 52.5 124 50.5 136 54C140 55.5 143.5 58 145.5 61C137 57 123 55.6 111 58.4C106 59.6 103 61.4 100 63.6Z",
    strands: "M96 80C100 66 110 56 120 50M146 80C142 66 132 56 122 50M108 72C112 62 116 56 121 50M134 72C130 62 126 56 121 50",
    wisp: "M92.2 92C90.8 98 91.2 104 92.8 108.6",
    ears: true,
  },
  tied: {
    front: F_PULLED,
    part: "M108 48.6C108.6 56 109.4 63 110.6 70.4",
    sheen: "M112 52C124 49.4 138 52 146 60C147.6 62 148.6 64 149 66C140 58 126 55 114 55Z",
    strands: "M100 76C108 64 122 58 140 60M112 70C124 64 138 66 148 76M94 90C96 74 106 62 118 56",
    pony: "M134 148C143 157 151 172 154 192C156.4 208 155 224 149 238C145.6 233 143.6 224 143.4 212C143.2 194 140 176 130 160Z",
    ponyStrands: "M139 160C147 175 150.6 196 149.6 222M135.6 158C142.4 171 146.4 190 146.4 214",
    tie: "",
    wisp: "M92.2 92C90.8 98 91.2 104 92.8 108.6",
    ears: true,
  },
  hijab: { ears: false },
};

const HIJAB = {
  drape: "M84 128C80 150 74 172 62 192C72 206 92 216 120 218C148 216 168 206 178 192C166 172 160 150 156 128Z",
  wrap: "M84 146C96 170 120 182 148 177C154 175.6 158.6 172.4 161.6 168C146 171 124 168 106 156C97 150 90.6 144 86.4 137Z",
  drapeFolds: "M96 184C104 197 112 205 120 207.4M146 181C140 195 131 203 123 207M74 186C82 196 92 204 104 209M166 186C160 196 150 203 138 208",
  rim: "M120 41C97 41 80 56 78.5 82C77 106 79 130 84 150C90 168 104 178 120 179C136 178 150 168 156 150C161 130 163 106 161.5 82C160 56 143 41 120 41ZM120 66C134 66 144.6 74 146.8 90C148 106 147 120 144 132C140.4 144 131 151.6 120 152.4C109 151.6 99.6 144 96 132C93 120 92 106 93.2 90C95.4 74 106 66 120 66Z",
  opening: "M120 66C134 66 144.6 74 146.8 90C148 106 147 120 144 132C140.4 144 131 151.6 120 152.4C109 151.6 99.6 144 96 132C93 120 92 106 93.2 90C95.4 74 106 66 120 66Z",
  band: "M94.2 86C96.6 72 107 65.6 120 65.6C133 65.6 143.4 72 145.8 86C146.6 84.4 147 82.6 147 81C144.6 68 133.6 61.8 120 61.8C106.4 61.8 95.4 68 93 81C93 82.6 93.4 84.4 94.2 86Z",
  folds: "M87 116C88 132 91.6 146 98.6 157M153 114C152.4 130 149 144 142.4 156M103 168C111 173.6 129 173.6 137 168",
  crown: "M99 52C109 46 128 45 141 50.6",
};
const NO_HIJAB = { drape: "", wrap: "", drapeFolds: "", rim: "", opening: "", band: "", folds: "", crown: "" };

const LINES = {
  under: "M100.4 108.8C103.6 110.6 107.8 110.6 111 109M129 108.6C132.2 110.4 136.4 110.2 139.6 108.4",
  fore: "M107 80C114 78.8 126 78.8 133 80.2M110 84.6C116 83.8 124 83.8 130 84.8",
  crow: "M97 104.4L94.8 105.4M97.2 106.4L95.2 107.8M143.2 103.8L145.4 104.8M143 105.8L145 107.2",
  naso: "M112.4 122.4C110.2 126 109.4 130 110.4 134.2M128 122.2C130.2 126 131 130 130 134.2",
};

export type Pose = { smile: number; bl: number; br: number; tilt: number; yaw: number; gx: number; gy: number; sway: number; talk: number; asym: number };
export const POSE: Record<AvatarState, Pose> = {
  idle: { smile: 0.14, bl: 0, br: 0, tilt: 0, yaw: 0, gx: 0, gy: 0, sway: 1, talk: 0, asym: 0.12 },
  listening: { smile: 0.36, bl: -0.5, br: -0.4, tilt: 1.1, yaw: 0.35, gx: 0.1, gy: 0, sway: 0.6, talk: 0, asym: 0.15 },
  thinking: { smile: -0.04, bl: -0.95, br: 0.25, tilt: -1.2, yaw: -0.7, gx: 1.3, gy: -1.2, sway: 0.45, talk: 0, asym: 0.75 },
  speaking: { smile: 0.2, bl: -0.15, br: -0.1, tilt: 0.2, yaw: 0.1, gx: 0, gy: 0, sway: 1.15, talk: 1, asym: 0.1 },
};

function lensPath(style: string, cx: number, cy: number) {
  if (style === "rectangular")
    return `M${n(cx - 9.6)} ${n(cy - 5.4)}C${n(cx - 3)} ${n(cy - 6.3)} ${n(cx + 3)} ${n(cy - 6.3)} ${n(cx + 9.6)} ${n(cy - 5.4)}C${n(cx + 10.1)} ${n(cy - 2)} ${n(cx + 9.7)} ${n(cy + 2.4)} ${n(cx + 8.7)} ${n(cy + 4.9)}C${n(cx + 4)} ${n(cy + 6.5)} ${n(cx - 4)} ${n(cy + 6.5)} ${n(cx - 8.7)} ${n(cy + 4.9)}C${n(cx - 9.7)} ${n(cy + 2.4)} ${n(cx - 10.1)} ${n(cy - 2)} ${n(cx - 9.6)} ${n(cy - 5.4)}Z`;
  if (style === "rounded")
    return `M${n(cx - 8.2)} ${n(cy - 1)}C${n(cx - 8.2)} ${n(cy - 5.4)} ${n(cx - 4.6)} ${n(cy - 6.8)} ${n(cx)} ${n(cy - 6.8)}C${n(cx + 4.6)} ${n(cy - 6.8)} ${n(cx + 8.2)} ${n(cy - 5.4)} ${n(cx + 8.2)} ${n(cy - 1)}C${n(cx + 8.2)} ${n(cy + 4.2)} ${n(cx + 4.6)} ${n(cy + 7)} ${n(cx)} ${n(cy + 7)}C${n(cx - 4.6)} ${n(cy + 7)} ${n(cx - 8.2)} ${n(cy + 4.2)} ${n(cx - 8.2)} ${n(cy - 1)}Z`;
  return `M${n(cx - 9.4)} ${n(cy - 0.4)}C${n(cx - 9.4)} ${n(cy - 4.4)} ${n(cx - 5.2)} ${n(cy - 6)} ${n(cx)} ${n(cy - 6)}C${n(cx + 5.2)} ${n(cy - 6)} ${n(cx + 9.4)} ${n(cy - 4.4)} ${n(cx + 9.4)} ${n(cy - 0.4)}C${n(cx + 9.4)} ${n(cy + 4)} ${n(cx + 5)} ${n(cy + 6.4)} ${n(cx)} ${n(cy + 6.4)}C${n(cx - 5)} ${n(cy + 6.4)} ${n(cx - 9.4)} ${n(cy + 4)} ${n(cx - 9.4)} ${n(cy - 0.4)}Z`;
}

export type MouthGeom = { cx: number; y: number; hw: number; ut: number; lt: number };
export function mouthD(M: MouthGeom, smile: number, open: number, asym: number) {
  const { cx, y, hw, ut, lt } = M;
  const op = open * 3.4;
  const Lx = cx - hw - smile * 0.7;
  const Ly = y - smile * 1.5 - asym * 0.55;
  const Rx = cx + hw + smile * 0.7;
  const Ry = y - smile * 1.5 + asym * 0.3;
  const su = y + 0.25 - op * 0.22;
  const sl = y + 0.35 + op * 0.78;
  const lb = sl + lt + op * 0.05;
  const k = 0.25 - smile * 0.4;
  const top = `M${n(Lx)} ${n(Ly)}C${n(cx - hw * 0.62)} ${n(y - ut * 0.75)} ${n(cx - hw * 0.34)} ${n(y - ut * 1.2)} ${n(cx - 1.3)} ${n(y - ut * 1.06)}Q${n(cx)} ${n(y - ut * 0.72)} ${n(cx + 1.3)} ${n(y - ut * 1.06)}C${n(cx + hw * 0.34)} ${n(y - ut * 1.2)} ${n(cx + hw * 0.62)} ${n(y - ut * 0.75)} ${n(Rx)} ${n(Ry)}`;
  const suRL = `C${n(cx + hw * 0.55)} ${n(su + k)} ${n(cx + hw * 0.25)} ${n(su)} ${n(cx)} ${n(su)}C${n(cx - hw * 0.25)} ${n(su)} ${n(cx - hw * 0.55)} ${n(su + k)} `;
  const slLR = (x0: number, x1: number) =>
    `M${n(x0)} ${n(Ly)}C${n(cx - hw * 0.55)} ${n(sl + k)} ${n(cx - hw * 0.25)} ${n(sl)} ${n(cx)} ${n(sl)}C${n(cx + hw * 0.25)} ${n(sl)} ${n(cx + hw * 0.55)} ${n(sl + k)} ${n(x1)} ${n(Ry)}`;
  const cav = `M${n(Lx + 0.9)} ${n(Ly)}C${n(cx - hw * 0.55)} ${n(su + k)} ${n(cx - hw * 0.25)} ${n(su)} ${n(cx)} ${n(su)}C${n(cx + hw * 0.25)} ${n(su)} ${n(cx + hw * 0.55)} ${n(su + k)} ${n(Rx - 0.9)} ${n(Ry)}C${n(cx + hw * 0.55)} ${n(sl + k)} ${n(cx + hw * 0.25)} ${n(sl)} ${n(cx)} ${n(sl)}C${n(cx - hw * 0.25)} ${n(sl)} ${n(cx - hw * 0.55)} ${n(sl + k)} ${n(Lx + 0.9)} ${n(Ly)}Z`;
  const m = (su + sl) / 2;
  return {
    upper: top + suRL + `${n(Lx)} ${n(Ly)}Z`,
    lower:
      slLR(Lx, Rx) +
      `C${n(cx + hw * 0.62)} ${n(lb - lt * 0.15)} ${n(cx + hw * 0.3)} ${n(lb)} ${n(cx)} ${n(lb)}C${n(cx - hw * 0.3)} ${n(lb)} ${n(cx - hw * 0.62)} ${n(lb - lt * 0.15)} ${n(Lx)} ${n(Ly)}Z`,
    cav,
    teeth: `M${n(cx - hw)} ${n(su - 2)}L${n(cx + hw)} ${n(su - 2)}L${n(cx + hw * 0.6)} ${n(su + op * 0.3)}Q${n(cx)} ${n(su + op * 0.42 + 0.3)} ${n(cx - hw * 0.6)} ${n(su + op * 0.3)}Z`,
    seam: `M${n(Lx - 0.3)} ${n(Ly)}C${n(cx - hw * 0.55)} ${n(m + k)} ${n(cx - hw * 0.25)} ${n(m)} ${n(cx)} ${n(m)}C${n(cx + hw * 0.25)} ${n(m)} ${n(cx + hw * 0.55)} ${n(m + k)} ${n(Rx + 0.3)} ${n(Ry)}`,
    shadow: `M${n(cx - hw * 0.45)} ${n(lb + 1.6)}Q${n(cx)} ${n(lb + 2.8)} ${n(cx + hw * 0.45)} ${n(lb + 1.6)}`,
    hi: `M${n(cx - hw * 0.4)} ${n(sl + lt * 0.42)}Q${n(cx - 0.6)} ${n(sl + lt * 0.22)} ${n(cx + hw * 0.15)} ${n(sl + lt * 0.42)}`,
    corners: `M${n(Lx - 0.4)} ${n(Ly - 0.6)}Q${n(Lx - 1)} ${n(Ly + 0.2)} ${n(Lx - 0.3)} ${n(Ly + 1)}M${n(Rx + 0.4)} ${n(Ry - 0.6)}Q${n(Rx + 1)} ${n(Ry + 0.2)} ${n(Rx + 0.3)} ${n(Ry + 1)}`,
    seamOp: 1 - Math.min(1, open * 1.6) * 0.55,
  };
}

export type AvatarModel = ReturnType<typeof buildAvatar>;

/** Turns the look props into everything the SVG needs. Pure; safe on the server. */
export function buildAvatar(p: AvatarLook, uid: string, framing: "portrait" | "headshot") {
  const female = (p.gender ?? "female") === "female";
  const sex: AvatarGender = female ? "female" : "male";
  const age = p.age ?? "adult";
  const P: FaceP = { ...FACES[sex][p.faceShape === "structured" ? "structured" : "balanced"] };
  if (age === "young") {
    P.jw -= 0.8;
    P.chy -= 0.5;
  }
  if (age === "mature") {
    P.jw += 0.6;
    P.chy += 0.4;
  }
  const tone = TONES[p.skinTone ?? "light"] ?? TONES.light;
  const fKey: AvatarFemaleHair = p.femaleHair && FEMALE_HAIR[p.femaleHair] ? p.femaleHair : "bun";
  const mKey: AvatarMaleHair = p.maleHair && MALE_HAIR[p.maleHair] ? p.maleHair : "sidePart";
  const hijab = female && fKey === "hijab";
  const hs: HairStyle = female ? FEMALE_HAIR[fKey] : { ...MALE_HAIR[mKey], ears: true };
  const hb = (p.hairColor && HAIRC[p.hairColor]) || (age === "mature" ? HAIRC.salt : HAIRC.darkBrown);
  const lightHair = p.hairColor === "blonde" || p.hairColor === "grey";
  const h = {
    base: hb,
    sh: mix(hb, "#000000", 0.38),
    hi: mix(hb, "#FFFFFF", lightHair ? 0.35 : 0.24),
    brow: lightHair ? mix(hb, "#3A2C25", 0.5) : mix(hb, "#000000", 0.1),
  };
  const sc = SCARF[p.scarf ?? "navy"] || SCARF.navy;
  const s = { base: sc, sh: mix(sc, "#0A1420", 0.32), hi: mix(sc, "#FFFFFF", 0.18), fold: mix(sc, "#0A1420", 0.45), band: mix(sc, "#FFFFFF", 0.62), wrap: mix(sc, "#FFFFFF", 0.08) };
  const sb = SCRUB[p.scrubs ?? "blue"] || SCRUB.blue;
  const eyeW = female ? 11.8 : 11.6;
  const eyeH = (female ? 5.3 : 4.5) + (age === "young" ? 0.2 : age === "mature" ? -0.3 : 0);
  const eL = female ? [106.2, 104.6] : [105.6, 104.4];
  const eR = female ? [134, 104.3] : [134.6, 104];
  const eyeL = eyeG(eL[0], eL[1], eyeW, eyeH, -1, female ? 0.9 : 0.5, female);
  const eyeR = eyeG(eR[0], eR[1], eyeW, eyeH, 1, female ? 0.8 : 0.45, female);
  const c = 120;
  const body = BODY[sex];
  const beardStyle = female ? "none" : (p.beard ?? "none");
  const earGeo = () => {
    const l = c - P.cw + 1 - P.a;
    const r = c + P.cw - 1;
    const t = female ? 101 : 100;
    const b = female ? 118.6 : 121;
    return {
      ears: `M${n(l + 1.8)} ${t}C${n(l - 4)} ${t - 4} ${n(l - 7)} ${t + 1} ${n(l - 6)} ${t + 8}C${n(l - 5)} ${b - 5} ${n(l - 2)} ${b} ${n(l + 2.5)} ${b}ZM${n(r - 1.8)} ${t}C${n(r + 4)} ${t - 4} ${n(r + 7)} ${t + 1} ${n(r + 6)} ${t + 8}C${n(r + 5)} ${b - 5} ${n(r + 2)} ${b} ${n(r - 2.5)} ${b}Z`,
      inner: `M${n(l - 2)} 104C${n(l - 4.4)} 106 ${n(l - 4)} 112 ${n(l - 1.4)} 115M${n(r + 2)} 104C${n(r + 4.4)} 106 ${n(r + 4)} 112 ${n(r + 1.4)} 115`,
    };
  };
  const ear = hs.ears ? earGeo() : { ears: "", inner: "" };
  const J = P.jy + 13;
  const Ch = P.chy + 13;
  const G = {
    face: faceD(P),
    eyeL,
    eyeR,
    ir: n(eyeH * 0.62),
    pr: n(eyeH * 0.27),
    lidW: female ? 1.6 : 1.3,
    creases: eyeL.crease + eyeR.crease,
    lowLids: eyeL.low + eyeR.low,
    browL: BROWS[sex][0],
    browR: BROWS[sex][1],
    noseT: female ? NOSE_F : "translate(0 0)",
    mouth: (female ? { cx: 120.2, y: 132.4, hw: 7.8, ut: 2.3, lt: 3.7 } : { cx: 120.3, y: 133.6, hw: 8.4, ut: 1.7, lt: 3.3 }) as MouthGeom,
    body,
    badge: body.badge,
    st: stetho(female),
    neckShadow: `M${n(c - P.jw - 2)} ${n(J - 10)}L${n(c - P.jw)} ${n(J - 1)}C${n(c - P.jw + 4)} ${n(J + 8)} ${c - 10} ${n(Ch + 7)} ${c} ${n(Ch + 7.5)}C${c + 10} ${n(Ch + 7)} ${n(c + P.jw - 4)} ${n(J + 8)} ${n(c + P.jw)} ${n(J - 1)}L${n(c + P.jw + 2)} ${n(J - 10)}Z`,
    neckHiY: female ? 173.5 : 171,
    chinHiY: n(P.chy - 5),
    ears: ear.ears,
    earInner: ear.inner,
    contours: female
      ? ""
      : `M${n(c + P.cw - 2.6)} 119C${n(c + P.cw - 1.6)} 126 ${n(c + P.jw + 1)} 133 ${n(c + P.jw - 1.5)} 138M${n(c - P.cw + 3)} 120C${n(c - P.cw + 2.4)} 126 ${n(c - P.jw - 0.5)} 132 ${n(c - P.jw + 1.6)} 137M116 144C118.6 145 122 145 124.6 144`,
    lines: age === "mature" ? LINES.under + LINES.fore + LINES.crow : "",
    nasolabial: LINES.naso,
    beard: beardStyle === "none" ? "" : beardD(P),
  };

  const glStyle = p.glasses && p.glasses !== "none" ? p.glasses : "none";
  let gl = { lenses: "", glare: "", arms: "", bridge: "", top: "", color: "#000", hi: "#fff", w: 1.5 };
  if (glStyle !== "none") {
    const fc = FRAME[p.frameColor ?? "charcoal"] || FRAME.charcoal;
    const gy = (eL[1] + eR[1]) / 2 - 0.3;
    const hw = glStyle === "rectangular" ? 9.6 : glStyle === "rounded" ? 8.2 : 9.4;
    const lx = eL[0];
    const rx = eR[0];
    const covers = !hs.ears;
    const faceL = c - P.cw - P.a;
    const faceR = c + P.cw;
    const armL = covers || hijab ? faceL + 2.5 : faceL - 1.6;
    const armR = covers || hijab ? faceR - 2.5 : faceR + 1.6;
    gl = {
      lenses: lensPath(glStyle, lx, gy) + lensPath(glStyle, rx, gy),
      glare: `M${n(lx - 5)} ${n(gy + 3.4)}L${n(lx + 0.4)} ${n(gy - 3.8)}M${n(lx + 1.8)} ${n(gy + 2.8)}L${n(lx + 4.6)} ${n(gy - 1)}M${n(rx - 5)} ${n(gy + 3.4)}L${n(rx + 0.4)} ${n(gy - 3.8)}`,
      arms: `M${n(lx - hw + 0.2)} ${n(gy - 2.8)}L${n(armL)} ${n(gy - 1.8)}M${n(rx + hw - 0.2)} ${n(gy - 2.8)}L${n(armR)} ${n(gy - 1.8)}`,
      bridge: `M${n(lx + hw - 0.4)} ${n(gy - 2.6)}C${n(lx + hw + 1.8)} ${n(gy - 4.6)} ${n(rx - hw - 1.8)} ${n(gy - 4.6)} ${n(rx - hw + 0.4)} ${n(gy - 2.6)}`,
      top: glStyle === "oval" ? "" : `M${n(lx - 6)} ${n(gy - 5.9)}C${n(lx - 2)} ${n(gy - 6.5)} ${n(lx + 2)} ${n(gy - 6.5)} ${n(lx + 6)} ${n(gy - 5.9)}`,
      color: fc,
      hi: mix(fc, "#FFFFFF", 0.5),
      w: glStyle === "rectangular" ? 1.7 : glStyle === "rounded" ? 1.5 : 1.05,
    };
  }

  const hair: HairStyle = hijab ? {} : hs;
  const idKeys = ["face", "eyeL", "eyeR", "cav", "top", "sideR", "sideL", "jaw", "neck", "coatL", "coatR", "metal", "scarf", "drape", "beard", "neckC", "neckSide", "jawSh", "blush", "socket", "hi"] as const;
  const ids = {} as Record<(typeof idKeys)[number], string>;
  const u = {} as Record<(typeof idKeys)[number], string>;
  idKeys.forEach((k) => {
    ids[k] = uid + k;
    u[k] = `url(#${uid + k})`;
  });
  const lip = female ? mix(tone.lip, tone.shade, 0.15) : mix(tone.lip, tone.shade, 0.45);
  const head = framing === "headshot";
  const eyeBase = EYEC[p.eyeColor ?? "brown"] || EYEC.brown;
  return {
    G,
    viewBox: head ? "63 55 114 114" : "14 32 212 222",
    par: head ? "xMidYMid slice" : "xMidYMax meet",
    ids,
    u,
    gl,
    c: { ...tone, ear: mix(tone.base, tone.shade, 0.35), vskin: mix(tone.base, tone.shade, 0.55), lid: mix(tone.deep, "#1A1210", 0.62), seam: mix(tone.deep, "#2A1512", 0.45), lipUp: mix(lip, tone.deep, 0.3), lipLow: lip },
    h,
    s,
    scrub: { base: sb, dark: mix(sb, "#000000", 0.25), accent: "#3E8EDE" },
    eye: { iris: eyeBase, rim: mix(eyeBase, "#000000", 0.5) },
    beard: {
      fill: beardStyle === "stubble" ? h.sh : h.base,
      deep: beardStyle === "stubble" ? h.sh : mix(h.base, "#000000", 0.2),
      op: beardStyle === "stubble" ? 0.3 : 0.86,
      edge: beardStyle === "short" ? 0.35 : 0,
    },
    look: {
      jaw: female ? 0.32 : 0.5,
      socket: age === "mature" ? 0.55 : age === "young" ? 0.25 : 0.38,
      blush: female ? 0.32 : 0.16,
      contour: female ? 0 : age === "young" ? 0.14 : 0.26,
      lines: age === "mature" ? 0.3 : 0,
      naso: age === "mature" ? 0.34 : age === "adult" ? 0.07 : 0,
    },
    hair: {
      backBody: hair.backBody || "",
      backHead: hair.backHead || "",
      front: hair.front || "",
      sheen: hair.sheen || "",
      strands: hair.strands || "",
      part: hair.part || "",
      wisp: hair.wisp || "",
      bun: hair.bun || "",
      bunStrands: hair.bunStrands || "",
      bunShade: hair.bunShade || "",
      bunHi: hair.bunHi || "",
      pony: hair.pony || "",
      ponyStrands: hair.ponyStrands || "",
      tie: hair.tie || "",
    },
    hj: hijab ? HIJAB : NO_HIJAB,
  };
}
