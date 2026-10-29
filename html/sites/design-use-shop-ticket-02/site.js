(function () {
  'use strict';
  const D = { site: 'design-use-shop-ticket-02', brand: 'T R A V E L   N E X U S', mode: 'twin',
    tokens: { bg: '#f3f2ee', panel: '#fffefd', fg: '#131620', accent: '#ed640e',
      font: "'Segoe UI','Noto Sans','Helvetica Neue',Arial,sans-serif", line: '#d9dadb', muted: '#5f6a78' },
    nav: 'Tickets for a wider tomorrow', obstruction: null };
  const labelOf = x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  const fallbackEnds = ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply','Complete',"I'm done"];

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
      const hr = u.el('div', 'design-hright', header);
      u.el('span', '', hr, 'Help'); u.el('span', 'hr-en', hr, 'EN ⌄'); u.el('span', '', hr, 'Tue, Apr 22, 2026');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body); note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        const ey = u.el('div', 'tn-eyebrow', note); u.el('i', '', ey); u.el('span', '', ey, 'Choose your ticket');
        u.el('p', 'tn-main' + (ctx.instruction.length > 52 ? ' long-goal' : ''), note, ctx.instruction);
        u.el('p', 'tn-sub', note, 'Select a ticket and click Buy.');
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const fl = u.el('span', 'footer-label', footer);
      u.el('b', '', fl, 'TRAVEL NEXUS'); u.el('em', '', fl, 'Travel simply. Further.');
      const inAside = ctx.display !== 'toast' && ctx.display !== 'hidden';
      if (inAside) {
        const fr = u.el('span', 'footer-right', footer);
        u.el('span', '', fr, 'Need assistance?'); u.el('u', '', fr, 'Contact support');
      }
      const detail = u.el('aside', 'side-detail', body);
      const photo = u.el('div', 'sd-photo', detail);
      photo.setAttribute('role', 'img'); photo.setAttribute('aria-label', 'Mountain landscape. Same places, a brighter way there.');
      const tag = u.el('div', 'sd-tag', photo);
      for (const t of ['SAME PLACES', 'A BRIGHTER', 'WAY THERE']) u.el('span', '', tag, t);
      const inner = u.el('div', 'sd-inner', detail);
      const ey2 = u.el('div', 'tn-eyebrow sm', inner); u.el('i', '', ey2); u.el('span', '', ey2, 'Your selection');

      const endR = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? 'none' : endR.pick(['aside', 'aside', 'aside', 'footer', 'link']);
      const endBank = ctx.content && ctx.content.END_LABELS || fallbackEnds;
      const endLabel = ctx.finish ? '' : labelOf(endR.pick(endBank));
      let collide = null;
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(.3)) {
          const choices = [...new Set(endBank.map(labelOf))].filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (choices.length) collide = labelOf(cr.pick(choices));
        }
      }
      if (ctx.display === 'panel') {
        const panel = u.el('div', 'episode-panel', inner);
        u.el('div', 'panel-kicker', panel, 'Your task'); u.el('div', 'panel-copy', panel, ctx.instruction);
      }
      const empty = u.el('p', 'detail-empty', inner, 'No ticket selected yet.'); empty.dataset.role = 'selection-status';
      const fields = u.el('dl', 'sd-fields', inner); fields.dataset.role = 'selection-details';
      for (const f of ['Operator', 'Route', 'Departure', 'Arrival', 'Duration', 'Price']) {
        u.el('dt', '', fields, f); u.el('dd', '', fields, '—');
      }
      const tip = u.el('div', 'sd-tip', inner); u.el('b', '', tip, 'i');
      const tt = u.el('span', '', tip); tt.innerHTML = 'Select a ticket and click Buy.';
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text); b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'aside' ? inner : footer;
        const cls = placement === 'aside' ? 'end-control' : placement === 'link' ? 'end-control end-textlink' : 'end-control footer-submit';
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, endLabel);
        if (placement === 'link') submit.href = '#'; else submit.type = 'button';
        submit.setAttribute('aria-label', endLabel); submit.title = endLabel;
        submit.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
      }
      if (collide) decoyBtn(footer, collide);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util, named = D.obstruction;
      const texts = { cookie: ['We use cookies','We use optional cookies to improve your experience.','Reject optional'],
        toast: ['Notification','Your workspace is up to date.','Dismiss'], chat: ['Help','Need help with this workspace?','Close'],
        promo: ['News and updates','Discover the latest workspace updates.','Close'],
        banner: ['Announcement','You can still work now. Save your changes regularly.','Collapse announcement'] };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo','toast','banner','cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title); u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') { const accept = u.el('button', '', actions, 'Accept all'); accept.addEventListener('click', () => ctx.dismiss()); }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el); c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c); ch.type = 'checkbox'; c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label); dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  });
})();
