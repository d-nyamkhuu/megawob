// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebarDraw = roomy && rng.bool(0.35);
        const sidebar = false;
        const navDraw = W >= 1180 && rng.bool(0.5);
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const titlebar = util.el('div', 'office-titlebar', document.body);
        util.el('span', 'office-appicon', titlebar, '▧');
        util.el('span', 'office-title', titlebar, 'Contoso Document Center');
        const windowButtons = util.el('div', 'office-window-buttons', titlebar);
        util.el('span', 'office-min', windowButtons, '−');
        util.el('span', 'office-max', windowButtons, '□');
        util.el('span', 'office-close', windowButtons, '×');
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          nav,
          navDraw,
          placement,
          sidebar,
          sidebarDraw,
          titlebar,
          wantFooter,
          windowButtons,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, local, nav, rng, util } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (true) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'CoreDocs');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          const navCount = rng.int(3, 5);
          const sampledNav = local(rng.sample(content.NAV_ITEMS, navCount), K.nav);
          for (const item of ['Home', 'Documents', 'Share', 'View', 'Tools']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const ribbon = util.el('div', 'office-ribbon', document.body);
        const ribbonGroups = [
          [
            'Create',
            [
              ['new', 'New Document'],
              ['scan', 'Scan'],
              ['import', 'Import'],
            ],
          ],
          [
            'Manage',
            [
              ['open', 'Open'],
              ['properties', 'Properties'],
              ['rename', 'Rename'],
              ['move', 'Move'],
              ['copy', 'Copy'],
              ['delete', 'Delete'],
            ],
          ],
          [
            'Share',
            [
              ['share', 'Share'],
              ['email', 'Email'],
              ['link', 'Send Link'],
            ],
          ],
          [
            'Output',
            [
              ['print', 'Print'],
              ['export', 'Export'],
            ],
          ],
        ];
        const iconArt = {
          new: '<path fill="#fff" stroke="#527b9f" stroke-width="1.6" d="M10 3.5h18l8 8v33H10z"/><path fill="#d8e8f5" stroke="#527b9f" stroke-width="1.4" d="M28 3.5v9h8"/><path stroke="#79a0c0" stroke-width="1.5" d="M15 20h16M15 25h16M15 30h16"/><path fill="#4f8abd" d="M4 8h7v7H4z"/>',
          scan: '<path fill="#72899b" stroke="#425c70" stroke-width="1.5" d="m5 22 10-11 27 10-10 12z"/><path fill="#dfeaf2" stroke="#58748b" stroke-width="1.5" d="m13 16 7-7 20 8-7 8z"/><path fill="#344f64" d="m4 24 29 10 8-3v7L32 43 4 33z"/><path stroke="#f6fbff" stroke-width="2" d="m9 29 23 8"/>',
          import:
            '<path fill="#f5a623" stroke="#bd7710" stroke-width="1.5" d="M4 14h15l4 5h21v23H4z"/><path fill="#ffd46a" d="M5 14h13l3 4H5z"/><path fill="#4b9b50" stroke="#28723a" stroke-width="1.4" d="M27 25h9v-5l9 9-9 9v-5H23v-8z"/>',
          open: '<path fill="#efaa31" stroke="#bd7b1e" stroke-width="1.5" d="M4 13h15l4 5h21v24H4z"/><path fill="#ffcf62" stroke="#bf8429" stroke-width="1.2" d="M5 20h38l-5 19H5z"/><path stroke="#fff1c6" stroke-width="2" d="M8 23h31"/>',
          properties:
            '<path fill="#fff" stroke="#527b9f" stroke-width="1.6" d="M8 4h20l9 9v31H8z"/><path fill="#dceaf6" stroke="#527b9f" stroke-width="1.4" d="M28 4v9h9"/><path stroke="#8ba9c2" stroke-width="1.5" d="M13 20h13M13 25h12"/><circle cx="32" cy="33" r="10" fill="#3e83bd" stroke="#245e91" stroke-width="1.5"/><path fill="#fff" d="M31 31h2v8h-2zm0-4h2v2h-2z"/>',
          rename:
            '<path fill="#f1c94a" stroke="#a8872e" stroke-width="1.4" d="m7 33 22-24 9 8-22 24-11 3z"/><path fill="#657b8d" d="m29 9 4-4q2-2 4 0l4 4q2 2 0 4l-3 4z"/><path fill="#f8f2dc" d="m8 34 7 6-10 4z"/><path stroke="#fff" stroke-width="1.3" d="m12 32 7 6"/>',
          move: '<path fill="#f2ad37" stroke="#bd7a1d" stroke-width="1.4" d="M4 13h15l4 5h21v23H4z"/><path fill="#ffd264" d="M5 19h37v4H5z"/><path fill="#39954d" stroke="#27713b" stroke-width="1.2" d="M18 27h15v-6l11 10-11 10v-6H18z"/>',
          copy: '<path fill="#d7e5f1" stroke="#6585a1" stroke-width="1.5" d="M16 4h20l7 8v29H16z"/><path fill="#fff" stroke="#527b9f" stroke-width="1.6" d="M7 10h20l7 8v27H7z"/><path fill="#dceaf6" stroke="#527b9f" stroke-width="1.3" d="M27 10v9h7"/><path stroke="#84a4bf" stroke-width="1.4" d="M12 25h16M12 30h16M12 35h13"/>',
          delete:
            '<path fill="#fff" stroke="#8197a9" stroke-width="1.5" d="M7 6h27l8 8v29H7z"/><path fill="#e6443a" stroke="#b92327" stroke-width="1.2" d="m16 17 4-4 8 8 8-8 4 4-8 8 8 8-4 4-8-8-8 8-4-4 8-8z"/>',
          share:
            '<circle cx="17" cy="15" r="7" fill="#efb858" stroke="#986b28" stroke-width="1.3"/><path fill="#7798b3" stroke="#476984" stroke-width="1.4" d="M5 39v-5q0-10 12-10 9 0 11 8v7z"/><circle cx="34" cy="17" r="6" fill="#f0c16d" stroke="#986b28" stroke-width="1.2"/><path fill="#8ba9bf" stroke="#476984" stroke-width="1.3" d="M28 28q12-5 16 5v6H29z"/>',
          email:
            '<rect x="4" y="10" width="40" height="29" rx="2" fill="#f8fcff" stroke="#4d83b0" stroke-width="2"/><path fill="#c8dfef" stroke="#4d83b0" stroke-width="1.8" d="m5 12 19 15 19-15"/><path stroke="#77a4c6" stroke-width="1.4" d="m6 37 14-12m22 12L28 25"/>',
          link: '<path d="m19 31-4 4a8 8 0 0 1-11-11l9-9a8 8 0 0 1 11 0" fill="none" stroke="#6e879c" stroke-width="5" stroke-linecap="round"/><path d="m29 17 4-4a8 8 0 0 1 11 11l-9 9a8 8 0 0 1-11 0" fill="none" stroke="#4d7799" stroke-width="5" stroke-linecap="round"/><path d="m16 27 16-10" stroke="#bdcbd6" stroke-width="3"/>',
          print:
            '<path fill="#e9f2f8" stroke="#597a94" stroke-width="1.6" d="M12 4h24v13H12z"/><path fill="#6c8191" stroke="#435c6e" stroke-width="1.5" d="M8 16h32q4 0 4 4v15h-8v8H12v-8H4V20q0-4 4-4z"/><path fill="#fff" stroke="#527b9f" stroke-width="1.4" d="M12 29h24v15H12z"/><path stroke="#95adc0" stroke-width="1.4" d="M16 34h16M16 38h13"/><circle cx="37" cy="22" r="2" fill="#dbeaf5"/>',
          export:
            '<path fill="#fff" stroke="#527b9f" stroke-width="1.6" d="M8 4h20l9 9v31H8z"/><path fill="#dceaf6" stroke="#527b9f" stroke-width="1.3" d="M28 4v9h9"/><path stroke="#87a7c1" stroke-width="1.4" d="M13 21h13M13 26h12"/><path fill="#4b9b50" stroke="#28723a" stroke-width="1.4" d="M23 31h12v-6l11 10-11 10v-6H23z"/>',
        };
        for (const [caption, commands] of ribbonGroups) {
          const group = util.el('div', 'office-ribbon-group', ribbon);
          const items = util.el('div', 'office-ribbon-items', group);
          for (const [icon, label] of commands) {
            const button = util.el('button', 'office-ribbon-command', items);
            button.type = 'button';
            const graphic = util.el('span', 'office-ribbon-icon', button);
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 48 48');
            svg.setAttribute('aria-hidden', 'true');
            svg.innerHTML = iconArt[icon];
            graphic.appendChild(svg);
            util.el('span', 'office-ribbon-label', button, label);
            button.addEventListener('click', () => env.log('decoy', { what: 'ribbon', label }));
          }
          util.el('div', 'office-ribbon-caption', group, caption);
        }
        Object.assign(_c, { headerTools, iconArt, ribbon, ribbonGroups, submit });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const records = util.el('aside', 'office-records', body);
        const recordsHead = util.el('div', 'office-records-head', records);
        util.el('span', 'office-disclosure', recordsHead, '›');
        util.el('strong', '', recordsHead, 'Incident Reports');
        const columns = util.el('div', 'office-record-columns', records);
        util.el('span', '', columns, 'Title');
        util.el('span', '', columns, 'Modified  ▲');
        const rows = util.el('div', 'office-record-list', records);
        const recordIds = [
          'IR-6225',
          'IR-6180',
          'IR-6179',
          'IR-6154',
          'IR-6112',
          'IR-6088',
          'IR-6021',
          'IR-6003',
          'IR-5980',
          'IR-5944',
          'IR-5910',
          'IR-5876',
          'IR-5841',
          'IR-5800',
          'IR-5772',
        ];
        const dates = [
          '4/12/2008',
          '4/05/2008',
          '3/28/2008',
          '3/21/2008',
          '3/10/2008',
          '2/28/2008',
          '2/17/2008',
          '2/03/2008',
          '1/25/2008',
          '1/14/2008',
          '1/03/2008',
          '12/18/2007',
          '12/06/2007',
          '11/21/2007',
          '11/09/2007',
        ];
        for (let i = 0; i < recordIds.length; i++) {
          const row = util.el('div', `office-record-row${i === 0 ? ' selected' : ''}`, rows);
          const fileIcon = util.el('span', 'office-file-icon', row);
          const fileSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          fileSvg.setAttribute('viewBox', '0 0 24 28');
          fileSvg.setAttribute('aria-hidden', 'true');
          fileSvg.innerHTML =
            '<path fill="#f8fcff" stroke="#3474ae" stroke-width="1.5" d="M4 1.5h10l6 6V26H4z"/><path fill="#d7eaf9" stroke="#3474ae" stroke-width="1.2" d="M14 1.5v6h6"/><path stroke="#6695bd" stroke-width="1" d="M7 13h10M7 17h10M7 21h8"/>';
          fileIcon.appendChild(fileSvg);
          util.el('span', 'office-record-name', row, `${recordIds[i]} - Incident Report`);
          util.el('span', 'office-record-date', row, dates[i]);
        }
        const stage = util.el('main', 'ref-stage office-document-window', body);
        S.frameAlign(_c, stage);
        Object.assign(_c, { columns, dates, recordIds, records, recordsHead, rows, stage });
      },
    'frame.nav': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-protect-privacy-redact-04',
    template: 'site/base',
    design: { parts },
  });
})();
