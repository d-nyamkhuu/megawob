(function () {
  'use strict';
  const C = { 'site': 'design-solve-puzzle-odd-even-09', 'task': 'solve-puzzle', 'scenario': 'odd-even' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'directory split-level instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top),
        globe = u.svg('svg', { width: 100, height: 100, viewBox: '0 0 100 100', class: 'globe' }, brand);
      u.svg('circle', { cx: 50, cy: 50, r: 47, fill: '#0757ce' }, globe);
      u.svg(
        'path',
        {
          d: 'M48 5c-8 9-9 18-4 25l-8 9 6 8-9 7 8 12-1 11 9 17 10-6-2-13 10-13-3-9 11-9-9-6 8-9-8-7 2-12-13-7z',
          fill: '#5cbd57',
          stroke: '#e8eeff',
          'stroke-width': 1,
        },
        globe,
      );
      u.el('div', 'brand-copy', brand, 'WorldWeb');
      u.el('div', 'brand-tag', brand, 'Your Guide to the Internet');
      const search = u.el('div', 'search-box', top);
      u.el('strong', '', search, 'Search the Web:');
      const field = u.el('input', 'search-input', search);
      field.type = 'text';
      field.setAttribute('aria-label', 'Search the Web');
      const sb = u.el('button', 'search-button', search, 'Search');
      sb.type = 'button';
      u.el('div', 'search-modes', search, '◉  Web Pages       ◯  Directories       ◯  News');
      const quick = u.el('div', 'quick-links', top);
      u.el('div', '', quick, 'Home  |  Help  |  Site Map  |  Contact');
      u.el('div', 'date', quick, 'Monday, March 9, 1998');
      const directory = u.el('nav', 'directory-links', app),
        groups = [
          ['Arts & Humanities', 'Literature', 'History', 'Visual Arts', 'Performing Arts', 'Philosophy', 'More...'],
          ['Business & Economy', 'Companies', 'Investing', 'Jobs', 'Real Estate', 'Small Business', 'More...'],
          ['Computers & Internet', 'Hardware', 'Software', 'Internet', 'Programming', 'Multimedia', 'More...'],
          ['Education', 'K-12', 'Colleges & Universities', 'Distance Learning', 'Libraries', 'Reference', 'More...'],
          ['Health', 'Medicine', 'Mental Health', 'Fitness', 'Nutrition', 'Diseases', 'More...'],
          ['Recreation & Sports', 'Travel', 'Outdoors', 'Sports', 'Games', 'Hobbies', 'More...'],
        ];
      groups.forEach((items) => {
        const col = u.el('div', 'directory-column', directory);
        u.el('strong', '', col, items[0]);
        items.slice(1).forEach((label) => {
          const a = u.el('a', '', col, label);
          a.href = '#';
          a.addEventListener('click', (e) => e.preventDefault());
        });
      });
      const center = u.el('section', 'center', app),
        brief = u.el(
          'div',
          'brief instruction-' + ctx.display,
          center,
          ctx.display === 'hidden' ? '' : ctx.instruction,
        ),
        stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app);
      if (ctx.display === 'hidden') brief.style.display = 'none';
      const er = ctx.rng.fork('chrome/end'),
        bank = ctx.content && ctx.content.END_LABELS,
        labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        referenceEnd = er.bool(0.5),
        label = referenceEnd ? 'Submit' : labelOf(er.pick(labels)),
        place = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      let tools = null;
      const endTools = () => tools || (tools = u.el('div', 'portal-tools', quick));
      let submit = null;
      if (!ctx.finish) {
        if (place === 'footer') {
          submit = u.el('button', 'submit', footer, label);
        } else {
          submit = u.el(
            place === 'link' ? 'a' : 'button',
            place === 'link' ? 'portal-endlink' : 'portal-end',
            endTools(),
            place === 'link' ? label + ' ›' : label,
          );
          if (place === 'link') submit.href = '#';
        }
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const same = (x) => labelOf(x).trim().toLowerCase() === label.trim().toLowerCase(),
          opts = labels.filter((x) => !same(x));
        if (opts.length) {
          const text = labelOf(cr.pick(opts)),
            decoy = u.el('button', 'portal-xtra', endTools(), text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
