(function () {
  'use strict';
  const gear =
    '<svg viewBox="0 0 24 24"><path d="M10 1h4l.6 3.2 2 .9 2.7-1.9 2.8 2.8-1.9 2.7.9 2 3.2.6v4l-3.2.6-.9 2 1.9 2.7-2.8 2.8-2.7-1.9-2 .9L14 23h-4l-.6-3.2-2-.9-2.7 1.9-2.8-2.8 1.9-2.7-.9-2L1 14v-4l3.2-.6.9-2-1.9-2.7 2.8-2.8 2.7 1.9 2-.9ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/></svg>';
  const doc =
    '<svg viewBox="0 0 24 24"><path d="M4 2h11l5 5v15H4Z" fill="#edf4f8" stroke="currentColor" stroke-width="1.4"/><path d="M15 2v6h5 M7 10h3v3H7Z M12 11h5 M7 15h3v3H7Z M12 16h5 M7 20h9" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M2 5v19h15" fill="none" stroke="#a5bdcf"/></svg>';
  const chk = '<svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="#fff" stroke-width="2"/></svg>';
  const chev =
    '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="#232629" stroke-width="1.6"/></svg>';
  function P(c, s) {
    return '<div class="p ' + c + '">' + s + '</div>';
  }
  function cb(c, on, t) {
    return (
      '<div class="p cb ' +
      c +
      '"><i class="box' +
      (on ? ' on' : '') +
      '">' +
      (on ? chk : '') +
      '</i><span>' +
      t +
      '</span></div>'
    );
  }
  function sel(c, t, sw) {
    return (
      '<div class="p sel ' + c + '">' + (sw ? '<i class="sw"></i>' : '') + '<span>' + t + '</span>' + chev + '</div>'
    );
  }
  env.site({
    name: 'design-click-control-sequence-12',
    styles: ['site.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref breeze';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      head.innerHTML =
        '<i class="app"></i><span class="ttl">My Notebook</span><span class="wc"><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></span>';
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      const t1 = u.el('div', 'tab active', rail);
      t1.innerHTML = gear + '<span>Preferences</span>';
      const t2 = u.el('div', 'tab', rail);
      t2.innerHTML = doc + '<span>Task</span>';
      const page = u.el('section', 'page', work);
      let rings = '';
      for (let i = 0; i < 16; i++) rings += '<i style="top:calc(var(--u)*' + (32 + i * 51) + ')"></i>';
      u.el('div', 'rings', work).innerHTML = rings;
      const dec = u.el('div', 'deco', page);
      dec.innerHTML =
        '<div class="gearbig">' +
        gear +
        '</div>' +
        P('h1', 'Preferences') +
        P('sub', 'Customize the application settings below.') +
        '<div class="hr" style="left:82;top:146;width:1358"></div>' +
        P('h2 l', 'Appearance') +
        P('lab l1', 'Theme:') +
        sel('s1', 'Breeze (Light)') +
        P('lab l2', 'Accent color:') +
        sel('s2', 'Blue', 1) +
        P('lab l3', 'Font size:') +
        sel('s3', 'Medium') +
        '<div class="hr" style="left:82;top:411;width:602"></div>' +
        P('h2 b', 'Behavior') +
        cb('c1', 1, 'Start application at login') +
        cb('c2', 0, 'Check for updates automatically') +
        cb('c3', 0, 'Show notifications') +
        cb('c4', 1, 'Minimize to system tray') +
        '<div class="vr"></div>' +
        P('h2 d', 'Data') +
        P('lab dl', 'Default save location:') +
        '<div class="p field"><svg viewBox="0 0 24 24"><path d="M2 5h7l2 2h9v3H6l-4 9Z M6 10h17l-4 9H2Z" fill="none" stroke="#31363b" stroke-width="1.5"/></svg><span>Documents</span></div>' +
        '<div class="p btn chg">Change...</div>' +
        cb('c5', 1, 'Create backup files') +
        cb('c6', 0, 'Sync with cloud storage') +
        '<div class="hr" style="left:759;top:408;width:665"></div>' +
        P('h2 sc', 'Shortcuts') +
        P('lab n1', 'New note:') +
        P('key k1', 'Ctrl+N') +
        P('lab n2', 'Open note:') +
        P('key k2', 'Ctrl+O') +
        P('lab n3', 'Save note:') +
        P('key k3', 'Ctrl+S');
      dec.querySelectorAll('.hr').forEach((h) => {
        const m = /left:(\d+);top:(\d+);width:(\d+)/.exec(h.getAttribute('style'));
        h.setAttribute(
          'style',
          'left:calc(var(--u)*' + m[1] + ');top:calc(var(--u)*' + m[2] + ');width:calc(var(--u)*' + m[3] + ')',
        );
      });
      // Added frame choices use isolated streams; the widget's existing draws stay unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['header', 'link']);
      const endLabel = original ? 'Submit' : er.pick(endLabels.filter((label) => label !== 'Submit'));
      let display = ctx.display;
      if ((display === 'panel' || display === 'toast') && page.clientWidth < 1100) display = 'header';
      const pv = u.el(
        'div',
        'preview' + (display === 'panel' ? ' preview-panel' : display === 'toast' ? ' preview-toast' : ''),
        display === 'panel' || display === 'toast' ? work : page,
      );
      pv.hidden = display === 'hidden';
      if (ctx.instruction.length > 60) pv.classList.add('long-note');
      const ph = u.el('div', 'pvh', pv);
      ph.innerHTML = doc + '<span>Task (preview)</span>';
      const note = u.el('div', 'instruction', pv, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      const stage = u.el('div', 'stage', page);
      // Navigation changes only the notebook backdrop; task targets and anchors remain stable.
      const selectTab = (task) => {
        t1.classList.toggle('active', !task);
        t2.classList.toggle('active', task);
        t1.setAttribute('aria-selected', String(!task));
        t2.setAttribute('aria-selected', String(task));
        dec.classList.toggle('task-view', task);
        dec.querySelector('.h1').textContent = task ? 'Task' : 'Preferences';
        dec.querySelector('.sub').textContent = task
          ? 'Complete the actions shown in the task preview.'
          : 'Customize the application settings below.';
      };
      rail.setAttribute('role', 'tablist');
      // An overlay is dismissed through its own control, without synthesizing a second
      // pointer click into the still-obstructed workspace.
      rail.addEventListener('notebook:open-task', () => selectTab(true));
      [t1, t2].forEach((tab, i) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(i === 0));
        tab.addEventListener('click', () => selectTab(i === 1));
      });
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, page, endLabel);
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
      const decoyBtn = (cls, label, collide) => {
        const b = u.el('button', 'dec-btn ' + cls, page, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      decoyBtn('reset', 'Reset to Defaults');
      const hp = decoyBtn('help', 'Help');
      hp.innerHTML =
        '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#5b6770"/><text x="10" y="14.5" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="Arial">?</text></svg><span>Help</span>';
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length)
          decoyBtn('collide' + (placement === 'footer' && !ctx.finish ? ' pq-inner' : ''), cr.pick(options), true);
      }
      const foot = u.el('footer', 'footer', shell);
      foot.innerHTML =
        '<i class="kmenu">K</i><i class="sep"></i><i class="fold"></i><span class="tb"><i class="app"></i>My Notebook</span><span class="tray"><svg viewBox="0 0 24 24"><path d="M3 4h18v12H3Z M9 20h6 M12 16v4" fill="none" stroke="#31363b" stroke-width="1.6"/></svg><svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4Z M16 8q3 4 0 8 M18.5 5.5q5 6.500 0 13" fill="#31363b" stroke="#31363b" stroke-width="1.4"/></svg><svg viewBox="0 0 24 24"><path d="M2 9q10-8 20 0 M6 13q6-5 12 0 M9.500 16.500q2.500-2 5 0" fill="none" stroke="#31363b" stroke-width="1.8"/><circle cx="12" cy="20" r="1.5" fill="#31363b"/></svg><svg viewBox="0 0 24 24"><path d="m5 15 7-7 7 7" fill="none" stroke="#31363b" stroke-width="2"/></svg><span class="clock">10:24 AM<br><small>Apr 24, 2018</small></span></span>';
      foot.querySelector('.kmenu').innerHTML =
        '<svg viewBox="0 0 44 44"><path d="m14 8 3-5 5 1 1 5 5 2 4-2 4 4-2 4 2 5 5 1v5l-5 1-2 5 2 4-4 4-4-2-5 2-1 5h-5l-1-5-5-2-4 2-4-4 2-4-2-5-5-1v-5l5-1 2-5-2-4 4-4Z" transform="translate(2 -1) scale(.83)" fill="#263e52"/><circle cx="19" cy="23" r="9" fill="#e2e9f0"/><path d="M20 4h6v15l10-15h7L31 21l12 18h-8L26 25v14h-6Z" fill="#263e52" stroke="#e2e9f0" stroke-width="1.4"/></svg>';
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.initial) {
        const el = ctx.util.el('section', 'notebook-obstacle', document.body);
        const dismiss = ctx.util.el('button', 'tab notebook-task', el);
        dismiss.type = 'button';
        dismiss.innerHTML = doc + '<span>Task</span>';
        dismiss.addEventListener('click', () => {
          ctx.dismiss();
          document.querySelector('.rail').dispatchEvent(new Event('notebook:open-task'));
        });
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
