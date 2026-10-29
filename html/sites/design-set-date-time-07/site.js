(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-time-07',
    'brand': 'Riverside Conference Center',
    'title': 'Reservation Details',
    'instruction': 'top',
  };
  const ROWS = [
    ['101', 'Apr 22, 2025', '9:00 AM', 'Horizon Media', 'Maple Room', 'Strategy Meeting', 'Confirmed'],
    ['102', 'Apr 22, 2025', '11:30 AM', 'Greenfield Labs', 'Cedar Room', 'Product Review', 'Confirmed'],
    ['103', 'Apr 23, 2025', '2:00 PM', 'Northbridge LLC', 'Oak Room', 'Team Workshop', 'Pending'],
    ['104', 'Apr 23, 2025', '4:00 PM', 'Summit Health', 'Pine Room', 'Client Presentation', 'Confirmed'],
    ['105', 'Apr 24, 2025', '10:00 AM', 'BrightPath Co.', 'Maple Room', 'Planning Session', 'Confirmed'],
  ];
  const HEAD = ['#', 'Date', 'Time', 'Client', 'Room', 'Event', 'Status'];
  const TABS = ['Reservations', 'Facilities', 'Clients', 'Reports'];
  const LOGO =
    '<svg width="38" height="38" viewBox="0 0 38 38"><rect x="3" y="6" width="32" height="30" rx="2" fill="none" stroke="#f2fcf8" stroke-width="3"/><path d="M3 14h32M10 2v7M27 2v7" stroke="#f2fcf8" stroke-width="4" stroke-linecap="round"/><g fill="none" stroke="#f2fcf8" stroke-width="2"><path d="M8 19h7v6H8zM22 19h7v6h-7zM15 25h7v7h-7zM8 29h4M26 29h4"/></g></svg>';
  const CARET = '<svg width="10" height="6" viewBox="0 0 10 6"><path d="M0 0h10L5 6z" fill="#333"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const endPlacement = er.pick(['footer', 'section', 'footer', 'link']);
      const referenceEnd = endPlacement === 'footer';
      const endLabel = referenceEnd ? 'Submit' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      const otherLabels = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && otherLabels.length ? cr.pick(otherLabels) : null;
      const decoyBtn = (parent, label, collides = false) => {
        const b = u.el('button', 'ds-btn', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
        return b;
      };
      const root = u.el('div', 'ds-app', document.body);
      const top = u.el('header', 'ds-top', root);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = LOGO;
      u.el('span', 'ds-brand', top, C.brand);
      const tabs = u.el('nav', 'ds-tabs', top);
      TABS.forEach((t, i) => {
        const a = u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), tabs);
        u.el('i', '', a, String(i + 1));
        u.el('span', '', a, t);
      });
      u.el('span', 'ds-welcome', top, 'Welcome, Taylor Kim');
      u.el('span', 'ds-signout', top, 'Sign Out');
      const over = u.el('section', 'ds-over', root);
      const oh = u.el('div', 'ds-over-h', over);
      u.el('h1', '', oh, 'Upcoming Reservations');
      u.el('span', '', oh, 'Tue, Apr 22, 2025');
      const tb = u.el('table', 'ds-table', over);
      const hr = u.el('tr', '', u.el('thead', '', tb));
      HEAD.forEach((h) => u.el('th', '', hr, h));
      const tbody = u.el('tbody', '', tb);
      ROWS.forEach((r) => {
        const tr = u.el('tr', '', tbody);
        r.forEach((c) => u.el('td', '', tr, c));
      });
      u.el('div', 'ds-split', root);
      const bar = u.el('div', 'ds-editbar', root);
      u.el('h2', '', bar, 'Edit Reservation');
      u.el('span', '', bar, 'Reservation #101');
      const barTools = u.el('div', 'ds-bar-tools', bar);
      const work = u.el('div', 'ds-work', root);
      let n = null;
      if (ctx.display !== 'hidden') {
        n = u.el(
          'aside',
          'ds-note' + (ctx.display === 'toast' ? ' ds-toast' : ctx.display === 'panel' ? ' ds-panel-note' : ''),
          work,
        );
        if (ctx.display === 'panel' || ctx.display === 'toast')
          u.el('strong', 'ds-note-caption', n, ctx.display === 'panel' ? 'Reservation task' : 'Task notice');
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const grid = u.el('div', 'ds-grid', work);
      const det = u.el('section', 'ds-panel ds-details', grid);
      u.el('h3', '', det, 'Reservation Details');
      const body = u.el('div', 'ds-pbody', det);
      const left = u.el('div', 'ds-colL', body),
        right = u.el('div', 'ds-colR', body);
      const fld = (p, l, v, kind) => {
        const r = u.el('div', 'ds-f', p);
        u.el('label', '', r, l);
        const b = u.el('div', 'ds-fi', r);
        u.el('span', '', b, v);
        if (kind === 'sel') {
          const c = u.el('i', '', b);
          c.innerHTML = CARET;
        }
        if (kind === 'cal') {
          const ic = u.el('b', '', b);
          ic.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 16 16"><rect x="1.5" y="3" width="13" height="11.5" fill="none" stroke="#1d4d3a" stroke-width="1.5"/><path d="M1.5 6.5h13M5 1.5v3M11 1.5v3" stroke="#1d4d3a" stroke-width="1.5"/><path d="M4 9h2M7 9h2M10 9h2M4 11.5h2M7 11.5h2" stroke="#1d4d3a" stroke-width="1.2"/></svg>';
        }
        return r;
      };
      fld(left, 'Client', 'Horizon Media');
      fld(left, 'Event', 'Strategy Meeting');
      fld(left, 'Date', 'Apr 22, 2025', 'cal');
      const stage = u.el('main', 'ds-stage', left);
      fld(right, 'Room', 'Maple Room', 'sel');
      fld(right, 'Attendees', '12');
      fld(right, 'Setup type', 'Conference', 'sel');
      const nr = u.el('div', 'ds-f ds-notes', right);
      u.el('label', '', nr, 'Notes');
      u.el('div', 'ds-fi', nr, 'Projector and whiteboard requested.');
      const opt = u.el('section', 'ds-panel ds-opts', grid);
      u.el('h3', '', opt, 'Additional Options');
      const ob = u.el('div', 'ds-pbody ds-obody', opt);
      [
        ['Catering', 1],
        ['A/V Support', 0],
        ['Room Setup Assistance', 0],
      ].forEach(([l, c]) => {
        const r = u.el('div', 'ds-chk', ob);
        u.el('span', 'ds-box' + (c ? ' on' : ''), r, c ? '✓' : '');
        u.el('span', '', r, l);
      });
      u.el('hr', '', ob);
      const st = u.el('div', 'ds-status', ob);
      u.el('label', '', st, 'Status');
      const sb = u.el('div', 'ds-fi', st);
      u.el('span', '', sb, 'Confirmed');
      const sc = u.el('i', '', sb);
      sc.innerHTML = CARET;
      const foot = u.el('footer', 'ds-footer', work);
      decoyBtn(foot, 'Cancel');
      decoyBtn(foot, 'Save Changes');
      if (collide) decoyBtn(foot, collide, true);
      let submit = null;
      if (!ctx.finish) {
        const link = endPlacement === 'link';
        submit = u.el(
          link ? 'a' : 'button',
          'ds-submit' + (link ? ' ds-endlink' : ''),
          endPlacement === 'section' ? barTools : foot,
          endLabel,
        );
        if (link) submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      u.el('div', 'ds-reservation-values', root);
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
