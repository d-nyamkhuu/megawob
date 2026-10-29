(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-01',
    'brand': 'Topic Selection',
    'title': 'Available Topics',
    'instruction': 'left',
    'rail': '',
    'menu': 'Sort: A to Z',
    'briefTitle': 'Instructions',
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
      u.el('span', 'ds-brand', top, C.brand);
      const lamps = u.el('div', 'ds-carbon-lamps', top);
      for (let i = 0; i < 3; i++) u.el('i', '', lamps);
      const search = u.el('input', 'ds-carbon-search', top);
      search.type = 'text';
      search.placeholder = 'Search';
      let toolbar = null;
      if (C.menu) {
        toolbar = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', toolbar, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : ctx.display === 'header'
                ? 'top'
                : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task Briefing');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (cls === 'ds-brief') {
          const help = u.el('div', 'ds-carbon-help', b);
          [
            'You will see a list of options on the right. Select only the specified options using the checkboxes.',
            'Do not select any other options.',
          ].forEach((t) => u.el('p', '', help, t));
        }
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-header-note ds-toast-note');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const keep = er.bool(0.5);
        const label = keep ? 'Submit' : labelOf(er.pick(bank));
        const placement = keep ? 'footer' : er.pick(['top', 'link']);
        const makeSubmit = (parent, cls, text) => {
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
        };
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const options = [...new Set(bank.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = labelOf(cr.pick(options));
        }
        if (placement === 'top') submit = makeSubmit(top, 'ds-submit ds-top-submit', label);
        else if (placement === 'link') submit = makeSubmit(foot, 'ds-end-link', label + ' ›');
        else submit = makeSubmit(foot, 'ds-submit', label);
        if (collide) {
          const d = u.el('button', 'ds-xtra', foot, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      const clear = u.el('button', 'ds-carbon-clear', foot, 'Clear All');
      clear.type = 'button';
      foot.insertBefore(clear, foot.firstChild);
      const cancel = u.el('button', 'ds-carbon-cancel', foot, 'Cancel');
      cancel.type = 'button';
      if (submit && submit.parentNode === foot) foot.insertBefore(cancel, submit);
      else foot.appendChild(cancel);
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
