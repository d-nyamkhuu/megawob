// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-signature-01',
  name: 'design',
  split: 'train',
  scenarios: ['signature'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'buildSignature': (base, S) => function buildSignature(B) {
        const { button, env, fmtPx } = S;
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const fam = env.taskDef;
        const paper = rng.pick(['#fffdf8', '#ffffff', '#fbfbfa']);
        const ink = rng.pick(['#1d3a8a', '#16181d', '#123f6b']);
        // The document and form are laid out separately from the drawing coordinates.
        const boardEl = svg.parentElement, wrapEl = boardEl.parentElement;
        wrapEl.classList.add('signature-form');
        const documentEl = util.el('section', 'signature-document', wrapEl);
        wrapEl.prepend(documentEl);
        util.el('h1', 'document-title', documentEl, spec.doc.title);
        const copy = util.el('div', 'document-copy', documentEl);
        for (const line of spec.doc.lines) util.el('p', '', copy, line);
        util.el('p', 'document-agreement', documentEl, 'I have read and understand this document and agree to be bound by its terms.');
        const box = spec.box;
        const [bx, by] = px([box.x, box.y]);
        const bw = box.w * scale;
        const bh = box.h * scale;
        const label = util.el('label', 'signature-label', wrapEl, rng.pick(['Sign here', 'Signature', 'Sign below']));
        wrapEl.insertBefore(label, boardEl);
        boardEl.classList.add('signature-field');
        boardEl.style.background = paper;
        svg.setAttribute('viewBox', `${bx} ${by} ${bw} ${bh}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        const signer = util.el('div', 'signature-signer', wrapEl);
        wrapEl.insertBefore(signer, B.foot);
        util.el('strong', '', signer, spec.signer);
        util.el('span', '', signer, 'Tenant (Printed Name)');
        const strokesG = util.svg('g', {}, svg);
        const width = rng.pick([2.2, 2.6, 3]);
        const stroke = env.ui.stroke(svg, {
          ...B.frame,
          toBoard: ([x, y]) => {
            const r = svg.getBoundingClientRect();
            return [box.x + (x - r.left) / r.width * box.w, box.y + (y - r.top) / r.height * box.h];
          },
          fromBoard: ([x, y]) => {
            const r = svg.getBoundingClientRect();
            return [r.left + (x - box.x) / box.w * r.width, r.top + (y - box.y) / box.h * r.height];
          },
          strokes: ctx.model.strokes,
          render: (points, strokes) => {
            strokesG.replaceChildren();
            for (const s of strokes) util.svg('polyline', { points: fmtPx(s, px), fill: 'none', stroke: ink, 'stroke-width': width, 'vector-effect': 'non-scaling-stroke', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, strokesG);
          },
          onStroke: (points, strokes) => { if (!ctx.model.accepted) ctx.update({ ...ctx.model, strokes }); },
          onChange: (strokes) => { if (!ctx.model.accepted) B.up({ ...ctx.model, strokes }); },
          label: 'signature',
        });
        const order = rng.bool(0.7);
        const clearBtn = button(util, B.foot, 'clear', rng.pick(['Clear', 'Clear signature', 'Start over']), { role: 'control', icon: false });
        const acceptBtn = button(util, B.foot, 'accept', rng.pick(['Accept', 'Accept signature', 'Accept & sign']), { role: 'control', icon: false, cls: 'primary' });
        if (!order) B.foot.append(clearBtn);
        const actionIcon = (btn, path) => {
          const icon = util.svg('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, btn);
          util.svg('path', { d: path }, icon);
          btn.prepend(icon);
        };
        actionIcon(acceptBtn, 'M4 12l5 5L20 5');
        actionIcon(clearBtn, 'M4 8a8 8 0 1 1-1 7M4 3v6h6');
        const ok = util.el('span', 'dw-ok', B.foot, '');
        // Feedback must not resize the action row or the drawing field.
        B.foot.style.position = 'relative';
        Object.assign(ok.style, { position: 'absolute', left: '0', top: 'calc(100% + 8px)' });
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
    },
  },
});
