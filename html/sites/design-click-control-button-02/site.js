(function () {
  'use strict';
  const palette = { bg: '#faf9f6', panel: '#ffffff', fg: '#111111', muted: '#555555', line: '#222222' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has room for each note mode in its permanent left pane.
      _c.display = _c.ctx.display || 'header';
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
      document.body.classList.add('ref', 'ref2');
      const shell = u.el('main', 'shell', document.body);
      const top = u.el('div', 'top2', shell);
      const left = u.el('aside', 'brief', top);
      u.el('h1', '', left, 'Quick Task');
      u.el('p', 'lead', left, 'Follow the instruction and complete the action in the workspace.');
      let noteBox = u.el('section', 'task-note task-' + _c.display);
      if (_c.display !== 'hidden') {
        u.el('hr', '', left);
        left.appendChild(noteBox);
        u.el('div', 'lbl', noteBox, _c.display === 'toast' ? 'Task notice:' : 'Task:');
      }
      u.el('hr', '', left);
      u.el('div', 'lbl', left, 'Notes:');
      const ul = u.el('ul', 'notes2', left);
      ['Use only the mouse pointer.', 'Do not type anything.', 'Finish when the action is complete.']
        .forEach((t) => u.el('li', '', ul, t));
      const main = u.el('section', 'main2', top);
      const hd = u.el('div', 'mhead', main);
      u.el('h2', '', hd, 'Customer Feedback');
      const pg = u.el('div', 'pager', hd);
      u.el('span', 'pg', pg, 'Page 1 of 3');
      u.el('b', 'cur', pg, '1');
      u.el('span', 'num', pg, '2');
      u.el('span', 'num', pg, '3');
      u.el('p', 'intro', main, 'Please review the information below. Complete the requested action when you are ready.');
      const card = u.el('div', 'card2', main);
      const toolbar = u.el('div', 'cardh', card, 'Feedback Form');
      Object.assign(_c, { shell, card, toolbar, header: noteBox });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) {
        text.classList.add('instruction');
        text.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'cardb', _c.card);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) {
        text.classList.add('instruction');
        text.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('div', 'stage', _c.body);
      const dec = u.el('div', 'deco', _c.body);
      dec.setAttribute('aria-hidden', 'true');
      u.el('div', 'q', dec, 'How did you find our website?');
      ['Very easy', 'Easy', 'Neutral', 'Difficult', 'Very difficult'].forEach((t, i) => {
        const r = u.el('div', 'opt' + (i === 1 ? ' on' : ''), dec);
        u.el('i', '', r);
        u.el('span', '', r, t);
      });
      u.el('div', 'q c', dec, 'Additional comments (optional):');
      u.el('div', 'ta', dec);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction', 'instruction-toast');
        text.dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('footer', 'footer', _c.shell);
      _c.util.el('h3', '', foot, 'Actions');
      const copy = _c.ctx.finish
        ? 'Your feedback workspace is ready. Finish when the action is complete.'
        : 'Complete the requested action in the feedback workspace.';
      _c.util.el('p', '', foot, copy);
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('p'));
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
    name: 'design-click-control-button-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'ref.css'],
    design: {
      THEMES: { 'design-click-control-button-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c71b20'],
      LOW_ACCENTS: ['#c71b20'],
      parts,
    },
  });
})();
