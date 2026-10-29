(function () {
  'use strict';
  const ICON = {
    tree: '<svg viewBox="0 0 40 56"><rect x="17" y="44" width="6" height="11" fill="#6b4a26"/><path d="M20 2 8 20h6L4 34h9L2 47h36L27 34h9L26 20h6Z" fill="#2f6a35" stroke="#1d4422" stroke-width="1.5"/></svg>',
    house:
      '<svg viewBox="0 0 40 40"><path d="M3 20 20 4l17 16Z" fill="#a8452a" stroke="#4a1d10" stroke-width="2"/><rect x="8" y="20" width="24" height="17" fill="#e5b84a" stroke="#4a1d10" stroke-width="2"/><rect x="17" y="26" width="7" height="11" fill="#4a1d10"/></svg>',
    people:
      '<svg viewBox="0 0 44 36"><g stroke="#222" stroke-width="1.5"><circle cx="9" cy="9" r="5" fill="#e8b98a"/><rect x="3" y="15" width="12" height="18" fill="#3a5aa8"/><circle cx="22" cy="7" r="5" fill="#e8b98a"/><rect x="16" y="13" width="12" height="20" fill="#7a3a8a"/><circle cx="35" cy="9" r="5" fill="#e8b98a"/><rect x="29" y="15" width="12" height="18" fill="#2f7a5a"/></g></svg>',
    news: '<svg viewBox="0 0 44 40"><rect x="2" y="3" width="40" height="34" fill="#f2efe6" stroke="#222" stroke-width="2.5"/><rect x="7" y="8" width="12" height="10" fill="#4a6aa8"/><path d="M23 9h15M23 14h15M7 23h31M7 29h31" stroke="#333" stroke-width="2"/></svg>',
    mail: '<svg viewBox="0 0 46 34"><rect x="2" y="3" width="42" height="28" fill="#f4f1ea" stroke="#222" stroke-width="2.5"/><path d="m3 5 20 16L43 5M3 30l14-14M43 30 29 16" fill="none" stroke="#3a4a8a" stroke-width="2"/></svg>',
    pin: '<svg viewBox="0 0 40 40"><path d="M24 4l12 12-5 3-6 7-3-3-12 12-2-2 12-12-3-3 7-6Z" fill="#c83a2a" stroke="#4a1010" stroke-width="2"/></svg>',
    flower:
      '<svg viewBox="0 0 80 90"><path d="M40 85V45M25 85V55M55 85V50" stroke="#2f7a35" stroke-width="3"/><circle cx="40" cy="30" r="14" fill="#d9559a" stroke="#6a1e4a" stroke-width="2"/><circle cx="40" cy="30" r="5" fill="#f4d34a"/><circle cx="20" cy="48" r="8" fill="#5a7ad8" stroke="#223a7a" stroke-width="2"/><circle cx="58" cy="44" r="8" fill="#e8883a" stroke="#7a3a10" stroke-width="2"/></svg>',
    cat: '<svg viewBox="0 0 120 60"><path d="M8 52c-4-14 8-28 28-28l8-14 8 12h20c24 0 40 12 40 30z" fill="#9a968e" stroke="#3a3832" stroke-width="2.5"/><path d="M40 26h48M46 36h50" stroke="#5a564e" stroke-width="3"/><rect x="2" y="50" width="116" height="6" fill="#7a5a3a"/></svg>',
    bulb: '<svg viewBox="0 0 40 44"><path d="M20 3a13 13 0 0 0-7 24v6h14v-6A13 13 0 0 0 20 3Z" fill="#f4d84a" stroke="#6a5a10" stroke-width="2"/><path d="M14 36h12M16 41h8" stroke="#555" stroke-width="3"/><circle cx="16" cy="16" r="1.8" fill="#222"/><circle cx="24" cy="16" r="1.8" fill="#222"/><path d="M15 21q5 5 10 0" stroke="#222" fill="none" stroke-width="1.6"/></svg>',
  };
  Object.keys(ICON).forEach((key) => {
    ICON[key] = '<img src="sites/design-click-control-collapsible-11/assets/' + key + '.webp" alt="" draggable="false">';
  });
  env.site({
    name: 'design-click-control-collapsible-11',
    styles: ['site.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref sunny';
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('span', 'tree l', head).innerHTML = ICON.tree;
      const mast = u.el('div', 'mast', head);
      u.el('div', 'title', mast, 'Sunnybrook Online');
      u.el('div', 'tag', mast, 'A Small Town. A Friendly Place.');
      u.el('div', 'rule', mast).innerHTML = '<i></i><b>✾</b><i></i>';
      u.el('span', 'tree r', head).innerHTML = ICON.tree;
      u.el('div', 'date', head, 'Tuesday, April 23, 1996');
      const work = u.el('div', 'work', shell);
      const note = u.el('div', 'instruction', work);
      u.el('span', 'pin', note).innerHTML = ICON.pin;
      u.el('div', 'note-text', note, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const center = u.el('section', 'center', work);
      const bar = u.el('div', 'cbar', center);
      u.el('span', 'ct', bar, 'Community Resources');
      const cl = u.el('span', 'cl', bar);
      cl.innerHTML =
        '<span class="mh">' + ICON.house + '</span>Neighbors <b>•</b> Information <b>•</b> A Brighter Tomorrow';
      const stage = u.el('div', 'stage', center);
      const nav = u.el('nav', 'snav', work);
      [
        ['house', 'Home'],
        ['people', 'Our Town'],
        ['news', 'Local News'],
        ['tree', 'Guestbook'],
        ['mail', 'Contact Us'],
      ].forEach((p) => {
        const r = u.el('div', 'ni', nav);
        u.el('span', 'ic', r).innerHTML = ICON[p[0]];
        u.el('a', '', r, p[1]);
      });
      const l = u.el('div', 'deco dl', work);
      u.el('span', '', l).innerHTML = ICON.flower;
      u.el('p', '', l, 'Good Neighbors Stronger Together');
      const r = u.el('div', 'deco dr', work);
      u.el('span', '', r).innerHTML = ICON.cat;
      u.el('p', '', r, 'Kind People Make a Brighter Tomorrow');
      const foot = u.el('footer', 'footer', shell);
      let submit = null;
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const keep = er.bool(0.5);
        const label = keep ? 'Submit' : labelOf(er.pick(ctx.content.END_LABELS));
        const place = keep ? 'footer' : er.pick(['toolbar', 'link']);
        if (place === 'footer') {
          submit = u.el('button', 'submit', foot, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else if (place === 'toolbar') {
          bar.classList.add('has-end');
          submit = u.el('button', 'submit submit-toolbar', bar, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else {
          submit = u.el('a', 'submit-link', nav, label + ' ›');
          submit.href = '#';
          submit.title = label;
          submit.setAttribute('aria-label', label);
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = ctx.content.END_LABELS.map(labelOf).filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (pool.length) collide = { text: cr.pick(pool), where: cr.pick(['toolbar', 'footer']) };
        }
      }
      if (collide) {
        const parent = collide.where === 'toolbar' ? bar : foot;
        const decoy = u.el('button', 'submit-xtra', parent, collide.text);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        if (parent === bar) {
          decoy.classList.add('submit-xtra-toolbar');
          bar.classList.add('has-xtra');
        }
        decoy.addEventListener('click', () => env.log('decoy', { label: collide.text, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb tip ' + ctx.kind, document.body);
      const t = ctx.util.el('div', 'tip-t', el);
      ctx.util.el('span', 'tb', t).innerHTML = ICON.bulb;
      ctx.util.el('span', 'tt', t, 'Tip of the Day');
      const x = ctx.util.el('button', 'tip-x', t, '×');
      x.type = 'button';
      x.title = 'Close tip';
      x.setAttribute('aria-label', 'Close tip');
      x.addEventListener('click', ctx.dismiss);
      const b = ctx.util.el('div', 'tip-b', el);
      ctx.util.el('h3', '', b, 'Discover More!');
      ctx.util.el('p', '', b).innerHTML =
        'You can explore our <b>Resources</b> section for links to local information, helpful tools, and fun places on the web.';
      const lab = ctx.util.el('label', 'tip-c', b);
      const cb = ctx.util.el('input', '', lab);
      cb.type = 'checkbox';
      ctx.util.el('span', '', lab, 'Do not show again');
      const dismiss = ctx.util.el('button', 'dismiss', b, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
