
(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-stock-12', brand: 'Evermont Investments',
    instruction: 'top', menu: 'Portfolio|Trade|Research|Watchlist|Accounts',
    briefTitle: 'Task Instructions'
  };
  env.site({
    name: C.site, styles: ['site.css'], scripts: [], initialOverlay: { kind: 'promo' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      document.body.classList.add('ds-layout-restored');
      document.body.dataset.instr = ctx.display || 'header';
      document.body.classList.toggle('ds-finish', !!ctx.finish);
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window-controls', top, 'Jordan Lee  ⌄');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-stock-date', nav, 'JL');

      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' :
        ctx.display === 'panel' ? 'left' : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const note = briefing(main, 'ds-brief');
        if (mode === 'right') note.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Market open · Prices delayed 15 min');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'ds-submit', foot, 'Submit');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      if (submit) foot.insertBefore(clear, submit);

      if (submit) {
        const r = ctx.rng.fork('chrome/end');
        const placement = r.pick(['footer', 'footer', 'header', 'link']);
        const pool = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => typeof x === 'string' ? x : x.label || x.text || x.name;
        const sampledLabel = r.bool(.5) ? 'Submit' : labelOf(r.pick(pool));
        const alternatives = pool.map(labelOf).filter((x) => x !== 'Submit');
        const label = placement === 'footer' ? 'Submit' :
          sampledLabel !== 'Submit' ? sampledLabel : r.pick(alternatives);
        document.body.dataset.endPlacement = placement;
        submit.textContent = placement === 'icon' ? '✓' : label;
        submit.setAttribute('aria-label', label);
        submit.title = label;
        if (placement === 'header' || placement === 'link' || placement === 'icon') {
          nav.insertBefore(submit, nav.firstChild);
          if (placement === 'link') submit.classList.add('ds-end-link');
          if (placement === 'icon') submit.classList.add('ds-end-icon');
        }
        if (placement === 'footer') {
          const taskPanel = document.querySelector('.ds-brief');
          if (taskPanel) taskPanel.appendChild(submit);
        }
        document.body.dataset.endLabel = label;
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(.3)) {
          const options = pool.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          const decoy = u.el('button', 'ds-xtra', nav, cr.pick(options));
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
        }
      }

      // Keep the instructional window's reference notes, with this episode's end action.
      const taskPanel = content.querySelector('.ds-brief');
      if (taskPanel) {
        taskPanel.classList.toggle('ds-has-end', !!submit && taskPanel.contains(submit));
        const steps = u.el('div', 'ds-episode-notes', taskPanel);
        const end = submit ? submit.getAttribute('aria-label') : null;
        const lines = [
          '① Click Use default layout to restore the workspace if needed.',
          '② Wait until the stock price is below the threshold.',
          '③ Select Buy to place the order.',
          end ? '④ Click ' + end + ' when you have completed the task.' : '④ Finish the episode when you have completed the task.',
          '', 'Notes:',
          '• If the price is above the threshold, wait.',
          '• Use the on-screen controls. No typing is required.'
        ];
        steps.textContent = lines.join('\n');
      }

      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, '▤ Quick Notes');
      u.el('ul', 'ds-quick-values', quick);
      const ins = content.querySelector('.ds-header-note .ds-instruction');
      if (ins) {
        let fs = innerHeight > 820 ? 50 : 31;
        while (fs > 20) {
          ins.style.fontSize = fs + 'px';
          if (ins.getBoundingClientRect().height <= (innerHeight > 820 ? 62 : 40)) break;
          fs -= 1;
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'promo' && ctx.initial) {
        document.body.classList.remove('ds-layout-restored');
        el.classList.add('ds-layout-warning');
        const restore = () => {
          document.body.classList.add('ds-layout-restored');
          ctx.dismiss('close');
        };
        u.el('div', 'ds-warning-icon', el, '!');
        u.el('button', 'ds-warning-close', el, '×').addEventListener('click', restore);
        u.el('h2', '', el, 'Layout could not be restored');
        u.el('p', '', el, 'Your previous workspace layout could not be restored due to a configuration change.');
        u.el('p', 'ds-warning-muted', el, 'Your data is safe. You can use the default layout to continue.');
        const row = u.el('div', 'ds-warning-actions', el);
        const use = u.el('button', 'ds-warning-default', row, 'Use default layout');
        use.addEventListener('click', restore);
        const keep = u.el('button', 'ds-warning-keep', row, 'Keep current layout');
        keep.addEventListener('click', restore);
        return { el, dismiss: use, ttlSteps: 0 };
      }
      const texts = {
        cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.',
        chat: 'Hello. How can we help?', promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.'
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
