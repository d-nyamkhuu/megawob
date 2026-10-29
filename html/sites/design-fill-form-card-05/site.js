(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-05',
    'brand': 'Riverside Manufacturing',
    'sub': 'CLIENT INFORMATION SYSTEM',
    'title': 'Data Entry Task',
    'instruction': 'top',
    'menu': 'Home|Clients|Orders|Reports|Administration',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brandbox', top);
      u.el('div', 'ds-brand', brand, C.brand);
      u.el('div', 'ds-brandsub', brand, C.sub);
      const links = u.el('div', 'ds-toplinks', top);
      links.innerHTML = 'Welcome, <b>jsmith</b><i>|</i>Help<i>|</i>Log Out';
      u.el('div', 'ds-date', top, 'Thu, Apr 15, 1999');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const side = u.el('aside', 'ds-side', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      const panel = u.el('section', 'ds-panel', content);
      const title = u.el('h1', 'ds-title', panel, C.title);
      if (mode === 'top' || mode === 'left' || mode === 'right') {
        const b = u.el('div', 'ds-header-note', panel);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      if (mode === 'toast') {
        const t = u.el('aside', 'ds-toast', panel);
        u.el('div', 'ds-instruction', t, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', panel);
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', panel);
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endR.bool(0.5);
      const placement = referenceEnd ? 'form' : endR.pick(['header', 'inspector']);
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endWords);
      function endControl(parent, cls, link = false) {
        const b = u.el(link ? 'a' : 'button', 'ds-submit ' + cls, parent, endLabel);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      if (!ctx.finish && placement !== 'inspector')
        submit = endControl(placement === 'form' ? foot : title, placement === 'form' ? '' : 'ds-header-end');
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const pool = endWords.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = collideR.pick(pool);
          const tools = u.el('div', 'ds-navtools', nav);
          const b = u.el('button', 'ds-cancel ds-xtra', tools, label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      function box(title, parent) {
        const p = u.el('section', 'ds-box', parent);
        u.el('h3', '', p, title);
        return p;
      }
      const td = box('Task Details', side);
      const tb = u.el('table', 'ds-kv', td);
      [
        ['Task ID:', 'C-1047'],
        ['Task type:', 'Form entry'],
        ['Due date:', 'Apr 15, 1999'],
        ['Status:', 'Not started'],
      ].forEach(([k, v]) => {
        const r = u.el('tr', '', tb);
        u.el('th', '', r, k);
        u.el('td', '', r, v);
      });
      if (!ctx.finish && placement === 'inspector') {
        const row = u.el('div', 'ds-inspector-actions', td);
        submit = endControl(row, 'ds-endlink', true);
      }
      if (mode !== 'hidden') {
        const ins = box('Instructions', side);
        if (mode === 'panel') ins.classList.add('ds-panel-note');
        u.el('p', '', ins, ctx.instruction);
      }
      const fn = box('Field Notes', side);
      u.el(
        'p',
        '',
        fn,
        'Leave a field empty if its information is not mentioned in the profile. Copy only the information provided.',
      );
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
