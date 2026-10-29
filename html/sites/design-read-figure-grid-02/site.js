(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-grid-02',
    task: 'read-figure',
    scenario: 'grid',
    style: 'blueprint',
    title: 'Coordinate Plotter',
    menu: 'File     Edit     View     Tools     Help',
    note: 'Feedback',
    aside: 'Click a point on the grid\nto see the coordinates here.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' instruction-' + ctx.display + (ctx.finish ? ' finish' : '');
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        icon = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 16, height: 16, rx: 2, fill: '#8bd9ed', stroke: '#e4f4fa' }, icon);
      u.svg('path', { d: 'M5 14l3-7 3 7 2-4 2 4', fill: 'none', stroke: '#173b53', 'stroke-width': 1.3 }, icon);
      u.el('span', 'window-title', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, label] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ])
        u.el('span', 'window-control ' + kind, wc, label);
      const menu = u.el('nav', 'menu', app, C.menu);
      const er = ctx.rng.fork('chrome/end'),
        baseEnd = er.bool(0.5),
        placement = ctx.finish ? null : baseEnd ? 'footer' : er.pick(['toolbar', 'link']),
        endLabels = (
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x))),
        label = ctx.finish
          ? null
          : baseEnd
            ? 'Submit'
            : er.pick(endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide'),
        collisionPool = endLabels.filter(
          (x) =>
            String(x).trim().toLowerCase() !==
            String(label || '')
              .trim()
              .toLowerCase(),
        ),
        collision = ctx.finish || !cr.bool(0.3) || !collisionPool.length ? null : cr.pick(collisionPool);
      const workspace = u.el('div', 'workspace', app),
        main = u.el('section', 'main-column', workspace),
        brief = u.el('div', 'brief', main);
      u.el('b', 'brief-label', brief, 'Task');
      u.el('strong', 'instruction', brief, ctx.display === 'header' ? ctx.instruction : '');
      u.el(
        'p',
        'brief-copy',
        brief,
        'Use the mouse to select the correct point on the grid.\nDo not enter coordinates manually.',
      );
      const stage = u.el('section', 'stage', main);
      const plotHeading = u.el('div', 'plot-heading', stage, 'Coordinate Grid');
      const toolbar = u.el('div', 'plot-toolbar', stage),
        tools = u.el('div', 'plot-tools', toolbar);
      ['➤', '♧', '⊕', '⊖', '⌖'].forEach((symbol, i) => {
        const b = u.el('span', 'tool-button' + (i === 0 ? ' active' : ''), tools, symbol);
        b.setAttribute('aria-hidden', 'true');
      });
      const toggles = u.el('div', 'plot-toggles', toolbar);
      ['Show Grid', 'Show Axes', 'Show Coordinates'].forEach((label) => {
        const item = u.el('span', 'plot-toggle', toggles);
        u.el('i', 'checkmark', item, '✓');
        u.el('span', '', item, label);
      });
      const actions = u.el('div', 'episode-actions', top);
      let submit = null;
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const collideButton = (parent) => {
        if (collision) {
          const b = u.el('button', 'pq-xtra', parent, collision);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
        }
      };
      if (placement === 'toolbar') {
        if (!ctx.finish) submit = endButton(actions, 'submit toolbar-submit', label);
        collideButton(actions);
      }
      const aside = u.el('aside', 'aside', workspace);
      let panelNote = null;
      if (ctx.display === 'panel') {
        panelNote = u.el('section', 'episode-note', aside);
        u.el('b', 'episode-note-title', panelNote, 'Task instructions');
        u.el('p', '', panelNote, ctx.instruction);
      }
      const asideHead = u.el('header', 'aside-head', aside, C.note),
        readout = u.el('div', 'readout-panel', aside);
      u.el('div', 'readout-line', readout, 'Selected Coordinate:　　 —　 —');
      u.el('div', 'readout-line', readout, 'X value:　　　　　　　 —');
      u.el('div', 'readout-line', readout, 'Y value:　　　　　　　 —');
      u.el('div', 'readout-line', readout, 'Distance from Origin:　 —');
      u.el('p', 'aside-copy', aside, C.aside);
      const sideFoot = u.el('footer', 'side-foot', aside);
      if (placement === 'footer' && !ctx.finish) submit = endButton(sideFoot, 'submit', label);
      else if (placement === 'link' && !ctx.finish) {
        submit = endButton(sideFoot, 'submit submit-link', label);
      }
      if ((placement === 'footer' || placement === 'link') && collision) collideButton(sideFoot);
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'instruction-toast', brief, ctx.instruction);
        toast.setAttribute('role', 'note');
      }
      u.el('footer', 'bottom', app);
      return { stage, submit };
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
