(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-ascending-06',
    task: 'read-figure',
    scenario: 'ascending',
    style: 'precision',
    title: 'Number Sequence',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'precision instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        glyph = u.el('span', 'app-glyph', top, '⠿');
      glyph.setAttribute('aria-hidden', 'true');
      u.el('span', 'window-title', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg(
          'path',
          {
            d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          svg,
        );
      }
      const body = u.el('div', 'workspace', app),
        nav = u.el('nav', 'side-nav', body);
      [
        ['◉', 'Exercise'],
        ['▥', 'Progress'],
        ['⚙', 'Settings'],
        ['ⓘ', 'Help'],
      ].forEach((x, i) => {
        const item = u.el('div', 'nav-item' + (!i ? ' active' : ''), nav);
        u.el('span', 'nav-icon', item, x[0]);
        u.el('span', '', item, x[1]);
      });
      const center = u.el('section', 'center', body),
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : ''),
        sub = u.el(
          'div',
          'instruction-sub',
          center,
          ctx.display === 'hidden' ? '' : 'Select the numbers from smallest to largest.',
        );
      let note = null;
      if (ctx.display === 'panel') {
        note = u.el('div', 'episode-note panel-note', center);
        u.el('div', 'episode-note-title', note, 'Exercise instructions');
        u.el('div', 'episode-note-text', note, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        note = u.el('div', 'episode-note toast-note', center, ctx.instruction);
      }
      const stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', center);
      u.el('button', 'clear-visual', footer, 'Clear').type = 'button';
      const aside = u.el('aside', 'aside', document.body),
        paletteHead = u.el('div', 'palette-head', aside);
      u.el('span', 'palette-grip', paletteHead, '⠿');
      u.el('span', 'palette-title', paletteHead, 'Tools');
      const close = u.el('span', 'palette-close', paletteHead, '×');
      close.setAttribute('aria-hidden', 'true');
      const tools = u.el('div', 'palette-tools', aside);
      [
        ['➤', 'Pointer', true],
        ['▦', 'Keyboard Shortcuts', false],
        ['☼', 'Appearance', false],
      ].forEach((x) => {
        const row = u.el('div', 'tool-row' + (x[2] ? ' active' : ''), tools);
        u.el('span', 'tool-icon', row, x[0]);
        u.el('span', '', row, x[1]);
        if (x[1] === 'Appearance') u.el('span', 'tool-chevron', row, '⌄');
      });
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelList = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)));
      const defaultEnd = er.bool(0.5);
      const placement = defaultEnd ? 'footer' : er.pick(['header', 'link']);
      const alternatives = labelList.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = defaultEnd ? 'Submit' : alternatives.length ? er.pick(alternatives) : er.pick(labelList);
      const same = (x) => String(x).trim().toLowerCase() === String(label).trim().toLowerCase();
      let collide = null;
      if (cr.bool(0.3)) {
        const choices = [
          ...new Set(labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))),
        ].filter((x) => !same(x));
        if (choices.length) collide = cr.pick(choices);
      }
      function decoy(parent, text, collision) {
        const b = u.el('button', 'episode-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collision ? { label: text, collide: true } : { label: text }),
        );
        return b;
      }
      function submit(parent, cl, text) {
        const b = u.el(cl === 'end-link' ? 'a' : 'button', cl, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      let end = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          const b = submit(top, 'title-end', label);
          end = b;
        }
        if (placement === 'footer') end = submit(footer, 'submit', label);
        if (placement === 'link') end = submit(footer, 'end-link', label + ' ›');
      }
      if (collide) {
        const target = placement === 'header' ? top : footer;
        decoy(target, collide, true);
      }
      return { stage, submit: end };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
