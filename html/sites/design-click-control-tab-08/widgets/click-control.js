// Design of this site on the click-control/controls template (templates/click-control/controls.js): each panel is a personal home page (masthead, three columns); the links are its "Cool Sites".
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-08',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: () => () => {},
      tabPanel: () => (ctx, p, t, i, links) => {
        const { util } = ctx;
        const hp = util.el('div', 'hp', p);
        const mast = util.el('div', 'hp-mast', hp);
        const mL = util.el('div', 'hp-side', mast);
        util.el('i', 'hp-sun', mL);
        ['Good', 'People', 'Brighter', 'Days'].forEach(s => util.el('span', '', mL, s));
        const mC = util.el('div', 'hp-title', mast);
        const mT = util.el('div', 'hp-name', mC);
        util.el('i', 'hp-globe', mT);
        util.el('span', '', mT, 'Alex’s World');
        util.el('i', 'hp-globe', mT);
        util.el('div', 'hp-welcome', mC, 'Welcome to my little corner of the Internet!');
        util.el('div', 'hp-rule', mC);
        const mR = util.el('div', 'hp-side', mast);
        util.el('i', 'hp-boat', mR);
        ['Explore', 'Learn', 'Share', 'Belong'].forEach(s => util.el('span', '', mR, s));
        const cols = util.el('div', 'hp-cols', hp);
        const colA = util.el('div', 'hp-col', cols), colB = util.el('div', 'hp-col hp-wide', cols), colC = util.el('div', 'hp-col', cols);
        const box = (par, title, cls) => { const bx = util.el('section', 'hp-box ' + (cls || ''), par); util.el('h3', '', bx, title); return util.el('div', 'hp-body', bx); };
        const about = box(colA, 'About Me', 'hp-about');
        util.el('i', 'hp-home', about);
        util.el('p', '', about, 'Hi! I’m Alex. I enjoy computers, music, and exploring new places online. This is my personal homepage where I share a few of my favorite things.');
        const favs = box(colA, 'My Favorites', 'hp-favs');
        ['Music', 'Books', 'Photography', 'Animals'].forEach((s) => { const r = util.el('div', 'hp-row', favs); util.el('i', 'hp-ic', r); util.el('span', 'hp-plain hp-u', r, s); });
        const cool = box(colB, 'Cool Sites', 'hp-cool');
        t.words.forEach((word, j) => {
          const row = util.el('div', 'hp-row', cool);
          util.el('i', 'hp-ic', row);
          if (word.link) { const a = util.el('span', 'uc-link', row, word.text); a.dataset.key = i + '.' + j; a.dataset.role = 'link'; links.push(a); }
          else util.el('span', 'hp-plain', row, word.text);
        });
        const upd = box(colC, 'Latest Updates', 'hp-upd');
        [['Apr 12', 'Added new photos from my trip.'], ['Apr 05', 'Updated my favorite books list.'], ['Mar 28', 'Check out my new hobby page!'], ['Mar 14', 'Guestbook now open.'], ['Mar 01', 'Welcome to Alex’s World!']].forEach((u2) => { const r = util.el('div', 'hp-upd-row', upd); util.el('b', '', r, '●'); util.el('em', '', r, u2[0]); util.el('span', '', r, u2[1]); });
        const rings = box(colC, 'Web Rings', 'hp-rings');
        const rr = util.el('div', 'hp-ringrow', rings);
        [['Planet<br>Earth Ring', 'Join Now'], ['Happy<br>People Ring', 'Visit']].forEach((rg) => { const c = util.el('div', '', rr); const bd = util.el('div', 'hp-badge', c); util.el('i', 'hp-ic', bd); util.el('span', '', bd).innerHTML = rg[0]; util.el('span', 'hp-plain hp-u', c, rg[1]); });
        util.el('div', 'hp-motto', rings, 'A friendlier web, one page at a time.');
      },
    },
  },
});
