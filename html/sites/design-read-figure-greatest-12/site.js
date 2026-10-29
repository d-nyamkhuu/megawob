(function () {
  'use strict';
  const C = { site: 'design-read-figure-greatest-12', task: 'read-figure', scenario: 'greatest' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const width = (ctx.size && (ctx.size.width || ctx.size.w)) || document.documentElement.clientWidth || 1280,
        display = ctx.display === 'panel' && width < 1150 ? 'header' : ctx.display;
      document.body.className = 'forum-ledger instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('strong', 'brand', top, 'Brain Practice Forum');
      const account = u.el('div', 'account', top, 'Welcome, Guest　 |　 Help　 |　 Sign Out');
      const nav = u.el('nav', 'menu', app);
      ['Home', 'Practice', 'Discussions', 'Members'].forEach((x, i) => u.el('span', i === 1 ? 'active' : '', nav, x));
      const search = u.el('div', 'search', nav),
        field = u.el('span', 'search-text', search, 'Search topics…');
      u.el('button', 'search-go', search, 'Go');
      const content = ctx.content || {},
        labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)),
        endBank =
          Array.isArray(content.END_LABELS) && content.END_LABELS.length
            ? content.END_LABELS.map(labelText)
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
        endRng = ctx.rng.fork('chrome/end'),
        keepDefault = endRng.bool(0.5),
        defaultLabel = endBank.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit',
        alternates = endBank.filter((x) => x.trim().toLowerCase() !== 'submit'),
        place = keepDefault ? 'footer' : endRng.pick(['footer', 'header', 'link', 'icon']),
        label = keepDefault ? defaultLabel : alternates.length ? endRng.pick(alternates) : defaultLabel,
        collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(endBank.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (options.length)
          collision = { label: collideRng.pick(options), where: collideRng.pick(['header', 'footer']) };
      }
      const addDecoy = (parent, text, collides) => {
        const b = u.el('button', 'xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const center = u.el('div', 'center', app),
        left = u.el('section', 'work-panel', center);
      u.el('div', 'section-bar', left, 'Number Cards');
      u.el('div', 'brief', left, display === 'header' ? ctx.instruction : '');
      const quick = u.el('div', 'quick-wrap', left),
        quickBtn = u.el('button', 'quick', quick, 'ϟ  Quick action (disabled)');
      quickBtn.disabled = true;
      u.el('small', 'quick-note', quick, 'This feature is not available now.');
      const stage = u.el('section', 'stage', left),
        footer = u.el('footer', 'bottom', left);
      let submit = null;
      if (!ctx.finish && place === 'footer') submit = endButton(footer, 'submit', label);
      if (!ctx.finish && place === 'link') {
        const link = u.el('a', 'end-link', footer, label + ' ›');
        link.href = '#';
        link.title = label;
        link.setAttribute('aria-label', label);
        link.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = link;
      }
      if (!ctx.finish && place === 'header') submit = endButton(account, 'header-end', label);
      if (!ctx.finish && place === 'icon') submit = endButton(account, 'header-end icon-end', '✓');
      if (collision && collision.where === 'footer') addDecoy(footer, collision.label, true);
      if (collision && collision.where === 'header') addDecoy(account, collision.label, true);
      const clear = u.el('button', 'clear-deco', footer, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const reset = document.querySelector('.reference-reset');
        if (reset) reset.click();
      });
      const aside = u.el('aside', 'aside', center),
        thread = u.el('section', 'thread-panel', aside);
      u.el('div', 'section-bar', thread, 'Thread');
      if (display === 'panel' || display === 'toast') {
        const card = u.el('div', display === 'panel' ? 'instruction-card' : 'toast-note', thread);
        u.el(
          'b',
          display === 'panel' ? 'instruction-title' : 'toast-title',
          card,
          display === 'panel' ? 'Practice note' : 'New practice note',
        );
        u.el('div', display === 'panel' ? 'instruction-copy' : 'toast-copy', card, ctx.instruction);
      }
      const posts = [
        ['Admin', 'Apr 12, 2003 10:14 AM', "Today's practice: Compare the numbers and choose the largest one."],
        ['Learner1', 'Apr 12, 2003 10:16 AM', 'Remember to look for negative signs.'],
        ['Learner2', 'Apr 12, 2003 10:17 AM', 'Zero can be larger than negative numbers!'],
        ['Admin', 'Apr 12, 2003 10:20 AM', 'Click a card.'],
      ];
      posts.forEach((p, i) => {
        const row = u.el('div', 'post post-' + i, thread),
          head = u.el('div', 'post-head', row);
        u.el('b', 'author', head, '▤  ' + p[0]);
        u.el('time', '', head, p[1]);
        u.el('p', '', row, p[2]);
      });
      const preview = u.el('section', 'preview-panel', aside);
      u.el('div', 'section-bar', preview, 'Preview');
      const pane = u.el('div', 'preview-empty', preview);
      u.el('div', 'mono', pane, 'No card selected');
      u.el('p', '', pane, 'Click a card to see it here.');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
