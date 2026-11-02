(function () {
  'use strict';
  const palette = { bg: '#faf9f6', panel: '#fff', fg: '#080808', muted: '#444', line: '#999' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The archive has dedicated note containers even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const { util: u, ctx, display } = _c;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      const left = u.el('div', 'ds-top-l', top);
      u.el('div', 'ds-brand', left, 'World Science Archive');
      const nav = u.el('nav', 'ds-nav', left);
      'People|Research|Timeline|About'.split('|').forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('span', '', nav, t);
      });
      const right = u.el('div', 'ds-top-r', top);
      u.el('div', 'ds-date', right, 'March 12, 2008');
      const toolbar = u.el('div', 'ds-search', right);
      u.el('div', 'ds-search-in', toolbar, 'Search this site...');
      u.el('div', 'ds-search-btn', toolbar, 'Search');
      const links = u.el('nav', 'ds-links', right);
      'Home|People|Climate|Contact'.split('|').forEach((t, i) => {
        if (i) u.el('i', '', links, '|');
        u.el('span', '', links, t);
      });
      const body = u.el('div', 'ds-body ds-mode-' + (display === 'header' ? 'left' : display), document.body);
      const brief = u.el('aside', 'ds-brief', body);
      u.el('h2', '', brief, 'Your Task');
      Object.assign(_c, { body, brief, header: brief, toolbar, links });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      // Auxiliary actions retain the archive's red navigation-link treatment.
      _c.links.appendChild(_c.headerTools);
      if (_c.submit) _c.toolbar.appendChild(_c.submit);
    },
    'frame.body': () => (_c) => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const title = _c.brief.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Research request';
      const { util: u, brief, ctx } = _c;
      u.el('hr', '', brief);
      u.el('p', 'ds-help', brief, 'Use the table on the right to find the requested information.' +
        (ctx.spec.answerBy === 'reply' ? '' : ' Type your answer in the text field.'));
      u.el('h4', '', brief, 'Notes:');
      const ul = u.el('ul', '', brief);
      [ctx.spec.answerBy === 'reply' ? 'Give the value exactly as shown in the table.' : 'Enter the value exactly as shown in the table.',
        'Use only the information provided on this page.',
        'You can close the survey on the right to get more space if needed.'].forEach(t => u.el('li', '', ul, t));
      _c.contentPane = u.el('div', 'ds-content', body);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.contentPane);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentPane.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.brief.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.brief.insertBefore(dock, _c.brief.querySelector('.ref-foot'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const x = u.el('button', 'ds-x', el, '×');
      x.type = 'button';
      u.el('h3', '', el, 'Quick Survey');
      u.el('p', 'ds-sub', el, 'Help us improve this site.');
      const qs = [
        ['1. How useful is this page?', ['Very useful', 'Somewhat useful', 'Not very useful', 'Not useful']],
        ['2. What best describes you?', ['Student', 'Educator', 'Researcher', 'General visitor']],
      ];
      qs.forEach((q) => {
        u.el('h4', '', el, q[0]);
        q[1].forEach((o) => {
          const r = u.el('div', 'ds-opt', el);
          u.el('i', '', r);
          u.el('span', '', r, o);
        });
      });
      u.el('h4', 'ds-q3', el, '3. Additional comments (optional):');
      u.el('div', 'ds-ta', el);
      const dismiss = u.el('button', 'ds-close', el, 'Close survey');
      dismiss.type = 'button';
      x.addEventListener('click', () => ctx.dismiss('close'));
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: 0 };
    },
  };
  env.site({
    name: 'design-find-fact-table-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-find-fact-table-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
