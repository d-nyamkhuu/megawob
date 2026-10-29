// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  // Small shaded workstation icons, shared by the editor and properties pane.
  window.homeDeviceIcon = (parent, kind) => {
    const svg = env.util.svg('svg', { viewBox: '0 0 28 32', class: 'hm-device-icon', 'aria-hidden': 'true' }, parent);
    const add = (tag, attrs) => env.util.svg(tag, attrs, svg);
    const path = (d, fill = '#c4c3b8') => add('path', { d, fill, stroke: '#171713', 'stroke-width': 1.6, 'stroke-linejoin': 'round' });
    if (kind === 'lamp') {
      path('M10 3H18L24 20H4Z', '#747570');
      path('M14 20V28M9 29H19L17 26H11Z', '#444641');
      add('path', { d: 'M11 5 8 17', stroke: '#bdbdb5', 'stroke-width': 2 });
    } else if (kind === 'speaker') {
      path('M4 11H9L17 5V28L9 22H4Z', '#c2c2b9');
      path('M17 7V26L20 24V9Z', '#6d6e67');
      add('path', { d: 'M22 10Q28 16 22 23M21 13Q24 16 21 20', fill: 'none', stroke: '#22231f', 'stroke-width': 1.6 });
    } else if (kind === 'lantern') {
      path('M12 3H16V7L21 13 18 24H10L7 13 12 7Z', '#b4b5a9');
      path('M10 14H18L16 24H12Z', '#ead69d');
      path('M9 11H19M10 24H18L16 29H12Z', '#60615b');
    } else {
      path('M10 22C10 18 5 16 5 10C5-1 23-1 23 10C23 16 18 18 18 22Z', '#e9dfb6');
      add('path', { d: 'M9 12Q7 5 14 4', stroke: '#fffbea', 'stroke-width': 3, fill: 'none' });
      path('M10 22H18V28L16 31H12L10 28Z', '#696b61');
      add('path', { d: 'M11 24H17M11 27H17', stroke: '#24251f', 'stroke-width': 1.4 });
    }
    return svg;
  };

  const THEMES = {
    light: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
    dark: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
    warm: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
  };

  const ACCENTS = ['#1762b2', '#1762b2', '#1762b2', '#1762b2', '#1762b2', '#1762b2'];

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('ref-window-title');
      util.el('span', 'ref-app-mark', header, '▧');
      util.el('span', 'ref-window-name', header, 'Home & Media Console');
      const windowControls = util.el('div', 'hm-window-controls', header);
      for (const glyph of ['−', '□', '×']) util.el('span', '', windowControls, glyph);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, windowControls });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const menu = util.el('nav', 'ref-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Controls', 'Help']) util.el('span', 'ref-menuitem', menu, item);
      const quick = util.el('div', 'ref-quickbar', document.body);
      for (const [icon, title] of [['', 'Home'], ['', 'Lighting'], ['', 'Media'], ['', 'Schedules'], ['', 'Scenes']]) {
        const item = util.el('div', 'ref-quickitem', quick);
        util.el('span', 'ref-quickicon', item, icon);
        util.el('span', '', item, title);
      }
      Object.assign(_c, { menu, quick });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const room = util.el('aside', 'hm-side hm-room', body);
      util.el('div', 'hm-panel-title', room, 'Home Status');
      const temp = util.el('div', 'hm-temperature', room);
      util.el('div', '', temp, 'Indoor Temperature');
      util.el('strong', '', temp, '21°C');
      util.el('div', 'hm-slider', temp);
      util.el('div', 'hm-subtitle', room, 'Rooms');
      const rooms = util.el('div', 'hm-room-list', room);
      for (const [n, t] of [['Living Room','21°C'],['Bedroom','19°C'],['Kitchen','20°C'],['Hall','18°C']]) {
        const row = util.el('div', 'hm-room-row', rooms); util.el('span', '', row, n); util.el('span', '', row, t);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, room, rooms, temp });
    },
    'frame.panel': (base, S) => function (_c) {
      const { body, ctx, display, lr, rng, room, util, word } = _c;
      const { K } = S;
      if (display === 'panel') {
        body.classList.add('ref-instruction-panel');
        const panel = util.el('aside', 'ref-panel', room);
        room.prepend(panel);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const media = util.el('aside', 'hm-media', body);
      const musicPanel = util.el('section', 'hm-side hm-music-panel', media);
      util.el('div', 'hm-panel-title', musicPanel, 'Music Queue');
      const queue = util.el('div', 'hm-queue', musicPanel);
      for (const [i,n,d] of [[1,'Northern Fields','4:12'],[2,'Amber Coast','3:58'],[3,'Quiet Hours','5:11'],[4,'Paper Moon','4:06'],[5,'Maple Sun','3:47'],[6,'Between Walls','4:20'],[7,'Late Return','5:03'],[8,'Harbor Light','3:36']]) {
        const row = util.el('div', `hm-track${i===1?' selected':''}`, queue); util.el('span', '', row, String(i)); util.el('span', '', row, n); util.el('span', '', row, d);
      }
      const transport = (parent, paths) => {
        const row = util.el('div', 'hm-transport', parent);
        for (const d of paths) {
          const key = util.el('span', 'hm-transport-key', row);
          const svg = env.util.svg('svg', { viewBox:'0 0 28 24', width:28, height:24, 'aria-hidden':'true' }, key);
          env.util.svg('path', { d, fill:'#090a08' }, svg);
        }
      };
      transport(musicPanel, ['M3 5H6V19H3ZM15 5V19L6 12ZM24 5V19L15 12Z', 'M8 3 23 12 8 21Z', 'M7 5H21V19H7Z', 'M4 5 13 12 4 19ZM13 5 22 12 13 19ZM22 5H25V19H22Z']);
      const videoPanel = util.el('section', 'hm-side hm-video-panel', media);
      util.el('div', 'hm-panel-title hm-video-title', videoPanel, 'Video Player');
      util.el('div', 'hm-video-still', videoPanel);
      util.el('div', 'hm-video-progress', videoPanel);
      util.el('div', 'hm-video-time', videoPanel, '0:16:24　/　1:42:10');
      transport(videoPanel, ['M20 3 5 12 20 21Z', 'M8 3 23 12 8 21Z', 'M8 3 23 12 8 21Z', 'M3 3H25V21H3ZM6 6V18H22V6Z']);
      const inspector = util.el('section', 'hm-inspector', body);
      util.el('div', 'hm-panel-title', inspector, 'Device Properties');
      const detail = util.el('div', 'hm-inspector-content', inspector);
      const deviceList = util.el('div', 'hm-device-list', detail);
      for (const [icon, label] of [['bulb','Ceiling light'],['lamp','Reading lamp'],['speaker','Media speaker'],['lantern','Hall light']]) {
        const row = util.el('div', 'hm-inspector-row', deviceList);
        window.homeDeviceIcon(row, icon);
        util.el('span', '', row, label);
      }
      const deviceDetail = util.el('div', 'hm-device-detail', detail);
      const selected = util.el('div', 'hm-detail-device', deviceDetail);
      window.homeDeviceIcon(selected, 'bulb');
      util.el('span', '', selected, '　Ceiling light');
      const properties = util.el('div', 'hm-properties', deviceDetail);
      const leftProperties = util.el('div', 'hm-properties-left', properties);
      const property = (parent, label, text, cls = '') => {
        const row = util.el('div', 'hm-detail-line', parent);
        util.el('span', 'hm-property-label', row, label);
        return util.el('span', cls, row, text);
      };
      property(leftProperties, 'Location:', 'Living Room', 'hm-combo');
      property(leftProperties, 'Type:', 'Dimmable Bulb');
      property(leftProperties, 'Current state:', 'On (70%)');
      const rightProperties = util.el('div', 'hm-properties-right', properties);
      const brightness = property(rightProperties, 'Brightness:', '', 'hm-brightness');
      util.el('span', 'hm-brightness-value', brightness, '70%');
      property(rightProperties, 'Color:', 'Warm White', 'hm-combo');
      S.frameAlign(_c, stage);
      Object.assign(_c, { brightness, detail, deviceDetail, deviceList, inspector, leftProperties, media, musicPanel, properties, property, queue, rightProperties, selected, stage, transport, videoPanel });
    },
  };

  env.site({
    name: 'design-use-smart-home-scene-04',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
