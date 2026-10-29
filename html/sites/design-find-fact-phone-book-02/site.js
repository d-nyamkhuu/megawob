(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-02',
    'brand': 'Contact Book',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': 'Contacts|Calendar|Notes|Settings',
    'menu': '',
    'briefTitle': 'Instructions',
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
      const endR = ctx.rng.fork('chrome/end');
      const labels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete']
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const primary = endR.bool(0.5);
      const placement = ctx.finish ? null : primary ? 'footer' : endR.pick(['header', 'link']);
      const label = ctx.finish ? null : primary ? 'Submit' : endR.pick(labels);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = { label: collideR.pick(options), where: collideR.pick(['header', 'footer']) };
      }
      const makeEnd = (parent, link) => {
        const b = u.el(link ? 'a' : 'button', link ? 'ds-endlink' : 'ds-submit', parent, label);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      const makeDecoy = (parent) => {
        const b = u.el('button', 'ds-xtra', parent, collide.label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
        return b;
      };
      const top = u.el('header', 'ds-top', document.body);
      const apple = u.el('span', 'ds-brand', top);
      apple.innerHTML =
        '<svg viewBox="0 0 32 36" aria-label="Apple"><path d="M19 8c0-4 3-7 7-7 0 4-3 7-7 7ZM25 10c-4-2-6 0-9 0-3 0-5-2-8 0-9 5-4 22 3 24 3 1 4-2 7-2s4 3 7 1c3-2 5-6 6-9-7-2-8-10-1-13Z"/></svg>';
      ['File', 'Edit', 'View', 'Special', 'Help'].forEach((t) => u.el('span', 'ds-mi', top, t));
      const statusIcon = u.el('span', 'ds-status-icon', top);
      statusIcon.innerHTML =
        '<svg viewBox="0 0 24 30" fill="white" stroke="black" stroke-width="2"><path d="M4 7h4V2h12v25H2V7h2Zm4 0v8h9V7ZM6 19h10v5H6Z"/><path d="m10 8 4-4 3 4-3 5Z" fill="black"/></svg>';
      u.el('span', 'ds-clock', top, '10:24 AM');
      ['Macintosh HD|hd', 'Notes|notes', 'Trash|trash'].forEach((s) => {
        const p = s.split('|');
        const ic = u.el('div', 'ds-icon ds-icon-' + p[1], document.body);
        const glyph = u.el('div', 'ds-glyph', ic);
        const paths = {
          hd: '<path d="M10 7h40l3 31H7Z"/><path d="M4 39h52v15H4Z"/><path d="M19 7v5h23V7M39 45h10v4H39Z"/>',
          notes:
            '<path d="M10 2h31l13 14v44H10Z"/><path d="M41 2v15h13M18 23h27M18 30h27M18 37h27M18 44h27M18 51h27"/>',
          trash: '<path d="M12 15h38l-3 45H16Z"/><path d="M8 10h46v6H8ZM20 10V5h23v5M22 23v30M30 23v30M38 23v30"/>',
        };
        glyph.innerHTML =
          '<svg viewBox="0 0 64 64" fill="white" stroke="black" stroke-width="3" stroke-linejoin="miter">' +
          paths[p[1]] +
          '</svg>';
        u.el('span', '', ic, p[0]);
      });
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const tb = u.el('div', 'ds-titlebar', content);
      u.el('span', 'ds-close', tb);
      u.el('span', 'ds-ttl', tb, C.brand);
      if (placement === 'header' || (collide && collide.where === 'header')) {
        const tools = u.el('div', 'ds-title-tools', tb);
        if (collide && collide.where === 'header') makeDecoy(tools);
        if (placement === 'header') submit = makeEnd(tools, false);
      }
      const natural = C.instruction;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      if (document.body.clientWidth <= 1100 && mode === 'left') mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const side = u.el('div', 'ds-side', main);
      u.el('div', '', side, 'Search:');
      const searchBox = u.el('input', 'ds-sbox', side);
      searchBox.type = 'text';
      searchBox.readOnly = true;
      searchBox.setAttribute('aria-label', 'Search contacts');
      searchBox.title = 'Search is available in search episodes';
      u.el('div', '', side, 'Groups:');
      const gl = u.el('div', 'ds-groups', side);
      ['All Contacts', 'Friends', 'Work', 'Family', 'Other'].forEach((t, i) => u.el('div', i ? '' : 'sel', gl, t));
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-contact-total', foot, 'Contacts');
      if (!ctx.finish) {
        if (collide && collide.where === 'footer') {
          const d = makeDecoy(foot);
          d.classList.add('ds-footer-xtra');
        }
        if (placement === 'footer') submit = makeEnd(foot, false);
        else if (placement === 'link') {
          const link = makeEnd(foot, true);
          link.textContent = label + ' ›';
          submit = link;
        }
      }
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
