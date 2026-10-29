/* Metro-style "Image Adjuster" desktop window: command rail, wide content field, seeded task note. */
(function () {
  'use strict';
  const ICONS = {
    Adjust: '<rect x="3" y="5" width="30" height="26" rx="2" fill="none" stroke="#fff" stroke-width="3"/><circle cx="12" cy="13" r="3" fill="#fff"/><path d="M5 29l9-9 6 6 5-5 8 8z" fill="#fff"/>',
    Crop: '<path d="M10 2v24h24M2 10h24v24" fill="none" stroke="currentColor" stroke-width="4"/>',
    Filters: '<circle cx="18" cy="10" r="9" fill="currentColor"/><circle cx="10" cy="23" r="9" fill="currentColor"/><circle cx="25" cy="23" r="9" fill="currentColor"/><path d="M13 17a8 8 0 0 0 10 0M17 17a8 8 0 0 0 0 13M11 24a8 8 0 0 0 14 0" fill="none" stroke="#4a535c" stroke-width="2"/>',
    Settings: '<path d="M15 1h6l1 5 4 2 5-2 3 5-4 4v5l4 4-3 5-5-2-4 2-1 5h-6l-1-5-4-2-5 2-3-5 4-4v-5l-4-4 3-5 5 2 4-2z" fill="currentColor"/><circle cx="18" cy="18" r="7" fill="#293138"/>',
    Help: '<circle cx="18" cy="18" r="17" fill="currentColor"/><text x="18" y="26" text-anchor="middle" font-size="24" font-weight="700" font-family="Segoe UI,Arial,sans-serif" fill="#252c36">?</text>',
  };
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'metro-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat:'Feedback', cookie:'Privacy', toast:'Notice', promo:'Upgrade Image Adjuster', banner:'Service notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'dlg-x', el, '×');
    x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, {chat:'How is Image Adjuster working for you?', cookie:'This app can remember your display preferences.', toast:'Your changes are ready to review.', promo:'Try the new filters pack today.', banner:'Image Adjuster is running in offline mode.'}[ctx.kind]);
    const dismiss = u.el('button', 'dlg-btn', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name:'design-set-slider-range-05', styles:['site.css'], scripts:[],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `metro instruction-${ctx.display}`;
      const title = u.el('header', 'titlebar', document.body);
      u.el('span', 'app-title', title, 'Image Adjuster');
      const wc = u.el('div', 'wincontrols', title);
      u.el('span', 'wc min', wc);
      u.el('span', 'wc max', wc);
      u.el('span', 'wc close', wc, '✕');
      const app = u.el('div', 'app', document.body);
      const rail = u.el('nav', 'rail', app);
      for (const name of ['Adjust', 'Crop', 'Filters', 'Settings', 'Help']) {
        const item = u.el('div', 'rail-item' + (name === 'Adjust' ? ' active' : ''), rail);
        item.innerHTML = `<svg viewBox="0 0 36 36" width="40" height="40" aria-hidden="true">${ICONS[name]}</svg>`;
        u.el('span', '', item, name);
      }
      const content = u.el('section', 'content', app);
      u.el('h1', '', content, 'Adjust Image');
      u.el('p', 'subtitle', content, 'Fine-tune the values below to get the best result.');
      const note = u.el('div', 'task-note', content);
      const text = String(ctx.instruction || '');
      const m = /^(.*?\.)\s+(.+)$/s.exec(text);
      if (m) { u.el('div', 'note-main', note, m[1]); u.el('div', 'note-sub', note, m[2]); }
      else u.el('div', 'note-main', note, text);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'note-close', note, '×');
        close.setAttribute('aria-label', 'Close task notice');
        close.onclick = () => { note.hidden = true; };
      }
      const er = ctx.rng.fork('chrome/end');
      const defaults = er.bool(0.5);
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const label = defaults ? 'Submit' : labelOf(er.pick(labels));
      const placement = defaults ? 'footer' : er.pick(['header', 'link', 'icon']);
      const addEnd = (parent, cls, text) => {
        const isLink = cls === 'end-link';
        const b = u.el(isLink ? 'a' : 'button', `btn primary ${cls}`, parent, text);
        if (isLink) b.href = '#'; else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = e => { e.preventDefault(); ctx.submit(); };
        return b;
      };
      const topTools = (!ctx.finish && (placement === 'header' || placement === 'icon'))
        ? u.el('div', 'top-tools', content) : null;
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = addEnd(topTools, 'end-header', label);
      if (!ctx.finish && placement === 'icon') submit = addEnd(topTools, 'end-icon', '✓');
      const stage = u.el('main', 'record-stage', content); stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', content);
      const reset = u.el('button', 'btn reset', footer, 'Reset All');
      reset.type = 'button'; reset.dataset.action = 'reset';
      const tools = u.el('div', 'footer-tools', footer);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const same = s => s.trim().toLowerCase() === label.trim().toLowerCase();
        const options = [...new Set(labels.map(labelOf))].filter(x => !same(x));
        if (options.length) collide = labelOf(cr.pick(options));
      }
      if (collide) {
        const decoy = u.el('button', 'btn xtra-end', tools, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', {label: collide, collide: true});
      }
      if (!ctx.finish && placement === 'footer') submit = addEnd(tools, 'end-footer', label);
      else if (!ctx.finish && placement === 'link') submit = addEnd(tools, 'end-link', `${label} ›`);
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
