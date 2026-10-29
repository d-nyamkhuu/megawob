// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.lang': (base, S) =>
      function (_c) {
        const { ctx, rng, util } = _c;
        // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const lr = rng.fork('chrome/lang');
        const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
        const closeLabel = word ? word('close') : 'Close';

        // Native desktop frame for the 2008 Hearth & Home console design.
        const frame = util.el('div', 'hh-frame', document.body);
        const titlebar = util.el('div', 'hh-titlebar', frame);
        const house = util.el('span', 'hh-home-icon', titlebar);
        house.innerHTML =
          '<svg viewBox="0 0 80 76" aria-hidden="true"><path d="M13 31v36q0 5 5 5h45q5 0 5-5V31L41 10Z" fill="#fff" stroke="#cccace" stroke-width="2"/><path d="M32 72V52a9 9 0 0 1 18 0v20" fill="#303951"/><path d="M9 34 41 9l31 25" fill="none" stroke="#ff686c" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="M59 22V15" stroke="#ff686c" stroke-width="12" stroke-linecap="round"/></svg>';
        util.el('span', 'hh-title', titlebar, 'Nest and Note');
        util.el('span', 'hh-window-buttons', titlebar, '−　□　×');
        const squiggle = util.el('span', 'hh-squiggle', frame);
        squiggle.innerHTML =
          '<svg viewBox="0 0 90 36" aria-hidden="true"><path d="M5 9q12 20 25 2t27 9 26 7" fill="none" stroke="#a28af0" stroke-width="8"/></svg>';
        const menu = util.el('div', 'hh-menu', frame);
        for (const label of ['File', 'Edit', 'View', 'Controls', 'Tools', 'Help']) util.el('span', '', menu, label);
        const ribbon = util.el('div', 'hh-ribbon', frame);
        for (const [icon, label] of [
          ['⌂', 'Home'],
          ['♫', 'Music'],
          ['▣', 'Video'],
          ['▦', 'Schedule'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', 'hh-ribbon-item', ribbon);
          util.el('span', 'hh-ribbon-icon', item, icon);
          util.el('span', '', item, label);
        }
        Object.assign(_c, { closeLabel, frame, house, local, lr, menu, ribbon, squiggle, titlebar, word });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('hh-note-row');
        S.frameBrand(_c, header);
        Object.assign(_c, { header });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        let panelNote = null;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          panelNote = panel;
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        Object.assign(_c, { panelNote });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, panelNote, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // The console's persistent room/media index and the two home-monitor panels.
        // These are presentation-only; the playlist widget retains all task controls.
        const index = util.el('aside', 'hh-index', body);
        const groups = [
          ['⌂', 'Rooms', ['⌂', 'Living Room', '⌂', 'Kitchen', '♙', 'Bedroom', '⌂', 'Office', '⌂', 'Patio']],
          ['♟', 'Devices', ['♨', 'Thermostat', '☀', 'Lights', '◉', 'Speakers', '▣', 'TV']],
          ['♫', 'Media', ['♫', 'Now Playing', '☷', 'Music Queue', '▣', 'Video', '▧', 'Photos']],
          ['◷', 'Automation', ['▦', 'Schedules', '★', 'Scenes', '⚙', 'Rules']],
        ];
        for (const [symbol, title, entries] of groups) {
          const group = util.el('section', 'hh-navgroup', index);
          util.el('div', 'hh-navheading', group, `${symbol}　${title}`);
          for (let i = 0; i < entries.length; i += 2) {
            const link = util.el(
              'div',
              `hh-navitem${title === 'Media' && entries[i + 1] === 'Music Queue' ? ' selected' : ''}`,
              group,
            );
            util.el('span', 'hh-navicon', link, entries[i]);
            util.el('span', '', link, entries[i + 1]);
          }
        }
        const work = util.el('div', 'hh-workarea', body);
        work.appendChild(stage);
        const lower = util.el('div', 'hh-lower', work);
        const controls = util.el('section', 'hh-home-controls', lower);
        util.el('h2', '', controls, 'Home Controls');
        const temperature = util.el('div', 'hh-control-content', controls);
        const temp = util.el('div', 'hh-temperature', temperature);
        const tempLabel = util.el('div', 'hh-control-label', temp);
        tempLabel.innerHTML =
          '<svg class="hh-thermometer" viewBox="0 0 32 60" aria-hidden="true"><path d="M10 37V11a6 6 0 0 1 12 0v26a12 12 0 1 1-12 0Z" fill="#fff" stroke="#ff686c" stroke-width="4"/><path d="M16 18v25" stroke="#ff686c" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="46" r="5" fill="#ff686c"/></svg><span>Living Room</span>';
        util.el('div', 'hh-temp-line', temp, '72°');
        const tempButtons = util.el('div', 'hh-target', temp);
        util.el('span', '', tempButtons, '−');
        util.el('span', '', tempButtons, '+');
        const lights = util.el('div', 'hh-light-controls', temperature);
        const lightLabel = util.el('div', 'hh-control-label', lights);
        lightLabel.innerHTML =
          '<svg class="hh-bulb" viewBox="0 0 42 62" aria-hidden="true"><path d="M12 45c0-11-9-12-9-24a18 18 0 0 1 36 0c0 12-9 13-9 24" fill="#fffdf5" stroke="#ffc24d" stroke-width="4"/><path d="m13 27 8 9 8-9M21 35v12" fill="none" stroke="#ffc24d" stroke-width="2"/><path d="M13 47h16v8H13z" fill="#667a8c"/><path d="M17 58h8" stroke="#667a8c" stroke-width="4"/></svg><span>Living Room Lights</span>';
        const swatches = util.el('div', 'hh-lights-row', lights);
        for (const color of ['#ffcf57', '#ff787c', '#8779ff', '#6bcbb5']) {
          const swatch = util.el('span', '', swatches);
          swatch.style.background = color;
        }
        const lightBottom = util.el('div', 'hh-lights-bottom', lights);
        util.el('span', '', lightBottom, '☼');
        util.el('span', 'hh-light-track', lightBottom);
        if (panelNote) lower.appendChild(panelNote);
        const schedule = util.el('section', 'hh-schedule', lower);
        const scheduleHead = util.el('div', 'hh-schedule-head', schedule);
        util.el('strong', '', scheduleHead, 'Schedule');
        util.el('span', '', scheduleHead, 'See All');
        for (const [icon, time, action, value] of [
          ['☼', '7:00 AM', 'Bedroom Lights', 'On'],
          ['♨', '8:00 AM', 'Set Living Room', '70°'],
          ['☾', '10:00 PM', 'All Lights', 'Off'],
        ]) {
          const row = util.el('div', 'hh-schedule-row', schedule);
          util.el('span', 'hh-schedule-icon', row, icon);
          util.el('span', '', row, time);
          util.el('span', 'hh-schedule-action', row, action);
          util.el('span', '', row, value);
          util.el('span', `hh-schedule-toggle${value === 'Off' ? ' off' : ''}`, row);
        }
        const video = util.el('section', 'hh-video', lower);
        util.el('h2', '', video, 'Video');
        util.el('div', 'hh-video-art', video);
        const videoMeta = util.el('div', 'hh-video-meta', video);
        util.el('strong', '', videoMeta, 'Coastline');
        util.el('span', '', videoMeta, 'S1 E2 – A Wider View');
        util.el('span', 'hh-video-settings', videoMeta, '⚙');
        const timeline = util.el('div', 'hh-video-controls', video);
        util.el('div', 'hh-video-track', timeline);
        const times = util.el('div', 'hh-video-times', timeline);
        util.el('span', '', times, '12:14');
        util.el('span', '', times, '28:05');
        Object.assign(_c, {
          controls,
          groups,
          index,
          lightBottom,
          lightLabel,
          lights,
          lower,
          schedule,
          scheduleHead,
          stage,
          swatches,
          temp,
          tempButtons,
          tempLabel,
          temperature,
          timeline,
          times,
          video,
          videoMeta,
          work,
        });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const dock = util.el('nav', 'hh-dock', document.body);
        for (const [icon, label] of [
          ['◆', 'Home'],
          ['♫', 'Music'],
          ['▶', 'Video'],
          ['▦', 'Schedule'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', 'hh-dock-item', dock);
          const dockIcon = util.el('span', 'hh-dock-icon', item, icon);
          if (label === 'Home')
            dockIcon.innerHTML =
              '<svg viewBox="0 0 38 38" aria-hidden="true"><path d="m3 16 16-13 16 13v20H24V24H14v12H3Z" fill="currentColor"/></svg>';
          util.el('span', '', item, label);
        }
        Object.assign(_c, { dock, submit });
      },
  };

  env.site({
    name: 'design-use-smart-home-playlist-02',
    template: 'site/base',
    design: { parts },
  });
})();
