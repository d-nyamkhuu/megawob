// Design on the choose-option/widgets template.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-09',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    railClass: null,
    arrows: false,
    integralRows: false,
    scrollPad: 28,
    emptyText: '(none)',
    stopArrows: true,
    arrowStep: 'geometry',
    parts: {
      geometry: () => (ctx) => {
        const rowH = Math.max(1, Math.floor((ctx.size.height - 48) / ctx.spec.rows));
        return { rowH, H: rowH * ctx.spec.rows, border: 4 };
      },
      rowDecoration: () => (ctx, controls, r, o) => {
        const { util } = ctx;
        const sw = util.el('span', 'lc-sw', r);
        let hh = 0;
        for (let k = 0; k < o.length; k++) hh = (hh * 31 + o.charCodeAt(k)) % 360;
        const named = {
          olive: '#7a7a0a',
          orange: '#ff6a00',
          peach: '#ffd0bd',
          plum: '#a070a8',
          rose: '#ff88c0',
          sand: '#dcb88a',
          'sea green': '#4a9078',
          silver: '#b8b8b8',
          'sky blue': '#88ccff',
          slate: '#7888a0',
          tan: '#c8a880',
          violet: '#c8a0ff',
          cherry: '#c0102a',
          cream: '#fff4d0',
        };
        sw.style.background = named[o.toLowerCase()] || `hsl(${hh},45%,62%)`;
      },
      status: () => (ctx, controls) => {
        const { util } = ctx;
        const { track, field } = controls;
        const up = util.el('button', 'lc-scroll-arrow up', track, '▲');
        const down = util.el('button', 'lc-scroll-arrow down', track, '▼');
        up.type = down.type = 'button';
        const slot = document.querySelector('.lc-cursel');
        const status = util.el('div', 'fp-status', slot || field);
        Object.assign(controls, { up, down });
        return status;
      },
      shown: () => (ctx, controls, m) => {
        const { rows } = controls;
        const info = document.querySelectorAll('.lc-ir span:last-child');
        const selected = m.values[m.values.length - 1];
        if (info.length === 3) {
          info[0].textContent = selected || '(none)';
          const color = selected ? getComputedStyle(rows[selected].querySelector('.lc-sw')).backgroundColor : '';
          const rgb = color.match(/\d+/g);
          info[1].textContent = rgb ? rgb.slice(0, 3).join(', ') : '---';
          info[2].textContent = rgb
            ? '#' +
              rgb
                .slice(0, 3)
                .map((v) => Number(v).toString(16).padStart(2, '0'))
                .join('')
                .toUpperCase()
            : '---';
          const previewTitle = document.querySelector('.lc-wtitle');
          if (previewTitle) {
            previewTitle.style.background = selected ? color : '';
            previewTitle.style.color =
              rgb && Number(rgb[0]) * 0.299 + Number(rgb[1]) * 0.587 + Number(rgb[2]) * 0.114 > 145 ? '#111' : '#fff';
          }
        }
      },
    },
  },
});
