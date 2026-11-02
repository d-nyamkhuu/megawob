// Aqua's numeric panel uses a zero-origin workspace, a chat-style window, and a fixed feedback column.
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-numeric-07',
  name: 'design',
  split: 'train',
  scenarios: ['numeric'],
  traits: { grips: ['se'] },
  template: 'resize-element/panel',
  design: {
    origin: 'sampled',
    rectFrame: 'max',
    placement: 'fixed',
    left: 0,
    top: 18,
    wellPosition: false,
    parts: {
      geometry: (base, S) => () => {
        const F = S.frame;
        F.W = F.lim.max.w + F.pad;
        F.H = F.lim.max.h + F.pad;
      },
      boxPosition: (base, S) => () => {
        const { box, ax, ay, pad } = S.frame;
        Object.assign(box.style, ax ? { right: pad + 'px' } : { left: '0px' }, ay ? { bottom: pad + 'px' } : { top: '0px' });
      },
      title: (base, S) => (ctx) => {
        const { util, spec } = ctx;
        const title = util.el('div', 'rz-title', S.frame.box);
        util.el('span', 'rz-name', title, spec.title);
        const dots = util.el('span', 'rz-dots', title);
        util.el('i', 'min', dots);
        util.el('i', 'cls', dots, '✕');
        return title;
      },
      body: (base, S) => (ctx) => {
        const { util } = ctx;
        const body = util.el('div', 'rz-body', S.frame.box);
        S.frame.body = body;
        const list = util.el('div', 'rz-list', body);
        for (const [time, name, text] of [
          ['[10:22]', 'Alice:', 'Hi there!'],
          ['[10:23]', 'Bob:', 'Hello!'],
          ['[10:24]', 'Alice:', 'Are you available later?'],
        ]) {
          const message = util.el('div', 'rz-message', list);
          util.el('em', '', message, time);
          util.el('strong', '', message, name);
          util.el('p', '', message, text);
        }
        const scrollbar = util.el('div', 'rz-sb', body);
        util.el('i', 'up', scrollbar);
        util.el('i', 'dn', scrollbar);
        const entry = util.el('div', 'rz-entry', S.frame.box);
        util.el('div', 'rz-input', entry);
        util.el('div', 'rz-send', entry, 'Send');
        return body;
      },
      briefing: (base, S) => (ctx) => {
        const gripNames = {
          se: 'bottom-right corner', sw: 'bottom-left corner', ne: 'top-right corner', nw: 'top-left corner',
          e: 'right edge', w: 'left edge', n: 'top edge', s: 'bottom edge',
        };
        const grip = gripNames[ctx.spec.grip];
        const helper = `Drag the ${grip} of the “${ctx.spec.title}” panel to resize it to the target size shown above.`;
        const sub = document.querySelector('.instruction-sub');
        if (sub) sub.textContent = helper;
        const firstStep = document.querySelector('.n-body li');
        if (firstStep) firstStep.textContent = `Drag the ${grip} of the ${ctx.spec.title} panel.`;
      },
      paintWell: (base, S) => (ctx, size) => {
        const { util, spec } = ctx;
        const well = S.frame.well;
        if (!well) return;
        well.textContent = '';
        const row = (parent, label, value, cls) => {
          const r = util.el('div', 'well-row ' + (cls || ''), parent);
          util.el('span', 'well-label', r, label);
          if (value !== undefined) util.el('b', '', r, value);
          return r;
        };
        util.el('div', 'well-head', well, `${spec.title} panel size (current):`);
        row(well, 'Width:', `${size.w} px`);
        row(well, 'Height:', `${size.h} px`);
        if (spec.target && spec.target.w) {
          util.el('hr', '', well);
          util.el('div', 'well-head', well, 'Target size:');
          row(well, 'Width:', `${spec.target.w} px`);
          row(well, 'Height:', `${spec.target.h} px`);
        }
      },
      fit: (base, S) => (ctx) => {
        const { frame: F } = S;
        const feedbackWidth = F.well.offsetWidth;
        const zoom = Math.min(2.14, (ctx.size.width - feedbackWidth - 72) / F.lim.max.w, (ctx.size.height - 42) / F.H);
        const feedbackLeft = Math.max(
          F.lim.max.w * zoom + 32,
          Math.min(ctx.size.width - feedbackWidth - 24, ctx.size.width * 0.59),
        );
        F.well.style.setProperty('--feedback-left', feedbackLeft + 'px');
        F.well.style.top = '18px';
        return zoom;
      },
      compact: (base, S) => (ctx, size) => {
        base(ctx, size);
        const { box, zoom } = S.frame;
        const visualHeight = size.h * zoom;
        const titleHeight = Math.min(40, Math.max(16, visualHeight * 0.16));
        const entryHeight = Math.min(80, Math.max(24, visualHeight * 0.26));
        const bodyMargin = Math.min(11, Math.max(3, visualHeight * 0.035));
        const messageLine = Math.min(34, Math.max(8, (visualHeight - titleHeight - entryHeight - bodyMargin - 10) / 3));
        for (const [key, value] of Object.entries({
          'title-height': titleHeight,
          'entry-height': entryHeight,
          'body-margin': bodyMargin,
          'line-height': messageLine,
          'text-size': Math.min(22, messageLine * 0.72),
          'entry-control': Math.min(48, entryHeight * 0.65),
        })) box.style.setProperty('--' + key, value + 'px');
      },
      locateHandle: (base, S) => (name, value) => {
        const { frame: F, POINTS } = S;
        const hit = F.handles[name].getBoundingClientRect();
        const center = [hit.left + hit.width * 0.7, hit.top + hit.height * 0.7];
        const rect = S.P.pixelRect(value);
        const now = S.P.pixelRect(F.current);
        const [fx, fy] = POINTS[name];
        return [
          center[0] + (rect.x + fx * rect.w - now.x - fx * now.w) * F.zoom,
          center[1] + (rect.y + fy * rect.h - now.y - fy * now.h) * F.zoom,
        ];
      },
      anchors: (base, S) => () => S.frame.refEl ? [S.frame.area, S.frame.refEl] : [S.frame.area],
    },
  },
});
