(function () {
  'use strict';
  const palette = { bg: '#fbf9f5', panel: '#fdfcfa', fg: '#1d1d1f', muted: '#6b6a68', line: '#d9d6d0' };
  function drawToolbar(u, tb) {
    const icons = [
      '<path d="M5 2h10l5 5v16H5z" fill="#ff7900"/><path d="M15 2v6h5M8 12h9M8 16h9M8 20h9" fill="none" stroke="white"/>',
      '<path d="M2 6h9l3 3h10v13H2z" fill="#777d82"/><path d="M2 11h23l-3 12H2z" fill="#777d82" stroke="#f4f4f4" stroke-width="1.5"/>',
      '<rect x="3" y="3" width="21" height="21" rx="2" fill="#777d82"/><path d="M8 3v8h11V3M8 24V15h12v9" fill="#f4f4f4"/><path d="M15 3v6" stroke="#777d82" stroke-width="3"/>',
      '<text x="3" y="23" font-family="Georgia" font-weight="bold" font-size="27" fill="#777d82">B</text>',
      '<text x="6" y="23" font-family="Georgia" font-weight="bold" font-style="italic" font-size="27" fill="#777d82">I</text>',
      '<path d="M8 5h17M8 13h17M8 21h17" stroke="#777d82" stroke-width="3"/><path d="M1 3h4v4H1zM1 11h4v4H1zM1 19h4v4H1z" fill="#777d82"/>',
    ];
    ['New Note', 'Open', 'Save', 'Bold', 'Italic', 'Bullets'].forEach((t, i) => {
      const b = u.el('span', 'ds-tool' + (i === 0 ? ' on' : ''), tb);
      b.innerHTML = '<svg width="26" height="26" viewBox="0 0 27 27">' + icons[i] + '</svg>';
      u.el('span', '', b, t);
      b.addEventListener('click', () => env.log('decoy', { label: t }));
    });
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook has its own briefing pane, including at narrow widths.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = '<svg width="26" height="26" viewBox="0 0 26 26"><rect x="1" y="1" width="24" height="24" rx="5" fill="#f26a1b"/><rect x="8" y="7" width="10" height="12" rx="1.5" fill="none" stroke="#fff" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand', top, 'Notebook');
      const wc = u.el('span', 'ds-wc', top);
      wc.innerHTML = '<svg width="150" height="20" viewBox="0 0 150 20" fill="none" stroke="#e8e8e8" stroke-width="1.6"><path d="M8 10h16"/><rect x="72" y="3" width="14" height="14"/><path d="M127 3l14 14M141 3l-14 14"/></svg>';
      const body = u.el('div', 'ds-body', document.body);
      let brief = null;
      if (_c.display === 'header' || _c.display === 'panel') {
        brief = u.el('aside', 'ds-brief', body);
        u.el('div', 'ds-kicker', brief, 'TASK BRIEFING');
        u.el('h2', '', brief, 'Set the date range');
      }
      const content = u.el('div', 'ds-content', body);
      const toolbar = u.el('div', 'ds-toolbar', content);
      drawToolbar(u, toolbar);
      Object.assign(_c, { top, body, brief, content, toolbar, header: brief || toolbar });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', _c.top);
      'File|Edit|View|Note|Format|Tools|Help'.split('|').forEach(t => _c.util.el('span', '', nav, t));
    },
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.classList.add('ds-toolbar-end');
    },
    'frame.body': () => (_c) => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief || body;
      base(_c);
      _c.body = body;
      if (_c.brief) {
        const u = _c.util;
        u.el('p', 'ds-note', _c.brief, 'Use the calendar controls on the right to select the start and end dates.');
        u.el('p', 'ds-note', _c.brief, 'Review both dates when you are ready.');
        u.el('hr', '', _c.brief);
        u.el('div', 'ds-kicker', _c.brief, 'NOTES');
        u.el('p', 'ds-note', _c.brief, 'You can navigate between months using the arrows in the calendar. Both a start date and an end date are required.');
        u.el('h1', 'ds-h1', _c.content, 'Select Date Range');
        // Reserve the original subtitle area without repeating the task goal.
        _c.util.el('div', 'ds-h2 ds-subtitle-space', _c.content).setAttribute('aria-hidden', 'true');
      }
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.content);
      _c.stage = _c.util.el('main', 'ds-stage', main);
      _c.main = main;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-set-date-range-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-range-03': palette }, LOW_THEME: palette,
      ACCENTS: ['#f26a1b'], LOW_ACCENTS: ['#f26a1b'], parts,
    },
  });
})();
