(function () {
  'use strict';
  const palette = { bg: '#3a2418', panel: '#faf8f2', fg: '#17130f', muted: '#514a40', line: '#cfc4ae' };
  function styleControls(parent, header) {
    parent.querySelectorAll('.ref-submit, .ref-endlink').forEach((el) => {
      el.classList.add('w-submit');
      if (header) el.classList.add('w-end-header');
      if (el.classList.contains('ref-endlink')) el.classList.add('w-end-link');
    });
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('bt'));
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('wood');
      const W = u.el('main', 'w-win', document.body);
      const tb = u.el('header', 'w-title', W);
      tb.innerHTML =
        '<svg width="30" height="26" viewBox="0 0 30 26"><path d="M4 22C8 10 16 4 27 3 24 12 16 19 8 21Z" fill="#ddd0a3" stroke="#8a6a3a"/><path d="M2 26 23 6M8 18l8-1M10 15l8-1M13 12l8-1M16 9l7-1M9 18l-1-5M12 15l-1-5M15 12l-1-4M18 9V6" fill="none" stroke="#685333" stroke-width=".7"/></svg><span>Notebook Pro</span><i class="wc"><b>&#8212;</b><b>&#9633;</b><b>&#10005;</b></i>';
      const bar = u.el('div', 'w-bar', W);
      const ph = u.el('div', 'w-menuslot', bar, 'Menu');
      ph.setAttribute('aria-hidden', 'true');
      const chev =
        '<svg class="chv" width="12" height="8" viewBox="0 0 12 8"><path d="m1 1 5 5 5-5" fill="none" stroke="#2a1d12" stroke-width="2"/></svg>';
      const sel1 = u.el('span', 'w-sel w-font', bar);
      sel1.innerHTML = '<span>Georgia</span>' + chev;
      const sel2 = u.el('span', 'w-sel w-size', bar);
      sel2.innerHTML = '<span>12</span>' + chev;
      const S = (d) =>
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2a1d12" stroke-width="2" stroke-linecap="round">' +
        d +
        '</svg>';
      const gap = () => u.el('span', 'w-gap', bar);
      ['B', 'I', 'U'].forEach((t, i) => u.el('span', 'w-tb w-' + t.toLowerCase(), bar, t));
      gap();
      const al = [
        S('<path d="M3 4h14M3 8h9M3 12h14M3 16h9"/>'),
        S('<path d="M3 4h14M8 8h9M3 12h14M8 16h9"/>'),
        S('<path d="M3 4h14M3 8h14M3 12h14M3 16h14"/>'),
      ];
      al.forEach((s, i) => {
        const e = u.el('span', 'w-tb w-al' + (i === 0 ? ' on' : ''), bar);
        e.innerHTML = s;
      });
      gap();
      const ls = [
        S('<path d="M8 5h9M8 10h9M8 15h9M3 5h.5M3 10h.5M3 15h.5"/>'),
        S('<path d="M8 5h9M8 10h9M8 15h9M3 4l1-1v4M3 9h2M3 14h2"/>'),
      ];
      ls.forEach((s) => {
        const e = u.el('span', 'w-tb w-ic', bar);
        e.innerHTML = s;
      });
      gap();
      const lk = u.el('span', 'w-tb w-ic', bar);
      lk.innerHTML = S('<path d="M8 12l4-4M9 6l1-1a3.5 3.5 0 0 1 5 5l-1 1M11 14l-1 1a3.5 3.5 0 0 1-5-5l1-1"/>');
      gap();
      const im = u.el('span', 'w-tb w-ic', bar);
      im.innerHTML = S('<rect x="3" y="4" width="14" height="12" rx="1"/><path d="m4 14 4-4 3 3 2-2 3 3"/>');
      const sr = u.el('span', 'w-search', bar);
      sr.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#2a1d12" stroke-width="2"><circle cx="8" cy="8" r="5.5"/><path d="m12 12 5 5"/></svg><span>Search documents...</span>';

      const sheet = u.el('section', 'w-sheet');
      sheet.dataset.display = _c.display;
      Object.assign(_c, { shell: W, sheet, header: tb });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.sheet;
      base(_c);
      _c.header = header;
      const note = _c.sheet.querySelector('.ref-instruction');
      if (note) note.classList.add('w-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.insertBefore(_c.headerTools, _c.header.querySelector('.wc'));
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'w-body', _c.shell);
      const idx = u.el('nav', 'w-index', body);
      for (let i = 1; i <= 20; i++) u.el('div', '', idx, String(i));
      body.appendChild(_c.sheet);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.sheet;
      base(_c);
      _c.body = body;
      const note = _c.sheet.querySelector('.ref-panel');
      if (note) {
        note.classList.add('w-note');
        note.dataset.display = 'panel';
      }
      const u = _c.util;
      const sheet = _c.sheet;
      const doc = u.el('div', 'w-doc', sheet);
      doc.innerHTML =
        '<h1>Project Notes</h1><p class="d">April 27, 2011</p><hr><h2>Ideas</h2><ul><li>Refine concept</li><li>Review feedback</li><li>Plan next steps</li></ul><h2>Next Steps</h2><div class="ck"><span></span>Finalize draft</div><div class="ck"><span></span>Prepare assets</div><div class="ck"><span></span>Schedule review</div>';

    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'w-stage', _c.shell);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('w-note');
        note.dataset.display = 'toast';
        _c.sheet.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('w-foot');
      _c.shell.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.innerHTML = '<span class="knob"></span><span class="st">Document: Untitled</span><span class="sep"></span><span class="st">Words: 24</span>';
      styleControls(foot, false);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock, false);
      }
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
    name: 'design-click-control-menu-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'wood.css'],
    design: {
      THEMES: { 'design-click-control-menu-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a98a45'],
      LOW_ACCENTS: ['#a98a45'],
      parts,
    },
  });
})();
