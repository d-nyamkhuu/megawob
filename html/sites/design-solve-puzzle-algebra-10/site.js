(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-algebra-10',
    'task': 'solve-puzzle',
    'scenario': 'algebra',
    'style': 'human',
    'title': 'Alex’s Homepage',
    'menu': 'Math   •   Friends   •   Books   •   Good Times',
    'note': 'Instructions',
    'layout': 'brief-left',
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
        top = u.el('header', 'top', app);
      u.el('div', 'web-badge', top, '◎  A Brighter\nInternet Together');
      u.el('span', 'masthead-title', top, C.title);
      u.el('div', 'home-icon home-left', top, '⌂');
      u.el('div', 'home-icon home-right', top, '⌂');
      u.el('div', 'day-badge', top, 'GOOD PEOPLE\nBRIGHT DAYS  ☼');
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        stage = u.el('section', 'stage', center),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        clear = u.el('button', 'clear-answer', center, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = center.querySelector('.answer input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      const bar = u.el('div', 'article-bar', center);
      u.el('strong', '', bar, 'Today’s Math Corner');
      u.el('span', '', bar, 'April 27, 1996');
      const greeting = u.el('div', 'greeting', center);
      u.el('span', 'pencil-icon', greeting, '✎');
      u.el('span', '', greeting, 'A little practice goes a long way!');
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', 'aside-title', aside, C.note);
      const asideInstruction = u.el('p', 'aside-instruction', aside, ctx.display === 'hidden' ? '' : ctx.instruction);
      u.el('b', 'aside-heading', aside, 'Tips');
      const tips = u.el('ul', 'aside-list', aside);
      u.el('li', '', tips, 'Solve the equation for x.');
      u.el('li', '', tips, 'Type your answer as a number (e.g., 7).');
      u.el('b', 'aside-heading', aside, 'Actions');
      const actions = u.el('ul', 'aside-list', aside);
      u.el('li', '', actions, 'Use your keyboard to type in the box.');
      u.el('div', 'aside-flower', aside, '❀');
      u.el('div', 'aside-blessing', aside, 'Have a great day!');
      const footer = u.el('footer', 'home-footer', app);
      const links = u.el('section', 'home-cell favorite-links', footer);
      u.el('h3', '', links, 'My Favorite Links');
      u.el('p', '', links, '▤　Books I Like');
      u.el('p', '', links, '◉　Cool Sites');
      u.el('p', '', links, '♣　Animals');
      u.el('p', '', links, '★　Fun Stuff');
      const visitor = u.el('section', 'home-cell visitor-note', footer);
      u.el('h3', '', visitor, 'A Note for Visitors');
      u.el(
        'p',
        '',
        visitor,
        'Thanks for stopping by my homepage! I’m a high school student who enjoys math, reading, and meeting new people online. Sign my guestbook!',
      );
      u.el('div', 'smiley', visitor, '☺');
      const guest = u.el('section', 'home-cell guestbook', footer);
      u.el('h3', '', guest, 'Guestbook');
      u.el('p', '', guest, '▤　Sign Guestbook');
      u.el('p', '', guest, '　　View Guestbook');
      u.el('p', '', guest, '　　Leave a Note');
      const bottom = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide'),
          labels = ctx.content.END_LABELS,
          placement = er.pick(['legacy', 'legacy', 'legacy', 'aside', 'footer', 'aside']),
          label = placement === 'legacy' ? 'Submit' : er.pick(labels),
          same = (x) => String(x).trim().toLowerCase() === String(label).trim().toLowerCase();
        const decoy = (parent, text, collide) => {
          const b = u.el('button', collide ? 'homepage-xtra collide' : 'homepage-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () =>
            env.log('decoy', collide ? { label: text, collide: true } : { label: text }),
          );
        };
        if (cr.bool(0.3)) {
          const choices = labels.filter((x) => !same(x));
          if (choices.length) decoy(aside, cr.pick(choices), true);
        }
        if (placement === 'legacy') {
          submit = u.el('button', 'submit', bottom, 'Submit');
        } else if (placement === 'aside') {
          submit = u.el('a', 'homepage-end aside-end', aside, label + ' ›');
          submit.href = '#';
        } else {
          submit = u.el('button', 'homepage-end footer-end', footer, label);
        }
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (ctx.display === 'hidden') {
        brief.remove();
        asideInstruction.remove();
      } else if (ctx.display === 'header') {
        asideInstruction.remove();
      } else if (ctx.display === 'panel') {
        brief.remove();
      } else {
        brief.remove();
        asideInstruction.classList.add('instruction-toast');
        aside.querySelector('.aside-title').textContent = 'New message';
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
