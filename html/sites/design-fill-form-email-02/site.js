(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-02',
    'brand': 'Mail',
    'title': 'Add Contact',
    'instruction': 'right',
    'rail': '',
    'menu': 'Reply|Reply All|Forward|Delete|Flag',
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
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'form' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3);
      const frame = u.el('div', 'ds-frame', document.body);
      const top = u.el('header', 'ds-top', frame);
      const ic = u.el('span', 'ds-icon', top);
      ic.innerHTML =
        '<svg viewBox="0 0 32 38" aria-hidden="true"><path fill="#ff7b18" d="M3 1h20l8 8v26a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z"/><path fill="#ffbd89" d="M23 1v8h8Z"/><path fill="white" d="M8 9h12v7h6v14H8Z"/><path stroke="#ff9a49" stroke-width="1.6" d="M11 19h12M11 23h12M11 27h12"/></svg>';
      u.el('span', 'ds-brand', top, 'Information Transfer');
      const stp = u.el('span', 'ds-step', top, 'Step 1 of 1');
      u.el('i', 'ds-dot', stp);
      const tools = u.el('div', 'ds-tools', top);
      if (collide) {
        const options = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'ds-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const body = u.el('div', 'ds-body', frame);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const roomy = content.clientWidth >= 1150;
      const tall = frame.clientHeight >= 590;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast' && tall
            ? 'toast'
            : ctx.display === 'panel' && roomy
              ? 'left'
              : 'top';
      frame.dataset.instruction = mode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') {
          u.el('span', 'ds-panel-marker', b, '!');
          u.el('h2', '', b, C.briefTitle || 'Task');
        }
        if (cls === 'ds-header-note') u.el('span', 'ds-bang', b, '!');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top' || mode === 'right') briefing(content, 'ds-header-note');
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
      let submit = null;
      if (!ctx.finish) {
        foot.classList.toggle('ds-footer-link', placement === 'link');
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'header' ? ' ds-submit-header' : placement === 'link' ? ' ds-submit-link' : ''),
          placement === 'header' ? tools : foot,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (!foot.children.length) foot.remove();
      if (!tools.children.length) tools.remove();
      frame.protectEnd = () => {
        if (!submit || placement === 'header') return;
        const a = submit.getBoundingClientRect();
        const overlaps = Array.from(stage.querySelectorAll('.ff-field')).some((field) => {
          const b = field.getBoundingClientRect();
          return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        });
        if (!overlaps) return;
        if (!tools.isConnected) top.append(tools);
        submit.classList.remove('ds-submit-link');
        submit.classList.add('ds-submit-header');
        tools.append(submit);
        foot.remove();
      };
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
