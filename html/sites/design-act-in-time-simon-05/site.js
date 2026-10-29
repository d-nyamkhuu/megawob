(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-simon-05',
    brand: 'Rivermere Public Library',
    menu: 'Home|Search Catalog|Research Tools|Events|My Account|Help|Site Map',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-bookmark', top, '▤');
      const mast = u.el('div', 'ds-mast', top);
      u.el('span', 'ds-brand', mast, C.brand);
      u.el('span', 'ds-tagline', mast, 'Catalog　•　Discover　•　Learn　•　Belong');
      u.el('span', 'ds-motto', top, 'Knowledge Builds\nBrighter Tomorrows');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t, i) => u.el('span', i > 4 ? 'ds-nav-right' : '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      u.el('h1', 'ds-title', content, 'Memory Sequence');
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      if ((mode === 'panel' || mode === 'toast') && top.getBoundingClientRect().width < 900) mode = 'header';
      document.body.dataset.simonbrief = mode;
      document.body.dataset.simonfinish = String(ctx.finish);
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Rivermere Public Library　 |　 123 Maple Avenue　 |　 Rivermere, OR 97035');
      const er = ctx.rng.fork('chrome/end');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels = (
        bank && bank.length ? bank : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => String(x.label || x));
      const original = er.bool(0.5);
      const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const placement = original ? 'footer' : er.pick(['nav', 'link']);
      document.body.dataset.simonend = ctx.finish ? 'none' : placement;
      const navTools = u.el('div', 'ds-nav-tools', nav);
      let submit = null;
      function endControl(parent, cls, text) {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'A') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      if (!ctx.finish) {
        if (placement === 'nav') submit = endControl(navTools, 'ds-submit-nav', label);
        else if (placement === 'link') submit = endControl(foot, 'ds-endlink', label + ' ›');
        else submit = endControl(foot, 'ds-submit', label);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const options = (
          bank && bank.length
            ? bank.map((x) => String(x.label || x))
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        ).filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (options.length) {
          const d = u.el('button', 'ds-xtra', placement === 'nav' ? navTools : foot, cr.pick(options));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      if (navTools.children.length) nav.classList.add('ds-menu-tools');
      const detail = u.el('aside', 'ds-book-detail', document.body);
      u.el('div', 'ds-detail-title', detail, 'Book Details');
      const cover = u.el('div', 'ds-cover', detail);
      u.el('span', '', cover, 'The Riverside Chronicles');
      const info = u.el('div', 'ds-biblio', detail);
      u.el('strong', '', info, 'The Riverside Chronicles');
      u.el('div', '', info, 'Carter, E. L.');
      u.el('div', '', info, 'Call Number:　FIC CAR');
      u.el('div', '', info, 'Publication Date:　1992');
      u.el('div', '', info, 'Format:　Book');
      u.el('div', '', info, 'Subjects:　Rivers -- Fiction');
      u.el('p', 'ds-book-blurb', detail, 'A sweeping novel about a town, its river, and the people who call it home.');
      const actions = u.el('div', 'ds-book-actions', detail);
      ['Add to List', 'Save Record', 'View Similar'].forEach((t) => u.el('button', '', actions, t));
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
