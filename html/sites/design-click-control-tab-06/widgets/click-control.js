// Design of this site on the click-control/controls template (templates/click-control/controls.js): tab buttons with icon and number, a hero panel and a browser-style toolbar under the tab strip.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-06',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: (base, S) => (ctx, tb, t, i) => {
        const { util } = ctx;
        const icon = S.icon;
        const tabIcon = util.el('span', 'gn-tab-icon', tb);
        tabIcon.innerHTML = icon(['globe', 'list', 'image'][i % 3]);
        if(i % 3 === 1) tabIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="1"/><path d="M6 7h12M6 11h12M6 15h12M6 18h8"/></svg>';
        tb.prepend(tabIcon);
        const ordinal = util.el('span', 'gn-tab-number', tb, String(i + 1));
        ordinal.setAttribute('aria-hidden','true');
        ordinal.hidden = /#\s*\d/.test(t.label);
        tabIcon.after(ordinal);
      },
      tabPanel: () => (ctx, p, t, i, links) => {
        const { util } = ctx;
        const hero = util.el('div', 'gn-hero', p);
        const globe = util.el('div', 'gn-globe', hero);
        globe.innerHTML = '<svg viewBox="0 0 128 128" fill="none" stroke="currentColor" stroke-width="9"><circle cx="64" cy="64" r="56"/><ellipse cx="64" cy="64" rx="24" ry="56"/><path d="M12 44h104M12 84h104"/></svg>';
        util.el('h2', '', hero, 'Welcome to Example');
        const prose = util.el('div', 'gn-prose', hero);
        t.words.forEach((word,j)=>{if(j)prose.append(' ');if(word.link){const a=util.el('span','uc-link',prose,word.text);a.dataset.key=i+'.'+j;a.dataset.role='link';links.push(a);}else prose.append(word.text);});
        const start = util.el('button', 'gn-start', hero, 'Get Started');
        start.type = 'button';
      },
      tabsBuilt: (base, S) => (ctx, wrap, strip) => {
        const { util } = ctx;
        const icon = S.icon;
        const toolbar = util.el('div', 'gn-browser-toolbar', wrap);
        strip.after(toolbar);
        const arrow = (path) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>';
        const nav = util.el('div', 'gn-browser-nav', toolbar);
        nav.innerHTML = arrow('<path d="M20 12H4m8-8-8 8 8 8"/>')+arrow('<path d="M4 12h16m-8-8 8 8-8 8"/>')+arrow('<path d="M20 4v6h-6M20 10a8 8 0 1 0 0 7"/>');
        const address = util.el('div', 'gn-address', toolbar);
        address.innerHTML = icon('lock');
        util.el('span', '', address, 'https://www.example.com');
        const star = util.el('span', 'gn-star', address);star.innerHTML = icon('star');
        util.el('span', 'gn-kebab', toolbar).innerHTML = arrow('<circle cx="12" cy="4" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="20" r="1"/>');
      },
    },
  },
});
