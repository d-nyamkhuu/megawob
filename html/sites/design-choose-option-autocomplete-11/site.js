(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-autocomplete-11',
    'brand': 'Civic Services Portal',
    'instruction': 'top',
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
      const nav = u.el('nav', 'ds-nav', top);
      ['My Account', 'Help', 'Sign Out'].forEach((t) => u.el('span', '', nav, t));
      const ov = u.el('section', 'ds-overview', document.body);
      const ovl = u.el('div', 'ds-ov-left', ov);
      u.el('h1', '', ovl, 'Office Visit Request');
      u.el('p', 'ds-ov-sub', ovl, 'Request an appointment at a local office.');
      const steps = u.el('div', 'ds-steps', ovl);
      [
        ['1', 'Your Details', 1],
        ['2', 'Choose an Office', 0],
        ['3', 'Review & Submit', 0],
      ].forEach((s, i) => {
        if (i) u.el('i', 'ds-step-line', steps);
        const st = u.el('span', 'ds-step' + (s[2] ? ' on' : ''), steps);
        u.el('b', '', st, s[0]);
        u.el('em', '', st, s[1]);
      });
      const ovr = u.el('div', 'ds-ov-right', ov);
      u.el('h2', '', ovr, 'Need to know');
      const ul = u.el('ul', '', ovr);
      [
        'Appointments help us serve you faster.',
        'Bring a valid ID to your visit.',
        'You will receive a confirmation by email.',
      ].forEach((t) => u.el('li', '', ul, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      if (mode === 'panel' && window.innerWidth < 1100) mode = 'header';
      if (mode === 'toast' && window.innerHeight < 700) mode = 'header';
      u.el('h2', 'ds-work-title', content, 'Your Details');
      u.el('p', 'ds-work-sub', content, 'Please provide your information and preferred office location.');
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls.indexOf('ds-brief') === 0) u.el('h2', '', b, C.briefTitle || 'Task');
        if (cls !== 'ds-brief') {
          const ic = u.el('span', 'ds-info-i', b, 'i');
        }
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        ov.classList.add('ds-overview-panel');
        briefing(ovr, 'ds-brief ds-brief-overview');
      }
      const stage = u.el('main', 'ds-stage', main);
      const decor = u.el('div', 'ds-decor', main);
      const fake = (cls, label, val, parent) => {
        const w = u.el('div', 'ds-fake ' + cls, decor);
        u.el('span', 'ds-fl', w, label);
        if (val !== null) {
          const v = u.el('div', 'ds-fv', w, val);
        }
        return w;
      };
      fake('f-name', 'Full name', 'Jordan Lee');
      fake('f-email', 'Email address', 'jordan.lee@example.com');
      fake('f-reason', 'Reason for visit', 'Renewal');
      const dt = fake('f-date', 'Preferred date', 'Apr 21, 2017');
      const cal = u.el('span', 'ds-cal', dt.lastChild);
      cal.innerHTML =
        '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.7"><rect x="3" y="5" width="22" height="21" rx="1.5"/><path d="M3 11h22M9 2v7M19 2v7"/><path stroke-width="3" d="M8 15h3m5 0h3M8 20h3m5 0h3"/></svg>';
      const ad = fake('f-add', 'Additional information (optional)', '');
      ad.lastChild.textContent = 'e.g. accessibility needs, special assistance';
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endChoices =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish
        ? null
        : endRng.pick(['footer', 'footer', 'footer', 'footer', 'footer', 'header', 'header', 'link', 'link', 'link']);
      const submitLabel = endChoices.find((x) => endText(x).trim().toLowerCase() === 'submit');
      const otherLabels = endChoices.filter((x) => endText(x).trim().toLowerCase() !== 'submit');
      const label =
        placement === 'footer'
          ? endText(submitLabel || endChoices[0])
          : endText(endRng.pick(otherLabels.length ? otherLabels : endChoices));
      const endBtn = (parent, cls, text) => {
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
      let collide = null;
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
          const pool = [...new Set(endChoices.map(endText))].filter((x) => !same(x));
          if (pool.length) collide = cr.pick(pool);
        }
      }
      if (placement === 'header') submit = endBtn(top, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = endBtn(foot, 'ds-submit', label);
      if (placement === 'link') submit = endBtn(foot, 'ds-end-link', label + ' ›');
      if (collide) {
        const d = u.el('button', 'ds-end-xtra', top, collide);
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
      const hd = u.el('div', 'ds-ov-head', el);
      const gear = u.el('span', 'ds-gear', hd);
      gear.innerHTML =
        '<svg viewBox="0 0 52 52" fill="currentColor"><path d="M21 1h10l2 7 5 3 7-2 5 9-5 5v6l5 5-5 9-7-2-5 3-2 7H21l-2-7-5-3-7 2-5-9 5-5v-6l-5-5 5-9 7 2 5-3z"/><circle cx="26" cy="26" r="9" fill="#195798"/></svg>';
      u.el('span', 'ds-ov-title', hd, 'A new version is available');
      const x = u.el('button', 'ds-ov-x', hd, '×');
      x.type = 'button';
      x.addEventListener('click', () => ctx.dismiss('close'));
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: "We've made improvements to keep your information safe and your experience smooth.",
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      const bd = u.el('div', 'ds-ov-body', el);
      u.el('p', '', bd, texts.toast);
      const row = u.el('div', 'ds-ov-btns', bd);
      const dismiss = u.el('button', 'ds-later', row, 'Remind me later');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      const upd = u.el('button', 'ds-update', row, 'Update now');
      upd.type = 'button';
      upd.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
