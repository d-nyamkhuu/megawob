// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  const artworkDefs = "<defs xmlns=\"http://www.w3.org/2000/svg\">\n <linearGradient id=\"gold\" x2=\"1\" y2=\".3\"><stop stop-color=\"#fff4a8\" /><stop offset=\".35\" stop-color=\"#f4d45c\" /><stop offset=\"1\" stop-color=\"#c69c31\" /></linearGradient>\n <linearGradient id=\"paper\" x2=\".8\" y2=\"1\"><stop stop-color=\"#fff\" /><stop offset=\".7\" stop-color=\"#f7fbff\" /><stop offset=\"1\" stop-color=\"#d7e5ed\" /></linearGradient>\n <linearGradient id=\"green\" x2=\"1\" y2=\"1\"><stop stop-color=\"#5da684\" /><stop offset=\"1\" stop-color=\"#12613f\" /></linearGradient>\n <linearGradient id=\"blue\" x2=\"1\" y2=\"1\"><stop stop-color=\"#85b9ed\" /><stop offset=\"1\" stop-color=\"#154c9c\" /></linearGradient>\n <linearGradient id=\"glass\"><stop stop-color=\"#edf8ff\" stop-opacity=\".85\" /><stop offset=\".35\" stop-color=\"#9ab9ce\" stop-opacity=\".5\" /><stop offset=\".7\" stop-color=\"#f4fcff\" stop-opacity=\".9\" /><stop offset=\"1\" stop-color=\"#698b9e\" stop-opacity=\".7\" /></linearGradient>\n</defs>\n";
  const artwork = {"folder":"<ellipse xmlns=\"http://www.w3.org/2000/svg\" cx=\"50\" cy=\"94\" rx=\"32\" ry=\"6\" fill=\"#003c6d\" opacity=\".25\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M14 5L65 14Q69 15 69 20V89L24 87 14 77Z\" fill=\"url(#gold)\" stroke=\"#fce99d\" stroke-width=\"2\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M14 5L33 23V100L14 79Z\" fill=\"#fff4ab\" stroke=\"#ebcf60\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M33 23L62 16V91L33 100Z\" fill=\"url(#gold)\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M69 64L75 69V91L69 94Z\" fill=\"#ffe890\" stroke=\"#fff1ba\" stroke-width=\"2\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M17 9L31 24V93L19 78Z\" fill=\"#fffac5\" opacity=\".6\" />\n","document":"<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M17 3H66L85 23V100H17Z\" fill=\"url(#paper)\" stroke=\"#688ba4\" stroke-width=\"1.5\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M66 3V24H85\" fill=\"#e4eef4\" stroke=\"#8ea6b9\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M25 15H58M27 36H76M27 47H76M27 58H76M27 69H76M27 80H76M27 91H76\" fill=\"none\" stroke=\"#99bbd9\" stroke-width=\"3\" />\n <rect xmlns=\"http://www.w3.org/2000/svg\" x=\"2\" y=\"31\" width=\"42\" height=\"50\" rx=\"2\" fill=\"url(#blue)\" stroke=\"#214d80\" stroke-width=\"1.5\" />\n <rect xmlns=\"http://www.w3.org/2000/svg\" x=\"6\" y=\"35\" width=\"34\" height=\"42\" fill=\"#ecf4ff\" stroke=\"#a3c4e4\" />\n <text xmlns=\"http://www.w3.org/2000/svg\" x=\"23\" y=\"67\" text-anchor=\"middle\" font-family=\"Georgia\" font-size=\"35\" font-weight=\"bold\" font-style=\"italic\" fill=\"#26548e\">W</text>\n","excel":"<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M17 3H66L85 23V100H17Z\" fill=\"url(#paper)\" stroke=\"#658d85\" stroke-width=\"1.5\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M66 3V24H85\" fill=\"#deece8\" stroke=\"#86a69e\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M27 17H58M27 28H77M27 39H77M27 50H77M27 61H77M27 72H77M27 83H77M27 94H77\" fill=\"none\" stroke=\"#96c8ba\" stroke-width=\"7\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M40 12V98M59 12V98\" stroke=\"#fff\" stroke-width=\"3\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M3 35L44 29V88L3 82Z\" fill=\"url(#green)\" stroke=\"#246b4d\" stroke-width=\"1.5\" />\n <text xmlns=\"http://www.w3.org/2000/svg\" x=\"23\" y=\"70\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"34\" font-weight=\"bold\" fill=\"white\">X</text>\n","pdf":"<path xmlns=\"http://www.w3.org/2000/svg\" d=\"M9 3H62L83 25V100H9Z\" fill=\"url(#paper)\" stroke=\"#9b9b9b\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M62 3V25H83\" fill=\"#e9e9e9\" stroke=\"#aaa\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M26 66C44 42 52 9 43 15C33 23 53 51 68 50C83 47 41 43 26 66Z\" fill=\"none\" stroke=\"#d9463e\" stroke-width=\"3\" />\n <rect xmlns=\"http://www.w3.org/2000/svg\" x=\"10\" y=\"71\" width=\"72\" height=\"27\" rx=\"3\" fill=\"#d93228\" stroke=\"#ff8e83\" />\n <text xmlns=\"http://www.w3.org/2000/svg\" x=\"46\" y=\"92\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" font-weight=\"bold\" fill=\"white\">PDF</text>\n","trash":"<ellipse xmlns=\"http://www.w3.org/2000/svg\" cx=\"47\" cy=\"96\" rx=\"28\" ry=\"5\" fill=\"#00395d\" opacity=\".25\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M13 15L24 91Q44 104 65 91L77 15Z\" fill=\"url(#glass)\" stroke=\"#dceaf2\" stroke-width=\"2\" />\n <g xmlns=\"http://www.w3.org/2000/svg\" fill=\"#e4e8e9\" stroke=\"#9ba8b0\"><path d=\"M18 26L37 15 44 34 26 48Z\" /><path d=\"M43 18L61 27 53 49 35 39Z\" /><path d=\"M34 53L52 43 64 62 47 76Z\" /><path d=\"M22 64L36 73 29 88Z\" /><path d=\"M48 78L65 68 62 88 46 95Z\" /></g>\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M33 49L40 40 48 52 43 51 38 61 30 58ZM50 58L61 62 55 75 54 70 43 71 42 63ZM38 78L27 80 24 65 28 69 34 61 41 66Z\" fill=\"#3f7bc2\" opacity=\".85\" />\n <ellipse xmlns=\"http://www.w3.org/2000/svg\" cx=\"45\" cy=\"15\" rx=\"33\" ry=\"8\" fill=\"url(#glass)\" stroke=\"#f5fbff\" stroke-width=\"2\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M24 17L31 6 43 18M42 16L57 5 61 18\" fill=\"#e8eaea\" stroke=\"#9aa9b3\" />\n <path xmlns=\"http://www.w3.org/2000/svg\" d=\"M18 26L28 88\" stroke=\"white\" opacity=\".65\" stroke-width=\"3\" />\n"};
  artwork.plain = artwork.document.replace(/<rect[\s\S]*$/, '');
  artwork.photo = '<defs><linearGradient id="ps" x2="0" y2="1"><stop stop-color="#65a6dd"/><stop offset="1" stop-color="#dfedfa"/></linearGradient><linearGradient id="pl" x2="0" y2="1"><stop stop-color="#548298"/><stop offset="1" stop-color="#17454a"/></linearGradient></defs><rect x="2" y="14" width="86" height="75" fill="#f9fbfd" stroke="#8ba2b4"/><rect x="6" y="18" width="78" height="67" fill="url(#ps)"/><path d="M6 58L22 35 31 43 48 27 59 39 72 22 84 33V69H6Z" fill="#748d9a"/><path d="M12 51L22 35 31 43 25 41 22 44 20 40ZM35 41L48 27 59 39 53 36 49 39 45 34ZM61 36L72 22 84 33 76 31 74 34 70 29Z" fill="#f0f5f7"/><path d="M6 54L18 45 31 58 45 50 60 57 84 42V69H6Z" fill="#355443"/><path d="M6 61Q43 55 84 59V85H6Z" fill="url(#pl)"/><path d="M9 67L25 75 30 69 47 80 57 68 74 72 83 64" fill="none" stroke="#b4c0bd" opacity=".5"/><path d="M6 60L17 53 26 60 15 66 6 81M84 51L72 59 79 65 84 78" fill="#4e6636"/><path d="M9 72H37M50 64H77M22 81H57" stroke="#7bacae" stroke-width=".7"/>';
  window.officeIcon = name => '<svg viewBox="0 0 90 104" xmlns="http://www.w3.org/2000/svg">' + artworkDefs + artwork[name] + '</svg>';
  env.site({
    name: 'design-sort-into-bins-desk-05',
    styles: ['ref.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'lisa',
        'title': 'File Organizer',
        'menu': 'File    Edit    View    Insert    Format    Dimension    Draw    Modify    Tools    Window    Help',
        'ribbon': true,
        'foot': '',
        'accent': '#88B6F5',
        'bg': '#06263D',
        'surface': '#102B46',
        'font': 'Arial, Segoe UI, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
              (ctx.display === 'panel' ? ' has-instruction-panel' : '') +
              (ctx.finish ? ' finish-mode' : '');
          },
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.title) {
              const title = u.el('div', 'title', head);
              u.el('span', 'title-text', title, C.title);
              u.el('div', 'title-icon', title).innerHTML = window.officeIcon('folder');
              const wc = u.el('div', 'wc2', title);
              for (const g of ['–', '□', '✕']) u.el('span', 'wc2-b', wc, g);
              if (C.theme === 'lisa') {
                const zoom = u.svg(
                  'svg',
                  { class: 'zoom-icon', viewBox: '0 0 24 24', fill: 'none', stroke: '#111', 'stroke-width': 2 },
                  title,
                );
                u.svg('path', { d: 'M3 3H21V21H3ZM8 8H17V14H12V18H8Z' }, zoom);
              }
            }
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const ICON = {
              'New Folder': '<svg viewBox="0 0 40 40"><path d="M4 11h13l3 3h16v21H4z" fill="#e8c35a" stroke="#b58a22"/><path d="M4 16h32v19H4z" fill="#f8de8a" stroke="#b58a22"/></svg>',
              Copy: '<svg viewBox="0 0 40 40"><path d="M8 4h16l6 6v22H8z" fill="#fff" stroke="#7f95ad"/><path d="M14 12h16l6 6v20H14z" fill="#f4f8fc" stroke="#7f95ad"/></svg>',
              Cut: '<svg viewBox="0 0 40 40"><path d="M13 3l12 22M27 3L15 25" stroke="#8a9bad" stroke-width="2"/><circle cx="13" cy="31" r="5" fill="none" stroke="#2a5fa8" stroke-width="3"/><circle cx="27" cy="31" r="5" fill="none" stroke="#2a5fa8" stroke-width="3"/></svg>',
              Paste: '<svg viewBox="0 0 40 40"><rect x="6" y="6" width="22" height="28" rx="2" fill="#d9b36a" stroke="#8a6a2a"/><rect x="16" y="14" width="20" height="24" fill="#fff" stroke="#7f95ad"/></svg>',
              Delete: '<svg viewBox="0 0 40 40"><path d="M9 9l22 22M31 9L9 31" stroke="#d8201c" stroke-width="7"/></svg>',
              Rename: '<svg viewBox="0 0 40 40"><path d="M6 32c0-12 8-18 20-18V6l12 11-12 11v-8c-8 0-14 2-20 12z" fill="#3b82d6" stroke="#2760a8"/></svg>',
              View: '<svg viewBox="0 0 40 40"><rect x="4" y="6" width="32" height="28" fill="#fff" stroke="#3f74b8" stroke-width="2"/><path d="M4 15h32M4 24h32M15 6v28M26 6v28" stroke="#3f74b8" stroke-width="2"/></svg>',
              'Sort By': '<svg viewBox="0 0 40 40"><rect x="4" y="6" width="16" height="8" fill="#6a9ad6"/><rect x="4" y="18" width="16" height="8" fill="#e0794a"/><rect x="4" y="30" width="16" height="6" fill="#7ab55a"/><path d="M30 6v26M24 26l6 8 6-8" fill="none" stroke="#2a5fa8" stroke-width="3"/></svg>',
              Help: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#2a63c4" stroke="#18408a"/><text x="20" y="28" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle" font-family="Arial">?</text></svg>',
            };
            const rb = u.el('div', 'rb', head);
            for (const [gname, items] of [
              ['Organize', ['New Folder', 'Copy', 'Cut', 'Paste*']],
              ['Manage', ['Delete', 'Rename']],
              ['View', ['View*', 'Sort By*']],
              ['Support', ['Help*']],
            ]) {
              const g = u.el('div', 'rb-group', rb);
              const row = u.el('div', 'rb-row', g);
              for (const it of items) {
                const name = it.replace('*', '');
                const b = u.el('div', 'rb-btn', row);
                let picture = ICON[name];
                if (name === 'New Folder') picture = '<svg viewBox="0 0 48 48"><defs><linearGradient id="rf" x2="0" y2="1"><stop stop-color="#fff3a8"/><stop offset="1" stop-color="#d9ac35"/></linearGradient></defs><path d="M3 10Q3 7 7 7H20L25 12H43V41H3Z" fill="url(#rf)" stroke="#bb9030"/><path d="M3 17H44L41 42H2Z" fill="url(#rf)" stroke="#be9330"/><path d="M5 19H41" stroke="#fff8c1" stroke-width="2"/></svg>';
                if (name === 'Copy') picture = '<svg viewBox="0 0 48 48"><path d="M5 3H26L34 12V38H5Z" fill="#f7fbff" stroke="#7ca1cb"/><path d="M14 10H33L42 20V46H14Z" fill="#f7fbff" stroke="#608ac0"/><path d="M33 10V20H42M18 25H37M18 29H37M18 33H37M18 37H37M18 41H37M8 8H22M8 13H22M8 18H12M8 23H12M8 28H12" fill="none" stroke="#9bbce1" stroke-width="1.3"/></svg>';
                if (name === 'Paste') picture = '<svg viewBox="0 0 48 48"><rect x="6" y="5" width="29" height="38" rx="3" fill="#d8b65d" stroke="#886d30"/><rect x="9" y="8" width="23" height="32" fill="#f9fbfc" stroke="#8099b3"/><path d="M15 4H19V1H24V4H28V10H15Z" fill="#a5bbca" stroke="#627f9c"/><path d="M23 17H35L43 25V46H23Z" fill="#f4f9ff" stroke="#6c91bf"/><path d="M35 17V25H43M26 29H39M26 33H39M26 37H39M26 41H39" fill="none" stroke="#97b9dc"/></svg>';
                if (name === 'Help') picture = '<svg viewBox="0 0 48 48"><defs><linearGradient id="rh" x2="0" y2="1"><stop stop-color="#a5c8f5"/><stop offset=".48" stop-color="#366dbb"/><stop offset="1" stop-color="#174683"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="#dce6ef" stroke="#4e647e"/><circle cx="24" cy="24" r="19" fill="url(#rh)" stroke="white"/><text x="24" y="35" font-family="Arial" font-size="34" font-weight="bold" text-anchor="middle" fill="white">?</text></svg>';
                if (name === 'View') picture = '<svg viewBox="0 0 48 48"><defs><linearGradient id="rv" x2="0" y2="1"><stop stop-color="#e6f9ff"/><stop offset="1" stop-color="#79b6ed"/></linearGradient></defs><rect x="2" y="6" width="44" height="35" fill="url(#rv)" stroke="#1e65a5"/><path d="M2 15H46M2 24H46M2 33H46M15 6V41M30 6V41" fill="none" stroke="#2379c7" stroke-width="2"/><path d="M4 8H44M4 17H44M4 26H44M4 35H44" stroke="white" opacity=".8"/></svg>';
                if (name === 'Sort By') picture = '<svg viewBox="0 0 48 48"><path d="M36 4V36H30L39 44 47 36H42V4Z" fill="#2673c1" stroke="#235b99"/><g stroke="#6789a6"><path d="M2 5H12V15H2Z" fill="#bcd2e8"/><path d="M17 5H27V15H17Z" fill="#bcd2e8"/><path d="M2 20H12V30H2Z" fill="#f1fafc"/><path d="M17 20H27V30H17Z" fill="#c8dfdc"/><path d="M2 35H12V45H2Z" fill="#f9d3a1"/><path d="M17 35H27V45H17Z" fill="#b7cadc"/></g><path d="M4 7H10M4 10H8M19 7H25M19 10H25M4 24L7 21 10 27M18 23H25M18 26H24M5 37L9 43M9 37L5 43M19 38H25M19 41H25" fill="none" stroke="#3e6991" stroke-width="1.7"/></svg>';
                if (name === 'Delete') picture = '<svg viewBox="0 0 48 48"><defs><linearGradient id="rd" x2="0" y2="1"><stop stop-color="#ff674a"/><stop offset=".5" stop-color="#e01910"/><stop offset="1" stop-color="#b80000"/></linearGradient></defs><path d="M10 6L24 19 37 6 43 12 30 25 43 38 37 44 24 31 11 44 5 38 18 25 5 12Z" fill="url(#rd)" stroke="#bf170b"/><path d="M10 8L24 22 37 8" fill="none" stroke="#ff9f8d"/></svg>';
                if (name === 'Rename') picture = '<svg viewBox="0 0 48 48"><defs><linearGradient id="rr" x2="0" y2="1"><stop stop-color="#82d2ff"/><stop offset=".5" stop-color="#2b9eea"/><stop offset="1" stop-color="#1468bd"/></linearGradient></defs><path d="M4 41C4 21 16 14 31 15V5L47 21 31 35V25C18 23 11 29 4 41Z" fill="url(#rr)" stroke="#1764ad"/><path d="M5 35C7 19 19 17 31 18" fill="none" stroke="#a1deff"/></svg>';
                if (name === 'Cut') picture = '<svg viewBox="0 0 48 48"><path d="M15 3Q11 3 16 19L24 30 28 26Z" fill="#e3e7e9" stroke="#8897a5"/><path d="M34 3Q38 3 33 19L24 30 20 26Z" fill="#bdc9d1" stroke="#8897a5"/><path d="M18 26L15 35M29 27L33 35" stroke="#27699d" stroke-width="4"/><ellipse cx="13" cy="38" rx="6" ry="8" fill="none" stroke="#1d61a0" stroke-width="4"/><ellipse cx="35" cy="38" rx="6" ry="8" fill="none" stroke="#1d61a0" stroke-width="4"/><circle cx="24" cy="26" r="2" fill="#677989"/></svg>';
                u.el('div', 'rb-ico', b).innerHTML = picture;
                u.el('span', '', b, name + (it.endsWith('*') ? ' ▾' : ''));
              }
              u.el('div', 'rb-name', g, gname);
            }
            if (C.menu) {
              const menu = u.el('nav', 'menu', head, C.menu);
              if (C.theme === 'lisa') {
                const apple = u.svg('svg', { class: 'apple-icon', viewBox: '0 0 30 36', fill: '#080808' }, menu);
                u.svg(
                  'path',
                  {
                    d: 'M18 8C18 4 21 1 25 1C25 5 22 8 18 8ZM15 11C10 7 4 10 3 16C1 23 5 32 10 34C12 35 14 32 17 33C21 36 23 33 26 28C20 25 20 18 27 15C24 9 20 8 15 11Z',
                  },
                  apple,
                );
                const doc = u.svg(
                  'svg',
                  { class: 'document-icon', viewBox: '0 0 28 34', fill: 'none', stroke: '#111', 'stroke-width': 1.8 },
                  menu,
                );
                u.svg(
                  'path',
                  { d: 'M3 2H20L25 7V31H3ZM20 2V8H25M7 7H15V11H7ZM7 15H21V27H7ZM10 18H18M10 21H20M10 24H17' },
                  doc,
                );
              }
            }
          },
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, instruction, note, u } = _c;
            if (C.theme === 'lisa')
              instruction.style.setProperty('--instruction-scale', Math.min(1, 90 / ctx.instruction.length));
            if (C.theme === 'memphis') {
              u.el('h1', 'brief-title', note, C.title);
              note.prepend(note.lastChild);
              u.el(
                'p',
                'brief-copy',
                note,
                'Drag and drop the months on the right to arrange them from January to December.',
              );
            }
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, ctx, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              keepDefault = endR.bool(0.5),
              endPlacement = keepDefault ? 'footer' : endR.pick(['header', 'link']);
            const rawEnds = ctx.content && ctx.content.END_LABELS;
            const endBank =
              Array.isArray(rawEnds) && rawEnds.length
                ? rawEnds
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = keepDefault ? 'Submit' : endText(endR.pick(endBank));
            const collideR = ctx.rng.fork('chrome/collide');
            _c.collision = null;
            if (!ctx.finish && collideR.bool(0.3)) {
              const options = [...new Set(endBank.map(endText))].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length)
                _c.collision = { label: collideR.pick(options), where: collideR.pick(['header', 'footer']) };
            }
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, {
              collideR,
              endBank,
              endLabel,
              endPlacement,
              endR,
              endText,
              keepDefault,
              rawEnds,
              stage,
            });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                _c.aside.classList.add('properties-dock');
                u.el('h3', '', _c.aside, 'Items');
                for (const [nm, icon] of [
                  ['Spreadsheets', 'excel'],
                  ['Other Files', 'plain'],
                  ['Folders', 'folder'],
                  ['Recycle Bin', 'trash'],
                ]) {
                  const r = u.el('div', 'item-row', _c.aside);
                  u.el('i', '', r).innerHTML = window.officeIcon(icon);
                  u.el('span', '', r, nm);
                  u.el('span', 'item-total', r, '0');
                }
                for (const [heading, rows] of [
                  [
                    'General',
                    [
                      'Color　　　 ByLayer',
                      'Layer　　　 0',
                      'Linetype　　 ByLayer',
                      'Lineweight　 ByLayer',
                      'Transparency　0.0000',
                    ],
                  ],
                  [
                    'View',
                    [
                      'Center X　　 3150.0000',
                      'Center Y　　 2100.0000',
                      'Center Z　　 0.0000',
                      'Height　　　 4200.0000',
                      'Width　　　　5600.0000',
                    ],
                  ],
                  [
                    'Misc',
                    [
                      'Annotation scale　1:1',
                      'UCS icon On　　 Yes',
                      'UCS Name　　 World',
                      'Visual style　2D Wireframe',
                    ],
                  ],
                ]) {
                  const section = u.el('section', 'prop-section', _c.aside);
                  u.el('h4', '', section, '▾  ' + heading);
                  section.remove();
                }
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else {
                u.el('h3', '', _c.aside, C.aside || 'Instructions');
                if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction);
                else if (C.theme === 'crop-minimal')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.layout === 'palette') {
                  const ol = u.el('ol', 'guide', _c.aside);
                  for (const t of [
                    'Drag each handle to the target value.',
                    'Keep the lower value on the left and the higher value on the right.',
                    'Do not click on the track.',
                  ])
                    u.el('li', '', ol, t);
                }
              }
            }
          },
        'frame.23': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, endLabel, endPlacement, footer, note, u } = _c;
            const decoyBtn = (parent, label) => {
              const b = u.el('button', 'xtra-end', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label, collide: true });
              return b;
            };
            const endBtn = (parent, cls, tag, label) => {
              const b = u.el(tag, cls, parent, label);
              if (tag === 'a') b.href = '#';
              else b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            _c.headActions = null;
            if (ctx.display === 'header') {
              note.classList.add('instruction-title');
              _c.head.querySelector('.title').append(note);
            } else if (ctx.display === 'panel') {
              _c.aside.append(note);
            }
            if (!ctx.finish && (endPlacement === 'header' || (_c.collision && _c.collision.where === 'header'))) {
              content.classList.add('has-header-actions');
              _c.headActions = u.el('div', 'lisa-task-actions', content);
              if (endPlacement === 'header')
                _c.submit = endBtn(_c.headActions, 'submit submit-header', 'button', endLabel);
              if (_c.collision && _c.collision.where === 'header') decoyBtn(_c.headActions, _c.collision.label);
            }
            if (ctx.display === 'toast') {
              footer.prepend(note);
              note.querySelector('.note-close').setAttribute('aria-label', 'Dismiss task note');
            }
            if (!ctx.finish) {
              if (_c.collision && _c.collision.where === 'footer') decoyBtn(footer, _c.collision.label);
              if (endPlacement === 'footer') _c.submit = endBtn(footer, 'submit', 'button', endLabel);
              else if (endPlacement === 'link') _c.submit = endBtn(footer, 'submit submit-link', 'a', endLabel + ' ›');
            }
            Object.assign(_c, { decoyBtn, endBtn });
          },
      },
    },
  });
})();
