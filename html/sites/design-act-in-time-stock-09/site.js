(function () {
  'use strict';
  const C = { site: 'design-act-in-time-stock-09', brand: 'MarketTrade', menu: 'File|Edit|View|Tools|Help' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const lights = u.el('span', 'ds-window-controls', top);
      u.el('i', 'ds-red', lights, '●'); u.el('i', 'ds-yellow', lights, '●'); u.el('i', 'ds-green', lights, '●');
      u.el('span', 'ds-app-icon', top, '↗');
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach(t => u.el('span', '', nav, t));
      const search = u.el('span', 'ds-search', top, '⌕  Search Symbols');

      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'].forEach((n, i) => {
        const row = u.el('div', i === 0 ? 'active' : '', rail, n);
      });
      const content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      if (mode === 'panel' && innerWidth < 1440) mode = 'header';
      if (mode === 'toast' && innerHeight < 700) mode = 'header';
      let note = null;
      if (mode !== 'hidden') {
        note = u.el('aside', `ds-header-note ds-instr-${mode}`, content);
        if (mode === 'panel') u.el('div', 'ds-note-label', note, 'Instructions');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel' && note) main.appendChild(note);
      const stage = u.el('main', 'ds-stage', main);
      const footer = u.el('footer', 'ds-footer', content);
      const r = ctx.rng.fork('aqua/end-control');
      let placement = ctx.finish ? null : r.pick(['footer','footer','header','link','icon']);
      const endLabels = ctx.content && ctx.content.END_LABELS || ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
      const labelValue = r.bool(.5) ? 'Submit' : r.pick(endLabels);
      let label = typeof labelValue === 'string' ? labelValue : labelValue.label || labelValue.text || 'Submit';
      // Preserve the existing stream's draws; the reference combination gets its own coin flip.
      const er = ctx.rng.fork('chrome/end');
      if (!ctx.finish) {
        if (er.bool(.5)) { placement = 'footer'; label = 'Submit'; }
        else if (placement === 'footer') placement = 'header';
      }
      footer.classList.toggle('ds-footer-quiet', ctx.finish || placement === 'header' || placement === 'icon');
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
        b.type = cls === 'ds-end-link' ? undefined : 'button';
        if (cls === 'ds-end-link') b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      let submit = null;
      const tools = u.el('div', 'ds-end-tools', placement === 'header' || placement === 'icon' ? top : footer);
      const collide = r.bool(.3);
      if (collide) {
        const decoyLabel = r.pick(endLabels.filter(x => (typeof x === 'string' ? x : x.label || x.text).toLowerCase() !== label.toLowerCase()));
        const dlabel = typeof decoyLabel === 'string' ? decoyLabel : decoyLabel.label || decoyLabel.text;
        const d = u.el('button', 'ds-xtra', tools, dlabel);
        d.type = 'button'; d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: dlabel, collide: true }));
      }
      if (placement === 'footer') submit = end(tools, 'ds-submit', label);
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'link') submit = end(tools, 'ds-end-link', `${label} ›`);
      if (placement === 'icon') submit = end(tools, 'ds-submit ds-icon-submit', '✓');
      u.el('span', 'ds-footer-status', footer, 'Market data · Connected');
      if (mode === 'toast' && note) {
        const close = u.el('button', 'ds-note-close', note, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Close');
        close.onclick = () => { note.hidden = true; };
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
