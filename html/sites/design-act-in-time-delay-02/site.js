(function () {
  'use strict';
  const C = { site: 'design-act-in-time-delay-02', brand: 'Willow Creek Organizer' };
  env.site({
    name: C.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      document.body.classList.add('wc-organizer');
      const pageSize = document.body.getBoundingClientRect();
      document.body.style.setProperty('--wc-u', Math.min(pageSize.width / 1672, pageSize.height / 941) + 'px');
      const top = u.el('header', 'ds-top', document.body);
      const leaf = u.el('span', 'ds-leaf', top);
      leaf.innerHTML = '<svg viewBox="0 0 52 40" aria-hidden="true"><path d="M4 32C10 14 17 10 26 10S43 9 49 3C46 22 35 36 21 33C14 39 8 35 4 32Z" fill="#bda17a"/><path d="M3 38L41 11M13 28L12 17M21 22L22 12M28 18L35 19M20 25L31 28" fill="none" stroke="#64482e" stroke-width="1.4"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-date', top, 'Tue, Apr 20, 2010　 10:14 AM');
      const content = u.el('div', 'ds-content', document.body);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const panel = u.el('aside', 'ds-panel', main);
      const mode = ctx.display;
      document.body.dataset.instruction = mode;
      function instruction(cls) {
        const section = u.el('section', 'wc-task-note ' + cls, panel);
        u.el('h2', 'ds-section-title', section, 'Task Instructions');
        const box = u.el('div', cls === 'wc-panel-note' ? 'ds-note-card' : 'wc-note-body', section);
        u.el('div', 'ds-instruction', box, ctx.instruction);
        if (cls === 'wc-panel-note') u.el('p', 'wc-note-explainer', box, 'The button will become enabled when the task clock reaches the required time. It is currently disabled. Please wait.');
        return section;
      }
      if (mode === 'panel') instruction('wc-panel-note');
      else if (mode === 'header') instruction('ds-header-instruction');
      else if (mode === 'toast') instruction('ds-toast');
      const status = u.el('section', 'ds-status-card', panel);
      const statusTitle = u.el('h2', 'ds-section-title', status, 'Status');
      u.el('span', 'wc-task-clock', statusTitle, '0:00');
      const inner = u.el('div', 'ds-status-inner', status);
      u.el('span', 'ds-clock-icon', inner);
      const copy = u.el('div', 'wc-status-copy', inner);
      u.el('strong', 'wc-status-label', copy, 'Waiting for task timer…');
      const controls = u.el('section', 'ds-controls', panel);
      u.el('h2', 'ds-section-title', controls, 'Controls');
      const row = u.el('div', 'ds-control-row', controls);
      const target = u.el('div', 'wc-target-slot', row);
      u.el('div', 'wc-target-hint', target, 'Currently disabled.\nPlease wait.');
      u.el('div', 'ds-wait-hint', panel, 'Note: Do not refresh the page. The button will become enabled on the task clock.');
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'wc-foot-links', foot, 'My Tasks　 |　 Calendar');
      u.el('span', 'ds-foot-brand', foot, 'Willow Creek Organizer');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end-label');
        const labels = ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const label = er.bool(.5) ? (typeof labels[0] === 'string' ? labels[0] : (labels[0].label || labels[0].text || 'Submit')) : (() => { const x = er.pick(labels); return typeof x === 'string' ? x : (x.label || x.text || 'Submit'); })();
        const placeR = ctx.rng.fork('chrome/end');
        const placement = placeR.pick(['panel', 'panel', 'header', 'footer']);
        const collideR = ctx.rng.fork('chrome/collide');
        if (collideR.bool(.3)) {
          const options = labels.map(x => typeof x === 'string' ? x : (x.label || x.text || '')).filter(x => x && x.toLowerCase() !== label.toLowerCase());
          if (options.length) {
            const d = u.el('button', 'ds-xtra', placement === 'header' ? top : row, collideR.pick(options));
            d.type = 'button'; d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
        const endParent = placement === 'header' ? top : placement === 'footer' ? foot : row;
        submit = u.el('button', 'ds-submit ds-end-' + placement, endParent, label);
        submit.type = 'button'; submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label); submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
