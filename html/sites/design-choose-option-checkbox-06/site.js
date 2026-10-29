(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-06',
    'brand': 'Edit Listing',
    'instruction': 'top',
    'rail': 'Listings|Calendar|Messages|Host Tools|Settings',
    'menu': 'Basic Info|Location|Amenities|Photos|Pricing|Availability',
    'briefTitle': 'Your Task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'tour' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-tag', top, 'A place for memorable stays');
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['footer', 'footer', 'footer', 'header', 'link', 'header']);
      const labels = ctx.content && ctx.content.END_LABELS;
      const endLabels = Array.isArray(labels)
        ? labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
        : [];
      const alternatives = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
      const label = placement === 'footer' ? 'Submit' : alternatives.length ? er.pick(alternatives) : 'Done';
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3) && Array.isArray(labels) && labels.length) {
        const pool = [
          ...new Set(labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))),
        ].filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-btn ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let headSubmit = null;
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', t === 'Amenities' ? 'on' : '', nav, t));
        if (placement === 'header' && !ctx.finish) {
          const tools = u.el('div', 'ds-endtools', nav);
          headSubmit = u.el('button', 'ds-submit ds-head-submit', tools, label);
          headSubmit.type = 'button';
          headSubmit.dataset.role = 'submit';
          headSubmit.addEventListener('click', () => ctx.submit());
        }
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        u.el('div', 'ds-logo', rail, 'CozyStays');
        C.rail.split('|').forEach((t, i) => u.el('div', i === 0 ? 'on' : '', rail, t));
      }
      const chk = u.el('aside', 'ds-check', document.body);
      u.el('h3', '', chk, 'Listing checklist');
      ['Basic information', 'Location', 'Amenities', 'Photos', 'Pricing', 'Availability'].forEach((t) => {
        const r = u.el('div', t === 'Amenities' ? 'on' : '', chk);
        u.el('i', '', r);
        r.append(t);
      });
      u.el('p', '', chk, 'Small details make a big difference.');
      const pv = u.el('aside', 'ds-preview', document.body);
      u.el('h3', '', pv, 'Preview');
      u.el('div', 'ds-pic', pv);
      u.el('h4', '', pv, 'Seaside Apartment');
      u.el('p', '', pv, 'Bright and comfortable stay near the coast.');
      const stats = u.el('div', 'ds-stats', pv);
      ['4 guests', '2 bedrooms', '1 bathroom'].forEach((t) => u.el('span', '', stats, t));
      const content = u.el('div', 'ds-content', body);
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
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        chk.classList.add('ds-task-panel');
        chk.querySelector('h3').textContent = C.briefTitle;
        briefing(chk, 'ds-brief ds-panel-note');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const sd = u.el('button', 'ds-btn', foot, 'Save draft');
      sd.type = 'button';
      sd.addEventListener('click', () => env.log('decoy', { label: 'Save draft' }));
      let submit = headSubmit;
      if (collide) decoyBtn(foot, collide, true);
      if (!ctx.finish) {
        const pb = u.el('button', 'ds-btn ds-pbtn', foot, 'Preview');
        pb.type = 'button';
        pb.addEventListener('click', () => env.log('decoy', { label: 'Preview' }));
        if (placement === 'footer') {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'link') {
          submit = u.el('button', 'ds-endlink', foot, label + ' ›');
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', () => ctx.submit());
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
        const dismiss = u.el('button', '', el, 'Skip tour');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => {
          env.log('reference-obstruction-dismiss', { kind: 'tour' });
          ctx.dismiss('close');
        });
        return { el, dismiss };
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
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
