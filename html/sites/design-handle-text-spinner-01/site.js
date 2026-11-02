(function () {
  'use strict';
  const palette = { bg: '#eef0f4', panel: '#ffffff', fg: '#101528', muted: '#6b7080', line: '#d7dce5' };
  const side = 'Document Info|Title|Meeting Notes|Type|Text Document|Last Modified|Apr 24, 2014   10:15 AM|Helpful Tips|Click the up or down arrows to change the value.|You can also use your keyboard arrow keys.|Your mouse wheel can adjust the value when the control is focused.';
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'material', 'inspector');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Document Settings');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const appearance = u.el('section', 'appearance-heading', center);
      u.el('h2', '', appearance, 'Text Appearance');
      u.el('p', '', appearance, 'Adjust the document formatting below.');
      Object.assign(_c, { shell, head, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = h;
      _c.shell.classList.toggle('has-head-end', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'inspector', _c.work);
      let taskbox;
      side.split('|').forEach((s, i) => {
        if (i === 7) {
          u.el('div', 'inspector-divider', aside);
          taskbox = u.el('div', 'taskbox', aside);
          taskbox.hidden = _c.display !== 'panel';
        }
        u.el(i === 0 ? 'h2' : 'p', i >= 8 ? 'tip' : i % 2 === 1 ? 'k' : '', aside, s);
      });
      Object.assign(_c, { aside, taskbox, body: _c.work });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.taskbox;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready.';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
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
    name: 'design-handle-text-spinner-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-spinner-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3860da'],
      LOW_ACCENTS: ['#3860da'],
      parts,
    },
  });
})();
