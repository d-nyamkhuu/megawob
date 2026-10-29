// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-debounce-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-act-in-time-debounce-05',
        'brand': 'Task Runner',
        'title': 'Process',
        'instruction': 'top',
        'rail': 'Toolchest|Desktop|Files|Applications|System|Help',
        'menu': 'File|Edit|Tasks|View|Help',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { u } = _c;
            _c.nav = null;
            const app = u.el('main', 'industrial-app', document.body);
            const title = u.el('header', 'industrial-title', document.body);
            u.el('span', 'industrial-mark', title, '⚙');
            u.el('span', 'industrial-caption', title, 'LogiTrack 2.3.1  -  Shipping Orders');
            const controls = u.el('span', 'window-controls', title);
            ['−', '□', '×'].forEach((t) => u.el('i', '', controls, t));
            _c.nav = u.el('nav', 'ds-menu', title);
            const orders = u.el('section', 'orders-table', app);
            orders.innerHTML = '<div class="order-grid order-head"><b>Order #</b><b>Date</b><b>Customer</b><b>Ship To</b><b>City</b><b>Status</b></div>' +
              '<div class="order-grid selected"><span>SHP-00471</span><span>2004-06-08</span><span>Barlow Engineering</span><span>Whyalla Works</span><span>Whyalla</span><span>Pending</span></div>' +
              '<div class="order-grid"><span>SHP-00470</span><span>2004-06-07</span><span>Coastline Minerals</span><span>Port Facility</span><span>Port Lincoln</span><span>Dispatched</span></div>' +
              '<div class="order-grid"><span>SHP-00469</span><span>2004-06-06</span><span>Northern Tools</span><span>Workshop</span><span>Kadina</span><span>Pending</span></div>' +
              '<div class="order-grid"><span>SHP-00468</span><span>2004-06-05</span><span>Outback Minerals</span><span>Site A</span><span>Roxby Downs</span><span>Dispatched</span></div>' +
              '<div class="order-grid"><span>SHP-00467</span><span>2004-06-04</span><span>Flinders Power</span><span>Main Yard</span><span>Port Augusta</span><span>Pending</span></div><div class="scrollbar"><i>▴</i><i>▾</i></div>';
            const details = u.el('section', 'detail-panel', app);
            u.el('h2', '', details, 'Order Details');
            details.innerHTML += '<div class="detail-left"><div><label>Order #</label><input value="SHP-00471" readonly></div><div><label>Order Date</label><input value="2004-06-08" readonly></div><div><label>Customer</label><input value="Barlow Engineering" readonly></div><div><label>Reference</label><input value="BE-7781" readonly></div></div>' +
              '<div class="detail-middle"><label>Ship To</label><input value="Whyalla Works" readonly><div class="city-mount"></div></div>' +
              '<div class="detail-right"><div><label>Status</label><input value="Pending" readonly></div><div><label>Required By</label><input value="2004-06-12" readonly></div><div class="priority"><label>Priority</label><input value="Normal" readonly><span>▾</span></div></div>';
            const items = u.el('section', 'items-panel', app);
            u.el('h2', '', items, 'Items');
            items.innerHTML += '<table><thead><tr><th>#</th><th>Part No.</th><th>Description</th><th>Qty</th><th>Unit</th><th>Weight (kg)</th></tr></thead><tbody>' +
              '<tr><td>1</td><td>MX-1000</td><td>Motor Assembly</td><td>2</td><td>ea</td><td>56.0</td></tr><tr><td>2</td><td>BR-450</td><td>Mounting Bracket</td><td>4</td><td>ea</td><td>12.5</td></tr><tr><td>3</td><td>CN-230</td><td>Control Unit</td><td>1</td><td>ea</td><td>18.0</td></tr><tr><td>4</td><td>HW-772</td><td>Hardware Kit</td><td>1</td><td>kit</td><td>5.0</td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><div class="notes"><label>Notes</label><textarea readonly>Handle with care.\nDeliver to site office.</textarea></div>';
          },
        'frame.10': () => () => {},
        'frame.15': () => (_c) => {
          if (_c.mode === 'top') {
            const title = document.querySelector('.industrial-title');
            _c.briefing(title, 'ds-header-note');
            const app = document.querySelector('.industrial-app');
            const extra = Math.max(0, title.getBoundingClientRect().height - app.getBoundingClientRect().height * .049);
            app.style.setProperty('--title-extra', extra + 'px');
          }
        },
        'frame.17': () => (_c) => {
          if (_c.mode === 'left' || _c.mode === 'right') {
            _c.briefing(document.querySelector('.industrial-app'), 'ds-brief');
          }
        },
        'frame.18': () => (_c) => {
          _c.stage = _c.u.el('main', 'ds-stage', document.querySelector('.city-mount'));
        },
        'frame.19': () => (_c) => {
          if (_c.mode === 'toast') {
            _c.briefing(document.querySelector('.industrial-app'), 'ds-toast');
          }
        },
        'frame.21': () => () => {},
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
            if (!ctx.finish && placement === 'link') _c.submit = makeEnd(foot, 'ds-endlink', label + ' ›');
            Object.assign(_c, { classic, cr, decoy, er, label, labels, makeEnd, placement, submitWord });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'overlay.5': () => (_c) => {
          const { ctx, el, texts, u } = _c;
          if (ctx.kind === 'promo') {
            u.el('span', 'notice-symbol', el, '✉');
            u.el('h2', '', el, 'Stay in the loop');
            u.el('p', '', el, 'Get the latest product updates, logistics tips and industry news straight to your inbox.');
            const email = u.el('input', 'notice-email', el);
            email.placeholder = 'Email address';
            email.setAttribute('aria-label', 'Email address');
            const subscribe = u.el('button', 'notice-subscribe', el, 'Subscribe');
            subscribe.type = 'button';
          } else if (ctx.kind === 'chat') {
            u.el('h2', '', el, '☏  Need help?');
            u.el('p', '', el, 'Hi! How can we help you today?');
            const field = u.el('input', '', el);
            field.placeholder = 'Type a message…';
            field.setAttribute('aria-label', 'Chat message');
            const send = u.el('button', 'notice-send', el, 'Send');
            send.type = 'button';
          } else {
            u.el('span', 'notice-symbol', el, ctx.kind === 'banner' ? '⚑' : 'ℹ');
            u.el('div', '', el, texts[ctx.kind]);
          }
          if (ctx.kind === 'banner') {
            el.style.top = document.querySelector('.industrial-title').getBoundingClientRect().bottom + 'px';
          }
        },
        'overlay.6': () => (_c) => {
          const { ctx, el, u } = _c;
          const dismiss = u.el('button', 'notice-dismiss', el, ctx.kind === 'cookie' ? 'Dismiss' : ctx.kind === 'promo' ? 'No thanks' : '×');
          dismiss.type = 'button';
          dismiss.title = 'Close';
          dismiss.setAttribute('aria-label', 'Close');
          _c.dismiss = dismiss;
        },
      },
    },
  });
})();
