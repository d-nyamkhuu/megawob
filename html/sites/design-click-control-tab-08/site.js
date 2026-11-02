(function () {
  'use strict';
  const palette = { bg: '#f5f2e9', panel: '#f5f1e3', fg: '#060a43', muted: '#3a3c6e', line: '#85869c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original toast lives in the title bar, including on short screens.
      if (_c.ctx.display === 'toast') _c.display = 'toast';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'homepage');
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.instr = _c.display;
      const header = u.el('header', 'head', shell);
      u.el('i', 'hp-house', header);
      const badge = u.el('div', 'badge', header);
      u.el('i', 'hp-star', badge);
      u.el('span', '', badge, 'A Small Place on the Web');
      u.el('i', 'hp-star', badge);
      Object.assign(_c, { shell, header, badge });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
        _c.header.insertBefore(note, _c.badge);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'work', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task';
      }
    },
    'frame.stage': () => (_c) => {
      const center = _c.util.el('section', 'center', _c.body);
      _c.stage = _c.util.el('div', 'stage', center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-text').dataset.display = _c.display;
        _c.header.insertBefore(note, _c.badge);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const stamp = u.el('div', 'stamp', _c.shell);
      u.el('i', 'hp-sprout', stamp);
      u.el('span', '', stamp, 'Last updated: Apr 12, 1996');
      const thanks = u.el('span', 'thanks', stamp, 'Thanks for visiting!');
      u.el('i', 'hp-heart', stamp);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.shell.appendChild(foot);
      const next = u.el('button', 'nexttab', foot, 'Next Tab');
      next.type = 'button';
      next.addEventListener('click', () => {
        const tabs = Array.from(document.querySelectorAll('.uc-tab'));
        if (!tabs.length) return;
        const k = tabs.findIndex(t => t.hasAttribute('data-active') || t.getAttribute('aria-selected') === 'true');
        tabs[(k + 1) % tabs.length].click();
      });
      foot.insertBefore(next, foot.firstChild);
      if (_c.placement === 'link' && _c.submit) stamp.insertBefore(_c.submit, thanks);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el=ctx.util.el('section','perturb '+ctx.kind,document.body);
      ctx.util.el('strong','',el,{cookie:'Cookie preferences',toast:'Notification',chat:'Support',promo:'A special offer',banner:'Service notice'}[ctx.kind]);
      ctx.util.el('p','',el,{cookie:'Choose your preferences to continue.',toast:'Your workspace is ready.',chat:'How can we help?',promo:'Explore the latest tools.',banner:'A new update is available.'}[ctx.kind]);
      const dismiss=ctx.util.el('button','dismiss',el,ctx.kind==='cookie'?'Accept':'Close');dismiss.type='button';dismiss.addEventListener('click',ctx.dismiss);return{el,dismiss};
    },
  };
  env.site({
    name: 'design-click-control-tab-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-tab-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0b1fb8'],
      LOW_ACCENTS: ['#0b1fb8'],
      parts,
    },
  });
})();
