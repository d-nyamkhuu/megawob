(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-addition-09',
    'task': 'read-figure',
    'scenario': 'addition',
    'style': 'electron',
    'title': 'Math Notebook',
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
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const keepDefault = endRng.bool(0.5);
      const placement = ctx.finish ? null : keepDefault ? 'footer' : endRng.pick(['header', 'dock']);
      const endBank = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = keepDefault ? 'Submit' : asLabel(endRng.pick(endBank));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endBank.map(asLabel))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = asLabel(collideRng.pick(options));
      }
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const app = u.el('main', 'app', document.body),
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
      u.el('span', '', top, C.title);
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
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app);
      if (ctx.display === 'header') u.el('div', 'brief', center, ctx.instruction);
      if (ctx.display === 'panel') {
        const aside = u.el('aside', 'aside episode-panel', center);
        u.el('b', '', aside, C.note);
        u.el('p', 'aside-copy', aside, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const note = u.el('div', 'brief instruction-toast', center, ctx.instruction);
        note.setAttribute('role', 'status');
      }
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app),
        docktools = u.el('div', 'dock-tools', footer);
      [
        ['eraser', 'Eraser'],
        ['pencil', 'Pencil'],
        ['undo', 'Undo'],
        ['redo', 'Redo'],
      ].forEach(([kind, label]) => {
        const item = u.el('div', 'dock-tool ' + kind, docktools),
          svg = u.svg('svg', { viewBox: '0 0 64 64', width: 64, height: 64 }, item);
        if (kind === 'eraser')
          u.svg(
            'polygon',
            { points: '10,43 39,13 56,18 56,34 29,53 12,53', fill: '#f8f8f8', stroke: '#333', 'stroke-width': 2 },
            svg,
          );
        else if (kind === 'pencil') {
          u.svg(
            'polygon',
            { points: '8,51 17,48 49,10 43,5 12,43', fill: '#e9b843', stroke: '#222', 'stroke-width': 2 },
            svg,
          );
          u.svg('polygon', { points: '8,51 12,43 17,48', fill: '#222' }, svg);
          u.svg('polygon', { points: '43,5 49,10 54,4 48,0', fill: '#e76f62', stroke: '#222', 'stroke-width': 1 }, svg);
        } else {
          u.svg(
            'path',
            {
              d:
                kind === 'undo'
                  ? 'M26 16L9 31l17 15V35c17 0 23 7 29 20-1-24-10-35-29-35z'
                  : 'M38 16l17 15-17 15V35c-17 0-23 7-29 20 1-24 10-35 29-35z',
              fill: '#aeb1b5',
              stroke: '#62666b',
              'stroke-width': 2,
            },
            svg,
          );
        }
        u.el('span', 'dock-tool-label', item, label);
      });
      const clear = u.el('button', 'clear-all', footer, 'Clear All');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = document.querySelector('.addition-content input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'submit', footer, endLabel);
        } else if (placement === 'header') {
          submit = u.el('button', 'chrome-end chrome-end-header', top, endLabel);
        } else {
          submit = u.el('button', 'chrome-end chrome-end-dock', footer, endLabel);
        }
        submit.type = 'button';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', ctx.submit);
        if (collide) {
          const decoy = u.el('button', 'chrome-xtra', placement === 'header' ? top : footer, collide);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
