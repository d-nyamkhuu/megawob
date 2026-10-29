(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-08',
    'brand': 'Files',
    'mode': 'side-left',
    'tokens': {
      'bg': '#f1ede7',
      'panel': '#fffefb',
      'fg': '#2e2a25',
      'accent': '#e8761a',
      'font': 'Ubuntu,Cantarell,Segoe UI,Arial,sans-serif',
      'line': '#d6cfc0',
      'muted': '#6b645a',
      'button-fg': '#000',
    },
    'nav': 'Terminal    Edit    Settings    Help',
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
      let display = ctx.display;
      if ((display === 'panel' || display === 'toast') && window.innerWidth < 1200) display = 'header';
      document.body.className = 'instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const tt = u.el('div', 'g-title', shell);
      u.el('span', 'logo', tt).innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linejoin="round"><path d="M12 4l7 4v8l-7 4-7-4V8Z M5 8l7 4 7-4 M12 12v8 M9 6l7 4"/></svg>';
      u.el('span', 'ttl', tt, 'Files - Projects');
      const wb = u.el('span', 'wb', tt);
      u.el('i', 'mn', wb);
      u.el('i', 'mx', wb);
      u.el('i', 'cl', wb);
      const mn = u.el('nav', 'g-menu', shell);
      for (const t of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help']) u.el('span', '', mn, t);
      const body = u.el('div', 'design-body', shell);
      const stage = u.el('main', 'stage', body);
      const tool = u.el('div', 'g-tool', body);
      const ar = (c, d) =>
        '<svg viewBox="0 0 34 30"><path d="' +
        d +
        '" fill="' +
        c +
        '" stroke="#a05a10" stroke-width="1.5" stroke-linejoin="round"/></svg>';
      const b1 = u.el('span', 'tb', tool);
      b1.innerHTML = ar('#f0a14b', 'M2 15l13-12v7h17v10H15v7z') + 'Back';
      const b2 = u.el('span', 'tb dis', tool);
      b2.innerHTML = ar('#d8d3c8', 'M32 15L19 3v7H2v10h17v7z') + 'Forward';
      const b3 = u.el('span', 'tb', tool);
      b3.innerHTML = ar('#f0a14b', 'M17 1l14 13h-8v15H11V14H3z') + 'Up';
      const loc = u.el('span', 'loc', tool);
      u.el('span', '', loc, '/home/user/projects');
      u.el('span', 'tb', tool).innerHTML =
        '<svg viewBox="0 0 34 30"><circle cx="14" cy="13" r="8" fill="#fff" stroke="#555" stroke-width="2.5"/><path d="M20 19l9 8" stroke="#555" stroke-width="3.5" stroke-linecap="round"/></svg>Search';
      const vw = u.el('span', 'vw', tool);
      u.el('b', 'on', vw);
      u.el('b', '', vw);
      const cols = u.el('div', 'g-cols', body);
      [
        ['Name', '1%'],
        ['Size', '54.5%'],
        ['Type', '63.5%'],
        ['Modified', '81.5%'],
      ].forEach((c) => {
        const s = u.el('span', '', cols, c[0]);
        s.style.left = c[1];
      });
      const note = u.el('section', 'task-note mode-' + display, body);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        u.el('p', '', note, ctx.instruction);
      } else note.classList.add('no-instruction');
      const act = u.el('div', 'g-act', note);
      u.el('h3', '', act, 'Actions');
      u.el('div', '', act).innerHTML = '<i></i><span>Use the pointer to click items</span>';
      u.el('div', '', act).innerHTML = '<i class="kb"></i><span>You can use the keyboard (shortcuts work)</span>';
      u.el('div', '', act).innerHTML = '<i></i><span>Use the mouse wheel to scroll if needed</span>';
      const footer = u.el('footer', 'g-foot', note);
      const content = ctx.content || {};
      const labels =
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['footer', 'footer', 'footer', 'footer', 'toolbar', 'link', 'title', 'icon']);
      const submitLabel = labels.find((x) => labelText(x).trim().toLowerCase() === 'submit');
      const label = er.bool(0.5) ? labelText(submitLabel || 'Submit') : labelText(er.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const pool = labels.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = labelText(collideR.pick(pool));
      }
      let submit = null;
      const decoy = (parent, text) => {
        const b = u.el('button', 'xtra-control', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (collide && placement === 'toolbar') decoy(tool, collide);
      else if (collide) decoy(footer, collide);
      if (!ctx.finish) {
        const parent =
          placement === 'toolbar' ? tool : placement === 'link' ? act : placement === 'title' ? tt : footer;
        const cls =
          placement === 'link'
            ? 'end-link'
            : placement === 'title'
              ? 'title-end'
              : placement === 'icon'
                ? 'end-icon'
                : 'end-control';
        const text = placement === 'link' ? label + ' ›' : placement === 'icon' ? '✓' : label;
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
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
