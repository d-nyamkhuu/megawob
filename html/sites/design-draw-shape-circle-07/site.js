(function () {
  'use strict';
  const C = {
    'title': 'Shape Practice',
    'nav': ['Draw', 'Learn', 'Improve'],
    'font': "'Courier New', Courier, monospace",
  };
  env.site({
    name: 'design-draw-shape-circle-07',
    styles: ['pc.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'pc' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#fbf8ee',
        panel: '#fbf8ee',
        fg: '#0d1a3a',
        muted: '#5d6a85',
        line: '#14264a',
        accent: '#2f8f86',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'pc-shell', body),
        head = u.el('header', 'pc-head', shell);
      const pencil = (s) => {
        for (const [d, fill] of [
          [
            'M2 30V26H4V21H6V19H8V17H10V15H12V13H14V11H16V9H18V7H20V3H22V1H26V3H28V5H30V9H28V11H26V13H24V15H22V17H20V19H18V21H16V23H14V25H10V27H6V29Z',
            '#060d30',
          ],
          ['M20 4H22V2H25V4H27V6H29V9H27V11H25L20 6Z', '#ee8093'],
          ['M21 4H24V5H26V7H27V9H25L21 6Z', '#ffa6ac'],
          ['M7 20L20 7L25 12L12 25Z', '#d3971d'],
          ['M7 20L20 7L22 9L9 22Z', '#ffe37b'],
          ['M9 22L22 9L24 11L11 24Z', '#ffc634'],
          ['M5 22H7V21L12 25H9V26H5Z', '#ffefd0'],
          ['M4 27V25H6V27Z', '#fff8de'],
        ])
          u.svg('path', { d, fill }, s);
      };
      const ic = u.svg(
        'svg',
        { class: 'pc-logo', width: 46, height: 46, viewBox: '0 0 32 32', shapeRendering: 'crispEdges' },
        head,
      );
      u.svg('rect', { width: 32, height: 32, fill: '#73b9b4' }, ic);
      pencil(ic);
      u.el('div', 'pc-title', head, C.title);
      u.el('nav', 'pc-nav', head, C.nav.join('  •  '));
      const main = u.el('div', 'pc-main', shell),
        left = u.el('div', 'pc-left', main),
        right = u.el('aside', 'pc-right', main);
      const tz = u.el('section', 'pc-zone pc-task', left);
      u.el('div', 'pc-tab', tz, 'Task');
      const note = u.el('div', 'pc-panel pc-note', tz);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') tz.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const dz = u.el('section', 'pc-zone pc-draw', left);
      u.el('div', 'pc-tab', dz, 'Drawing Area');
      const stage = u.el('main', 'stage pc-panel', dz);
      stage.dataset.role = 'stage';
      u.el('div', 'pc-tab pc-tab-r', right, 'Tools');
      const rp = u.el('div', 'pc-panel pc-tools', right);
      const pen = u.el('button', 'pc-tool selected', rp);
      pen.type = 'button';
      const pi = u.svg('svg', { width: 96, height: 96, viewBox: '0 0 32 32', shapeRendering: 'crispEdges' }, pen);
      pencil(pi);
      u.el('span', '', pen, 'Pencil');
      const clr = u.el('button', 'pc-tool clear', rp);
      clr.type = 'button';
      const ci = u.svg('svg', { width: 96, height: 96, viewBox: '0 0 32 32', shapeRendering: 'crispEdges' }, clr);
      for (const [d, fill] of [
        ['M2 18L17 3H29L31 5V17L18 30H4L2 28Z', '#080e30'],
        ['M3 19L18 4H28L30 6L17 20Z', '#fff'],
        ['M17 20L30 6V16L17 28Z', '#567087'],
        ['M4 20H17V28H4Z', '#c3cdd2'],
        ['M4 20H6V27H4Z', '#edf0ec'],
        ['M6 27H17V28H6Z', '#a9b8c4'],
        ['M17 20L30 6V8L19 20Z', '#91a7b5'],
      ])
        u.svg('path', { d, fill }, ci);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('hr', 'pc-rule', rp);
      u.el('div', 'pc-hint', rp, 'Use the pencil to draw one continuous circle.');
      let submit = null;
      if (!ctx.finish) {
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end'),
          place = er.pick(['side', 'side', 'side', 'side', 'tab', 'head', 'tab']);
        const label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels));
        const makeEnd = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = () => ctx.submit();
          return b;
        };
        if (place === 'side') submit = makeEnd(right, 'submit pc-submit', label);
        if (place === 'head') submit = makeEnd(head, 'pc-end pc-end-head', label);
        const collideRng = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (collideRng.bool(0.3)) {
          const same = (x) => labelOf(x).trim().toLowerCase() === label.trim().toLowerCase();
          const choices = labels.filter((x) => !same(x));
          if (choices.length) collide = labelOf(collideRng.pick(choices));
        }
        if (place === 'tab' || (collide && place !== 'tab')) {
          const tools = u.el('div', 'pc-task-tools', tz);
          if (place === 'tab') submit = makeEnd(tools, 'pc-end pc-end-tab', label);
          else if (collide) {
            const d = u.el('button', 'pc-end pc-xtra', tools, collide);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.onclick = () => env.log('decoy', { label: collide, collide: true });
          }
        }
        if (collide && place === 'tab') {
          const d = u.el('button', 'pc-end pc-xtra pc-xtra-head', head, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: collide, collide: true });
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
