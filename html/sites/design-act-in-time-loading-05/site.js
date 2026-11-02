// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-loading-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-act-in-time-loading-05',
        'brand': 'MarketPlace',
        'title': '',
        'instruction': 'top',
        'rail': '',
        'menu': 'MarketPlace|Shop|Categories|Deals|My Account|Cart (0)',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { u } = _c;
            _c.nav = null;
            if (C.menu) {
              _c.nav = u.el('nav', 'ds-menu', document.body);
              C.menu.split('|').forEach((t) => {
                const item = u.el('span', '', _c.nav, t);
                if (t === 'Cart (0)') item.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 5h4l4 17h16l3-13H9M12 27a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm13 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg> Cart (0)';
              });
            }
            const inspector = u.el('aside', 'market-inspector', document.body);
            u.el('h2', '', inspector, 'Details');
            [['Category','All Categories'],['Price','Any'],['Condition','Any'],['Seller','All Sellers']].forEach(([name,value]) => {
              const row = u.el('div', 'market-property', inspector);
              u.el('strong', '', row, name); u.el('span', '', row, value);
            });
            u.el('h3', '', inspector, 'Specifications');
            [['Brand','Any'],['Model','Any'],['Type','Any'],['Color','Any']].forEach(([name,value]) => {
              const row = u.el('div', 'market-property', inspector);
              u.el('span', '', row, name); u.el('span', '', row, value);
            });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, top, u } = _c;
            const er = ctx.rng.fork('chrome/end');
            const labels = (
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x));
            const submitWord = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0] || 'Submit';
            const classic = er.bool(0.5);
            const placement = classic ? 'footer' : er.pick(['header', 'link']);
            const label = classic ? submitWord : er.pick(labels);
            const cr = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (cr.bool(0.3)) {
              const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (options.length)
                _c.collide = { label: cr.pick(options), where: cr.pick(['header', 'header', 'footer']) };
            }
            const makeEnd = (parent, cls, text, tag = 'button') => {
              const b = u.el(tag, cls, parent, text);
              if (tag === 'button') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              return b;
            };
            const decoy = (parent, text) => {
              const b = u.el('button', 'ds-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              return b;
            };
            _c.submit = null;
            if (_c.nav && (placement === 'header' || (_c.collide && _c.collide.where === 'header'))) {
              const tools = u.el('span', 'ds-menu-tools', _c.nav);
              if (_c.collide && _c.collide.where === 'header') decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            } else if (_c.collide && _c.collide.where === 'header') {
              const tools = u.el('span', 'ds-menu-tools', _c.nav || top);
              decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            }
            if (_c.collide && _c.collide.where === 'footer') decoy(foot, _c.collide.label);
            if (!ctx.finish && placement === 'footer') _c.submit = makeEnd(foot, 'ds-submit', label);
            if (!ctx.finish && placement === 'link') _c.submit = makeEnd(foot, 'ds-endlink', label + ' ›', 'a');
            Object.assign(_c, { classic, cr, decoy, er, label, labels, makeEnd, placement, submitWord });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, u, foot } = _c;
            const vw = (ctx.size && (ctx.size.w || ctx.size.width)) || _c.nav.getBoundingClientRect().width;
            const vh = (ctx.size && (ctx.size.h || ctx.size.height)) || document.body.getBoundingClientRect().height;
            const stage = _c.stage || document.querySelector('.ds-stage');
            const inspector = document.querySelector('.market-inspector');
            // Rebuild the inherited login shell as the marketplace's editorial grid.
            // The existing stage, controls and their event handlers remain the task's anchors.
            document.body.appendChild(stage);
            document.body.appendChild(foot);
            for (const child of [...document.body.children]) {
              if (![stage, foot, _c.nav, inspector].includes(child) && !['SCRIPT', 'STYLE', 'LINK'].includes(child.tagName))
                child.style.setProperty('display', 'none', 'important');
            }
            let display = ctx.display;
            if (vw < 1200 && (display === 'panel' || display === 'toast')) display = 'header';
            document.body.classList.toggle('market-hidden-note', display === 'hidden');
            document.body.classList.add('market-layout');
            const bottom = foot.querySelector('button, a') ? 66 : 0;
            const inspectorLeft = Math.round(vw * .703);
            let taskRight = inspectorLeft;
            let taskTop = 92;
            if (display !== 'hidden') {
              const note = u.el('aside', 'market-note market-note-' + display, document.body);
              if (display === 'header') {
                u.el('span', 'market-note-info', note, 'i');
                u.el('div', 'market-note-text', note, ctx.instruction);
                Object.assign(note.style, {left:'24px', right:'24px', top:'104px'});
                taskTop = Math.ceil(note.getBoundingClientRect().bottom) + 16;
              } else if (display === 'panel') {
                taskRight = Math.round(vw * .512);
                Object.assign(note.style, {left:(taskRight + 24)+'px', width:(inspectorLeft-taskRight-48)+'px', top:'116px'});
                u.el('h3', '', note, 'Task');
                u.el('div', 'market-note-text', note, ctx.instruction);
              } else {
                const noteWidth = vw - inspectorLeft - 32;
                Object.assign(note.style, {right:'16px', width:noteWidth+'px', top:(_c.placement === 'header' && !ctx.finish ? 108 : 16)+'px'});
                u.el('span', 'market-toast-info', note, 'i');
                u.el('div', 'market-note-text', note, ctx.instruction);
                const close = u.el('button', 'market-note-close', note, '×');
                close.setAttribute('aria-label', 'Close notification');
                close.addEventListener('click', () => { note.style.display = 'none'; env.log('note-close'); });
              }
            }
            for (const [name, value] of Object.entries({position:'fixed', left:'0px', top:taskTop+'px', width:taskRight+'px', height:(vh-taskTop-bottom)+'px', margin:'0', padding:'0', overflow:'hidden', transform:'none', 'max-width':'none', 'max-height':'none'}))
              stage.style.setProperty(name, value, 'important');
            stage.classList.add('market-stage');
            inspector.style.setProperty('top', taskTop + 'px', 'important');
            inspector.style.setProperty('bottom', bottom + 'px', 'important');
            const inspectorHeight = vh - taskTop - bottom;
            inspector.classList.toggle('market-inspector-compact', inspectorHeight < 720);
            const propertyHeight = Math.max(24, Math.min(63, Math.floor((inspectorHeight - 116) / 9)));
            inspector.style.setProperty('--property-height', propertyHeight + 'px');
            inspector.style.setProperty('--primary-height', Math.min(80, propertyHeight * 1.25) + 'px');
            Object.assign(foot.style, {position:'fixed', left:'24px', right:'24px', bottom:'0', height:bottom+'px', boxSizing:'border-box'});
            foot.classList.add('market-footer');
            if (!bottom) foot.style.setProperty('display', 'none', 'important');
          },
        'overlay': (base) => function (...args) {
          const result = base(...args);
          const ctx = args[0];
          const greeting = [...document.body.querySelectorAll('*')].find((n) => n.children.length === 0 && n.textContent.trim() === 'Hello. How can we help?');
          if (greeting && ctx.util) {
            const panel = greeting.parentElement;
            const close = panel.querySelector('button');
            if (close) {
              panel.classList.add('market-chat');
              const heading = ctx.util.el('div', 'market-chat-heading', panel, 'Support');
              panel.insertBefore(heading, greeting);
              greeting.classList.add('market-chat-message');
              close.classList.add('market-chat-close');
              close.textContent = '×';
              close.setAttribute('aria-label', 'Close chat');
              ctx.util.el('div', 'market-chat-input', panel, 'Type a message…');
            }
          }
          return result;
        },
      },
    },
  });
})();
