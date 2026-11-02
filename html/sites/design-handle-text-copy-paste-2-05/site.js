(function () {
  'use strict';
  const cfg = {
    title: 'The Daily Chronicle',
    tools: 'News　　 Business　　 Opinion　　 Life　　 Sports　　 Arts　　 More ▾　　　　　　 Tuesday, March 22, 2011　　 Sign In　|　Register　　 Search articles...　 🔍',
    rail: 'Tools|➤　Pointer|▦　Keyboard|●　Wheel|Help|❔　Task Help|Contact Support',
    side: 'Related Links|Library Hours|Events Calendar|Getting a Library Card|Research Resources|Contact The Library|Need Assistance?|If you have questions about this task, visit our help page for more information.|Go to Help Page',
  };
  const palette = { bg: '#fbfaf6', panel: '#fbfaf6', fg: '#191d25', muted: '#52545a', line: '#c9c8c3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the newspaper's original note breakpoints.
      const { ctx } = _c;
      const width = (ctx.size && ctx.size.width) || document.documentElement.clientWidth;
      const height = (ctx.size && ctx.size.height) || document.documentElement.clientHeight;
      let display = ctx.display || 'header';
      if (display === 'panel' && (width < 1200 || height < 800)) display = 'header';
      if (display === 'toast' && width < 1024) display = 'header';
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'news', 'dock');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, cfg.title);
      u.el('div', 'tools', head, cfg.tools);
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      const center = u.el('section', 'center', work);
      const toolbar = u.el('div', 'news-actions', center);
      Object.assign(_c, { shell, work, rail, center, toolbar, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const aside = _c.util.el('aside', 'inspector', _c.work);
      cfg.side.split('|').forEach((s, i) => _c.util.el(i === 0 ? 'h2' : 'p', '', aside, s));
      Object.assign(_c, { aside, body: _c.work });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.aside });
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction-panel');
        _c.aside.prepend(panel);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      // The rail held the original text-link ending. The form button is
      // docked into the answer row by the existing widget's rendered part.
      _c.rail.appendChild(foot);
      if (_c.placement === 'footer' && _c.submit) _c.submit.classList.add('submit');
      const footer = _c.util.el('footer', 'footer', _c.shell);
      _c.util.el('span', 'ready', footer, 'Ready.');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.rail.appendChild(dock);
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
    name: 'design-handle-text-copy-paste-2-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-copy-paste-2-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b91e20'],
      LOW_ACCENTS: ['#b91e20'],
      parts,
    },
  });
})();
