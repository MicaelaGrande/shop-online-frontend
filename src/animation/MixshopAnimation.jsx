import { useEffect, useState } from "react";

/**
 * MixshopBanner
 * Stickman dibujado a mano que entra por la izquierda tironeando una caja cerrada.
 * Al llegar al centro la caja tiembla, se abre (aparece la carita del logo) y salen
 * objetos con preguntas de las categorías.
 *
 * Props:
 *  - categories: [{ label, icon: "bazar"|"toy"|"tech"|"star", dx, dy }]
 *  - loop: repite la animación cada 15s
 *  - rough: efecto "línea temblorosa" de dibujo a mano (SVG filter)
 *  - className: clase extra para el contenedor
 * Click sobre el banner = repetir la animación.
 */

const DEFAULT_CATEGORIES = [
  { label: "¿Bazar?", icon: "bazar", dx: -270, dy: -100 },
  { label: "¿Juguetería?", icon: "toy", dx: -120, dy: -185 },
  { label: "¿Electrónica?", icon: "tech", dx: 55, dy: -175 },
  { label: "¿Y mucho más?", icon: "star", dx: 150, dy: -85 },
];

/* ---------- generador de keyframes (línea de tiempo en % de 11s) ---------- */
const D = 11; // duración total en segundos
const T = (v) => `transform:${v}`;
const fr = (a) =>
  [...a].sort((x, y) => x[0] - y[0]).map(([p, v]) => `${p}%{${v}}`).join("");
const kf = (name, arr) => `@keyframes mx-${name}{${fr(arr)}}`;
// 5 "tirones" de 12% cada uno: 0–7% avanza, 7–12% pausa haciendo fuerza
const cyc = (fn) => [0, 12, 24, 36, 48].flatMap(fn);
const EASE = "animation-timing-function:cubic-bezier(.45,0,.2,1);";
const ROPE_BASE = 187;
const rope = (off) => T(`scale(${1 - off / ROPE_BASE},${1 + off * 0.03})`);

const CSS = `
.mx-banner{width:100%;position:relative;overflow:hidden;cursor:pointer}
.mx-banner svg{display:block;width:100%;height:auto}
.mx-s{fill:none;stroke:#0b5aa5;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
.mx-t{stroke-width:4}
.mx-w{fill:#fff}
.mx-txt{font-family:Ubuntu,system-ui,sans-serif;font-weight:700;font-size:15px;fill:#2f5fb3;text-anchor:middle}
.mx-pill{fill:#eaf0fb;stroke:#2f5fb3;stroke-width:2.5}
.mx-a{animation-duration:${D}s;animation-fill-mode:both;animation-timing-function:ease-in-out}
.mx-walk{animation-name:mx-walk}
.mx-legA{animation-name:mx-legA}.mx-legB{animation-name:mx-legB}
.mx-lean{animation-name:mx-lean}.mx-head{animation-name:mx-head}
.mx-hop{animation-name:mx-hop}
.mx-boxrel{animation-name:mx-boxrel}.mx-boxwob{animation-name:mx-boxwob}
.mx-rope{animation-name:mx-rope}.mx-ropefade{animation-name:mx-ropefade}
.mx-effort{animation-name:mx-effort}.mx-happy{animation-name:mx-happy}
.mx-armR{animation-name:mx-armR}.mx-armL{animation-name:mx-armL}
.mx-flapL{animation-name:mx-flapL}.mx-flapR{animation-name:mx-flapR}
.mx-facepop{animation-name:mx-facepop}
.mx-waveR{animation:mx-wave .6s ease-in-out infinite;animation-delay:${D * 0.76}s}
.mx-waveL{animation:mx-wave .6s ease-in-out infinite reverse;animation-delay:${D * 0.76}s}
.mx-sweat{animation:mx-sweat .8s ease-in infinite}
.mx-pop{animation:mx-pop .95s cubic-bezier(.2,.8,.3,1) both;animation-delay:var(--d)}
.mx-float{animation:mx-bob 2.8s ease-in-out infinite;animation-delay:calc(var(--d) + 1.2s)}

${kf("walk", [
  ...cyc((s) => {
    const x = -900 + 15 * s;
    return [
      [s, `${EASE}${T(`translateX(${x}px)`)}`],
      [s + 7, T(`translateX(${x + 180}px)`)],
    ];
  }),
  [60, T("translateX(0px)")],
  [100, T("translateX(0px)")],
])}
${kf("legA", [
  ...cyc((s) => [
    [s, T("rotate(-26deg)")],
    [s + 3.5, T("rotate(26deg)")],
    [s + 7, T("rotate(-6deg)")],
  ]),
  [60, T("rotate(-2deg)")],
  [63, T("rotate(0deg)")],
  [100, T("rotate(0deg)")],
])}
${kf("legB", [
  ...cyc((s) => [
    [s, T("rotate(26deg)")],
    [s + 3.5, T("rotate(-26deg)")],
    [s + 7, T("rotate(6deg)")],
  ]),
  [60, T("rotate(2deg)")],
  [63, T("rotate(0deg)")],
  [100, T("rotate(0deg)")],
])}
${kf("lean", [
  ...cyc((s) => [
    [s, T("rotate(19deg)")],
    [s + 3.5, T("rotate(25deg)")],
    [s + 7, T("rotate(23deg)")],
    [s + 9.5, T("rotate(26deg)")],
  ]),
  [60, T("rotate(22deg)")],
  [62, T("rotate(-5deg)")],
  [64, T("rotate(3deg)")],
  [66, T("rotate(0deg)")],
  [100, T("rotate(0deg)")],
])}
${kf("head", [
  ...cyc((s) => [
    [s, T("rotate(-4deg)")],
    [s + 4, T("rotate(5deg)")],
    [s + 8, T("rotate(-3deg)")],
    [s + 10, T("rotate(4deg)")],
  ]),
  [60, T("rotate(0deg)")],
  [64, T("rotate(-6deg)")],
  [67, T("rotate(7deg)")],
  [70, T("rotate(0deg)")],
  [74, T("rotate(-8deg)")],
  [78, T("rotate(6deg)")],
  [82, T("rotate(0deg)")],
  [100, T("rotate(0deg)")],
])}
${kf("hop", [
  [0, T("translateY(0)")],
  [72, T("translateY(0)")],
  [73.5, T("translateY(-30px)")],
  [75, T("translateY(0)")],
  [77, T("translateY(-22px)")],
  [78.5, T("translateY(0)")],
  [100, T("translateY(0)")],
])}
${kf("boxrel", [
  ...cyc((s) => [
    [s, T("translateX(0px)")],
    [s + 2, T("translateX(-16px)")],
    [s + 7, T("translateX(-12px)")],
    [s + 9.5, T("translateX(5px)")],
    [s + 11, T("translateX(0px)")],
  ]),
  [60, T("translateX(0px)")],
  [100, T("translateX(0px)")],
])}
${kf("rope", [
  ...cyc((s) => [
    [s, rope(0)],
    [s + 2, rope(-16)],
    [s + 7, rope(-12)],
    [s + 9.5, rope(5)],
    [s + 11, rope(0)],
  ]),
  [60, rope(0)],
  [100, rope(0)],
])}
${kf("boxwob", [
  ...cyc((s) => [
    [s, T("rotate(0deg)")],
    [s + 2, T("rotate(-3deg)")],
    [s + 9, T("rotate(2deg)")],
  ]),
  [60, T("rotate(0deg)")],
  [62, T("rotate(-4deg)")],
  [64, T("rotate(4deg)")],
  [66, T("rotate(-5deg)")],
  [68, T("rotate(5deg) scale(1.02,.96)")],
  [70, T("rotate(-3deg)")],
  [71.5, T("rotate(0deg) scale(1.05,.92)")],
  [73.5, T("scale(.95,1.1)")],
  [76, T("scale(1,1)")],
  [100, T("scale(1,1)")],
])}
${kf("ropefade", [[0, "opacity:1"], [60, "opacity:1"], [62, "opacity:0"], [100, "opacity:0"]])}
${kf("effort", [[0, "opacity:1"], [59.5, "opacity:1"], [60, "opacity:0"], [100, "opacity:0"]])}
${kf("happy", [[0, "opacity:0"], [59.5, "opacity:0"], [60, "opacity:1"], [100, "opacity:1"]])}
${kf("armR", [
  [0, T("rotate(150deg)")],
  [72, T("rotate(150deg)")],
  [74, T("rotate(-15deg)")],
  [76, T("rotate(0deg)")],
  [100, T("rotate(0deg)")],
])}
${kf("armL", [
  [0, T("rotate(-150deg)")],
  [72, T("rotate(-150deg)")],
  [74, T("rotate(15deg)")],
  [76, T("rotate(0deg)")],
  [100, T("rotate(0deg)")],
])}
${kf("flapL", [
  [0, T("rotate(0deg)")],
  [72, T("rotate(0deg)")],
  [74.5, T("rotate(-158deg)")],
  [76.5, T("rotate(-142deg)")],
  [100, T("rotate(-142deg)")],
])}
${kf("flapR", [
  [0, T("rotate(0deg)")],
  [72, T("rotate(0deg)")],
  [74.5, T("rotate(158deg)")],
  [76.5, T("rotate(142deg)")],
  [100, T("rotate(142deg)")],
])}
${kf("facepop", [
  [0, T("scale(0)")],
  [72.5, T("scale(0)")],
  [75, T("scale(1.3)")],
  [77, T("scale(1)")],
  [100, T("scale(1)")],
])}
@keyframes mx-wave{0%{transform:rotate(-8deg)}100%{transform:rotate(14deg)}}
@keyframes mx-sweat{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(6px,26px);opacity:0}}
@keyframes mx-pop{
  0%{opacity:0;transform:translate(0,0) scale(.2)}
  15%{opacity:1}
  60%{transform:translate(calc(var(--dx)*.8),calc(var(--dy) - 45px)) scale(1.12)}
  100%{opacity:1;transform:translate(var(--dx),var(--dy)) scale(1)}
}
@keyframes mx-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-7px) rotate(3deg)}}
@media (prefers-reduced-motion:reduce){
  .mx-banner *{animation-delay:0s!important;animation-duration:.01s!important;animation-iteration-count:1!important}
}
`;

/* ---------- íconos dibujados a mano (centrados en 0,0) ---------- */
function Icon({ type }) {
  const p = "mx-s mx-t";
  switch (type) {
    case "bazar":
      return (
        <g>
          <path className={p} d="M-12 -4 L-12 16 Q0 23 12 16 L12 -4 Z" />
          <path className={p} d="M-4 -4 L-9 -22" />
          <path className={p} d="M2 -4 L5 -25" />
          <path className={p} d="M7 -4 L17 -17" />
          <circle className={p} cx="-9" cy="-24" r="4" />
        </g>
      );
    case "toy":
      return (
        <g>
          <circle className={p} cx="-10" cy="-14" r="5" />
          <circle className={p} cx="10" cy="-14" r="5" />
          <circle className={`${p} mx-w`} cx="0" cy="-6" r="12" />
          <ellipse className={`${p} mx-w`} cx="0" cy="16" rx="12" ry="10" />
          <circle cx="-4" cy="-8" r="1.8" fill="#0b5aa5" />
          <circle cx="4" cy="-8" r="1.8" fill="#0b5aa5" />
        </g>
      );
    case "tech":
      return (
        <g>
          <rect className={p} x="-20" y="-16" width="40" height="26" rx="4" />
          <path className={p} d="M0 10 L0 19 M-10 19 L10 19" />
        </g>
      );
    default:
      return (
        <g>
          <path
            className={p}
            d="M0 -22 Q2 -3 20 0 Q2 3 0 22 Q-2 3 -20 0 Q-2 -3 0 -22Z"
          />
          <path className={p} d="M18 -20 L18 -10 M13 -15 L23 -15" />
        </g>
      );
  }
}

export default function MixshopBanner({
  categories = DEFAULT_CATEGORIES,
  loop = false,
  rough = true,
  className = "",
}) {
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!loop) return;
    const id = setInterval(() => setRun((k) => k + 1), 15000);
    return () => clearInterval(id);
  }, [loop]);

  return (
    <div
      className={`mx-banner ${className}`}
      onClick={() => setRun((k) => k + 1)}
      role="img"
      aria-label="Animación de Mixshop: un muñequito trae una caja que se abre con productos"
    >
      <style>{CSS}</style>
      {/* key = reinicia la animación */}
      <svg key={run} viewBox="0 0 900 340" preserveAspectRatio="xMidYMax meet">
        <defs>
          <filter id="mx-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="1" result="n">
              <animate
                attributeName="seed"
                values="1;4;7;2"
                dur="0.6s"
                repeatCount="indefinite"
                calcMode="discrete"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" />
          </filter>
        </defs>

        <g filter={rough ? "url(#mx-rough)" : undefined}>
          <g transform="translate(740 305)">
            <g className="mx-a mx-walk">
              {/* ================= CAJA ================= */}
              <g transform="translate(-280 0)">
                <ellipse cx="0" cy="2" rx="70" ry="8" fill="#0b5aa5" opacity=".12" />

                {/* objetos (detrás de la caja) */}
                <g transform="translate(0 -80)">
                  {categories.map((c, i) => {
                    const w = c.label.length * 9 + 30;
                    return (
                      <g
                        key={c.label}
                        className="mx-pop"
                        style={{
                          "--dx": `${c.dx}px`,
                          "--dy": `${c.dy}px`,
                          "--d": `${(D * 0.725 + i * 0.14).toFixed(2)}s`,
                        }}
                      >
                        <g className="mx-float" style={{ "--d": `${(D * 0.725 + i * 0.14).toFixed(2)}s` }}>
                          <Icon type={c.icon} />
                          <rect className="mx-pill" x={-w / 2} y="30" width={w} height="28" rx="14" />
                          <text className="mx-txt" x="0" y="49">
                            {c.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>

                <g className="mx-a mx-boxrel">
                  <g className="mx-a mx-boxwob">
                    {/* carita del logo que asoma al abrir */}
                    <g transform="translate(0 -122)">
                      <g className="mx-a mx-facepop">
                        <circle cx="-32" cy="0" r="7" fill="#0b5aa5" />
                        <circle cx="32" cy="0" r="7" fill="#0b5aa5" />
                        <path className="mx-s" d="M-30 16 Q0 46 30 16" />
                      </g>
                    </g>
                    {/* cuerpo */}
                    <rect className="mx-s mx-w" x="-60" y="-70" width="120" height="70" rx="3" />
                    <path className="mx-s mx-t" d="M0 -70 L0 -36" />
                    <path className="mx-s mx-t" d="M-38 -16 L-14 -16" />
                    {/* solapas */}
                    <g transform="translate(-60 -70)">
                      <g className="mx-a mx-flapL">
                        <path className="mx-s mx-w" d="M0 0 L60 0 L60 -22 L12 -22 Z" />
                      </g>
                    </g>
                    <g transform="translate(60 -70)">
                      <g className="mx-a mx-flapR">
                        <path className="mx-s mx-w" d="M0 0 L-60 0 L-60 -22 L-12 -22 Z" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>

              {/* ================= SOGA ================= */}
              <g className="mx-a mx-ropefade">
                <g transform="translate(-31 -100)">
                  <g className="mx-a mx-rope">
                    <path className="mx-s mx-t" d="M0 0 Q-95 40 -187 28" />
                  </g>
                </g>
              </g>

              {/* ================= STICKMAN ================= */}
              <g className="mx-a mx-hop">
                <ellipse cx="0" cy="2" rx="38" ry="7" fill="#0b5aa5" opacity=".12" />

                {/* piernas */}
                <g transform="translate(0 -60)">
                  <g className="mx-a mx-legB">
                    <path className="mx-s" d="M0 0 Q8 28 0 56 L14 58" />
                  </g>
                  <g className="mx-a mx-legA">
                    <path className="mx-s" d="M0 0 Q8 28 0 56 L14 58" />
                  </g>
                </g>

                {/* torso + brazos + cabeza (pivot en la cadera) */}
                <g transform="translate(0 -60)">
                  <g className="mx-a mx-lean">
                    <path className="mx-s" d="M0 0 Q-7 -26 2 -50" />

                    {/* brazos haciendo fuerza */}
                    <g className="mx-a mx-effort">
                      <g transform="translate(2 -44)">
                        <path className="mx-s mx-t" d="M0 0 Q-24 6 -46 18" />
                        <path className="mx-s mx-t" d="M0 0 Q-20 -6 -44 10" />
                        <circle className="mx-s mx-t mx-w" cx="-46" cy="16" r="4" />
                      </g>
                    </g>

                    {/* brazos contentos */}
                    <g className="mx-a mx-happy">
                      <g transform="translate(2 -44)">
                        <g className="mx-a mx-armR">
                          <g className="mx-waveR">
                            <path className="mx-s mx-t" d="M0 0 Q12 -16 18 -36" />
                            <circle className="mx-s mx-t mx-w" cx="18" cy="-38" r="4" />
                          </g>
                        </g>
                        <g className="mx-a mx-armL">
                          <g className="mx-waveL">
                            <path className="mx-s mx-t" d="M0 0 Q-12 -16 -18 -36" />
                            <circle className="mx-s mx-t mx-w" cx="-18" cy="-38" r="4" />
                          </g>
                        </g>
                      </g>
                    </g>

                    {/* cabeza */}
                    <g transform="translate(4 -50)">
                      <g className="mx-a mx-head">
                        <g transform="translate(0 -28)">
                          <circle className="mx-s mx-w" cx="0" cy="0" r="28" />
                          <path className="mx-s mx-t" d="M-2 -28 Q-6 -42 4 -43 Q10 -42 7 -36" />
                          <circle cx="-17" cy="9" r="4.5" fill="#2f5fb3" opacity=".18" />
                          <circle cx="17" cy="9" r="4.5" fill="#2f5fb3" opacity=".18" />

                          {/* cara de esfuerzo */}
                          <g className="mx-a mx-effort">
                            <path className="mx-s mx-t" d="M-16 -6 L-7 -2 L-16 3" />
                            <path className="mx-s mx-t" d="M16 -6 L7 -2 L16 3" />
                            <path className="mx-s mx-t" d="M-8 15 Q-4 10 0 15 Q4 20 8 15" />
                            <g transform="translate(26 -22)">
                              <path className="mx-sweat" d="M0 0 Q5 8 0 12 Q-5 8 0 0Z" fill="#7fb2e5" />
                            </g>
                          </g>

                          {/* cara feliz */}
                          <g className="mx-a mx-happy">
                            <path className="mx-s mx-t" d="M-17 -1 Q-11 -10 -5 -1" />
                            <path className="mx-s mx-t" d="M5 -1 Q11 -10 17 -1" />
                            <path className="mx-s mx-t" d="M-9 10 Q0 24 9 10 Z" fill="#fff" />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}