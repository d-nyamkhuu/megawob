(function () {
  'use strict';
  const cfg = {
    'title': 'Preferences',
    'theme': 'beos',
    'layout': 'notebook',
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
    'dismiss': 'Skip tour',
    'tabs': ['General', 'Appearance', 'Network', 'Sound', 'Devices', 'Shortcuts', 'Advanced'],
  };
  env.site({
    name: 'design-click-control-widget-03',
    styles: ['site.css', 'beos.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const beIcon =
        '<svg viewBox="0 0 32 32"><g stroke="#263746" stroke-width=".7" stroke-linejoin="round"><path d="M11 3h10v5l-4 2v5l-5 3-6-1-4 4V12l5-3V5z" fill="#1639c5"/><path d="M13 14l8-5 7 6-5 4 3 7-9 4-5-7-7 3-3-6 7-4z" fill="#1da940"/><path d="M19 17l6-4 6 5-6 5v6l-8 1v-8z" fill="#d72718"/><path d="M6 24l5-5 6 4-3 6-7 2z" fill="#ffdb00"/><path d="M7 5l5-3h9l-4 4H8z" fill="#6d86ed" stroke="none"/></g></svg>';
      const mb = u.el('header', 'menubar', shell);
      const logo = u.el('span', 'bm-logo', mb);
      logo.innerHTML = beIcon;
      u.el('span', 'bm-brand', mb, 'BeOS');
      ['File', 'Edit', 'Window', 'Help'].forEach((s) => u.el('span', 'bm-item', mb, s));
      u.el('span', 'bm-clock', mb, '10:24 AM');
      const tray = u.el('span', 'bm-tray', mb);
      tray.innerHTML =
        '<svg viewBox="0 0 32 32"><path d="M10 2h12l8 9v12l-8 7H10l-8-8V10z" fill="#0021a5" stroke="#ddd" stroke-width="3"/><path d="M13 9h7v3h-4v4h4l-5 8-3-8h2v-4h-1z" fill="white"/></svg><svg viewBox="0 0 32 32"><path d="m3 13 5-9 12-2 8 8 1 15-10 5L6 26z" fill="#eee" stroke="#333" stroke-width="2"/><path d="m5 16 11 6 10-7v9l-10 5-10-5z" fill="#c82916" stroke="#333"/><path d="m8 5 12-2 6 7-11 6-10-5z" fill="#fff" stroke="#777"/><path d="m20 17 9-1-2 10-7 3z" fill="#22a82a" stroke="#333"/><path d="m12 20 7-3 2 7-6 3z" fill="#ffdd00" stroke="#333"/></svg>';
      const win = u.el('section', 'win', shell);
      u.el('div', 'wintitle', win, cfg.title);
      const ctl = u.el('span', 'wincontrols', win);
      ctl.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const body = u.el('div', 'winbody', win);
      const rail = u.el('nav', 'rail', body);
      cfg.tabs.forEach((s, i) => u.el('div', 'rtab' + (i === 0 ? ' active' : ''), rail, s));
      const page = u.el('section', 'page', body);
      const pagehead = u.el('h1', 'pagehead', page, 'General Settings');
      const note = u.el('div', 'instruction', page, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
      }
      const center = u.el('section', 'center', page);
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', page);
      const endR = ctx.rng.fork('chrome/end');
      const place = ctx.finish ? null : endR.pick(['footer', 'footer', 'footer', 'header', 'link']);
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelValue = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submitLabel = labels.find((x) => labelValue(x).trim().toLowerCase() === 'submit');
      const otherLabels = labels.filter((x) => labelValue(x).trim().toLowerCase() !== 'submit');
      const label = ctx.finish
        ? null
        : submitLabel && endR.bool(0.5)
          ? labelValue(submitLabel)
          : labelValue(otherLabels.length ? endR.pick(otherLabels) : endR.pick(labels));
      let submit = null;
      const makeEnd = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (place === 'header') submit = makeEnd(pagehead, 'submit submit-header', label);
      else if (place === 'link') submit = makeEnd(foot, 'end-link', label + ' ›', 'a');
      else if (place === 'footer') submit = makeEnd(foot, 'submit', label);
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(labels.map(labelValue))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) {
          const dlabel = collideR.pick(options);
          const d = u.el('button', 'submit xtra-end', foot, dlabel);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: dlabel, collide: true }));
        }
      }
      const tb = u.el('footer', 'taskbar', shell);
      u.el('span', 'tb-ws', tb, 'Workspace 1');
      const app = u.el('span', 'tb-app', tb);
      u.el('span', 'app-icon', app).innerHTML = beIcon;
      u.el('span', '', app, 'Preferences');
      const tr = u.el('div', 'trash', shell);
      tr.innerHTML =
        '<svg viewBox="0 0 40 52"><defs><linearGradient id="metal"><stop stop-color="#222"/><stop offset=".16" stop-color="#eee"/><stop offset=".37" stop-color="#aaa"/><stop offset=".55" stop-color="#eee"/><stop offset=".8" stop-color="#777"/><stop offset="1" stop-color="#333"/></linearGradient></defs><path d="m4 10 4 37q11 8 24 0l4-37z" fill="url(#metal)" stroke="#111" stroke-width="1.5"/><path d="m11 16 2 30m6-29 1 31m9-32-2 31" fill="none" stroke="#666"/><ellipse cx="20" cy="11" rx="18" ry="5" fill="#bbb" stroke="#111"/><ellipse cx="20" cy="8" rx="17" ry="5" fill="url(#metal)" stroke="#111"/><ellipse cx="20" cy="7" rx="13" ry="2.5" fill="#222"/><path d="M13 3V1h13v2" fill="none" stroke="#ddd"/></svg><span>Trash</span>';
      foot.hidden = !foot.children.length;
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'chat') {
        const old = document.querySelector('.design-obstacle');
        if (old) old.hidden = true;
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
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
