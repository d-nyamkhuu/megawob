(function () {
  'use strict';
  const C = {
    title: ['Palette', 'Pro'],
    tag: 'Simple tools for a brighter web',
    tabs: ['Home', 'Match Color', 'Saved Swatches', 'Help'],
    active: 1,
  };
  env.site({
    name: 'design-pick-color-swatch-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design w2g' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      const logo = u.svg('svg', { class: 'logo', width: 58, height: 74, viewBox: '0 0 58 74' }, brand);
      const defs = u.svg('defs', {}, logo),
        leaf = u.svg('linearGradient', { id: 'palette-leaf', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
      u.svg('stop', { offset: '0%', 'stop-color': '#91cc5d' }, leaf);
      u.svg('stop', { offset: '100%', 'stop-color': '#45a238' }, leaf);
      u.svg(
        'path',
        {
          d: 'M55 3C37 10 17 9 7 27C-2 44 6 57 19 59C40 62 52 48 55 3Z',
          fill: 'url(#palette-leaf)',
          stroke: '#5c9b3e',
          'stroke-width': 1.5,
        },
        logo,
      );
      u.svg(
        'path',
        {
          d: 'M7 70C15 48 26 31 47 13',
          fill: 'none',
          stroke: '#3e842c',
          'stroke-width': 3.5,
          'stroke-linecap': 'round',
        },
        logo,
      );
      u.svg('path', { d: 'M8 40C11 23 28 15 48 9', fill: 'none', stroke: '#b5dc90', 'stroke-width': 1.2 }, logo);
      const bt = u.el('div', 'brand-text', brand);
      const t = u.el('div', 'brand-title', bt);
      u.el('span', 'b1', t, C.title[0]);
      t.append(' ');
      u.el('span', 'b2', t, C.title[1]);
      u.el('div', 'brand-sub', bt, C.tag);
      const nav = u.el('nav', 'tabs', head);
      C.tabs.forEach((n, i) => {
        const b = u.el('button', 'tab' + (i === C.active ? ' active' : ''), nav, n);
        b.type = 'button';
        b.onclick = () => env.log('tab', { n });
      });
      const content = u.el('div', 'content', shell);
      const note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const reset = u.el('button', 'clear', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.widgetDef.clear?.();
      let submit = null;
      let collide = null;
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const oldLabel = 'Submit';
      const endLabel = labelOf(endRng.pick(labels));
      const placement = ctx.finish ? 'none' : endRng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      if (!ctx.finish) {
        const makeEnd = (parent, cls, text, aria) => {
          const b = u.el(cls === 'submit-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', aria || endLabel);
          b.title = aria || endLabel;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (placement === 'footer') submit = makeEnd(footer, 'submit', oldLabel);
        else if (placement === 'header') submit = makeEnd(nav, 'tab end-tab', endLabel);
        else if (placement === 'link') submit = makeEnd(footer, 'submit-link', endLabel + ' ›');
        else submit = makeEnd(footer, 'submit icon-submit', '✓', endLabel);
        const opts = labels.map(labelOf).filter(
          (x) =>
            x.trim().toLowerCase() !==
            String(placement === 'footer' ? oldLabel : endLabel)
              .trim()
              .toLowerCase(),
        );
        if (collideRng.bool(0.3) && opts.length) collide = collideRng.pick(opts);
        if (collide) {
          const b = u.el(
            'button',
            placement === 'header' ? 'tab end-xtra' : 'end-xtra',
            placement === 'header' ? nav : footer,
            collide,
          );
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', { label: collide, collide: true });
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
      const title =
        {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind] || 'Notice';
      const text =
        {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind] || '';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const a = u.el('button', 'dismiss', box, 'Accept optional');
        a.type = 'button';
        a.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
