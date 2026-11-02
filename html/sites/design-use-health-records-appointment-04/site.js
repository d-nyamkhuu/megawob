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
        if (kind === 'cookie') {
          const cookie = util.el('div', 'rh-cookie-art', box);
          cookie.innerHTML =
            '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M59 32a27 27 0 1 1-27-27c0 8 5 13 12 13 0 8 6 14 15 14" fill="#d89847"/><g fill="#73461f"><circle cx="20" cy="20" r="4"/><circle cx="15" cy="36" r="4"/><circle cx="33" cy="28" r="4"/><circle cx="28" cy="48" r="4"/><circle cx="46" cy="43" r="4"/></g></svg>';
        }
        if (kind === 'promo') {
          const art = util.el('div', 'rh-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 200 220" aria-hidden="true"><ellipse cx="100" cy="110" rx="92" ry="105" fill="#eaf4fc"/><path d="M43 103 100 60l57 43v77H43z" fill="#fff" stroke="#282d31" stroke-width="3"/><rect x="60" y="67" width="80" height="96" rx="4" fill="#fff" stroke="#777" stroke-width="3"/><path d="M72 83h56M72 94h56M72 105h56M43 104l57 44 57-44M43 180l45-44m69 44-45-44" fill="none" stroke="#666" stroke-width="3"/><path d="m100 42 0-14m-25 20-8-12m58 12 8-12" stroke="#e9ad24" stroke-width="5"/></svg>';
          util.el('h2', 'rh-promo-title', box, 'Stay updated');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'cookie') {
          const title = util.el('b', 'rh-cookie-title', box.querySelector('.ref-ov-text'), 'We use cookies');
          box.querySelector('.ref-ov-text').prepend(title);
        }
        if (kind === 'promo') util.el('div', 'rh-email-placeholder', box, 'Enter your email address');
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
        if (kind === 'promo' || kind === 'cookie') {
          const close = util.el('button', 'rh-overlay-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
        }
        if (
          (kind === 'cookie' || kind === 'chat') &&
          document.querySelector('.ref-foot [data-role="submit"], .ref-float-dock')
        )
          el.style.bottom = '60px';
        if (kind === 'banner') {
          const pageBody = document.querySelector('.ref-body');
          const taskHeader = document.querySelector('.ref-task');
          const bodyTop = pageBody ? pageBody.getBoundingClientRect().top : 50;
          const headerBottom = taskHeader ? taskHeader.getBoundingClientRect().bottom : bodyTop;
          el.style.top = `${Math.max(bodyTop, headerBottom)}px`;
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
        const appTitle = util.el('div', 'ehr-titlebar', document.body);
        util.el('span', 'ehr-title-icon', appTitle, '✚');
        util.el('span', 'ehr-title-text', appTitle, 'Riverside Health');
        const winBtns = util.el('span', 'ehr-window-buttons', appTitle);
        for (const glyph of ['_', '□', '×']) util.el('span', 'ehr-window-button', winBtns, glyph);
        const menu = util.el('nav', 'rh-appnav', document.body);
        const logo = util.el('div', 'rh-logo', menu);
        util.el('span', 'rh-cross', logo, '✚');
        util.el('strong', '', logo, 'Riverside Health');
        for (const item of ['Patients', 'Appointments', 'Orders', 'Medications', 'Nursing', 'Beds', 'Reports']) {
          util.el('span', 'ehr-menu-item', menu, item);
        }
        const search = util.el('div', 'rh-search', menu);
        util.el('span', '', search, '⌕');
        util.el('span', '', search, 'Search patients, appointments...');
        const icons = util.el('div', 'rh-nav-icons', menu);
        icons.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17h14l-2-3V9a5 5 0 0 0-4-5V2h-2v2a5 5 0 0 0-4 5v5zm5 2a2 2 0 0 0 4 0"/></svg><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="5"/><path d="M3 21c0-10 18-10 18 0-5 3-13 3-18 0"/></svg>';
        const toolbar = util.el('div', 'ehr-toolbar', document.body);
        for (const icon of ['📂', '▤', '▤', '▦', '👥', '▦', '🖉', '▤', '▱'])
          util.el('span', 'ehr-tool-icon', toolbar, icon);
        Object.assign(_c, { H, W, appTitle, display, icons, logo, menu, roomy, search, tall, toolbar, winBtns });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.toggle('rh-has-instruction', display === 'header');
        S.frameBrand(_c, header);
        Object.assign(_c, { header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const overview = util.el('div', 'rh-overview', body);
        util.el('h3', '', overview, 'Appointment Overview');
        for (const [text, count] of [
          ['Today', 24],
          ['This Week', 118],
          ['This Month', 492],
          ['Upcoming', 312],
          ['Waitlist', 8],
          ['Arrived', 7],
          ['In Visit', 6],
          ['Checked Out', 9],
          ['No Show', 2],
        ]) {
          const row = util.el('div', 'rh-count-row', overview);
          util.el('span', '', row, text);
          util.el('span', '', row, String(count));
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, overview });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { W, body, display, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        stage.dataset.originalWidth = String(W - 40 - (display === 'panel' ? 294 : 0));
        S.frameAlign(_c, stage);
        Object.assign(_c, { stage });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { body, closeLabel, ctx, display, util } = _c;
        const status = util.el('div', 'rh-clinic', body);
        const clinicHeading = util.el('h3', 'rh-clinic-heading', status);
        clinicHeading.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:19px;vertical-align:middle;margin-right:7px;fill:none;stroke:currentColor;stroke-width:2"><path d="M3 21h18M5 21V8h14v13M3 8l9-6 9 6zM9 8v13M15 8v13M5 12h14M5 16h14M11 4v4M9 6h6"/></svg><span>Clinic Status</span>';
        for (const [text, count] of [
          ['Total Appointments', 24],
          ['In Progress', 6],
          ['Arrived', 7],
          ['Checked Out', 9],
          ['No Show', 2],
        ]) {
          const row = util.el('div', 'rh-count-row', status);
          util.el('span', '', row, text);
          util.el('span', '', row, String(count));
        }
        const load = util.el('div', 'rh-load', status);
        util.el('h3', '', load, 'Provider Load (Today)');
        // Provider labels are populated by the widget from the seeded chart.
        for (const count of [8, 7, 9]) {
          const item = util.el('div', 'rh-provider-load', load);
          const row = util.el('div', 'rh-count-row', item);
          util.el('span', 'rh-provider-name', row, 'Provider');
          util.el('span', '', row, `${count} / 14`);
          const meter = util.el('div', 'rh-load-track', item);
          util.el('div', 'rh-load-fill', meter).style.width = `${(count / 14) * 100}%`;
        }
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) status.insertBefore(taskPanel, status.firstChild);
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', document.body);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
          status.insertBefore(note, status.firstChild);
        }
        Object.assign(_c, { clinicHeading, load, status, taskPanel });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, headerTools, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const activityFooter = document.querySelector('.ref-foot');
        if (activityFooter && !activityFooter.querySelector('[data-role="submit"]')) {
          const footerTools = activityFooter.querySelector('.ref-tools');
          if (footerTools) while (footerTools.firstChild) headerTools.appendChild(footerTools.firstChild);
          activityFooter.remove();
        }
        Object.assign(_c, { activityFooter, submit });
      },
  };

  env.site({
    name: 'design-use-health-records-appointment-04',
    template: 'site/base',
    design: { parts },
  });
})();
