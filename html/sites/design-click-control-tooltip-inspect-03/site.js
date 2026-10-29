(function () {
  'use strict';
  const cfg = {
    tools: 'Home|Accounts|Contacts|Opportunities|Reports',
    rail: 'Dashboard|Accounts|Contacts|Opportunities|Tasks|Calendar|Reports',
  };
  env.site({
    name: 'design-click-control-tooltip-inspect-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        shell = u.el('main', 'shell', document.body);
      document.body.className = 'ref crm';
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      brand.innerHTML = '<span class="crm-mark">●</span><b>Acme</b> CRM';
      const tools = u.el('div', 'tools', head);
      cfg.tools.split('|').forEach((s, i) => u.el('span', 'menu-label' + (i === 1 ? ' selected' : ''), tools, s));
      u.el('div', 'searchbox', head, 'Search accounts, contacts...　⌕');
      const work = u.el('div', 'work', shell),
        rail = u.el('nav', 'rail', work),
        icons = ['⌂', '▦', '♙', '▤', '☑', '▦', '▥'];
      cfg.rail.split('|').forEach((s, i) => {
        const n = u.el('div', i === 1 ? 'active' : '', rail);
        n.innerHTML = '<i>' + icons[i] + '</i><span>' + s + '</span>';
      });
      const main = u.el('section', 'mainarea', work);
      u.el('div', 'page-title', main, 'Accounts');
      const note = u.el('div', 'instruction', main, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', main),
        aside = u.el('aside', 'inspector', work);
      u.el('h2', '', aside, 'Account Summary');
      [
        ['Total Accounts', '248'],
        ['Pending Approval', '6'],
        ['Active Accounts', '214'],
        ['Inactive Accounts', '28'],
      ].forEach(([a, b]) => {
        const p = u.el('p', 'stat', aside);
        u.el('span', '', p, a);
        u.el('b', '', p, b);
      });
      u.el('h2', 'activity-title', aside, 'Recent Activity');
      [
        'Apr 26|Account updated|Global Tech',
        'Apr 25|New account|Riverside Medical',
        'Apr 24|Account updated|Summit Industries',
        'Apr 23|New account|Carter & Blake LLP',
        'Apr 22|Account updated|Pine Valley Foods',
      ].forEach((s) => {
        const p = u.el('p', 'activity', aside);
        p.innerHTML = s.replace('|', '　').replace('|', '<br>');
      });
      u.el('footer', 'footer', shell);
      const status = u.el('div', 'bottom-status', shell, 'Ready');
      let submit = null;
      const r = ctx.rng.fork('chrome/end'),
        bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
        str = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x),
        label = r.bool(0.5) ? 'Submit' : str(r.pick(bank.filter((x) => str(x) !== 'Submit'))),
        place = r.pick(['actions', 'actions', 'header', 'status']),
        cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const choices = [...new Set(bank.map(str).filter((x) => x.toLowerCase() !== label.toLowerCase()))];
        if (choices.length) collide = cr.pick(choices);
      }
      const make = (parent, text, cls, handler) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.addEventListener('click', handler);
        return b;
      };
      if (ctx.finish !== true) {
        status.classList.toggle('status-active', place === 'status');
        submit = make(head, label, 'submit end-' + place, ctx.submit);
        if (collide) make(head, collide, 'xtra-task', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el('p', '', el, 'Your workspace is ready.');
      const d = ctx.util.el('button', 'dismiss', el, 'Close');
      d.type = 'button';
      d.addEventListener('click', ctx.dismiss);
      return { el, dismiss: d };
    },
  });
})();
