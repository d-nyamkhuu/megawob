// Inspector form and colored title dots; the ghost workspace is docked to the stage origin.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-12',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: { grips: ['se', 'e', 's', 'sw', 'w', 'ne', 'n', 'nw'] },
  template: 'resize-element/panel',
  design: {
    top: 0,
    topFraction: 0,
    parts: {
      title: (base, S) => (ctx) => {
        const title = ctx.util.el('div', 'rz-title', S.frame.box);
        const dots = ctx.util.el('span', 'rz-dots', title);
        for (const c of ['r', 'y', 'g']) ctx.util.el('i', 'tl ' + c, dots);
        ctx.util.el('span', 'rz-name', title, ctx.spec.title);
        return title;
      },
      body: (base, S) => (ctx) => {
        const { util } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        const textSection = util.el('section', 'in-section', body);
        const row = (cls, parent) => util.el('div', 'in-row ' + (cls || ''), parent || textSection);
        util.el('div', 'in-label', textSection, 'Text');
        const r1 = row();
        util.el('span', 'in-field wide', r1, 'Helvetica');
        util.el('span', 'in-field narrow', r1, '12');
        const r2 = row('gap');
        const seg = util.el('span', 'in-seg', r2);
        util.el('b', '', seg, 'B');
        util.el('i', '', seg, 'I');
        util.el('u', '', seg, 'U');
        const sw = util.el('span', 'in-swatch', r2);
        util.el('em', '', sw);

        const alignmentSection = util.el('section', 'in-section', body);
        util.el('hr', 'in-hr', alignmentSection);
        util.el('div', 'in-label', alignmentSection, 'Alignment');
        const al = util.el('div', 'in-seg al', alignmentSection);
        for (const [k, path] of [
          [0, 'M3 4H15M3 8H11M3 12H15M3 16H9'],
          [1, 'M3 4H15M5 8H13M3 12H15M6 16H12'],
          [2, 'M3 4H15M7 8H15M3 12H15M9 16H15'],
          [3, 'M3 4H15M3 8H15M3 12H15M3 16H15'],
        ]) {
          const b = util.el('span', k === 0 ? 'on' : '', al);
          util.svg(
            'path',
            { d: path },
            util.svg(
              'svg',
              { width: 18, height: 20, viewBox: '0 0 18 20', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6 },
              b,
            ),
          );
        }

        const spacingSection = util.el('section', 'in-section', body);
        util.el('hr', 'in-hr', spacingSection);
        util.el('div', 'in-label', spacingSection, 'Spacing');
        const r3 = row('sp', spacingSection);
        util.el('span', 'in-key', r3, 'Line spacing');
        util.el('span', 'in-field num', r3, '1.0');
        const r4 = row('sp', spacingSection);
        util.el('span', 'in-key', r4, 'Paragraph spacing');
        util.el('span', 'in-field num', r4, '0 pt');
        util.el('span', 'rz-grip-mark', S.frame.box);
        return body;
      },
      decorate: (base, S) => (ctx, size) => {
        const { box, body, zoom, chromeUnit, ghost } = S.frame;
        const compact = size.h * zoom < 300 * chromeUnit;
        const contentUnit = Math.max(
          0.08,
          Math.min(
            chromeUnit / zoom,
            (size.w - 2) / (compact ? 1010 : 350),
            (size.h - (40 * chromeUnit) / zoom - 2) / (compact ? 140 : 450),
          ),
        );
        body.style.setProperty('--chat-unit', String(contentUnit));
        body.style.setProperty('--title-unit', String(chromeUnit / zoom));
        if (ghost) ghost.style.zIndex = ctx.spec.target.w >= size.w && ctx.spec.target.h >= size.h ? '0' : '3';
      },
    },
  },
});
