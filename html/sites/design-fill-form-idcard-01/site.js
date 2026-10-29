(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-idcard-01',
    'brand': 'People Manager',
    'title': 'Add Contact',
    'instruction': 'left',
    'rail': '',
    'menu': 'Home|Contacts|View|Tools|Help',
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
      const er = ctx.rng.fork('chrome/end');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const preferred = labels.find((x) => labelOf(x).trim().toLowerCase() === 'done') || labels[0];
      const alternate = labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'done');
      const original = !ctx.finish && er.bool(0.5);
      const endLabel = original ? 'Done' : labelOf(er.pick(alternate.length ? alternate : labels));
      const placement = ctx.finish ? null : original ? 'toolbar' : er.pick(['toolbar', 'status', 'footer']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collide = { label: cr.pick(choices), where: 'toolbar' };
      }
      const head = u.el('header', 'df-top', document.body);
      u.el('strong', 'df-brand', head, 'DocuFill');
      const nav = u.el('nav', 'df-nav', head);
      [
        ['▤', 'Document to Form', true],
        ['▯', 'Documents'],
        ['▦', 'Templates'],
        ['◷', 'History'],
      ].forEach(([ico, label, on]) => {
        const x = u.el('div', 'df-tab' + (on ? ' active' : ''), nav);
        u.el('b', '', x, ico);
        u.el('span', '', x, label);
      });
      const right = u.el('div', 'df-actions', head);
      u.el('span', '', right, '⚙');
      u.el('span', 'df-user', right, '●');
      let submit = null;
      const makeEnd = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'df-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (!ctx.finish && placement === 'toolbar') submit = makeEnd(right, 'df-submit', endLabel);
      if (collide) decoy(right, collide.label);
      const body = u.el('div', 'ds-body', document.body);
      const side = u.el('aside', 'df-side', body);
      [
        ['▣', 'Identity Cards', '12', true],
        ['◎', 'Passports', '3'],
        ['▤', 'Utility Bills', '7'],
        ['■', 'Other Documents', '5'],
      ].forEach(([ico, label, n, on]) => {
        const row = u.el('div', 'df-row' + (on ? ' selected' : ''), side);
        u.el('b', '', row, ico);
        u.el('span', '', row, label);
        u.el('strong', '', row, n);
      });
      u.el('hr', '', side);
      [
        ['✓', 'Processed', '0'],
        ['◷', 'Remaining', '12'],
      ].forEach(([ico, label, n]) => {
        const row = u.el('div', 'df-stat', side);
        u.el('b', '', row, ico);
        u.el('span', '', row, label);
        u.el('strong', '', row, n);
      });
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      function briefing(parent, cls) {
        const x = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', x, ctx.instruction);
        return x;
      }
      if (mode === 'top') briefing(content, 'df-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left') briefing(side, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(foot, 'ds-submit', endLabel);
      if (placement === 'status') {
        const status = u.el('div', 'df-status', content, 'Ready');
        if (!ctx.finish) submit = makeEnd(status, 'ds-status-end', endLabel, 'a');
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
