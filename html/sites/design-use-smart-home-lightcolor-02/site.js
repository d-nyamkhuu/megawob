// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        rng.pick(Object.keys(THEMES));
        let name = 'light';
        const root = document.documentElement;
        rng.pick(ACCENTS);
        let accent = '#0878ee';
        const tr = rng.fork('chrome/theme');
        tr.bool(0.08);
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appnav = util.el('div', 'home-topnav', header);
        util.el('strong', 'home-wordmark', appnav, '⌂  HOMENEST');
        const tabs = util.el('nav', 'home-tabs', appnav);
        for (const [icon, text] of [
          ['⌂', 'Home'],
          ['♟', 'Lights'],
          ['♧', 'Climate'],
          ['▶', 'Media'],
          ['▦', 'Automations'],
        ]) {
          const tab = util.el('div', text === 'Home' ? 'home-tab active' : 'home-tab', tabs);
          util.el('span', '', tab, icon);
          util.el('span', '', tab, text);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { appnav, header, tabs });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rooms = util.el('aside', 'home-rooms', body);
        util.el('div', 'home-rooms-heading', rooms, 'ROOMS');
        for (const [icon, room, state, temp] of [
          ['▰', 'Kitchen', 'Light on', '72°'],
          ['▰', 'Living Room', 'Light on', '70°'],
          ['▰', 'Bedroom', 'Light off', '68°'],
          ['▣', 'Office', 'Light on', '71°'],
          ['▰', 'Guest Room', 'Light off', '69°'],
          ['◧', 'Hallway', 'Light on', '70°'],
          ['▱', 'Bathroom', 'Light on', '71°'],
          ['♧', 'Patio', 'Light off', '66°'],
        ]) {
          const row = util.el('div', room === 'Kitchen' ? 'home-room selected' : 'home-room', rooms);
          util.el('span', 'home-room-icon', row, icon);
          const copy = util.el('span', 'home-room-copy', row);
          util.el('b', '', copy, room);
          util.el('small', '', copy, `${state}  •  ${temp}`);
          util.el('span', 'home-room-arrow', row, '›');
        }
        const status = util.el('aside', 'home-status', body);
        util.el('strong', 'home-status-title', status, 'Home Status');
        util.el('div', 'home-online', status, '●  All Systems Online');
        for (const [icon, count, label] of [
          ['♧', '4', 'Lights On'],
          ['♙', '3', 'Rooms'],
          ['▷', '1', 'Media Active'],
          ['▦', '2', 'Schedules'],
        ]) {
          const row = util.el('div', 'home-count', status);
          util.el('span', 'home-count-icon', row, icon);
          const val = util.el('span', 'home-count-value', row);
          util.el('b', '', val, count);
          util.el('small', '', val, label);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rooms, status });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const stageHeading = util.el('div', 'home-stage-heading', body);
        util.el('strong', '', stageHeading, 'KITCHEN');
        util.el('span', '', stageHeading, 'Ceiling Light');
        const currentLight = util.el('section', 'home-current-light', body);
        util.el('h2', '', currentLight, 'CURRENT LIGHT');
        for (const [icon, label, value] of [
          ['♟', 'Model', 'NestBeam A19'],
          ['⌁', 'Connected', 'Online'],
          ['◢', 'Type', 'Smart LED Bulb'],
          ['⌂', 'Room', 'Kitchen'],
        ]) {
          const row = util.el('div', 'home-current-row', currentLight);
          util.el('span', 'home-current-icon', row, icon);
          util.el('span', 'home-current-label', row, label);
          util.el('b', '', row, value);
        }
        S.frameAlign(_c, stage);
        const summary = util.el('aside', 'home-summary', body);
        const conditions = util.el('section', 'home-summary-card', summary);
        util.el('div', 'home-summary-title', conditions, '♙  Room Conditions');
        util.el('div', 'home-summary-row', conditions, 'Temperature                 20.5 °C');
        util.el('div', 'home-summary-row', conditions, 'Humidity                         45%');
        util.el('div', 'home-summary-row', conditions, 'Air Quality                     Good');
        const activity = util.el('section', 'home-summary-card home-activity', summary, '▮  Today’s Activity');
        util.el('div', 'home-summary-row', activity, 'Lights On                          4 / 8');
        util.el('div', 'home-summary-row', activity, 'Rooms Online                   3 / 3');
        util.el('div', 'home-summary-row', activity, 'Media Active                    1 / 2');
        util.el('div', 'home-summary-row', activity, 'Schedules                        2 / 4');
        const roominfo = util.el('aside', 'home-roominfo', body);
        util.el('div', 'home-rooms-heading', roominfo, 'ROOM INFO');
        for (const [icon, label, value] of [
          ['♙', 'Temperature', '72°'],
          ['♢', 'Humidity', '45%'],
          ['ϟ', 'Light Power Draw', '9 W'],
        ]) {
          const row = util.el('div', 'home-info-row', roominfo);
          util.el('span', 'home-info-icon', row, icon);
          util.el('span', 'home-info-label', row, label);
          util.el('b', '', row, value);
        }
        const dashboard = util.el('section', 'home-dashboard', body);
        const media = util.el('article', 'home-dash-card home-media-card', dashboard);
        util.el('h2', '', media, 'MEDIA');
        util.el('div', 'home-dash-title', media, 'Moonriver');
        util.el('div', 'home-dash-sub', media, 'The Skytellers  ·  Riverside');
        util.el('div', 'home-media-time', media, '1:24                                      4:08');
        util.el('div', 'home-dash-progress', media);
        util.el('div', 'home-dash-controls', media, '⤨      ◀      ●      ▶      ⟳');
        const video = util.el('article', 'home-dash-card home-video-card', dashboard);
        util.el('h2', '', video, 'VIDEO');
        util.el('div', 'home-dash-title', video, 'The Last Horizon');
        util.el('div', 'home-dash-sub', video, 'S1 E3   Raven Pass');
        util.el('div', 'home-video-time', video, '▶     12:17 / 42:06');
        util.el('div', 'home-dash-progress', video);
        const automations = util.el('article', 'home-dash-card home-auto-card', dashboard);
        util.el('h2', '', automations, 'AUTOMATIONS');
        for (const [icon, text, desc] of [
          ['☼', 'Morning Lights', 'Every day, 6:00 AM'],
          ['☾', 'Evening Lights', 'Every day, 8:00 PM'],
          ['◆', 'Away Mode', "When everyone's away"],
          ['◷', 'Night Dim', 'Every day, 11:00 PM'],
        ]) {
          const row = util.el('div', 'home-auto-row', automations);
          util.el('span', '', row, icon);
          const copy = util.el('span', '', row);
          util.el('b', '', copy, text);
          util.el('small', '', copy, desc);
          util.el('i', text === 'Away Mode' ? 'off' : '', row);
        }
        Object.assign(_c, {
          activity,
          automations,
          conditions,
          currentLight,
          dashboard,
          media,
          roominfo,
          stage,
          stageHeading,
          summary,
          video,
        });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        const dock = util.el('nav', 'home-dock', document.body);
        for (const [icon, text] of [
          ['◆', 'Home'],
          ['♧', 'Lights'],
          ['♙', 'Climate'],
          ['♫', 'Media'],
          ['▦', 'Schedule'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', text === 'Home' ? 'home-dock-item active' : 'home-dock-item', dock);
          util.el('span', 'home-dock-icon', item, icon);
          util.el('span', '', item, text);
        }
        Object.assign(_c, { dock, submit });
      },
  };

  env.site({
    name: 'design-use-smart-home-lightcolor-02',
    template: 'site/base',
    design: { parts },
  });
})();
