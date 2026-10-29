(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-10',
    'brand': 'Preferences - Topic Selection',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Help',
    'briefTitle': 'Your Task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'toast' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const nav = u.el('nav', 'ds-menu', top);
      ['Home', 'Our Town', 'Events', 'Interest Groups', 'Photo Gallery', 'Guestbook'].forEach((t) => {
        const a = u.el('a', '', nav, t);
        a.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const mast = u.el('div', 'ds-mast', top);
      const mt = u.el('div', 'ds-mast-t', mast);
      u.el('span', 'ds-tree', mt);
      u.el('span', 'ds-mast-h', mt, 'Maple Grove Community');
      u.el('span', 'ds-tree', mt);
      u.el('div', 'ds-mast-s', mast, 'Neighbors ✦ Ideas ✦ A Brighter Tomorrow');
      u.el('div', 'ds-house', top, '⌂');
      const tag = u.el('div', 'ds-tag', top, 'Small Town\nBig Friendships');
      u.el('span', 'ds-flowers', top);
      const wel = u.el('div', 'ds-welcome', top);
      u.el('h3', '', wel, 'Welcome to Maple Grove!');
      u.el(
        'p',
        '',
        wel,
        'Maple Grove is a friendly online home for neighbors, hobbyists, and lifelong learners. Explore interest groups, share ideas, and find local events.',
      );
      const wq = u.el('div', 'ds-wq', wel);
      u.el('div', 'ds-pic', wq);
      u.el('em', '', wq, '“A stronger community grows together.”');
      const ql = u.el('div', 'ds-ql', top);
      u.el('h3', '', ql, 'Quick Links');
      ['Community Calendar', 'Local Resources', 'Neighborhood Directory', 'Contact Us'].forEach((t, i) => {
        const a = u.el('a', '', ql);
        const icon = u.el('img', 'ds-link-icon', a);
        icon.src = 'sites/' + C.site + '/assets/' + ['calendar', 'people', 'book', 'mail'][i] + '.webp';
        icon.alt = '';
        u.el('span', '', a, t);
      });
      u.el('div', 'ds-split', document.body);
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const lh = u.el('div', 'ds-lhead', content);
      u.el('span', 'ds-checklist', lh);
      u.el('span', 'ds-lh-h', lh, 'Update Your Interests');
      u.el('span', 'ds-lh-d', lh, 'Tuesday, April 16, 1996');
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (cls === 'ds-brief')
          u.el(
            'div',
            'ds-desc',
            b,
            'Choose the topics you’re interested in. This helps us show you relevant news, events, and discussion groups.',
          );
        return b;
      }
      if (mode === 'top') {
        briefing(content, 'ds-header-note');
        u.el(
          'div',
          'ds-desc',
          content,
          'Choose the topics you’re interested in. This helps us show you relevant news, events, and discussion groups.',
        );
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? ql.querySelector('h3') : foot;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'ds-end-link' : placement === 'header' ? 'ds-submit ds-header-submit' : 'ds-submit',
          parent,
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
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool);
          const decoy = u.el('button', 'ds-submit ds-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      // Fit long templates before the widget builds its fixed anchors.
      const note = content.querySelector('.ds-instruction');
      if (note) {
        let font = parseFloat(getComputedStyle(note).fontSize);
        while (font > 12 && foot.getBoundingClientRect().bottom > content.getBoundingClientRect().bottom + 0.5) {
          font -= 1;
          note.style.setProperty('font-size', font + 'px', 'important');
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const el = u.el('section', 'ds-initial ds-initial-tour', document.body);
        el.dataset.role = 'overlay';
        u.el('h2', '', el, 'Welcome!');
        u.el('p', '', el, 'Take a quick tour to learn about setting your preferences.');
        const dismiss = u.el('button', '', el, 'Guestbook');
        dismiss.title = 'Skip tour';
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
      }
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
