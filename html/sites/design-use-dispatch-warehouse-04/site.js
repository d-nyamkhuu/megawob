// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        if (kind === 'banner') {
          util.el('span', 'wh-announcement-icon', el, '⚑');
        }
        if (kind === 'chat') {
          const heading = util.el('div', 'wh-chat-heading', el, 'Help & Support');
          el.prepend(heading);
          heading.appendChild(dismiss);
          const reply = util.el('div', 'wh-chat-reply', el);
          const input = util.el('input', '', reply);
          input.type = 'text';
          input.placeholder = 'Type a message...';
          input.setAttribute('aria-label', 'Message');
          const send = util.el('button', 'ref-ov-btn ref-ov-primary', reply, '➤');
          send.type = 'button';
          send.setAttribute('aria-label', 'Send message');
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send message' }));
        }
        if (kind === 'promo') {
          const heading = util.el('h2', '', box, 'Stay Informed!');
          box.prepend(heading);
          const art = util.el('div', 'wh-newsletter-icon', box, '✉');
          box.prepend(art);
          const input = util.el('input', 'wh-newsletter-email', box);
          input.type = 'text';
          input.placeholder = 'Enter your email address';
          input.setAttribute('aria-label', 'Email address');
          row.before(input);
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
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
        document.body.dataset.instruction = display;

        // Period desktop application frame: Windows title strip and menu row.
        const win = util.el('div', 'wh-windowbar', document.body);
        util.el('span', 'wh-appicon', win, '▧');
        util.el('span', 'wh-windowtitle', win, 'Warehouse Put-Away Planning');
        util.el('span', 'wh-clock', win, 'Mon, Apr 27, 1998　10:24 AM');
        const winControls = util.el('div', 'wh-windowcontrols', win);
        util.el('span', '', winControls, '−');
        util.el('span', '', winControls, '□');
        util.el('span', 'wh-close', winControls, '×');
        const menu = util.el('div', 'wh-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Tools', 'Reports', 'Help']) util.el('span', '', menu, item);
        Object.assign(_c, { H, W, display, menu, roomy, tall, win, winControls });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, display, endBtn, headerTools, label, placement, util, win } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // The overview is in page flow, so notes and banners reserve their own space.
        const overview = util.el('section', 'wh-overview');
        body.before(overview);
        const panel = (title, cls) => {
          const p = util.el('section', `wh-overview-panel ${cls || ''}`, overview);
          util.el('h2', '', p, title);
          return p;
        };
        const dispatch = panel('Dispatch Reference', 'wh-dispatch');
        util.el('div', '', dispatch, 'Dispatch ID:　 WH-0427-18');
        util.el('div', '', dispatch, 'Arrival Date:　 Apr 27, 1998');
        util.el('div', '', dispatch, 'Total Items:　 8');
        util.el('div', '', dispatch, 'Total Weight:　 566 kg');
        util.el('div', '', dispatch, 'Unassigned:　 8');
        util.el('div', '', dispatch, 'Assigned:　 0');
        const items = panel('Item Summary', 'wh-summary');
        items.innerHTML +=
          '<table><tr><th>Type</th><th>Count</th><th>Total Weight (kg)</th></tr><tr><td>Ambient</td><td>4</td><td>264</td></tr><tr><td>Chilled (2–8 °C)</td><td>2</td><td>182</td></tr><tr><td>Frozen (≤ -18 °C)</td><td>1</td><td>60</td></tr><tr><td>Hazardous (certified)</td><td>1</td><td>60</td></tr></table>';
        const bins = panel('Storage Bin Summary', 'wh-summary');
        bins.innerHTML +=
          '<table><tr><th>Temperature</th><th>Bins</th><th>Total Capacity (kg)</th></tr><tr><td>Ambient</td><td>2</td><td>600</td></tr><tr><td>Chilled (2–8 °C)</td><td>2</td><td>400</td></tr><tr><td>Frozen (≤ -18 °C)</td><td>1</td><td>250</td></tr><tr><td>Hazardous (certified)</td><td>1</td><td>200</td></tr></table>';
        const help = panel('Help & Legend', 'wh-help');
        for (const [kind, text] of [
          ['ambient', 'Ambient item / bin'],
          ['chilled', 'Chilled (2 – 8 °C)'],
          ['frozen', 'Frozen (≤ -18 °C)'],
          ['hazardous', 'Hazardous material (requires certified bin)'],
        ]) {
          const row = util.el('div', 'wh-legend-row', help);
          util.el('i', `wh-swatch wh-${kind}`, row);
          util.el('span', '', row, text);
        }
        util.el('hr', '', help);
        util.el('div', '', help, 'Drag item cards into bin drop areas.');
        if (display === 'panel') {
          const taskPanel = body.querySelector('.ref-panel');
          if (taskPanel) {
            help.hidden = true;
            overview.appendChild(taskPanel);
          }
        }
        if (display === 'toast') {
          const note = document.querySelector('.ref-note');
          if (note) {
            const dock = util.el('div', 'wh-notification-dock');
            body.after(dock);
            dock.appendChild(note);
            note.classList.add('wh-inline-note');
          }
        }
        win.insertBefore(headerTools, win.querySelector('.wh-clock'));
        document.body.classList.toggle('wh-end-at-bottom', ['footer', 'link', 'floating'].includes(placement));
        Object.assign(_c, { bins, dispatch, help, items, overview, panel, submit });
      },
  };

  env.site({
    name: 'design-use-dispatch-warehouse-04',
    template: 'site/base',
    design: { parts },
  });
})();
