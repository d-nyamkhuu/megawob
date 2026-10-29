// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = (display !== 'header' || nav) ? rng.pick(TITLES) : null;
      const brand = util.el('div', 'ref-brand', header, 'HomeNest');
      brand.dataset.role = 'brand';
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav); // preserve the original draws
      }
      const n = header.querySelector('.ref-nav') || util.el('nav', 'ref-nav', header);
      for (const item of ['Home', 'Lights', 'Climate', 'Schedule', 'Music', 'Video']) {
        const a = util.el('a', 'ref-navlink', n, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const search = util.el('span', 'ref-search', header, '⌕');
      search.setAttribute('aria-hidden', 'true');
      const avatar = util.el('span', 'ref-avatar', header, 'A');
      avatar.setAttribute('aria-hidden', 'true');
      Object.assign(_c, { avatar, brand, header, n, search, title });
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
      const devices = util.el('section', 'home-card home-devices', homeBand);
      const devicesHead = util.el('div', 'home-devices-head', devices);
      util.el('strong', '', devicesHead, 'Devices');
      util.el('a', '', devicesHead, 'See all');
      for (const [icon, label, state] of [['♙', 'Ceiling Light', 'On'], ['♟', 'Floor Lamp', 'On'],
        ['♨', 'Thermostat', '72° · Heating'], ['▣', 'TV', 'On · HDMI 1'], ['▤', 'Media Console', 'On']]) {
        const row = util.el('div', 'home-device-row', devices);
        util.el('span', 'home-device-icon', row, icon);
        util.el('span', 'home-device-name', row, label);
        util.el('span', 'home-device-state', row, state);
        util.el('span', 'home-device-arrow', row, '›');
      }
      const schedule = util.el('section', 'home-card home-schedule', homeBand);
      util.el('h2', '', schedule, '▦  Home Schedule');
      util.el('div', 'home-list', schedule, '6:00 AM　 Morning Lights　 On');
      util.el('div', 'home-list', schedule, '8:00 AM　 Heat　　　　 70°');
      util.el('div', 'home-list', schedule, '6:00 PM　 Living Room Lights　 On');
      util.el('div', 'home-list', schedule, '10:00 PM　 All Lights　 Off');
      const music = util.el('section', 'home-card home-music', homeBand);
      util.el('h2', '', music, '♫  Music Queue');
      util.el('div', 'home-list', music, '1　 Sunlit Terrace　　　　　 3:24');
      util.el('div', 'home-list', music, '2　 Harbor View　　　　　　 4:01');
      util.el('div', 'home-list', music, '3　 Cedar Trail　　　　　　　 3:52');
      util.el('div', 'home-list', music, '4　 Evening Waves　　　　　4:28');
      body.before(homeBand);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, devices, devicesHead, dots, homeBand, lights, music, schedule, temp, temperature });
    },
    'frame.toast': (base, S) => function (_c) {
      const { closeLabel, ctx, display, util } = _c;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
      const tip = util.el('div', 'home-tip', document.body);
      util.el('strong', '', tip, 'ⓘ　 Tips');
      util.el('span', '', tip, 'Use the timeline to jump to a different part of the episode. Chapter markers show key moments. You can also change lighting, temperature, and your music queue from here.');
      Object.assign(_c, { tip });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-smart-home-scrub-03',
    template: 'site/base',
    design: { parts },
  });
})();
