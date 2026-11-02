env.widget({
  task: 'crop-image',
  site: 'design-crop-image-default-02',
  name: 'design',
  split: 'train',
  scenarios: ['default'],
  traits: { aspect: 800 / 450 },
  template: 'crop-image/box',
  design: {
    background: '#171e26',
    asideApply: false,
    parts: {
      readout: (base, S) => (ctx, wrap) => {
        const readout = base(ctx, wrap);
        const values = S.els.readoutValues = {};
        for (const [key, label] of [['X', 'X'], ['Y', 'Y'], ['W', 'Width'], ['H', 'Height']]) {
          const row = ctx.util.el('div', 'cr-value-row', readout);
          ctx.util.el('span', 'cr-value-label', row, label);
          values[key] = ctx.util.el('span', 'cr-value', row);
        }
        return readout;
      },
      tools: (base, S) => (ctx) => {
        const { util } = ctx;
        const { bar, readout } = S.els;
        const aside = document.querySelector('.content > .aside:not(.tabs)');
        if (!aside) return;
        const existingCard = aside.querySelector(':scope > .crop-tools-card');
        if (existingCard) {
          for (const control of existingCard.querySelectorAll('.cr-tools, .aspect-check, .cr-readout')) control.remove();
        }
        const check = util.el('label', 'aspect-check', aside);
        const input = util.el('input', '', check);
        input.type = 'checkbox';
        util.el('span', '', check, 'Maintain aspect ratio');
        if (bar) aside.insertBefore(bar, aside.querySelector('.submit'));
        aside.insertBefore(check, aside.querySelector('.submit'));
        aside.insertBefore(readout, aside.querySelector('.submit'));
        const card = existingCard || util.el('div', 'crop-tools-card', aside);
        for (const child of Array.from(aside.children)) {
          if (child !== card && child !== aside.querySelector('.submit')) card.appendChild(child);
        }
        aside.insertBefore(card, aside.querySelector('.submit'));
      },
      paintReadout: (base, S) => (ctx, m) => {
        if (ctx.spec.scenario === 'marquee' && !ctx.model.on) {
          S.els.readout.textContent = 'No selection - drag on the image to select';
        } else {
          const v = S.els.readoutValues;
          v.X.textContent = Math.round(m.l * S.W);
          v.Y.textContent = Math.round(m.t * S.H);
          v.W.textContent = Math.round((m.r - m.l) * S.W);
          v.H.textContent = Math.round((m.b - m.t) * S.H);
        }
      },
    },
  },
});
