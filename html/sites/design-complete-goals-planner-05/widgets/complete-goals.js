// Keep each embedded widget's live controls, model, anchors and random stream.
function plannerFit(entry) {
  const box = entry.box;
  const rect = box.getBoundingClientRect();
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  const surface = box.querySelector('.fd-card,.fp-card,.slc-card,.sls-card');
  for (const el of surface ? [surface] : box.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (Math.abs(r.width - rect.width) < 2 && Math.abs(r.height - rect.height) < 2) continue;
    left = Math.min(left, r.left - rect.left);
    top = Math.min(top, r.top - rect.top);
    right = Math.max(right, r.right - rect.left);
    bottom = Math.max(bottom, r.bottom - rect.top);
  }
  if (!Number.isFinite(left)) return;
  const summary = entry.card.querySelector('.planner-summary');
  const roomW = entry.card.clientWidth * (summary ? .46 : 1) - 28;
  const options = entry.card.querySelector('.planner-options');
  const roomH = entry.card.clientHeight - entry.card.querySelector('.cp-label').offsetHeight - 28 - (options ? options.offsetHeight + 12 : 0);
  const width = right - left, height = bottom - top;
  const scale = entry.part.task === 'set-slider' ? 1 : Math.min(1, roomW / width, roomH / height);
  const content = document.createElement('div');
  content.className = 'planner-content';
  Object.assign(content.style, { position: 'absolute', width: entry.w + 'px', height: entry.h + 'px',
    transformOrigin: '0 0', transform: `scale(${scale})`,
    left: (summary ? 22 - left * scale : (entry.card.clientWidth - width * scale) / 2 - left * scale) + 'px',
    top: (Math.max(0, (roomH - height * scale) / 2) + 12 - top * scale) + 'px' });
  content.append(...box.childNodes);
  box.append(content);
  box.style.width = entry.card.clientWidth + 'px';
  box.style.height = (roomH + 28) + 'px';
}
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-planner-05',
  name: 'design',
  split: 'train',
  scenarios: ['planner'],
  template: 'complete-goals/sections',
  design: {
    styles: ['cards', 'cards', 'cards', 'cards'],
    wrapPadding: '0 0 16px',
    cardPadding: '0 0 10px',
    cardInset: 4,
    cardRadius: '8px',
    cardBackground: 'linear-gradient(135deg,#f0f1f2,#e0e2e4)',
    labelSize: '19px',
    gapRange: [14, 14],
    parts: {
      attempts: (base) => (ctx, look, W) => {
        const attempts = base(ctx, look, W);
        return [{ grid: true, colW: Math.floor((ctx.stage.clientWidth - 42) / 2) }, ...attempts];
      },
      frame: (base) => (ctx, look, at, W) => {
        const host = base(ctx, look, at, W);
        Object.assign(host.style, { width: '100%', height: '100%', margin: '0', padding: '0',
          gridTemplateColumns: '1.04fr .96fr', gridTemplateRows: 'minmax(0, 2.4fr) minmax(0, 1fr)', alignItems: 'stretch' });
        return host;
      },
      heading: () => () => {},
      number: () => () => {},
      label: (base) => (ctx, card, part, i, look) => {
        const label = base(ctx, card, part, i, look);
        label.querySelector('span').textContent = part.task === 'set-date' ? 'Event Date'
          : part.task === 'set-slider' ? 'Similarity Threshold' : 'Registration Plan';
        return label;
      },
      card: (base) => (ctx, host, part, i, look) => {
        const card = base(ctx, host, part, i, look);
        if (host.classList.contains('grid')) {
          const position = part.task === 'set-date' ? ['1', '1']
            : part.task === 'set-slider' ? ['2', '1'] : ['1 / -1', '2'];
          card.style.gridColumn = position[0];
          card.style.gridRow = position[1];
        }
        return card;
      },
      section: (base) => (ctx, entry) => {
        base(ctx, entry);
        if (entry.part.task !== 'set-slider') {
          if (entry.part.task === 'set-date') return;
          ctx.util.el('div', 'planner-summary', entry.card, entry.part.spec.note || 'Choose an option to see its features.');
          const wrap = entry.box.querySelector('.planner-content');
          if (wrap) { entry.box.replaceChildren(...wrap.childNodes); entry.box.style.width = entry.w + 'px'; entry.box.style.height = entry.h + 'px'; plannerFit(entry); }
          return;
        }
        const count = entry.part.spec.sliders ? entry.part.spec.sliders.length : 1;
        entry.card.dataset.channels = String(count);
        const set = ctx.util.el('fieldset', 'planner-options', entry.card);
        ctx.util.el('legend', '', set, 'Match Options');
        for (const [i, text] of ['Title', 'Description', 'Location', 'Organizer'].entries()) {
          const row = ctx.util.el('label', '', set);
          const check = ctx.util.el('input', '', row);
          check.type = 'checkbox'; check.checked = i < 2;
          ctx.util.el('span', '', row, text);
        }
        const wrap = entry.box.querySelector('.planner-content');
        if (wrap) { entry.box.replaceChildren(...wrap.childNodes); entry.box.style.width = entry.w + 'px'; entry.box.style.height = entry.h + 'px'; plannerFit(entry); }
      },
      draw: (base) => (ctx, entry, h) => {
        base(ctx, entry, h);
        if (entry.plannerFitted) plannerFit(entry);
      },
      fitBox: (base) => (ctx, entry, H0) => {
        base(ctx, entry, H0);
        entry.plannerFitted = true;
        plannerFit(entry);
        entry.overflow = false;
        return true;
      },
      styles: (base) => () => base() + `
        .cp-card.cards { border-width:2px; }
        .cp-label { min-height:44px; margin:0 0 4px; padding:0 13px;
          border-bottom:2px solid #738291; text-transform:none; letter-spacing:0;
          color:#101828; background:linear-gradient(#c2d9ee,#9dbbd7); }
      `,
    },
  },
});
