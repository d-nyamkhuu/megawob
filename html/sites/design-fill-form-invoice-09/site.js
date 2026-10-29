(function () {
  'use strict';
  const C = { site: 'design-fill-form-invoice-09', brand: 'Data Entry Pro', tabs: 'Home|Invoices|Reports|Settings' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body),
        brand = u.el('span', 'ds-brand', top);
      brand.innerHTML =
        '<svg viewBox="0 0 24 28" width="30" height="34"><path d="M2 1h14l6 6v20H2z" fill="#a5e6dc" stroke="#091c3c" stroke-width="2"/><path d="M16 1v7h6" fill="#5194b0" stroke="#091c3c" stroke-width="2"/><path d="M6 10h9M6 14h12M6 18h12M6 22h8" stroke="#1b4a85" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand-name', brand, C.brand);
      const tabs = u.el('nav', 'ds-tabs', top);
      C.tabs.split('|').forEach((t) => u.el('span', 'ds-tab' + (t === 'Invoices' ? ' on' : ''), tabs, t));
      const links = u.el('div', 'ds-links', top);
      links.innerHTML = '<span><u>H</u>elp</span><i>|</i><span>Log Out</span>';
      const body = u.el('div', 'ds-body', document.body),
        content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'header';
      if (mode === 'toast' && window.innerHeight < 700) mode = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls !== 'ds-toast') {
          const ic = u.el('span', 'ds-note-ic', b);
          ic.innerHTML =
            '<svg viewBox="0 0 24 28" width="32" height="38"><path d="M2 1h14l6 6v20H2z" fill="#a5e6dc" stroke="#091c3c" stroke-width="2"/><path d="M16 1v7h6" fill="#5194b0" stroke="#091c3c" stroke-width="2"/><path d="M6 10h9M6 14h12M6 18h12M6 22h8" stroke="#1b4a85" stroke-width="2"/></svg>';
        }
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        const panel = u.el('aside', 'ds-instruction-panel', main);
        u.el('div', 'ds-panel-title', panel, 'Task Instructions');
        briefing(panel, 'ds-panel-note');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content),
        cancel = u.el('button', 'ds-cancel', foot, 'Clear Form');
      cancel.type = 'button';
      let submit = null;
      const er = ctx.rng.fork('chrome/end'),
        rawLabels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = rawLabels.map(labelOf),
        baseEnd = er.bool(0.5),
        label = baseEnd ? 'Submit' : labelOf(er.pick(rawLabels));
      const placement = baseEnd ? 'footer' : er.pick(['footer', 'header', 'link']);
      const addEnd = (parent, cls, text) => {
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
      const dr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && dr.bool(0.3)) {
        const opts = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (opts.length) collide = dr.pick(opts);
      }
      if (!ctx.finish && placement === 'header') submit = addEnd(links, 'ds-submit ds-head-submit', label);
      if (!ctx.finish && placement === 'link') submit = addEnd(foot, 'ds-end-link', label + ' ›');
      if (!ctx.finish && placement === 'footer') submit = addEnd(foot, 'ds-submit', label);
      if (collide) {
        const parent = placement === 'footer' ? foot : links,
          b = u.el('button', 'ds-xtra', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
