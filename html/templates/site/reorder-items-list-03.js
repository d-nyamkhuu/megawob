// site/drag-reorder-list-03: site template generated from the site.js of design-reorder-items-list-03, of which many
// design-* sites were restyled copies; they are designs on it (templates/README.md, "Generated site templates"). The
// defaults (design {}) reproduce design-reorder-items-list-03. Tokens (each replaced whole): C. Parts: gem, frame,
// overlay, and the sections of frame() ('frame.1'..'frame.30'), overlay() ('overlay.1'..'overlay.16'): one per
// statement of the original body, run in order.
(function () {
  'use strict';

  const TOKENS = {
    C: {
      "layout": "left",
      "theme": "gem",
      "title": "List Manager",
      "foot": "",
      "accent": "#5fa052",
      "bg": "#5fa052",
      "surface": "#eeeeee",
      "font": "'Courier New', monospace"
    },
  };

  const base = (S) => ({
    gem: function gem(ctx, u, body) {
      const {C} = S;
      const bar = u.el('header', 'gem-menu', body);
      const logo = u.svg('svg', {
        class: 'gem-logo',
        width: 34,
        height: 28,
        viewBox: '0 0 34 28',
        fill: 'none',
        stroke: '#000',
        'stroke-width': 3
      }, bar);
      u.svg('path', {
        d: 'M13 0V9Q13 21 1 27M17 0V27M21 0V9Q21 21 33 27M10 0V9Q10 18 3 23M24 0V9Q24 18 31 23'
      }, logo);
      for (const m of ['Desk', 'File', 'Edit', 'Options', 'Window']) u.el('span', 'gem-m', bar, m);
      u.el('span', 'gem-clock', bar, 'Mon  Mar 24  10:15');
      const win = u.el('div', 'gem-win', body), tb = u.el('div', 'gem-title', win);
      u.el('span', 'gem-box', tb);
      u.el('span', 'gem-name', tb, C.title);
      u.el('span', 'gem-box r1', tb);
      u.el('span', 'gem-box r2', tb, '×');
      const inner = u.el('div', 'gem-inner', win);
      const note = u.el('section', 'task-note', inner);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true; else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => note.style.visibility = 'hidden';
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', inner);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', inner);
      u.el('div', 'footer-copy', footer, '');
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = x => typeof x === 'string' ? x : x.label || x.text || x.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = endR.pick(['footer', 'toolbar', 'footer', 'link']);
      const original = placement === 'footer';
      const endLabel = original ? 'Submit' : endR.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        const link = placement === 'link';
        submit = u.el(link ? 'a' : 'button', 'submit' + (placement === 'toolbar' ? ' gem-end-toolbar' : link ? ' gem-end-link' : ''), placement === 'toolbar' ? tb : footer, endLabel);
        if (link) {
          submit.href = '#';
          footer.classList.add('has-end-link');
        } else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = e => {
          e.preventDefault();
          ctx.submit();
        };
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(.3)) {
        const options = [...new Set(endLabels)].filter(label => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideR.pick(options), decoy = u.el('button', 'gem-xtra', footer, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', {
            label,
            collide: true
          });
        }
      }
      const side = u.el('aside', 'gem-side', body);
      if (ctx.display === 'header') {
        u.el('h3', '', side, 'Instructions:');
        u.el('p', '', side, ctx.instruction);
      } else if (ctx.display === 'panel') {
        u.el('h3', '', side, 'Instructions:');
        side.append(note);
      } else if (ctx.display === 'toast') side.append(note);
      u.el('h3', '', side, 'Action notes:');
      const ol = u.el('ol', '', side);
      for (const t of ['Drag items using the handle (⁝⁝).', 'Arrange the items in the requested order.', ...ctx.finish ? [] : [`Click ${endLabel} when you are ready.`]]) u.el('li', '', ol, t);
      const tr = u.el('div', 'gem-trash', body);
      const ts = u.svg('svg', {
        width: 44,
        height: 56,
        viewBox: '0 0 44 56',
        fill: '#ddd',
        stroke: '#000',
        'stroke-width': 2
      }, tr);
      u.svg('path', {
        d: 'M6 14H38V54H6ZM2 9H42V15H2ZM15 9V3H29V9M13 20V49M22 20V49M31 20V49'
      }, ts);
      u.el('span', '', tr, 'Trash');
      return {
        stage,
        submit
      };
    },
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 30; i++) {
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
      const {C} = S;
      const {body, ctx} = _c;
      body.className = 'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    },
    'frame.3': function (_c) {
      const {C, gem} = S;
      const {body, ctx, u} = _c;
      if (C.theme === 'gem') {
        document.documentElement.style.setProperty('--font', C.font);
        return gem(ctx, u, body);
      }
    },
    'frame.4': function (_c) {
      const root = document.documentElement;
      Object.assign(_c, {
        root
      });
    },
    'frame.5': function (_c) {
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
    'frame.6': function (_c) {
      const {C} = S;
      const {root} = _c;
      root.style.setProperty('--font', C.font);
    },
    'frame.7': function (_c) {
      const {body, u} = _c;
      const shell = u.el('div', 'shell', body), head = u.el('header', 'head', shell);
      Object.assign(_c, {
        head,
        shell
      });
    },
    'frame.8': function (_c) {
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
    'frame.9': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (C.title) u.el('div', 'title', head, C.title);
    },
    'frame.10': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
    },
    'frame.11': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (C.menu) u.el('nav', 'menu', head, C.menu);
    },
    'frame.12': function (_c) {
      const {C} = S;
      const {head, u} = _c;
      if (C.ribbon) {
        const rib = u.el('div', 'ribbon', head);
        const tool = (parent, name, path) => {
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
            for (const t of names) tool(gr, t, t.includes('Circle') ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16' : t.includes('Line') ? 'M3 29L29 3' : t === 'Point' ? 'M19 16A3 3 0 1 1 13 16A3 3 0 1 1 19 16' : t === 'Instructions' || t === 'Help' ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M12 10Q12 5 17 6Q23 8 17 14L16 19M16 23V25' : 'M5 5H27V27H5ZM10 16L14 20L23 10');
          }
          u.el('small', '', gr, name);
        }
      }
    },
    'frame.13': function (_c) {
      const {shell, u} = _c;
      const content = u.el('div', 'content', shell), note = u.el('section', 'task-note', content);
      Object.assign(_c, {
        content,
        note
      });
    },
    'frame.14': function (_c) {
      const {C} = S;
      const {note, u} = _c;
      u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
    },
    'frame.15': function (_c) {
      const {ctx, note, u} = _c;
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      Object.assign(_c, {
        instruction
      });
    },
    'frame.16': function (_c) {
      const {C} = S;
      const {note, u} = _c;
      if (C.theme === 'memphis') {
        u.el('h1', 'brief-title', note, C.title);
        note.prepend(note.lastChild);
        u.el('p', 'brief-copy', note, 'Drag and drop the months on the right to arrange them from January to December.');
      }
    },
    'frame.17': function (_c) {
      const {C} = S;
      const {note, u} = _c;
      if (C.theme === 'minimal') {
        const steps = u.el('ol', 'steps', note);
        for (const text of ['Drag the shape from its current position.', 'Drop it inside the rectangular box.', 'The shape must fit fully inside the box.']) u.el('li', '', steps, text);
        u.el('h3', '', note, 'Notes');
        u.el('p', 'brief-copy', note, 'Use your mouse or trackpad (pointer) to move the shape. Do not resize the shape.');
      }
    },
    'frame.18': function (_c) {
      const {ctx, note, u} = _c;
      if (ctx.display === 'hidden') note.hidden = true; else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => note.style.visibility = 'hidden';
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    },
    'frame.19': function (_c) {
      const {content, u} = _c;
      const stage = u.el('main', 'stage', content);
      Object.assign(_c, {
        stage
      });
    },
    'frame.20': function (_c) {
      const {stage} = _c;
      stage.dataset.role = 'stage';
    },
    'frame.21': function (_c) {
      _c.aside = null;
    },
    'frame.22': function (_c) {
      const {C} = S;
      const {ctx, shell, u} = _c;
      if (C.theme === 'memphis') {
        if (ctx.display === 'header' || ctx.display === 'panel') u.el('div', 'workspace-instruction', shell, ctx.instruction);
        const decor = u.svg('svg', {
          class: 'memphis-art',
          viewBox: '0 0 1672 941',
          preserveAspectRatio: 'none',
          'aria-hidden': 'true'
        }, shell);
        const defs = u.svg('defs', {}, decor);
        const coral = u.svg('linearGradient', {
          id: 'memphis-coral',
          x1: '0',
          y1: '0',
          x2: '1',
          y2: '1'
        }, defs);
        u.svg('stop', {
          offset: '0',
          'stop-color': '#ff8479'
        }, coral);
        u.svg('stop', {
          offset: '1',
          'stop-color': '#ff9083'
        }, coral);
        const lilac = u.svg('linearGradient', {
          id: 'memphis-lilac',
          x1: '0',
          y1: '0',
          x2: '1',
          y2: '1'
        }, defs);
        u.svg('stop', {
          offset: '0',
          'stop-color': '#bba5fb'
        }, lilac);
        u.svg('stop', {
          offset: '1',
          'stop-color': '#b79ef6'
        }, lilac);
        u.svg('path', {
          d: 'M39 52H119',
          stroke: '#b9a1f7',
          'stroke-width': 11
        }, decor);
        u.svg('path', {
          d: 'M0 685L160 620L74 839L0 758Z',
          fill: 'url(#memphis-coral)'
        }, decor);
        u.svg('circle', {
          cx: 308,
          cy: 791,
          r: 79,
          fill: 'url(#memphis-lilac)'
        }, decor);
        u.svg('circle', {
          cx: 1488,
          cy: -46,
          r: 118,
          fill: 'url(#memphis-lilac)'
        }, decor);
        for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) u.svg('circle', {
          cx: 1588 + col * 21,
          cy: 54 + row * 20,
          r: 2.8,
          fill: '#10103b'
        }, decor);
        const dots = u.svg('g', {
          transform: 'rotate(29 127 830)',
          fill: '#b79ff8'
        }, decor);
        for (let row = 0; row < 6; row++) for (let col = 0; col < 3; col++) u.svg('circle', {
          cx: 102 + col * 24,
          cy: 767 + row * 25,
          r: 4.2
        }, dots);
        u.svg('path', {
          d: 'M1491 127Q1526 103 1528 135T1561 155T1582 174T1614 185T1633 214',
          fill: 'none',
          stroke: 'url(#memphis-coral)',
          'stroke-width': 14,
          'stroke-linecap': 'round'
        }, decor);
        u.svg('path', {
          d: 'M1295 76L1318 63M1298 97L1325 100M1291 116L1310 134',
          fill: 'none',
          stroke: '#ff867b',
          'stroke-width': 9,
          'stroke-linecap': 'round'
        }, decor);
      }
    },
    'frame.23': function (_c) {
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
    'frame.24': function (_c) {
      const {shell, u} = _c;
      const footer = u.el('footer', 'footer', shell);
      Object.assign(_c, {
        footer
      });
    },
    'frame.25': function (_c) {
      const {C} = S;
      const {footer, u} = _c;
      u.el('div', 'footer-copy', footer, C.foot || '');
    },
    'frame.26': function (_c) {
      _c.submit = null;
    },
    'frame.27': function (_c) {
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
    'frame.28': function (_c) {
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
    'frame.29': function (_c) {
      const {C} = S;
      const {footer, u} = _c;
      if (['aqua', 'collage'].includes(C.theme)) {
        const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
        reset.onclick = () => env.widgetDef.clear?.();
        if (_c.submit) footer.insertBefore(reset, _c.submit);
      }
    },
    'frame.30': function (_c) {
      const {stage} = _c;
      return {
        stage,
        submit: _c.submit
      };
    },
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

  env.template('site/reorder-items-list-03', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/reorder-items-list-03', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, overlay: P.overlay };
  });
})();
