(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-07',
    'brand': 'The Daily Chronicle',
    'tagline': 'LOCAL NEWS  FOR A BRIGHTER TOMORROW',
    'date': 'Mon, Apr 18, 2011',
    'instruction': 'left',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      // These streams leave all existing task and frame randomness unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map(labelOf);
      const placement = er.bool(0.5) ? 'form' : er.pick(['header', 'shelf']);
      const label = placement === 'form' ? 'Submit' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      const alternatives = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = cr.bool(0.3) && alternatives.length ? cr.pick(alternatives) : null;
      function logDecoy(el, text, collides) {
        el.dataset.role = 'xtra';
        el.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', collides ? { label: text, collide: true } : { label: text });
        });
        return el;
      }
      function end(parent, cls) {
        const b = u.el(placement === 'shelf' ? 'a' : 'button', cls, parent, label);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      const top = u.el('header', 'ds-top', document.body);
      const mast = u.el('span', 'ds-brand', top);
      u.el('span', 'ds-brand-t', mast, C.brand);
      u.el('span', 'ds-rule', top);
      u.el('span', 'ds-tag', top, C.tagline);
      u.el('span', 'ds-spacer', top);
      u.el('span', 'ds-date', top, C.date);
      u.el('span', 'ds-rule2', top);
      logDecoy(u.el('a', 'ds-link', top, 'Help'), 'Help');
      u.el('span', 'ds-rule2', top);
      logDecoy(u.el('a', 'ds-link', top, 'Contact Us'), 'Contact Us');
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = end(top, 'ds-submit ds-header-end');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      if (mode === 'panel') {
        const panel = briefing(content, 'ds-panel-note');
        const caption = u.el('strong', 'ds-panel-caption', panel, 'Contact desk instructions');
        panel.insertBefore(caption, panel.firstChild);
      }
      const main = u.el('div', 'ds-main', content);
      let brief = null;
      if (mode === 'left' || mode === 'right') brief = briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', main);
      if (!ctx.finish && placement === 'form') submit = end(foot, 'ds-submit');
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      logDecoy(cancel, 'Clear');
      const shelf = u.el('div', 'ds-shelf', document.body);
      u.el('span', '', shelf, '© 2011 The Daily Chronicle');
      u.el('span', 'ds-rule2', shelf);
      u.el('span', '', shelf, 'All rights reserved.');
      u.el('span', 'ds-spacer', shelf);
      if (!ctx.finish && placement === 'shelf') submit = end(shelf, 'ds-link ds-shelf-end');
      if (collide) {
        const decoy = u.el('button', 'ds-link ds-end-xtra', shelf, collide);
        decoy.type = 'button';
        logDecoy(decoy, collide, true);
      }
      logDecoy(u.el('a', 'ds-link', shelf, 'Terms of Use'), 'Terms of Use');
      u.el('span', 'ds-rule2', shelf);
      logDecoy(u.el('a', 'ds-link', shelf, 'Privacy Policy'), 'Privacy Policy');
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
