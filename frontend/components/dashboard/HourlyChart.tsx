"use client";

import { useState } from "react";

type Point = { hour: string; count: number };

const W = 640;
const H = 220;
const PAD = { top: 16, right: 8, bottom: 28, left: 32 };

/** Single-series bar chart: patients who started a consultation, per hour. */
export default function HourlyChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.count));
  const top = Math.ceil(max / 5) * 5;
  const ticks = [0, top / 2, top];
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / data.length;
  const barW = Math.min(30, slot - 8);
  const y = (v: number) => PAD.top + innerH - (v / top) * innerH;
  const peak = data.findIndex((d) => d.count === max);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Patients per hour today">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e6ebf2" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#6b7c90">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = PAD.left + slot * i + (slot - barW) / 2;
          const h = Math.max(2, (d.count / top) * innerH);
          const r = Math.min(4, barW / 2);
          const yTop = PAD.top + innerH - h;
          const active = hover === i;
          return (
            <g key={d.hour}>
              {/* Rounded top, square base anchored to the baseline */}
              <path
                d={`M${x} ${PAD.top + innerH}V${yTop + r}Q${x} ${yTop} ${x + r} ${yTop}H${x + barW - r}Q${x + barW} ${yTop} ${x + barW} ${yTop + r}V${PAD.top + innerH}Z`}
                fill={active || hover === null ? "#3e8ede" : "#a9cbee"}
                className="transition-colors"
              />
              {i === peak && hover === null && (
                <text x={x + barW / 2} y={yTop - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="#0f2540">
                  {d.count}
                </text>
              )}
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#6b7c90">
                {d.hour}
              </text>
              {/* Hit target wider than the bar */}
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${d.hour}:00, ${d.count} patients`}
              />
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg"
          style={{
            left: `${((PAD.left + slot * hover + slot / 2) / W) * 100}%`,
            top: `${(y(data[hover].count) / H) * 100}%`,
            transform: "translate(-50%, calc(-100% - 8px))",
          }}
        >
          <span className="font-semibold">{data[hover].count} patients</span> · {data[hover].hour}:00–{data[hover].hour}:59
        </div>
      )}
      <table className="sr-only">
        <caption>Patients per hour today</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.hour}>
              <th>{d.hour}:00</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
