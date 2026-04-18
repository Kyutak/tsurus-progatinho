// SVG do tsuru (origami de papel) — renderizado como string para usar em Matter.Bodies
// e também como componente React. Cor controlada via fill currentColor.

export const TSURU_SVG_PATH = `
  M50 80
  C 40 70, 30 60, 25 45
  L 50 30
  L 75 45
  C 70 60, 60 70, 50 80 Z
`;

export function tsuruSvgString(color: string, size = 36) {
  // Origami estilizado — corpo + asas + bico + cauda
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <!-- corpo -->
  <polygon points="50,55 30,70 50,75 70,70" fill="url(#g)" stroke="${color}" stroke-width="1" stroke-opacity="0.5"/>
  <!-- asa esquerda -->
  <polygon points="50,55 15,40 35,60" fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="1" stroke-opacity="0.6"/>
  <!-- asa direita -->
  <polygon points="50,55 85,40 65,60" fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="1" stroke-opacity="0.6"/>
  <!-- pescoço/bico -->
  <polygon points="50,55 55,30 60,32 52,58" fill="${color}" stroke="${color}" stroke-width="1" stroke-opacity="0.6"/>
  <!-- cauda -->
  <polygon points="50,55 45,75 55,75" fill="${color}" fill-opacity="0.7" stroke="${color}" stroke-width="1" stroke-opacity="0.5"/>
</svg>`.trim();
}

export function tsuruDataUrl(color: string, size = 36) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(tsuruSvgString(color, size))}`;
}
