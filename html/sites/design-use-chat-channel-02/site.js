// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-header-note', display === 'header');

      // Drafting application frame surrounding the floating team-chat window.
      const cad = util.el('div', 'cad-shell', document.body);
      const drawing = util.el('div', 'cad-drawing', cad);
      drawing.setAttribute('aria-hidden', 'true');
      drawing.innerHTML = `<svg viewBox="0 0 1392 790" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#45c9df" stroke-width="1.25" opacity=".86">
          <path d="M620 128H1038V188H1322V602H1184V700H714V646H620Z"/>
          <path d="M638 145H1018V205H1302V584H1166V682H732V630H638Z" stroke-width="2.2"/>
          <path d="M1020 145V306H1302M1166 306V584M1018 306H1166M732 470H1018V630M638 470H732M890 306V470M890 470V630"/>
          <path d="M638 220H786V306H638M786 220V306M1018 205H1166V306M1166 205V306"/>
          <path d="M732 145V220M786 145V220M890 145V220M944 145V220M732 220H944"/>
          <path d="M638 360H890M638 420H890M890 360H1018"/>
          <path d="M1166 384H1302M1166 450H1302M1166 516H1302"/>
          <path d="M1018 470H1102V584M1018 522H1102M1102 522H1166"/>
          <path d="M732 470V520M782 470V520M832 470V520M782 520H832"/>
          <path d="M920 520H1018M920 520V630M920 574H1018"/>
          <path d="M638 306h30m-30 8h30m-30 8h30M1302 330h-26m26 8h-26m26 8h-26" stroke-width=".8"/>
          <path d="M668 306a30 30 0 0 1-30 30M1018 220a42 42 0 0 1 42 42M1166 384a34 34 0 0 0 34 34M890 470a38 38 0 0 1 38 38M732 520a34 34 0 0 0 34 34M1102 584a36 36 0 0 1 36 36"/>
          <path d="M690 252h48v30h-48zM700 262h28M700 272h28M804 240h62v42h-62zM814 250h42v22h-42z"/>
          <path d="M670 374h92v30h-92zM682 384h20v10h-20zM710 384h42M682 396h68"/>
          <path d="M792 376h72v30h-72zM804 386h48M804 396h36"/>
          <path d="M1190 232h88v42h-88zM1200 242h34v22h-34zM1240 242h28v22h-28z"/>
          <path d="M1190 326h88v40h-88zM1200 336h66M1200 348h50M1200 358h36"/>
          <path d="M1190 468h86v28h-86zM1198 476h30v12h-30zM1236 476h32"/>
          <path d="M1050 344h74v88h-74zM1060 354h54v68h-54zM1072 366h30v44h-30z"/>
          <path d="M1180 214h108v78h-108zM1190 224h44v28h-44zM1244 224h34v28h-34zM1190 260h88v22h-88z" stroke-width=".85"/>
          <path d="M1196 230v16m6-16v16m6-16v16m6-16v16M1250 230v16m6-16v16m6-16v16m6-16v16" stroke-width=".65"/>
          <path d="M1180 316h108v42h-108zM1188 322h44v30h-44zM1238 322h42v30h-42zM1194 328h32m-32 8h24m-24 8h30M1244 328h30m-30 8h26m-26 8h32" stroke-width=".8"/>
          <path d="M1180 390h108v58h-108zM1190 398h40v42h-40zM1238 398h40v42h-40zM1198 406h24v26h-24zM1246 406h24v26h-24z" stroke-width=".85"/>
          <path d="M1190 466h22m6 0h22m6 0h22M1190 502h22m6 0h22m6 0h22M1180 458v52m108-52v52" stroke-width=".75"/>
          <path d="M1292 214a24 24 0 0 1 24 24M1292 316a22 22 0 0 0 22 22M1292 390a28 28 0 0 1 28 28M1150 520h26v50h-26zM1156 526h14v38h-14z" stroke-width="1"/>
          <path d="M1200 530h74m-74 8h74m-74 8h74m-74 8h74m-74 8h74m-68-32v38m18-38v38m18-38v38m18-38v38" stroke-width=".65"/>
          <path d="M1178 216l4 4m0-4-4 4M1286 286l4 4m0-4-4 4M1178 392l4 4m0-4-4 4" stroke="#efc927" stroke-width="1.4"/>
          <path d="M756 548h116v54H756zM768 558h92v34h-92zM782 572h64"/>
          <path d="M950 536h44v26h-44zM950 570h44v26h-44zM960 544v10m0 24v10"/>
          <path d="M956 220h38v56h-38zM966 230h18v36h-18zM838 154h36v44h-36z"/>
          <path d="M684 646v30m8-30v30m-16-15h24M1068 602v28m8-28v28m-16-14h24" stroke-width=".8"/>
          <path d="M620 112V80M1322 112V80M620 91H1322M620 86l10 5-10 5m702-10-10 5 10 5" stroke="#efc927" stroke-width="1"/>
          <path d="M1342 188h28m-28 414h28m-14-414v414M710 700v28m474-28v28m-474-14h474" stroke="#efc927" stroke-width="1"/>
          <path d="M646 146l-7 7m15-7-7 7M1298 589l-7 7m15-7-7 7" stroke="#efc927" stroke-width="2"/>
        </g>
        <g fill="#43d4e8" font-family="monospace" font-size="13" opacity=".94">
          <text x="1184" y="414">OPEN OFFICE</text><text x="1215" y="432">202</text>
          <text x="936" y="675">CONFERENCE</text><text x="972" y="694">201</text>
          <text x="662" y="342">STORAGE</text><text x="1194" y="306">WORK AREA</text>
        </g>
        <g fill="#f1ce27" font-family="monospace" font-size="12">
          <text x="941" y="83">9600</text><text x="1350" y="410" transform="rotate(90 1350 410)">7200</text>
          <text x="884" y="721">6000</text><text x="1153" y="721">4800</text>
        </g>
      </svg>`;
      util.el('div', 'cad-titlebar', cad, 'VectorDraft Pro 2014  -  Studio Tower - Floor 2 Plan.dwg');
      util.el('div', 'cad-menubar', cad, 'File　 Edit　 View　 Insert　 Format　 Tools　 Draw　 Dimension　 Modify　 Parametric　 Window　 Help');
      util.el('div', 'cad-toolbar', cad, '▣　▱　▣　▧　│　↶　↷　│　▦　▤　▥　▦　│　□　— ByLayer　　Continuous　　0.25 mm　│　＋　⌖');
      const ribbon = util.el('div', 'cad-ribbon', cad);
      for (const tab of ['Home', 'Draw', 'Annotate', 'Modify', 'Analyze', 'View', 'Manage', 'Team']) {
        util.el('span', tab === 'Team' ? 'cad-tab selected' : 'cad-tab', ribbon, tab);
      }
      const files = util.el('div', 'cad-files', cad);
      util.el('b', '', files, 'Project Files');
      util.el('div', '', files, '⊟  Studio Tower');
      util.el('div', '', files, '　▾ Architectural');
      util.el('div', '', files, '　　▾ Floor Plans');
      util.el('div', '', files, '　　　▧ Floor 1 Plan.dwg');
      util.el('div', 'active', files, '　　　▧ Floor 2 Plan.dwg');
      util.el('div', '', files, '　　　▧ Floor 3 Plan.dwg');
      for (const row of ['▾ Elevations', '▾ Sections', '▸ Structural', '▸ Mechanical', '▸ Electrical', '▸ Renderings', '▸ Reference']) util.el('div', '', files, `　${row}`);
      const cadStatus = util.el('div', 'cad-status', cad);
      util.el('span', '', cadStatus, 'Model　　Layout1　　Layout2　　＋');
      util.el('span', '', cadStatus, '13542.681, 8420.376, 0.000　　 SNAP　 GRID　 ORTHO　 POLAR　 OSNAP　 OTRACK　 LWT　 MODEL');
      Object.assign(_c, { H, W, cad, cadStatus, display, drawing, files, ribbon, roomy, tall });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // The channel-era design uses a compact global dock rather than workspace rails.
      const dock = util.el('nav', 'channel-dock', document.body);
      const dockItems = [['●', 'Home'], ['♟', 'Channels'], ['▦', 'Meetings'], ['▤', 'Files'], ['☑', 'Tasks'], ['?', 'Help']];
      for (const [icon, title] of dockItems) {
        const item = util.el('div', 'channel-dock-item', dock);
        util.el('span', 'channel-dock-icon', item, icon);
        util.el('span', '', item, title);
      }
      Object.assign(_c, { dock, dockItems, stage });
    },
  };

  env.site({
    name: 'design-use-chat-channel-02',
    template: 'site/base',
    design: { parts },
  });
})();
