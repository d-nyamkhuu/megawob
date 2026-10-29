// Design on templates/site/base.js: an e-ink contacts app (top nav bar, record band, form, lower inspector).
(function () {
  'use strict';
  const NAV = [['Home', 'M3 11 12 3l9 8v10h-6v-6H9v6H3z'], ['Contacts', 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 19c0-3 3-5 6-5s6 2 6 5zm12 0c0-1.500-.6-2.800-1.600-3.700C13 15.100 14.500 15 16 15c3 0 6 1.500 6 4z'],
    ['Organizations', 'M5 3h14v18H5zM8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2'], ['Events', 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5']];
  const ico = (parent, d, cls, stroke) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', cls || 'ep-ico');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', stroke ? 'none' : 'currentColor');
    if (stroke !== false) { p.setAttribute('stroke', 'currentColor'); p.setAttribute('stroke-width', stroke ? '1.8' : '1.6'); }
    if (stroke === undefined && d.length > 0 && NAV[1][1] === d) { p.setAttribute('stroke', 'none'); p.setAttribute('fill', 'currentColor'); }
    s.appendChild(p);
    parent.appendChild(s);
    return s;
  };

  function frame(ctx) {
    const { util } = ctx;
    const el = util.el;
    const W = window.innerWidth;
    const H = window.innerHeight;
    let display = ctx.display || 'header';
    if (display === 'panel' && W < 1260) display = 'header';
    if (display === 'toast' && H < 700) display = 'header';
    document.body.classList.toggle('ref-has-note', display === 'toast');

    const er = ctx.rng.fork('chrome/end');
    const content = ctx.content;
    let placement = ctx.finish ? null : er.pick(['top', 'top', 'footer', 'link', 'icon']);
    const label = ctx.finish ? '' : (er.bool(0.5) ? 'Apply' : content.endLabel(er));
    const cr = ctx.rng.fork('chrome/collide');
    let collide = null;
    if (!ctx.finish && cr.bool(0.3)) collide = { text: content.collideLabel(cr, label), where: cr.pick(['top', 'top', 'footer']) };
    const decoys = ctx.finish ? [] : content.decoyLabels(cr, cr.int(0, 2));
    const tall = H >= 700;
    if (!tall && (placement === 'footer' || placement === 'link')) placement = 'top';
    const footer = placement === 'footer' || placement === 'link';

    let submit = null;
    const xtra = (parent, text, collides) => {
      const b = el('button', 'ref-xtra', parent, text);
      b.type = 'button';
      b.dataset.role = 'xtra';
      b.addEventListener('click', () => env.log('decoy', collides ? { label: text, collide: true } : { label: text }));
      return b;
    };
    const endBtn = (parent, cls, text) => {
      const b = el(cls === 'ep-endlink' ? 'a' : 'button', cls, parent, text);
      if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
      b.dataset.role = 'submit';
      b.setAttribute('aria-label', label);
      b.title = label;
      b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
      return b;
    };

    const win = el('div', 'ep-win', document.body);
    // title bar
    const title = el('div', 'ep-title', win);
    ico(title, 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 19c0-3 3-5 6-5s6 2 6 5zm12 0c0-3 1-4 2-4 3 0 6 1.500 6 4z', 'ep-ico ep-appico', false);
    el('span', 'ep-apptitle', title, 'Peregrine Contacts');
    const wc = el('div', 'ep-wc', title);
    ico(wc, 'M5 12h14', 'ep-wci', true);
    ico(wc, 'M6 6h12v12H6z', 'ep-wci', true);
    ico(wc, 'M6 6l12 12M18 6 6 18', 'ep-wci', true);
    // nav bar
    const nav = el('nav', 'ep-nav', win);
    NAV.forEach(([name, d], i) => {
      const a = el('a', 'ep-navlink' + (i === 1 ? ' on' : ''), nav);
      a.dataset.role = 'nav';
      ico(a, d, 'ep-ico', i === 1 ? undefined : true);
      el('span', '', a, name);
      a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: name }); });
    });
    const more = el('a', 'ep-navlink ep-more', nav);
    el('span', 'ep-dots', more, '•••');
    el('span', '', more, 'More ⌄');
    el('span', 'ep-grow', nav);
    const tools = el('div', 'ep-tools', nav);
    for (const d of decoys.slice(0, footer ? 0 : 2)) xtra(tools, d);
    if (collide && (collide.where === 'top' || !footer)) xtra(tools, collide.text, true);
    if (placement === 'top') submit = endBtn(tools, 'ep-btn', label);
    if (placement === 'icon') submit = endBtn(tools, 'ep-btn ep-iconbtn', '✓');
    const search = el('div', 'ep-search', tools);
    ico(search, 'M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 15l5 5', 'ep-ico', true);
    el('span', '', search, 'Search contacts');
    ico(tools, 'M12 3a5 5 0 0 0-5 5v4l-2 4h14l-2-4V8a5 5 0 0 0-5-5zM10 19a2 2 0 0 0 4 0', 'ep-ico ep-big', true);
    ico(tools, 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM10.300 3h3.400l.5 2.400 1.700.9 2.300-.9 1.700 2.900-1.800 1.600v2l1.800 1.600-1.700 2.900-2.300-.9-1.700.9-.5 2.400h-3.400l-.5-2.400-1.700-.9-2.300.9-1.700-2.900 1.800-1.600v-2L3.800 7.300l1.700-2.900 2.300.9 1.700-.9z', 'ep-ico ep-big', true);

    const main = el('div', 'ep-main', win);
    const left = el('section', 'ep-left', main);
    const band = el('div', 'ep-band', left);
    el('div', 'ep-avatar', band, 'JS');
    const who = el('div', 'ep-who', band);
    el('h1', 'ep-name', who, 'Jordan Smith');
    el('div', 'ep-line', who, 'jordan.smith@example.com  •  (555) 742-0196');
    el('div', 'ep-line', who, 'Portland, OR');
    const tg = el('div', 'ep-tags', who);
    el('span', 'ep-tag', tg, 'Individual');
    el('span', 'ep-tag', tg, 'Customer');
    if (display === 'header') {
      const note = el('div', 'ep-note-head', band);
      el('div', 'ep-note-kick', note, 'Task');
      el('div', 'ep-note-body', note, ctx.instruction);
    }
    const tabs = el('div', 'ep-tabs', left);
    ['Details', 'Activity', 'Notes', 'Related'].forEach((t, i) => el('span', 'ep-tab' + (i === 0 ? ' on' : ''), tabs, t));
    const form = el('div', 'ep-form', left);
    [['First name', 'Jordan'], ['Last name', 'Smith'], ['Email', 'jordan.smith@example.com'], ['Phone', '(555) 742-0196'], ['Location', 'Portland, OR']].forEach(([l, v], i) => {
      const r = el('div', 'ep-row ep-r' + i, form);
      el('label', 'ep-lab', r, l);
      const f = el('div', 'ep-field', r, v);
      if (i === 4) el('span', 'ep-chev', f, '⌄');
    });
    const stage = el('main', 'ep-stage', left);
    const nl = el('div', 'ep-row ep-nl', left);
    el('label', 'ep-lab', nl, 'Newsletter');
    const cb = el('div', 'ep-cb', nl);
    el('span', 'ep-box', cb);
    el('span', '', cb, 'Subscribe to our newsletter');
    const insp = el('aside', 'ep-insp', main);
    if (footer) {
      const foot = el('footer', 'ep-foot', insp);
      if (decoys.length) xtra(foot, decoys[decoys.length - 1]);
      if (collide && collide.where === 'footer') xtra(foot, collide.text, true);
      if (placement === 'footer') submit = endBtn(foot, 'ep-btn', label);
      if (placement === 'link') submit = endBtn(foot, 'ep-endlink', `${label} ›`);
    }

    if (display === 'panel') {
      const card = el('div', 'ep-card', insp);
      el('h2', '', card, 'Your task');
      el('div', 'ep-card-text', card, ctx.instruction);
    }
    el('h2', '', insp, 'Contact Details');
    const kv = el('div', 'ep-kv', insp);
    [['Contact type', 'Individual'], ['Customer since', 'Mar 14, 2020'], ['Last activity', 'Apr 2, 2024'], ['Owner', 'Taylor Kim'], ['Source', 'Website']]
      .forEach(([k, v]) => { el('span', '', kv, k); el('span', '', kv, v); });
    el('hr', '', insp);
    el('h2', 'ep-s2', insp, 'Address');
    el('div', 'ep-addr', insp, '741 Maple Ave\nPortland, OR 97204\nUnited States');
    el('hr', 'ep-s2', insp);
    el('h2', 'ep-s2', insp, 'Groups');
    const gp = el('div', 'ep-tags ep-s2', insp);
    ['Customers', 'West Region', 'Event Attendees'].forEach((g) => el('span', 'ep-tag', gp, g));
    el('hr', 'ep-s3', insp);
    el('h2', 'ep-s3', insp, 'Recent Activity');
    const act = el('div', 'ep-act ep-s3', insp);
    [['Opened newsletter', 'Apr 2, 2024', 'M3 5h18v14H3zM3 6l9 7 9-7'], ['Registered for event', 'Mar 18, 2024', 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5'],
      ['Asked a question', 'Feb 27, 2024', 'M5 3h14v18l-7-4-7 4z'], ['Downloaded guide', 'Jan 12, 2024', 'M6 3h9l4 4v14H6zM9 13h7M9 17h7']].forEach(([a, d, p]) => {
      const r = el('div', 'ep-actrow', act);
      ico(r, p, 'ep-ico', true);
      el('span', 'ep-actt', r, a);
      el('span', 'ep-actd', r, d);
    });

    if (display === 'toast') {
      const note = el('div', 'ref-note', document.body);
      el('div', 'ref-note-text', note, ctx.instruction);
      const x = el('button', 'ref-note-x', note, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
    }
    return { stage, submit };
  }

  function overlay(ctx) {
    const { rng, util, kind } = ctx;
    const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
    const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
    el.dataset.role = 'overlay';
    const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
    util.el('div', 'ref-ov-text', box, text);
    const row = util.el('div', 'ref-ov-row', box);
    const btn = (label, how, primary) => {
      const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
      b.type = 'button';
      b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
      return b;
    };
    let dismiss;
    if (kind === 'cookie') {
      btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
      dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
    } else if (kind === 'promo') {
      dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
      btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
    } else if (kind === 'banner') {
      dismiss = btn('Dismiss', 'close', false);
    } else {
      dismiss = btn('×', 'close', false);
      dismiss.setAttribute('aria-label', 'Close');
    }
    return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
  }

  env.site({
    name: 'design-choose-option-chips-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: { parts: { frame: () => frame, overlay: () => overlay } },
  });
})();
