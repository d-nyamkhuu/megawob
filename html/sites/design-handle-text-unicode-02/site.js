(function () {
  'use strict';
  const palette = { bg: '#e6eff5', panel: '#fff', fg: '#092d69', muted: '#365885', line: '#819ab9' };

  function styleNote(note, display, textClass, titleClass) {
    note.classList.add('instruction');
    note.dataset.display = display;
    const text = note.querySelector('.' + textClass);
    text.classList.add('instruction-copy');
    let title = titleClass && note.querySelector('.' + titleClass);
    if (!title) {
      title = document.createElement('div');
      note.insertBefore(title, note.firstChild);
    }
    title.classList.add('instruction-title');
    title.textContent = 'Follow the instructions';
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses the viewport width for both compact note fallbacks.
      _c.display = ((_c.ctx.display === 'panel' || _c.ctx.display === 'toast') && _c.W < 1260)
        ? 'header' : (_c.ctx.display || 'header');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'flash', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Text Practice');
      const work = u.el('div', 'work');
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, work, center, header: center });
    },
    'frame.nav': () => (_c) => {
      const tools = _c.util.el('div', 'tools', _c.head);
      ['Home', 'Tasks', 'Settings', 'Help'].forEach((text) => {
        const item = _c.util.el('span', 'menu-item', tools, text);
        item.addEventListener('click', () => env.log('decoy', { label: text }));
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        const text = _c.util.el('div', 'instruction-copy', null, note.textContent);
        note.textContent = '';
        note.appendChild(text);
        styleNote(note, 'header', 'instruction-copy');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.work);
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) styleNote(note, 'panel', 'ref-panel-text', 'ref-panel-title');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        styleNote(note, 'toast', 'ref-note-text');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const brand = _c.util.el('div', 'sun-brand');
      brand.innerHTML =
        '<svg viewBox="0 0 40 40" aria-hidden="true"><g transform="rotate(45 20 20)" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5h13v13H9V9h5v5M22 5h13v13H26V9h5v5M5 22h13v13H9V26h5v5M22 22h13v13H26V26h5v5"/><path d="M5 18V5M22 18V5M5 35V22M22 35V22"/></g></svg><span>Sun</span>';
      foot.insertBefore(brand, foot.firstChild);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      _c.foot = foot;
      const clear = _c.util.el('button', 'clear-text', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = _c.stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
    name: 'design-handle-text-unicode-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-unicode-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2679bd'],
      LOW_ACCENTS: ['#2679bd'],
      parts,
    },
  });
})();
