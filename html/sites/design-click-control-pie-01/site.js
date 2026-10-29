// Newspaper design on the shared frame; controls and perturbations come from site/base.
(function () {
  'use strict';

  const paper = { bg: '#fdfcf9', panel: '#f6f3ec', fg: '#000', muted: '#595750', line: '#929087' };

  function instructionStyle(note, display) {
    note.classList.add('instruction');
    if (display !== 'header') note.classList.add('instruction-' + display);
    note.dataset.display = display;
    note.dataset.help =
      'The pie menu contains several lettered options. Click on the requested item to complete the task.';
  }

  function controlStyle(parent, footer) {
    parent.querySelectorAll('.ref-xtra').forEach((button) => button.classList.add('news-xtra'));
    parent.querySelectorAll('[data-role="submit"]').forEach((button) => {
      button.classList.add(button.tagName === 'A' ? 'news-end-link' : footer ? 'submit' : 'news-end-control');
    });
  }

  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      document.body.className = 'ref news split';
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame has room for the instruction panel and toast at every supported size.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const shell = u.el('main', 'shell', document.body);
      const header = u.el('header', 'head', shell);
      u.el('div', 'title', header, 'The Daily Chronicle');
      u.el('div', 'tools', header, 'TRUTH INFORMS A BRIGHTER TOMORROW');
      const overview = u.el('section', 'overview', shell);
      const lead = u.el('div', 'news-lead', overview);
      const headline = u.el('h2', '', lead, 'City Council Approves');
      u.el('br', '', headline);
      headline.append('Riverside Park Renovation');
      u.el('p', '', lead,
        'The project will bring new walking trails, a modern playground and expanded green space to the district.');
      u.el('span', 'news-read-more', lead, 'Read more »');
      const photo = u.el('div', 'park-photo', overview);
      photo.setAttribute('role', 'img');
      photo.setAttribute('aria-label', 'Riverside park and city skyline');
      const stories = u.el('div', 'top-stories', overview);
      u.el('h3', '', stories, 'Top Stories');
      [
        'Local Schools See Higher Graduation Rate',
        'New Transit Plan Moves Forward',
        'City Hosts Annual Spring Festival',
        'Small Businesses Report Steady Growth',
        'Weather Forecast: Warmer Days Ahead',
      ].forEach((text) => u.el('b', '', u.el('div', '', stories, text), '»'));
      const search = u.el('input', 'news-search', header);
      search.placeholder = 'Search articles…';
      search.setAttribute('aria-label', 'Search articles');
      u.el('div', 'news-date', header, 'Tuesday, March 15, 2011');
      u.el('span', 'news-go', header, 'Go');
      const body = u.el('div', 'work', shell);
      const how = u.el('div', 'news-how', body);
      u.el('h4', '', how, 'Instructions');
      [
        'Use your mouse to interact with the pie menu.',
        'Click on the requested item.',
        'Review your selection before finishing.',
      ].forEach((text) => u.el('div', '', how, text));
      const center = u.el('section', 'center', body);
      Object.assign(_c, { shell, header, body, how, center });
    },
    'frame.nav': () => (_c) => {
      const { util, header } = _c;
      const nav = util.el('nav', 'newspaper-nav', header);
      ['Home', 'News', 'Business', 'Sports', 'Life', 'Opinion'].forEach((text) => util.el('span', '', nav, text));
    },
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.center });
      const note = _c.center.querySelector('.ref-instruction');
      if (note) instructionStyle(note, 'header');
      const spacer = _c.center.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('news-actions');
      controlStyle(_c.headerTools, false);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.how });
      const panel = _c.how.querySelector('.ref-panel');
      if (panel) {
        const note = panel.querySelector('.ref-panel-text');
        instructionStyle(note, 'panel');
        _c.how.appendChild(note);
        panel.remove();
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        instructionStyle(note, 'toast');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('footer');
        _c.shell.appendChild(foot);
        controlStyle(foot, true);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        dock.classList.add('footer');
        _c.shell.appendChild(dock);
        controlStyle(dock, true);
      }
    },
  };

  env.site({
    name: 'design-click-control-pie-01',
    template: 'site/base',
    styles: ['../base/site.css', 'site.css'],
    design: {
      THEMES: { news: paper }, LOW_THEME: paper,
      ACCENTS: ['#a20d0d'], LOW_ACCENTS: ['#a20d0d'],
      parts,
    },
  });
})();
