// Willow Creek's frame artwork on the shared site/base behavior.
(function () {
  'use strict';
  const C = { site: 'design-type-text-transform-11', title: 'Willow Creek Home Page' };
  const TREE =
    '<svg viewBox="0 0 32 44" width="100%" height="100%" shape-rendering="crispEdges"><path d="M13 0h7v3h3v4h3v5h-2v3h4v6h-2v3h4v6h-3v3h-8v9h10v2H3v-2h9v-9H5v-3H1v-6h3v-3H2v-6h5v-3H5V8h4V4h4z" fill="#102b21"/><path d="M14 1h5v4h4v4h-3v3h5v4h-5v3h7v5h-5v3h6v4H5v-4H3v-3h5v-4H4v-4h7v-4H7V9h5V5h2z" fill="#187541"/><path d="M14 2h4v3h-4zM10 7h6v3h-6zM8 13h7v3H8zM6 21h7v3H6zM5 27h8v3H5zM16 17h5v3h-5zM18 25h4v3h-4z" fill="#3aab63"/><path d="M18 5h4v3h-4zM14 11h5v3h-5zM11 18h5v3h-5zM12 25h5v3h-5zM21 29h5v3h-5z" fill="#0e5433"/><path d="M13 32h3v10h-3z" fill="#63432a"/><path d="M17 33h2v7h-2z" fill="#9c7751"/></svg>';
  const GLOBE =
    '<svg viewBox="0 0 32 32" width="100%" height="100%" shape-rendering="crispEdges"><path d="M11 0h10v1h4v2h3v3h2v5h2v10h-2v5h-3v3h-5v2H11v-1H6v-3H3v-4H1v-5H0v-7h2V7h3V4h3V2h3z" fill="#050b13"/><path d="M11 2h10v2h5v3h3v6h1v8h-3v5h-5v3H11v-2H7v-3H4v-4H2v-8h2V8h3V5h4z" fill="#154aaf"/><path d="M10 4h11v3h4v5h-3v7h-4v4h-5v-3H8v-6H5v-4h3V7h2z" fill="#168bd6"/><path d="M8 6h4V4h6v2h-2v3h3v3h-3v3h-5v3H7v-4H5v-3h3zM15 18h4v2h4v3h-2v5h-5v-3h-3v-4h2zM22 4h3v4h-3z" fill="#73b835"/><path d="M10 6h4v3h-4zM6 11h4v3H6zM15 20h4v3h-4z" fill="#a5d94d"/><path d="M3 12h2v8H3zM8 23h4v3H8zM24 10h3v7h-3z" fill="#0b2c79"/><path d="M12 2h5v2h-5zM5 7h3v3H5z" fill="#75d8ee"/></svg>';
  const BOOK =
    '<svg viewBox="0 0 40 28" width="100%" height="100%" shape-rendering="crispEdges"><path d="M2 5h5V2h10l3 2 3-2h10v3h5v22H2z" fill="#201b15"/><path d="M3 7h34v18H3z" fill="#a45f21"/><path d="M6 4h11l3 2 3-2h11v19H23l-3 2-3-2H6z" fill="#fffdf1" stroke="#292929"/><path d="M20 6v18M8 7h3m2 0h4M8 10h7M8 13h3m2 0h4M8 16h7M8 19h3m2 0h4M23 7h4m2 0h3M23 10h8M23 13h3m2 0h4M23 16h7M23 19h3m2 0h4" stroke="#303030" stroke-width="1"/></svg>';
  const SUN =
    '<svg viewBox="0 0 40 40" width="100%" height="100%" shape-rendering="crispEdges"><path d="M19 0h2v7h-2zM19 33h2v7h-2zM0 19h7v2H0zM33 19h7v2h-7zM5 5h3v3h3v3H8V8H5zM29 29h3v3h3v3h-3v-3h-3zM32 5h3v3h-3v3h-3V8h3zM8 29h3v3H8v3H5v-3h3z" fill="#e5ac13"/><path d="M15 10h10v2h3v3h2v10h-2v3h-3v2H15v-2h-3v-3h-2V15h2v-3h3z" fill="#edb613"/><path d="M16 11h8v2h3v3h2v8h-2v3h-3v2h-8v-2h-3v-3h-2v-8h2v-3h3z" fill="#ffd11b"/><path d="M16 13h8v2h-8zM13 16h2v6h-2z" fill="#ffe36b"/></svg>';
  const HOUSE =
    '<svg viewBox="0 0 32 32" width="100%" height="100%" shape-rendering="crispEdges"><path d="M20 1h4v8h-4z" fill="#673521"/><path d="M14 1h5v3h4v3h3v3h3v3h3v3h-3v15H3V16H0v-3h3v-3h3V7h3V4h5z" fill="#101c20"/><path d="M14 3h4v3h4v3h3v3h3v2H4v-2h3V9h3V6h4z" fill="#0075b9"/><path d="M12 6h3v3h-3zM8 10h3v3H8z" fill="#48bce5"/><path d="M5 16h22v13H5z" fill="#eee9d6"/><path d="M8 19h5v7H8zM20 19h4v6h-4z" fill="#242523"/><path d="M9 20h2v4H9zM21 20h2v3h-2z" fill="#9fe4ff"/><path d="M15 19h4v10h-4z" fill="#805b30"/><path d="M16 21h1v5h-1zM16 12h4v4h-4z" fill="#fff8d3"/><path d="M3 29h26v2H3z" fill="#685b44"/></svg>';
  const PAD =
    '<svg viewBox="0 0 48 48" width="100%" height="100%" shape-rendering="crispEdges"><path d="M3 6h36v40H3z" fill="#151515"/><path d="M6 9h30v34H6z" fill="#fbfaf0"/><path d="M9 3h3v7H9zM18 3h3v7h-3zM27 3h3v7h-3z" fill="#111"/><path d="M10 14h20v2H10zM10 21h20v2H10zM10 28h16v2H10zM10 35h19v2H10z" fill="#555"/><path d="M39 1h5v4h3v4L24 32l-9 3 3-9z" fill="#111"/><path d="M40 2h3v4h3v2h-4l-3-3z" fill="#db3822"/><path d="M36 7h4v4h-4z" fill="#eee"/><path d="M35 10h4L23 29h-4v-4z" fill="#edb823"/><path d="M35 11h2L21 28h-2z" fill="#ffdb61"/><path d="M18 28h4v3h-6z" fill="#d5b188"/></svg>';
  const FLOW =
    '<svg viewBox="0 0 60 24" width="100%" height="100%" shape-rendering="crispEdges"><defs><g id="flower"><path d="M6 10v11H3v-3H0v-3h3v2h3v-7h2v7h3v-2h3v3h-3v3H8v2H1v-2h5z" fill="#176e39"/><path d="M4 0h6v3h3v7h-3v3H4v-3H1V3h3z" fill="#663095"/><path d="M5 1h4v3h3v5H9v3H5V9H2V4h3z" fill="#b47acb"/><path d="M5 5h4v4H5z" fill="#ffe669"/><path d="M6 6h2v2H6z" fill="#7f5320"/></g></defs><use href="#flower" x="0" y="2"/><use href="#flower" x="17" y="0"/><use href="#flower" x="28" y="2"/><use href="#flower" x="46" y="2"/></svg>';

  function homepageHeader(ctx) {
    const u = ctx.util;
    const at = (cls, html) => {
      const d = u.el('div', 'hp ' + cls, document.body);
      if (html) d.innerHTML = html;
      return d;
    };
    function box(cls, title, inner) {
      const d = at('hp-box ' + cls);
      u.el('div', 'hp-boxh', d).innerHTML = title;
      const b = u.el('div', 'hp-boxb', d);
      b.innerHTML = inner;
      return d;
    }
    // masthead
    at('hp-tree hp-tree-l', TREE);
    at('hp-tree hp-tree-r', TREE);
    const mast = at('hp-mast');
    u.el('div', 'hp-h1', mast, C.title);
    u.el('div', 'hp-tag', mast, 'Small Town  ~  Friendly People  ~  Brighter Tomorrows');
    box(
      'hp-ideas',
      'Good Ideas',
      '<div class="ic ic-book">' +
        BOOK +
        '</div><ul><li><a>My Journal</a></li><li><a>Photo Album</a></li><li><a>Local News</a></li><li><a>Favorite Links</a></li></ul>',
    );
    box(
      'hp-visit',
      'Visitors',
      '<div class="ic ic-globe">' +
        GLOBE +
        '</div><p>You are<br>visitor number:</p><div class="ctr">004271</div><p>Thanks for<br>stopping by!</p>',
    );
    const date = at('hp-date');
    u.el('div', 'hp-dateh', date, 'Tue, Apr 23, 1996');
    const db = u.el('div', 'hp-dateb', date);
    db.innerHTML =
      '<div class="ic ic-house">' +
      HOUSE +
      '</div><div><a>Home</a> &nbsp;|&nbsp; <a>Guestbook</a> &nbsp;|&nbsp; <a>Links</a></div>';
    box(
      'hp-comm',
      'A Brighter<br>Community',
      '<div class="ic ic-sun">' + SUN + '</div><p>Kind People<br>Stronger Towns</p>',
    );
    box(
      'hp-quote',
      "Today's Quote",
      '<p>“Good friends make small towns feel like home.”</p><div class="ic ic-flow">' + FLOW + '</div>',
    );
    // central panel
    const panel = at('hp-panel');
    const ph = u.el('div', 'hp-ph', panel);
    u.el('span', 'ic ic-pad', ph).innerHTML = PAD;
    u.el('span', 'hp-pt', ph, 'Text Tools');
    u.el('span', 'hp-ps', ph, 'Simple Tools for Everyday Tasks');
    const pb = u.el('div', 'hp-pb', panel);
    u.el('h2', 'hp-h2', pb, 'Text Converter');
    return { header: pb, date };
  }

  function cookieOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
    el.dataset.role = 'overlay';
    let dismiss;
    const th = u.el('div', 'co-h', el);
    u.el('span', '', th, 'We value your privacy');
    const x = u.el('button', 'co-x', th, '×');
    x.type = 'button';
    x.addEventListener('click', () => ctx.dismiss('close'));
    const body = u.el('div', 'co-b', el);
    u.el('div', 'co-globe', body).innerHTML = GLOBE;
    const tx = u.el('div', 'co-t', body);
    const p1 = u.el('p', '', tx);
    u.el('span', 'co-line', p1, 'We use optional cookies to improve your experience, show personalized content,');
    u.el('span', 'co-line', p1, 'and help us understand how people use this site.');
    const p2 = u.el('p', '', tx);
    u.el(
      'span',
      'co-line',
      p2,
      'You can accept all cookies, or reject optional cookies. Essential cookies will still be used',
    );
    u.el('span', 'co-line', p2, 'to keep the site working.');
    const bt = u.el('div', 'co-btns', el);
    dismiss = u.el('button', 'co-rej', bt, 'Reject optional');
    dismiss.type = 'button';
    dismiss.addEventListener('click', () => ctx.dismiss('close'));
    const acc = u.el('button', 'co-acc', bt, 'Accept all');
    acc.type = 'button';
    acc.addEventListener('click', () => ctx.dismiss('close'));
    return { el, dismiss };
  }

  const parts = {
    'frame.header': () => function (_c) {
      Object.assign(_c, homepageHeader(_c.ctx));
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.headerTools.classList.add('hp-subrow');
      if (_c.submit) _c.submit.classList.add('ds-submit');
    },
    'frame.body': () => function (_c) {
      // Header and panel instructions share the original central yellow note area.
      _c.body = _c.header;
    },
    'frame.stage': () => function (_c) {
      const { body, headerTools, util } = _c;
      // The decorative row does not expose task state or the requested transform.
      const row = util.el('div', 'hp-src', body);
      util.el('span', 'hp-srcl', row, 'Text entry:');
      util.el('div', 'hp-srcv', row, 'Your workspace for everyday text.');
      const stage = util.el('main', 'ds-stage', body);
      body.append(headerTools);
      Object.assign(_c, { stage });
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const { util } = _c;
      const foot = document.querySelector('.ref-foot') || util.el('footer', '', document.body);
      foot.classList.add('hp', 'hp-foot');
      const text = foot.querySelector('.ref-foot-text');
      if (text) text.remove();
      const decoration = util.el('span', 'hp-foot-art');
      decoration.innerHTML = '<span class="ft-t">' + TREE + '</span><span>' +
        C.title + ' &nbsp;•&nbsp; Est. 1996 &nbsp;•&nbsp; Neighbors Online</span>' +
        '<span class="ft-t">' + TREE + '</span>';
      foot.prepend(decoration);
      if (_c.submit && foot.contains(_c.submit)) _c.submit.classList.add('hp-end-foot');
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.date.append(dock);
        _c.submit.classList.add('hp-end-date');
      }
    },
    overlay: (base) => (ctx) => ctx.kind === 'cookie' ? cookieOverlay(ctx) : base(ctx),
  };

  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { homepage: { bg: '#ece9dc', panel: '#f5f4f0', fg: '#080b48', muted: '#345889', line: '#5a6498' } },
      LOW_THEME: { bg: '#ece9dc', panel: '#f5f4f0', fg: '#080b48', muted: '#345889', line: '#5a6498' },
      ACCENTS: ['#00408c'],
      LOW_ACCENTS: ['#00408c'],
      parts,
    },
  });
})();
