(function () {
  'use strict';
  const C = { site: 'design-act-in-time-moving-07' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const page = u.el('div', 'ds-page', document.body);
      const tabs = u.el('nav', 'ds-tabs', page);
      ['Home', 'Search', 'People', 'News', 'Shopping', 'Games', 'Reference', 'Help'].forEach((t, i) =>
        u.el('div', 'ds-tab' + (i === 5 ? ' active' : ''), tabs, t),
      );
      const rings = u.el('div', 'ds-rings', page);
      for (let i = 0; i < 11; i++) u.el('i', '', rings);
      const paper = u.el('div', 'ds-paper', page);
      const head = u.el('header', 'ds-directory', paper);
      const logo = u.el('div', 'ds-logo', head);
      u.el('span', 'ds-globe', logo, '');
      const word = u.el('div', 'ds-wordmark', logo);
      u.el('strong', '', word, 'WebWorld');
      u.el('small', '', word, 'Your Guide to the Internet');
      const cols = u.el('div', 'ds-links', head);
      [
        [
          'Web Directory',
          'Arts & Humanities',
          'Business & Economy',
          'Computers & Internet',
          'Education',
          'Entertainment',
        ],
        ['People', 'Find People', 'Classmates', 'Chat', 'Groups', 'Message Boards'],
        ['Reference', 'Maps & Travel', 'News', 'Science', 'Sports', 'Weather'],
        ['Shopping', 'Books', 'Music', 'Electronics', 'Home & Garden', 'Toys & Games'],
      ].forEach((group) => {
        const col = u.el('div', 'ds-linkcol', cols);
        u.el('b', '', col, group[0]);
        group.slice(1).forEach((t) => u.el('a', '', col, t));
      });
      const search = u.el('section', 'ds-search', head);
      u.el('b', '', search, 'Search the Web');
      const row = u.el('div', 'ds-searchrow', search);
      const input = u.el('span', 'ds-searchinput', row, '');
      const sb = u.el('button', 'ds-searchbutton', row, 'Search');
      sb.type = 'button';
      const links = u.el('div', 'ds-searchlinks', search);
      u.el('a', '', links, 'Advanced Search');
      u.el('a', '', links, 'Search Tips');
      u.el('div', 'ds-date', head, 'Mon, Apr 27, 1998');
      const title = u.el('div', 'ds-title', paper, 'Shape Catcher');
      const content = u.el('div', 'ds-content', paper);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-note');
      if (mode === 'panel') briefing(content, 'ds-panel-note');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', paper);
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const labelItem = er.pick(labels);
      const label =
        typeof labelItem === 'string'
          ? labelItem
          : labelItem.label || labelItem.text || labelItem.name || String(labelItem);
      const placement = er.pick(['footer', 'footer', 'header', 'link']);
      function endButton(parent, cls, text) {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
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
        if (placement === 'footer') submit = endButton(foot, 'ds-submit', label);
        else if (placement === 'header') submit = endButton(title, 'ds-submit ds-title-end', label);
        else submit = endButton(foot, 'ds-end-link', label + ' ›');
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const pool = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
        const choices = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) collide = cr.pick(choices);
      }
      if (collide) {
        const parent = placement === 'footer' ? title : foot;
        const d = u.el('button', 'ds-xtra', parent, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
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
