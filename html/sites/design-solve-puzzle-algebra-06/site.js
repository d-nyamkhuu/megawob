(function () {
  'use strict';
  const palette = { bg: '#9fc2e7', panel: '#ffffff', fg: '#102d52', muted: '#5b81ab', line: '#9eb7d2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast' && _c.W < 1260) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
      document.body.classList.add('forum-stacked', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app main-window', document.body);
      const top = u.el('header', 'top', app);
      const book = u.svg('svg', { width: 50, height: 42, viewBox: '0 0 50 42', class: 'bookmark' }, top);
      u.svg('path', { d: 'M4 5Q14 1 24 7Q34 1 46 5V36Q35 32 25 38Q15 32 4 36Z', fill: '#f7fbff', stroke: '#163e70', 'stroke-width': 2 }, book);
      u.svg('path', { d: 'M25 7V37M8 10Q16 7 21 11V31Q15 27 8 30ZM29 11Q36 7 42 10V30Q35 27 29 31Z', fill: 'none', stroke: '#5b81ab', 'stroke-width': 1.4 }, book);
      const brand = u.el('div', 'brand', top);
      u.el('b', '', brand, 'Math Practice');
      u.el('span', '', brand, 'Build Your Skills');
      const account = u.el('div', 'account', top);
      ['My Account', 'Help', 'Log Out'].forEach((v, i) => { if (i) u.el('i', 'divider', account, '│'); u.el('span', '', account, v); });
      const center = u.el('div', 'center', app);
      const bar = u.el('div', 'sectionbar', center);
      u.el('b', '', bar, 'Algebra Practice');
      u.el('span', '', bar, 'Question 1 of 10');
      Object.assign(_c, { app, center, bar, header: center });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'menu', _c.app);
      ['Home', 'Practice', 'Progress', 'Resources', 'Messages'].forEach((v, i) => _c.util.el('div', i === 1 ? 'active' : '', nav, v));
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const navbox = u.el('div', 'question-nav', footer);
      u.el('b', '', navbox, 'Question Navigator');
      const numbers = u.el('div', 'question-numbers', navbox);
      for (let i = 1; i <= 10; i++) u.el('span', i === 1 ? 'current' : '', numbers, String(i));
      const meta = u.el('div', 'topic-meta', footer);
      u.el('div', '', meta, 'Topic: Linear Equations');
      u.el('div', '', meta, 'Difficulty: Basic');
      const aside = u.el('aside', 'aside help-window', document.body);
      const helpbar = u.el('header', 'helpbar', aside);
      u.el('b', 'help-mark', helpbar, '?');
      u.el('b', '', helpbar, 'Study Help');
      const ctr = u.el('div', 'help-controls', helpbar);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'window-btn ' + (i === 2 ? 'close-btn' : ''), ctr, x));
      const tabs = u.el('div', 'help-tabs', aside);
      ['Tips', 'Examples', 'Related Topics'].forEach((x, i) => u.el('span', i === 0 ? 'selected' : '', tabs, x));
      const helpbody = u.el('div', 'help-body', aside);
      u.el('h2', '', helpbody, 'Solving Linear Equations');
      u.el('p', '', helpbody, 'A linear equation can be solved by using inverse operations to isolate the variable.');
      u.el('h3', '', helpbody, 'Steps (in general):');
      const list = u.el('ol', '', helpbody);
      ['Simplify both sides, if needed.', 'Use inverse operations to get the variable by itself.', 'Check your answer.'].forEach(x => u.el('li', '', list, x));
      const links = u.el('div', 'help-links', helpbody);
      ['Sample Problem (different numbers)', 'More Help', 'Watch a Video', 'See Worked Examples', 'Practice Another Problem'].forEach((x, i) => {
        const row = u.el('div', 'help-link', links);
        u.el('span', 'triangle', row, i < 2 ? '▶' : '▸');
        u.el('a', '', row, x);
      });
      Object.assign(_c, { body: _c.center, footer });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief', 'note-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('instruction-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.footer.appendChild(foot);
      _c.footer.classList.toggle('has-end', !_c.ctx.finish);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    'frame.end': (base) => (_c) => {
      const frame = base(_c);
      if (frame.submit) frame.submit.classList.add('end-' + _c.placement);
      _c.footer.classList.toggle('status-end', _c.placement === 'footer' || _c.placement === 'link');
      _c.bar.classList.toggle('toolbar-end', _c.placement === 'icon');
      return frame;
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = { cookie: 'This application stores preferences on your device.', toast: 'Your workspace has been synced.', chat: 'Need help with this exercise?', promo: 'Try the new practice collection.', banner: 'An updated practice collection is available.' };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  };
  env.site({
    name: 'design-solve-puzzle-algebra-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#1764b3'], LOW_ACCENTS: ['#1764b3'], parts
    }
  });
})();
