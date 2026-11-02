(function () {
  'use strict';
  const palette = { bg: '#f4f5f7', panel: '#ffffff', fg: '#182335', muted: '#46546a', line: '#d6dbe2' };
  const parts = {
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
      const top = _c.util.el('header', 'ds-top', document.body);
      _c.util.el('span', 'ds-brand', top, 'Delivery Information');
      _c.header = top;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const content = u.el('div', 'ds-content', document.body);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const help = u.el('aside', 'ds-help', main);
      u.el('h2', 'ds-help-title', help, 'Helpful Information');
      const helpBody = u.el('div', 'ds-help-body', help);
      const entries = [
        ['Phone for delivery updates', 'Enter the best phone number for delivery updates, such as a home, work or mobile number.'],
        ['Mobile number (optional)', 'You can provide a mobile number if you prefer to receive text messages about your delivery.'],
        ['Email address (optional)', 'We may send delivery notifications to this email address.']
      ];
      entries.forEach(([heading, text]) => {
        const item = u.el('section', 'ds-help-item', helpBody);
        u.el('h3', '', item, heading);
        u.el('p', '', item, text);
      });
      const tips = u.el('section', 'ds-tips', helpBody);
      u.el('h3', '', tips, 'Format tips');
      const list = u.el('ul', '', tips);
      ['Phone numbers can include digits, spaces, dashes or parentheses.', 'Example: (555) 123-4567', 'International numbers are allowed.']
        .forEach((text) => u.el('li', '', list, text));
      Object.assign(_c, { body: main, content, help, helpBody, stage });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.help;
      base(_c);
      _c.body = body;
      const note = _c.help.querySelector('.ref-panel');
      if (note) _c.help.insertBefore(note, _c.helpBody);
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.prepend(note);
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
      const el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  };
  env.site({
    name: 'design-type-text-copy-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-copy-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3577b9'],
      LOW_ACCENTS: ['#3577b9'],
      parts
    }
  });
})();
