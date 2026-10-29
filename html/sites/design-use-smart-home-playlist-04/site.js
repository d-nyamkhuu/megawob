// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.lang': (base, S) => function (_c) {
      const { ctx, rng, util } = _c;
      // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const lr = rng.fork('chrome/lang');
      const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
      const closeLabel = word ? word('close') : 'Close';

      // The 1994 page uses a simple title line and a row of native-looking tabs.
      const frame = util.el('div', 'hh-frame', document.body);
      const titlebar = util.el('div', 'hh-titlebar', frame);
      util.el('span', 'hh-title', titlebar, 'Home & Media Console');
      const mastheadInfo = util.el('div', 'hh-masthead-info', titlebar);
      util.el('div', '', mastheadInfo, 'Rivermere House');
      util.el('div', '', mastheadInfo, 'Mon, Apr 18, 1994　10:24 AM');
      util.el('span', 'hh-window-buttons', titlebar, '−　□　×');
      const menu = util.el('div', 'hh-menu', frame);
      for (const label of ['File', 'Edit', 'View', 'Controls', 'Tools', 'Help']) util.el('span', '', menu, label);
      const ribbon = util.el('div', 'hh-ribbon', frame);
      for (const [icon, label] of [['⌂','Home'],['♫','Music'],['▣','Video'],['▦','Schedule'],['⚙','Settings']]) {
        const item = util.el('div', 'hh-ribbon-item', ribbon);
        util.el('span', 'hh-ribbon-icon', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { closeLabel, frame, local, lr, mastheadInfo, menu, ribbon, titlebar, word });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('hh-note-row');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      // The console's persistent room/media index and the two home-monitor panels.
      // These are presentation-only; the playlist widget retains all task controls.
      const index = util.el('aside', 'hh-index', body);
      const groups = [
        ['⌂','Rooms',['⌂','Living Room','⌂','Kitchen','♙','Bedroom','⌂','Office','⌂','Patio']],
        ['♟','Devices',['♨','Thermostat','☀','Lights','◉','Speakers','▣','TV']],
        ['♫','Media',['♫','Now Playing','☷','Music Queue','▣','Video','▧','Photos']],
        ['◷','Automation',['▦','Schedules','★','Scenes','⚙','Rules']]
      ];
      for (const [symbol, title, entries] of groups) {
        const group = util.el('section', 'hh-navgroup', index);
        util.el('div', 'hh-navheading', group, `${symbol}　${title}`);
        for (let i=0;i<entries.length;i+=2) {
          const link = util.el('div', `hh-navitem${title==='Media' && entries[i+1]==='Music Queue'?' selected':''}`, group);
          util.el('span', 'hh-navicon', link, entries[i]);
          util.el('span', '', link, entries[i+1]);
        }
      }
      const work = util.el('div', 'hh-workarea', body);
      work.appendChild(stage);
      const lower = util.el('div', 'hh-lower', work);
      const controls = util.el('section', 'hh-home-controls', lower);
      util.el('h2', '', controls, '⌂　Home Controls');
      const temperature = util.el('div', 'hh-control-content', controls);
      const temp = util.el('div', 'hh-temperature', temperature);
      util.el('strong', 'hh-control-label', temp, 'Temperature');
      const tempAdjust = util.el('div', 'hh-temp-adjust', temp);
      util.el('div', 'hh-temp-display', tempAdjust, '72°F');
      const tempButtons = util.el('div', 'hh-temp-buttons', tempAdjust);
      util.el('button', '', tempButtons, '▲');
      util.el('button', '', tempButtons, '▼');
      const target = util.el('label', 'hh-target', temp, 'Target:');
      const targetInput = util.el('input', '', target);
      targetInput.value = '72';
      targetInput.readOnly = true;
      util.el('span', '', target, '°F');
      const mode = util.el('label', 'hh-mode', temp, 'Mode:');
      const modeValue = util.el('span', 'hh-native-select', mode, 'Auto');
      util.el('span', 'hh-select-arrow', modeValue, '▼');
      const lights = util.el('div', 'hh-light-controls', temperature);
      util.el('strong', 'hh-control-label', lights, 'Living Room Lights');
      const color = util.el('label', 'hh-color', lights, 'Color:');
      const colorValue = util.el('span', 'hh-native-select', color, 'Warm White');
      util.el('span', 'hh-select-arrow', colorValue, '▼');
      const brightness = util.el('div', 'hh-brightness', lights);
      util.el('span', '', brightness, 'Brightness:');
      const brightnessTrack = util.el('div', 'hh-brightness-track', brightness);
      util.el('span', 'hh-brightness-thumb', brightnessTrack);
      util.el('span', '', brightness, '70%');
      const lightButtons = util.el('div', 'hh-light-buttons', lights);
      util.el('button', '', lightButtons, 'Turn On');
      util.el('button', '', lightButtons, 'Turn Off');
      const schedule = util.el('section', 'hh-schedule', controls);
      util.el('h2', '', schedule, 'Automation Schedule');
      const scheduleList = util.el('div', 'hh-schedule-list', schedule);
      for (const line of ['6:00 AM　 Heat to 68° (Weekdays)', '8:00 AM　 Lights Off (Weekdays)',
        '6:00 PM　 Lights On (Daily)', '9:00 PM　 Heat to 65° (Daily)']) util.el('div', '', scheduleList, line);
      const scheduleButtons = util.el('div', 'hh-schedule-buttons', schedule);
      for (const label of ['Add', 'Edit', 'Delete']) util.el('button', '', scheduleButtons, label);
      const video = util.el('section', 'hh-video', lower);
      util.el('h2', '', video, '▣　Now Playing Video');
      util.el('div', 'hh-video-art', video);
      util.el('div', 'hh-video-controls', video, '▶　 0:00 / 12:34　 ━━━━━━━━━　 🔊　 ▣　 ⛶');
      util.el('strong', 'hh-video-title', video, 'Pine Lake');
      util.el('div', 'hh-video-chapter', video, 'Chapter 1 of 4: A Quiet Morning');
      const chapters = util.el('div', 'hh-chapters', video);
      for (const line of ['1.　A Quiet Morning　　　　　　 12:18', '2.　Forest Trail　　　　　　　 10:24',
        '3.　Summit View　　　　　　　 11:09', '4.　Returning Home　　　　　　　9:52']) util.el('div', '', chapters, line);
      Object.assign(_c, { brightness, brightnessTrack, chapters, color, colorValue, controls, groups, index, lightButtons, lights, lower, mode, modeValue, schedule, scheduleButtons, scheduleList, stage, target, targetInput, temp, tempAdjust, tempButtons, temperature, video, work });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['Tips', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-smart-home-playlist-04',
    template: 'site/base',
    design: { parts },
  });
})();
