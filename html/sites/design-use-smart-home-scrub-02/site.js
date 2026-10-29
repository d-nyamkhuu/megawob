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
      util.el('div', 'home-list', music, '5　 Northern Light　　　　　 5:18');
      body.before(homeBand);
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, dots, homeBand, lights, music, schedule, temp, temperature });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      const library = util.el('aside', 'home-library', body);
      util.el('div', 'home-library-title', library, 'Media Library');
      const media = [
        ['The Glacier Trail','1 hr 28 min','#6c9bb2'], ['City Lights','1 hr 42 min','#b45b75'],
        ['Ocean Deep','52 min','#1689a5'], ['The Remembered','2 hr 6 min','#8b7351'],
        ['Northern Skies','1 hr 18 min','#254e78'], ['A Taste of Home','46 min','#cd7838'],
        ['Parallel Worlds','1 hr 55 min','#4a6792'], ['The Last Horizon','2 hr 14 min','#cc744d'],
      ];
      for (const [title, length, color] of media) {
        const row = util.el('div', 'home-library-row', library);
        row.style.setProperty('--thumb', color);
        util.el('span', 'home-library-thumb', row);
        const copy = util.el('span', 'home-library-copy', row);
        util.el('span', 'home-library-name', copy, title);
        util.el('span', 'home-library-length', copy, length);
      }
      Object.assign(_c, { library, media });
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
    name: 'design-use-smart-home-scrub-02',
    template: 'site/base',
    design: { parts },
  });
})();
