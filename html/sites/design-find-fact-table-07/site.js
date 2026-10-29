(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-07',
    'brand': 'The Daily Chronicle',
    'tag': 'TRUSTED NEWS|FOR A BRIGHTER TOMORROW',
    'date': 'Tuesday, March 15, 2011',
    'title': 'Community Volunteers',
    'sub': 'Match the details from the table below.',
    'instruction': 'top',
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
      const page = u.el('div', 'ds-page', document.body);
      const mast = u.el('header', 'ds-mast', page);
      const brand = u.el('span', 'ds-brand', mast);
      brand.setAttribute('aria-label', C.brand);
      u.el('span', 'ds-brand-lettering', brand, '𝕿𝖍𝖊 𝕯𝖆𝖎𝖑𝖞 𝕮𝖍𝖗𝖔𝖓𝖎𝖈𝖑𝖊').setAttribute('aria-hidden', 'true');
      u.el('span', 'ds-rule', mast);
      const tag = u.el('span', 'ds-tag', mast);
      C.tag.split('|').forEach((t) => u.el('div', '', tag, t));
      u.el('span', 'ds-date', mast, C.date);
      const head = u.el('div', 'ds-head', page);
      u.el('h1', '', head, C.title);
      u.el('p', '', head, C.sub);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const content = page;
      if (mode === 'top') briefing(content, 'ds-header-note');
      let toastBrief = null;
      if (mode === 'toast') {
        toastBrief = briefing(content, 'ds-toast');
      }
      const main = u.el('div', 'ds-main', content);
      let panelBrief = null;
      if (mode === 'left' || mode === 'right') {
        panelBrief = briefing(main, 'ds-brief');
        if (mode === 'right') panelBrief.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = !endR.bool(0.5);
      const placement = referenceEnd ? 'footer' : endR.pick(['inspector', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels.filter((label) => label !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'ds-end-link' : 'ds-submit',
          foot,
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
      const clr = u.el('button', 'ds-clear', foot, 'Clear All');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        stage.querySelectorAll('input').forEach((i) => {
          i.value = '';
          i.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
      const side = u.el('aside', 'ds-side', document.body);
      u.el('div', 'ds-side-rule', side);
      u.el('h2', '', side, 'Record Lookup');
      const g = u.el('section', 'ds-box', side);
      u.el('h3', '', g, 'Field Guide');
      u.el('p', '', g, 'Use the table on the left to find the matching value for each field.');
      u.el('hr', '', g);
      u.el('h3', '', g, 'Fields to complete');
      const ul = u.el('ul', 'ds-field-guide', g);
      if (panelBrief) {
        side.insertBefore(panelBrief, g);
        g.hidden = true;
      }
      if (toastBrief) {
        side.insertBefore(toastBrief, g);
        g.hidden = true;
      }
      const h = u.el('section', 'ds-box', side);
      u.el('h3', '', h, 'Need help?');
      u.el('p', '', h, 'Read the table carefully and make sure each entry matches the correct person.');
      if (submit && placement === 'inspector') {
        const actions = u.el('div', 'ds-inspector-actions', side);
        actions.append(submit);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideR.pick(options);
          const decoy = u.el('button', 'ds-clear ds-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
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
