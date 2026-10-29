(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-guess-04',
    'task': 'solve-puzzle',
    'scenario': 'guess',
    'style': 'dark',
    'title': 'Number Guess',
    'menu': 'A simple game of logic',
    'note': '',
    'layout': 'horizontal',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top),
        badge = u.el('div', 'number-badge', brand, '123'),
        titles = u.el('div', 'brand-copy', brand);
      u.el('strong', 'brand-title', titles, C.title);
      u.el('span', 'brand-subtitle', titles, 'Think • Guess • Figure It Out');
      u.el('div', 'tagline', top, 'A small challenge for a sharper you');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      if (ctx.display === 'panel')
        brief.insertAdjacentHTML('afterbegin', '<span class="episode-kicker">Episode settings</span>');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app),
        dockInfo = u.el('div', 'dock-info', footer),
        game = u.el('div', 'dock-card game-card', dockInfo),
        progress = u.el('div', 'dock-card progress-card', dockInfo);
      u.el('b', 'dock-heading', game, 'Game Info');
      u.el('div', 'dock-value range-value', game, 'Number range:');
      u.el('div', 'dock-value total-value', game, 'Total guesses:');
      u.el('b', 'dock-heading', progress, 'Your Progress');
      u.el('div', 'progress-dots', progress);
      u.el('div', 'progress-label', progress, '0 guesses used');
      let submit = null;
      if (!ctx.finish) {
        const endR = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ],
          labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
          alternates = labels.map(labelOf).filter((x) => x.toLowerCase() !== 'submit'),
          label = endR.bool(0.5) ? 'Submit' : labelOf(endR.pick(alternates)),
          placement = endR.pick(['dock', 'dock', 'header', 'link']),
          actions = u.el('div', 'dock-actions', footer),
          cr = ctx.rng.fork('chrome/collide'),
          collide = cr.bool(0.3)
            ? cr.pick(labels.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase()))
            : null;
        const addDecoy = (parent, text) => {
          const b = u.el('button', 'episode-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        };
        if (placement === 'header') {
          const b = u.el('button', 'submit header-submit', top, label);
          b.type = 'button';
          b.addEventListener('click', ctx.submit);
          submit = b;
        } else if (placement === 'link') {
          const b = u.el('button', 'end-link', actions, label + ' ›');
          b.type = 'button';
          b.addEventListener('click', ctx.submit);
          submit = b;
        } else {
          submit = u.el('button', 'submit', actions, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        }
        if (collide) addDecoy(placement === 'header' ? top : actions, collide);
        if (placement !== 'header') u.el('span', 'dock-divider', actions);
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
