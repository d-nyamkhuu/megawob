(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-listbox-11',
    'brand': 'PeoplePro',
    'heading': 'Edit Employee',
    'sub': "Update the employee's details below.",
  };
  const PEOPLE =
    'M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 6a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM19 6a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM7 20v-4a5 5 0 0 1 10 0v4zM2 18v-3a3 3 0 0 1 4-3v6zM18 18v-6a3 3 0 0 1 4 3v3z';
  const NOTES = [
    ['New message', '10:14 AM', 'Quarterly update available.', '#ff6b78', 'M3 5h18v14H3zM3 5l9 8 9-8'],
    [
      'System alert',
      '9:43 AM',
      'Scheduled maintenance this Friday.',
      '#d9ccf5',
      'M11 3h2v2a6 6 0 0 1 4 6v4l2 3H5l2-3v-4a6 6 0 0 1 4-6zM10 20h4',
    ],
    ['Policy reminder', '9:12 AM', 'Complete your annual acknowledgment.', '#b79cf0', 'M6 2h8l5 5v15H6z'],
    ['Team invite', '8:51 AM', "You've been added to a new channel.", '#f5a64a', PEOPLE],
  ];
  const ns = 'http://www.w3.org/2000/svg';
  function icon(parent, d, size, color, sw) {
    const s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size);
    s.setAttribute('height', size);
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', color || 'currentColor');
    s.setAttribute('stroke-width', sw || 2);
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
    parent.appendChild(s);
    return s;
  }
  function notifications(u, side, recover) {
    const nh = u.el('div', 'pp-nh', side);
    const nt = u.el('span', '', nh, 'Notifications ');
    const cnt = u.el('span', 'pp-cnt', nt, '(4)');
    const dis = u.el('button', 'pp-dis', nh, 'Dismiss all');
    dis.type = 'button';
    const stack = u.el('div', 'pp-stack', side);
    const cards = [];
    NOTES.forEach((n, i) => {
      const c = u.el('div', 'pp-nc', stack);
      cards.push(c);
      const ic = u.el('span', 'pp-ni', c);
      ic.style.background = 'linear-gradient(140deg,' + n[3] + ', ' + n[3] + 'dd)';
      const svg = icon(ic, n[4], 24, i === 0 ? '#fff' : i === 3 ? '#8e4e29' : '#77618d', i === 0 ? 1.5 : 0.6);
      if (i > 0) svg.setAttribute('fill', i === 3 ? '#8e4e29' : '#77618d');
      if (i === 2) icon(ic, 'M14 2v6h5M9 13h6M9 17h4', 24, '#d2b5f7', 1);
      const b = u.el('div', 'pp-nb', c);
      const r = u.el('div', 'pp-nr', b);
      u.el('b', '', r, n[0]);
      u.el('span', 'pp-nt', r, n[1]);
      u.el('div', 'pp-nm', b, n[2]);
      const x = u.el('button', 'pp-nx', c);
      x.type = 'button';
      x.setAttribute('aria-label', 'Dismiss ' + n[0]);
      icon(x, 'M6 6l12 12M18 6L6 18', 18);
      x.addEventListener('click', () => {
        c.style.display = 'none';
        cnt.textContent = '(' + cards.filter((k) => k.style.display !== 'none').length + ')';
        if (recover && cards.every((k) => k.style.display === 'none')) recover();
      });
    });
    dis.addEventListener('click', () => {
      cards.forEach((c) => (c.style.display = 'none'));
      cnt.textContent = '(0)';
      if (recover) recover();
    });
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const placement = er.pick(['side', 'side', 'toolbar', 'form-footer']);
      const endLabel = placement === 'side' ? 'Submit' : er.pick(endWords);
      const cr = ctx.rng.fork('chrome/collide');
      const app = u.el('div', 'pp-app', document.body);
      const left = u.el('div', 'pp-left', app);
      const tb = u.el('header', 'pp-title', left);
      const logo = u.el('span', 'pp-logo', tb);
      const people = icon(logo, PEOPLE, 25, '#cbb7f1', 0.5);
      people.setAttribute('fill', '#cbb7f1');
      u.el('span', 'pp-brand', tb, C.brand);
      const tools = u.el('div', 'pp-tools', tb);
      if (cr.bool(0.3)) {
        const words = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (words.length) {
          const label = cr.pick(words);
          const decoy = u.el('button', 'pp-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const wc = u.el('span', 'pp-wc', tb);
      icon(wc, 'M5 12h14', 18);
      icon(wc, 'M6 6h12v12H6z', 18);
      icon(wc, 'M6 6l12 12M18 6L6 18', 18);
      const form = u.el('div', 'pp-form', left);
      u.el('h1', 'pp-h1', form, C.heading);
      u.el('p', 'pp-sub', form, C.sub);
      const grid = u.el('div', 'pp-grid', form);
      function field(label, val, cls, kind) {
        const f = u.el('div', 'pp-f ' + cls, grid);
        u.el('div', 'pp-lab', f, label);
        const b = u.el('div', 'pp-in', f);
        u.el('span', '', b, val);
        if (kind === 'chev') icon(b, 'M6 9l6 6 6-6', 16);
        if (kind === 'cal') {
          icon(b, 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', 18);
        }
        return f;
      }
      field('First name', 'Jordan', 'a1');
      field('Last name', 'Patel', 'b1');
      field('Email', 'jordan.patel@northbridgeco.com', 'a2');
      field('Department', 'Product', 'b2', 'chev');
      field('Job title', 'Senior Product Manager', 'a3');
      const stage = u.el('main', 'ds-stage', grid);
      field('Employment type', 'Full-time', 'a4', 'chev');
      field('Start date', 'Apr 14, 2022', 'a5', 'cal');
      const nf = u.el('div', 'pp-f pp-notes', grid);
      u.el('div', 'pp-lab', nf, 'Notes');
      const ta = u.el('div', 'pp-in pp-ta', nf, 'Leading the core product team.');
      const gr = u.el('span', 'pp-grip', ta);
      icon(gr, 'M20 10L10 20M20 16l-4 4', 14, '#a898c8', 1.6);
      const side = u.el('aside', 'pp-side', app);
      const cl = u.el('div', 'pp-sclose', side);
      icon(cl, 'M6 6l12 12M18 6L6 18', 18);
      notifications(u, side);
      const th = u.el('div', 'pp-th', side);
      u.el('span', '', th, 'Task');
      const ps = u.el('span', 'pp-ps', th);
      u.el('i', '', ps);
      u.el('span', '', ps, 'Paused');
      const inf = u.el('span', 'pp-info', th);
      icon(inf, 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5v.1', 22, '#e6dff3', 1.8);
      if (ctx.display !== 'hidden') {
        const box = u.el('div', 'pp-task pp-task-' + ctx.display, side);
        if (ctx.display === 'panel') u.el('div', 'pp-task-caption', box, 'Task details');
        if (ctx.display === 'toast') u.el('div', 'pp-task-caption', box, 'Task notification');
        u.el('div', 'ds-instruction', box, ctx.instruction);
      } else th.classList.add('pp-task-hidden');
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tools : placement === 'form-footer' ? left : side;
        submit = u.el('button', 'ds-submit pp-end-' + placement, parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.kind === 'toast') {
        const el = u.el('section', 'pp-obstruction', document.body);
        el.dataset.role = 'overlay';
        notifications(u, el, () => ctx.dismiss('close'));
        return { el, dismiss: el.querySelector('.pp-dis'), ttlSteps: 0 };
      }
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: 0 };
    },
  });
})();
