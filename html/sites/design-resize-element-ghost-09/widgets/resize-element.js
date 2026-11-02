// Windows-style inspector with live size fields and the original 2.2% stage inset.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-ghost-09',
  name: 'design',
  split: 'train',
  scenarios: ['ghost'],
  traits: { grips: ['se', 'e', 's', 'sw', 'w', 'ne', 'n', 'nw'] },
  template: 'resize-element/panel',
  design: {
    topFraction: 0.022,
    parts: {
      title: (base, S) => (ctx) => {
        const title = ctx.util.el('div', 'rz-title', S.frame.box);
        ctx.util.el('span', 'rz-ttl', title, ctx.spec.title);
        ctx.util.el('span', 'rz-min', title);
        return title;
      },
      body: (base, S) => (ctx) => {
        const { util } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        const fset = (name) => {
          const f = util.el('div', 'ins-set', body);
          util.el('span', 'ins-leg', f, name);
          return f;
        };
        const field = (f, label, val, cls) => {
          const r = util.el('div', 'ins-row ' + (cls || ''), f);
          util.el('span', 'ins-lab', r, label);
          return util.el('span', 'ins-val', r, val);
        };
        const fo = fset('Object');
        field(fo, 'Type:', 'Rectangle');
        field(fo, 'Name:', 'Shape 1');
        field(fo, 'Layer:', 'Layer 1');
        const ft = fset('Transform');
        const tg = util.el('div', 'ins-grid', ft);
        field(tg, 'X:', '120', 'half');
        const wEl = field(tg, 'Width:', String(ctx.model.w), 'half');
        field(tg, 'Y:', '80', 'half');
        const hEl = field(tg, 'Height:', String(ctx.model.h), 'half');
        const fa = fset('Appearance');
        for (const [lab, sw, val] of [
          ['Fill:', '#fff', 'Solid'],
          ['Outline:', '#000', '1 px'],
        ]) {
          const r = util.el('div', 'ins-row', fa);
          util.el('span', 'ins-lab', r, lab);
          const s = util.el('span', 'ins-sw', r);
          s.style.background = sw;
          const d = util.el('span', 'ins-drop', r);
          util.el('span', '', d, val);
          util.el('i', '', d);
        }
        S.frame.inspectorFields = { wEl, hEl };
        return body;
      },
      drawn: (base, S) => (ctx, size) => {
        base(ctx, size);
        const { box, body, ghost, inspectorFields } = S.frame;
        body.classList.toggle('compact-inspector', size.h < 470);
        body.classList.toggle('stacked-inspector', size.h >= 210 && size.h < 470);
        box.classList.toggle('short-inspector', size.h < 160);
        body.style.setProperty('--ins-row', Math.max(10, Math.min(30, (size.h - (size.h < 160 ? 44 : 60)) / 3)) + 'px');
        body.style.setProperty('--ins-unit', Math.min(1, (size.h - 60) / 420));
        if (ghost) ghost.style.zIndex = ctx.spec.target.w >= size.w && ctx.spec.target.h >= size.h ? '0' : '3';
        inspectorFields.wEl.textContent = String(size.w);
        inspectorFields.hEl.textContent = String(size.h);
      },
    },
  },
});
