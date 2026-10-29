(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-10',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'memphis',
    'title': 'Shape Spotter',
    'note': 'Shape Identification',
    'layout': 'twin-pane',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', 'brand', top, C.title);
      u.el('small', '', top, 'Small shapes. Big thinking.');
      u.el('i', 'dot', top);
      const center = u.el('div', 'center', app);
      const left = u.el('div', 'leftpane', center);
      const text = ctx.display === 'hidden' ? '' : ctx.instruction;
      const brief = u.el('div', 'brief', left);
      const q = text.indexOf('? '),
        comma = text.indexOf(', then ');
      if (q > 0) {
        u.el('b', '', brief, text.slice(0, q + 1));
        u.el('span', '', brief, text.slice(q + 2));
      } else if (comma > 0) {
        u.el('b', '', brief, text.slice(0, comma + 1));
        u.el('span', '', brief, text.slice(comma + 2));
      } else u.el('b', '', brief, text);
      const stage = u.el('section', 'stage', left);
      const right = u.el('div', 'rightpane', center);
      u.el('div', 'prompt', right, 'Choose the name of the shape:');
      u.el('div', 'optslot', right);
      const decor = u.svg(
        'svg',
        { class: 'memphis-art', viewBox: '0 0 1672 818', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
        center,
      );
      u.svg('circle', { cx: 38, cy: -10, r: 118, fill: '#e6b1f0' }, decor);
      u.svg('path', { d: 'M0 529L217 818H0Z', fill: '#dfc8f6' }, decor);
      u.svg('circle', { cx: 1644, cy: 848, r: 114, fill: '#e3c3f5' }, decor);
      u.svg(
        'path',
        {
          d: 'M1572 38L1579 60Q1581 65 1588 60L1601 51Q1607 48 1611 59L1618 72Q1620 76 1627 70L1638 62Q1643 58 1646 70L1651 84',
          fill: 'none',
          stroke: '#dfb7f1',
          'stroke-width': 11,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        decor,
      );
      for (const [x, y] of [
        [82, 136],
        [117, 151],
        [51, 185],
        [89, 201],
      ])
        u.svg(
          'path',
          { d: `M${x} ${y}l-18 21`, stroke: '#ff8c86', 'stroke-width': 12, 'stroke-linecap': 'round' },
          decor,
        );
      for (let x = 0; x < 4; x++)
        for (let y = 0; y < 4; y++)
          u.svg('circle', { cx: 41 + x * 29, cy: 660 + y * 30, r: 5, fill: '#7f7fa8' }, decor);
      for (let x = 0; x < 3; x++)
        for (let y = 0; y < 5; y++)
          u.svg('circle', { cx: 1618 + x * 24, cy: 669 + y * 26, r: 5, fill: '#ff7b7d' }, decor);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const footer = u.el('footer', 'bottom', app);
      u.el('span', '', footer, 'Learn  •  Practice  •  Grow');
      u.el('span', '', footer, 'Shapes make a brighter day');
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const referenceEnd = !er.bool(0.5),
        label = referenceEnd ? 'Submit' : er.pick(labels),
        placement = referenceEnd ? 'pane' : er.pick(['header', 'footer']);
      let tools = null;
      const headerTools = () => {
        if (!tools) {
          tools = u.el('div', 'chrome-tools', top);
          top.classList.add('has-tools');
        }
        return tools;
      };
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'pane' ? right : placement === 'header' ? headerTools() : footer;
        submit = u.el(
          'button',
          'submit' + (placement === 'pane' ? '' : ' end-' + placement) + (label.length > 10 ? ' end-long' : ''),
          parent,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (cr.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool),
            b = u.el('button', 'chrome-xtra', headerTools(), text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
