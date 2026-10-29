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
      frame: (base) => function(ctx) {
      const u = ctx.util;
      const root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = 'flow instruction-' + ctx.display;
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
      if (ctx.display === 'header') {
        const note = u.el('div', 'flow-header-note', header, ctx.instruction);
        note.dataset.role = 'instruction';
      }
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
      const asText = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const common = er.bool(0.5);
      const endWhere = common ? 'header' : er.pick(['header','footer','link','icon']);
      const endLabel = common ? 'Continue' : asText(er.pick(labels));
      const cr = ctx.rng.fork('chrome/collide');
      const options = [...new Set(labels.map(asText))].filter(x => x.toLowerCase() !== endLabel.toLowerCase());
      const collide = !ctx.finish && cr.bool(0.3) && options.length ? cr.pick(options) : null;
      let submit = null;
      const makeEnd = (parent, cls) => {
        const b = u.el('button', cls, parent, endWhere === 'icon' ? '✓' : endLabel);
        b.type = 'button';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', () => ctx.submit());
        submit = b;
      };
      const headerActions = u.el('div', 'flow-header-actions', header);
      if (!ctx.finish && (endWhere === 'header' || endWhere === 'icon')) makeEnd(headerActions, 'flow-end' + (endWhere === 'icon' ? ' flow-icon-end' : ''));
      if (collide) {
        const b = u.el('button', 'flow-extra', headerActions, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const profile = u.el('button', 'flow-profile', header);
      profile.type = 'button';
      profile.innerHTML = '<span class="flow-profile-photo"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
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
      const stage = u.el('main', 'stage flow-stage', body);
      const discovery = u.el('aside', 'flow-discovery', body);
      if (ctx.display === 'panel') {
        const note = u.el('section', 'flow-panel-note', discovery);
        note.dataset.role = 'instruction';
        const label = u.el('div', 'flow-panel-label', note);
        u.el('span', 'flow-panel-icon', label, '☰');
        u.el('b', '', label, 'Do this in order.');
        const steps = ctx.instruction.split(/\s+-\s+/).map(x => x.trim()).filter(Boolean);
        if (steps.length > 1 && /^do this in order[.!]?$/i.test(steps[0])) {
          const list = u.el('ul', '', note);
          for (const step of steps.slice(1)) u.el('li', '', list, step);
        } else u.el('p', '', note, ctx.instruction.replace(/^Do this in order[.!]?\s*/i, ''));
      }
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
      if (ctx.display === 'toast') {
        const note = u.el('div', 'flow-toast-note', shell, ctx.instruction);
        note.dataset.role = 'instruction';
      }
      if (!ctx.finish && (endWhere === 'footer' || endWhere === 'link')) {
        const footer = u.el('footer', 'flow-footer', shell);
        makeEnd(footer, endWhere === 'link' ? 'flow-end-link' : 'flow-end');
      }
      const headerNote = header.querySelector('.flow-header-note');
      const headerHeight = headerNote ? Math.max(62, headerNote.scrollHeight + 10) : 62;
      root.style.setProperty('--flow-header-height', headerHeight + 'px');
      return { stage, submit };
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
