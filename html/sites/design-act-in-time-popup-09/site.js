(function () {
  'use strict';
  const C = { site: 'design-act-in-time-popup-09' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const rng = ctx.rng.fork('chrome/end');
      const labels = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
      const label = labelOf(rng.pick(labels));
      const placement = ctx.finish ? null : rng.pick(['footer', 'footer', 'header', 'link', 'icon', 'footer']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(.3)) {
        const options = labels.map(labelOf).filter(x => x.toLowerCase() !== label.toLowerCase());
        if (options.length) collide = labelOf(collideRng.pick(options));
      }
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-book', brand, '▤');
      u.el('span', '', brand, 'Library System');
      const time = u.el('div', 'ds-time', top, 'Tue Apr 12, 2005　 10:24 AM');
      const tabs = u.el('div', 'ds-tabs', document.body);
      u.el('div', 'ds-tab', tabs, 'Log In');
      u.el('div', 'ds-tab', tabs, 'Announcements');
      const workspace = u.el('div', 'ds-workspace', document.body);
      const noteMode = ctx.display || 'header';
      if (noteMode !== 'hidden') {
        const note = u.el('aside', 'ds-instruction ds-instruction-' + noteMode, workspace, ctx.instruction);
        if (noteMode === 'panel') {
          note.dataset.mode = 'panel';
          const copy = note.textContent;
          note.textContent = '';
          u.el('div', 'ds-instruction-title', note, 'Task Note');
          u.el('div', 'ds-instruction-copy', note, copy);
        }
      }
      const news = u.el('aside', 'ds-news', workspace);
      u.el('h2', '', news, '▤　Library News');
      const newsRows = [['Spring Reading Program', 'Apr 06, 2005'], ['New Books Arriving Soon', 'Apr 04, 2005'], ['Library Hours Update', 'Mar 28, 2005']];
      newsRows.forEach(([title, date]) => {
        const row = u.el('div', 'ds-news-row', news);
        u.el('span', 'ds-news-title', row, '▪　' + title);
        u.el('span', 'ds-news-date', row, date);
      });
      const stage = u.el('main', 'ds-stage', workspace);
      const endButton = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit'; b.title = label; b.setAttribute('aria-label', label);
        b.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      const decoy = (parent, text, collideWord) => {
        const b = u.el('button', 'ds-xtra', parent, text); b.type = 'button'; b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collideWord ? { label: text, collide: true } : { label: text }));
      };
      let submit = null;
      const shelf = u.el('footer', 'ds-footer', document.body);
      u.el('span', 'ds-footer-place', shelf, 'Riverton Public Library');
      const links = u.el('nav', 'ds-footer-links', shelf);
      ['Help', 'Contact', 'Privacy'].forEach((x, i) => { if (i) u.el('span', 'ds-sep', links, '|'); u.el('span', '', links, x); });
      const controls = u.el('div', 'ds-controls', shelf);
      if (collide && placement !== 'header') decoy(controls, collide, true);
      if (placement === 'footer') submit = endButton(controls, 'ds-submit', label);
      if (placement === 'link') submit = endButton(controls, 'ds-endlink', label);
      if (placement === 'icon') submit = endButton(controls, 'ds-submit ds-submit-icon', '✓');
      if (placement === 'header') {
        const tools = u.el('div', 'ds-head-tools', top);
        if (collide) decoy(tools, collide, true);
        submit = endButton(tools, 'ds-submit ds-submit-head', label);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
