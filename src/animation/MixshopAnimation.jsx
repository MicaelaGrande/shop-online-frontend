import { useEffect, useState } from 'react';

/**
 * MixshopBanner
 * Un muñequito se asoma por el borde izquierdo, se da cuenta de que llegó alguien (¡!)
 * y lo saluda; se va a buscar una caja y vuelve EMPUJÁNDOLA. Al llegar queda cansado
 * (se inclina y se limpia el sudor); la caja se mueve y se sorprende; la caja se abre y
 * se pone feliz: se da vuelta (queda de frente), festeja y salen los objetos.
 *
 * Props:
 *  - categories: [{ label, icon: "bazar"|"toy"|"tech"|"star", dx, dy }]
 *  - loop: repite la animación cada 15s
 *  - rough: efecto "línea temblorosa" de dibujo a mano (SVG filter)
 *  - className: clase extra para el contenedor
 *  - buttonLabel: texto del botón de abajo (por defecto "¡Ver todo!")
 *  - href: link del botón (si no se pasa, se renderiza un <button>)
 *  - onButtonClick: función al hacer click en el botón
 * Click sobre el banner = repetir la animación.
 */

const DEFAULT_CATEGORIES = [
  { label: '¿Bazar?', icon: 'bazar', dx: -320, dy: -100 },
  { label: '¿Juguetería?', icon: 'toy', dx: -120, dy: -185 },
  { label: '¿Electrónica?', icon: 'tech', dx: 55, dy: -175 },
  { label: '¡Y mucho más!', icon: 'star', dx: 220, dy: -85 }
];

/* ---------- línea de tiempo ---------- */
const D = 11; // duración total en segundos (más chico = más rápido)
const P0 = 24; // % del tiempo que dura la asomada inicial
const mp = (p) => P0 + (p * (100 - P0)) / 100; // % de la animación principal -> % total
const at = (p) => (mp(p) / 100) * D; // segundo en que ocurre el % p de la animación principal

const T = (v) => `transform:${v}`;
const TO = (o, v) => `opacity:${o};transform:${v}`;
const fr = (a) =>
  [...a]
    .sort((x, y) => x[0] - y[0])
    .map(([p, v]) => `${p}%{${v}}`)
    .join('');
const kfRaw = (name, arr) => `@keyframes mx-${name}{${fr(arr)}}`;
// kf = animación principal (empieza recién cuando termina la asomada)
const kf = (name, arr) => {
  const sorted = [...arr].sort((x, y) => x[0] - y[0]);
  const first = sorted[0][1].replace(/animation-timing-function:[^;]+;/, '');
  return kfRaw(name, [[0, first], ...sorted.map(([p, v]) => [+mp(p).toFixed(3), v])]);
};
const cyc = (fn) => [0, 6, 12, 18, 24, 30, 36].flatMap(fn); // pasos mientras camina (0–40%)
const EASE = 'animation-timing-function:cubic-bezier(.25,.55,.45,1);';
const bw = (r, sx, sy) => T(`rotate(${r}deg) scale(${sx},${sy})`);
const R = (deg) => T(`rotate(${deg}deg)`);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap');
.mx-wrap{width:100%}
.mx-banner{width:100%;position:relative;overflow:hidden;cursor:pointer}
.mx-banner svg{display:block;width:100%;height:auto}
.mx-cta{display:flex;justify-content:center;padding:6px 0 18px;animation:mx-ctain .5s ease-out both;animation-delay:${at(78).toFixed(2)}s}
.mx-btn{font-family:'Gochi Hand','Patrick Hand','Comic Sans MS',cursive;font-size:26px;line-height:1;color:#fff;background:#0b5aa5;border:3px solid #0b5aa5;border-radius:999px;padding:10px 38px 12px;cursor:pointer;text-decoration:none;display:inline-block;box-shadow:0 5px 0 #083f75;transition:transform .15s,box-shadow .15s}
.mx-btn:hover{transform:translateY(-2px);box-shadow:0 7px 0 #083f75}
.mx-btn:active{transform:translateY(4px);box-shadow:0 1px 0 #083f75}
.mx-btn:focus-visible{outline:3px solid #7fb2e5;outline-offset:3px}
@keyframes mx-ctain{0%{opacity:0;transform:translateY(12px) scale(.9)}70%{transform:translateY(-2px) scale(1.04)}100%{opacity:1;transform:translateY(0) scale(1)}}
.mx-s{fill:none;stroke:#0b5aa5;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
.mx-t{stroke-width:4}
.mx-b{fill:none;stroke:#0b5aa5;stroke-width:15;stroke-linecap:round;stroke-linejoin:round}
.mx-w{fill:#fff}
.mx-txt{font-family:'Gochi Hand','Patrick Hand','Comic Sans MS',cursive;font-weight:400;font-size:21px;fill:#0b5aa5;text-anchor:middle}
.mx-pill{fill:#eaf0fb;stroke:#2f5fb3;stroke-width:2.5}
.mx-a{animation-duration:${D}s;animation-fill-mode:both;animation-timing-function:ease-in-out}
.mx-walk{animation-name:mx-walk}.mx-step{animation-name:mx-step}.mx-hop{animation-name:mx-hop}
.mx-legA{animation-name:mx-legA}.mx-legB{animation-name:mx-legB}
.mx-lean{animation-name:mx-lean}.mx-head{animation-name:mx-head}.mx-headf{animation-name:mx-headf}
.mx-boxwob{animation-name:mx-boxwob}
.mx-turnside{animation-name:mx-turnside}.mx-turnfront{animation-name:mx-turnfront}
.mx-armR{animation-name:mx-armR}.mx-armL{animation-name:mx-armL}
.mx-closed{animation-name:mx-closed}.mx-open{animation-name:mx-open}.mx-facepop{animation-name:mx-facepop}
.mx-peek{animation-name:mx-peek}.mx-ptilt{animation-name:mx-ptilt}
.mx-pa{animation-name:mx-pa}.mx-pb{animation-name:mx-pb}.mx-pc{animation-name:mx-pc}.mx-parm{animation-name:mx-parm}.mx-pbang{animation-name:mx-pbang}
.mx-armpush{animation-name:mx-armpush}.mx-armtired{animation-name:mx-armtired}.mx-knee{animation-name:mx-knee}.mx-wipe{animation-name:mx-wipe}
.mx-fe{animation-name:mx-fe}.mx-ft{animation-name:mx-ft}.mx-fs{animation-name:mx-fs}.mx-fh{animation-name:mx-fh}.mx-sweatvis{animation-name:mx-sweatvis}
.mx-pwv{animation:mx-wave .35s ease-in-out infinite alternate;animation-delay:${((D * 18.5) / 100).toFixed(2)}s}
.mx-waveR{animation:mx-wave .6s ease-in-out infinite alternate;animation-delay:${at(80).toFixed(2)}s}
.mx-waveL{animation:mx-wave .6s ease-in-out infinite alternate-reverse;animation-delay:${at(80).toFixed(2)}s}
.mx-sweat{animation:mx-sweat .8s ease-in infinite}
.mx-pop{animation:mx-pop .95s cubic-bezier(.2,.8,.3,1) both;animation-delay:var(--d)}
.mx-float{animation:mx-bob 2.8s ease-in-out infinite;animation-delay:calc(var(--d) + 1.2s)}

/* ---- asomada inicial (% del tiempo total) ---- */
${kfRaw('peek', [
  [0, T('translateX(-90px)')],
  [3, T('translateX(-90px)')],
  [7, T('translateX(0px)')],
  [8, T('translateX(10px)')],
  [9.5, T('translateX(0px)')],
  [19, T('translateX(0px)')],
  [22, T('translateX(-90px)')],
  [100, T('translateX(-90px)')]
])}
${kfRaw('ptilt', [
  [0, R(0)],
  [7, R(0)],
  [8, R(-9)],
  [10, R(0)],
  [14, R(4)],
  [17, R(-3)],
  [19, R(0)],
  [100, R(0)]
])}
${kfRaw('pa', [
  [0, 'opacity:1'],
  [7.4, 'opacity:1'],
  [7.5, 'opacity:0'],
  [100, 'opacity:0']
])}
${kfRaw('pc', [
  [0, 'opacity:0'],
  [7.4, 'opacity:0'],
  [7.5, 'opacity:1'],
  [11.9, 'opacity:1'],
  [12, 'opacity:0'],
  [100, 'opacity:0']
])}
${kfRaw('pb', [
  [0, 'opacity:0'],
  [11.9, 'opacity:0'],
  [12, 'opacity:1'],
  [100, 'opacity:1']
])}
${kfRaw('pbang', [
  [0, T('scale(0)')],
  [7.4, T('scale(0)')],
  [8.3, T('scale(1.35)')],
  [9.5, T('scale(1)')],
  [19, T('scale(1)')],
  [20, T('scale(0)')],
  [100, T('scale(0)')]
])}
${kfRaw('parm', [
  [0, R(35)],
  [12, R(35)],
  [13.5, R(-35)],
  [100, R(-35)]
])}

/* ---- animación principal (% de la parte posterior a la asomada) ---- */
${kf('walk', [
  [0, `${EASE}${T('translateX(-900px)')}`],
  [40, T('translateX(0px)')],
  [100, T('translateX(0px)')]
])}
/* al llegar retrocede un paso para tomar aire; con el susto retrocede otro */
${kf('step', [
  [0, T('translateX(0px)')],
  [40, T('translateX(0px)')],
  [43, T('translateX(-24px)')],
  [56, T('translateX(-24px)')],
  [58, T('translateX(-34px)')],
  [100, T('translateX(-34px)')]
])}
${kf('legA', [
  ...cyc((s) => [
    [s, R(-18)],
    [s + 3, R(34)]
  ]),
  [41, R(2)],
  [43, R(10)],
  [56, R(10)],
  [57, R(-20)],
  [58, R(14)],
  [100, R(14)]
])}
${kf('legB', [
  ...cyc((s) => [
    [s, R(34)],
    [s + 3, R(-18)]
  ]),
  [41, R(14)],
  [43, R(22)],
  [56, R(22)],
  [57, R(30)],
  [58, R(8)],
  [100, R(8)]
])}
/* torso: empuja inclinado; cansado se encorva y respira; con el susto se endereza */
${kf('lean', [
  ...cyc((s) => [
    [s, R(29)],
    [s + 3, R(32)]
  ]),
  [41, R(31)],
  [43, R(48)],
  [46, R(53)],
  [49, R(48)],
  [52, R(53)],
  [55, R(48)],
  [56.5, R(6)],
  [69, R(8)],
  [70.8, R(10)],
  [100, R(10)]
])}
${kf('head', [
  ...cyc((s) => [
    [s, R(-4)],
    [s + 3, R(4)]
  ]),
  [41, R(0)],
  [43, R(16)],
  [55, R(16)],
  [56.5, R(-8)],
  [69, R(0)],
  [100, R(0)]
])}
${kf('headf', [
  [0, R(0)],
  [77.5, R(0)],
  [79, R(-8)],
  [81, R(6)],
  [84, R(0)],
  [100, R(0)]
])}
/* brazos: empujando -> cansado (uno cuelga, el otro se limpia la frente) -> manos arriba del susto */
${kf('armpush', [
  [0, 'opacity:1'],
  [40.9, 'opacity:1'],
  [41, 'opacity:0'],
  [100, 'opacity:0']
])}
${kf('armtired', [
  [0, 'opacity:0'],
  [40.9, 'opacity:0'],
  [41, 'opacity:1'],
  [100, 'opacity:1']
])}
${kf('knee', [
  [0, R(0)],
  [56, R(0)],
  [57, R(-150)],
  [100, R(-150)]
])}
${kf('wipe', [
  [0, R(0)],
  [44, R(0)],
  [45, R(-14)],
  [46.5, R(10)],
  [48, R(-14)],
  [49.5, R(10)],
  [51, R(-14)],
  [52.5, R(10)],
  [54, R(0)],
  [56, R(0)],
  [57, R(-20)],
  [100, R(-20)]
])}
/* caras de perfil: esfuerzo -> cansado -> sorprendido -> feliz */
${kf('fe', [
  [0, 'opacity:1'],
  [40.9, 'opacity:1'],
  [41, 'opacity:0'],
  [100, 'opacity:0']
])}
${kf('ft', [
  [0, 'opacity:0'],
  [40.9, 'opacity:0'],
  [41, 'opacity:1'],
  [56.4, 'opacity:1'],
  [56.5, 'opacity:0'],
  [100, 'opacity:0']
])}
${kf('fs', [
  [0, 'opacity:0'],
  [56.4, 'opacity:0'],
  [56.5, 'opacity:1'],
  [68.9, 'opacity:1'],
  [69, 'opacity:0'],
  [100, 'opacity:0']
])}
${kf('fh', [
  [0, 'opacity:0'],
  [68.9, 'opacity:0'],
  [69, 'opacity:1'],
  [100, 'opacity:1']
])}
${kf('sweatvis', [
  [0, 'opacity:1'],
  [46, 'opacity:1'],
  [47, 'opacity:0'],
  [100, 'opacity:0']
])}
/* girar: el de perfil se achata y el de frente se abre */
${kf('turnside', [
  [0, TO(1, 'scaleX(1)')],
  [69.5, TO(1, 'scaleX(1)')],
  [71, TO(1, 'scaleX(0)')],
  [71.1, TO(0, 'scaleX(0)')],
  [100, TO(0, 'scaleX(0)')]
])}
${kf('turnfront', [
  [0, TO(0, 'scaleX(0)')],
  [71, TO(0, 'scaleX(0)')],
  [71.1, TO(1, 'scaleX(0)')],
  [73, TO(1, 'scaleX(1.08)')],
  [74.5, TO(1, 'scaleX(1)')],
  [100, TO(1, 'scaleX(1)')]
])}
${kf('hop', [
  [0, T('translateY(0)')],
  [55.5, T('translateY(0)')],
  [56.5, T('translateY(-26px)')],
  [58, T('translateY(0)')],
  [75.5, T('translateY(0)')],
  [77, T('translateY(-30px)')],
  [78.5, T('translateY(0)')],
  [80.5, T('translateY(-22px)')],
  [82, T('translateY(0)')],
  [100, T('translateY(0)')]
])}
/* caja: vibra al empujar, se mueve sola (susto) y se abre */
${kf('boxwob', [
  ...cyc((s) => [
    [s, bw(0, 1, 1)],
    [s + 3, bw(-1, 1, 1)]
  ]),
  [40, bw(0, 1, 1)],
  [55, bw(0, 1, 1)],
  ...Array.from({ length: 13 }, (_, i) => {
    const a = 2 + i * 0.4;
    return [56.5 + i, bw(i % 2 ? a : -a, 1 + i * 0.004, 1 - i * 0.006)];
  }),
  [69.2, bw(0, 1, 1)],
  [100, bw(0, 1, 1)]
])}
${kf('closed', [
  [0, 'opacity:1'],
  [68.99, 'opacity:1'],
  [69, 'opacity:0'],
  [100, 'opacity:0']
])}
${kf('open', [
  [0, TO(0, 'scale(.7,.7)')],
  [68.99, TO(0, 'scale(.7,.7)')],
  [69, TO(1, 'scale(.7,.7)')],
  [70.5, TO(1, 'scale(1.08,.9)')],
  [72, TO(1, 'scale(.97,1.06)')],
  [73.5, TO(1, 'scale(1,1)')],
  [100, TO(1, 'scale(1,1)')]
])}
${kf('facepop', [
  [0, T('scale(0)')],
  [71, T('scale(0)')],
  [73, T('scale(1.3)')],
  [75, T('scale(1)')],
  [100, T('scale(1)')]
])}
${kf('armR', [
  [0, R(140)],
  [77.5, R(140)],
  [79, R(-15)],
  [80.5, R(0)],
  [100, R(0)]
])}
${kf('armL', [
  [0, R(-140)],
  [77.5, R(-140)],
  [79, R(15)],
  [80.5, R(0)],
  [100, R(0)]
])}
@keyframes mx-wave{0%{transform:rotate(-8deg)}100%{transform:rotate(14deg)}}
@keyframes mx-sweat{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(-6px,26px);opacity:0}}
@keyframes mx-pop{
  0%{opacity:0;transform:translate(0,0) scale(.2)}
  15%{opacity:1}
  60%{transform:translate(calc(var(--dx)*.8),calc(var(--dy) - 45px)) scale(1.12)}
  100%{opacity:1;transform:translate(var(--dx),var(--dy)) scale(1)}
}
@keyframes mx-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-7px) rotate(3deg)}}
@media (prefers-reduced-motion:reduce){
  .mx-banner *,.mx-cta{animation-delay:0s!important;animation-duration:.01s!important;animation-iteration-count:1!important}
}
`;

/* ---------- íconos dibujados a mano (centrados en 0,0) ---------- */
function Icon({ type }) {
  const p = 'mx-s mx-t';
  switch (type) {
    case 'bazar':
      return (
        <g>
          <path className={p} d="M-12 -4 L-12 16 Q0 23 12 16 L12 -4 Z" />
          <path className={p} d="M-4 -4 L-9 -22" />
          <path className={p} d="M2 -4 L5 -25" />
          <path className={p} d="M7 -4 L17 -17" />
          <circle className={p} cx="-9" cy="-24" r="4" />
        </g>
      );
    case 'toy':
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
    case 'tech':
      return (
        <g>
          <rect className={p} x="-20" y="-16" width="40" height="26" rx="4" />
          <path className={p} d="M0 10 L0 19 M-10 19 L10 19" />
        </g>
      );
    default:
      return (
        <g>
          <path className={p} d="M0 -22 Q2 -3 20 0 Q2 3 0 22 Q-2 3 -20 0 Q-2 -3 0 -22Z" />
          <path className={p} d="M18 -20 L18 -10 M13 -15 L23 -15" />
        </g>
      );
  }
}

/* Caja: se dibuja en las coordenadas del logo (500x500) y se escala.
   Origen local = vértice inferior central de la caja (apoyado en el suelo). */
const BOX = 'scale(.46) translate(-245 -450)';

function Box() {
  return (
    <g className="mx-a mx-boxwob">
      {/* CERRADA */}
      <g className="mx-a mx-closed">
        <g transform={BOX}>
          <path className="mx-b mx-w" d="M75 250 L75 385 L245 450 L245 320 Z" />
          <path className="mx-b mx-w" d="M415 250 L415 385 L245 450 L245 320 Z" />
          <path className="mx-b mx-w" d="M75 250 L245 180 L415 250 L245 320 Z" />
          <path className="mx-b" d="M160 285 L330 215" />
          <path className="mx-b" d="M105 322 L155 341" />
        </g>
      </g>

      {/* ABIERTA (igual al ícono) */}
      <g className="mx-a mx-open">
        <g transform={BOX}>
          <path fill="#fff" d="M75 280 L245 255 L415 280 L415 385 L245 450 L75 385 Z" />
          <path className="mx-b" d="M75 280 L75 385 L245 450 L415 385 L415 280" />
          <path className="mx-b" d="M245 255 L245 450" />
          <path className="mx-b" d="M80 190 L135 173" />
          <path className="mx-b" d="M355 173 L410 190" />
          <path className="mx-b mx-w" d="M30 265 L85 195 L245 255 L205 330 Z" />
          <path className="mx-b mx-w" d="M460 265 L405 195 L245 255 L285 330 Z" />
          {/* carita del logo: aparece cuando el muñeco sale */}
          <g transform="translate(245 130)">
            <g className="mx-a mx-facepop">
              <g transform="translate(-245 -130)">
                <circle cx="188" cy="85" r="22" fill="#0b5aa5" />
                <circle cx="302" cy="85" r="22" fill="#0b5aa5" />
                <path className="mx-b" d="M160 148 Q245 232 330 148" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

export default function MixshopBanner({
  categories = DEFAULT_CATEGORIES,
  loop = false,
  rough = false,
  className = '',
  buttonLabel = '¡Ver todo!',
  href,
  onButtonClick,
  onComplete
}) {
  const [run, setRun] = useState(0);
  useEffect(() => {
    const timer = window.setTimeout(() => onComplete?.(), D * 1000);
    return () => window.clearTimeout(timer);
  }, [run, onComplete]);

  useEffect(() => {
    if (!loop) return;
    const id = setInterval(() => setRun((k) => k + 1), 15000);
    return () => clearInterval(id);
  }, [loop]);

  return (
    <div className={`mx-wrap ${className}`}>
      <style>{CSS}</style>
      <div
        className="mx-banner"
        onClick={() => setRun((k) => k + 1)}
        role="img"
        aria-label="Animación de Mixshop: un muñequito se asoma, saluda, trae una caja cansado, se sorprende cuando se mueve y se pone feliz cuando se abre con productos"
      >
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

          <g filter={rough ? 'url(#mx-rough)' : undefined}>
            {/* ================= SUELO ================= */}
            <path className="mx-s mx-t" d="M0 307 Q150 302 300 307 T600 307 T900 305" />
            <path
              className="mx-s mx-t"
              opacity=".45"
              d="M50 322 L72 322 M190 326 L222 326 M410 322 L428 322 M630 326 L662 326 M820 322 L844 322"
            />

            {/* ================= ASOMADA (¡!, y después saluda) ================= */}
            <g transform="translate(0 175) scale(1.5)">
              <g className="mx-a mx-peek">
                {/* cuello y hombro que se pierden por el borde */}
                <path className="mx-s" d="M24 27 Q20 40 12 48 L-30 54" />
                {/* brazo que saluda */}
                <g transform="translate(12 48)">
                  <g className="mx-a mx-parm">
                    <g className="mx-pwv">
                      <path className="mx-s mx-t" d="M0 0 Q37 11 64 -15" />
                      <circle className="mx-s mx-t mx-w" cx="64" cy="-17" r="4" />
                    </g>
                  </g>
                </g>
                {/* cabeza */}
                <g transform="translate(20 0)">
                  <g className="mx-a mx-ptilt">
                    <circle className="mx-s mx-w" cx="0" cy="0" r="28" />
                    <path className="mx-s mx-t" d="M-2 -28 Q-6 -42 4 -43 Q10 -42 7 -36" />
                    <circle cx="-14" cy="10" r="4.5" fill="#2f5fb3" opacity=".18" />
                    <circle cx="20" cy="10" r="4.5" fill="#2f5fb3" opacity=".18" />
                    {/* llega con cara tranquila */}
                    <g className="mx-a mx-pa">
                      <g>
                        <circle cx="-6" cy="-2" r="4" fill="#0b5aa5" />
                        <circle cx="14" cy="-2" r="4" fill="#0b5aa5" />
                      </g>
                      <path className="mx-s mx-t" d="M-4 14 Q4 19 12 14" />
                    </g>
                    {/* se dio cuenta: ¡alguien llegó! */}
                    <g className="mx-a mx-pc">
                      <circle cx="-6" cy="-2" r="5.5" fill="#0b5aa5" />
                      <circle cx="14" cy="-2" r="5.5" fill="#0b5aa5" />
                      <path className="mx-s mx-t" d="M-13 -13 Q-6 -19 1 -13" />
                      <path className="mx-s mx-t" d="M7 -13 Q14 -19 21 -13" />
                      <ellipse className="mx-s mx-t mx-w" cx="4" cy="16" rx="4.5" ry="6" />
                    </g>
                    {/* contento: saluda */}
                    <g className="mx-a mx-pb">
                      <path className="mx-s mx-t" d="M-12 0 Q-6 -9 0 0" />
                      <path className="mx-s mx-t" d="M8 0 Q14 -9 20 0" />
                      <path className="mx-s mx-t mx-w" d="M-4 10 Q4 24 12 10 Z" />
                    </g>
                  </g>
                </g>
                {/* signo de exclamación */}
                <g transform="translate(58 -42)">
                  <g className="mx-a mx-pbang">
                    <path className="mx-s" d="M0 -18 L0 3" />
                    <circle cx="0" cy="14" r="3.8" fill="#0b5aa5" />
                    <path className="mx-s mx-t" d="M-13 -9 L-21 -14 M13 -9 L21 -14" />
                  </g>
                </g>
              </g>
            </g>

            <g transform="translate(330 305)">
              <g className="mx-a mx-walk">
                {/* ================= CAJA ================= */}
                <g transform="translate(160 6)">
                  <ellipse cx="0" cy="3" rx="98" ry="10" fill="#0b5aa5" opacity=".12" />

                  {/* objetos (salen cuando se abre la caja) */}
                  <g transform="translate(0 -80)">
                    {categories.map((c, i) => {
                      const w = c.label.length * 10 + 30;
                      const d = `${(at(69) + i * 0.14).toFixed(2)}s`;
                      return (
                        <g
                          key={c.label}
                          className="mx-pop"
                          style={{ '--dx': `${c.dx}px`, '--dy': `${c.dy}px`, '--d': d }}
                        >
                          <g className="mx-float" style={{ '--d': d }}>
                            <Icon type={c.icon} />
                            <rect className="mx-pill" x={-w / 2} y="30" width={w} height="32" rx="16" />
                            <text className="mx-txt" x="0" y="53">
                              {c.label}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>

                  <Box />
                </g>

                {/* ================= MUÑECO ================= */}
                <g className="mx-a mx-hop">
                  <g className="mx-a mx-step">
                    <ellipse cx="6" cy="3" rx="40" ry="7" fill="#0b5aa5" opacity=".12" />

                    {/* ---------- DE PERFIL (empuja, se cansa, se sorprende) ---------- */}
                    <g className="mx-a mx-turnside">
                      <g transform="translate(0 -60)">
                        <g className="mx-a mx-legB">
                          <path className="mx-s" d="M0 0 Q8 28 0 56 L14 58" />
                        </g>
                        <g className="mx-a mx-legA">
                          <path className="mx-s" d="M0 0 Q8 28 0 56 L14 58" />
                        </g>
                      </g>

                      <g transform="translate(0 -60)">
                        <g className="mx-a mx-lean">
                          <path className="mx-s" d="M0 0 Q-7 -26 2 -50" />

                          {/* brazos empujando la caja */}
                          <g className="mx-a mx-armpush">
                            <g transform="translate(2 -46)">
                              <path className="mx-s mx-t" d="M0 0 Q36 0 71 15" />
                              <circle className="mx-s mx-t mx-w" cx="71" cy="15" r="4" />
                              <path className="mx-s mx-t" d="M0 0 Q30 10 63 26" />
                              <circle className="mx-s mx-t mx-w" cx="63" cy="26" r="4" />
                            </g>
                          </g>

                          {/* brazos cansado: uno cuelga hacia la rodilla, el otro se limpia la frente */}
                          <g className="mx-a mx-armtired">
                            <g transform="translate(2 -46)">
                              <g className="mx-a mx-knee">
                                <path className="mx-s mx-t" d="M0 0 Q14 26 24 58" />
                                <circle className="mx-s mx-t mx-w" cx="24" cy="60" r="4" />
                              </g>
                              <g className="mx-a mx-wipe">
                                <path className="mx-s mx-t" d="M0 0 Q30 -4 22 -40" />
                                <circle className="mx-s mx-t mx-w" cx="22" cy="-42" r="4" />
                              </g>
                            </g>
                          </g>

                          <g transform="translate(4 -50)">
                            <g className="mx-a mx-head">
                              <g transform="translate(0 -28)">
                                <circle className="mx-s mx-w" cx="0" cy="0" r="28" />
                                <path className="mx-s mx-t" d="M-2 -28 Q-6 -42 4 -43 Q10 -42 7 -36" />
                                <g transform="translate(7 0)">
                                  <circle cx="-17" cy="9" r="4.5" fill="#2f5fb3" opacity=".18" />
                                  <circle cx="17" cy="9" r="4.5" fill="#2f5fb3" opacity=".18" />
                                  {/* esfuerzo */}
                                  <g className="mx-a mx-fe">
                                    <path className="mx-s mx-t" d="M-16 -6 L-7 -2 L-16 3" />
                                    <path className="mx-s mx-t" d="M16 -6 L7 -2 L16 3" />
                                    <path className="mx-s mx-t" d="M-8 15 Q-4 10 0 15 Q4 20 8 15" />
                                  </g>
                                  {/* cansado */}
                                  <g className="mx-a mx-ft">
                                    <path className="mx-s mx-t" d="M-18 -1 L-8 2" />
                                    <path className="mx-s mx-t" d="M18 -1 L8 2" />
                                    <ellipse className="mx-s mx-t mx-w" cx="0" cy="16" rx="4" ry="3" />
                                  </g>
                                  {/* sorprendido */}
                                  <g className="mx-a mx-fs">
                                    <circle cx="-11" cy="-2" r="5" fill="#0b5aa5" />
                                    <circle cx="11" cy="-2" r="5" fill="#0b5aa5" />
                                    <path className="mx-s mx-t" d="M-19 -13 Q-12 -19 -5 -13" />
                                    <path className="mx-s mx-t" d="M5 -13 Q12 -19 19 -13" />
                                    <ellipse className="mx-s mx-t mx-w" cx="0" cy="16" rx="4.5" ry="6" />
                                  </g>
                                  {/* feliz */}
                                  <g className="mx-a mx-fh">
                                    <path className="mx-s mx-t" d="M-17 -1 Q-11 -10 -5 -1" />
                                    <path className="mx-s mx-t" d="M5 -1 Q11 -10 17 -1" />
                                    <path className="mx-s mx-t mx-w" d="M-9 10 Q0 24 9 10 Z" />
                                  </g>
                                </g>
                                <g className="mx-a mx-sweatvis">
                                  <g transform="translate(-22 -20)">
                                    <path className="mx-sweat" d="M0 0 Q5 8 0 12 Q-5 8 0 0Z" fill="#7fb2e5" />
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>

                    {/* ---------- DE FRENTE (feliz, festeja) ---------- */}
                    <g className="mx-a mx-turnfront">
                      <path className="mx-s" d="M-3 -60 Q-10 -30 -16 -3 L-29 -1" />
                      <path className="mx-s" d="M3 -60 Q10 -30 16 -3 L29 -1" />
                      <path className="mx-s" d="M0 -60 Q-3 -84 0 -108" />

                      <g transform="translate(0 -102)">
                        <g className="mx-a mx-armR">
                          <g className="mx-waveR">
                            <path className="mx-s mx-t" d="M0 0 Q14 -18 24 -44" />
                            <circle className="mx-s mx-t mx-w" cx="24" cy="-46" r="4" />
                          </g>
                        </g>
                        <g className="mx-a mx-armL">
                          <g className="mx-waveL">
                            <path className="mx-s mx-t" d="M0 0 Q-14 -18 -24 -44" />
                            <circle className="mx-s mx-t mx-w" cx="-24" cy="-46" r="4" />
                          </g>
                        </g>
                      </g>

                      <g transform="translate(0 -108)">
                        <g className="mx-a mx-headf">
                          <g transform="translate(0 -28)">
                            <circle className="mx-s mx-w" cx="0" cy="0" r="28" />
                            <path className="mx-s mx-t" d="M-2 -28 Q-6 -42 4 -43 Q10 -42 7 -36" />
                            <circle cx="-17" cy="9" r="4.5" fill="#2f5fb3" opacity=".18" />
                            <circle cx="17" cy="9" r="4.5" fill="#2f5fb3" opacity=".18" />
                            <path className="mx-s mx-t" d="M-17 -1 Q-11 -10 -5 -1" />
                            <path className="mx-s mx-t" d="M5 -1 Q11 -10 17 -1" />
                            <path className="mx-s mx-t mx-w" d="M-9 10 Q0 24 9 10 Z" />
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

      {/* key = el botón vuelve a aparecer cuando se repite la animación */}
      <div className="mx-cta" key={`cta-${run}`}>
        {href ? (
          <a className="mx-btn" href={href} onClick={onButtonClick}>
            {buttonLabel}
          </a>
        ) : (
          <button type="button" className="mx-btn" onClick={onButtonClick}>
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
