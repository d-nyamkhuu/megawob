// site/click-point-bisect-03: site template generated from the site.js of design-click-point-bisect-03, of which many
// design-* sites were restyled copies; they are designs on it (templates/README.md, "Generated site templates"). The
// defaults (design {}) reproduce design-click-point-bisect-03. Tokens (each replaced whole): C, IC. Parts: sculpt,
// frame, chromeOld, overlay, and the sections of frame() ('frame.1'..'frame.48'), chromeOld()
// ('chromeOld.1'..'chromeOld.28'), overlay() ('overlay.1'..'overlay.16'): one per statement of the original body, run
// in order.
(function () {
  'use strict';

  const TOKENS = {
    C: {
      "layout": "ribbon",
      "theme": "eink",
      "title": "Angle Practice",
      "ribbon": true,
      "foot": "Click a point in the workspace to place a marker.",
      "accent": "#111",
      "bg": "#eeede9",
      "surface": "#f2f1ed",
      "font": "Georgia, serif"
    },
    IC: {
      Select: 'M5 3V25L11 20L15 28L19 26L15 18H23Z',
      Point: 'M16 16m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
      Line: 'M6 26L26 6',
      Ray: 'M6 26L24 8M17 7H25V15',
      Circle: 'M16 16m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
      Move: 'M16 3V29M3 16H29M16 3L12 8M16 3L20 8M16 29L12 24M16 29L20 24M3 16L8 12M3 16L8 20M29 16L24 12M29 16L24 20',
      Zoom: 'M13 4a9 9 0 1 0 0.1 0ZM20 20L28 28',
      Fit: 'M6 10L16 5L26 10V22L16 27L6 22ZM6 10L16 15L26 10M16 15V27',
      Center: 'M6 10L16 5L26 10V22L16 27L6 22ZM6 10L16 15L26 10M16 15V27',
      Grid: 'M5 5H27V27H5ZM5 11H27M5 16H27M5 21H27M11 5V27M16 5V27M21 5V27'
    },
  };

  const sculptParts = (S) => ({
    sculpt: function sculpt(u, s, name) {
      const defs = u.svg('defs', {}, s), id = 'tool-' + name;
      const grad = u.svg('linearGradient', {
        id,
        x1: '0%',
        y1: '0%',
        x2: '90%',
        y2: '100%'
      }, defs);
      for (const [offset, color] of [['0%', '#f0f0ff'], ['32%', '#aaaed3'], ['65%', '#757d9e'], ['100%', '#303a55']]) u.svg('stop', {
        offset,
        'stop-color': color
      }, grad);
      const shine = u.svg('radialGradient', {
        id: id + '-sphere',
        cx: '28%',
        cy: '23%',
        r: '80%'
      }, defs);
      for (const [offset, color] of [['0%', '#f4f2ff'], ['35%', '#b8badd'], ['72%', '#7d86a7'], ['100%', '#30394e']]) u.svg('stop', {
        offset,
        'stop-color': color
      }, shine);
      const p = (d, attrs = {}) => u.svg('path', {
        d,
        fill: 'url(#' + id + ')',
        stroke: '#30384e',
        'stroke-width': 2,
        'stroke-linejoin': 'round',
        ...attrs
      }, s);
      if (name === 'Point' || name === 'Circle') u.svg('circle', {
        cx: 32,
        cy: 32,
        r: name === 'Point' ? 11 : 24,
        fill: 'url(#' + id + '-sphere)',
        stroke: '#30384e',
        'stroke-width': 2
      }, s); else if (name === 'Select') {
        p('M10 6L50 31L34 35L45 53L37 58L26 40L20 53Z');
        p('M12 9L28 35L47 31', {
          fill: 'none',
          stroke: '#aeb2e4',
          'stroke-width': 1.5
        });
      } else if (name === 'Line' || name === 'Ray') {
        p(name === 'Line' ? 'M9 52L51 9Q56 6 58 10Q60 12 56 16L15 58Q9 61 7 57Q6 54 9 52Z' : 'M8 52L42 18L35 16L59 7L50 31L48 24L15 58Q10 61 7 57Q6 55 8 52Z');
        p('M11 53L' + (name === 'Line' ? '54 10' : '46 18'), {
          fill: 'none',
          stroke: '#f0efff',
          'stroke-width': 2
        });
      } else if (name === 'Fit' || name === 'Center') {
        p('M10 22L23 10H54L41 22Z', {
          stroke: 'none',
          fill: '#b5b3e3'
        });
        p('M10 22H41V54H10Z', {
          stroke: 'none'
        });
        p('M41 22L54 10V42L41 54Z', {
          fill: '#4d5976',
          stroke: 'none'
        });
        p('M10 22L25 39L41 22L25 10Z', {
          fill: '#929bc5',
          stroke: 'none',
          opacity: .6
        });
        p('M10 54L25 39L41 54Z', {
          fill: '#414b68',
          stroke: 'none',
          opacity: .55
        });
        p('M10 22H41V54H10ZM41 22L54 10V42L41 54M10 22L23 10H54', {
          fill: 'none',
          stroke: '#6a7291',
          'stroke-width': 1
        });
      } else if (name === 'Move') {
        p('M32 3L44 17H37V27H47V20L61 32L47 44V37H37V47H44L32 61L20 47H27V37H17V44L3 32L17 20V27H27V17H20Z');
        p('M32 8V32H8M32 32H54M32 32V54', {
          fill: 'none',
          stroke: '#d5d6ed',
          'stroke-width': 2
        });
      } else if (name === 'Zoom') {
        p('M38 37L57 53Q60 57 56 60L52 59L35 41Z', {
          fill: '#6977ae'
        });
        u.svg('circle', {
          cx: 25,
          cy: 25,
          r: 16,
          fill: 'none',
          stroke: '#404660',
          'stroke-width': 6
        }, s);
        u.svg('circle', {
          cx: 24,
          cy: 24,
          r: 16,
          fill: 'none',
          stroke: '#cccde5',
          'stroke-width': 3
        }, s);
      } else if (name === 'Grid') {
        p('M5 5H59V59H5Z', {
          stroke: '#50576c',
          'stroke-width': 1
        });
        for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
          const x = 5 + i * 11, y = 5 + j * 13.5;
          u.svg('rect', {
            x,
            y,
            width: 10,
            height: 12.5,
            fill: '#9ba6bf',
            stroke: '#172333',
            'stroke-width': 1.8
          }, s);
          p('M' + x + ' ' + (y + 12) + 'V' + y + 'H' + (x + 10), {
            fill: 'none',
            stroke: '#d1d5e6',
            'stroke-width': 1.4
          });
        }
      }
    },
  });

  const frameHeaderParts = (S) => ({
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 48; i++) {
        const r = S[`frame.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'frame.1': function (_c) {
      const {ctx} = _c;
      const u = ctx.util, body = document.body;
      Object.assign(_c, {
        body,
        u
      });
    },
    'frame.2': function (_c) {
      const {body, ctx} = _c;
      body.className = 'design irix' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    },
    'frame.3': function (_c) {
      const root = document.documentElement;
      Object.assign(_c, {
        root
      });
    },
    'frame.4': function (_c) {
      const {root} = _c;
      for (const [k, v] of Object.entries({
        bg: '#8f93ad',
        panel: '#323c52',
        fg: '#ffffff',
        muted: '#c9cbe8',
        line: '#4a5570',
        accent: '#9a96e8'
      })) root.style.setProperty('--' + k, v);
    },
    'frame.5': function (_c) {
      const {root} = _c;
      root.style.setProperty('--font', '"Arial Narrow","Liberation Sans Narrow",Arial,sans-serif');
    },
    'frame.6': function (_c) {
      const {body, u} = _c;
      const shell = u.el('div', 'shell', body), head = u.el('header', 'head', shell);
      Object.assign(_c, {
        head,
        shell
      });
    },
    'frame.7': function (_c) {
      const {head, u} = _c;
      const tb = u.el('div', 'titlebar', head);
      Object.assign(_c, {
        tb
      });
    },
    'frame.8': function (_c) {
      const {tb, u} = _c;
      u.el('span', 'tb-box', tb);
    },
    'frame.9': function (_c) {
      const {tb, u} = _c;
      u.el('span', 'tb-title', tb, '+GeoDesk 2.1  —  Geometry Workspace');
    },
    'frame.10': function (_c) {
      const {tb, u} = _c;
      u.el('span', 'tb-irix', tb, 'IRIX');
    },
    'frame.11': function (_c) {
      const {head, u} = _c;
      const mb = u.el('nav', 'menubar', head);
      Object.assign(_c, {
        mb
      });
    },
    'frame.12': function (_c) {
      const {mb, u} = _c;
      for (const m of ['File', 'Edit', 'View', 'Construct', 'Measure', 'Help']) {
        const item = u.el('span', 'mi', mb, m);
        if (m === 'Edit') {
          const menu = u.el('div', 'edit-menu', item);
          menu.hidden = true;
          const clear = u.el('button', 'clear', menu, 'Clear');
          clear.type = 'button';
          clear.onclick = e => {
            e.stopPropagation();
            env.widgetDef.clear?.();
            menu.hidden = true;
          };
          item.onclick = () => menu.hidden = !menu.hidden;
        }
      }
    },
    'frame.13': function (_c) {
      const {mb, u} = _c;
      u.el('span', 'clock', mb, 'Tue Apr 22  10:24 AM');
    },
  });

  const frameWorkspaceParts = (S) => ({
    'frame.14': function (_c) {
      const {shell, u} = _c;
      const content = u.el('div', 'content', shell), note = u.el('section', 'task-note', content);
      Object.assign(_c, {
        content,
        note
      });
    },
    'frame.15': function (_c) {
      const {ctx, note, u} = _c;
      u.el('div', 'instruction', note, ctx.instruction);
    },
    'frame.16': function (_c) {
      const {ctx, note, u} = _c;
      if (ctx.display === 'hidden') note.hidden = true; else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => note.style.visibility = 'hidden';
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    },
    'frame.17': function (_c) {
      const {content, u} = _c;
      const stage = u.el('main', 'stage', content);
      Object.assign(_c, {
        stage
      });
    },
    'frame.18': function (_c) {
      const {stage} = _c;
      stage.dataset.role = 'stage';
    },
    'frame.19': function (_c) {
      const {ctx, stage} = _c;
      if (ctx.display === 'panel') stage.classList.add('stage-panel');
    },
    'frame.20': function (_c) {
      const {ctx, stage} = _c;
      if (ctx.display === 'toast') stage.classList.add('stage-toast');
    },
    'frame.21': function (_c) {
      const {shell, u} = _c;
      const footer = u.el('footer', 'footer', shell);
      Object.assign(_c, {
        footer
      });
    },
    'frame.22': function (_c) {
      const {sculpt} = S;
      const {footer, u} = _c;
      const tool = (parent, name, sel) => {
        const w = u.el('div', 'tw', parent);
        const bt = u.el('button', 'tbtn' + (sel ? ' sel' : ''), w);
        bt.type = 'button';
        bt.setAttribute('aria-label', name);
        const s = u.svg('svg', {
          width: 64,
          height: 64,
          viewBox: '0 0 64 64'
        }, bt);
        sculpt(u, s, name);
        u.el('span', 'tl' + (sel ? ' sel' : ''), w, name);
        bt.onclick = () => {
          footer.querySelectorAll('.tbtn.sel').forEach(x => x.classList.remove('sel'));
          footer.querySelectorAll('.tl.sel').forEach(x => x.classList.remove('sel'));
          bt.classList.add('sel');
          w.querySelector('.tl').classList.add('sel');
        };
      };
      Object.assign(_c, {
        tool
      });
    },
    'frame.23': function (_c) {
      const {footer, u} = _c;
      const g1 = u.el('div', 'grp g-tools', footer);
      Object.assign(_c, {
        g1
      });
    },
    'frame.24': function (_c) {
      const {g1, u} = _c;
      u.el('div', 'gt', g1, 'Tools');
    },
    'frame.25': function (_c) {
      const {g1, u} = _c;
      const r1 = u.el('div', 'row', g1);
      Object.assign(_c, {
        r1
      });
    },
    'frame.26': function (_c) {
      const {r1, tool} = _c;
      ['Select', 'Point', 'Line', 'Ray', 'Circle', 'Move', 'Zoom'].forEach((n, i) => tool(r1, n, i === 0));
    },
    'frame.27': function (_c) {
      const {footer, u} = _c;
      const g2 = u.el('div', 'grp g-view', footer);
      Object.assign(_c, {
        g2
      });
    },
    'frame.28': function (_c) {
      const {g2, u} = _c;
      u.el('div', 'gt', g2, 'View');
    },
    'frame.29': function (_c) {
      const {g2, u} = _c;
      const r2 = u.el('div', 'row', g2);
      Object.assign(_c, {
        r2
      });
    },
    'frame.30': function (_c) {
      const {r2, tool} = _c;
      ['Fit', 'Center', 'Grid'].forEach(n => tool(r2, n, false));
    },
  });

  const frameOptionsParts = (S) => ({
    'frame.31': function (_c) {
      const {footer, u} = _c;
      const g3 = u.el('div', 'grp g-opt', footer);
      Object.assign(_c, {
        g3
      });
    },
    'frame.32': function (_c) {
      const {g3, u} = _c;
      u.el('div', 'gt', g3, 'Options');
    },
    'frame.33': function (_c) {
      const {g3, u} = _c;
      for (const [t, c] of [['Show labels', 1], ['Show dotted circle', 1], ['Snap to grid', 0]]) {
        const l = u.el('label', 'opt', g3);
        const cb = u.el('input', '', l);
        cb.type = 'checkbox';
        cb.checked = !!c;
        u.el('span', '', l, t);
      }
    },
    'frame.34': function (_c) {
      const {footer, u} = _c;
      const g4 = u.el('div', 'grp g-sub', footer);
      Object.assign(_c, {
        g4
      });
    },
    'frame.35': function (_c) {
      _c.submit = null;
    },
    'frame.36': function (_c) {
      const {ctx} = _c;
      const endRng = ctx.rng.fork('chrome/end'), endBank = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      Object.assign(_c, {
        endBank,
        endRng
      });
    },
    'frame.37': function (_c) {
      const labelOf = x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      Object.assign(_c, {
        labelOf
      });
    },
    'frame.38': function (_c) {
      const {endBank, endRng, labelOf} = _c;
      const label = endRng.bool(.52) ? 'Submit' : labelOf(endRng.pick(endBank.filter(x => labelOf(x).toLowerCase() !== 'submit').length ? endBank.filter(x => labelOf(x).toLowerCase() !== 'submit') : endBank));
      Object.assign(_c, {
        label
      });
    },
    'frame.39': function (_c) {
      const {endRng} = _c;
      const placement = endRng.pick(['dock', 'dock', 'dock', 'header', 'options', 'link']);
      Object.assign(_c, {
        placement
      });
    },
    'frame.40': function (_c) {
      const {ctx} = _c;
      const collisionRng = ctx.rng.fork('chrome/collide');
      Object.assign(_c, {
        collisionRng
      });
    },
    'frame.41': function (_c) {
      _c.collide = null;
    },
    'frame.42': function (_c) {
      const {collisionRng, endBank, label, labelOf} = _c;
      if (collisionRng.bool(.3)) {
        const pool = endBank.map(labelOf).filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) _c.collide = labelOf(collisionRng.pick(pool));
      }
    },
  });

  const frameEndParts = (S) => ({
    'frame.43': function (_c) {
      const {ctx, u} = _c;
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.onclick = () => ctx.submit();
        return b;
      };
      Object.assign(_c, {
        endButton
      });
    },
    'frame.44': function (_c) {
      const {u} = _c;
      const decoyButton = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', {
          label: text,
          collide: true
        });
        return b;
      };
      Object.assign(_c, {
        decoyButton
      });
    },
    'frame.45': function (_c) {
      const {decoyButton, mb} = _c;
      if (_c.collide) {
        const b = decoyButton(mb, _c.collide);
        mb.insertBefore(b, mb.querySelector('.clock'));
      }
    },
    'frame.46': function (_c) {
      const {ctx, endButton, g3, g4, label, mb, placement, u} = _c;
      if (!ctx.finish) {
        if (placement === 'header') {
          _c.submit = endButton(mb, 'submit end-header', label);
          mb.insertBefore(_c.submit, mb.querySelector('.clock'));
        } else if (placement === 'options') _c.submit = endButton(g3, 'submit end-options', label); else if (placement === 'link') {
          const a = u.el('a', 'end-link', g4, label + ' ›');
          a.href = '#';
          a.dataset.role = 'submit';
          a.setAttribute('aria-label', label);
          a.title = label;
          a.onclick = e => {
            e.preventDefault();
            ctx.submit();
          };
          _c.submit = a;
        } else _c.submit = endButton(g4, 'submit', label);
      } else u.el('span', 'finish-ready', g4, 'Ready');
    },
    'frame.47': function (_c) {
      const {note, stage} = _c;
      if (!note.hidden) {
        const instruction = note.querySelector('.instruction');
        const wrapped = instruction.getBoundingClientRect().height > parseFloat(getComputedStyle(instruction).lineHeight) * 1.5;
        const n = note.getBoundingClientRect(), s = stage.getBoundingClientRect();
        if (wrapped && n.left < s.right && n.right > s.left && n.top < s.bottom && n.bottom > s.top) {
          stage.style.top = stage.offsetTop + n.bottom - s.top + 8 + 'px';
        }
      }
    },
    'frame.48': function (_c) {
      const {stage} = _c;
      return {
        stage,
        submit: _c.submit
      };
    },
  });

  const legacyHeaderParts = (S) => ({
    frameOld: function frameOld(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 28; i++) {
        const r = S[`frameOld.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'frameOld.1': function (_c) {
      const {ctx} = _c;
      const u = ctx.util, body = document.body;
      Object.assign(_c, {
        body,
        u
      });
    },
    'frameOld.2': function (_c) {
      const {C} = S;
      const {body, ctx} = _c;
      body.className = 'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    },
    'frameOld.3': function (_c) {
      const root = document.documentElement;
      Object.assign(_c, {
        root
      });
    },
    'frameOld.4': function (_c) {
      const {C} = S;
      const {root} = _c;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: C.theme === 'developer' ? '#eff4ff' : '#111820',
        muted: C.theme === 'developer' ? '#8b9aaf' : '#657080',
        line: C.theme === 'developer' ? '#283544' : '#c9cfd5',
        accent: C.accent
      })) root.style.setProperty('--' + k, v);
    },
    'frameOld.5': function (_c) {
      const {C} = S;
      const {root} = _c;
      root.style.setProperty('--font', C.font);
    },
    'frameOld.6': function (_c) {
      const {body, u} = _c;
      const shell = u.el('div', 'shell', body), head = u.el('header', 'head', shell);
      Object.assign(_c, {
        head,
        shell
      });
    },
    'frameOld.7': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk'].includes(C.theme)) {
        const controls = u.el('div', 'window-controls', head);
        for (const label of ['−', '□', '×']) {
          const bt = u.el('button', '', controls, label);
          bt.type = 'button';
          bt.onclick = () => env.log('window-control', {
            label
          });
        }
      }
    },
    'frameOld.8': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (C.title) u.el('div', 'title', head, C.title);
    },
    'frameOld.9': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
    },
    'frameOld.10': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (C.menu) u.el('nav', 'menu', head, C.menu);
    },
  });

  const legacyRibbonParts = (S) => ({
    'frameOld.11': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (C.ribbon) {
        const rib = u.el('div', 'ribbon', head);
        const tool = (parent, name, path) => {
          path = ({
            'Add Point': 'M4 2V28L12 20L18 30L23 27L17 18H29Z',
            'Erase': 'M5 20L21 3L30 12L14 29H8ZM5 20L14 29M15 10L24 19',
            'Undo': 'M13 5L3 14L13 22V16H21Q28 16 29 28Q32 9 21 9H13Z',
            'Redo': 'M19 5L29 14L19 22V16H11Q4 16 3 28Q0 9 11 9H19Z',
            'Settings': 'M13 2H19L20 7L24 9L29 7L32 13L28 17V21L31 25L27 30L22 28L18 30L17 34H11L10 29L6 27L2 29L-1 23L3 19V15L0 11L4 6L9 8L13 6ZM22 17A6 6 0 1 1 10 17A6 6 0 1 1 22 17',
            'About': 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M16 13V24M16 7V9',
            'Rectangle': 'M4 4H28V28H4Z',
            'Fit to Window': 'M4 4H28V28H4ZM8 8L13 13M24 8L19 13M8 24L13 19M24 24L19 19M8 13V8H13M19 8H24V13M8 19V24H13M19 24H24V19'
          })[name] || path;
          const bt = u.el('button', 'tool', parent);
          bt.type = 'button';
          const icon = u.svg('svg', {
            width: 32,
            height: 34,
            viewBox: '0 0 32 32',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.8
          }, bt);
          u.svg('path', {
            d: path
          }, icon);
          u.el('span', '', bt, name);
          bt.onclick = () => {
            rib.querySelectorAll('.tool').forEach(x => x.classList.remove('selected'));
            bt.classList.add('selected');
          };
          return bt;
        };
        const groups = C.theme === 'eink' ? ['Tools', 'View', 'Style', 'Help'] : C.theme === 'office' ? ['Navigate', 'Draw', 'Edit', 'Options'] : ['Navigation', 'Draw', 'Options', 'Support'];
        for (const [j, name] of groups.entries()) {
          const gr = u.el('div', 'tool-group', rib);
          if (j === 0) {
            for (const t of ['Select', 'Pan', 'Zoom In', 'Zoom Out', C.theme === 'office' ? 'Fit to Window' : 'Reset View']) {
              const path = t === 'Select' ? 'M4 2V28L12 20L18 30L23 27L17 18H29Z' : t === 'Pan' ? 'M9 28L3 16Q2 12 6 13L11 18V5Q13 1 15 5V15V3Q18 0 19 4V15V6Q22 3 23 7V17V11Q27 7 28 12V23L23 30Z' : t === 'Reset View' ? 'M6 9A13 13 0 1 1 4 22M6 2V10H15' : 'M22 22L30 30M25 14A11 11 0 1 1 3 14A11 11 0 1 1 25 14M8 14H20' + (t === 'Zoom In' ? 'M14 8V20' : '');
              tool(gr, t, path);
            }
          } else if (C.theme === 'eink' && j === 1 || C.theme === 'vista' && j === 2) {
            for (const label of C.theme === 'eink' ? ['Show Labels', 'Show Dotted Circle', 'Show Grid'] : ['Show Grid', 'Snap to Grid', 'Show Measurements']) {
              const l = u.el('label', 'check-tool', gr);
              const input = u.el('input', '', l);
              input.type = 'checkbox';
              input.checked = label === 'Show Labels' || label === 'Show Dotted Circle' || label === 'Show Grid' && C.theme === 'vista';
              u.el('span', '', l, label);
            }
          } else if (C.theme === 'eink' && j === 2) {
            for (const [title, values] of [['Line Thickness', ['2', '1', '3']], ['Dashed Style', ['Dotted', 'Dashed', 'Solid']]]) {
              const l = u.el('label', 'style-tool', gr, title);
              const select = u.el('select', '', l);
              for (const v of values) u.el('option', '', select, v);
            }
          } else {
            let names = C.theme === 'eink' ? ['Instructions', 'Example'] : C.theme === 'office' ? j === 1 ? ['Add Point', 'Add Circle', 'Add Line', 'Erase'] : j === 2 ? ['Undo', 'Redo'] : ['Settings'] : j === 1 ? ['Line', 'Circle', 'Rectangle', 'Point'] : ['Help', 'About'];
            for (const t of names) tool(gr, t, t.includes('Circle') ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16' : t.includes('Line') ? 'M3 29L29 3' : t === 'Point' ? 'M19 16A3 3 0 1 1 13 16A3 3 0 1 1 19 16' : t === 'Example' ? 'M6 2H20L27 9V30H6ZM20 2V10H27M10 15H23M10 20H23M10 25H21' : t === 'Instructions' || t === 'Help' ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M12 10Q12 5 17 6Q23 8 17 14L16 19M16 23V25' : 'M5 5H27V27H5ZM10 16L14 20L23 10');
          }
          u.el('small', '', gr, name);
        }
      }
    },
  });

  const legacyWorkspaceParts = (S) => ({
    'frameOld.12': function (_c) {
      const {shell, u} = _c;
      const content = u.el('div', 'content', shell), note = u.el('section', 'task-note', content);
      Object.assign(_c, {
        content,
        note
      });
    },
    'frameOld.13': function (_c) {
      const {C} = S;
      const {note, u} = _c;
      u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
    },
    'frameOld.14': function (_c) {
      const {ctx, note, u} = _c;
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      Object.assign(_c, {
        instruction
      });
    },
    'frameOld.15': function (_c) {
      const {C} = S;
      const {note, u} = _c;
      if (C.theme === 'memphis') {
        u.el('h1', 'brief-title', note, C.title);
        note.prepend(note.lastChild);
        u.el('p', 'brief-copy', note, 'Drag and drop the months on the right to arrange them from January to December.');
      }
    },
    'frameOld.16': function (_c) {
      const {C} = S;
      const {note, u} = _c;
      if (C.theme === 'minimal') {
        const steps = u.el('ol', 'steps', note);
        for (const text of ['Drag the shape from its current position.', 'Drop it inside the rectangular box.', 'The shape must fit fully inside the box.']) u.el('li', '', steps, text);
        u.el('h3', '', note, 'Notes');
        u.el('p', 'brief-copy', note, 'Use your mouse or trackpad (pointer) to move the shape. Do not resize the shape.');
      }
    },
    'frameOld.17': function (_c) {
      const {ctx, note, u} = _c;
      if (ctx.display === 'hidden') note.hidden = true; else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => note.style.visibility = 'hidden';
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    },
    'frameOld.18': function (_c) {
      const {content, u} = _c;
      const stage = u.el('main', 'stage', content);
      Object.assign(_c, {
        stage
      });
    },
    'frameOld.19': function (_c) {
      const {stage} = _c;
      stage.dataset.role = 'stage';
    },
    'frameOld.20': function (_c) {
      _c.aside = null;
    },
    'frameOld.21': function (_c) {
      const {C} = S;
      const {content, ctx, u} = _c;
      if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
        _c.aside = u.el('aside', 'aside', content);
        if (C.tabs) {
          _c.aside.classList.add('tabs');
          for (const text of C.tabs) {
            const bt = u.el('button', 'tab', _c.aside, text);
            bt.type = 'button';
            bt.onclick = () => {
              _c.aside.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
              bt.classList.add('active');
            };
          }
        } else if (C.layout === 'sheet') {
          for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
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
            u.el('progress', '', _c.aside).value = .2;
            u.el('h3', '', _c.aside, 'Tips');
            u.el('p', '', _c.aside, 'Click outside the dotted circle.');
          } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction); else if (C.theme === 'crop-minimal') u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.'); else if (C.layout === 'palette') {
            const ol = u.el('ol', 'guide', _c.aside);
            for (const t of ['Drag each handle to the target value.', 'Keep the lower value on the left and the higher value on the right.', 'Do not click on the track.']) u.el('li', '', ol, t);
          }
        }
      }
    },
  });

  const legacyFooterParts = (S) => ({
    'frameOld.22': function (_c) {
      const {shell, u} = _c;
      const footer = u.el('footer', 'footer', shell);
      Object.assign(_c, {
        footer
      });
    },
    'frameOld.23': function (_c) {
      const {C} = S;
      const {footer, u} = _c;
      u.el('div', 'footer-copy', footer, C.foot || '');
    },
    'frameOld.24': function (_c) {
      _c.submit = null;
    },
    'frameOld.25': function (_c) {
      const {C} = S;
      const {ctx, footer, u} = _c;
      if (!ctx.finish) {
        const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
        _c.submit = u.el('button', 'submit', parent, 'Submit');
        _c.submit.type = 'button';
        _c.submit.dataset.role = 'submit';
        _c.submit.onclick = () => ctx.submit();
      }
    },
    'frameOld.26': function (_c) {
      const {C} = S;
      const {footer, u} = _c;
      if (C.theme === 'eink') {
        const points = u.el('span', 'points', footer, 'Points: 0/1');
        footer.insertBefore(points, _c.submit);
        const clear = u.el('button', 'clear', footer, 'Clear');
        clear.onclick = () => {
          env.widgetDef.clear?.();
        };
      }
    },
    'frameOld.27': function (_c) {
      const {C} = S;
      const {footer, u} = _c;
      if (['aqua', 'collage'].includes(C.theme)) {
        const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
        reset.onclick = () => env.widgetDef.clear?.();
        if (_c.submit) footer.insertBefore(reset, _c.submit);
      }
    },
    'frameOld.28': function (_c) {
      const {stage} = _c;
      return {
        stage,
        submit: _c.submit
      };
    },
  });

  const overlayContentParts = (S) => ({
    overlay: function overlay(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 16; i++) {
        const r = S[`overlay.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'overlay.1': function (_c) {
      const {ctx} = _c;
      const u = ctx.util, kind = ctx.kind;
      Object.assign(_c, {
        kind,
        u
      });
    },
    'overlay.2': function (_c) {
      const {kind, u} = _c;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      Object.assign(_c, {
        el
      });
    },
    'overlay.3': function (_c) {
      const {el} = _c;
      el.dataset.role = 'overlay';
    },
    'overlay.4': function (_c) {
      const {el, u} = _c;
      const box = u.el('div', 'obstruction-box', el);
      Object.assign(_c, {
        box
      });
    },
    'overlay.5': function (_c) {
      ;
    },
    'overlay.6': function (_c) {
      const {C} = S;
      const o = C.ob;
      Object.assign(_c, {
        o
      });
    },
    'overlay.7': function (_c) {
      const {kind, o} = _c;
      if (o === 'update') {
        _c.title = 'A new version is available';
        _c.text = 'Get the latest features and security fixes.';
        _c.label = 'Remind me later';
      } else if (o === 'privacy') {
        _c.title = "We’d like your consent";
        _c.text = 'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
        _c.label = 'Reject optional';
      } else if (o === 'tips') {
        _c.title = 'Tip of the day';
        _c.text = 'The midpoint is the point that is the same distance from both marked points.';
        _c.label = 'Close';
      } else if (o === 'newsletter') {
        _c.title = 'Stay in the loop';
        _c.text = 'Get occasional tips, practice problems, and feature updates.';
        _c.label = 'Close';
      } else if (o === 'notifications') {
        _c.title = 'Notifications (5)';
        _c.text = 'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
        _c.label = 'Dismiss all';
      } else if (o === 'survey') {
        _c.title = 'Quick Survey';
        _c.text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
        _c.label = 'Close survey';
      } else {
        _c.title = ({
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice'
        })[kind];
        _c.text = ({
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.'
        })[kind];
        _c.label = kind === 'cookie' ? 'Reject optional' : 'Close';
      }
    },
  });

  const overlayControlsParts = (S) => ({
    'overlay.8': function (_c) {
      const {box, u} = _c;
      u.el('h3', '', box, _c.title);
    },
    'overlay.9': function (_c) {
      const {C} = S;
      const {box, o, u} = _c;
      if (o === 'notifications') {
        const notifications = u.el('div', 'notifications', box);
        for (const [name, body] of C.theme === 'bitmap' ? [['Software Update Available', 'A new version is ready.'], ['Disk Almost Full', 'You have 12 MB remaining.'], ['Tip of the Day', 'Organize your files faster.'], ['Welcome to Shape Sorter', 'Learn how to play.'], ['Reminder', 'Back up your disk.']] : [['New message', 'You have a new message from Alex.'], ['Weekly digest', 'Your summary is ready to view.'], ['Product update', 'Check out what’s new this week.'], ['Event reminder', 'Design sync starts in 1 hour.']]) {
          const card = u.el('div', 'notification-card', notifications);
          u.el('strong', '', card, name);
          u.el('p', '', card, body);
          const x = u.el('button', 'notification-x', card, '×');
          x.onclick = () => card.remove();
        }
      } else u.el('p', '', box, _c.text);
    },
    'overlay.10': function (_c) {
      const {box, o, u} = _c;
      if (o === 'tips') {
        const label = u.el('label', 'tip-option', box);
        const input = u.el('input', '', label);
        input.type = 'checkbox';
        u.el('span', '', label, 'Do not show again');
      }
    },
    'overlay.11': function (_c) {
      const {box, u} = _c;
      const dismiss = u.el('button', 'dismiss', box, _c.label);
      Object.assign(_c, {
        dismiss
      });
    },
    'overlay.12': function (_c) {
      const {C} = S;
      const {box, o, u} = _c;
      if (o === 'privacy' || o === 'newsletter') {
        const icon = u.svg('svg', {
          class: 'ob-icon',
          width: 64,
          height: 64,
          viewBox: '0 0 64 64',
          fill: 'none',
          stroke: C.accent,
          'stroke-width': 3
        }, box);
        u.svg('path', {
          d: o === 'newsletter' ? 'M8 14H56V50H8ZM8 14L32 34L56 14' : 'M32 4L54 14V30Q54 49 32 59Q10 49 10 30V14ZM22 30L29 37L44 21'
        }, icon);
      }
    },
    'overlay.13': function (_c) {
      const {dismiss} = _c;
      dismiss.type = 'button';
    },
    'overlay.14': function (_c) {
      const {ctx, dismiss} = _c;
      dismiss.onclick = () => ctx.dismiss('close');
    },
    'overlay.15': function (_c) {
      const {box, ctx, kind, o, u} = _c;
      if (o === 'privacy' || kind === 'cookie' && !o) {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
    },
    'overlay.16': function (_c) {
      const {dismiss, el, kind} = _c;
      return {
        el,
        dismiss,
        ttlSteps: kind === 'toast' ? 5 : 0
      };
    },
  });

  // Keep the numbered sections and their order stable for site design overrides.
  const base = (S) => ({
    ...sculptParts(S),
    ...frameHeaderParts(S),
    ...frameWorkspaceParts(S),
    ...frameOptionsParts(S),
    ...frameEndParts(S),
    ...legacyHeaderParts(S),
    ...legacyRibbonParts(S),
    ...legacyWorkspaceParts(S),
    ...legacyFooterParts(S),
    ...overlayContentParts(S),
    ...overlayControlsParts(S),
  });

  env.template('site/click-point-bisect-03', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/click-point-bisect-03', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, frameOld: P.frameOld, overlay: P.overlay };
  });
})();
