(function () {
  'use strict';
  const cfg = {
    title: 'Document Editor - Untitled 1',
    theme: 'gtk',
    layout: 'inspector',
    tools: 'Menu    Edit    View    Insert    Format    Tools    Table    Help',
    side: 'Document|Title:|Format:|Words:|Characters:',
  };
  const palette = { bg: '#ebe8e0', panel: '#fff', fg: '#1c1c1c', muted: '#555', line: '#b9b5a8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'gtk', 'inspector');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const appIcon = u.el('span', 'gtk-appicon', title);
      appIcon.innerHTML =
        '<svg viewBox="0 0 24 28" fill="none" stroke="#61758e" stroke-width="1.3"><path d="M3 1h15l3 3v22H3z" fill="#eef3fa"/><path d="M17 1v5h4M6 8h6v5H6zM12 16h6v5h-6z" fill="#bbcadd"/><path d="M11 6h6v5h-6zM6 18h6v5H6z" fill="#fff"/><path d="M7 15h10M9 12v5M16 12v4"/></svg>';
      if (['qt', 'openlook', 'gtk', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.theme === 'openlook') {
        const badge = u.el('span', 'app-badge', title);
        badge.innerHTML =
          '<svg viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="15" rx="2" fill="#172335" stroke="#fff"/><path d="M7 5Q12 0 17 5M4 8v13h15" fill="none" stroke="#172335"/></svg>';
        u.el('span', 'sun-brand', title, '❖ Sun');
      }
      if (cfg.tools) {
        const tools = u.el('div', 'tools', head);
        cfg.tools.split(/ {2,}/).forEach((t) => {
          const label = u.el('span', 'tool-label', tools);
          u.el('u', '', label, t[0]);
          label.appendChild(document.createTextNode(t.slice(1)));
        });
        const tb = u.el('div', 'toolbar', head);
        const S = (d, x) =>
          '<span class="tb-ico' +
          (x || '') +
          '"><svg viewBox="0 0 24 24" fill="url(#gtk-paper)" stroke="#556273" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="gtk-paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d2d6db"/></linearGradient></defs>' +
          d +
          '</svg></span>';
        const L = (a) =>
          a.map((w, i) => '<path d="M' + (4 + (w[0] || 0)) + ' ' + (5 + i * 5) + 'h' + w[1] + '"/>').join('');
        tb.innerHTML =
          S('<path d="M6 3h8l4 4v14H6z"/>') +
          S('<rect x="5" y="5" width="14" height="16" rx="2"/><rect x="9" y="3" width="6" height="4"/>') +
          S('<path d="M7 9V3h10v6M6 17H3v-8h18v8h-3M7 14h10v7H7z"/>') +
          S('<path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 1 6 6" stroke="#9a9ea6"/>') +
          S('<path d="m15 7 5 5-5 5M20 12H10a6 6 0 0 0-6 6" stroke="#9a9ea6"/>') +
          '<span class="tb-sel wide">Sans <em>&#8964;</em></span><span class="tb-sel">12 <em>&#8964;</em></span><b>B</b><i>I</i><u>U</u>' +
          S(
            L([
              [0, 16],
              [0, 10],
              [0, 16],
              [0, 10],
            ]),
            ' on',
          ) +
          S(
            L([
              [2, 12],
              [0, 16],
              [2, 12],
              [0, 16],
            ]),
          ) +
          S(
            L([
              [4, 12],
              [0, 16],
              [4, 12],
              [0, 16],
            ]),
          ) +
          S(
            L([
              [0, 16],
              [0, 16],
              [0, 16],
              [0, 16],
            ]),
          ) +
          S(
            '<path d="M10 6h10M10 12h10M10 18h10"/><circle cx="5" cy="6" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="5" cy="18" r="1"/>',
          ) +
          S('<path d="M11 6h9M11 12h9M11 18h9M4 5h3v4M4 11h3l-3 3h3M4 17h3v4H4"/>') +
          S('<path d="M11 6h9M11 12h9M11 18h9M4 8l3 2-3 2"/>') +
          S('<path d="M11 6h9M11 12h9M11 18h9M7 8l-3 2 3 2"/>');
      }
      const center = u.el('section', 'center');
      Object.assign(_c, { shell, head, center, header: head.querySelector('.toolbar') });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const work = u.el('div', 'work', _c.shell);
      work.appendChild(_c.center);
      const aside = u.el('aside', 'inspector', work);
      cfg.side.split('|').forEach((s, i) => {
        const line = u.el(i === 0 ? 'h2' : 'p', '', aside);
        if (i === 1) {
          u.el('span', 'contact-empty', line, s);
          const portrait = u.el('span', 'portrait', line);
          portrait.innerHTML = '<svg viewBox="0 0 90 90"><circle cx="45" cy="29" r="14"/><path d="M24 76V61C24 37 66 37 66 61V76Z"/></svg>';
          line.prepend(portrait);
        } else line.textContent = s;
      });
      Object.assign(_c, { body: work, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) panel.classList.add('instruction', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('instruction-toast');
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('footer', 'footer', _c.shell);
      const ready = _c.util.el('span', 'ready', foot, 'Ln 1, Col 1');
      _c.util.el('span', '', ready, 'INS');
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      // Keep the toolbar's end control in place; ancillary buttons use the status bar.
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) {
        controls.querySelector('.ref-tools').prepend(button);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-menu-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'gtk.css'],
    design: {
      THEMES: { 'design-click-control-menu-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3f74b8'],
      LOW_ACCENTS: ['#3f74b8'],
      parts,
    },
  });
})();
