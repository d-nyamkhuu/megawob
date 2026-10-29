(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-shades-04',
    'task': 'read-figure',
    'scenario': 'shades',
    'style': 'gem',
    'title': 'Tile Selector',
    'menu': ['Desk', 'File', 'Edit', 'Options'],
    'note': 'Your Selections',
    'layout': 'gem',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body);
      const bar = u.el('header', 'menubar', app);
      const logo = u.svg('svg', { width: 30, height: 26, viewBox: '0 0 30 26', class: 'logo' }, bar);
      u.svg(
        'path',
        {
          d: 'M12 1h3v10c0 7-4 12-12 14v-3c6-2 9-6 9-12zM16 1h3v9c0 6 3 10 9 12v3c-8-2-12-7-12-14zM14 1h3v24h-3z',
          fill: '#111',
        },
        logo,
      );
      for (const m of C.menu) u.el('span', 'mi', bar, m);
      u.el('span', 'clock', bar, 'Mon Mar 10 14:27');
      const win = u.el('div', 'gwin', app);
      const tb = u.el('div', 'gtitle', win);
      u.el('span', 'gad', tb, '–');
      u.el('span', 'gtt', tb, C.title);
      u.el('span', 'gad sm', tb, '');
      u.el('span', 'gad sm', tb, '□');
      u.el('span', 'gad sm', tb, '✕');
      const wb = u.el('div', 'gbody', win);
      const center = u.el('div', 'center', wb),
        brief = u.el(
          'div',
          'brief ' + (ctx.display === 'header' ? '' : ctx.display === 'toast' ? 'is-toast' : 'is-hidden'),
          center,
          ctx.display === 'header' || ctx.display === 'toast' ? ctx.instruction : '',
        );
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', wb);
      if (ctx.display === 'panel') {
        const panelNote = u.el('div', 'panel-note', aside, ctx.instruction);
        panelNote.setAttribute('aria-label', 'Task instructions');
      }
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, 'Select tiles');
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const sampledLabel = labelOf(endRng.pick(endLabels));
      const endLabel = endRng.bool(0.55) ? 'Submit' : sampledLabel;
      const placement = endRng.pick(['aside', 'aside', 'titlebar', 'link']);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'titlebar') {
          submit = u.el('button', 'end-title', tb, endLabel);
          submit.type = 'button';
        } else if (placement === 'link') {
          submit = u.el('a', 'end-link', aside, endLabel);
          submit.href = '#';
        } else {
          submit = u.el('button', 'submit', aside, endLabel);
          submit.type = 'button';
        }
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const chosen = endLabel.trim().toLowerCase();
        const options = [...new Set(endLabels.map(labelOf))].filter((x) => x.trim().toLowerCase() !== chosen);
        if (options.length) {
          const decoyLabel = collideRng.pick(options);
          const parent = aside;
          const decoy = u.el('button', 'end-xtra', parent, decoyLabel);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
        }
      }
      const dk = u.el('div', 'desk', app);
      for (const n of ['A:', 'B:']) {
        const f = u.svg('svg', { width: 70, height: 70, viewBox: '0 0 70 70', 'shape-rendering': 'crispEdges' }, dk);
        u.svg('path', { d: 'M4 2h57l5 5v60H3V2z', fill: '#aaa', stroke: '#111', 'stroke-width': 3 }, f);
        u.svg('path', { d: 'M9 3h43v29H9z', fill: '#164f29', stroke: '#111', 'stroke-width': 3 }, f);
        u.svg('path', { d: 'M19 4h29v21H19z', fill: '#ccc', stroke: '#111', 'stroke-width': 3 }, f);
        u.svg('path', { d: 'M36 6h7v16h-7z', fill: '#111' }, f);
        u.svg('path', { d: 'M7 38h53v28H7z', fill: '#ccc', stroke: '#111', 'stroke-width': 3 }, f);
        u.svg('path', { d: 'M12 40h43v25H12z', fill: '#ddd', stroke: '#111', 'stroke-width': 2 }, f);
        u.svg('path', { d: 'M6 34h55M62 9v54', fill: 'none', stroke: '#eee', 'stroke-width': 2 }, f);
        const t = u.svg(
          'text',
          { x: 34, y: 62, 'text-anchor': 'middle', 'font-size': 24, 'font-family': 'monospace', 'font-weight': 'bold' },
          f,
        );
        t.textContent = n;
      }
      const tr = u.svg('svg', { width: 70, height: 70, viewBox: '0 0 70 70', 'shape-rendering': 'crispEdges' }, dk);
      u.svg('path', { d: 'M17 16h37v46l-4 5H21l-4-5z', fill: '#ccc', stroke: '#111', 'stroke-width': 3 }, tr);
      u.svg('path', { d: 'M13 13l8-5h30l8 5v7H13zM28 7V3h15v4', fill: '#ccc', stroke: '#111', 'stroke-width': 3 }, tr);
      u.svg(
        'path',
        {
          d: 'M17 13h38M21 23v38M29 23v38M37 23v38M45 23v38M52 23v38',
          fill: 'none',
          stroke: '#111',
          'stroke-width': 3,
        },
        tr,
      );
      u.svg(
        'path',
        { d: 'M24 23v38M32 23v38M40 23v38M48 23v38M18 11h34', fill: 'none', stroke: '#eee', 'stroke-width': 2 },
        tr,
      );
      u.el('span', 'tlabel', dk, 'TRASH');
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
