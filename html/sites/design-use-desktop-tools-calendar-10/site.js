(function () {
  'use strict';
  const D = { site: 'design-use-desktop-tools-calendar-10', brand: 'My Calendar', mode: 'top',
    tokens: { bg: '#ffffff', panel: '#eef3fb', fg: '#14234a', accent: '#4a6fd0',
      font: "Verdana,Tahoma,'Segoe UI',sans-serif", line: '#b9c5da', muted: '#3b4a6b', 'button-fg': '#fff' },
    nav: 'Help   |   Settings   |   Sign Out',
    obstruction: ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
    footer: '' };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util, root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      const display = ctx.display || 'header';
      document.body.className = D.mode + ' instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note ' + (display === 'panel' ? 'note-panel' : display === 'toast' ? 'note-toast' : ''), body);
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        if (display === 'panel') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');

      const labelOf = x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels = Array.isArray(bank) && bank.length ? bank.map(labelOf) : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const er = ctx.rng.fork('chrome/end');
      const keepDefault = er.bool(0.5);
      const placement = keepDefault ? 'footer' : er.pick(['header', 'footer-link']);
      const label = keepDefault ? 'Submit' : labelOf(er.pick(labels));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = labelOf(cr.pick(options));
      }
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      if (placement === 'header' || collide) {
        const tools = u.el('div', 'header-tools', header);
        if (collide) decoyBtn(tools, collide);
        if (placement === 'header' && !ctx.finish) {
          const b = u.el('button', 'header-end', tools, label);
          submit = b;
          b.type = 'button'; b.dataset.role = 'submit';
          b.setAttribute('aria-label', label); b.title = label;
          b.addEventListener('click', () => ctx.submit());
        }
      }
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'end-control', footer, label);
          submit.type = 'button'; submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label); submit.title = label;
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'footer-link') {
          submit = u.el('a', 'footer-end-link', footer, label + ' ›');
          submit.href = '#'; submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label); submit.title = label;
          submit.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util, named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement']
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title);
      u.el('h2', '', el, title); u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el); c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c); ch.type = 'checkbox'; c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  });
})();
