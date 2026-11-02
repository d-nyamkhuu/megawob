(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-reply-04',
    'brand': 'Flow',
    'mode': 'flow',
    'tokens': {
      'bg': '#f5f9fc',
      'panel': '#ffffff',
      'fg': '#111827',
      'accent': '#ff4b0b',
      'font': 'Arial,sans-serif',
      'line': '#dfe7ef',
      'muted': '#687992',
    },
    'nav': 'Home Explore Notifications Messages',
    'obstruction': null,
    'footer': '',
  };
  env.site({
    name: D.site,
    template: 'site/base',
    styles: ['site.css'],
    scripts: [],
    design: { parts: {
      'frame.theme': (base) => function(_c) {
      base(_c);
      const root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = 'flow';
      },
      'frame.header': (base) => function(_c) {
      const { ctx } = _c;
      const u = ctx.util;
      document.body.classList.add('instruction-' + _c.display);
      const shell = u.el('div', 'flow-shell', document.body);
      const header = u.el('header', 'flow-header', shell);
      const brand = u.el('div', 'flow-brand', header);
      u.el('span', 'flow-logo', brand, '▢');
      u.el('strong', '', brand, 'Flow');
      const icons = {
        Home: '<path d="M3 11.5 12 4l9 7.5M6 10v11h12V10M10 21v-7h4v7"/>',
        Explore: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
        Notifications: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9M10 21h4"/>',
        Messages: '<rect x="2.5" y="4" width="19" height="16" rx="1"/><path d="m3 5 9 8 9-8"/>'
      };
      const nav = u.el('nav', 'flow-nav', header);
      for (const label of ['Home', 'Explore', 'Notifications', 'Messages']) {
        const item = u.el('button', 'flow-tab' + (label === 'Home' ? ' active' : ''), nav);
        item.type = 'button';
        item.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icons[label] + '</svg><span>' + label + '</span>';
        item.addEventListener('click', () => env.log('nav', { label }));
      }
      const profile = u.el('button', 'flow-profile', header);
      profile.type = 'button';
      profile.innerHTML = '<span class="flow-profile-photo"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
      Object.assign(_c, { shell, header });
      },
      'frame.nav': (base) => function(_c) {},
      'frame.instruction': (base) => function(_c) {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('flow-header-note');
      },
      'frame.tools': (base) => function(_c) {
      base(_c);
      _c.headerTools.classList.add('flow-header-actions');
      const note = _c.header.querySelector('.ref-instruction');
      const height = note ? Math.max(62, note.scrollHeight + 10) : 62;
      _c.root.style.setProperty('--flow-header-height', height + 'px');
      },
      'frame.body': (base) => function(_c) {
      const { ctx, shell } = _c;
      const u = ctx.util;
      const body = u.el('div', 'flow-body', shell);
      const following = u.el('aside', 'flow-following', body);
      u.el('h2', '', following, 'Following');
      const all = u.el('div', 'flow-all', following);
      u.el('span', 'flow-all-icon', all, '☰');
      const allLabel = u.el('div', '', all);
      u.el('strong', '', allLabel, 'All Posts');
      u.el('small', '', allLabel, '528 posts');
      const people = [
        ['avery_sadie','24 posts',0],['liamchen','17 posts',1],['nora.kim','31 posts',2],
        ['pixelplan','12 posts',3],['marco.davis','28 posts',4],['thegreenplate','14 posts',5],
        ['cityscapes','20 posts',6],['velasquez.art','11 posts',7],['runwithkai','19 posts',8]
      ];
      for (const [name,count,photo] of people) {
        const row = u.el('div', 'flow-person', following);
        const avatar = u.el('span', 'flow-avatar photo-' + photo, row);
        avatar.setAttribute('aria-hidden','true');
        const data = u.el('div', '', row);
        u.el('span', 'flow-person-name', data, name);
        u.el('small', '', data, count);
      }
      const discovery = u.el('aside', 'flow-discovery', body);
      const search = u.el('div', 'flow-search', discovery);
      search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/></svg>';
      const searchInput = u.el('input', '', search);
      searchInput.placeholder = 'Search people, posts, or topics';
      searchInput.setAttribute('aria-label', searchInput.placeholder);
      const card = u.el('section', 'flow-discovery-card', discovery);
      const trendHead = u.el('div', 'flow-side-head', card);
      u.el('h2', '', trendHead, 'Trending');
      u.el('a', '', trendHead, 'See all');
      const trends = [['Spring Trails','12.4K posts'],['Little Libraries','8.1K posts'],['Morning Routines','6.9K posts'],['City Parks','6.2K posts'],['Book Recommendations','5.8K posts']];
      trends.forEach(([name,count],i) => {
        const row = u.el('div', 'flow-trend', card);
        u.el('span', 'flow-trend-rank', row, String(i+1));
        const data = u.el('div', '', row);
        u.el('strong', '', data, name);
        u.el('small', '', data, count);
      });
      const followHead = u.el('div', 'flow-side-head flow-follow-head', card);
      u.el('h2', '', followHead, 'Who to follow');
      u.el('a', '', followHead, 'See all');
      for (const [name,desc,photo] of [['terra.walks','Hiking · Photography',9],['miles.juno','Music · Urban Life',10],['cafe.notebook','Coffee · Notes · Ideas',11]]) {
        const row = u.el('div', 'flow-suggest', card);
        u.el('span', 'flow-avatar photo-' + photo, row);
        const data = u.el('div', '', row);
        u.el('strong', '', data, name);
        u.el('small', '', data, desc);
        const b = u.el('button', '', row, 'Follow');
        b.type = 'button';
        b.addEventListener('click', () => { b.textContent = b.textContent === 'Follow' ? 'Following' : 'Follow'; });
      }
      Object.assign(_c, { body, discovery });
      },
      'frame.panel': (base) => function(_c) {
      const body = _c.body;
      _c.body = _c.discovery;
      base(_c);
      _c.body = body;
      const panel = _c.discovery.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('flow-panel-note');
        _c.discovery.prepend(panel);
      }
      },
      'frame.stage': (base) => function(_c) {
      base(_c);
      _c.stage.classList.add('stage', 'flow-stage');
      },
      'frame.toast': (base) => function(_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('flow-toast-note');
        _c.shell.append(note);
      }
      },
      'frame.footer': (base) => function(_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('flow-footer');
        _c.shell.append(foot);
      }
      },
      'frame.floating': (base) => function(_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.shell.append(dock);
      },
      overlay: (base) => function(ctx) {
      const u = ctx.util;
      if (ctx.kind === 'promo') {
        const shade = u.el('div', 'flow-overlay-shade', document.body);
        const el = u.el('section', 'flow-promo', document.body);
        el.setAttribute('role','dialog');
        el.setAttribute('aria-label','Get more stories in your inbox');
        u.el('div','flow-promo-image',el);
        const content=u.el('div','flow-promo-content',el);
        const close=u.el('button','flow-overlay-close',el,'×');
        close.type='button'; close.setAttribute('aria-label','Close');
        u.el('h2','',content,'Get more stories in your inbox');
        u.el('p','',content,'Join our newsletter for the best posts, travel ideas, and community highlights.');
        const email=u.el('input','',content);
        email.type='email';email.placeholder='Your email address';email.setAttribute('aria-label','Your email address');
        const subscribe=u.el('button','flow-subscribe',content,'Subscribe');
        subscribe.type='button';
        u.el('small','',content,'No spam. Unsubscribe anytime.');
        const dismiss=()=>{shade.remove();ctx.dismiss()};
        close.addEventListener('click',dismiss);
        subscribe.addEventListener('click',dismiss);
        return {el,dismiss:close};
      }
      if (ctx.kind === 'chat') {
        const el=u.el('section','flow-chat',document.body);
        el.setAttribute('role','dialog');el.setAttribute('aria-label','Help chat');
        const close=u.el('button','flow-overlay-close',el,'×');
        close.type='button';close.setAttribute('aria-label','Close');close.addEventListener('click',()=>ctx.dismiss());
        u.el('div','flow-chat-logo',el,'☏');
        u.el('strong','',el,'How can we help?');
        u.el('p','',el,'Our team is here to answer your questions.');
        const footer=u.el('div','flow-chat-footer',el);
        const input=u.el('input','',footer);input.placeholder='Type a message...';input.setAttribute('aria-label','Type a message');
        const send=u.el('button','',footer,'➤');send.type='button';send.addEventListener('click',()=>env.log('chat',{message:input.value}));
        return {el,dismiss:close};
      }
      if (ctx.kind === 'banner') {
        const el=u.el('section','flow-banner',document.body);
        el.setAttribute('role','status');
        u.el('span','flow-banner-icon',el,'⌁');
        u.el('b','',el,'Spring into reading: Discover local little libraries in your area.');
        u.el('a','',el,'Learn more');
        const close=u.el('button','',el,'×');close.type='button';close.setAttribute('aria-label','Dismiss announcement');
        close.addEventListener('click',()=>ctx.dismiss());
        return {el,dismiss:close};
      }
      const named = D.obstruction;
      const texts = {
        cookie: ['Cookies', 'We use cookies to improve your experience, personalize content, and analyze traffic.', 'Dismiss'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
      },
    } },
  });
})();
