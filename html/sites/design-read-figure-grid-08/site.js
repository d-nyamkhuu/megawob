// GNOME Graph Plotter frame with forked per-episode instruction and end-action scenarios.
(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-grid-08', task: 'read-figure', scenario: 'grid',
    style: 'gnome', title: 'Graph Plotter', layout: 'ribbon-stage',
    subtitle: 'Explore coordinates and points',
    aside: 'Click on the point shown in the instruction on the grid. The axes show integer coordinates, including negative values.'
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = `${C.style} ${C.layout} instruction-${ctx.display}`;
      const u = ctx.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 38, height: 38, viewBox: '0 0 38 38', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 34, height: 34, rx: 7, fill: '#3584e4' }, icon);
      u.svg('path', { d: 'M8 26l7-8 5 4 9-11M8 10v18h21', fill: 'none', stroke: '#fff', 'stroke-width': 1.7 }, icon);
      const title = u.el('div', 'title-stack', top);
      u.el('strong', '', title, C.title);
      u.el('small', '', title, C.subtitle);
      if (ctx.display === 'header') u.el('div', 'header-instruction', top, ctx.instruction);

      const endRng = ctx.rng.fork('chrome/end');
      const endPool = (ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'])
        .map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)));
      const endLabel = endRng.bool(0.5) ? 'Submit' : endRng.pick(endPool);
      const placement = endRng.pick(['footer', 'footer', 'header', 'ribbon']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const alternatives = endPool.filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && alternatives.length ? collideRng.pick(alternatives) : null;
      let submit = null;
      const makeSubmit = (parent, cls) => {
        const button = u.el('button', cls, parent, endLabel);
        button.type = 'button';
        button.setAttribute('aria-label', endLabel);
        button.title = endLabel;
        button.addEventListener('click', ctx.submit);
        submit = button;
      };

      const controls = u.el('div', 'native-window-controls', top);
      if (!ctx.finish && placement === 'header') makeSubmit(top, 'end-header');
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, controls);
        u.svg('path', {
          d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
          fill: 'none', stroke: '#30343a', 'stroke-width': 1.8
        }, svg);
      }

      const ribbon = u.el('nav', 'ribbon', app);
      let toolsRow;
      const groups = [
        ['Select', [['➤', 'Pointer', true], ['●', 'Point'], ['✣', 'Move'], ['✋', 'Pan']]],
        ['View', [['☑', 'Show Grid', true], ['☑', 'Show Coordinates', true], ['☑', 'Show Axes', true], ['☐', 'Equal Scale']]],
        ['Tools', [['▱', 'Clear All'], ['↶', 'Undo'], ['↷', 'Redo', false]]],
        ['Style', [['●', 'Point Color', 'color'], ['8', 'Point Size', 'size']]]
      ];
      groups.forEach(([head, items]) => {
        const group = u.el('section', 'ribbon-group', ribbon);
        u.el('b', '', group, head);
        const row = u.el('div', 'ribbon-items', group);
        if (head === 'Tools') toolsRow = row;
        items.forEach(([symbol, label, state]) => {
          const control = u.el('div', `ribbon-control${state === true ? ' active' : ''}`, row);
          if (state === 'color') control.classList.add('color-control');
          if (state === 'size') control.classList.add('size-control');
          u.el('span', 'ribbon-symbol', control, symbol);
          u.el('span', 'ribbon-label', control, label);
        });
      });
      if (!ctx.finish && placement === 'ribbon') makeSubmit(toolsRow, 'ribbon-submit');
      if (collide) {
        const decoy = u.el('button', 'ribbon-xtra', toolsRow, collide);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }

      const center = u.el('div', 'center', app);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', `aside${ctx.display === 'toast' ? ' instruction-toast' : ''}`, center);
      const briefText = ctx.display === 'panel' || ctx.display === 'toast' ? ctx.instruction : '';
      u.el('div', 'brief', aside, briefText);
      u.el('p', 'aside-copy', aside, C.aside);
      u.el('div', 'instruction-detail', aside, 'The axes show integer coordinates, including negative values.');
      const footer = u.el('footer', 'bottom', app);
      const status = u.el('div', 'status', footer);
      u.el('i', 'status-dot', status);
      u.el('span', '', status, 'No point placed');
      u.el('div', 'coords', footer, 'x: —　　y: —');
      if (!ctx.finish && placement === 'footer') makeSubmit(footer, 'submit');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('div', `overlay ${ctx.kind}`, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.'
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    }
  });
})();
