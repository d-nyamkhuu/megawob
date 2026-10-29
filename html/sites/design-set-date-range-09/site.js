(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-range-09',
    'brand': 'Data Range',
    'title': 'Report Generator',
    'tag': 'Prepare your date range and generate the report.',
    'heading': 'Date Range',
    'intro': 'Select the start date and end date for your report.',
  };
  const ICONS = [
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><rect x="11" y="13" width="3" height="3"/></svg>',
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="miter"><path d="M5 2h10l5 6v14H5z"/><path d="M14 2v7h6M8 12h9M8 16h9"/></svg>',
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><path d="M6 20V12M12 20V8M18 20V4"/></svg>',
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2.5l1.6 2.4 2.8-.6.7 2.8 2.7 1-.9 2.7 1.8 2.2-2.2 1.8.3 2.8-2.8.5-1.1 2.6-2.5-1.3-2.5 1.3-1.1-2.6-2.8-.5.3-2.8-2.2-1.8 1.8-2.2-.9-2.7 2.7-1 .7-2.8 2.8.6z"/></svg>',
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const left = u.el('aside', 'bx-left', document.body);
      const brand = u.el('div', 'bx-brand', left);
      u.el('span', 'bx-dot', brand);
      const nm = u.el('span', 'bx-name', brand, C.brand);
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : 'left';
      const mainCol = u.el('div', 'bx-main', document.body);
      const head = u.el('header', 'bx-head', mainCol);
      u.el('span', 'bx-title', head, C.title);
      u.el('span', 'bx-tag', head, C.tag);
      const content = u.el('div', 'ds-content', mainCol);
      function instr(parent, cls) {
        const b = u.el('aside', cls, parent);
        const d = u.el('div', 'ds-instruction', b);
        const t = String(ctx.instruction || '');
        const i = t.indexOf(': ');
        if (i > 0) {
          d.append(document.createTextNode(t.slice(0, i + 1)));
          u.el('br', '', d);
          u.el('span', 'bx-red', d, t.slice(i + 2));
        } else {
          const date = t.match(
            /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d|\b\d{4}-\d{2}-\d{2}/i,
          );
          if (date && date.index > 0) {
            d.append(document.createTextNode(t.slice(0, date.index).trim()));
            u.el('br', '', d);
            u.el('span', 'bx-red', d, t.slice(date.index));
          } else d.textContent = t;
        }
        return b;
      }
      if (mode === 'left') instr(left, 'bx-note');
      if (mode === 'toast') {
        const note = instr(content, 'ds-toast');
      }
      const intro = u.el('div', 'bx-intro', content);
      u.el('h2', '', intro, C.heading);
      u.el('p', '', intro, C.intro);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const clear = u.el('button', 'bx-clear', foot, 'Clear');
      clear.type = 'button';
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['footer', 'header', 'link', 'footer']);
      const original = placement === 'footer';
      const endLabel = original ? 'Submit' : er.pick(endLabels.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'header' ? ' bx-end-header' : placement === 'link' ? ' bx-end-link' : ''),
          placement === 'header' ? head : foot,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) {
          const label = cr.pick(choices);
          const decoy = u.el('button', 'bx-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const rail = u.el('aside', 'bx-rail', document.body);
      ICONS.forEach((s, i) => {
        const b = u.el('div', 'bx-ico' + (i === 0 ? ' on' : ''), rail);
        b.innerHTML = s;
      });
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
