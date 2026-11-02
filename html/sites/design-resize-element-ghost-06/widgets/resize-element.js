// The ghost design presents a document inspector and preserves its custom title and property layout.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-06',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    compactHeight: 100,
    left: 18,
    topFraction: 0,
    parts: {
      title: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const title = util.el('div', 'rz-title', S.frame.box);
        util.el('span', 'rz-dots', title);
        util.el('span', 'insp-title', title, spec.title);
        util.el('span', 'insp-x', title, '×');
        return title;
      },
      body: (base, S) => (ctx) => {
        const { util } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        const sections = [
          ['Document', [
            ['Title:', 'Project Plan'],
            ['Pages:', '3'],
            ['Size:', '420 KB'],
            ['Modified:', 'Apr 24, 2006'],
          ]],
          ['Page', [
            ['Number:', '1'],
            ['Dimensions:', '8.5 × 11 in'],
            ['Orientation:', 'Portrait'],
          ]],
        ];
        for (const [name, rows] of sections) {
          const section = util.el('div', 'insp-sec', body);
          util.el('div', 'insp-h', section, name);
          for (const [key, value] of rows) {
            const row = util.el('div', 'insp-row', section);
            util.el('span', 'insp-k', row, key);
            util.el('span', 'insp-v', row, value);
          }
        }
        util.el('span', 'insp-grip', S.frame.box);
        return body;
      },
      decorate: (base, S) => (ctx, size) => {
        S.frame.box.style.setProperty(
          '--inspector-scale',
          String(Math.max(0.12, Math.min(1, (size.h - 55) / 345, (size.w - 30) / 390))),
        );
      },
      draw: (base, S) => (ctx, size) => {
        const { box, handles, ghost, zoom, chromeUnit, readout } = S.frame;
        Object.assign(box.style, { width: size.w + 'px', height: size.h + 'px' });
        box.style.setProperty(
          '--inspector-scale',
          String(Math.max(0.12, Math.min(1, (size.h - 55) / 345, (size.w - 30) / 390))),
        );
        box.classList.toggle('compact-chat', size.h * zoom < 100 * chromeUnit);
        if (ghost) ghost.style.zIndex = ctx.spec.target.w >= size.w && ctx.spec.target.h >= size.h ? '0' : '3';
        const rect = S.P.rectOf(size);
        for (const [name, handle] of Object.entries(handles)) {
          const [fx, fy] = S.POINTS[name];
          Object.assign(handle.style, { left: rect.x + fx * rect.w + 'px', top: rect.y + fy * rect.h + 'px' });
        }
        readout.textContent = `${size.w} × ${size.h}`;
      },
    },
  },
});
