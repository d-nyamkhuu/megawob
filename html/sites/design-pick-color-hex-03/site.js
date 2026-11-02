(function () {
  'use strict';
  const palette = { bg: '#f8f4ec', panel: '#f8f4ec', fg: '#111111', muted: '#9a9a9a', line: '#444444' };
  function highlight(node) {
    if (!node) return;
    const text = node.textContent;
    node.textContent = '';
    text.split(/(#[0-9a-fA-F]{6})/).forEach((part, i) => {
      if (i % 2) {
        const span = document.createElement('span');
        span.className = 'hl';
        span.textContent = part;
        node.append(span);
      } else node.append(part);
    });
  }
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design bauhaus';
      const shell = u.el('div', 'shell', document.body);
      const top = u.el('header', 'top-bar', shell);
      u.el('div', 'dot', top);
      u.el('div', 'brand', top, 'COLOR TOOL');
      const sep = u.el('div', 'sep', top);
      sep.hidden = _c.display === 'hidden' || _c.display === 'panel';
      Object.assign(_c, { shell, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      highlight(_c.header.querySelector('.ref-instruction'));
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'workspace', _c.shell);
      _c.body.classList.toggle('with-panel', _c.display === 'panel');
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      highlight(_c.body.querySelector('.ref-panel-text'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.insertBefore(note, _c.headerTools);
        highlight(note.querySelector('.ref-note-text'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.append(footer);
      const hint = footer.querySelector('.ref-foot-text');
      hint.classList.add('hint');
      hint.textContent = 'Adjust the color using the picker. Match the target color.';
      const delta = u.el('div', 'difference-value', footer, '—');
      delta.dataset.role = 'color-difference';
      const action = footer.querySelector('.ref-tools');
      const reset = u.el('button', 'btn reset', null, 'Reset');
      reset.type = 'button';
      reset.onclick = () => {
        env.log('reset', {});
        document.dispatchEvent(new Event('cp-reset'));
      };
      action.prepend(reset);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.prepend(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        {
          cookie: 'Console preferences',
          toast: 'Instrument notice',
          chat: 'Laboratory support',
          promo: 'Calibration reminder',
          banner: 'Workstation notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The calibration console is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the instrument profile before calibration.',
          banner: 'The instrument is operating with the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-hex-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-hex-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c8202a'],
      LOW_ACCENTS: ['#c8202a'],
      parts,
    },
  });
})();
