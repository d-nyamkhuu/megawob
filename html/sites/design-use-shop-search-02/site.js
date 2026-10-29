(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-search-02',
    'brand': 'MarketFind 2.1',
    'mode': 'twin',
    'tokens': {
      'bg': '#3c281b',
      'panel': '#f2eee3',
      'fg': '#15110d',
      'accent': '#9d7628',
      'font': 'Georgia,serif',
      'line': '#bbb8ae',
      'muted': '#5f6a78',
    },
    'nav': 'File    Edit    View    Tools    Help',
    'obstruction': null,
    'footer': '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      const controls = u.el('div', 'window-controls', header);
      for (const glyph of ['−', '□', '×']) u.el('span', 'window-control', controls, glyph);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const detail = u.el('aside', 'side-detail', body);
      u.el('h2', '', detail, 'Item Details');
      u.el('p', 'detail-empty', detail, 'Select a search result\nto view details.');
      let submit = null;
      let placement = null;
      let label = 'Submit';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const textOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
        const original = labels.find((x) => textOf(x).trim().toLowerCase() === 'submit') || labels[0];
        if (er.bool(0.5)) {
          placement = 'footer';
          label = textOf(original);
        } else {
          placement = er.pick(['footer', 'header', 'link']);
          const alternatives = labels.filter(
            (x) => textOf(x).trim().toLowerCase() !== textOf(original).trim().toLowerCase(),
          );
          label = textOf(er.pick(alternatives.length ? alternatives : labels));
        }
      }
      if (ctx.display === 'panel' && !note.hidden) {
        note.classList.add('panel-instruction');
        detail.insertBefore(note, detail.firstChild);
      }
      if (ctx.display === 'toast' && !note.hidden) footer.insertBefore(note, footer.firstChild);
      const headerTools = u.el('div', 'chrome-tools', header);
      const footerTools = u.el('div', 'chrome-tools footer-tools', footer);
      const decoyBtn = (parent, text, collide) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
      };
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels =
            ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
              ? ctx.content.END_LABELS
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
          const norm = (x) =>
            String(typeof x === 'string' ? x : x.label || x.text || x.name || x)
              .trim()
              .toLowerCase();
          const options = [...new Map(labels.map((x) => [norm(x), x])).values()].filter(
            (x) => norm(x) !== label.trim().toLowerCase(),
          );
          if (options.length) {
            const x = cr.pick(options),
              collide = typeof x === 'string' ? x : x.label || x.text || x.name || String(x);
            decoyBtn(cr.pick([headerTools, footerTools]), collide, true);
          }
        }
        if (placement === 'header') {
          submit = u.el('button', 'end-control header-end', headerTools, label);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'footer') {
          submit = u.el('button', 'end-control', footerTools, label);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        } else {
          submit = u.el('a', 'end-link', footerTools, label + ' ›');
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
      } else footer.classList.add('finish-mode');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
