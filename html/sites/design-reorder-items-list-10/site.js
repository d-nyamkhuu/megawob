(function () {
  'use strict';
  const C = {
    title: 'Event Organizer',
    details: 'Event Details',
    font: '"Segoe UI",Arial,sans-serif',
    accent: '#2a6ed6',
    bg: '#1f6aa5',
    panel: '#ffffff',
  };
  // Inline the original desktop so its paint resources exist on every reset.
  const DESKTOP =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941" viewBox="0 0 1672 941" preserveAspectRatio="none">\n<defs>\n <linearGradient id="base" x2="1" y2="1"><stop stop-color="#65b6ce"/><stop offset=".35" stop-color="#197ba9"/><stop offset=".7" stop-color="#05609b"/><stop offset="1" stop-color="#1a7abb"/></linearGradient>\n <radialGradient id="sky" cx=".9" cy="0" r=".8"><stop stop-color="#b9e4ee" stop-opacity=".9"/><stop offset=".45" stop-color="#69b4db" stop-opacity=".4"/><stop offset="1" stop-color="#2078ad" stop-opacity="0"/></radialGradient>\n <linearGradient id="ray" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#8ae2dc" stop-opacity=".05"/><stop offset=".45" stop-color="#89e5df" stop-opacity=".65"/><stop offset=".6" stop-color="#75cfdf" stop-opacity=".15"/><stop offset="1" stop-color="#b9eafa" stop-opacity=".02"/></linearGradient>\n <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c2f2dd" stop-opacity=".05"/><stop offset=".65" stop-color="#9ae8e5" stop-opacity=".4"/><stop offset="1" stop-color="#79d3ef" stop-opacity=".07"/></linearGradient>\n <filter id="soft"><feGaussianBlur stdDeviation="12"/></filter>\n <filter id="glow"><feGaussianBlur stdDeviation="4"/></filter>\n <linearGradient id="light" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b4ecee" stop-opacity=".05"/><stop offset=".4" stop-color="#bbf3e7" stop-opacity=".65"/><stop offset="1" stop-color="#5bc6e5" stop-opacity=".08"/></linearGradient>\n</defs>\n<path fill="url(#base)" d="M0 0H1672V941H0Z"/><path fill="url(#sky)" d="M0 0H1672V941H0Z"/>\n<g filter="url(#soft)">\n<path d="M-90 175Q510 500 1700 33L1700 -80Q570 371 -90 80Z" fill="#9de1ef" opacity=".16"/>\n<path d="M-40 113Q617 486 1698 53" fill="none" stroke="#9edcee" stroke-width="4" opacity=".35" filter="url(#glow)"/>\n<path d="M1430 -80Q1375 264 900 443Q150 770 -120 564Q-202 429 110 204Q-120 352 -70 544Q95 903 956 474Q1420 250 1480 -80Z" fill="url(#ray)"/>\n<path d="M1450 -50Q1390 257 952 453Q292 754 25 634Q-113 575 -10 409" fill="none" stroke="#a7edee" stroke-width="3" opacity=".25" filter="url(#glow)"/>\n<path d="M-70 183Q-30 575 718 782Q1260 932 1700 915L1700 969Q1000 948 480 748Q-48 513 -70 183Z" fill="url(#sweep)"/>\n<path d="M-40 390Q250 667 990 815Q1380 893 1700 915" fill="none" stroke="#a5e7e4" stroke-width="12" opacity=".23" filter="url(#soft)"/>\n<path d="M-30 449Q459 762 1672 910" fill="none" stroke="#c6f5e8" stroke-width="2" opacity=".26"/>\n<path d="M605 -70Q579 380 966 684Q1351 992 1638 1010L1740 942Q1280 873 967 610Q622 320 666 -70Z" fill="url(#sweep)" opacity=".9"/>\n<path d="M638 -50Q592 423 1050 738Q1316 920 1689 989" fill="none" stroke="#b7f4da" stroke-width="9" opacity=".32" filter="url(#glow)"/>\n<path d="M623 -40Q603 468 1090 774Q1320 916 1640 975" fill="none" stroke="#b4eadb" stroke-width="2" opacity=".3"/>\n<path d="M-30 10Q48 580 520 752Q764 840 1200 933" fill="none" stroke="#c4f6ee" stroke-width="20" opacity=".1" filter="url(#soft)"/>\n</g>\n<path d="M1020 50Q1290 209 1740 28L1740 76Q1320 241 1020 50Z" fill="#b8e8f4" opacity=".09"/>\n<path d="M1040 39Q1320 230 1740 60" stroke="#b6e4f3" stroke-width="2" fill="none" opacity=".25" filter="url(#glow)"/>\n<path d="M1522 -40Q1498 232 1310 423Q1190 546 1280 733Q1410 877 1740 920L1740 941Q1455 905 1314 773Q1135 578 1302 391Q1460 210 1482 -40Z" fill="url(#light)" opacity=".3"/>\n<path d="M1511 -40Q1482 244 1305 414" fill="none" stroke="#bde9f4" stroke-width="3" opacity=".2" filter="url(#glow)"/>\n<path d="M-40 129Q490 591 1710 74" fill="none" stroke="#a1e0ec" stroke-width="2" opacity=".3" filter="url(#glow)"/>\n<path d="M1070 617Q1128 810 1380 977" fill="none" stroke="url(#light)" stroke-width="60" opacity=".65" filter="url(#soft)"/>\n<path d="M1090 650Q1165 827 1388 959" fill="none" stroke="#c7f5cf" stroke-width="4" opacity=".37" filter="url(#glow)"/>\n<path d="M1130 661Q1262 824 1700 939" fill="none" stroke="#71c7ea" stroke-width="22" opacity=".27" filter="url(#soft)"/>\n<path d="M1148 690Q1387 852 1710 891" fill="none" stroke="#87d2e8" stroke-width="4" opacity=".36" filter="url(#glow)"/>\n<path d="M1131 661Q1310 817 1700 942" fill="none" stroke="#b4e7e9" stroke-width="1.5" opacity=".2"/>\n<path d="M1050 488Q1230 700 1710 796" fill="none" stroke="#4ea4d6" stroke-width="35" opacity=".15" filter="url(#soft)"/>\n</svg>\n';
  env.site({
    name: 'design-reorder-items-list-10',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design win7 layout-left' +
        (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
        (ctx.display === 'panel' ? ' has-instruction-panel' : '');
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const endPlacement = endRng.pick(['footer', 'toolbar', 'footer', 'link']);
      const endLabel = endPlacement === 'footer' ? 'Submit' : endRng.pick(endLabels);
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.panel,
        fg: '#101820',
        muted: '#5d6a7a',
        line: '#c3cad3',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const wallpaper = u.el('div', 'desktop-wallpaper', body);
      wallpaper.innerHTML = DESKTOP;
      const shell = u.el('div', 'shell', body);
      let calendarIndex = 0;
      const calIcon = (parent, cls) => {
        const s = u.svg('svg', { class: cls, viewBox: '0 0 64 64' }, parent),
          id = 'calendar-' + calendarIndex++;
        const defs = u.svg('defs', {}, s);
        for (const [suffix, a, b] of [
          ['header', '#6cafff', '#3285ef'],
          ['cell', '#d5dfe9', '#a7b8cb'],
        ]) {
          const g = u.svg('linearGradient', { id: id + '-' + suffix, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
          u.svg('stop', { offset: 0, 'stop-color': a }, g);
          u.svg('stop', { offset: 1, 'stop-color': b }, g);
        }
        u.svg(
          'rect',
          { x: 7, y: 12, width: 50, height: 46, rx: 2, fill: '#f4f8fd', stroke: '#87a7cb', 'stroke-width': 3 },
          s,
        );
        u.svg(
          'rect',
          {
            x: 6,
            y: 12,
            width: 52,
            height: 13,
            rx: 3,
            fill: 'url(#' + id + '-header)',
            stroke: '#478fed',
            'stroke-width': 0.8,
          },
          s,
        );
        u.svg('rect', { x: 16, y: 6, width: 5, height: 12, rx: 2, fill: '#dfe9f7', stroke: '#2f6bc4' }, s);
        u.svg('rect', { x: 30, y: 6, width: 5, height: 12, rx: 2, fill: '#dfe9f7', stroke: '#2f6bc4' }, s);
        u.svg('rect', { x: 43, y: 6, width: 5, height: 12, rx: 2, fill: '#dfe9f7', stroke: '#2f6bc4' }, s);
        for (let r = 0; r < 3; r++)
          for (let c = 0; c < 4; c++)
            u.svg('rect', { x: 12 + c * 11, y: 29 + r * 9, width: 8, height: 8, fill: 'url(#' + id + '-cell)' }, s);
        return s;
      };
      const detailsIcon = (parent, cls) => {
        const s = u.svg('svg', { class: cls, viewBox: '0 0 64 64' }, parent);
        u.svg(
          'rect',
          { x: 7, y: 4, width: 49, height: 56, rx: 4, fill: '#e8ece8', stroke: '#57758a', 'stroke-width': 3 },
          s,
        );
        u.svg('path', { d: 'M13 12L27 8L39 15L51 10V49L39 54L26 48L13 53Z', fill: '#f5e4ae', stroke: '#b5b9ac' }, s);
        u.svg(
          'path',
          { d: 'M23 10L29 24L20 36L33 49M44 13L34 28L46 40L39 53', fill: 'none', stroke: '#a6cfe7', 'stroke-width': 6 },
          s,
        );
        u.svg('path', { d: 'M28 10L26 48M39 15V54', stroke: '#fff', 'stroke-width': 2 }, s);
        return s;
      };
      const ctrls = (parent, name) => {
        const g = u.el('div', 'wc', parent);
        for (const l of ['min', 'max', 'close']) {
          const b = u.el('button', 'wc-' + l, g);
          b.type = 'button';
          b.setAttribute('aria-label', l);
          b.onclick = () => env.log('window-control', { label: l, window: name });
        }
      };
      // main window frame
      const main = u.el('div', 'win win-main', shell);
      const mt = u.el('div', 'win-title', main);
      calIcon(mt, 'win-ico');
      u.el('span', '', mt, C.title);
      ctrls(mt, 'main');
      const menu = u.el('div', 'win-menu', main);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', '', menu, m);
      u.el('div', 'win-pane main-pane', main);
      // details window
      const det = u.el('div', 'win win-det', shell);
      const dt = u.el('div', 'win-title', det);
      detailsIcon(dt, 'win-ico');
      u.el('span', '', dt, C.details);
      ctrls(dt, 'details');
      u.el('div', 'det-bar', det, '+');
      const dp = u.el('div', 'win-pane det-pane', det);
      u.el('h3', '', dp, 'Selected Month');
      u.el('p', 'det-none', dp, 'No month selected.');
      u.el('hr', '', dp);
      u.el('label', '', dp, 'Planned activities:');
      const ta = u.el('div', 'det-box', dp);
      u.el('i', 'up', ta);
      u.el('i', 'down', ta);
      u.el('label', '', dp, 'Notes:');
      const tb = u.el('div', 'det-box', dp);
      u.el('i', 'up', tb);
      u.el('i', 'down', tb);
      // instruction note
      const note = u.el('section', 'task-note', shell);
      if (ctx.display === 'panel') u.el('h2', 'panel-heading', note, 'Instructions');
      u.el('div', 'instruction', note, ctx.instruction);
      u.el('p', 'brief-copy', note, 'Drag and drop the months into the correct order.');
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      // list well
      const stage = u.el('main', 'stage', shell);
      stage.dataset.role = 'stage';
      // side pane
      const side = u.el('aside', 'side', shell);
      calIcon(side, 'side-ico');
      u.el('h2', '', side, C.title);
      u.el('p', '', side, 'Arrange the months so they are in calendar order from January to December.');
      // footer
      u.el('div', 'foot-rule', shell);
      const footer = u.el('footer', 'footer', shell);
      const reset = u.el('button', 'clear', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlacement === 'toolbar' ? menu : footer;
        submit = u.el(
          'button',
          'submit' + (endPlacement === 'toolbar' ? ' end-toolbar' : endPlacement === 'link' ? ' end-link' : ''),
          parent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
      }
      if (collideRng.bool(0.3)) {
        const options = [...new Set(endLabels)].filter(
          (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) {
          const label = collideRng.pick(options),
            decoy = u.el('button', 'end-xtra', endPlacement === 'toolbar' && !ctx.finish ? footer : menu, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label, collide: true });
        }
      }
      // taskbar
      const tb2 = u.el('div', 'taskbar', shell);
      const orb = u.el('div', 'orb', tb2);
      const flag = u.svg('svg', { viewBox: '0 0 40 40' }, orb);
      for (const [d, fill] of [
        ['M8 8Q15 5 21 9L18 20Q12 16 5 20Z', '#ed5428'],
        ['M23 9Q30 13 36 10L33 21Q26 24 20 20Z', '#7cbd32'],
        ['M5 22Q12 18 18 22L15 33Q9 29 2 33Z', '#2ca8ea'],
        ['M20 22Q26 26 33 23L30 34Q23 37 17 33Z', '#f9c63b'],
      ])
        u.svg('path', { d, fill, stroke: '#fff8', 'stroke-width': 0.5 }, flag);
      for (const [n, l] of [
        ['a', C.title],
        ['b', C.details],
      ]) {
        const t = u.el('div', 'task task-' + n, tb2);
        (n === 'a' ? calIcon : detailsIcon)(t, 'task-ico');
        u.el('span', '', t, l);
      }
      const tray = u.el('div', 'tray', tb2);
      const sg = u.svg('svg', { class: 'tray-ico', viewBox: '0 0 20 16' }, tray);
      for (let i = 0; i < 5; i++)
        u.svg(
          'rect',
          {
            x: 1 + i * 4,
            y: 13 - i * 3,
            width: 2.4,
            height: 3 + i * 3,
            fill: '#e8f0fa',
            stroke: '#263b4c',
            'stroke-width': 0.6,
          },
          sg,
        );
      const sp = u.svg('svg', { class: 'tray-ico', viewBox: '0 0 20 16' }, tray);
      u.svg('path', { d: 'M2 6H6L11 2V14L6 10H2Z', fill: '#e8f0fa' }, sp);
      u.svg(
        'path',
        { d: 'M13.5 5Q16 8 13.5 11M15.5 3Q19.5 8 15.5 13', fill: 'none', stroke: '#e8f0fa', 'stroke-width': 1.3 },
        sp,
      );
      const clk = u.el('div', 'clock', tray);
      u.el('div', '', clk, '10:24 AM');
      u.el('div', '', clk, '5/14/2007');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind] || 'Notice';
      const text =
        {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind] || '';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const a = u.el('button', 'dismiss', box, 'Accept optional');
        a.type = 'button';
        a.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
