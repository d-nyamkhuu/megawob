// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
    dark: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
    warm: { bg: '#d9e5f1', panel: '#dce8f4', fg: '#101b2d', muted: '#526477', line: '#8da5be' },
  };

  const ACCENTS = ['#1762b2', '#1762b2', '#1762b2', '#1762b2', '#1762b2', '#1762b2'];

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('ref-window-title');
        util.el('span', 'ref-app-mark', header, '▣');
        util.el('span', 'ref-window-name', header, 'Haven Home');
        S.frameBrand(_c, header);
        Object.assign(_c, { header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const quick = util.el('div', 'ref-quickbar', document.body);
        for (const [icon, title] of [
          ['⌂', 'Home'],
          ['♧', 'Devices'],
          ['▧', 'Scenes'],
          ['▦', 'Schedules'],
          ['♫', 'Media'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', 'ref-quickitem', quick);
          util.el('span', 'ref-quickicon', item, icon);
          util.el('span', '', item, title);
        }
        Object.assign(_c, { quick });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const dash = util.el('aside', 'home-dash', body);
        dash.innerHTML =
          '<section class="home-card home-status"><div class="home-card-title">Home Status</div><div class="home-stat-grid"><div><b class="stat-icon blue">♨</b><span><strong>22°C</strong><small>Indoor</small></span></div><div><b class="stat-icon amber">◉</b><span><strong>3 / 4</strong><small>Lights On</small></span></div><div><b class="stat-icon blue">◖))</b><span><strong>1 / 2</strong><small>Media Devices</small></span></div><div><b class="stat-icon green">⬟</b><span><strong>Disarmed</strong><small>Security</small></span></div></div></section><section class="home-card home-queue"><div class="home-card-title">Music Queue <small>6 tracks</small></div><div class="track playing"><i>Ⅱ</i><b class="cover sky"></b><span><strong>Morning Light</strong><small>The Northern Keys</small></span><em>3:24</em></div><div class="track"><b class="cover hill"></b><span><strong>River Road</strong><small>Helena Park</small></span><em>4:11</em></div><div class="track"><b class="cover dusk"></b><span><strong>Golden Hours</strong><small>City Fields</small></span><em>3:52</em></div><div class="track"><b class="cover sea"></b><span><strong>Back to You</strong><small>The Northern Keys</small></span><em>4:20</em></div><div class="track"><b class="cover blue"></b><span><strong>Clear Skies</strong><small>Indigo Lane</small></span><em>3:17</em></div><div class="track"><b class="cover night"></b><span><strong>First Snow</strong><small>Maple Harbor</small></span><em>5:08</em></div></section><section class="home-card home-video"><div class="home-card-title">Video</div><div class="video-row"><div class="video-art"><span>▶</span><i></i></div><div class="video-meta"><strong>A Quiet Place</strong><small>S1 E3&nbsp;&nbsp; The Lakes</small><small>12:06 / 28:15</small><div class="video-controls"><span class="video-progress"><i></i></span><b>CC</b><b>⛶</b></div></div></div></section>';
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, dash });
      },
  };

  env.site({
    name: 'design-use-smart-home-scene-02',
    template: 'site/base',
    design: { THEMES, ACCENTS, parts },
  });
})();
