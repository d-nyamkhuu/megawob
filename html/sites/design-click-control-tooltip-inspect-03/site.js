(function () {
  'use strict';
  const cfg = {
    tools: 'Home|Accounts|Contacts|Opportunities|Reports',
    rail: 'Dashboard|Accounts|Contacts|Opportunities|Tasks|Calendar|Reports',
  };
  const palette = { bg: '#eaf5ff', panel: '#fff', fg: '#10264a', muted: '#49627f', line: '#c6dcef' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'crm');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'brand', head);
      brand.innerHTML = '<span class="crm-mark">●</span><b>Acme</b> CRM';
      const tools = u.el('div', 'tools', head);
      cfg.tools.split('|').forEach((s, i) => u.el('span', 'menu-label' + (i === 1 ? ' selected' : ''), tools, s));
      u.el('div', 'searchbox', head, 'Search accounts, contacts...　⌕');
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      const icons = ['⌂', '▦', '♙', '▤', '☑', '▦', '▥'];
      cfg.rail.split('|').forEach((s, i) => {
        const n = u.el('div', i === 1 ? 'active' : '', rail);
        n.innerHTML = '<i>' + icons[i] + '</i><span>' + s + '</span>';
      });
      const main = u.el('section', 'mainarea', work);
      u.el('div', 'page-title', main, 'Accounts');
      const toolbar = u.el('div', 'task-toolbar', main);
      Object.assign(_c, { shell, head, work, main, toolbar, header: main });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const note = _c.main.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('div', 'stage', _c.main);
      const aside = u.el('aside', 'inspector', _c.work);
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
      u.el('footer', 'footer', _c.shell);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.main.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('bottom-status');
        foot.classList.toggle('status-active', _c.placement === 'footer' || _c.placement === 'link');
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
        _c.shell.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-click-control-tooltip-inspect-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2574bd'],
      LOW_ACCENTS: ['#2574bd'],
      parts,
    },
  });
})();
