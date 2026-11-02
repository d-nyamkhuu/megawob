// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
    dark: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
    warm: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
  };

  const ACCENTS = ['#1762b2', '#1762b2', '#1762b2', '#1762b2', '#1762b2', '#1762b2'];

  const icons = {
    morning: '<path d="M7 30a13 13 0 0 1 26 0" fill="#ffcf24"/><path d="M3 31h34M20 8v5M7 13l4 5M33 13l-4 5M2 23l6 1M38 23l-6 1" fill="none"/><path d="M11 29a9 9 0 0 1 18 0" fill="#fff4ab" stroke-width="1"/>',
    work: '<rect x="14" y="5" width="12" height="8" rx="2" fill="#a87a3c"/><rect x="4" y="11" width="32" height="25" rx="3" fill="#b86c20"/><path d="M4 15q16 13 32 0v-3H4z" fill="#e4b06c"/><rect x="17" y="20" width="6" height="7" rx="1" fill="#ffe58a"/>',
    film: '<rect x="5" y="4" width="30" height="32" rx="1" fill="#202020"/><path d="M12 7h16v11H12zm0 15h16v11H12z" fill="#abd4ee"/><path d="M7 7h3v4H7zm0 7h3v4H7zm0 8h3v4H7zm0 7h3v4H7zm23-22h3v4h-3zm0 7h3v4h-3zm0 8h3v4h-3zm0 7h3v4h-3z" fill="white" stroke="none"/>',
    moon: '<path d="M18 3a17 17 0 1 0 19 23C22 33 11 19 18 3z" fill="#69b7f1"/><path d="M13 9c-6 13 5 25 18 22" fill="none" stroke="#c4e9ff"/>',
    relax: '<path d="M7 19v-7q13-8 26 0v7" fill="#0087df"/><path d="M7 29v7m26-7v7" fill="none" stroke-width="3"/><path d="M6 18q-6-1-4 6l3 8h30l3-8q2-7-4-6l-3 6H9z" fill="#139fe9"/><path d="M9 24h22v5H9z" fill="#58c4fa"/>',
    bulb: '<path d="M13 28c0-8-6-9-6-16a13 13 0 0 1 26 0c0 7-6 8-6 16z" fill="#ffe365"/><path d="M13 29h14v4H13zm3 5h8v3h-8z" fill="#a6a6a6"/><path d="M12 15q-2-9 7-10" fill="none" stroke="white" stroke-width="3"/>',
    temperature: '<path d="M15 25V7a5 5 0 0 1 10 0v18a9 9 0 1 1-10 0" fill="#fff"/><path d="M20 11v19" stroke="#e60000" stroke-width="4"/><circle cx="20" cy="31" r="5" fill="red" stroke="none"/><path d="M28 12h4m-4 5h4m-4 5h4" fill="none" stroke-width="1"/>',
    sound: '<path d="M4 15h7l11-9v28l-11-9H4z" fill="#a4a4a4"/><path d="M26 13q8 7 0 14m5-18q11 11 0 22" fill="none"/>',
    clock: '<circle cx="20" cy="20" r="17" fill="#fff" stroke="#317ca9"/><path d="M20 8v13l8 5M20 4v3M20 33v3M4 20h3M33 20h3" fill="none"/>',
    music: '<path d="M13 29V8l22-5v25M13 15l22-5" fill="none" stroke-width="4"/><path d="M14 29V8l20-4v24" fill="none" stroke="#209ce8" stroke-width="2"/><ellipse cx="8" cy="31" rx="6" ry="5" fill="#008ad7"/><ellipse cx="29" cy="29" rx="6" ry="5" fill="#008ad7"/>',
    scenes: '<path d="M4 15h32v21H4z" fill="#444"/><path d="m3 7 31-5 2 9-31 5z" fill="#333"/><path d="m9 6 5 7m5-9 5 7m5-9 5 7" stroke="white" stroke-width="3"/><path d="M10 24h21M14 21v6" fill="none" stroke="#eee"/>',
    settings: '<path d="m11 26 14-14c-2-7 4-11 11-9l-7 6 3 4 6-6c2 9-4 12-10 10L15 31c-7 10-13 4-4-5z" fill="#b6b8b3"/><circle cx="10" cy="31" r="2" fill="#fff"/>',
    help: '<path d="M10 13c0-14 23-14 23 0 0 8-11 8-11 15h-7c0-11 11-10 11-15 0-6-9-5-9 0z" fill="#4db5f2"/><circle cx="18.5" cy="35" r="4" fill="#4db5f2"/>',
  };
  function illustration(util, parent, kind) {
    const icon = util.el('span', 'portal-illustration', parent);
    if (kind === 'house' || kind === 'document') icon.style.backgroundImage = 'url(sites/design-use-smart-home-scene-05/assets/' + kind + '.svg)';
    else if (['ceiling','lamp','speaker','hall'].includes(kind)) icon.classList.add('device-art', kind);
    else icon.innerHTML = '<svg viewBox="0 0 40 40" fill="none" stroke="#111" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + icons[kind] + '</svg>';
    return icon;
  }

  const parts = {
    endLabel: base => (rng, content) => {
      const label = base(rng, content);
      return rng.fork('portal/end-label').bool(0.55) ? 'Continue' : label;
    },
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        if (kind === 'banner') document.querySelector('.ref-task').insertAdjacentElement('afterend', el);
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') util.el('div', 'ref-promo-title', box, 'Stay in the Loop');
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.toggle('ref-panel-mode', display === 'panel');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('ref-window-title');
        util.el('span', 'ref-app-mark', header, '⌂');
        util.el('span', 'ref-window-name', header, 'Home & Media Console');
        util.el('span', 'portal-clock', header, 'Tue Apr 14, 1998   6:12 PM');
        const windowButtons = util.el('div', 'ref-window-buttons', header);
        for (const symbol of ['−', '□', '×']) util.el('span', '', windowButtons, symbol);
        S.frameBrand(_c, header);
        Object.assign(_c, { header, windowButtons });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const menu = util.el('nav', 'ref-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Controls', 'Tools', 'Help'])
          util.el('span', 'ref-menuitem', menu, item);
        const quick = util.el('div', 'ref-quickbar', document.body);
        for (const [icon, title] of [
          [
            '<svg viewBox="0 0 32 32"><path d="M3 15 16 4l13 11v13H19v-9h-6v9H3z" fill="#f8fbff" stroke="#173f70" stroke-width="2"/><path d="m2 15 14-12 14 12" fill="none" stroke="#173f70" stroke-width="3"/></svg>',
            'Home',
          ],
          [
            '<svg viewBox="0 0 32 32"><path d="M11 20c0-4-4-5-4-10a9 9 0 0 1 18 0c0 5-4 6-4 10z" fill="#ffe27a" stroke="#624c16" stroke-width="2"/><path d="M12 23h8m-7 4h6" stroke="#534a35" stroke-width="2"/></svg>',
            'Lights',
          ],
          [
            '<svg viewBox="0 0 32 32"><path d="M14 5a4 4 0 0 1 8 0v14a8 8 0 1 1-8 0z" fill="#f4f7fb" stroke="#253f60" stroke-width="2"/><path d="M18 9v15" stroke="#d63836" stroke-width="4"/><circle cx="18" cy="24" r="4" fill="#d63836"/></svg>',
            'Climate',
          ],
          [
            '<svg viewBox="0 0 32 32"><path d="M12 24V6l16-3v19M12 12l16-3" fill="none" stroke="#102d68" stroke-width="4"/><path d="M13 24V6l14-2v18" fill="none" stroke="#417ce0" stroke-width="2"/><ellipse cx="8" cy="25" rx="5" ry="4" fill="#3268c6" stroke="#102d68"/><ellipse cx="23" cy="23" rx="5" ry="4" fill="#3268c6" stroke="#102d68"/></svg>',
            'Media',
          ],
          [
            '<svg viewBox="0 0 32 32"><rect x="4" y="3" width="24" height="27" fill="#1e335b" stroke="#101d3d" stroke-width="2"/><path d="M11 5h10v10H11zm0 12h10v10H11z" fill="#a7c9ee"/><path d="M6 5h3v4H6zm0 7h3v4H6zm0 7h3v4H6zm0 7h3v2H6zm17-21h3v4h-3zm0 7h3v4h-3zm0 7h3v4h-3zm0 7h3v2h-3z" fill="#e7f2ff"/></svg>',
            'Video',
          ],
          [
            '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#fff" stroke="#263d59" stroke-width="2"/><path d="M16 8v9l6 4" fill="none" stroke="#263d59" stroke-width="2.5"/></svg>',
            'Schedules',
          ],
        ]) {
          const item = util.el('div', 'ref-quickitem', quick);
          util.el('span', 'ref-quickicon', item).innerHTML = icon;
          util.el('span', '', item, title);
        }
        const rail = util.el('nav', 'portal-rail', document.body);
        for (const [icon, title] of [['house','Home'],['document','Rooms'],['bulb','Devices'],['scenes','Scenes'],['clock','Schedules'],['music','Music'],['film','Video'],['settings','Settings'],['help','Help']]) {
          const link = util.el('a', '', rail);
          link.href = '#';
          link.addEventListener('click', event => event.preventDefault());
          illustration(util, link, icon);
          util.el('span', '', link, title);
        }
        Object.assign(_c, { menu, quick });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        // Directory summaries use the same illustrated rows as the editor.
        const consoleBg = util.el('div', 'home-console-bg', body);
        const scenes = util.el('section', 'home-scenes', consoleBg);
        util.el('h2', '', scenes, 'Upcoming Schedules');
        const sceneTable = util.el('table', '', scenes);
        sceneTable.innerHTML =
          '<thead><tr><th>Name</th><th>Schedule</th></tr></thead><tbody><tr><td>Morning start</td><td>Daily 07:00</td></tr><tr><td>Work mode</td><td>Mon–Fri 09:00</td></tr><tr><td>Movie time</td><td>Sat 20:00</td></tr><tr><td>Soft landing</td><td>Wed, Fri, Sun 22:35</td></tr></tbody>';
        const sceneActions = util.el('div', 'home-panel-actions', scenes);
        for (const label of ['Add...', 'Edit...', 'Delete']) util.el('button', '', sceneActions, label);
        const rooms = util.el('section', 'home-rooms', consoleBg);
        util.el('h2', '', rooms, 'System Status');
        for (const [kind, name, value] of [['temperature','Living room temperature','21°C'],['bulb','Lights on','2 of 4'],['sound','Media speaker','Off']]) {
          const row = util.el('div', 'portal-summary-row portal-status-row', rooms);
          illustration(util, row, kind);
          util.el('span', 'portal-row-label', row, name);
          util.el('span', 'portal-row-value', row, value);
        }
        const queue = util.el('section', 'home-queue', consoleBg);
        util.el('h2', '', queue, 'Scenes');
        for (const [kind, name] of [['morning','Good morning'],['work','Work mode'],['film','Movie time'],['moon','Soft landing'],['relax','Evening relax']]) {
          const row = util.el('div', 'portal-summary-row', queue);
          illustration(util, row, kind);
          util.el('span', 'portal-row-label portal-row-link', row, name);
        }
        const queueActions = util.el('div', 'home-queue-actions', queue);
        for (const label of ['Add...', 'Remove', 'Move Up', 'Move Down']) {
          const b = util.el('button', '', queueActions, label);
          b.disabled = label.startsWith('Move');
        }
        const player = util.el('section', 'home-video', consoleBg);
        util.el('h2', '', player, 'Devices');
        for (const [kind, name, value] of [['ceiling','Ceiling light','Off'],['lamp','Reading lamp','Off'],['speaker','Media speaker','Off'],['hall','Hall light','On']]) {
          const row = util.el('div', 'portal-summary-row', player);
          illustration(util, row, kind);
          util.el('span', 'portal-row-label', row, name);
          util.el('span', 'portal-row-value', row, value);
        }
        if (display === 'panel') consoleBg.prepend(body.querySelector('.ref-panel'));
        Object.assign(_c, { consoleBg, player, queue, queueActions, rooms, sceneActions, sceneTable, scenes });
      },
    'frame.end': base => _c => {
      const result = base(_c);
      const { util, header, headerTools, placement, submit } = _c;
      const footerMode = submit && ['header', 'floating', 'link'].includes(placement);
      const footer = footerMode ? util.el('footer', 'portal-footer', document.body) : null;
      const controls = [];
      document.querySelectorAll('.ref-foot .ref-tools, .ref-float-dock').forEach(box => controls.push(...box.children));
      controls.forEach(control => headerTools.appendChild(control));
      if (submit) {
        submit.classList.remove('ref-float');
        headerTools.appendChild(submit);
      }
      if (footer) footer.appendChild(headerTools);
      else header.appendChild(headerTools);
      document.querySelectorAll('.ref-foot, .ref-float-dock').forEach(node => node.remove());
      document.body.style.setProperty('--portal-header-height', header.getBoundingClientRect().height + 'px');
      document.body.style.setProperty('--portal-footer-height', footer ? (_c.W <= 1100 ? '36px' : '44px') : '0px');
      document.body.classList.toggle('portal-has-footer', !!footer);
      return result;
    },
  };

  env.site({
    name: 'design-use-smart-home-scene-05',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
