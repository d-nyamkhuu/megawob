(function () {
  'use strict';
  const palette = { bg: '#7c89ac', panel: '#d4d4d4', fg: '#080c14', muted: '#555555', line: '#909198' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated Task window accommodates every instruction display.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ol-display-header', 'ol-display-panel', 'ol-display-toast', 'ol-display-hidden');
      document.body.classList.add('ol-display-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const D = document.body;
      D.classList.add('ol');
      const icons = {
        Home: '<path d="M3 13V4h18l5 5h24v38H3z" fill="#d6d6cd"/><path d="M3 13h48v34H3z" fill="#c6c6c3"/><path d="M5 15h44M6 17v27" stroke="white"/>',
        Applications:
          '<path d="M4 4h45v43H4z" fill="#bbbdbb"/><path d="M5 18h43M5 32h43"/><path d="M8 7h37M8 21h37M8 35h37" stroke="white"/><path d="M10 12h4m-4 14h4m-4 14h4m25-28h3m-3 14h3m-3 14h3"/>',
        Terminal:
          '<rect x="3" y="4" width="47" height="40" rx="2" fill="#c6c6c6"/><path d="M9 10h35v26H9z" fill="#192b4d"/><path d="m13 14 3 3-3 3m7 2h5" stroke="#d7e5fb"/><path d="M8 46h39"/>',
        Contacts:
          '<path d="M6 5h41v42H6z" fill="#ddd"/><path d="M8 8h37M8 11h37"/><circle cx="17" cy="21" r="4" fill="#6b7682"/><path d="M12 31q0-10 10-1M29 19h12M29 25h12M29 31h8M13 38h28"/>',
        Groups:
          '<g fill="#c1d0e3"><circle cx="12" cy="12" r="6"/><circle cx="27" cy="14" r="6"/><circle cx="42" cy="12" r="6"/><path d="M5 45V25q7-10 14 0v20zM20 46V27q7-10 14 0v19zM35 45V25q7-10 14 0v20z"/></g><path d="m8 7 5-2m10 4 6-2m9 0 5-2" stroke="white"/>',
        Directory:
          '<path d="M9 5h35v36l-7 8H9z" fill="#ddd"/><path d="M37 48V39h7M14 15h25M14 22h25M14 29h21M14 36h14M14 2v9M22 2v9M30 2v9M38 2v9"/>',
        calendar:
          '<rect x="5" y="8" width="41" height="39" fill="#ddd"/><path d="M5 19h41M14 4v10M37 4v10M13 25h25M13 32h25M13 39h25M20 22v21M30 22v21"/>',
      };
      function icon(parent, name, cls) {
        const n = u.el('i', 'ol-art ' + (cls || ''), parent);
        n.innerHTML =
          '<svg viewBox="0 0 54 54" aria-hidden="true" fill="none" stroke="#25272b" stroke-width="1.5" stroke-linejoin="round">' +
          icons[name] +
          '</svg>';
        return n;
      }
      function sunmark(parent) {
        const n = u.el('i', 'ol-sunmark', parent);
        const motif = 'M12 36V14Q12 10 16 10H36M20 36V22Q20 18 24 18H36M28 36V30Q28 26 32 26H36';
        n.innerHTML =
          '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><g transform="rotate(-45 40 40)">' +
          [0, 90, 180, 270].map((a) => '<path transform="rotate(' + a + ' 40 40)" d="' + motif + '"/>').join('') +
          '</g></svg>';
      }
      ['Home', 'Applications', 'Terminal'].forEach((t, i) => {
        const ic = u.el('div', 'ol-icon', D);
        ic.style.top = 1.7 + i * 12.4 + '%';
        icon(ic, t);
        u.el('span', '', ic, t);
      });
      const sun = u.el('div', 'ol-sun', D);
      sunmark(sun);
      u.el('b', '', sun, 'Sun');
      u.el('span', '', sun, 'Workstation');
      const w1 = u.el('section', 'ol-win ol-w1', D);
      const t1 = u.el('div', 'ol-title', w1);
      u.el('i', 'ol-pin', t1, '📌');
      u.el('span', '', t1, 'Contact Book');
      u.el('em', '', t1, '▾');
      u.el('em', '', t1, '×');
      const m1 = u.el('div', 'ol-menu', w1);
      ['File', 'Edit', 'View', 'Actions'].forEach((t) => u.el('span', '', m1, t));
      u.el('span', 'ol-help', m1, 'Help');
      const b1 = u.el('div', 'ol-wbody', w1);
      const rail = u.el('aside', 'ol-side', b1);
      ['Contacts', 'Groups', 'Directory'].forEach((t, i) => {
        const d = u.el('div', 'ol-nav' + (i ? '' : ' on'), rail);
        icon(d, t);
        u.el('span', '', d, t);
      });
      const ab = u.el('div', 'ol-actions', w1);
      ['New Contact...', 'Edit...', 'Delete', 'Import...'].forEach((t) => {
        const x = u.el('span', '', ab, t);
      });
      const w2 = u.el('section', 'ol-win ol-w2', D);
      const t2 = u.el('div', 'ol-title', w2);
      u.el('i', 'ol-pin', t2, '📌');
      u.el('span', '', t2, 'Task');
      u.el('em', '', t2, '–');
      u.el('em', '', t2, '×');
      const m2 = u.el('div', 'ol-menu', w2);
      ['File', 'Edit'].forEach((t) => u.el('span', '', m2, t));
      u.el('span', 'ol-help', m2, 'Help');
      const noteHost = u.el('div', 'ol-note-host', w2);
      const fb = u.el('div', 'ol-btns', w2);
      Object.assign(_c, { header: noteHost, noteHost, fb, w2, b1, icon, sunmark });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ol-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.fb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.b1; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteHost;
      base(_c);
      _c.body = body;
      const panel = _c.noteHost.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ol-note', 'ol-note-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task Details';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage ol-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ol-note', 'ol-note-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.noteHost.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const D = document.body;
      const { icon, sunmark } = _c;
      const tb = u.el('footer', 'ol-task', D);
      const brand = u.el('b', '', tb, 'Sun');
      sunmark(brand);
      ['One', 'Two', 'Three', 'Four'].forEach((t, i) => u.el('span', 'ol-ws' + (i ? '' : ' on'), tb, t));
      const cb = u.el('span', 'ol-tb', tb, 'Contact Book');
      icon(cb, 'Contacts');
      const task = u.el('span', 'ol-tb', tb, 'Task');
      icon(task, 'Directory');
      const clock = u.el('span', 'ol-clock', tb, 'Mon Apr 6 1992   10:24 AM');
      icon(clock, 'calendar');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').remove();
      tb.insertBefore(foot, clock);
      _c.taskbar = tb;
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.fb.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-find-fact-phone-book-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-phone-book-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#91a8d2'],
      LOW_ACCENTS: ['#91a8d2'],
      parts,
    },
  });
})();
