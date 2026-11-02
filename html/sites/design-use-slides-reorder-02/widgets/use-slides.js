// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-reorder-02',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-slides/office',
  design: {
    railWidth: 238,
    compactRailWidth: 200,
    inspectorWidth: 318,
    navigationWidth: 0,
    compactAt: 1000,
    tightAt: 760,
    navigationAt: 0,
    inspectorAt: 760,
    outlineAt: 0,
    frameInset: 20,
    canvasInsetX: 24,
    canvasInsetY: 30,
    parts: {
      presentation: (_base, S) => (parent, index, thumbnail) => {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = (tag, attrs, host) => {
          const node = document.createElementNS(ns, tag);
          for (const [key, value] of Object.entries(attrs || {})) node.setAttribute(key, String(value));
          (host || parentSvg).appendChild(node);
          return node;
        };
        parent.replaceChildren();
        const parentSvg = document.createElementNS(ns, 'svg');
        parentSvg.setAttribute('viewBox', '0 0 720 400');
        parentSvg.setAttribute('width', '100%'); parentSvg.setAttribute('height', '100%');
        parentSvg.setAttribute('aria-hidden', 'true'); parent.appendChild(parentSvg);
        const defs = svg('defs', {});
        const gradient = (id, stops) => {
          const g = svg('linearGradient', { id, x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
          for (const [offset, color] of stops) svg('stop', { offset, 'stop-color': color }, g);
        };
        gradient('lake-sky', [['0%', '#91b7dc'], ['55%', '#dce9f4'], ['100%', '#8daecc']]);
        gradient('lake-water', [['0%', '#7699b5'], ['55%', '#6084a1'], ['100%', '#365e7a']]);
        const text = (x, y, value, size, fill, weight = 400) => {
          const t = svg('text', { x, y, fill, 'font-size': size, 'font-family': 'Arial, sans-serif', 'font-weight': weight });
          t.textContent = value;
        };
        const rect = (x, y, width, height, fill, extra = {}) => svg('rect', { x, y, width, height, fill, ...extra });
        rect(0, 0, 720, 400, '#fff'); rect(0, 0, 720, 22, '#28584b');
        const slide = S.spec.slides[index] || {};
        if (thumbnail) {
          text(22, 52, slide.title || 'Presentation', 25, '#153d35', 700);
          rect(22, 61, 676, 1, '#87a99d');
          text(26, 104, (slide.subtitle || 'Planning and delivery').slice(0, 43), 11, '#47655c');
          if (slide.title === 'Key findings') {
            for (let i = 0; i < 4; i++) {
              const height = 45 + i * 22;
              rect(332 + i * 74, 278 - height, 48, height, i === 3 ? '#315f50' : '#6d9cc2');
              rect(332 + i * 74, 283, 48, 1, '#8ca79b');
            }
            rect(35, 139, 220, 7, '#adc6d3'); rect(35, 158, 185, 7, '#c2d3dc'); rect(35, 177, 204, 7, '#c2d3dc');
            rect(35, 196, 172, 7, '#c2d3dc'); rect(35, 215, 199, 7, '#c2d3dc');
            rect(0, 360, 720, 40, '#e2ebe6'); text(26, 384, 'ClearPath Office', 10, '#35584e'); return;
          }
          if (slide.title === 'Delivery plan') {
            for (let i = 0; i < 4; i++) {
              const y = 142 + i * 45;
              text(28, y + 14, `Q${i + 1}`, 12, '#47655c');
              rect(91 + i * 30, y, 465 - i * 32, 17, i % 2 ? '#b5cfc4' : '#8db3cb');
              rect(91 + i * 30, y + 20, 260 + i * 24, 8, '#d1ddd7');
            }
            rect(0, 360, 720, 40, '#e2ebe6'); text(26, 384, 'ClearPath Office', 10, '#35584e'); return;
          }
          if (slide.title === 'Next steps') {
            for (let i = 0; i < 5; i++) {
              svg('circle', { cx: 48, cy: 142 + i * 35, r: 6, fill: '#315f50' });
              rect(68, 136 + i * 35, 380 + ((i * 47) % 180), 10, i === 0 ? '#a5c0d1' : '#c4d6dd');
            }
            rect(0, 360, 720, 40, '#e2ebe6'); text(26, 384, 'ClearPath Office', 10, '#35584e'); return;
          }
          if (slide.title === 'The opportunity') {
            rect(28, 111, 308, 185, 'url(#lake-sky)');
            svg('path', { d: 'M28 220 L88 179 137 199 188 162 238 189 286 170 336 191 V296 H28Z', fill: '#7893ad' });
            svg('path', { d: 'M28 260 Q90 239 151 260 T275 253 T336 258 V296 H28Z', fill: '#345d74' });
            rect(382, 128, 286, 8, '#a8c4d4'); rect(382, 150, 260, 8, '#c1d3dc'); rect(382, 172, 270, 8, '#c1d3dc');
            rect(382, 209, 245, 8, '#a8c4d4'); rect(382, 231, 278, 8, '#c1d3dc'); rect(382, 253, 225, 8, '#c1d3dc');
            rect(0, 360, 720, 40, '#e2ebe6'); text(26, 384, 'ClearPath Office', 10, '#35584e'); return;
          }
          rect(28, 120, 176, 7, '#a8c4d4'); rect(28, 135, 151, 7, '#c1d3dc'); rect(28, 150, 165, 7, '#c1d3dc');
          const ix = 360, iy = 77, iw = 328, ih = 202;
          rect(ix, iy, iw, ih, 'url(#lake-sky)');
          svg('path', { d: `M${ix} ${iy+100} L${ix+46} ${iy+74} ${ix+94} ${iy+88} ${ix+143} ${iy+61} ${ix+192} ${iy+82} ${ix+238} ${iy+65} ${ix+iw} ${iy+88} V${iy+ih} H${ix}Z`, fill: '#7994ad' });
          svg('path', { d: `M${ix} ${iy+126} Q${ix+74} ${iy+105} ${ix+143} ${iy+126} T${ix+iw} ${iy+119} V${iy+ih} H${ix}Z`, fill: 'url(#lake-water)' });
          for (let i = 0; i < 14; i++) {
            const y = iy + 135 + i * 2.2, x = ix + 25 + (i * 37) % 165, width = 28 + (i * 19) % 88;
            svg('path', { d: `M${x} ${y}h${width}`, stroke: i % 2 ? '#c5d5df' : '#9ab4c5', 'stroke-width': 1, opacity: .35 });
          }
          svg('path', { d: `M${ix} ${iy+177} Q${ix+45} ${iy+153} ${ix+94} ${iy+177} T${ix+191} ${iy+173} T${ix+iw} ${iy+164} V${iy+ih} H${ix}Z`, fill: '#294f3d' });
          for (let i = 0; i < 18; i++) {
            const x = ix + 5 + i * 17, base = iy + ih;
            const h = 23 + (i % 5) * 5;
            svg('path', { d: `M${x} ${base} L${x+4} ${base-10} L${x+1} ${base-10} L${x+7} ${base-20} L${x+4} ${base-20} L${x+11} ${base-h} L${x+18} ${base-20} L${x+15} ${base-20} L${x+21} ${base-10} L${x+18} ${base-10} L${x+22} ${base}Z`, fill: i % 3 ? '#173b2e' : '#456537' });
          }
          rect(0, 360, 720, 40, '#e2ebe6'); text(26, 384, 'ClearPath Office', 10, '#35584e');
          return;
        }
        text(40, 99, slide.title || 'Presentation', 54, '#153d35', 700);
        rect(40, 123, 640, 1.4, '#73988a');
        if (slide.title === 'Opening') {
          text(40, 220, 'A stronger', 23, '#173b34');
          text(40, 247, 'partnership for', 23, '#173b34');
          text(40, 274, 'a brighter future', 23, '#173b34');
        } else {
          const subtitle = (slide.subtitle || 'Planning and delivery').split(/\s+/);
          const lines = [];
          while (subtitle.length && lines.length < 3) lines.push(subtitle.splice(0, Math.ceil(subtitle.length / (3 - lines.length))).join(' '));
          lines.forEach((line, i) => text(40, 220 + i * 27, line, 21, '#173b34'));
        }
        const ix = 292, iy = 143, iw = 388, ih = 214;
        rect(ix, iy, iw, ih, 'url(#lake-sky)');
        svg('path', { d: `M${ix} ${iy+104} L${ix+52} ${iy+77} ${ix+107} ${iy+91} ${ix+168} ${iy+60} ${ix+222} ${iy+83} ${ix+282} ${iy+62} ${ix+iw} ${iy+86} V${iy+ih} H${ix}Z`, fill: '#7893ad' });
        svg('path', { d: `M${ix} ${iy+133} Q${ix+88} ${iy+111} ${ix+176} ${iy+133} T${ix+iw} ${iy+124} V${iy+ih} H${ix}Z`, fill: 'url(#lake-water)' });
        for (let i = 0; i < 18; i++) {
          const y = iy + 143 + i * 2.1, x = ix + 18 + (i * 53) % 215, width = 36 + (i * 29) % 114;
          svg('path', { d: `M${x} ${y}h${width}`, stroke: i % 2 ? '#c5d5df' : '#9ab4c5', 'stroke-width': 1.2, opacity: .34 });
        }
        svg('path', { d: `M${ix} ${iy+186} Q${ix+54} ${iy+159} ${ix+112} ${iy+186} T${ix+230} ${iy+181} T${ix+iw} ${iy+171} V${iy+ih} H${ix}Z`, fill: '#274b37' });
        for (let i = 0; i < 23; i++) {
          const x = ix + 3 + i * 16, base = iy + ih, h = 24 + (i % 6) * 5;
          svg('path', { d: `M${x} ${base} L${x+3} ${base-10} L${x+1} ${base-10} L${x+7} ${base-19} L${x+4} ${base-19} L${x+9} ${base-h} L${x+15} ${base-19} L${x+12} ${base-19} L${x+18} ${base-10} L${x+16} ${base-10} L${x+19} ${base}Z`, fill: i % 4 ? '#173a2c' : '#496a3b' });
        }
        rect(0, 365, 720, 35, '#e3ebe6'); text(26, 386, 'Rivermere Consulting', 10, '#35584e'); text(680, 386, String(index + 1), 10, '#35584e');
      },
    },
  },
});
