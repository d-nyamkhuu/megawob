(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-terminal-01',
    'brand': 'Terminal',
    'mode': 'perimeter',
    'tokens': {
      'bg': '#2461ad',
      'panel': '#ffffff',
      'fg': '#101010',
      'accent': '#1763c8',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'Shell      Edit      View      Window      Help',
    'obstruction': null,
    'footer': '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: ['assets/icons.js'],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const noteIcon = u.el('span', 'note-icon', note);
      const stage = u.el('main', 'stage', body);
      const icon = (n) => window.AquaIcon(n);
      noteIcon.innerHTML = icon('terminal');
      const tl = '<i class="tl"></i><i class="tl"></i><i class="tl"></i>';
      const row = (c, t, s) =>
        '<div class="lrow' +
        (s ? ' sel' : '') +
        '"><span class="lic ' +
        c +
        '">' +
        icon(c === 'home' ? 'home' : c === 'mac' ? 'computer' : c === 'desktop' ? 'desktop' : 'folder') +
        '</span>' +
        t +
        '</div>';
      const mk = (cls, h) => {
        const d = u.el('div', 'aw ' + cls, shell);
        d.innerHTML = h;
        return d;
      };
      mk(
        'aw-loc',
        '<div class="awt">' +
          tl +
          '</div><div class="lhead">&#9660; Locations</div>' +
          row('home', 'user') +
          row('mac', 'Applications') +
          row('fold', 'Documents') +
          row('fold', 'misc', 1) +
          row('desktop', 'Desktop'),
      );
      const help = mk(
        'aw-help',
        '<div class="awt">' +
          tl +
          '<b class="srch"></b></div><div class="hh">Help</div><div class="hb">Terminal Basics</div><div class="hl">Working with files<span>&rsaquo;</span></div><div class="hl">File permissions<span>&rsaquo;</span></div><div class="hl">Common commands<span>&rsaquo;</span></div><div class="hl">More help...<span>&rsaquo;</span></div>',
      );
      mk(
        'aw-hint',
        '<div class="awt">' +
          tl +
          '</div><div class="hint"><span class="bulb">' +
          icon('bulb') +
          '</span><div><div>Hints</div><div>Use a command like rm to delete a file.</div></div></div>',
      );
      const apple = u.el('span', 'apple-icon', header);
      apple.innerHTML = icon('apple');
      const vol = u.el('span', 'volume-icon', header);
      vol.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3z" fill="#344053"/><path d="M15 7q6 5 0 10m3-13q9 8 0 16" fill="none" stroke="#344053" stroke-width="2"/></svg>';
      u.el('span', 'menu-search', header);
      const mb = u.el('div', 'mbar-r', shell, 'Mon Apr 23   10:24 AM');
      u.el('div', 'trash-i', shell).innerHTML = icon('trash');
      u.el('div', 'trash-l', shell, 'Trash');
      const dock = u.el('div', 'dock', shell);
      for (const c of ['finder', 'safari', 'mail', 'calendar', 'music', 'preview', 'prefs', 'terminal']) {
        const d = u.el('i', 'dk ' + c, dock);
        d.innerHTML = icon(c);
      }
      u.el('b', 'dsep', dock);
      u.el('i', 'dk doc', dock).innerHTML = icon('document');
      u.el('i', 'dk can', dock).innerHTML = icon('trash');
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, '');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placement = er.pick(['side', 'side', 'rail', 'low']);
        const choices = ctx.content && ctx.content.END_LABELS;
        const labels = (
          choices && choices.length
            ? choices
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const submitLabel = labels.find((x) => String(x).trim().toLowerCase() === 'submit') || 'Submit';
        const alternates = labels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
        const label = er.bool(0.5) ? submitLabel : er.pick(alternates.length ? alternates : labels);
        const makeEnd = (parent, cls) => {
          const b = u.el('button', 'end-control ' + cls, parent, label);
          b.type = 'button';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'side') {
          const sub = mk('aw-sub', '<div class="awt">' + tl + '</div>');
          submit = makeEnd(footer, 'end-side');
        } else if (placement === 'rail') {
          submit = makeEnd(footer, 'end-rail');
        } else submit = makeEnd(footer, 'end-low');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = (
            choices && choices.length
              ? choices
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const own = String(label).trim().toLowerCase();
          const options = [...new Set(pool)].filter((x) => String(x).trim().toLowerCase() !== own);
          if (options.length) {
            const decoy = cr.pick(options);
            const b = u.el('button', 'end-xtra', help, decoy);
            b.type = 'button';
            b.addEventListener('click', () => env.log('decoy', { label: decoy, collide: true }));
          }
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
