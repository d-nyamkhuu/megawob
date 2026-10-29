// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-signature-04',
  name: 'design',
  split: 'train',
  scenarios: ['signature'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'buildSignature': (base, S) => function buildSignature(B) {
        const { button, env, fmtPx, wrap } = S;
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const fam = env.taskDef;
        util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: rng.pick(['#fffdf8', '#ffffff', '#fbfbfa']) }, svg);
        const ink = rng.pick(['#1d3a8a', '#16181d', '#123f6b']);
        // Document text above the field (pointer-events none on text).
        const mx = 0.07 * scale;
        const box = spec.box;
        const [bx, by] = px([box.x, box.y]);
        const bw = box.w * scale;
        const bh = box.h * scale;
        const sigShift = Math.max(0, Math.min(W * 0.12, bx - 2));
        util.svg('text', { x: mx, y: 0.1 * scale, class: 'dw-doc t' }, svg).textContent = spec.doc.title;
        const maxChars = Math.max(20, Math.floor((W - 2 * mx) / 6.6));
        let y = 0.1 * scale + 28;
        for (const s of spec.doc.lines) {
          for (const line of wrap(s, maxChars)) {
            if (y > by - 26) break;
            util.svg('text', { x: mx, y, class: 'dw-doc' }, svg).textContent = line;
            y += 18;
          }
          y += 6;
        }
        // The signature field.
        util.svg('rect', { x: bx, y: by, width: bw, height: bh, rx: 6, transform: `translate(${-sigShift} 0)`, fill: 'rgba(255, 235, 150, .18)', stroke: '#b08900', 'stroke-width': 1.5, 'stroke-dasharray': '6 4' }, svg);
        util.svg('line', { x1: bx + 14, y1: by + bh * 0.78, x2: bx + bw - 14, y2: by + bh * 0.78, transform: `translate(${-sigShift} 0)`, stroke: '#9a9a9a', 'stroke-width': 1.2 }, svg);
        util.svg('text', { x: bx + 14, y: by + bh * 0.78 - 6, transform: `translate(${-sigShift} 0)`, class: 'dw-doc', style: 'font-size:18px;fill:#9a9a9a' }, svg).textContent = '✕';
        util.svg('text', { x: bx + 8, y: by - 7, transform: `translate(${-sigShift} 0)`, class: 'dw-small', style: 'fill:#8a6d00' }, svg).textContent = rng.pick(['Sign here', 'Signature', 'Sign below']);
        const nameY = Math.min(H - 6, by + bh + 16);
        util.svg('text', { x: bx + 14, y: nameY, transform: `translate(${-sigShift} 0)`, class: 'dw-doc', style: 'font-size:12px' }, svg).textContent = spec.signer;
        const strokesG = util.svg('g', { transform: `translate(${-sigShift} 0)` }, svg);
        const width = rng.pick([2.2, 2.6, 3]);
        const stroke = env.ui.stroke(svg, {
          ...B.frame,
          // Map the displayed SVG back to board units, including the field offset.
          toBoard: ([x, y]) => {
            const r = svg.getBoundingClientRect();
            return [((x - r.left) * W / r.width + sigShift) / scale,
              (y - r.top) * H / r.height / scale];
          },
          fromBoard: ([x, y]) => {
            const r = svg.getBoundingClientRect();
            return [r.left + (x * scale - sigShift) * r.width / W,
              r.top + y * scale * r.height / H];
          },
          strokes: ctx.model.strokes,
          render: (points, strokes) => {
            strokesG.replaceChildren();
            for (const s of strokes) util.svg('polyline', { points: fmtPx(s, px), fill: 'none', stroke: ink, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, strokesG);
          },
          onStroke: (points, strokes) => { if (!ctx.model.accepted) ctx.update({ ...ctx.model, strokes }); },
          onChange: (strokes) => { if (!ctx.model.accepted) B.up({ ...ctx.model, strokes }); },
          label: 'signature',
        });
        const order = rng.bool(0.7);
        const clearBtn = button(util, B.foot, 'clear', rng.pick(['Clear', 'Clear signature', 'Start over']), { role: 'control', icon: false });
        const acceptBtn = button(util, B.foot, 'accept', rng.pick(['Accept', 'Accept signature', 'Accept & sign']), { role: 'control', icon: false, cls: 'primary' });
        if (!order) B.foot.append(clearBtn);
        const ok = util.el('span', 'dw-ok', B.foot, '');
        clearBtn.addEventListener('click', () => { ctx.log('clear'); B.up({ ...ctx.model, strokes: [], accepted: false }); });
        acceptBtn.addEventListener('click', () => { if (ctx.model.strokes.length && !ctx.model.accepted) { ctx.log('accept'); B.up({ ...ctx.model, accepted: true }); } });
        function sync(m) {
          stroke.set(m.strokes);
          acceptBtn.disabled = !m.strokes.length || m.accepted;
          ok.textContent = m.accepted ? '✓ Signature accepted' : '';
          svg.style.pointerEvents = m.accepted ? 'none' : '';
          svg.style.cursor = m.accepted ? 'default' : '';
        }
        B.hint(rng.pick(['Draw your signature with the mouse. Accept locks it in.', 'Sign inside the field. Use Clear to try again.']), true);
        void fam;
        return {
          sync,
          locate(t) {
            if (t.point) return stroke.locate(t.point);
            if (t.control === 'clear') return env.util.center(clearBtn);
            if (t.control === 'accept') return env.util.center(acceptBtn);
            return null;
          },
        };
      },
      'place': (base) => function place(wrap, ctx, rng) {
        // Retain the template's placement draws before applying the document layout.
        base(wrap, ctx, rng);
        const { width, height } = ctx.size;
        const inset = width * 0.025;
        const top = Math.max(160, height * 0.25);
        const boardWidth = width - 2 * inset;
        const svg = wrap.querySelector('.dw-board svg');
        const foot = wrap.querySelector('.dw-foot');
        const hint = wrap.querySelector('.dw-hint');
        wrap.classList.replace('dw-wrap', 'acme-document');
        Object.assign(wrap.style, { position: 'absolute', display: 'flex', flexDirection: 'column', left: `${inset}px`, top: `${top}px`, width: `${boardWidth}px`, alignItems: 'stretch', gap: '8px' });
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('width', boardWidth);
        svg.setAttribute('height', Math.max(120, height - top - 100));
        Object.assign(foot.style, { width: `${boardWidth}px`, justifyContent: 'flex-start', gap: '14px' });
        for (const button of foot.querySelectorAll('.dw-btn')) {
          Object.assign(button.style, { height: '44px', padding: '0 22px', flexShrink: '0' });
        }
        hint.style.maxWidth = `${boardWidth}px`;
      },
    },
  },
});
