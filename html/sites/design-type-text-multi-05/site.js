(function () {
  'use strict';
  const C = {
    site: 'design-type-text-multi-05',
    brand: 'Willow & Birch',
    title: 'Personal Information',
    instruction: 'right',
    rail: 'Personal Info|Security|Preferences|Notifications|Billing|Help|Sign out',
    menu: 'ACCOUNT',
    briefTitle: 'Instructions',
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
      const mast = u.el('div', 'ds-mast', top);
      u.el('span', 'ds-brand', mast, 'The Daily Chronicle');
      u.el('span', 'ds-tag', mast, 'Local News. A Stronger Community.');
      const tnav = u.el('nav', 'ds-tnav', top);
      ['News', 'Sports', 'Opinion', 'Life', 'Obituaries', 'Classifieds'].forEach((t) => u.el('span', '', tnav, t));
      u.el('span', 'ds-tsep', tnav);
      const sr = u.el('span', 'ds-search', tnav);
      sr.innerHTML =
        '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c8102e" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg>';
      const content = u.el('div', 'ds-content', document.body);
      const title = u.el('h1', 'ds-h1', content, 'Create Your Account');
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display;
      if (mode !== 'hidden') {
        const b = u.el(
          'aside',
          mode === 'toast' ? 'ds-brief ds-toast' : mode === 'panel' ? 'ds-brief ds-brief-panel' : 'ds-brief',
          content,
        );
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const lede = u.el('p', 'ds-lede', content);
      lede.append('Create an account to access more of ');
      u.el('em', '', lede, 'The Daily Chronicle');
      lede.append(', including saved articles and personalized settings.');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const dock = u.el('nav', 'ds-dock', document.body);
      const ic = {
        Home: '<path d="M2 11l10-10 10 10h-1v11h-7v-6h-5v6H2V11z" fill="#fff"/>',
        Sections:
          '<rect x="4" y="3" width="16" height="18" rx="1" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M12 6h5M12 9h5M7 12h10M7 16h10" stroke="#fff" stroke-width="2"/><rect x="7" y="6" width="3" height="4" fill="#fff"/>',
        Saved: '<path d="M6 3h12v18l-6-5-6 5z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>',
        Settings:
          '<rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(0 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(45 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(90 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(135 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(180 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(225 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(270 12 12)"/><rect x="10" y="1" width="4" height="6" rx=".8" fill="#f4f4f4" transform="rotate(315 12 12)"/><circle cx="12" cy="12" r="8" fill="#f4f4f4"/><circle cx="12" cy="12" r="4" fill="#292929"/>',
        Help: '<circle cx="12" cy="12" r="10" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M9 9.5a3 3 0 116 0c0 2-3 2-3 4" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="12" cy="17.5" r="1.3" fill="#fff"/>',
      };
      Object.keys(ic).forEach((t) => {
        const d = u.el('div', 'ds-dk', dock);
        const s = u.el('span', 'ds-dki', d);
        s.innerHTML = '<svg viewBox="0 0 24 24" width="46" height="46">' + ic[t] + '</svg>';
        u.el('span', '', d, t);
      });

      const er = ctx.rng.fork('chrome/end');
      const cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const bank = (key, fallback) =>
        ctx.content && Array.isArray(ctx.content[key]) && ctx.content[key].length
          ? ctx.content[key].map(labelOf)
          : fallback;
      const endLabels = bank('END_LABELS', [
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
      ]);
      const alternateLabels = endLabels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = er.bool(0.5) || !alternateLabels.length ? 'Submit' : er.pick(alternateLabels);
      const placement = er.pick(['footer', 'footer', 'footer', 'title', 'masthead']);
      const collidePool = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = collidePool.length && cr.bool(0.3) ? { label: cr.pick(collidePool), collide: true } : null;
      const filler = bank('DECOY_LABELS', ['Help', 'Save draft', 'Cancel']);
      const decoy = collide || (cr.bool(0.35) ? { label: cr.pick(filler), collide: false } : null);
      const addDecoy = (parent) => {
        if (!decoy) return;
        const b = u.el('button', 'ds-xtra', parent, decoy.label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', decoy.collide ? { label: decoy.label, collide: true } : { label: decoy.label }),
        );
      };
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? foot : placement === 'title' ? title : tnav;
        const cls = placement === 'footer' ? 'ds-submit' : placement === 'title' ? 'ds-title-end' : 'ds-mast-end';
        submit = u.el('button', cls, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      addDecoy(placement === 'footer' ? tnav : foot);
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
