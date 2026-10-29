import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Prenda } from '../../interfaces/product.interface';

let nextUid = 0;

interface Art {
  body: string;
  detail: string;
  hanger: string;
}

const HOOK = 'M100 30 V18 a7 7 0 1 0 -7 -7';
const HANGER_WIDE = `${HOOK} M100 30 L38 62 M100 30 L162 62`;
const HANGER_NARROW = `${HOOK} M100 30 L72 56 M100 30 L128 56`;
const HANGER_CLIP = `${HOOK} M100 30 V54 M54 54 H146`;

/** Siluetas provisionales (viewBox 200×300, hombros en y=62). Se sustituirán por los renders reales del paso 8. */
const ART: Record<Prenda, Art> = {
  camisas: {
    hanger: HANGER_WIDE,
    body: 'M72 62 L100 76 L128 62 L170 84 L190 214 L166 218 L152 136 L152 266 L48 266 L48 136 L34 218 L10 214 L30 84 Z',
    detail: 'M82 62 L100 86 L118 62 M100 86 V266 M48 260 H152',
  },
  camisetas: {
    hanger: HANGER_WIDE,
    body: 'M74 62 Q100 84 126 62 L172 84 L188 134 L160 146 L152 126 L152 240 L48 240 L48 126 L40 146 L12 134 L28 84 Z',
    detail: 'M74 62 Q100 84 126 62 M48 232 H152',
  },
  sudaderas: {
    hanger: HANGER_WIDE,
    body: 'M70 62 L100 74 L130 62 L172 86 L192 236 L164 242 L152 150 L156 258 L44 258 L48 150 L36 242 L8 236 L28 86 Z',
    detail: 'M72 62 Q100 40 128 62 Q100 98 72 62 Z M64 196 H136 L144 236 H56 Z M44 250 H156',
  },
  chaquetas: {
    hanger: HANGER_WIDE,
    body: 'M70 62 L100 70 L130 62 L172 86 L190 222 L164 228 L152 140 L154 252 L46 252 L48 140 L36 228 L10 222 L28 86 Z',
    detail: 'M70 62 L82 78 L100 70 L118 78 L130 62 M100 70 V252 M60 190 H78 M122 190 H140',
  },
  abrigos: {
    hanger: HANGER_WIDE,
    body: 'M68 62 L100 78 L132 62 L172 88 L192 240 L166 246 L152 146 L158 292 L42 292 L48 146 L34 246 L8 240 L28 88 Z',
    detail: 'M68 62 L84 112 L100 78 L116 112 L132 62 M100 78 V292',
  },
  vestidos: {
    hanger: HANGER_NARROW,
    body: 'M80 62 L86 98 Q68 114 64 134 L34 292 L166 292 L136 134 Q132 114 114 98 L120 62 L110 62 L106 90 Q100 96 94 90 L90 62 Z',
    detail: 'M64 134 Q100 146 136 134 M34 286 Q100 296 166 286',
  },
  pantalones: {
    hanger: HANGER_CLIP,
    body: 'M54 62 H146 L156 292 H108 L100 128 L92 292 H44 Z',
    detail: 'M54 74 H146 M100 74 V128 M62 80 L74 108 M138 80 L126 108',
  },
};

@Component({
  selector: 'app-garment-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    svg { display: block; width: 100%; height: auto; overflow: visible; filter: drop-shadow(0 16px 14px rgb(80 110 170 / 0.22)); }
    .hanger, .detail { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .hanger { stroke: #8a8a8a; stroke-width: 1.6; }
    .body { stroke: rgb(15 15 16 / 0.28); stroke-width: 1; stroke-linejoin: round; }
    .detail { stroke: rgb(15 15 16 / 0.22); stroke-width: 1; }
  `,
  template: `
    <svg viewBox="0 0 200 300" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient [attr.id]="gid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="0.45" />
          <stop offset="0.55" stop-color="#fff" stop-opacity="0" />
          <stop offset="1" stop-color="#0f0f10" stop-opacity="0.16" />
        </linearGradient>
      </defs>
      <path class="hanger" [attr.d]="art().hanger" />
      <path class="body" [attr.d]="art().body" [attr.fill]="color()" />
      <path [attr.d]="art().body" [attr.fill]="'url(#' + gid + ')'" />
      <path class="detail" [attr.d]="art().detail" />
    </svg>
  `,
})
export class GarmentArtComponent {
  readonly prenda = input.required<Prenda>();
  readonly color = input('#fafafa');

  protected readonly gid = `ga-${nextUid++}`;
  protected art(): Art {
    return ART[this.prenda()];
  }
}