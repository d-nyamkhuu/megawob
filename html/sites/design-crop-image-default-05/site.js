// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'carbon',
        'title': 'Image Cropper',
        'aside': '',
        'foot': '',
        'accent': '#1877e8',
        'bg': '#111213',
        'surface': '#1b1c1d',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const ends =
              ctx.content && Array.isArray(ctx.content.END_LABELS)
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
            const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            _c.placement = ctx.finish
              ? null
              : er.pick(['footer', 'footer', 'footer', 'footer', 'header', 'link', 'icon']);
            const label = _c.placement === 'footer' && er.bool(0.85) ? 'Submit' : endText(er.pick(ends));
            if (_c.placement === 'header' && ctx.display === 'hidden') _c.placement = 'footer';
            _c.collide = null;
            if (!ctx.finish && cr.bool(0.3)) {
              const options = [
                ...new Set(ends.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
              ];
              if (options.length)
                _c.collide = { label: endText(cr.pick(options)), where: cr.pick(['header', 'footer']) };
            }
            Object.assign(_c, { cr, endText, ends, er, label });
          },
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { root } = _c;
            for (const [k, v] of Object.entries({
              bg: C.bg,
              panel: C.surface,
              fg: '#e7e8e9',
              muted: '#aeb1b4',
              line: '#4b4e50',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, u } = _c;
            const style = u.el('style', '', document.head);
            style.textContent = `html,body{background:#171819;color:#e7e8e9;font-family:Arial,sans-serif}.carbon .shell{height:100vh;padding:5px;gap:0;border:2px ridge #717477;border-radius:8px;background:#191a1b;box-shadow:inset 0 0 0 1px #050505}.carbon .head{height:34px;flex:none;display:flex;align-items:center;padding:0 10px 0 105px;background:linear-gradient(#d8d9d9,#a9abad 46%,#818486);color:#202123;border-bottom:1px solid #090a0b;position:relative}.carbon .title{font:16px Arial,sans-serif;font-weight:normal;color:#202123;text-shadow:0 1px #eee}.carbon .window-controls{left:8px;right:auto;top:6px;gap:7px}.carbon .window-controls button{width:19px;height:19px;border-radius:50%;padding:0;border:1px solid #5c1714;color:transparent;font-size:0;box-shadow:inset 0 1px 2px #ffffffb0,0 1px 1px #333;background:linear-gradient(#fb6556,#d92218 65%,#a90e0a)}.carbon .window-controls button:nth-child(2){border-color:#8a6114;background:linear-gradient(#ffe476,#f9b820 65%,#d28a08)}.carbon .window-controls button:nth-child(3){border-color:#185326;background:linear-gradient(#8bf08d,#26c449 65%,#16812a)}.carbon .content{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:108px minmax(0,1fr);gap:0;flex:1;min-height:0}.carbon .task-note{grid-column:1;grid-row:1;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px 190px 10px 30px;background:linear-gradient(#303234,#292b2d);border:0;border-bottom:1px solid #55585a;min-height:0}.carbon .instruction{font:400 clamp(23px,2.55vw,42px)/1.15 Arial,sans-serif;color:#e4e5e6;letter-spacing:0;text-shadow:0 1px 2px #000;-webkit-text-stroke:0}.carbon .task-note .note-label{display:none}.carbon .stage{grid-column:1;grid-row:2;min-height:0;margin:0;border:0;background:radial-gradient(ellipse at center,#202122,#101112 78%);overflow:hidden}.carbon .stage::after{content:'';position:absolute;inset:0;pointer-events:none;display:none;background-image:linear-gradient(#7773 1px,transparent 1px),linear-gradient(90deg,#7773 1px,transparent 1px);background-size:33.333% 33.333%}.carbon .stage.show-grid::after{display:block}.carbon .stage .cr-wrap{left:50%!important;top:50%!important;transform:translate(-50%,-50%);padding:0;gap:0}.carbon .stage .cr-frame{box-shadow:0 0 0 5px #343637,0 0 0 6px #080909;border:1px solid #161718;border-radius:0;background:#f3f3f3}.carbon .stage .cr-frame canvas{background:#f3f3f3}.carbon .stage .cr-dim,.carbon .stage .cr-grid{display:none}.carbon .stage .cr-box{outline:0!important;border:2px solid #202122;background:transparent;box-shadow:none}.carbon .stage .cr-handle{width:18px!important;height:18px!important;margin:-9px 0 0 -9px!important;border:2px solid #222!important;border-radius:0!important;background:#f7f7f7!important;box-shadow:inset 0 0 0 1px #fff,0 1px 1px #0005!important}.carbon .footer{height:17%;min-height:110px;max-height:175px;flex:none;display:flex;align-items:center;justify-content:flex-start;gap:0;padding:18px 2.5%;background:linear-gradient(#383a3c,#27292a);border-top:1px solid #57595b;position:relative}.carbon .footer-copy{display:none}.carbon .crop-controls{height:100%;display:flex;align-items:center;gap:16px;color:#d4d5d6;font-size:clamp(13px,1.2vw,21px)}.carbon .ratio-control{width:228px;height:46px;text-align:left;padding:0 38px 0 13px;border:1px solid #0b0c0d;border-radius:6px;color:#f1f2f2;background:linear-gradient(#5c5f61,#414345 48%,#303234);box-shadow:inset 0 1px #999,0 1px 2px #0008;font-size:clamp(14px,1.3vw,21px);position:relative}.carbon .ratio-control:after{content:'';position:absolute;right:12px;top:19px;border:6px solid transparent;border-top-color:#ddd}.carbon .control-divider{height:76%;border-left:1px solid #606264;border-right:1px solid #242526;margin:0 25px}.carbon .grid-control{display:flex;align-items:center;gap:12px;white-space:nowrap}.carbon .grid-control input{appearance:none;width:24px;height:24px;border:2px solid #111;border-radius:3px;background:linear-gradient(#444749,#303234);box-shadow:inset 0 1px #777;margin:0}.carbon .grid-control input:checked{background:#2b75d3;box-shadow:inset 0 0 0 4px #333}.carbon .crop-actions{display:flex;align-items:center;gap:22px;margin-left:auto;margin-right:0}.carbon .reset-control{min-width:180px;height:60px;border:1px solid #101112;border-radius:8px;color:#eee;background:linear-gradient(#676a6d,#4c4f51 55%,#383a3c);box-shadow:inset 0 1px #aaa,0 1px 2px #0008;font-size:clamp(17px,1.45vw,24px)}.carbon .submit{min-width:185px;height:60px;padding:0 30px;border:1px solid #0746a2;border-radius:8px;color:white;background:linear-gradient(#3188fa,#0862d7 55%,#0751bf);box-shadow:inset 0 1px #8fc0ff,0 1px 2px #0008;font-size:clamp(18px,1.5vw,25px);font-weight:normal}.carbon .submit:hover,.carbon .reset-control:hover{filter:brightness(1.08)}@media(max-width:1100px){.carbon .head{height:30px}.carbon .content{grid-template-rows:86px minmax(0,1fr)}.carbon .task-note{padding-right:125px}.carbon .footer{min-height:90px;padding:12px 2%}.carbon .ratio-control{width:160px;height:40px}.carbon .control-divider{margin:0 12px}.carbon .reset-control,.carbon .submit{min-width:125px;height:48px}.carbon .crop-actions{gap:10px}}`;
            style.textContent += `.carbon .task-note.instruction-panel{margin:12px 18%;padding:8px 170px 8px 24px;border:1px solid #55595b;border-radius:5px;box-shadow:inset 0 1px #47494b,0 2px 5px #0008}.carbon .carbon-end{height:42px;min-width:104px;padding:0 16px;border:1px solid #121314;border-radius:5px;background:linear-gradient(#606366,#414446);box-shadow:inset 0 1px #999,0 1px 2px #0008;color:#f1f2f2;font:16px Arial,sans-serif;white-space:nowrap}.carbon .note-end{position:absolute;right:20px;top:50%;transform:translateY(-50%);z-index:2}.carbon .end-link{min-width:auto;padding:0 12px;text-decoration:underline;background:transparent;border-color:transparent;box-shadow:none}.carbon .end-icon{min-width:54px;padding:0;font-size:22px}.carbon .pqd-xtra{height:38px;min-width:84px;padding:0 12px;font:14px Arial,sans-serif;color:#ddd}.carbon .task-note.instruction-panel .instruction{font-size:clamp(20px,2.1vw,34px)}@media(max-width:1100px){.carbon .task-note.instruction-panel{margin:6px 8%;padding-right:130px}.carbon .carbon-end{height:38px;min-width:82px;padding:0 9px;font-size:14px}.carbon .note-end{right:8px}}`;
            const shell = u.el('div', 'shell', body),
              head = u.el('header', 'head', shell);
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'carbon'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of C.theme === 'carbon' ? ['●', '●', '●'] : ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
            Object.assign(_c, { head, shell, style });
          },
        'frame.8': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, label, note, u } = _c;
            if (C.theme === 'carbon') {
              note.style.position = 'relative';
              const help = u.el('button', 'help-button', note, 'Help');
              help.type = 'button';
              Object.assign(help.style, {
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px 27px',
                border: '1px solid #101112',
                borderRadius: '5px',
                color: '#eee',
                background: 'linear-gradient(#45484a,#292b2d)',
                boxShadow: 'inset 0 1px #777,0 1px 2px #0008',
                fontSize: '16px',
              });
              if (_c.placement === 'header') help.style.display = 'none';
              help.onclick = () => env.log('help-open');
            }
            const endButton = (parent, where) => {
              if (!_c.placement || where !== _c.placement) return null;
              const cls =
                'submit carbon-end' +
                (where === 'header' ? ' note-end' : '') +
                (where === 'link' ? ' end-link' : '') +
                (where === 'icon' ? ' end-icon' : '');
              const bt = u.el('button', cls, parent, where === 'icon' ? '✓' : label);
              bt.type = 'button';
              bt.dataset.role = 'submit';
              bt.title = label;
              bt.setAttribute('aria-label', label);
              bt.onclick = () => ctx.submit();
              return bt;
            };
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { endButton, stage });
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const footer = u.el('footer', 'footer', shell);
            Object.assign(_c, { footer });
          },
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, endButton, footer, label, note, u } = _c;
            _c.actions = null;
            if (C.theme === 'carbon') {
              const controls = u.el('div', 'crop-controls', footer);
              u.el('span', 'control-label', controls, 'Aspect ratio:');
              const ratio = u.el('button', 'ratio-control', controls, 'Freeform');
              ratio.type = 'button';
              ratio.onclick = () => ratio.classList.toggle('open');
              u.el('span', 'control-divider', controls);
              const gridLabel = u.el('label', 'grid-control', controls);
              const grid = u.el('input', '', gridLabel);
              grid.type = 'checkbox';
              grid.onchange = () => document.querySelector('.stage')?.classList.toggle('show-grid', grid.checked);
              u.el('span', '', gridLabel, 'Show grid');
              _c.actions = u.el('div', 'crop-actions', footer);
              const reset = u.el('button', 'reset-control', _c.actions, 'Reset');
              reset.type = 'button';
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.collide) {
                const d = u.el('button', 'carbon-end pqd-xtra', _c.actions, _c.collide.label);
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.title = _c.collide.label;
                d.onclick = () => env.log('decoy', { label: _c.collide.label, collide: true });
              }
            }
            _c.submit = null;
            if (!ctx.finish) {
              if (_c.placement === 'header') _c.submit = endButton(note, 'header');
              else {
                const cls =
                  'submit' +
                  (_c.placement === 'link' ? ' end-link' : '') +
                  (_c.placement === 'icon' ? ' end-icon' : '');
                _c.submit = u.el('button', cls, footer, _c.placement === 'icon' ? '✓' : label);
                _c.submit.type = 'button';
                _c.submit.dataset.role = 'submit';
                _c.submit.title = label;
                _c.submit.setAttribute('aria-label', label);
                _c.submit.onclick = () => ctx.submit();
              }
            }
            if (C.theme === 'carbon') {
              const actions = footer.querySelector('.crop-actions');
              if (actions) actions.style.marginRight = '22px';
            }
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
