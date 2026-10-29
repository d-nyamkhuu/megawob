(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-ascending-05',
    'task': 'read-figure',
    'scenario': 'ascending',
    'style': 'civic',
    'title': 'Number Practice',
    'menu': '',
    'note': 'How to complete this task:',
    'layout': 'docked',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        endLabels = ctx.content.END_LABELS.map(labelOf);
      const primary = endRng.bool(0.5),
        placement = primary ? 'footer' : endRng.pick(['header', 'link']),
        endLabel = primary ? 'Submit' : endRng.pick(endLabels);
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top);
      u.el('span', 'brand-mark', brand);
      u.el('span', '', brand, C.title);
      const frameTools = u.el('div', 'chrome-tools', top);
      if (collideRng.bool(0.3)) {
        const label = collideRng.pick(
            endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
          ),
          decoy = u.el('button', 'chrome-xtra', frameTools, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      const help = u.el('div', 'help', top);
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      u.el('span', '', help, 'Help');
      u.el('span', 'help-icon', help, '?');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      u.el(
        'div',
        'brief-subtitle',
        center,
        ctx.display === 'hidden' ? '' : 'Select each number in order, from the smallest value to the largest value.',
      );
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app),
        note = u.el('div', 'dock-note', footer);
      u.el('span', 'info-icon', note, 'i');
      const copy = u.el('div', 'dock-copy', note);
      u.el('b', '', copy, ctx.display === 'hidden' ? C.title : C.note);
      u.el(
        'p',
        '',
        copy,
        ctx.display === 'hidden' ? '' : 'Click the numbers in order from the smallest value to the largest value.',
      );
      let submit = null;
      if (!ctx.finish) {
        const tools = u.el('div', 'dock-tools', footer);
        u.el('button', 'clear-all', tools, 'Clear All');
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'header' ? frameTools : tools,
          endLabel,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
