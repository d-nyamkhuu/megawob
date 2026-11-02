// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function aquaIcon(u, parent, name, cls) {
    const sidebarArt = {
      general: [63, 149, 34, 34],
      chat: [62, 205, 36, 35],
      appearance: [62, 261, 35, 35],
      bell: [62, 317, 35, 35],
      gear: [62, 373, 35, 35],
    };
    if (sidebarArt[name]) {
      const [x, y, w, h] = sidebarArt[name],
        icon = u.el('i', cls + ' reference-icon', parent);
      icon.setAttribute('aria-hidden', 'true');
      icon.style.setProperty('background-size', `${(1672 / w) * 100}% ${(941 / h) * 100}%`, 'important');
      icon.style.setProperty(
        'background-position',
        `${(x / (1672 - w)) * 100}% ${(y / (941 - h)) * 100}%`,
        'important',
      );
      return icon;
    }
    const svg = u.svg('svg', { class: cls, viewBox: '0 0 64 64', 'aria-hidden': 'true' }, parent);
    const defs =
      '<defs><linearGradient id="' +
      name +
      '-silver" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".45" stop-color="#c4cfdd"/><stop offset="1" stop-color="#728093"/></linearGradient><linearGradient id="' +
      name +
      '-blue" x2="0" y2="1"><stop stop-color="#d6f4ff"/><stop offset=".5" stop-color="#69b9f7"/><stop offset="1" stop-color="#1476dc"/></linearGradient><radialGradient id="' +
      name +
      '-glass" cx=".35" cy=".2" r=".8"><stop stop-color="#fff"/><stop offset=".4" stop-color="#d9e2ef"/><stop offset="1" stop-color="#8c99ac"/></radialGradient></defs>';
    const silver = 'url(#' + name + '-silver)',
      blue = 'url(#' + name + '-blue)',
      glass = 'url(#' + name + '-glass)';
    const icons = {
      general: `<rect x="10" y="8" width="43" height="45" rx="4" fill="${silver}" stroke="#5e6c85" stroke-width="4"/><path d="M21 46L32 17L43 46M18 15H22M45 15H49M18 47H22M45 47H49" fill="none" stroke="#8997ac" stroke-width="3"/><path d="M28 29L34 23L38 30L32 38Z" fill="#4c5e7a"/>`,
      chat: `<path d="M31 7C3 7 0 39 21 45L16 58L35 47C61 46 65 8 31 7Z" fill="${blue}" stroke="#277deb" stroke-width="3"/><path d="M13 21C17 11 42 10 50 20" fill="none" stroke="#fff" stroke-width="2"/>`,
      appearance: `<path d="M26 7L19 13L21 20C0 29 4 47 19 48L14 55H50L44 47C62 41 58 19 41 19L39 10Z" fill="${glass}" stroke="#64758e" stroke-width="3"/><path d="M25 14L29 21C8 28 10 42 25 44L22 51H42L38 44C56 34 50 25 36 24L34 13" fill="none" stroke="#fff" stroke-width="2"/>`,
      bell: `<path d="M15 43C20 35 15 18 29 15V9H35V15C49 18 44 35 50 43L54 48H10Z" fill="${glass}" stroke="#596b86" stroke-width="4"/><path d="M25 52Q32 61 39 52" fill="#697891"/><path d="M23 36V26Q23 21 29 20" fill="none" stroke="#fff" stroke-width="3"/>`,
      gear: `<path d="M27 4H37L39 14L46 17L54 12L61 20L54 28V36L61 43L54 52L45 47L39 50L37 60H27L24 50L17 47L9 52L3 43L10 36V28L3 20L10 12L19 17L25 14Z" fill="${glass}" stroke="#64748c" stroke-width="3"/><circle cx="32" cy="32" r="11" fill="#eaf0f8" stroke="#687891" stroke-width="4"/>`,
      wifi: `<path d="M7 22Q32 0 57 22M17 32Q32 17 47 32M27 41Q32 36 37 41" fill="none" stroke="#24364e" stroke-width="6"/><circle cx="32" cy="50" r="4" fill="#24364e"/>`,
      battery: `<rect x="4" y="17" width="49" height="29" rx="2" fill="none" stroke="#24364e" stroke-width="4"/><rect x="10" y="23" width="35" height="17" fill="#24364e"/><path d="M55 24H60V39H55" fill="#24364e"/>`,
      search: `<circle cx="26" cy="25" r="17" fill="none" stroke="#24364e" stroke-width="6"/><path d="M39 39L58 58" stroke="#24364e" stroke-width="7"/>`,
      drive: `<path d="M10 3H53L60 53L55 60H6L3 53Z" fill="${silver}" stroke="#4d596b" stroke-width="2"/><path d="M11 8H52L56 49H7Z" fill="${glass}" stroke="#67788d"/><ellipse cx="32" cy="31" rx="15" ry="12" fill="none" stroke="#738294" stroke-width="2"/><ellipse cx="32" cy="30" rx="8" ry="4" fill="${silver}"/><path d="M15 12H42M18 15H40M39 35L49 24" stroke="#4d5767" stroke-width="3"/><path d="M8 53H53M12 57H16M21 57H25" stroke="#1d2632" stroke-width="3"/><circle cx="48" cy="56" r="1.5" fill="#8fdf74"/>`,
      finder: `<rect x="4" y="7" width="54" height="48" fill="${blue}" stroke="#3d608c" stroke-width="2"/><path d="M31 8H58V55H27L31 36H25L32 8" fill="#ebf6ff"/><path d="M19 17V24M45 17V24M14 36Q29 47 49 35M38 3L31 21L29 34H38L37 48L41 60" fill="none" stroke="#1a293c" stroke-width="2.5"/>`,
      mail: `<g transform="rotate(-10 32 32)"><path d="M7 4H56V59H7Z" fill="#fff" stroke="#647890" stroke-width="2" stroke-dasharray="2 2"/><rect x="12" y="9" width="39" height="45" fill="#8caccb"/><path d="M25 13L36 12L39 31L47 41L44 49L34 46L31 40L24 35L20 26Z" fill="#826637" stroke="#5a462d"/><path d="M28 16L34 15L36 30L29 30Z" fill="#c8bb94"/><path d="M18 43L42 29M18 46L44 32" stroke="#f0dfbc" stroke-width="2"/><path d="M24 29L14 36L21 41L30 36L40 42L44 37L33 27" fill="#a28c57" stroke="#514429"/><path d="M22 35L28 33M25 37L31 35M35 33L38 37" stroke="#dac89a" stroke-width="1.5"/></g>`,
      safari: `<circle cx="32" cy="33" r="28" fill="${silver}" stroke="#4f5969" stroke-width="2"/><circle cx="32" cy="33" r="23" fill="${blue}" stroke="#fff" stroke-width="2"/><path d="M32 12V18M32 49V54M11 33H17M47 33H53M18 18L22 23M43 44L47 48M17 48L22 43M43 22L48 18" stroke="#fff" stroke-width="2"/><path d="M42 15L29 29L35 36Z" fill="#e9513f"/><path d="M23 44L35 36L29 29Z" fill="#fff" stroke="#53758c" stroke-width=".5"/><circle cx="32" cy="33" r="3" fill="#66768b"/><path d="M30 4V1H35V4" stroke="#bcc9da" stroke-width="3"/>`,
      calendar: `<g transform="rotate(-7 32 32)"><path d="M8 9H57V58H8Z" fill="#fff" stroke="#657285" stroke-width="2"/><path d="M8 9H57V25H8Z" fill="#e66343"/><path d="M18 3V14M46 3V14" stroke="#a5adbb" stroke-width="4"/><text x="32" y="21" text-anchor="middle" fill="white" font-size="10" font-family="Arial">JUN</text><text x="32" y="51" text-anchor="middle" fill="#232b39" font-size="32" font-family="Arial">16</text></g>`,
      notes: `<g transform="rotate(-7 32 32)"><rect x="9" y="6" width="47" height="53" rx="3" fill="#f8f6eb" stroke="#77818e" stroke-width="2"/><path d="M11 14H53" stroke="#e8cb67" stroke-width="6"/><path d="M22 23H49M22 31H49M22 39H49M22 47H49" stroke="#a6a9aa" stroke-width="2"/><path d="M15 22H18M15 30H18M15 38H18M15 46H18" stroke="#77899e" stroke-width="3"/></g>`,
      music: `<circle cx="32" cy="33" r="28" fill="${silver}" stroke="#5c6776" stroke-width="2"/><circle cx="32" cy="33" r="23" fill="#f6f9fc"/><path d="M27 42V19L43 15V37" fill="none" stroke="#536170" stroke-width="5"/><ellipse cx="22" cy="45" rx="8" ry="6" fill="#458cf0"/><ellipse cx="38" cy="40" rx="8" ry="6" fill="#458cf0"/>`,
      photos: `<g transform="rotate(-8 32 32)"><path d="M7 9H55V48H7Z" fill="#f8f9fc" stroke="#647182" stroke-width="2"/><path d="M12 14H50V42H12Z" fill="#75b1df"/><path d="M12 39L26 22L34 33L41 27L50 40" fill="#cad9e7"/><ellipse cx="30" cy="23" rx="4" ry="5" fill="#dbb394"/><path d="M23 40L25 28L35 28L39 40Z" fill="#294a70"/><path d="M27 19Q34 17 35 24" fill="none" stroke="#59442c" stroke-width="3"/><path d="M8 47L27 21L50 38L32 60Z" fill="#fff" stroke="#738397"/><path d="M13 45L29 27L44 39L30 55Z" fill="#aab9c8"/></g><rect x="34" y="34" width="27" height="23" rx="3" fill="${silver}" stroke="#495768"/><circle cx="47" cy="46" r="10" fill="#303945" stroke="#cbd8e9" stroke-width="2"/><circle cx="47" cy="46" r="6" fill="#667891"/><circle cx="44" cy="43" r="2" fill="#fff"/>`,
      trash: `<path d="M10 14L16 57Q32 65 49 57L55 14" fill="${silver}" stroke="#4a535d" stroke-width="2"/><path d="M15 20L49 53M14 29L45 59M19 18L51 46M31 17L53 37M49 20L18 53M51 29L23 60M42 18L16 45M31 17L13 34" stroke="#5a6573" stroke-width="1.5"/><ellipse cx="32" cy="14" rx="23" ry="8" fill="#c5d0db" stroke="#596372" stroke-width="2"/><ellipse cx="32" cy="14" rx="19" ry="5" fill="#344150"/><path d="M17 58Q32 64 48 58" stroke="#edf4ff" stroke-width="2" fill="none"/>`,
    };
    svg.innerHTML = defs + (icons[name] || '');
    return svg;
  }
  env.site({
    name: 'design-resize-element-numeric-10',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'windows',
        'theme': 'motif',
        'title': 'Document Editor',
        'menu': 'File    Edit    View    Insert    Format    Tools    Help',
        'aside': 'Notes',
        'foot': '',
        'accent': '#2f4a85',
        'bg': '#d6d3cc',
        'surface': '#d6d3cc',
        'font': "Helvetica,'Nimbus Sans','Liberation Sans',Arial,sans-serif",
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { body, u } = _c;
            const desktop = u.el('div', 'desktop-art', body);
            desktop.setAttribute('aria-hidden', 'true');
            Object.assign(_c, { desktop });
          },
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, head, shell, u } = _c;
            if (C.menu && C.theme === 'aqua') {
              const nav = u.el('nav', 'menu', head);
              const ap = u.svg('svg', { class: 'apple', width: 16, height: 19, viewBox: '0 0 16 19' }, nav);
              u.svg(
                'path',
                {
                  d: 'M11 1C10 1 9 2 8.500 3C9.500 3.200 11 2.500 11 1ZM8 4.500C6.500 4.500 5 3.500 3.500 4.500C1 6 1.500 11 3.500 14C4.500 15.500 5.500 17 7 17C7.800 17 8 16.500 9 16.500C10 16.500 10.200 17 11 17C12.500 17 13.500 15.500 14.500 14C13 13 12.500 9.500 14.500 8C13.500 6 11 4.500 8 4.500Z',
                  fill: '#222',
                },
                ap,
              );
              C.menu.split(/\s{2,}/).forEach((t, i) => {
                u.el('span', 'mi' + (i === 0 ? ' b' : ''), nav, t);
              });
              u.el('span', 'mi grow', nav, '');
              aquaIcon(u, nav, 'wifi', 'menu-icon');
              aquaIcon(u, nav, 'battery', 'menu-icon');
              u.el('span', 'mi clock', nav, 'Mon 10:24 AM');
              aquaIcon(u, nav, 'search', 'menu-icon');
            } else if (C.menu && C.theme === 'motif') {
              const nav = u.el('nav', 'menu', head);
              C.menu.split(/\s{2,}/).forEach((t) => {
                const sp = u.el('span', 'mi' + (t === 'Help' ? ' help' : ''), nav);
                sp.append(t.charAt(0).toUpperCase() === t.charAt(0) ? '' : '');
                const f = u.el('u', '', sp, t.charAt(0));
                sp.append(t.slice(1));
                if (t === 'Help') {
                  sp.textContent = t;
                }
              });
            } else if (C.menu) u.el('nav', 'menu', head, C.menu);
            if (C.theme === 'aqua') {
              const side = u.el('div', 'sidebar', shell);
              side.dataset.decor = 'sidebar';
              ['General', 'Chat Panel', 'Appearance', 'Notifications', 'Advanced'].forEach((t, i) => {
                const it = u.el('div', 'side-item' + (i === 1 ? ' sel' : ''), side);
                aquaIcon(u, it, ['general', 'chat', 'appearance', 'bell', 'gear'][i], 'side-ico ico' + i);
                u.el('span', '', it, t);
              });
              const dock = u.el('div', 'dock', body);
              const hd = u.el('div', 'hd-icon', body);
              aquaIcon(u, hd, 'drive', 'drive-art');
              u.el('span', '', hd, 'Macintosh HD');
              for (let i = 0; i < 8; i++)
                aquaIcon(
                  u,
                  dock,
                  ['finder', 'mail', 'safari', 'calendar', 'notes', 'music', 'photos', 'trash'][i],
                  'dk dk' + i,
                );
            }
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, note, u } = _c;
            if (C.theme === 'aqua')
              u.el('div', 'instruction-sub', note, 'Drag the panel’s resize handle until it matches the target size.');
            if (ctx.display === 'hidden') note.hidden = true;
            else if (ctx.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
            if (C.theme === 'motif') {
              const doc = u.el('div', 'mdoc', content);
              doc.setAttribute('aria-hidden', 'true');
              const dt = u.el('div', 'mdoc-title', doc);
              u.el('span', 'mdoc-ico', dt);
              u.el('span', '', dt, 'Project Notes.txt');
              const buttons = u.el('span', 'mdoc-btns', dt);
              for (const glyph of ['−', '×']) u.el('span', 'mwindow-button', buttons, glyph);
              const db = u.el('div', 'mdoc-body', doc);
              u.el('h2', '', db, 'Project Notes');
              u.el('hr', '', db);
              u.el('div', 'mh', db, 'Timeline');
              const ul = u.el('ul', '', db);
              for (const t of ['Draft proposal', 'Review feedback', 'Finalize plan']) u.el('li', '', ul, t);
              u.el('div', 'mh sp', db, 'Next Steps');
              const ol = u.el('ol', '', db);
              for (const t of ['Confirm resources', 'Schedule meeting', 'Share updated document'])
                u.el('li', '', ol, t);
              const sb = u.el('div', 'mdoc-sb', doc);
              u.el('span', 'up', sb, '▲');
              u.el('span', 'dn', sb, '▼');
            }
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { stage });
          },
        'frame.19': () => () => {},
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
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else if (C.theme === 'motif') {
                const P = [
                  'M6 2H20L26 8V30H6Z',
                  'M6 4H26V28H6ZM10 10H22M10 14H22M10 18H22M10 22H22',
                  'M5 5H27V27H5Z',
                  'M14 5A9 9 0 1 0 14 23A9 9 0 1 0 14 5ZM21 21L29 29',
                  '',
                ];
                P.forEach((d, i) => {
                  const bt = u.el('button', 'mtool' + (i === 4 ? ' fill' : '') + (i === 3 ? ' sep' : ''), _c.aside);
                  bt.type = 'button';
                  bt.setAttribute('aria-label', 'Tool ' + (i + 1));
                  if (d) {
                    const sv = u.svg(
                      'svg',
                      { width: 30, height: 30, viewBox: '0 0 32 32', fill: 'none', stroke: '#222', 'stroke-width': 2 },
                      bt,
                    );
                    u.svg('path', { d, 'stroke-dasharray': i === 2 ? '3 3' : 'none' }, sv);
                  }
                });
              } else if (C.theme === 'aqua') {
                const tb = u.el('div', 'n-title', _c.aside);
                const dd = u.el('span', 'n-dots', tb);
                for (let i = 0; i < 3; i++) u.el('i', '', dd);
                u.el('span', '', tb, 'Notes');
                const pad = u.el('div', 'n-body', _c.aside);
                u.el('h4', '', pad, 'Steps');
                const ol = u.el('ol', '', pad);
                for (const t of [
                  'Drag the resize handle of the panel.',
                  'Match the target width and height (±6 px).',
                ]) {
                  u.el('li', '', ol, t);
                }
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
            if (C.theme === 'motif' && _c.aside) {
              const icon = _c.aside.querySelector('svg');
              if (icon) u.svg('path', { d: 'M20 2V8H26' }, icon);
            }
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const er = ctx.rng.fork('chrome/end');
            const referenceEnd = er.bool(0.5);
            const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'tools']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels.filter((x) => x !== 'Submit'));
            const nav = head.querySelector('.menu'),
              help = nav.querySelector('.help');
            const endTools = u.el('div', 'm-end-tools', null);
            nav.insertBefore(endTools, help);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'toolbar' ? endTools : placement === 'tools' ? _c.aside : footer;
              _c.submit = u.el(
                'button',
                'submit' + (placement === 'footer' ? '' : ' m-end-' + placement),
                parent,
                endLabel,
              );
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const label = cr.pick(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()));
              const decoy = u.el('button', 'm-xtra', endTools, label);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label, collide: true });
            }
            Object.assign(_c, { cr, endLabel, endLabels, endTools, er, help, labelOf, nav, placement, referenceEnd });
          },
        'frame.27': () => () => {},
        'frame.29': (base, S) =>
          function (_c) {
            const { C } = S;
            const { footer, u } = _c;
            if (['aqua', 'collage', 'motif'].includes(C.theme)) {
              const reset = u.el(
                'button',
                'clear',
                footer,
                C.theme === 'aqua' ? 'Reset Panel' : C.theme === 'motif' ? 'Reset Layout' : 'Reset',
              );
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.submit && _c.submit.parentElement === footer) footer.insertBefore(reset, _c.submit);
            }
          },
      },
    },
  });
})();
