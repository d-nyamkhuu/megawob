// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  // One engraved, monochrome icon vocabulary for tabs and card controls.
  const ICONS = {
    Accounts: 'M2 11 12 2l10 9M5 10v12h5v-8h5v8h4V10M17 5V2h3v6',
    Transfers: 'M3 8h18l-5-5m5 5-5 5M21 17H3l5-5m-5 5 5 5',
    'Bill Pay': 'M4 1h17v22H4zM8 5h9M8 9h9M8 13h9M8 17h6',
    Cards: 'M2 5h21v16H2zM2 10h21M6 14h4v3H6zM17 15h3',
    Transactions: 'M5 1h16v22H5zM9 5h2m3 0h4M9 9h2m3 0h4M9 13h2m3 0h4M9 17h2m3 0h4',
    Disputes: 'M5 1h11l5 5v17H5zM16 1v6h5M8 10h10M8 14h10M8 18h8',
    Services: 'm10 2 4 0 1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1zM16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
    Lock: 'M5 10h15v13H5zM8 10V6a5 5 0 0 1 10 0v4M12 15v4',
    Minimize: 'M5 19h14', Maximize: 'M5 4h15v16H5z', Close: 'm5 4 15 16M20 4 5 20',
    Bank: 'M2 1h20v22H2zM5 3h5v7H5zM14 3h5v7h-5zM5 14h5v7H5zM14 14h5v7h-5zM3 2l18 20M21 2 3 22',
  };

  function etched(util, parent, name) {
    const svg = util.svg('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'square','stroke-linejoin':'miter','aria-hidden':'true'}, parent);
    util.svg('path', {d:ICONS[name] || ICONS.Cards}, svg);
    return svg;
  }

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      if (kind === 'banner' || kind === 'toast') {
        el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom + 2}px`;
      }
      if (kind === 'cookie' || kind === 'chat') {
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end && end.getBoundingClientRect();
        if (endRect && endRect.top > window.innerHeight * .65) {
          el.style.bottom = `${window.innerHeight - endRect.top + 10}px`;
        }
      }
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
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = 'light';
      const root = document.documentElement;
      let accent = '#ff6b25';
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      if (roomy) rng.bool(0.35);
      if (W >= 1180) rng.bool(0.5);
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Pioneer National Bank - Personal Banking');
      etched(util, util.el('span', 'os2-system-icon', brand), 'Bank');
      brand.dataset.role = 'brand';
      const win = util.el('div', 'os2-window-controls', header);
      for (const [symbol, title] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close window']]) {
        const ctl = util.el('span', 'os2-window-control', win);
        etched(util, ctl, title === 'Close window' ? 'Close' : title);
        ctl.setAttribute('aria-label', title);
      }
      {
        const n = util.el('nav', 'ref-nav os2-nav', header);
        const items = [
          ['⌂', 'Accounts'], ['⇄', 'Transfers'], ['▤', 'Bill Pay'], ['▣', 'Cards'],
          ['▦', 'Transactions'], ['▤', 'Disputes'], ['⚙', 'Services'],
        ];
        for (const [icon, item] of items) {
          const a = util.el('a', 'ref-navlink os2-navlink', n);
          etched(util, util.el('span', 'os2-nav-icon', a), item);
          util.el('span', '', a, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      if (false && nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { brand, header, win });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const rightColumn = util.el('div', 'os2-right-column', body);
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) rightColumn.append(taskPanel);
      const summary = util.el('aside', 'os2-card-summary', rightColumn);
      util.el('h2', '', summary, 'Card Summary');
      const card = util.el('div', 'os2-card-line', summary);
      const thumbnail = util.el('div', 'os2-card-chip', card);
      util.el('span', 'os2-card-stripe', thumbnail);
      util.el('span', 'os2-card-small-chip', thumbnail);
      util.el('span', 'os2-summary-card-number', thumbnail, '4481');
      const cardText = util.el('div', '', card);
      util.el('strong', 'os2-card-name', cardText, 'Rewards Card  ••••  4481');
      util.el('div', '', cardText, 'Pioneer National Bank');
      for (const [label, value] of [['Available credit:', '$4,732.60'], ['Current balance:', '$1,267.40']]) {
        const row = util.el('div', 'os2-balance', summary);
        util.el('span', '', row, label); util.el('span', '', row, value);
      }
      util.el('h2', '', summary, 'Card Controls');
      for (const [icon, label] of [['Lock', 'Lock Card'], ['Cards', 'Report Lost or Stolen'], ['Services', 'Manage Alerts']]) {
        const line = util.el('div', 'os2-control-line', summary);
        etched(util, line, icon); util.el('span', '', line, label);
      }
      util.el('h2', '', summary, 'Dispute Status');
      const statuses = util.el('div', 'os2-status-table', summary);
      const statusHead = util.el('div', 'os2-status-row os2-table-head', statuses);
      util.el('span', '', statusHead, 'Status');
      util.el('span', '', statusHead, 'Count');
      for (const [status, count] of [['Open', '1'], ['In Review', '0'], ['Resolved', '3'], ['Closed', '0']]) {
        const row = util.el('div', 'os2-status-row', statuses);
        util.el('span', '', row, status);
        util.el('span', '', row, count);
      }
      util.el('h2', '', summary, 'Recent Activity (Last 5)');
      const recent = util.el('div', 'os2-recent', summary);
      const recentHead = util.el('div', 'os2-recent-row os2-table-head', recent);
      ['Date', 'Description', 'Amount'].forEach(text => util.el('span', '', recentHead, text));
      const recentBody = util.el('div', 'os2-recent-body', recent);
      for (const [date, merchant, amount] of [
        ['2027-02-28', 'Oakwood Hardware', '$26.19'], ['2027-02-27', 'Metro Transit', '$3.25'],
        ['2027-02-26', 'Sunrise Hotel', '$178.40'], ['2027-02-24', 'Bianchi & Figli', '$102.87'],
        ['2027-02-23', 'Harborview Electronics', '$299.00'],
      ]) {
        const row = util.el('div', 'os2-recent-row', recentBody);
        util.el('span', '', row, date);
        util.el('span', '', row, merchant);
        util.el('span', '', row, amount);
      }
      Object.assign(_c, { card, cardText, recent, recentBody, recentHead, rightColumn, stage, statusHead, statuses, summary, taskPanel, thumbnail });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-bank-dispute-02',
    template: 'site/base',
    design: { parts },
  });
})();
