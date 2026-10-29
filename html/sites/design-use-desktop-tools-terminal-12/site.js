(function () {
  'use strict';
  const D = { site: 'design-use-desktop-tools-terminal-12', brand: 'File Manager Lab', mode: 'side-left',
    tokens: { bg: '#effaff', panel: '#ffffff', fg: '#174b79', accent: '#349ccf', font: 'Arial,sans-serif', line: '#bebebe', muted: '#5e6779' },
    nav: 'Practice common command line tasks', obstruction: null, footer: 'Ready' };
  const END_LABELS = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  env.site({
    name: D.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util, root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note episode-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');

      const er = ctx.rng.fork('chrome/end');
      const modes = ['footer', 'footer', 'footer', 'preferences', 'controls'];
      const placement = ctx.finish ? null : er.pick(modes);
      const pool = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS : END_LABELS;
      const labelOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const endLabel = !ctx.finish && placement !== 'footer' ? labelOf(er.pick(pool)) : 'Submit';
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control episode-end end-' + placement, placement === 'footer' ? footer : shell, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', () => ctx.submit());
      }

      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(pool.map(labelOf))].filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const text = labelOf(cr.pick(options));
          const decoy = u.el('button', 'episode-pq', shell, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util, named = D.obstruction;
      const texts = { cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'], chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'] };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title);
      u.el('h2', '', el, title); u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') { const accept = u.el('button', '', actions, 'Accept all'); accept.addEventListener('click', () => ctx.dismiss()); }
      if (/Tip/.test(title)) { const c = u.el('label', '', el); c.style.cssText = 'display:block;padding:0 22px 14px'; const ch = u.el('input', '', c); ch.type = 'checkbox'; c.append(' Do not show again'); }
      const dismiss = u.el('button', 'primary', actions, label); dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  });
})();
