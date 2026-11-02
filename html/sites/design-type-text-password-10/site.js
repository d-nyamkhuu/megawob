(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#f1f2f3', fg: '#111111', muted: '#222222', line: '#8a8a8a' };

  function fitNote(box, text) {
    text.style.width = '100%';
    text.style.whiteSpace = 'nowrap';
    const size = parseFloat(getComputedStyle(text).fontSize);
    const fit = (size * text.clientWidth) / Math.max(text.scrollWidth, 1);
    text.style.whiteSpace = 'normal';
    if (fit >= (size * 36) / 46) {
      text.style.fontSize = 'calc(' + Math.min(46, ((46 * fit) / size) * 0.997) + ' * var(--u))';
    } else {
      box.classList.add('ds-multiline');
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This form has space for its original note locations at every viewport.
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
      const left = u.el('div', 'ds-left', document.body);
      const head = u.el('header', 'ds-head', left);
      u.el('a', 'ds-brand', head, 'Riverton University');
      const nav = u.el('nav', 'ds-nav', head);
      ['Home', 'Help', 'Contact'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        u.el('a', '', nav, t);
      });
      u.el('hr', 'ds-rule', left);
      const content = u.el('div', 'ds-content', left);
      u.el('h1', 'ds-h1', content, 'Set Your Password');
      Object.assign(_c, { left, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        fitNote(note, note);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-head-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const intro = u.el('p', 'ds-intro', _c.content, 'Choose a strong password for your account. Enter it in both fields below.');
      const main = u.el('div', 'ds-main', _c.content);
      Object.assign(_c, { body: main, intro });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        note.querySelector('.ref-panel-title').textContent = 'Instructions';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.intro);
        fitNote(note, note.querySelector('.ref-note-text'));
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'ds-footer', _c.content);
      base(_c);
      const templateFoot = document.body.querySelector('.ref-foot');
      foot.appendChild(templateFoot);
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        for (const input of _c.stage.querySelectorAll('input:not(:disabled),textarea:not(:disabled)')) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      u.el('hr', 'ds-rule ds-rule2', _c.left);
      const bot = u.el('div', 'ds-bottom', _c.left);
      u.el('a', '', bot, 'Privacy Policy');
      u.el('span', '', bot, '© 1995 Riverton University');
      const side = u.el('aside', 'ds-side', document.body);
      u.el('h2', 'ds-side-title', side, 'Account Setup');
      u.el('hr', '', side);
      u.el('h3', '', side, 'Steps');
      const ol = u.el('ol', 'ds-steps', side);
      ['Set your password', 'Confirm your details', 'Finish'].forEach((t, i) => {
        const li = u.el('li', i === 0 ? 'cur' : '', ol);
        u.el('span', 'n', li, i + 1 + '.');
        u.el('span', '', li, t);
      });
      u.el('hr', '', side);
      u.el('h3', '', side, 'Password Tips');
      const ul = u.el('ul', 'ds-tips', side);
      ['Use a mix of letters, numbers and symbols.', 'At least 8 characters.', 'Do not use a common word.'].forEach(
        (t) => u.el('li', '', ul, t),
      );
      u.el('hr', '', side);
      u.el('h3', '', side, 'Need Help?');
      u.el('a', 'ds-guide', side, 'View our password guide');
      Object.assign(_c, { foot, templateFoot, clear });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.clear);
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
    name: 'design-type-text-password-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-password-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#254bff'],
      LOW_ACCENTS: ['#254bff'],
      parts,
    },
  });
})();
