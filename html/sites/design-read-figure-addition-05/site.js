(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-addition-05',
    'task': 'read-figure',
    'scenario': 'addition',
    'style': 'electron',
    'title': 'Math Practice - Addition',
    'menu': 'Notebook    Problems    Draw    Highlight    Erase',
    'note': 'Notes',
    'layout': 'stagger',
    'subtitle': '',
    'aside':
      'Quick Notes:\n\n1. Count the blocks in each group.\n2. Add the two numbers.\n3. Type the total into the textbox.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        content = ctx.content || {},
        body = document.body,
        W = window.innerWidth,
        H = window.innerHeight;
      let display = ctx.display || 'header';
      if (display === 'panel' && W < 1260) display = 'header';
      if (display === 'toast' && H < 700) display = 'header';
      body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const app = u.el('main', 'app', body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          {
            x: 3,
            y: 2,
            width: 20,
            height: 22,
            rx: C.style === 'mint' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : '#d7e2e8',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg(
          'path',
          { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
          icon,
        );
      }
      const title = u.el('span', 'app-title', top, C.title);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
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
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      let ribbon;
      if (C.menu) {
        const tabs = u.el('nav', 'menu', top);
        ['Home', 'View', 'Tools', 'Help'].forEach((label, i) => u.el('span', i === 0 ? 'active' : '', tabs, label));
        ribbon = u.el('div', 'ribbon', top);
        [
          ['New Problem', '▤'],
          ['Open', '▱'],
          ['Save', '▣'],
          ['Reset', '⟳'],
          ['Show Instructions', '☷'],
          ['Hint', '?'],
          ['Options', '⚙'],
        ].forEach((item, i) => {
          const g = u.el('div', 'ribbon-group' + (i === 2 || i === 3 || i === 5 ? ' divided' : ''), ribbon);
          u.el('span', 'ribbon-icon icon-' + i, g, item[1]);
          u.el('span', 'ribbon-label', g, item[0]);
          u.el(
            'small',
            'ribbon-caption',
            g,
            ['File', 'File', 'File', 'Problem', 'Learning', 'Learning', 'Settings'][i],
          );
        });
      }
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, display === 'hidden' ? '' : ctx.instruction);
      if (display === 'toast') brief.classList.add('brief-toast');
      const stage = u.el('section', 'stage', center);
      if (display === 'panel') {
        const panel = u.el('aside', 'episode-panel', center);
        u.el('b', '', panel, 'Instructions');
        u.el('div', 'episode-panel-copy', panel, ctx.instruction);
      }
      const aside = u.el('aside', 'aside', body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        labels = (
          content.END_LABELS || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
            "I'm done",
          ]
        ).map(labelOf);
      const endRng = ctx.rng.fork('chrome/end'),
        defaultLabel = labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit',
        label = endRng.bool(0.5) ? defaultLabel : labelOf(endRng.pick(labels)),
        placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'ribbon', 'title']);
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const endBtn = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      let submit = null;
      if (placement === 'ribbon') submit = endBtn(ribbon, 'ribbon-submit');
      if (placement === 'title') submit = endBtn(top, 'title-submit');
      if (placement === 'footer') submit = endBtn(footer, 'submit');
      if (!ctx.finish) {
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) decoyBtn(ribbon, collideRng.pick(choices));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
