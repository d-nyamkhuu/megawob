// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
    'frame.header': (base, S) => function (_c) {
      const { placement, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.endPlacement = placement || 'none';
      // The design's navigation is an app rail, not desktop window frame.
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      {
        const icons={
          file:'M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h8',
          mail:'M3 5h18v14H3V5Zm0 1 9 7 9-7',
          user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
          folder:'M2 5h7l2 3h11v13H2V5Z',
          calendar:'M3 5h18v17H3V5Zm4-3v6m10-6v6M3 10h18M7 14h1m3 0h1m3 0h1m-9 4h1m3 0h1',
          help:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 8a3 3 0 1 1 4 3c-1 1-1 1-1 3m0 3h.01',
          check:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-15 0 3 3 7-8',
          form:'M3 2h18v20H3V2Zm4 5h10M7 11h2m3 0h5m-10 5h2m3 0h5',
          clip:'m8 16 8-8a3 3 0 0 0-4-4L3 13a6 6 0 0 0 8 8L21 11a4 4 0 0 0-6-6L6 14a2 2 0 0 0 3 3l8-8',
          pen:'M3 21h18M5 17l2-5L18 1l4 4L11 16l-6 1Z'
        };
        const icon=(parent,name)=>{
          const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
          for(const [k,value]of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(k,value);
          const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',icons[name]);svg.append(path);parent.append(svg);
        };
        const rail = util.el('aside', 'gov-rail', body);
        const mark = util.el('div', 'gov-mark', rail);
        util.el('span', 'gov-shield', mark, '✚');
        util.el('strong', 'gov-brand', rail, 'Civic\nServices');
        const links = util.el('nav', 'gov-rail-links', rail);
        for (const [symbol, text] of [['file','Applications'],['mail','Messages'],['user','My Details'],['folder','Documents'],['calendar','Appointments'],['help','Help']]) {
          const item = util.el('div', 'gov-rail-link', links);
          icon(util.el('b', '', item),symbol); util.el('span', '', item, text);
        }
        const side = util.el('aside', 'ref-side', body);
        util.el('div', 'gov-side-title', side, 'Application details');
        const details = util.el('div', 'gov-details', side);
        for (const [k, v] of [['Programme','Civic Support Allowance'],['Description','Monthly support for residents on a low income. Includes housing and living costs.'],['Status','Not started'],['Application ID','CSA-2024-0817'],['Date created','17 Aug 2024']]) {
          util.el('span','',details,k); util.el('strong','',details,v);
        }
        const sections = util.el('nav','gov-sections',side);
        for (const [symbol,text] of [['file','Overview'],['check','Eligibility'],['form','Application form'],['clip','Evidence checklist'],['pen','Review and declaration']]) {
          const row=util.el('div','gov-section',sections); icon(util.el('b','',row),symbol); util.el('span','',row,text);
        }
        const contact=util.el('div','gov-contact',side); util.el('b','',contact,'Contact');
        util.el('p','',contact,'Civic Support Office'); util.el('p','',contact,'☎  +41 58 462 90 00');
        const email=util.el('p','gov-contact-email',contact);
        util.el('span','',email,'✉');
        const emailLink=util.el('a','',email,'support@civic.gov.ch');emailLink.href='mailto:support@civic.gov.ch';
        util.el('p','',contact,'Mon – Fri  08:00 – 17:00');
      }
      Object.assign(_c, { body });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, endBtn, header, headerTools, label, placement, stage, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // Keep bottom controls in one row, including their inert look-alikes.
      if (placement !== 'header' && placement !== 'icon' && headerTools.childElementCount) {
        const bottom = document.querySelector('.ref-float-dock') || document.querySelector('.ref-foot > .ref-tools') || util.el('div','ref-actionbar',document.body);
        bottom.prepend(headerTools);
      }
      stage.swissChrome = {
        note:header.querySelector('.ref-instruction'),
        tools:header.contains(headerTools)?headerTools:null,
        panel:body.querySelector('.ref-panel'),
      };
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-gov-portal-checklist-03',
    template: 'site/base',
    design: { parts },
  });
})();
