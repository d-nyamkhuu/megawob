(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-grid-09',
    'task': 'read-figure',
    'scenario': 'grid',
    'style': 'riscos',
    'title': 'RISC OS 4 · Coordinate Plotter',
    'menu': '',
    'note': 'Coordinate Plotter',
    'layout': 'utility',
    'subtitle': '',
    'aside':
      'A Cartesian grid is shown on the right. Click the point at the specified coordinate.\n\nAxes are numbered.\nThe origin (0,0) is marked.\nNegative coordinates are shown.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (C.style === 'riscos') {
        u.el('span', 'window-title', top, C.title);
        const close = u.el('button', 'window-close', top, '×');
        close.type = 'button';
        close.addEventListener('click', () => env.log('decoy', { label: 'Close' }));
      } else {
        u.el('span', '', top, C.title);
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      if (C.style === 'riscos') {
        const tools = u.el('div', 'tool-cluster', footer);
        [
          ['Select', '➤', 'active'],
          ['Add Point', '●', ''],
          ['Erase', '◩', ''],
          ['Show Grid', '▦', 'active'],
        ].forEach(([label, icon, active]) => {
          const b = u.el('button', 'tool ' + active, tools);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label }));
          u.el('span', 'tool-icon', b, icon);
          u.el('span', 'tool-label', b, label);
        });
        const coords = u.el('div', 'coordinate-cluster', footer);
        ['X', 'Y'].forEach((axis) => {
          const group = u.el('label', 'coordinate', coords);
          u.el('b', '', group, axis + ':');
          const field = u.el('span', 'readout', group, '-');
          field.setAttribute('aria-hidden', 'true');
        });
      }
      // Separate streams preserve every existing episode and task-content draw.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5),
        placement = original ? 'footer' : er.pick(['header', 'link']);
      const endLabel = original ? 'Submit' : er.pick(endLabels);
      let headerTools = null;
      const titleTools = () => {
        if (!headerTools) {
          headerTools = u.el('div', 'end-tools', top);
          const close = top.querySelector('.window-close');
          if (close) top.insertBefore(headerTools, close);
          top.classList.add('has-end-tools');
        }
        return headerTools;
      };
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit' + (placement === 'header' ? ' title-submit' : placement === 'link' ? ' end-link' : ''),
          placement === 'header' ? titleTools() : footer,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const choices = [...new Set(endLabels)].filter(
          (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) {
          const label = cr.pick(choices),
            decoy = u.el('button', 'end-xtra', titleTools(), label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
