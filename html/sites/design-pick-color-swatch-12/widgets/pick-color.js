// Keep the three-panel frame and horizontal hue picker used by this swatch design.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-swatch-12',
  name: 'design',
  split: 'train',
  scenarios: ['swatch'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    axes: false,
    parts: {
      card: (base, S) => (ctx) => {
        const workspace = ctx.stage.closest('.shell').querySelector('.stage');
        workspace.replaceChildren();
        const card = ctx.util.el('div', 'cp', workspace);
        card.style.fontFamily = 'inherit';
        return card;
      },
      picker: (base, S) => (ctx, card) => {
        const { util, spec } = ctx;
        const minPx = S.task.helpers.MIN_TRACK_PX;
        const bounds = card.getBoundingClientRect();
        const size = Math.max(minPx, Math.floor(bounds.width));
        const stage = ctx.stage.closest('.shell').querySelector('.stage');
        const stageH = stage.getBoundingClientRect().height;
        const height = Math.max(Math.min(minPx, 90), Math.floor(stageH * .47));
        const hueWidth = size;
        const hueHeight = 28;
        const radius = 5;
        const knobSize = Math.max(22, Math.round(stageH * .087));

        util.el('div', 'pk-label', card, 'Hue');
        const hueHit = util.el('div', 'cp-hit', card);
        hueHit.dataset.role = 'hue';
        const hue = util.el('div', 'cp-hue', hueHit);
        Object.assign(hue.style, { width: hueWidth + 'px', height: hueHeight + 'px' });
        const hueBar = util.el('div', 'cp-hbar', hue);

        util.el('div', 'pk-label', card, 'Saturation / Value');
        const svHit = util.el('div', 'cp-hit', card);
        svHit.dataset.role = 'sv';
        const sv = util.el('div', 'cp-sv', svHit);
        Object.assign(sv.style, { width: size + 'px', height: height + 'px', borderRadius: radius + 'px' });
        util.el('div', 'cp-sv-layer cp-sv-white', sv);
        util.el('div', 'cp-sv-layer cp-sv-black', sv);
        const svKnob = util.el('div', 'cp-knob', sv);
        Object.assign(svKnob.style, {
          width: knobSize + 'px',
          height: knobSize + 'px',
          margin: `${-knobSize / 2}px 0 0 ${-knobSize / 2}px`,
        });

        const span = (el) => () => {
          const r = el.getBoundingClientRect();
          return { left: r.left, top: r.top, width: size - 1, height: height - 1 };
        };
        const svPad = env.ui.pad(svHit, {
          label: 'sv',
          rect: span(sv),
          value: [ctx.model.s, 1 - ctx.model.v],
          onInput([u, v]) { S.commit({ s: u, v: 1 - v }); },
        });
        const hueCtl = env.ui.slider(hueHit, {
          label: 'hue',
          thumbs: [hueBar],
          values: [ctx.model.h],
          min: 0,
          max: 360,
          keyboard: !!spec.keys,
          geometry() {
            const r = hue.getBoundingClientRect();
            const y = r.top + r.height / 2;
            return { start: [r.left, y], end: [r.left + hueWidth - 1, y] };
          },
          place: (bar, point, f) => { bar.style.left = f * (hueWidth - 1) + 'px'; },
          onInput([h]) { S.commit({ h }); },
        });
        return {
          anchors: [sv, hue],
          paint(model) {
            sv.style.backgroundColor = `hsl(${model.h} 100% 50%)`;
            Object.assign(svKnob.style, {
              left: model.s * (size - 1) + 'px',
              top: (1 - model.v) * (height - 1) + 'px',
            });
            hueBar.style.background = `hsl(${model.h} 100% 50%)`;
            svPad.set([model.s, 1 - model.v]);
            hueCtl.set([model.h]);
          },
          locate(target, model) {
            if (target.surface === 'sv') {
              const [s, v] = target.current ? [model.s, model.v] : [target.s, target.v];
              return svPad.locate([s, 1 - v]);
            }
            if (target.surface === 'hue') return hueCtl.locate(target.current ? model.h : target.h);
            return null;
          },
        };
      },
      layout: (base, S) => (ctx, card) => {
        const { util, spec } = ctx;
        const workspace = ctx.stage.closest('.shell').querySelector('.stage');
        const slot = document.querySelector('.target-slot') || workspace;
        if (slot !== workspace) slot.replaceChildren();

        const makePanel = (label, sub, fieldNames, parent, cls) => {
          const panel = util.el('section', 'instrument-panel ' + (cls || ''), parent || card);
          const heading = util.el('div', 'panel-label', panel);
          util.el('span', '', heading, label);
          if (sub) util.el('small', '', heading, ' ' + sub);
          const swatch = util.el('div', 'cp-swatch', panel);
          const values = util.el('dl', 'color-values', panel);
          const fields = {};
          for (const f of fieldNames) {
            util.el('dt', '', values, f);
            fields[f] = util.el('dd', '', values);
          }
          return { panel, swatch, fields };
        };

        const target = makePanel('Target Color', '', ['HEX', 'RGB'],
          slot === workspace ? card : slot, 'target-panel');
        target.swatch.setAttribute('aria-label', spec.targetLabel);
        target.swatch.title = spec.targetLabel;
        const current = makePanel('Current Color', '(your selection)', ['HEX', 'RGB', 'HSL'], card, 'current-panel');
        const middle = util.el('section', 'instrument-panel picker-panel', card);
        const controlHost = util.el('div', 'picker-controls', middle);
        const displayColor = (panel, rgb) => {
          const code = S.math.hex(rgb);
          panel.swatch.style.background = code;
          const [r, g, b] = rgb.map(c => Math.round(c));
          panel.fields.RGB.textContent = r + ', ' + g + ', ' + b;
          panel.fields.HEX.textContent = code.toUpperCase();
          if (panel.fields.HSL) {
            const mx = Math.max(r, g, b) / 255;
            const mn = Math.min(r, g, b) / 255;
            const d = mx - mn;
            const l = (mx + mn) / 2;
            let h = 0;
            if (d) {
              if (mx === r / 255) h = ((g - b) / 255 / d + 6) % 6;
              else if (mx === g / 255) h = (b - r) / 255 / d + 2;
              else h = (r - g) / 255 / d + 4;
            }
            const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
            panel.fields.HSL.textContent = Math.round(h * 60) + '°, ' +
              Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%';
          }
        };
        displayColor(target, spec.rgb);
        S.st.controls = S.P.picker(ctx, controlHost, ctx.size.height, ctx.size.width);
        const preview = makePanel('Color Preview', '', ['HEX', 'RGB', 'HSL'], card, 'preview-panel');
        S.st.side = {
          anchors: [target.swatch, current.swatch],
          locators: {},
          paint(model) {
            const rgb = S.math.modelRgb(model);
            displayColor(current, rgb);
            displayColor(preview, rgb);
            const delta = document.querySelector('[data-role="color-difference"]');
            if (delta) delta.textContent = S.task.error(model, spec).toFixed(1);
          },
        };
      },
    },
  },
});
