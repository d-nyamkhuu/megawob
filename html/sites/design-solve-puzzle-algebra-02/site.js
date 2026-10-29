(function () {
  'use strict';
  env.site({
    name: 'design-solve-puzzle-algebra-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'newspaper';
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', 'masthead', top, 'The Daily Chronicle');
      const account = u.el('div', 'account', top);
      u.el('div', '', account, 'Tuesday, April 12, 2011');
      u.el('p', '', account, 'Log In  |  Register');
      const nav = u.el('nav', 'menu', top);
      for (const label of ['HOME', 'NEWS', 'BUSINESS', 'SPORTS', 'OPINION', 'LIFE', 'ENTERTAINMENT', 'CLASSIFIEDS'])
        u.el('span', '', nav, label);
      const search = u.el('div', 'site-search', nav);
      const searchbox = u.el('input', '', search);
      searchbox.placeholder = 'Search the site...';
      searchbox.setAttribute('aria-label', 'Search the site');
      const go = u.el('button', '', search, 'Go');
      go.type = 'button';
      const center = u.el('div', 'center', app),
        sidebar = u.el('aside', 'challenge', center);
      u.el('div', 'section-label', sidebar, 'LEARNING');
      u.el('h1', '', sidebar, 'Today’s Math Challenge');
      for (const text of [
        'Practice your problem-solving skills with a quick question from our daily exercises.',
        'Read the instructions carefully and enter your answer.',
        'Good luck!',
      ])
        u.el('p', '', sidebar, text);
      const work = u.el('div', 'workspace', center),
        heading = u.el('div', 'work-heading', work);
      u.el('div', 'section-label', heading, 'MATH PRACTICE');
      u.el('h2', '', heading, 'Linear Equations');
      let display = ctx.display || 'header';
      if ((display === 'panel' && window.innerWidth < 1180) || (display === 'toast' && window.innerHeight < 700))
        display = 'header';
      document.body.classList.add('instruction-' + display);
      if (display === 'header') u.el('div', 'brief', work, ctx.instruction);
      else if (display === 'panel') {
        const note = u.el('div', 'brief instruction-panel', sidebar, ctx.instruction);
        note.setAttribute('role', 'note');
      } else if (display === 'toast') {
        const note = u.el('div', 'brief instruction-toast', work, ctx.instruction);
        note.setAttribute('role', 'status');
      }
      const stage = u.el('section', 'stage', work);
      let submit = null;
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end'),
          defaultEnd = r.bool(0.5),
          labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
            "I'm done",
          ],
          label = defaultEnd ? 'Submit' : labelOf(r.pick(labels)),
          placement = defaultEnd ? 'footer' : r.pick(['header', 'link']);
        const endBtn = (parent, cls, text) => {
          const b = u.el(cls === 'newspaper-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        const decoyBtn = (parent, text) => {
          const b = u.el('button', 'newspaper-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        if (placement === 'header') {
          const tools = u.el('div', 'newspaper-tools', top);
          submit = endBtn(tools, 'newspaper-primary-end newspaper-header-end', label);
        } else if (placement === 'link') {
          const tools = u.el('div', 'newspaper-tools newspaper-link-tools', app);
          submit = endBtn(tools, 'newspaper-endlink', label + ' ›');
        } else {
          const footer = u.el('footer', 'bottom newspaper-footer', app);
          submit = endBtn(footer, 'submit newspaper-primary-end newspaper-footer-button', label);
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase(),
            options = [...new Set(labels.map(labelOf))].filter((x) => !same(x));
          if (options.length) {
            const collide = cr.pick(options),
              where = cr.pick(['header', 'footer']),
              parent =
                where === 'header'
                  ? u.el('div', 'newspaper-tools newspaper-pq-tools', top)
                  : u.el('div', 'newspaper-tools newspaper-pq-footer', app);
            decoyBtn(parent, collide);
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el(
        'span',
        '',
        el,
        {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss };
    },
  });
})();
