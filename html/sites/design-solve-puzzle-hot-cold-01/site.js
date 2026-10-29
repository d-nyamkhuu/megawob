(function () {
  'use strict';
  const C = { site: 'design-solve-puzzle-hot-cold-01' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'library instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top);
      const display =
        (ctx.display === 'panel' || ctx.display === 'toast') && app.clientWidth < 1150 ? 'header' : ctx.display;
      document.body.className = 'library instruction-' + display;
      const logo = u.svg('svg', { width: 118, height: 82, viewBox: '0 0 118 82', class: 'book-logo' }, brand);
      u.svg(
        'path',
        {
          d: 'M8 15Q30 5 57 17V72Q32 59 8 68ZM57 17Q83 5 109 15V68Q82 59 57 72Z',
          fill: '#f6efe2',
          stroke: 'currentColor',
          'stroke-width': 2,
        },
        logo,
      );
      for (let y = 22; y < 64; y += 6) {
        u.svg(
          'path',
          { d: `M14 ${y}q19 -8 37 0M63 ${y}q19 -8 40 0`, fill: 'none', stroke: 'currentColor', 'stroke-width': 0.8 },
          logo,
        );
      }
      const identity = u.el('div', 'identity', brand);
      u.el('div', 'library-name', identity, 'Rivermere Public Library');
      u.el('div', 'tagline', identity, 'Books　·　People　·　Ideas　·　Since 1892');
      const mast = u.el('div', 'mast-right', top);
      u.el('nav', 'mast-links', mast, 'Catalog　 |　 Hours　 |　 My Account　 |　 Help');
      u.el('div', 'motto', mast, 'A More Informed Tomorrow');
      const body = u.el('div', 'body-grid', app),
        nav = u.el('nav', 'side-nav', body);
      for (const [i, s] of [
        'Search Catalog',
        'Advanced Search',
        'Browse by Subject',
        'New Arrivals',
        'Collections',
        'Research Guides',
        'Library Information',
      ].entries()) {
        const a = u.el('div', 'nav-item' + (i === 0 ? ' active' : ''), nav, s);
        a.setAttribute('aria-hidden', 'true');
      }
      const content = u.el('section', 'work', body),
        intro = u.el('div', 'intro', content);
      u.el('h1', '', intro, 'Library Catalog');
      u.el('p', '', intro, 'Find books, journals, media and more.');
      const brief = u.el('div', 'brief', content, display === 'hidden' ? '' : ctx.instruction);
      const mid = u.el('div', 'mid', content),
        stage = u.el('section', 'stage', mid),
        aside = u.el('aside', 'aside', mid);
      const stack = u.svg('svg', { viewBox: '0 0 280 300', class: 'book-stack' }, aside);
      u.svg(
        'path',
        {
          d: 'M20 76l28-20 198 12-16 53-202-3z M18 134l30-19 200 13-16 55-205-4z M15 194l35-20 203 15-19 57-207-5z',
          fill: '#f5eee2',
          stroke: '#49332d',
          'stroke-width': 4,
        },
        stack,
      );
      u.svg(
        'path',
        { d: 'M42 77l191 9m-195 48 191 11m-194 50 194 12', fill: 'none', stroke: '#876f60', 'stroke-width': 3 },
        stack,
      );
      u.el('div', 'book-words', aside, 'Knowledge\nBuilds\nStronger\nCommunities');
      u.el('blockquote', 'quote', aside, '“Good books are\ngood citizens.”');
      u.el('div', 'attribution', aside, '— Daniel Webster');
      const footer = u.el('footer', 'bottom', app),
        tips = u.el('div', 'dock-col tips', footer);
      u.svg('svg', { viewBox: '0 0 64 64', class: 'dock-icon' }, tips).innerHTML =
        '<circle cx="26" cy="26" r="19"/><path d="M40 40l17 17"/>';
      const tipst = u.el('div', 'dock-copy', tips);
      u.el('b', '', tipst, 'Search Tips');
      u.el('p', '', tipst, 'Try a title, author, subject,\nor keyword. Use fewer words\nfor more results.');
      const examples = u.el('div', 'dock-col examples', footer);
      u.svg('svg', { viewBox: '0 0 72 58', class: 'open-book' }, examples).innerHTML =
        '<path d="M4 8q17-6 32 2v42Q20 44 4 50zM68 8q-17-6-32 2v42q16-8 32-2z"/>';
      const ex = u.el('div', 'dock-copy', examples);
      u.el('b', '', ex, 'Example Searches');
      u.el('p', '', ex, '•　animal behavior\n•　mark twain\n•　climate change\n•　medieval history'); // Episode choices use independent streams, leaving the widget's seeded draws intact.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'dock' : er.pick(['toolbar', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(endLabels.filter((x) => x !== 'Submit'));
      const tools = u.el('div', 'catalog-tools', intro),
        actions = u.el('div', 'dock-actions', footer);
      let submit = null;
      if (!ctx.finish) {
        const link = placement === 'link';
        submit = u.el(
          link ? 'a' : 'button',
          link ? 'end-link' : 'submit' + (placement === 'toolbar' ? ' toolbar-submit' : ''),
          placement === 'toolbar' ? tools : actions,
          label,
        );
        if (link) submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (ctx.finish || placement === 'toolbar') {
        actions.classList.add('finish-actions');
        u.el('span', 'reader-services', actions, 'Reader Services');
      }
      const clear = u.el('button', 'clear', actions, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
      if (cr.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            decoy = u.el('button', 'catalog-xtra', tools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      if (tools.childElementCount) intro.classList.add('has-tools');
      else tools.remove();
      if (display === 'hidden') brief.remove();
      if (display === 'panel') aside.appendChild(brief);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el('span', '', el, 'Library information');
      const dismiss = u.el('button', '', el, 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
