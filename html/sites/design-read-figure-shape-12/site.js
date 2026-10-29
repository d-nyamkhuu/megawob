(function () {
  'use strict';
  const C = { 'site': 'design-read-figure-shape-12' };
  function icon(u, parent, name) {
    const paths = {
      home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
      target: 'M19 8a9 9 0 1 1-4-4M16 3v5h5M17 7l-5 5M14 9a4 4 0 1 0 2 4',
      chart: 'M3 15h4v6H3zM10 6h4v15h-4zM17 10h4v11h-4z',
      gear: 'M9 3h6l1 3 3 1 2 5-2 2v4l-4 3-3-1-3 1-4-3v-4l-2-2 2-5 3-1zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
      sun: 'M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0',
      sound: 'M3 9h4l6-5v16l-6-5H3zM17 7q5 5 0 10M20 4q8 8 0 16',
      bell: 'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zM10 20q2 3 4 0',
      task: 'M8 4H5v18h14V4h-3M9 2h6v5H9zM8 11h8M8 15h8M8 18h6',
      search: 'M16 16l6 6M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
      wifi: 'M2 8q10-8 20 0M5 12q7-6 14 0M8 16q4-4 8 0M12 20h.01',
      battery: 'M2 6h17v12H2zM21 10v4M5 9h11v6H5z',
    };
    const svg = u.svg(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.6,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
      },
      parent,
    );
    u.svg('path', { d: paths[name] || paths.target }, svg);
    return svg;
  }
  function preferences(u, parent) {
    const prefs = u.el('section', 'prefs', parent);
    u.el('h2', '', prefs, 'Preferences');
    u.el('p', 'sub', prefs, 'Customize your experience.');
    const card = u.el('div', 'pcard', prefs);
    const r1 = u.el('div', 'prow', card);
    u.el('i', 'ri', r1);
    u.el('span', 'rl', r1, 'Theme');
    u.el('span', 'sel', r1, 'Light (default)');
    const r2 = u.el('div', 'prow', card);
    u.el('i', 'ri', r2);
    u.el('span', 'rl', r2, 'Sound');
    u.el('span', 'tog on', r2);
    u.el('span', 'tv', r2, 'On');
    const r3 = u.el('div', 'prow', card);
    u.el('i', 'ri', r3);
    u.el('span', 'rl', r3, 'Notifications');
    u.el('span', 'tog', r3);
    u.el('span', 'tv', r3, 'Off');
    const r4 = u.el('div', 'prow', card);
    u.el('i', 'ri', r4);
    u.el('span', 'rl', r4, 'Difficulty');
    u.el('span', 'sel', r4, 'Normal');
    const tip = u.el('div', 'tip', card);
    u.el('i', 'cb', tip);
    u.el('span', '', tip, 'Show tips during practice');
    u.el('small', '', card, 'Tips can help you get familiar with the tasks.');
    const pb = u.el('div', 'pbtn', prefs);
    ['Reset to default', 'Save'].forEach((label, i) => {
      const b = u.el('button', i ? 'save' : 'reset', pb, label);
      b.type = 'button';
      b.addEventListener('click', () => env.log('decoy', { label }));
    });
    prefs.querySelectorAll('.ri').forEach((el, i) => icon(u, el, ['sun', 'sound', 'bell', 'chart'][i]));
    return prefs;
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'promo', p: 1, at: 0 },
    frame(ctx) {
      document.body.className = 'fluent task-open instruction-' + ctx.display;
      const u = ctx.util,
        win = u.el('main', 'app win', document.body);
      const top = u.el('header', 'top', win);
      u.el('i', 'appico', top);
      u.el('span', '', top, 'Focus Trainer');
      icon(u, top.querySelector('.appico'), 'target');
      const wc = u.el('div', 'wc', top);
      u.el('span', '', wc, '–');
      u.el('span', '', wc, '□');
      u.el('span', '', wc, '✕');
      u.el('nav', 'menu', top);
      const body = u.el('div', 'wbody', win);
      const side = u.el('nav', 'side', body);
      ['Home', 'Practice', 'Progress', 'Settings'].forEach((t, i) => {
        const b = u.el('div', 'nav' + (i === 1 ? ' on' : ''), side);
        u.el('i', 'ni', b);
        u.el('span', '', b, t);
      });
      side.querySelectorAll('.ni').forEach((el, i) => icon(u, el, ['home', 'target', 'chart', 'gear'][i]));
      const main = u.el('div', 'wmain', body);
      const tabs = u.el('div', 'tabs', main);
      const tp = u.el('div', 'tab', tabs);
      u.el('i', 'ti', tp);
      u.el('span', '', tp, 'Preferences');
      const tt = u.el('div', 'tab on', tabs);
      u.el('i', 'ti', tt);
      u.el('span', '', tt, 'Task');
      icon(u, tp.querySelector('.ti'), 'gear');
      icon(u, tt.querySelector('.ti'), 'task');
      tp.setAttribute('role', 'button');
      tt.setAttribute('role', 'button');
      tt.id = 'task-tab';
      const cols = u.el('div', 'cols', main);
      const taskp = u.el('section', 'taskp', cols);
      const stagebox = u.el('div', 'stagebox', taskp);
      const stage = u.el('section', 'stage', stagebox);
      const prev = u.el('aside', 'preview', cols);
      u.el('b', '', prev, 'Task Preview');
      const pv = u.el('div', 'pvbox', prev);
      const c1 = u.el('i', 'pc1', pv);
      u.el('b', 'pt', pv, 'T');
      u.el('i', 'ptri', pv);
      u.el('i', 'psq', pv);
      u.el('i', 'pc2', pv);
      const brief = u.el('div', 'brief', prev, ctx.display === 'hidden' ? '' : ctx.instruction);
      u.el('p', 'pgo', prev, 'Go to the Task tab to complete it.');
      const foot = u.el('footer', 'bottom', main);
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const primary = er.bool(0.5),
        placement = primary ? 'footer' : er.pick(['toolbar', 'link']);
      const label = primary ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const host = placement === 'toolbar' ? tabs : foot;
        submit = u.el('button', 'submit end-' + placement, host, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      } else u.el('span', 'practice-status', foot, 'Practice session');
      if (cr.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool),
            decoy = u.el('button', 'chrome-xtra', foot, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      tt.addEventListener('click', () => {
        document.body.classList.add('task-open');
        tt.classList.add('on');
        tp.classList.remove('on');
        const prefs = cols.querySelector('.prefs');
        if (prefs) prefs.remove();
      });
      tp.addEventListener('click', () => {
        if (!cols.querySelector('.prefs')) preferences(u, cols);
        document.body.classList.remove('task-open');
        tp.classList.add('on');
        tt.classList.remove('on');
      });
      if (ctx.display !== 'hidden') {
        const aside = u.el('aside', 'aside task-note', document.body);
        u.el('div', 'yt', aside, 'Your Task');
        u.el('div', 'yi', aside, ctx.instruction);
      }
      const bar = u.el('div', 'desktop-bar', document.body);
      u.el('i', 'start-logo', bar);
      const search = u.el('div', 'desktop-search', bar);
      icon(u, search, 'search');
      u.el('span', '', search, 'Search');
      const apps = u.el('div', 'desktop-apps', bar);
      u.el('i', 'folder-icon', apps);
      u.el('i', 'edge-icon', apps, 'e');
      const focus = u.el('i', 'focus-icon appico', apps);
      icon(u, focus, 'target');
      const tray = u.el('div', 'desktop-tray', bar);
      icon(u, tray, 'wifi');
      icon(u, tray, 'sound');
      icon(u, tray, 'battery');
      u.el('div', 'desktop-clock', tray, '10:24 AM\nApr 24, 2024');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const el = preferences(u, document.querySelector('.cols')),
          dismiss = document.querySelector('#task-tab');
        document.body.classList.remove('task-open');
        dismiss.classList.remove('on');
        document.querySelector('.tab').classList.add('on');
        dismiss.addEventListener('click', ctx.dismiss, { once: true });
        return { el, dismiss };
      }
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
