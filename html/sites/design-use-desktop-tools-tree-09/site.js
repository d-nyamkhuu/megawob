(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-09',
    'brand': 'Terminal',
    'mode': 'riso',
    'tokens': {
      'bg': '#efe7d4',
      'panel': '#f5efe0',
      'fg': '#1d3a45',
      'accent': '#8b1f35',
      'font': "'Roboto Condensed','Arial Narrow',Arial,sans-serif",
      'line': '#b9b3a2',
      'muted': '#6a6f72',
      'button-fg': '#fff',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': ['File Finder Updates', 'News, tips and updates for your workspace.', 'Close'],
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
      const left = u.el('aside', 'rs-left', shell);
      const brand = u.el('div', 'rs-brand', left);
      brand.innerHTML =
        '<svg viewBox="0 0 60 56"><defs><filter id="rs-riso"><feTurbulence baseFrequency=".55" numOctaves="1" seed="9"/><feColorMatrix values="0 0 0 0 .96 0 0 0 0 .93 0 0 0 0 .87 6 0 0 0 -2.7"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs><path d="M4 12h8l5-7h15l5 7h17l3 6-3 33H3z" fill="#74303d"/><path d="M5 18h48l-2 29H5z" fill="#853b48"/><path d="M4 12h8l5-7h15l5 7h17l3 6-3 33H3z" filter="url(#rs-riso)"/></svg>';
      u.el('span', '', brand, 'File Finder');
      u.el('h3', 'rs-h', left, 'Tools');
      const tools = u.el('div', 'rs-tools', left);
      const IC = {
        'New Folder': '<path d="M6 3h8l4 4v14H6z"/><path d="M9 11h6M9 14h6M9 17h6"/>',
        'Upload File': '<path d="M12 18V6M7 11l5-5 5 5M5 20h14"/>',
        'Delete': '<path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
      };
      for (const k of Object.keys(IC)) {
        const b = u.el('div', 'rs-tool', tools);
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#1d3a45" stroke-width="1.6">' + IC[k] + '</svg>';
        u.el('span', '', b, k);
      }
      const mid = u.el('div', 'rs-mid', shell);
      const note = u.el('section', 'task-note', mid);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        const ic = u.el('div', 'rs-target', note);
        ic.innerHTML =
          '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#6b1f2f" stroke-width="11"/><circle cx="50" cy="50" r="24" fill="#1d6f7d"/><circle cx="50" cy="50" r="9" fill="#efe6d2"/></svg>';
        const t = u.el('div', 'rs-ntext', note);
        u.el('div', 'rs-nlabel', t, 'Task');
        u.el('p', '', t, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', mid);
      const right = u.el('aside', 'rs-right', shell);
      u.el('h3', 'rs-h rs-dh', right, 'Details');
      const det = u.el('div', 'rs-det', right);
      det.innerHTML =
        '<svg viewBox="0 0 24 30" fill="none" stroke="#555" stroke-width="1.2"><path d="M3 1h12l6 6v22H3z"/><path d="M15 1v6h6M7 13h10M7 17h10M7 21h10"/></svg>';
      u.el('b', '', det, 'No file selected');
      u.el('span', '', det, 'Select a file to see details here.'); // Episode choices have independent streams; the task sampling is unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const placement = er.pick(['right', 'right', 'tools', 'left']);
      const label = placement === 'right' ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const footer = u.el('footer', 'design-footer', right);
      let submit = null;
      if (!ctx.finish) {
        const parent =
          placement === 'tools'
            ? tools
            : placement === 'left'
              ? u.el('footer', 'design-footer rs-left-footer', left)
              : footer;
        submit = u.el('button', 'end-control' + (placement === 'tools' ? ' rs-end-tool' : ''), parent, label);
        if (label.length > 9) submit.classList.add('rs-end-long');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (ctx.finish || placement !== 'right') footer.remove();
      if (ctx.display === 'panel' && window.innerWidth > 1400 && window.innerHeight >= 800) {
        right.insertBefore(note, det);
        document.body.classList.add('rs-note-panel');
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            b = u.el('button', 'rs-tool rs-xtra', tools, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
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
