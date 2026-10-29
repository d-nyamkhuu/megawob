// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = (display !== 'header' || nav) ? rng.pick(TITLES) : null;
      const brand = util.el('div', 'ref-brand', header, 'HomeHub');
      util.el('span', 'ref-sub', header, 'Your Home and Media Console');
      brand.dataset.role = 'brand';
      Object.assign(_c, { brand, header, title });
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
      const dock = util.el('nav', 'ref-dock', document.body);
      const svg = body => `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
      const ink = '#1f3f8f';
      const icons = [
        svg(`<path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" fill="none" stroke="${ink}" stroke-width="2"/>`),
        svg(`<rect x="9" y="2" width="6" height="14" rx="3" fill="#fff" stroke="#b22" stroke-width="2"/><circle cx="12" cy="18" r="4" fill="#c22"/>`),
        svg(`<circle cx="12" cy="9" r="7" fill="#f2d33c" stroke="#333" stroke-width="1.5"/><rect x="9" y="16" width="6" height="4" fill="#666"/>`),
        svg(`<rect x="3" y="4" width="18" height="17" fill="#fff" stroke="${ink}" stroke-width="2"/><rect x="3" y="4" width="18" height="5" fill="${ink}"/>`),
        svg(`<path d="M9 18V5l11-2v13" fill="none" stroke="${ink}" stroke-width="2"/><circle cx="6" cy="18" r="3" fill="${ink}"/><circle cx="17" cy="16" r="3" fill="${ink}"/>`),
        svg(`<rect x="3" y="3" width="18" height="18" fill="#222"/><rect x="6" y="6" width="12" height="12" fill="#9ab"/>`),
      ];
      for (const [i, [icon, label, on]] of [[0, [icons[0], 'Home']], [1, [icons[1], 'Climate']], [2, [icons[2], 'Lighting']], [3, [icons[3], 'Schedules']], [4, [icons[4], 'Music']], [5, [icons[5], 'Videos', true]]]) {
        const item = util.el('span', 'ref-dock-item' + (on ? ' on' : ''), dock);
        util.el('span', 'ref-dock-icon', item).innerHTML = icon;
        util.el('span', 'ref-dock-label', item, label);
      }
      Object.assign(_c, { body, dock, dots, homeBand, lights, music, schedule, temp, temperature });
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
  };

  env.site({
    name: 'design-use-smart-home-scrub-05',
    template: 'site/base',
    design: { parts },
  });
})();
