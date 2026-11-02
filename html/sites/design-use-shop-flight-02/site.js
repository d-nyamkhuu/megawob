(function () {
  'use strict';
  const palette = {
    bg: '#00858d', panel: '#efe9d3', fg: '#10104c',
    muted: '#626675', line: '#d1cec5',
  };

  // Preserve the original emphasis only inside the template's instruction.
  function styleNote(note, display) {
    if (!note) return;
    note.dataset.display = display;
    const text = note.textContent;
    const route = /from:?\s+(.+?)\s+to:?\s+(.+?)(?=\s+on\b|,?\s*\d{1,2}\/\d{1,2}\/\d{4}\b|[?!.]|$)/i.exec(text) ||
      /^\s*(.+?)\s*(?:→|->)\s*(.+?),/.exec(text);
    const date = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/.exec(text);
    if (!route || !date) return;
    const marks = [route[1], route[2], date[0]]
      .map(value => ({ value, pos: text.indexOf(value) }))
      .filter(mark => mark.pos >= 0).sort((a, b) => a.pos - b.pos);
    note.textContent = '';
    let at = 0;
    for (const mark of marks) {
      if (mark.pos < at) continue;
      note.append(text.slice(at, mark.pos));
      const hot = document.createElement('span');
      hot.className = 'hot';
      hot.textContent = mark.value;
      note.append(hot);
      at = mark.pos + mark.value.length;
    }
    note.append(text.slice(at));
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original toast is an in-flow notice, including on short screens.
      if (_c.ctx.display === 'toast') _c.display = 'toast';
      if (_c.display === 'panel' && _c.H < 720) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', 'Georgia,serif');
      document.body.classList.add('top', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'sw-titlebar', header);
      ['min', 'max', 'close'].forEach((t) => u.el('span', 'sw-wb ' + t, tb));
      const br = u.el('div', 'sw-brandrow', header);
      u.el('div', 'sw-globe', br);
      const bb = u.el('div', 'sw-brandbox', br);
      u.el('div', 'design-brand', bb, 'SkyWays Travel');
      u.el('div', 'sw-tag', bb, 'Explore More');
      const nav = u.el('nav', 'design-nav', br);
      'Flights    Hotels    Cars    Destinations'
        .trim()
        .split(/\s{2,}/)
        .forEach((t) => u.el('span', '', nav, t));
      const tabs = u.el('div', 'sw-tabs', header);
      ['Search Flights', 'View Results', 'Traveler Info', 'Payment', 'Confirmation'].forEach((t, i) => {
        const tab = u.el('span', 'sw-tab' + (i ? '' : ' on'), tabs);
        u.el('span', 'sw-tab-label', tab, t);
      });
      const pal = u.el('aside', 'sw-palette', document.body);
      const pt = u.el('div', 'sw-ptitle', pal);
      const paper = u.el('span', 'sw-plan-icon', pt);
      paper.innerHTML =
        '<svg viewBox="0 0 30 34" aria-hidden="true"><path d="M6 2L28 6l-7 27L1 29z" fill="#110e29"/><path d="M8 1l20 5-8 25L2 27z" fill="#d5bc7b" stroke="#332714"/><path d="M9 2l17 4-7 22-15-4z" fill="#fffbed"/><path d="M12 1l-2 5M16 2l-2 5M20 3l-2 5M24 4l-2 5" stroke="#7b683b" stroke-width="1.3"/><path d="M10 10l12 3M9 13l12 3M8 16l12 3M7 19l12 3" stroke="#756955" stroke-width="1.1"/></svg>';
      u.el('span', 'sw-plan-title', pt, 'Trip Plan');
      const pb = u.el('span', 'sw-pb', pt);
      ['min', 'close'].forEach((t) => u.el('span', 'sw-wb ' + t, pb));
      const pbody = u.el('div', 'sw-pbody', pal);
      [
        ['From:', '—'],
        ['To:', '—'],
        ['Date:', '—'],
        ['Trip:', 'One-way'],
        ['Passengers:', '1'],
      ].forEach(([k, v]) => {
        const r = u.el('div', 'sw-prow', pbody);
        u.el('b', '', r, k);
        const value = u.el('span', '', r, v);
        value.dataset.trip = k.replace(':', '').toLowerCase();
      });
      u.el('hr', '', pbody);
      u.el('div', 'sw-prow sel', pbody).append(
        Object.assign(document.createElement('b'), { textContent: 'Selected Flight:' }),
      );
      const selected = u.el('div', 'sw-prow sw-selected', pbody, '(none yet)');
      selected.dataset.role = 'trip-selection';
      Object.assign(_c, { shell, toolbar: tb, pbody });
      // The note belongs above the stage, rather than in the brand strip.
      const body = u.el('div', 'design-body', shell);
      shell.classList.toggle('panel-note-in-palette', _c.display === 'panel');
      Object.assign(_c, { body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        styleNote(note, _c.display);
      }
      _c.header.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.prepend(_c.headerTools);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.pbody;
      base(_c);
      _c.body = body;
      const panel = _c.pbody.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('plan-instruction');
        panel.querySelector('.ref-panel-title').textContent = 'Travel request';
        styleNote(panel.querySelector('.ref-panel-text'), _c.display);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      if (_c.display !== 'header' && _c.display !== 'toast') _c.body.classList.add('sw-no-note');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        _c.body.prepend(note);
        styleNote(note.querySelector('.ref-note-text'), _c.display);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const shell = _c.shell;
      const footer = u.el('footer', 'design-footer', shell);
      const fn = u.el('nav', 'footer-nav', footer);
      const icons = [
        '<path d="M23 10V3h5v11" fill="url(#metal)" stroke="#151535"/><path d="M6 16l10-9 11 9v15H6z" fill="url(#metal)" stroke="#151535"/><path d="M1 15L16 2l16 13-3 3L16 7 4 18z" fill="url(#metal)" stroke="#151535"/><path d="M12 31V20h8v11" fill="#282174" stroke="#141432"/><path d="M8 18v11M8 18l7-6" fill="none" stroke="#fff" stroke-width=".7"/>',
        '<path d="M20 20l10 10" stroke="#10102b" stroke-width="7"/><path d="M20 20l10 10" stroke="url(#metal)" stroke-width="5"/><circle cx="12.5" cy="12.5" r="10" fill="#10205a" stroke="#141529" stroke-width="5"/><circle cx="12.5" cy="12.5" r="10" fill="none" stroke="url(#metal)" stroke-width="3.5"/><path d="M5 9q2-6 9-5" fill="none" stroke="#fffbe5" stroke-width="1"/>',
        '<path d="M12 9V4q0-2 2-2h7q2 0 2 2v5" fill="none" stroke="#14142d" stroke-width="4"/><path d="M12 9V4q0-2 2-2h7q2 0 2 2v5" fill="none" stroke="#f8f7ee" stroke-width="2"/><rect x="3" y="9" width="28" height="23" rx="2" fill="url(#metal)" stroke="#171733"/><path d="M8 10v20M26 10v20" fill="none" stroke="#5d596b" stroke-width="2"/><path d="M10 10v20M28 10v20" fill="none" stroke="#fff" stroke-width=".8"/>',
        '<path d="M1 7q7-4 16 1 8-5 16-1v25q-8-4-16 0-8-4-16 0z" fill="#b9b8c4" stroke="#13132f"/><path d="M3 5q7-4 14 2v23q-7-5-14-2zM17 7q7-6 14-2v23q-7-3-14 2z" fill="url(#metal)" stroke="#494456"/><path d="M17 8v22M5 7v19M29 7v19" fill="none" stroke="#fff" stroke-width=".8"/>',
        '<path d="M13 2h6l1 5 4-2 4 4-2 4 5 1v6l-5 1 2 4-4 4-4-2-1 5h-6l-1-5-4 2-4-4 2-4-5-1v-6l5-1-2-4 4-4 4 2z" fill="url(#metal)" stroke="#17152e"/><circle cx="16" cy="17" r="5.5" fill="#242078" stroke="#fff" stroke-width=".8"/>',
      ];
      ['Home', 'Search', 'My Trips', 'Travel Guides', 'Preferences'].forEach((t, i) => {
        const b = u.el('span', 'sw-navbtn' + (i === 1 ? ' active' : ''), fn);
        b.innerHTML =
          '<svg viewBox="0 0 34 34" aria-hidden="true"><defs><linearGradient id="sw-metal-' +
          i +
          '" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset=".4" stop-color="#f0efe5"/><stop offset=".62" stop-color="#c2c1c3"/><stop offset="1" stop-color="#eeeeea"/></linearGradient></defs>' +
          icons[i].replaceAll('#metal', '#sw-metal-' + i) +
          '</svg>';
        u.el('span', '', b, t);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').remove();
      footer.append(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.insertBefore(dock, _c.toolbar.querySelector('.sw-wb'));
    },
    overlay: () => (ctx) => {

      const u = ctx.util;
      const named = null;
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
  };
  env.site({
    name: 'design-use-shop-flight-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-shop-flight-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#282075'],
      LOW_ACCENTS: ['#282075'],
      parts,
    },
  });
})();
