(function () {
  'use strict';
  const C = {
    name: 'Alex’s Homepage',
    tagline: ['Small Town', 'Good Friends', 'A Brighter Tomorrow'],
    nav: ['Home', 'About Me', 'My Hobbies', 'Photo Album', 'Links'],
    badge: 'Good People Make a Brighter Internet',
    banner: 'Welcome to My Corner of the Web',
    caption: 'A peaceful day by the canal',
    interestsTitle: 'Some of My Interests',
    interests: ['Photography', 'Reading', 'Maps', 'Nature Walks', 'Biking', 'Exploring New Places'],
    tips: [
      'Click and hold the mouse button.',
      'Drag across the text to select it.',
      'Release the mouse button when you’re done.',
    ],
  };
  const ICON = {
    house:
      '<path d="M3 15L16 4l13 11h-4v13H7V15z" fill="#e8b030" stroke="#222" stroke-width="2"/><path d="M13 28v-9h6v9z" fill="#7a3b10"/><path d="M3 15L16 4l13 11" fill="none" stroke="#a02020" stroke-width="3"/>',
    boat: '<path d="M16 3v20L5 21z" fill="#f0b0b8" stroke="#222" stroke-width="1.5"/><path d="M18 8l9 13h-9z" fill="#fff" stroke="#222" stroke-width="1.5"/><path d="M3 23h26l-4 6H7z" fill="#2a58b0" stroke="#222" stroke-width="1.5"/><path d="M6 25h20" stroke="#e03030" stroke-width="2"/>',
    globe:
      '<circle cx="16" cy="14" r="12" fill="#3a8fd0" stroke="#222" stroke-width="2"/><path d="M7 8q5-3 8 2t-4 7-4-3zM18 16q5-2 7 3t-5 5z" fill="#3aa040"/><path d="M12 26h8l2 4H10z" fill="#555"/>',
    flower:
      '<path d="M16 17v12M16 24q-6-1-7-6M16 24q6-1 7-6" stroke="#2a8a2a" stroke-width="3" fill="none"/><g fill="#8a40c8" stroke="#40206a"><circle cx="16" cy="6" r="5"/><circle cx="9" cy="12" r="5"/><circle cx="23" cy="12" r="5"/><circle cx="12" cy="18" r="4"/><circle cx="20" cy="18" r="4"/></g><circle cx="16" cy="12" r="3.5" fill="#f0c020"/>',
    camera:
      '<path d="M3 9h7l2-4h8l2 4h7v18H3z" fill="#555" stroke="#111" stroke-width="2"/><circle cx="16" cy="18" r="6.5" fill="#bbb" stroke="#111" stroke-width="2"/><circle cx="16" cy="18" r="3" fill="#345"/>',
    books:
      '<rect x="3" y="4" width="26" height="7" fill="#c03030" stroke="#222" stroke-width="1.5"/><rect x="3" y="12" width="26" height="7" fill="#3050b0" stroke="#222" stroke-width="1.5"/><rect x="3" y="20" width="26" height="7" fill="#e8d8a0" stroke="#222" stroke-width="1.5"/><path d="M8 6h12M8 14h12" stroke="#fff"/>',
    map: '<path d="M3 7l9-3 8 3 9-3v21l-9 3-8-3-9 3z" fill="#9ccf80" stroke="#222" stroke-width="2"/><path d="M12 4v21M20 7v21" stroke="#222" stroke-width="1.5"/><path d="M6 12q3 3 4 8M23 10q3 4 3 9" stroke="#e0a030" stroke-width="2" fill="none"/>',
    tree: '<path d="M16 2L6 14h5L4 24h24l-7-10h5z" fill="#2f9a3a" stroke="#14501c" stroke-width="2"/><rect x="14" y="24" width="4" height="6" fill="#7a4a1a"/>',
    bike: '<circle cx="8" cy="21" r="6" fill="none" stroke="#111" stroke-width="2.5"/><circle cx="25" cy="21" r="6" fill="none" stroke="#111" stroke-width="2.5"/><path d="M8 21l6-10h8l3 10M14 11l5 10H8M12 8h5" stroke="#111" stroke-width="2.5" fill="none"/>',
    pad: '<rect x="5" y="5" width="22" height="26" fill="#fff" stroke="#111" stroke-width="2"/><path d="M9 12h14M9 16h14M9 20h14M9 24h9" stroke="#444" stroke-width="1.5"/><path d="M5 5h22v4H5z" fill="#333"/><path d="M20 28l2 2 10-17-3-2z" fill="#e8a020" stroke="#222"/><path d="M29 11l3 2" stroke="#d04040" stroke-width="3"/>',
  };
  env.site({
    name: 'design-select-text-paragraph-02',
    styles: ['site.css', 'home.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design homepage';
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const endBank = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const endLabel = endR.bool(0.5)
        ? 'Submit'
        : endR.pick(
            endBank.filter((x) => x.toLowerCase() !== 'submit').length
              ? endBank.filter((x) => x.toLowerCase() !== 'submit')
              : endBank,
          );
      const placement = ctx.finish ? null : endR.pick(['dock', 'dock', 'photo-link', 'tips-link']);
      const collide = collideR.bool(0.3)
        ? collideR.pick(endBank.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const collideWhere = collide ? collideR.pick(['photo', 'tips', 'dock']) : null;
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#e9dcc5',
        panel: 'transparent',
        fg: '#141414',
        muted: '#444',
        line: '#222',
        accent: '#000080',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', '"Times New Roman",Times,Georgia,serif');
      const ic = (parent, name, cls) => {
        const s = u.el('img', cls || 'ico', parent);
        s.src = 'sites/design-select-text-paragraph-02/assets/' + name + '.webp';
        s.alt = '';
        s.draggable = false;
        return s;
      };
      const shell = u.el('div', 'shell', body);
      const head = u.el('header', 'head', shell);
      const nav = u.el('nav', 'hp-nav', head);
      ic(nav, 'house', 'ico nav-ico');
      const links = u.el('div', 'hp-links', nav);
      for (const t of C.nav) {
        const a = u.el('a', '', links, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      }
      let submit = null;
      const endControl = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'hp-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: text, collide: true });
      };
      const mast = u.el('div', 'hp-mast', head);
      ic(mast, 'boat', 'ico mast-l');
      const mt = u.el('div', 'hp-mast-text', mast);
      ic(mast, 'boat', 'ico mast-r');
      u.el('div', 'hp-title', mt, C.name);
      const tg = u.el('div', 'hp-tag', mt);
      C.tagline.forEach((t, i) => {
        if (i) u.el('span', 'dot', tg, '·');
        u.el('span', '', tg, t);
      });
      const bd = u.el('div', 'hp-badge', head);
      ic(bd, 'globe', 'ico badge-ico');
      u.el('div', '', bd, C.badge);
      const content = u.el('div', 'content', shell);
      const ban = u.el('div', 'hp-banner', content);
      ic(ban, 'flower');
      u.el('h1', '', ban, C.banner);
      ic(ban, 'flower');
      const left = u.el('div', 'hp-photo', content);
      const ph = u.el('img', 'photo', left);
      ph.src = 'sites/design-select-text-paragraph-02/assets/canal.webp';
      ph.alt = 'A stone bridge over a quiet canal';
      ph.draggable = false;
      ph.innerHTML =
        '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a78d0"/><stop offset="1" stop-color="#bcd8f4"/></linearGradient><linearGradient id="wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7aa6d0"/><stop offset="1" stop-color="#2a5a98"/></linearGradient></defs><rect width="100" height="100" fill="url(#sky)"/><ellipse cx="30" cy="22" rx="12" ry="3" fill="#fff"/><ellipse cx="72" cy="28" rx="10" ry="3" fill="#fff"/><rect y="52" width="100" height="10" fill="#6a9a50"/><path d="M30 56h50v8H30z" fill="#a89a88"/><path d="M30 56h50" stroke="#6a5a48" stroke-width="2"/><path d="M36 64q4-8 10 0M50 64q5-9 11 0M65 64q4-8 10 0" fill="#44382c"/><rect y="62" width="100" height="38" fill="url(#wat)"/><path d="M0 70q20-4 40 0M10 80q25-3 45 0M5 90q30-3 50 0" stroke="#e8f0ff" stroke-width="1" fill="none"/><path d="M62 100L70 62h30v38z" fill="#b8a888"/><path d="M68 80h30M64 92h36" stroke="#8a7a5a" stroke-width="1"/><path d="M60 62h40v4H60z" fill="#7a9a50"/><g fill="#2a6a28"><circle cx="10" cy="40" r="14"/><circle cx="22" cy="46" r="11"/><circle cx="6" cy="58" r="12"/><circle cx="94" cy="50" r="10"/><circle cx="84" cy="56" r="8"/></g>';
      u.el('div', 'hp-cap', left, C.caption);
      if (placement === 'photo-link') submit = endControl(left, 'hp-end-link hp-photo-end', endLabel + ' ›', 'a');
      if (collide && collideWhere === 'photo') decoy(left, collide);
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'hp-int', content);
      u.el('h3', '', aside, C.interestsTitle);
      const icons = ['camera', 'books', 'map', 'tree', 'bike', 'boat'];
      C.interests.forEach((t, i) => {
        const r = u.el('div', 'hp-row', aside);
        ic(r, icons[i]);
        u.el('span', '', r, t);
      });
      const dock = u.el('footer', 'footer', shell);
      const note = u.el('section', 'task-note', dock);
      ic(note, 'pad', 'ico note-ico');
      const small = window.innerWidth < 1260 || window.innerHeight < 700;
      const display =
        small && (ctx.display === 'panel' || ctx.display === 'toast') ? 'header' : ctx.display || 'header';
      if (display === 'panel') note.classList.add('is-panel');
      if (display === 'toast') note.classList.add('is-toast');
      if (display === 'panel') u.el('div', 'note-heading', note, 'Your task');
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      }
      const tips = u.el('div', 'hp-tips', dock);
      u.el('div', 'tips-h', tips, 'Tips:');
      const ul = u.el('ul', '', tips);
      for (const t of C.tips) u.el('li', '', ul, t);
      if (placement === 'tips-link') submit = endControl(tips, 'hp-end-link hp-tips-end', endLabel + ' ›', 'a');
      if (collide && collideWhere === 'tips') decoy(tips, collide);
      if (!ctx.finish && placement === 'dock') {
        const sw = u.el('div', 'hp-sub', dock);
        submit = endControl(sw, 'submit', endLabel);
      }
      if (collide && collideWhere === 'dock') decoy(dock, collide);
      if (ctx.finish) dock.classList.add('finish-mode');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand?',
        promo: 'Explore the latest features.',
        banner: 'You are viewing a shared page.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
