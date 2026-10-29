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
        const endControl = document.querySelector('[data-role="submit"]');
        const endRect = endControl?.getBoundingClientRect();
        const viewHeight = document.documentElement.clientHeight;
        const bottomSpace = endRect && endRect.top > viewHeight - 100 ? viewHeight - endRect.top + 10 : 0;
        if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
        if (kind === 'promo') {
          el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
          el.style.bottom = `${bottomSpace}px`;
        }
        if (kind === 'cookie') el.style.bottom = `${bottomSpace + 12}px`;
        if (kind === 'chat') el.style.bottom = `${bottomSpace + 20}px`;
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          const art = util.el('div', 'nb-newsletter-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 250 250" aria-hidden="true"><circle cx="122" cy="124" r="105" fill="#eff6ff"/><circle cx="120" cy="42" r="14" fill="#c7e0ff"/><path d="m91 103 111-38-35 110-33-38-24 14 9-29z" fill="#0873ed"/><path d="m119 122 83-57-68 72" fill="#004caf"/><path d="m34 135 60-44 54 43-58 64z" fill="#c9daf0"/><path d="M34 135h114v67H34z" fill="white"/><path d="m34 135 56 38 58-38" fill="none" stroke="#a9baff" stroke-width="3"/><path d="m34 202 45-43m69 43-45-43" stroke="#e5efff" stroke-width="2"/></svg>';
          util.el('h2', 'nb-newsletter-title', box, 'Get the latest product updates');
          const close = util.el('button', 'nb-newsletter-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', word ? word('close') : 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'nb-newsletter-email', box);
          email.type = 'email';
          email.placeholder = 'Enter your email address';
          email.setAttribute('aria-label', 'Email address');
        }
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
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, display, header, headerTools, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);

        // BeOS desktop frame and fixed utility navigation for this design.
        document.body.classList.add('beos-mail');
        document.body.classList.toggle('beos-header-note', display === 'header');
        const menu = util.el('div', 'beos-menu', document.body);
        for (const item of ['File', 'Edit', 'View', 'Message', 'Accounts', 'Tools', 'Window', 'Help'])
          util.el('span', '', menu, item);
        const toolbar = util.el('div', 'beos-toolbar', body);
        for (const [icon, label] of [
          ['✉', 'New'],
          ['↶', 'Reply'],
          ['↶', 'Reply All'],
          ['➜', 'Forward'],
          ['▤', 'Delete'],
          ['▧', 'Print'],
          ['☑', 'Mark Read'],
        ]) {
          const item = util.el('div', 'beos-tool', toolbar);
          util.el('span', 'beos-tool-icon', item, icon);
          util.el('span', '', item, label);
        }

        // Northbridge Finance app navigation for this reference design. Keep the
        // randomized legacy frame above intact for seeded draw compatibility.
        const topbar = util.el('div', 'nb-topbar', header);
        const logo = util.el('div', 'nb-brand', topbar);
        const brandMark = util.el('span', 'nb-mark', logo);
        brandMark.innerHTML =
          '<svg viewBox="0 0 40 34" aria-hidden="true"><path d="m20 0 8 13-8 13-8-13z" fill="#172b48"/><path d="M10 15 0 32h17l5-8z" fill="#223c5d"/><path d="m29 16 11 16H22l-2-4z" fill="#285797"/><path d="m20 26 3 6h-7z" fill="#6b89b2"/></svg>';
        util.el('strong', '', logo, 'Northbridge Finance');
        const tabs = util.el('nav', 'nb-tabs', topbar);
        for (const [name, active] of [
          ['Mail', true],
          ['Accounts Payable', false],
          ['Expenses', false],
          ['Vendors', false],
          ['Reports', false],
          ['Settings', false],
        ]) {
          const tab = util.el('span', `nb-tab${active ? ' is-active' : ''}`, tabs, name);
          if (active) tab.setAttribute('aria-current', 'page');
        }
        const search = util.el('div', 'nb-search', topbar);
        const searchIcon = util.el('span', 'nb-search-icon', search);
        searchIcon.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
        util.el('span', '', search, 'Search');
        const profile = util.el('div', 'nb-profile', topbar);
        util.el('span', 'nb-avatar', profile, 'JD');
        util.el('span', '', profile, 'Jamie Diaz');
        util.el('span', 'nb-chevron', profile, '⌄');
        if (headerTools) topbar.insertBefore(headerTools, search);
        const helpRail = util.el('aside', 'nb-help-rail', body);
        const taskPanel = body.querySelector('.ref-panel');
        if (taskPanel) helpRail.appendChild(taskPanel);
        const tips = util.el('section', 'nb-tips', helpRail);
        const tipsTitle = util.el('div', 'nb-tips-title', tips);
        const bulb = util.el('span', 'nb-bulb', tipsTitle);
        bulb.innerHTML =
          '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M7 20v-3C0 10 4 1 12 1s12 9 5 16v3" fill="#ffc928" stroke="#efab05"/><path d="M7 21h10M8 24h8M10 26h4" stroke="#69788a" stroke-width="2" stroke-linecap="round"/><path d="M7 9c0-3 2-4 5-4" fill="none" stroke="#fff1a9" stroke-width="2" stroke-linecap="round"/></svg>';
        util.el('span', '', tipsTitle, 'Tips');
        util.el(
          'p',
          '',
          tips,
          'You can open or preview attachments to review their contents. Look for common document types like PDF, Word or Excel files.',
        );
        util.el('div', 'nb-tips-rule', tips);
        util.el('strong', 'nb-tips-subtitle', tips, 'Common file types');
        for (const [icon, color, title, ext] of [
          ['PDF', '#dc3b32', 'PDF document', '.pdf'],
          ['W', '#2276d2', 'Word document', '.docx, .doc'],
          ['XLS', '#198754', 'Excel spreadsheet', '.xlsx, .xls'],
          ['P', '#e34b2f', 'PowerPoint presentation', '.pptx, .ppt'],
          ['≡', '#778391', 'Text document', '.txt'],
        ]) {
          const row = util.el('div', 'nb-filetype', tips);
          const badge = util.el('span', 'nb-filebadge', row, icon);
          if (icon === 'PDF')
            badge.innerHTML =
              '<svg viewBox="0 0 28 34" aria-hidden="true"><path d="M7 26c6-7 10-19 7-20-3 0-1 14 8 16 6 2 1-8-16 0-5 3-2 7 1 4z" fill="none" stroke="white" stroke-width="1.4"/></svg>';
          if (icon === 'XLS') badge.textContent = 'Xᴇ';
          badge.style.setProperty('--badge', color);
          const words = util.el('span', 'nb-filewords', row);
          util.el('span', '', words, title);
          util.el('small', '', words, ext);
        }
        Object.assign(_c, {
          brandMark,
          bulb,
          helpRail,
          logo,
          menu,
          profile,
          search,
          searchIcon,
          stage,
          tabs,
          taskPanel,
          tips,
          tipsTitle,
          toolbar,
          topbar,
        });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        document.body.classList.remove('nb-has-footer');
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
          foot.classList.toggle('nb-footer-controls', tools.childElementCount > 0);
          document.body.classList.toggle('nb-has-footer', tools.childElementCount > 0);
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-avoid-phishing-attachment-04',
    template: 'site/base',
    design: { parts },
  });
})();
