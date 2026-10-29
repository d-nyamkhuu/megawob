(function () {
  'use strict';
  const cfg = {
    'title': 'People',
    'theme': 'mica',
    'layout': 'contacts',
    'tools': 'File    Edit    View    People    Tools    Help',
    'overview': 'All People|59 contacts',
    'rail':
      'All People|☆  Favorites|◷  Recent|◇  Tags|Groups|♧  Clients|♧  Colleagues|♧  Partners|♧  Vendors|♧  Recruiting',
    'side':
      'Giorgos Arslan|Solutions Architect|Trellis|Email     giorgos.arslan@trellis.com|Phone     +1 617 555 0133|Location     Boston, MA|Job Title     Solutions Architect|Company     Trellis|Department     Engineering|Website     https://trellis.com|Tags     Partners   Engineering|Notes     Met at Cloud Summit 2023.',
    'foot': '',
  };
  env.site({
    name: 'design-click-control-rows-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      if (cfg.tools) {
        const tools = u.el('div', 'tools', head);
        cfg.tools
          .trim()
          .split(/\s+/)
          .forEach((label) => {
            const item = u.el('span', 'menu-label', tools);
            u.el('u', '', item, label[0]);
            u.el('span', '', item, label.slice(1));
          });
        const toolbar = u.el('div', 'app-toolbar', head);
        ['New Contact', 'Edit', 'Delete', 'Email', 'Meet', 'Tag'].forEach((label, i) => {
          const b = u.el('span', 'toolbar-item', toolbar);
          b.innerHTML =
            '<i>' +
            [
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M18 8v6M15 11h6"/></svg>',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m14 5 5 5M4 20l4-.8L19 8a2 2 0 0 0-3-3L5 16z"/></svg>',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h14M10 4h4M8 7v13h8V7M10 10v7M14 10v7"/></svg>',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16M8 14h3M8 17h6"/></svg>',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12 12 20H5V13l8-8zM15 6l3 3"/><circle cx="9" cy="15" r="1"/></svg>',
            ][i] +
            '</i>' +
            label;
        });
        u.el('span', 'toolbar-search', toolbar, '⌕  Search people');
      }
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
        const filters = u.el('div', 'contact-filters', ov);
        ['All', 'Clients', 'Colleagues', 'Partners', 'Vendors', 'Recruiting'].forEach((label, i) =>
          u.el('span', i === 0 ? 'selected' : '', filters, label),
        );
        u.el('span', 'list-search', ov, '⌕  Search this list…');
      }
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      const note = u.el(
        'div',
        'instruction',
        cfg.layout === 'response'
          ? work
          : ctx.display === 'header' && shell.querySelector('.overview')
            ? shell.querySelector('.overview')
            : center,
        ctx.instruction,
      );
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => {
          const p = u.el(i === 0 ? 'h2' : 'p', i > 2 ? 'detail-line' : '', aside, s);
          if (i > 2) {
            const pair = s.split('     ');
            if (pair.length > 1) {
              p.textContent = '';
              u.el('span', 'detail-label', p, pair[0]);
              u.el('span', 'detail-value', p, pair.slice(1).join(' ').trim());
            }
          }
          if (i === 2) {
            const actions = u.el('div', 'profile-actions', aside);
            [
              ['✉', 'Email'],
              ['▦', 'Meet'],
              ['♧', 'Call'],
              ['◇', 'Tag'],
            ].forEach(([icon, label]) => {
              const a = u.el('div', 'profile-action', actions);
              u.el('i', '', a, icon);
              u.el('span', '', a, label);
            });
          }
        });
      }
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'ready', foot, '');
      const statusbar = u.el('div', 'bottom-status', shell);
      u.el('span', '', statusbar, 'Connected');
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const label = endRng.bool(0.5) ? 'Submit' : endText(endRng.pick(endBank.filter((x) => endText(x) !== 'Submit')));
      const placement = endRng.pick(['actions', 'actions', 'header', 'status']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const choices = [
          ...new Set(endBank.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collide = collideRng.pick(choices);
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'xtra-task', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      if (!ctx.finish) {
        const makeEnd = (parent, compact) => {
          const b = u.el('button', compact ? 'submit chrome-submit' : 'submit', parent, label);
          b.type = 'button';
          b.addEventListener('click', ctx.submit);
          return b;
        };
        if (placement === 'header') submit = makeEnd(shell.querySelector('.app-toolbar'), true);
        else if (placement === 'status') submit = makeEnd(statusbar, true);
        else submit = makeEnd(shell.querySelector('.app-toolbar'), true);
        if (collide) decoyBtn(collideRng.pick([shell.querySelector('.app-toolbar'), foot]), collide, true);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
