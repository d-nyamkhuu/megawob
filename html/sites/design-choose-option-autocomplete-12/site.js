(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-autocomplete-12', 'brand': 'Trip Planner' };
  const ICON = {
    task: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="5" y="4.5" width="14" height="16.5" rx="1.5"/><path d="M9 4.5V3h2l1-1 1 1h2v3H9zM7.5 10l1 1 2-2M12 10h4M7.5 15l1 1 2-2M12 15h4M8 18h6"/></svg>',
    gear: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8l1.6 2.2 2.7-.6.9 2.6 2.6.9-.6 2.7 2.2 1.6-2.2 1.6.6 2.7-2.6.9-.9 2.6-2.7-.6L12 21.2l-1.6-2.2-2.7.6-.9-2.6-2.6-.9.6-2.7L2.600 12l2.200-1.600-.6-2.700 2.600-.9.900-2.600 2.700.6z"/></svg>',
    palette:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3a9 9 0 1 0 0 18c1.500 0 2-1 1.500-2s0-2 1.500-2h2a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7.500" r="1"/><circle cx="16" cy="10" r="1"/></svg>',
    bell: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.500 2h-15zM10 21h4"/></svg>',
    cloud:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 19a4.500 4.500 0 0 1-.5-9A6 6 0 0 1 18 11a4 4 0 0 1 0 8z"/></svg>',
    kbd: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.500" y="6" width="19" height="12" rx="2"/><path d="M6 10h1M10 10h1M14 10h1M18 10h1M7 14h10"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="15" rx="2" fill="currentColor" fill-opacity=".95" stroke="none"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M7 8v13M17 8v13" stroke="#2e6fe0"/></svg>',
    chev: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };
  let recoverTask = null;
  // A scene may already have an open list, so its next oracle action can be a key rather than a click.
  window.addEventListener('keydown', (e) => {
    if (recoverTask && !e.ctrlKey && !e.metaKey && ['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) recoverTask(e);
  });
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'gn-top', document.body);
      u.el('span', '', top, 'Activities');
      const app = u.el('span', 'gn-app', top);
      app.innerHTML = ICON.bag + '<span>Trip Planner</span>';
      u.el('span', 'gn-clock', top, 'Apr 28  10:24');
      const tray = u.el('span', 'gn-tray', top);
      tray.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M2 8a16 16 0 0 1 20 0l-3 3a11 11 0 0 0-14 0zm4 5a9 9 0 0 1 12 0l-3 3a5 5 0 0 0-6 0zm4 5a3 3 0 0 1 4 0l-2 3z"/></svg><svg viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3z"/><path d="M16 8q5 4 0 8M19 5q8 7 0 14" fill="none" stroke="currentColor" stroke-width="2"/></svg><svg viewBox="0 0 24 24"><path d="M9 2h6v3H9zM7 5h10v16H7z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 8h6v11H9z"/></svg>';
      const win = u.el('div', 'gn-win', document.body);
      const hb = u.el('div', 'gn-hb', win);
      const logo = u.el('span', 'gn-logo', hb);
      logo.innerHTML = ICON.bag;
      const tt = u.el('div', 'gn-ttl', hb);
      u.el('b', '', tt, 'Trip Planner');
      u.el('span', '', tt, 'Plan and organize your trips');
      const tabs = u.el('div', 'gn-tabs', hb);
      const tTask = u.el('button', 'gn-tab', tabs);
      tTask.type = 'button';
      tTask.innerHTML = ICON.task + '<span>Task</span>';
      const tPref = u.el('button', 'gn-tab on', tabs);
      tPref.type = 'button';
      tPref.innerHTML = ICON.gear + '<span>Preferences</span>';
      const ctl = u.el('div', 'gn-wc', document.body);
      ['M4 6h16M4 12h16M4 18h16', 'M6 16h12', 'M6 6h12v12H6z', 'M6 6l12 12M18 6L6 18'].forEach((d) => {
        const s = u.el('span', '', ctl);
        s.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="' +
          d +
          '"/></svg>';
      });
      const body = u.el('div', 'gn-body', win);
      const prefs = u.el('div', 'gn-prefs', body);
      const side = u.el('aside', 'gn-side', prefs);
      [
        ['gear', 'General'],
        ['palette', 'Appearance'],
        ['bell', 'Notifications'],
        ['cloud', 'Data & Sync'],
        ['kbd', 'Shortcuts'],
        ['info', 'About'],
      ].forEach((r, i) => {
        const d = u.el('div', 'gn-si' + (i ? '' : ' on'), side);
        d.innerHTML = ICON[r[0]] + '<span>' + r[1] + '</span>';
      });
      const pc = u.el('div', 'gn-pc', prefs);
      const card = u.el('div', 'gn-pcard', pc);
      u.el('h2', '', card, 'General Preferences');
      u.el('p', '', card, 'Customize how Trip Planner works for you.');
      const list = u.el('div', 'gn-list', card);
      [
        ['Default view', 'Choose which page opens at launch', 'My Trips'],
        ['Language', 'Set the application language', 'English (US)'],
        ['Units', 'Distance and temperature units', 'Metric (km, °C)'],
      ].forEach((r) => {
        const row = u.el('div', 'gn-row', list);
        const l = u.el('div', '', row);
        u.el('b', '', l, r[0]);
        u.el('span', '', l, r[1]);
        const dd = u.el('div', 'gn-dd', row);
        u.el('span', '', dd, r[2]);
        const c = u.el('i', '', dd);
        c.innerHTML = ICON.chev;
      });
      [
        ['Enable offline mode', 'Access your trips without an internet connection', false],
        ['Show travel tips', 'Display helpful tips during planning', true],
      ].forEach((r) => {
        const row = u.el('div', 'gn-row tg', list);
        const l = u.el('div', '', row);
        u.el('b', '', l, r[0]);
        u.el('span', '', l, r[1]);
        u.el('div', 'gn-sw' + (r[2] ? ' on' : ''), row).appendChild(document.createElement('i'));
      });
      const stage = u.el('main', 'ds-stage', body);
      tTask.dataset.role = 'task-tab';
      function setTab(t) {
        win.classList.toggle('show-task', t);
        tTask.classList.toggle('on', t);
        tPref.classList.toggle('on', !t);
        if (t) {
          const field = stage.querySelector('[data-role="field"]');
          if (field) field.focus({ preventScroll: true });
        }
      }
      recoverTask = (e) => {
        if (
          win.isConnected &&
          !win.classList.contains('show-task') &&
          (e.target === document.body || e.target === tTask)
        )
          setTab(true);
      };
      tTask.addEventListener('click', () => setTab(true));
      tPref.addEventListener('click', () => setTab(false));
      // New episode choices have independent streams: preserve all existing widget draws.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = er.pick(['footer', 'footer', 'toolbar', 'shelf']);
      const referenceLabel = endLabels.find((x) => x === 'Submit') || endLabels[0];
      const alternatives = endLabels.filter((x) => x.trim().toLowerCase() !== referenceLabel.trim().toLowerCase());
      const label = placement === 'footer' ? referenceLabel : er.pick(alternatives.length ? alternatives : endLabels);
      const display = ctx.display || 'header';
      const note = u.el('aside', 'gn-note gn-note-' + display, document.body);
      const nh = u.el('header', 'gn-nh', note);
      const ni = u.el('span', '', nh);
      ni.innerHTML = ICON.task;
      u.el('b', '', nh, 'Task');
      u.el('span', 'gn-min', nh, '–');
      if (display === 'toast') {
        const toast = u.el('aside', 'gn-instruction-toast', document.body);
        toast.setAttribute('role', 'status');
        const heading = u.el('div', 'gn-toast-heading', toast);
        heading.innerHTML = ICON.task + '<b>Trip Planner</b>';
        u.el('div', 'ds-instruction', toast, ctx.instruction);
      } else if (display !== 'hidden')
        u.el(display === 'header' ? 'header' : 'div', 'ds-instruction', note, ctx.instruction);
      u.el('p', 'gn-n1', note, 'This will add a destination to your trip.');
      u.el(
        'p',
        'gn-n2',
        note,
        ctx.finish
          ? 'Switch to the Task tab to complete the form.'
          : 'Switch to the Task tab to complete the form, then click ' + label + '.',
      );
      const foot = u.el('footer', 'gn-nf', note);
      const st = u.el('span', '', foot);
      st.innerHTML = ICON.clock + '<em>Not started</em>';
      let shelf = null;
      const utilityShelf = () => shelf || (shelf = u.el('div', 'gn-utility', document.body));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? nh : placement === 'shelf' ? utilityShelf() : foot;
        submit = u.el(
          placement === 'shelf' ? 'a' : 'button',
          'ds-submit' + (placement === 'shelf' ? ' gn-endlink' : ''),
          parent,
          label,
        );
        if (placement === 'shelf') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (placement === 'toolbar') note.classList.add('gn-toolbar-end');
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool);
          const decoy = u.el('button', 'gn-xtra', utilityShelf(), text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
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
