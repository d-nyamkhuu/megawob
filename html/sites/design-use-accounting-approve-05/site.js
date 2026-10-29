// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    endLabel: (base, S) => function (rng, content) {
      return rng.fork('ledger/end-label').bool(.78) ? 'Continue' : content.endLabel(rng);
    },
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      _c.decoys = [];
      if (!_c.ctx.finish) {
        const place = _c.rng.fork('ledger/end-place').pick(['header', 'header', 'header', 'footer', 'link', 'icon']);
        _c.placement = (place === 'footer' || place === 'link') && !_c.wantFooter ? 'header' : place;
      }
    },
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
      if (kind === 'promo' || kind === 'chat') {
        const title = util.el('div', 'ap-overlay-title', box, kind === 'chat' ? 'Chat with us' : 'Stay in the loop');
        box.prepend(title);
        if (kind === 'promo') {
          const close = util.el('button', 'ap-overlay-close', title, '×');
          close.type = 'button'; close.setAttribute('aria-label', closeLabelForOverlay());
          close.addEventListener('click', () => ctx.dismiss('close'));
          util.el('span', 'ap-envelope', box, '✉');
        } else title.appendChild(dismiss);
        const field = util.el('input', 'ap-overlay-input', box);
        field.type = 'text'; field.setAttribute('aria-label', kind === 'chat' ? 'Message' : 'Email address');
        field.placeholder = kind === 'chat' ? 'Type a message...' : 'Your email address';
        box.insertBefore(field, row);
        if (kind === 'chat') btn('Send', null, true);
      }
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        el.style.top = header.getBoundingClientRect().bottom + 'px';
      }
      const end = document.querySelector('[data-role="submit"]');
      if (end && (kind === 'cookie' || kind === 'chat')) {
        const rect = end.getBoundingClientRect();
        if (rect.top > window.innerHeight - 120) el.style.bottom = window.innerHeight - rect.top + 8 + 'px';
      }
      function closeLabelForOverlay() { return word ? word('close') : 'Close'; }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      util.el('div', 'ap-title', header, '▣ LedgerPro 98   -   Accounting Workspace');
      const windowButtons = util.el('div', 'ap-window-buttons', header);
      ['_', '□', '×'].forEach(t => util.el('span', '', windowButtons, t));
      const menu = util.el('div', 'ap-menu', header);
      ['File', 'Edit', 'View', 'Tools', 'Reports', 'Window', 'Help'].forEach(t => util.el('span', '', menu, t));
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const rail = util.el('aside', 'ap-rail', body);
      util.el('div', 'ap-rail-heading', rail, 'Workspaces');
      const glyphs = {
        Home:'<path d="M3 12 15 3l12 9M6 11v17h18V11M12 28v-9h6v9" fill="#d9d9d9" stroke="#222" stroke-width="2"/>',
        Reconcile:'<path d="M3 5q7-3 12 2 5-5 12-2v21q-7-3-12 2-5-5-12-2z" fill="#f7f5ed" stroke="#222" stroke-width="2"/><path d="M15 7v21M6 10h6M18 10h6M6 15h6M18 15h6" stroke="#666"/>',
        Journal:'<path d="M5 2h19v27H5z" fill="#eee" stroke="#222" stroke-width="2"/><path d="M9 8h11M9 13h11M9 18h11M9 23h7" stroke="#555" stroke-width="2"/>',
        Expenses:'<path d="M6 2h18v25l-3-2-3 2-3-2-3 2-3-2-3 2z" fill="#f4f4f4" stroke="#222" stroke-width="2"/><path d="M9 8h11M9 13h11M9 18h11" stroke="#555" stroke-width="2"/>',
        Approvals:'<path d="M2 8h12l3 3h11v17H2z" fill="#e8ce78" stroke="#222" stroke-width="2"/><path d="M2 11h26v17H2z" fill="#e5e5e5" stroke="#222" stroke-width="2"/>',
        Payables:'<path d="M3 9 15 2l12 7-12 7zM3 16l12 7 12-7M3 22l12 7 12-7" fill="#d6c38e" stroke="#222" stroke-width="2"/>',
        Reports:'<path d="M4 2h22v26H4z" fill="#f4f4f4" stroke="#222" stroke-width="2"/><path d="M8 23v-7h4v7M14 23V9h4v14M20 23v-11h4v11" fill="#7699c4" stroke="#17223b" stroke-width="1"/>',
        Contacts:'<circle cx="9" cy="8" r="4" fill="#f1c497" stroke="#222"/><circle cx="21" cy="8" r="4" fill="#f1c497" stroke="#222"/><path d="M3 27V17q0-5 6-5t6 5v10z" fill="#3a994f" stroke="#222" stroke-width="2"/><path d="M15 27V17q0-5 6-5t6 5v10z" fill="#467ab6" stroke="#222" stroke-width="2"/>',
        Accounts:'<path d="M3 3h24v25H3z" fill="#ddd" stroke="#222" stroke-width="2"/><path d="M8 3v25M12 9h12M12 14h12M12 19h12M12 24h12" stroke="#555" stroke-width="1.5"/>',
        Settings:'<path d="m4 27 14-14q-3-5 0-9l4 5 5-2q1 7-6 10L8 30z" fill="#aaa" stroke="#222" stroke-width="2"/>'
      };
      const links = [['⌂','Home'],['▤','Reconcile'],['▣','Journal'],['▤','Expenses'],['▱','Approvals'],['▰','Payables'],['▥','Reports'],['♟','Contacts'],['▣','Accounts'],['⚒','Settings']];
      links.forEach(([icon,label]) => {
        const row = util.el('a', 'ap-rail-link' + (label === 'Approvals' ? ' selected' : ''), rail);
        row.href = '#'; row.dataset.role = 'nav';
        const mark = util.el('span', 'ap-rail-icon', row);
        mark.innerHTML = '<svg viewBox="0 0 30 31" aria-hidden="true">' + glyphs[label] + '</svg>';
        util.el('span', 'ap-rail-text', row, label);
        row.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {what:'sidebar', label}); });
      });
      Object.assign(_c, {body});
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const frame = util.el('div', 'ap-workspace-chrome', body);
      const heading = util.el('div', 'ap-page-heading', frame);
      util.el('div', 'ap-page-title', heading, 'Accounts Payable');
      const instruction = document.querySelector('.ref-instruction');
      if (instruction) heading.appendChild(instruction);
      const tabs = util.el('div', 'ap-tabs', frame);
      ['Invoices', 'Purchase Orders', 'Payments', 'Vendors'].forEach((t,i) => {
        const a = util.el('a', i ? '' : 'current', tabs, t);
        a.href = '#'; a.addEventListener('click', e => {e.preventDefault(); env.log('decoy', {what:'tab',label:t});});
      });
      const filters = util.el('div', 'ap-filters', frame);
      util.el('span', '', filters, 'View:'); util.el('div', 'ap-filter-select', filters, 'Pending Approval');
      util.el('span', '', filters, 'Date Range:'); util.el('div', 'ap-filter-select', filters, 'All Dates');
      util.el('span', 'ap-filter-push', filters, 'Search:');
      const search = util.el('input', 'ap-filter-search', filters); search.type = 'text'; search.setAttribute('aria-label','Search invoices');
      const go = util.el('button', 'ap-go', filters, 'Go'); go.type = 'button';
      go.addEventListener('click', () => env.log('decoy',{label:'Go'}));
      const stage = util.el('main', 'ref-stage', body);
      stage.style.setProperty('padding-top', frame.offsetHeight + 'px', 'important');
      S.frameAlign(_c, stage);
      const summary = util.el('aside', 'ap-summary', body);
      const section = title => { const box = util.el('section','ap-summary-box',summary); util.el('h2','',box,title); return box; };
      let box = section('AP Summary');
      [['Pending Approval','12'],['Approved','28'],['In Payment Queue','6'],['Paid (This Month)','45']].forEach(([a,b]) => {const row=util.el('div','ap-summary-row',box); util.el('span','',row,a); util.el('span','',row,b);});
      box = section('Aging (Pending)');
      [['Current','8'],['1–30 Days','3'],['31–60 Days','1'],['Over 60 Days','0']].forEach(([a,b]) => {const row=util.el('div','ap-summary-row',box); util.el('span','',row,a); util.el('span','',row,b);});
      box = section('Total Pending'); util.el('div','ap-summary-total',box,'$48,320.50');
      box = section('Recent Invoices'); util.el('div','ap-summary-recent',box);
      Object.assign(_c, {stage});
    },
  };

  env.site({
    name: 'design-use-accounting-approve-05',
    template: 'site/base',
    design: { parts },
  });
})();
