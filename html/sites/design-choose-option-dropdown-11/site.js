(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-dropdown-11',
    'menu': 'File|Edit|Records|Options|Help',
    'tabs': ['Tasks', 'Inventory', 'Returns', 'Customers', 'Reports', 'Settings'],
    'pageTitle': 'Store Operations',
    'clock': 'Mon  Apr 27, 1987  10:14 AM',
  };
  const ENVELOPE =
    '<svg viewBox="0 0 110 110" width="110" height="110" fill="none" stroke="#000" stroke-width="3"><defs><pattern id="env-hatch" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1L1-1M0 5L5 0M4 6L6 4" stroke-width="1.4"/></pattern></defs><path d="M3 43 L55 10 L107 43 V106 H3 Z" fill="url(#env-hatch)"/><rect x="13" y="17" width="85" height="61" fill="#fff"/><path d="M24 28h18M50 28h37M24 38h63M24 49h63M24 59h31M62 59h25M24 69h50"/><path d="M3 43 L55 88 L107 43 V106 H3 Z" fill="url(#env-hatch)"/><path d="M3 43 L55 88 L107 43"/></svg>';
  const DOC =
    '<svg viewBox="0 0 34 40" width="34" height="40" fill="#fff" stroke="#000" stroke-width="2.5"><path d="M4 2h18l8 8v28H4z"/><path d="M22 2v8h8M10 18h16M10 24h16M10 30h12"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      u.el('span', 'ds-sysbox', nav);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-clock', nav, C.clock);
      const body = u.el('div', 'ds-body', document.body);
      const tabs = u.el('aside', 'ds-tabs', body);
      C.tabs.forEach((t, i) => u.el('div', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t));
      u.el('div', 'ds-spiral', body);
      const content = u.el('div', 'ds-content', body);
      const natural = 'top';
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
        if (cls === 'ds-brief') u.el('h2', '', b, 'Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const pagehead = u.el('div', 'ds-pagehead', content);
      u.el('span', 'ds-title', pagehead, C.pageTitle);
      const tools = u.el('div', 'ds-headtools', pagehead);
      // New frame choices have independent streams; task and existing frame draws stay intact.
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const classic = endR.bool(0.5);
      const placement = classic ? 'footer' : endR.pick(['header', 'link']);
      const endLabel = classic ? 'Submit' : endR.pick(labels);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      if (mode === 'top' || mode === 'left' || mode === 'right')
        briefing(foot, 'ds-header-note' + (mode === 'top' ? '' : ' ds-panel-note'));
      u.el('span', '', foot, 'Ready');
      const cancel = u.el('button', 'ds-motif-action', foot, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'header' ? ' ds-toolbar-submit' : placement === 'link' ? ' ds-endlink' : ''),
          placement === 'header' ? tools : foot,
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
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = collideR.pick(pool);
          const decoy = u.el('button', 'ds-motif-action ds-toolbar-xtra', tools, label);
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
      const bar = u.el('div', 'ds-nl-bar', el);
      bar.insertAdjacentHTML('beforeend', DOC);
      u.el('span', 't', bar, 'Shop Notes Newsletter');
      const x = u.el('button', 'ds-nl-x', bar, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.addEventListener('click', () => ctx.dismiss('close'));
      const b = u.el('div', 'ds-nl-body', el);
      const ic = u.el('div', '', b);
      ic.innerHTML = ENVELOPE;
      u.el('p', '', b, 'Get product updates, care tips, and more in your inbox.');
      const form = u.el('div', 'ds-nl-form', b);
      u.el('div', 'em', form, 'Your email address');
      const su = u.el('button', 'ds-nl-btn', form, 'Sign Up');
      su.type = 'button';
      const foot = u.el('div', 'ds-nl-foot', b);
      const no = u.el('a', '', foot, "No thanks, I'll pass.");
      no.addEventListener('click', () => ctx.dismiss('close'));
      const dismiss = u.el('button', 'ds-nl-btn', foot, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
