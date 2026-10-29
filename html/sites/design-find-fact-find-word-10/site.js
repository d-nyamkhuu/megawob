(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-10',
    'brand': 'TaskMate',
    'instruction': 'top',
    'briefTitle': 'Your Task',
  };
  const LEAF =
    '<svg width="40" height="38" viewBox="0 0 40 38"><path d="M16 24C4 21 1 12 5 8c5-3 11 1 15 7" fill="#c5e4ec" stroke="#5796bb" stroke-width="2.5"/><path d="M11 34c1-9 1-18 8-24 5-5 12-3 19-7-2 9-4 18-12 22-5 2-9 0-11-2" fill="#8dc54b" stroke="#528eb1" stroke-width="2.5" stroke-linejoin="round"/><path d="M11 34c3-11 10-18 19-23" fill="none" stroke="#4b9193" stroke-width="2.5" stroke-linecap="round"/></svg>';
  const DOC =
    '<svg width="58" height="70" viewBox="0 0 58 70"><path d="M6 3h32l14 14v50H6z" fill="#eef5fc" stroke="#6f93b8" stroke-width="2.5" stroke-linejoin="round"/><path d="M38 3v14h14" fill="none" stroke="#6f93b8" stroke-width="2.5"/><path d="M14 28h30M14 38h30M14 48h30M14 58h20" stroke="#8fb0d2" stroke-width="3" stroke-linecap="round"/></svg>';
  const DOTS =
    '<svg width="76" height="76" viewBox="0 0 76 76"><circle cx="38" cy="38" r="33" fill="none" stroke="#5f7f9f" stroke-width="4"/><circle cx="23" cy="38" r="4.5" fill="#5f7f9f"/><circle cx="38" cy="38" r="4.5" fill="#5f7f9f"/><circle cx="53" cy="38" r="4.5" fill="#5f7f9f"/></svg>';
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
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = LEAF;
      const br = u.el('span', 'ds-brand', top);
      u.el('b', '', br, 'Task');
      u.el('i', '', br, 'Mate');
      const nav = u.el('nav', 'ds-menu', top);
      ['Focus', '·', 'Find', '·', 'Finish'].forEach((t) => u.el('span', t === '·' ? 'dot' : '', nav, t));
      const right = u.el('span', 'ds-links', top);
      ['Help', '|', 'Settings', '|', 'Sign Out'].forEach((t) => u.el('span', t === '|' ? 'sep' : '', right, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'header';
      if (mode === 'toast' && window.innerHeight < 700) mode = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-header-note') {
          const ic = u.el('span', 'ds-docicon', b);
          ic.innerHTML = DOC;
          u.el('h2', '', b, C.briefTitle);
        } else if (cls === 'ds-panel-note') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'panel') {
        const note = briefing(content, 'ds-panel-note');
        content.insertBefore(note, main);
      }
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const labels = endLabels.map((x) =>
        typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x),
      );
      const referenceEnd = endR.bool(0.5);
      const label = referenceEnd
        ? labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0]
        : endR.pick(labels.filter((x) => x.trim().toLowerCase() !== 'submit'));
      const placement = ctx.finish ? null : referenceEnd ? 'footer' : endR.pick(['footer', 'header', 'link']);
      content.dataset.endPlacement = placement || 'none';
      const colliding = collideR.bool(0.3)
        ? collideR.pick(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))
        : null;
      const endControl = (parent, where) => {
        let el;
        if (where === 'link') {
          el = u.el('a', 'ds-endlink', parent, label + ' ›');
          el.href = '#';
        } else {
          el = u.el('button', 'ds-submit' + (where === 'header' ? ' ds-submit-head' : ''), parent, label);
          el.type = 'button';
        }
        el.dataset.role = 'submit';
        el.setAttribute('aria-label', label);
        el.title = label;
        el.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return el;
      };
      const decoy = (parent, text) => {
        const el = u.el('button', 'ds-xtra', parent, text);
        el.type = 'button';
        el.dataset.role = 'xtra';
        el.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return el;
      };
      if (colliding) decoy(right, colliding);
      let submit = null;
      if (placement === 'header') {
        const actions = u.el('span', 'ds-actions', right);
        submit = endControl(actions, 'header');
      }
      const foot = u.el('footer', 'ds-footer', content);
      if (placement === 'footer') {
        submit = endControl(foot, 'footer');
      } else if (placement === 'link') {
        submit = endControl(foot, 'link');
      }
      const fb = u.el('aside', 'ds-feedback', body);
      u.el('h3', '', fb, 'Feedback');
      const fbb = u.el('div', 'ds-fbbody', fb);
      const ic = u.el('span', '', fbb);
      ic.innerHTML = DOTS;
      u.el('p', '', fbb, ctx.spec.answerBy === 'reply' ? 'Waiting for your reply...' : 'Waiting for your answer...');
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
