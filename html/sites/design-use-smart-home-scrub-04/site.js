// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = (display !== 'header' || nav) ? rng.pick(TITLES) : null;
      const brand = util.el('div', 'ref-brand', header, 'Home & Media Console');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header, title });
    },
    'frame.instruction': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;
      const menu = util.el('nav', 'os-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Controls', 'Devices', 'Playlist', 'Schedule', 'Help']) {
        util.el('span', '', menu, item);
      }
      const toolbar = util.el('div', 'os-toolbar', document.body);
      for (const [icon, text] of [['⌂','Home'],['♫','Music'],['▤','Video'],['♧','Lights'],['♨','Climate'],['▦','Schedule']]) {
        const item = util.el('div', 'os-tool', toolbar);
        util.el('b', '', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { menu, toolbar });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const homeBand = util.el('section', 'home-band', document.body);
      const temp = util.el('section', 'home-card home-temp', homeBand);
      util.el('h2', '', temp, 'Living Room Temperature');
      const temperature = util.el('div', 'home-temp-reading', temp, '72°');
      util.el('span', 'home-temp-arrows', temperature, '⌃\n⌄');
      util.el('div', 'home-card-caption', temp, 'Target: 72°');
      const lights = util.el('section', 'home-card home-lights', homeBand);
      util.el('h2', '', lights, '☼  Living Room Lights');
      util.el('div', 'home-switch', lights, 'On');
      util.el('div', 'home-brightness', lights);
      const dots = util.el('div', 'home-color-dots', lights);
      for (const color of ['#f3e7c9','#f1c85c','#ef914a','#77bf62','#4381d1','#9b55cb']) {
        const dot = util.el('span', '', dots, '●');
        dot.style.color = color;
      }
      const schedule = util.el('section', 'home-card home-schedule', homeBand);
      util.el('h2', '', schedule, '▦  Home Schedule');
      util.el('div', 'home-list-head', schedule, 'Time　　　　 Device　　　　　　　　 Action');
      util.el('div', 'home-list', schedule, '7:00 AM　　 Living Room Lights　　 On');
      util.el('div', 'home-list', schedule, '8:00 AM　　 Thermostat　　　　　　 Set to 68°');
      util.el('div', 'home-list', schedule, '6:00 PM　　 Porch Lights　　　　　 On');
      util.el('div', 'home-list', schedule, '9:00 PM　　 Living Room Lights　　 Off');
      const music = util.el('section', 'home-card home-music', homeBand);
      util.el('h2', '', music, '♫  Music Queue (4)');
      util.el('div', 'home-list-head', music, '#　 Title　　　　　　　　　 Artist　　　　　　　　 Length');
      util.el('div', 'home-list', music, '1　 Redwood Morning　　　　 The Hollow Pines　　　 3:52');
      util.el('div', 'home-list', music, '2　 Farther Shore　　　　　　 Lantern Field　　　　　 4:18');
      util.el('div', 'home-list', music, '3　 Copper Sky　　　　　　　 The Meadowlarks　　　　 5:06');
      util.el('div', 'home-list', music, '4　 Quiet Roads　　　　　　　 Elm & Stone　　　　　　 3:40');
      const queueActions = util.el('div', 'home-queue-actions', music);
      for (const label of ['Add…', 'Remove', 'Move Up', 'Move Down']) util.el('button', '', queueActions, label);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, dots, homeBand, lights, music, queueActions, schedule, temp, temperature });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, homeBand, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      body.appendChild(homeBand);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      const { util } = _c;
      const tip = util.el('div', 'home-tip', document.body);
      util.el('strong', '', tip, 'ⓘ　 Tips');
      util.el('span', '', tip, 'Use the timeline to jump to a different part of the episode. Chapter markers show key moments. You can also change lighting, temperature, and your music queue from here.');
      Object.assign(_c, { tip });
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      const { header, util } = _c;
      const win = util.el('div', 'os-window-buttons', header);
      for (const mark of ['−', '□', '×']) util.el('span', '', win, mark);
      Object.assign(_c, { win });
    },
  };

  env.site({
    name: 'design-use-smart-home-scrub-04',
    template: 'site/base',
    design: { parts },
  });
})();
