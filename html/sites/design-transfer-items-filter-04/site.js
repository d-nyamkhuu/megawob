// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const appTitle = util.el('div', 'gtk-titlebar', document.body);
        document.body.insertBefore(appTitle, header);
        util.el('span', 'gtk-app-icon', appTitle, '⬡');
        util.el('strong', 'gtk-title', appTitle, 'City Directory');
        const win = util.el('div', 'gtk-window-controls', appTitle);
        for (const mark of ['−', '□', '×']) util.el('span', 'gtk-window-control', win, mark);
        const menu = util.el('nav', 'gtk-menubar', document.body);
        document.body.insertBefore(menu, header);
        for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'gtk-menu-item', menu, item);
        const tabs = util.el('nav', 'gtk-tabs', document.body);
        document.body.insertBefore(tabs, header);
        for (const [i, item] of ['Cities', 'Countries', 'Time Zones', 'Regions'].entries()) {
          util.el('span', i === 0 ? 'gtk-tab active' : 'gtk-tab', tabs, item);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { appTitle, header, menu, tabs, win });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const summary = util.el('section', 'directory-summary', body);
        util.el('div', 'summary-title', summary, 'World Cities Directory');
        const worldMap = util.el('div', 'world-map', summary);
        worldMap.innerHTML =
          '<svg viewBox="0 0 300 170" aria-hidden="true"><path d="M18 39 30 29 44 31 52 20 70 18 80 25 74 34 82 42 73 52 68 68 58 71 51 84 41 78 35 65 25 61Z"/><path d="M71 84 83 89 89 104 85 117 94 128 87 145 80 151 75 136 67 127 69 111 62 99Z"/><path d="M126 35 137 27 149 30 154 40 168 42 171 54 183 60 178 70 166 71 159 65 151 71 141 63 133 55 124 51Z"/><path d="M143 76 153 73 160 82 158 95 166 106 161 119 155 131 151 148 145 156 140 143 139 128 133 115 137 101 132 91Z"/><path d="M181 42 195 36 211 39 222 47 238 46 247 56 262 58 273 69 268 82 258 88 251 101 239 103 229 114 215 112 207 101 196 98 191 85 181 77 176 63Z"/><path d="M232 124 246 122 254 130 250 141 238 144 230 136Z"/><path d="M269 119 275 122 272 127Z" fill="#74a98a"/></svg>';
        const facts = util.el('div', 'summary-facts', summary);
        for (const [label, value] of [
          ['Total cities:', '28'],
          ['In selected list:', '3'],
          ['In available list:', '25'],
          ['Data source:', 'Internal directory'],
          ['Last updated:', 'Mar 12, 1992'],
          ['Time zone basis:', 'IANA (1992)'],
        ]) {
          const fact = util.el('div', 'summary-fact', facts);
          util.el('span', '', fact, label);
          util.el('span', '', fact, value);
        }
        const taskRow = util.el('div', 'directory-taskrow', body);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, facts, summary, taskRow, worldMap });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, taskRow, util } = _c;
        const stage = util.el('main', 'ref-stage', taskRow);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'city-inspector', taskRow);
        const panel = body.querySelector('.ref-panel');
        if (panel) inspector.appendChild(panel);
        util.el('strong', 'inspector-title', inspector, 'City Details');
        for (const [label, value] of [
          ['Name:', 'Canberra'],
          ['Country:', 'Australia'],
          ['Region:', 'Oceania'],
          ['Population:', '249,000'],
          ['Time zone:', 'AEST (UTC+10)'],
          ['Latitude:', '35.2809° S'],
          ['Longitude:', '149.1300° E'],
        ]) {
          const row = util.el('div', 'inspector-row', inspector);
          util.el('span', '', row, label);
          util.el('span', '', row, value);
        }
        const map = util.el('div', 'australia-map', inspector);
        map.innerHTML =
          '<svg viewBox="0 0 360 210" aria-hidden="true"><path d="M76 58 91 43 111 39 128 25 148 29 160 21 174 32 193 29 206 39 225 42 236 55 252 60 258 75 273 82 278 98 267 111 263 128 251 140 247 158 235 169 223 164 214 176 200 172 189 184 174 180 165 168 150 169 140 159 127 163 117 153 102 154 95 145 82 143 75 130 65 125 64 111 57 103 62 89 57 78 68 70Z" fill="#e7d8a8"/><path d="M168 176 179 182 187 191 181 198 171 194Z" fill="#e7d8a8"/></svg><span class="map-marker">● <b>Canberra</b></span>';
        util.el(
          'div',
          'inspector-notes',
          inspector,
          'Notes: Capital city of Australia, located in the Australian Capital Territory. Known for its planned layout and national institutions.',
        );
        Object.assign(_c, { inspector, map, stage });
      },
  };

  env.site({
    name: 'design-transfer-items-filter-04',
    template: 'site/base',
    design: { parts },
  });
})();
