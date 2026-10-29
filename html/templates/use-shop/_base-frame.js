/* use-shop/_base-frame: reference frame units; scope reads preserve live design overrides. */
(function () {
  'use strict';
  function adLeader(scope, util, parent, salt) {
    const a = scope.MARKET_ADS[salt % scope.MARKET_ADS.length];
    const bar = util.el('div', 'mk-lead', parent);
    bar.dataset.role = 'ad';
    util.el('span', 'mk-tag', bar, 'Ad');
    util.el('span', 'mk-art', bar, a.art).style.background = a.color;
    const tx = util.el('span', 'mk-tx', bar);
    util.el('b', '', tx, a.brand);
    tx.append(' ' + a.head);
    util.el('button', 'mk-cta', bar, a.cta).style.background = a.color;
  }

  function adCard(scope, util, parent, a, cls) {
    const c = util.el('div', cls, parent);
    c.dataset.role = 'ad';
    util.el('div', 'mk-art big', c, a.art).style.background = a.color;
    util.el('span', 'mk-tag', c, 'Sponsored');
    util.el('b', 'mk-b', c, a.brand);
    util.el('div', 'mk-h', c, a.head);
    util.el('button', 'mk-cta', c, a.cta).style.background = a.color;
  }

  function ensureStyle(scope) {
    if (document.getElementById('as-style')) return;
    const s = document.createElement('style');
    s.id = 'as-style';
    s.textContent = scope.CSS + scope.POLISH_CSS;
    document.head.append(s);
  }

  function where(scope, el, what) {
    if (!el || !el.isConnected || el.closest('[hidden]')) throw new Error(`use-shop/store: ${what} is not shown`);
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) throw new Error(`use-shop/store: ${what} has no box`);
    return [r.left + r.width / 2, r.top + r.height / 2];
  }

  function productArt(scope, name, hue = 210, kind = '') {
    const ink = `hsl(${hue} 35% 43%)`, pale = `hsl(${hue} 35% 85%)`;
    return `<svg viewBox="0 0 160 120" aria-hidden="true"><ellipse cx="80" cy="108" rx="50" ry="6" fill="currentColor" opacity=".08"/>${scope.productDrawing(String(name).toLowerCase(), kind, ink, pale)}</svg>`;
  }

  function productDrawing(scope, text, kind, ink, pale) {
    if (kind === 'pack' || /pack|bag/.test(text)) return `<path d="M65 31q0-17 15-17t15 17" fill="none" stroke="${ink}" stroke-width="6"/><path d="M50 39q-15 15-12 48m72-48q15 15 12 48" fill="none" stroke="${ink}" stroke-width="7"/><rect x="48" y="28" width="64" height="75" rx="19" fill="${ink}"/><path d="M57 42h46" stroke="${pale}" stroke-width="3"/><rect x="57" y="65" width="46" height="29" rx="8" fill="${pale}"/><path d="M62 73h36" stroke="${ink}" stroke-width="2"/>`;
    if (/button-down|overshirt/.test(text)) return `<path d="m57 22-28 17 13 25 15-8-3 49h52l-3-49 15 8 13-25-28-17Z" fill="${ink}"/><path d="m66 22 14 12 14-12-5 24-9-12-9 12Z" fill="${pale}"/><path d="M80 34v66" stroke="${pale}" stroke-width="2"/><g fill="${pale}"><circle cx="83" cy="53" r="1.5"/><circle cx="83" cy="66" r="1.5"/><circle cx="83" cy="79" r="1.5"/></g>`;
    if (/goggles|glasses/.test(text)) return `<path d="M25 64q15-27 55-12 40-15 55 12" fill="none" stroke="${ink}" stroke-width="6"/><path d="M36 50h32l5 25H33Zm56 0h32l3 25H87Z" fill="${pale}" stroke="${ink}" stroke-width="5"/><path d="M72 58q8-8 16 0" fill="none" stroke="${ink}" stroke-width="4"/>`;
    if (/beanie|hat/.test(text)) return `<path d="M44 80V64a36 36 0 0 1 72 0v16" fill="${ink}"/><path d="M42 77h76v24H42Z" fill="${pale}"/><path d="M52 81v17m9-17v17m10-17v17m10-17v17m10-17v17m10-17v17m10-17v17" stroke="${ink}" stroke-width="2"/>`;
    if (/jeans|chinos|legging|trouser|shorts/.test(text)) return `<path d="M49 20h62l-4 84H86l-6-56-6 56H53Z" fill="${ink}"/><path d="M50 29h60M80 22v26M57 32l10 10m36-10L93 42" fill="none" stroke="${pale}" stroke-width="2"/>`;
    if (/shirt|hoodie|jacket|sweater|vest|top|dress|fleece/.test(text)) return `<path d="m57 22-28 17 13 25 15-8-3 49h52l-3-49 15 8 13-25-28-17-10 5H67Z" fill="${ink}" stroke="${ink}" stroke-width="2"/><path d="M67 27q13 16 26 0M60 95h40" fill="none" stroke="${pale}" stroke-width="3"/><path d="M61 48v37" stroke="${pale}" stroke-width="2" opacity=".3"/>`;
    if (/shoe|sneaker|boot/.test(text)) return `<path d="m42 46 23 7 15 20 39 9q14 4 10 16H33q-8-14 3-27Z" fill="${ink}"/><path d="M33 95h96M66 61l-9 8m17-1-9 8m18-1-9 8" stroke="${pale}" stroke-width="4"/>`;
    if (kind === 'food') return `<ellipse cx="80" cy="64" rx="51" ry="40" fill="var(--panel)" stroke="${pale}" stroke-width="6"/><ellipse cx="80" cy="64" rx="40" ry="30" fill="#e3bc7a"/><path d="M48 64q10-30 38-22L75 77Z" fill="#7b9665"/><path d="M76 45q34 2 35 29L86 86 69 66Z" fill="#bc6c45"/><path d="m55 56 42 13m-37 9 38-22" stroke="#f3dcaa" stroke-width="4" stroke-linecap="round"/>`;
    if (/headphone|headset/.test(text)) return `<path d="M44 71V53a36 36 0 0 1 72 0v18" fill="none" stroke="${ink}" stroke-width="12"/><rect x="35" y="59" width="23" height="38" rx="10" fill="${ink}"/><rect x="102" y="59" width="23" height="38" rx="10" fill="${ink}"/>`;
    if (/book|journal|notebook/.test(text)) return `<path d="M48 22h65v82H48q-9 0-9-9V31q0-9 9-9" fill="${ink}"/><path d="M51 22v82m12-56h34m-34 9h25M44 97h69" stroke="${pale}" stroke-width="3"/>`;
    if (/pot|plant|vase/.test(text)) return `<path d="M80 66V26M80 49q-30 1-29-22 26-1 29 22m0-8q29-1 27-25-25 0-27 25" fill="#6f9168" stroke="#55774e" stroke-width="2"/><path d="m53 66 9 39h36l9-39Z" fill="${ink}"/><path d="M50 65h60" stroke="${pale}" stroke-width="7"/>`;
    if (/bottle|tumbler|thermos|oil|shampoo/.test(text)) return `<rect x="65" y="14" width="30" height="14" rx="4" fill="${ink}"/><path d="M65 27h30l8 16v58q-23 9-46 0V43Z" fill="${ink}"/><path d="M63 49h34v29H63Z" fill="${pale}"/><path d="M65 85v10" stroke="${pale}" stroke-width="3"/>`;
    return `<rect x="41" y="27" width="79" height="70" rx="9" fill="${ink}"/><path d="m41 43 39 15 40-15M80 58v39M61 27l39 16" stroke="${pale}" stroke-width="3"/><rect x="91" y="73" width="18" height="12" rx="2" fill="${pale}"/>`;
  }

  function iconLabel(scope, util, parent, icon, text, cls = 'as-service') {
    const row = util.el('div', cls, parent);
    util.el('span', 'as-inline-icon', row).innerHTML = scope.ICON[icon] || scope.ICON.check;
    util.el('span', '', row, text);
    return row;
  }

  function serviceDetails(scope, util, parent, title, text) {
    const box = util.el('details', 'as-disclosure', parent);
    util.el('summary', '', box, title);
    util.el('p', '', box, text);
    return box;
  }

  function recommendations(scope, ctx, parent, heading = 'Recently viewed') {
    const box = ctx.util.el('section', 'as-recommendations', parent);
    ctx.util.el('h3', '', box, heading);
    const grid = ctx.util.el('div', 'as-rec-grid', box);
    const rng = ctx.rng.fork('polish-recommendations');
    const items = ctx.content.sample(rng, ctx.content.PRODUCTS, 3, ctx.spec.csplit);
    for (const p of items) {
      const item = ctx.util.el('div', 'as-rec-item', grid);
      ctx.util.el('div', 'as-rec-art', item).innerHTML = scope.productArt(p.name, rng.int(10, 330));
      ctx.util.el('b', '', item, p.name);
      ctx.util.el('span', '', item, 'Recently viewed · Available');
    }
    return box;
  }

  function accountChrome(scope, ctx, top) {
    const { util, spec } = ctx;
    top.classList.add('as-masthead');
    if (spec.scenario === 'checkout') return;
    const actions = util.el('div', 'as-account', top);
    const notifications = util.el('details', 'as-notifications', actions);
    const trigger = util.el('summary', '', notifications);
    trigger.setAttribute('aria-label', 'Account updates');
    trigger.innerHTML = `${scope.ICON.bell}<span class="as-dot">2</span>`;
    const pop = util.el('div', 'as-account-pop', notifications);
    util.el('b', '', pop, 'Your account updates');
    scope.iconLabel(util, pop, 'truck', 'Your recent delivery has arrived');
    scope.iconLabel(util, pop, 'tag', 'Member offers are ready to use');
    util.el('div', 'as-micro', pop, 'Notification preferences · View account');
    if (scope.SHOPPING.includes(spec.scenario)) {
      const browse = util.el('div', 'as-browse-search', top);
      browse.innerHTML = scope.ICON.search;
      util.el('span', '', browse, 'Search the store');
      top.insertBefore(browse, top.querySelector('.as-right'));
      const account = util.el('div', 'as-account-label', actions);
      util.el('span', '', account, 'Welcome back');
      util.el('b', '', account, 'Your account');
    }
  }

  function stageWidth(scope, ctx) {
    const stage = ctx.stage;
    const row = stage.parentElement;
    if (!row) return ctx.size.width;
    let w = row.getBoundingClientRect().width;
    for (const c of row.children) {
      if (c === stage) continue;
      const cs = getComputedStyle(c);
      if (cs.position === 'fixed' || cs.position === 'absolute' || cs.display === 'none') continue;
      w -= c.getBoundingClientRect().width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    }
    return Math.max(ctx.size.width, Math.floor(w));
  }

  function trackFocus(scope, ctx, input, name) {
    input.addEventListener('focus', () => { if (ctx.model.focus !== name) ctx.update({ ...ctx.model, focus: name }); });
    input.addEventListener('blur', () => { if (ctx.model.focus === name) ctx.update({ ...ctx.model, focus: null }); });
  }

  function frameCover(scope, ctx) {
    const s = ctx.stage.getBoundingClientRect();
    let cover = 0;
    // Only a toast note is a bottom cover; other display modes may draw the note fixed elsewhere (a header).
    const note = ctx.episode && ctx.episode.instr === 'toast' ? document.querySelector(scope.NOTE) : null;
    for (const el of [scope.env.submitEl, note]) {
      if (!el || getComputedStyle(el).position !== 'fixed') continue;
      const a = el.getBoundingClientRect();
      if (a.top < s.bottom && a.bottom > s.top) cover = Math.max(cover, Math.ceil(s.bottom - a.top));
    }
    return cover;
  }

  function framePlace(scope, app, { flow, width, left, padY, H, cover }) {
    const reserve = cover ? Math.max(0, cover + 6 - padY) : 0;
    if (flow) Object.assign(app.style, { width: width + 'px', marginLeft: left + 'px', marginRight: 'auto', marginTop: padY + 'px',
      marginBottom: padY + (reserve ? reserve + 40 : 0) + 'px', minHeight: H - 2 * padY + 'px' });
    else Object.assign(app.style, { left: left + 'px', width: width + 'px', top: padY + 'px', bottom: padY + reserve + 'px' });
  }

  function frame(scope, ctx, o) {
    const { util } = ctx;
    const W = o.flow ? scope.stageWidth(ctx) : ctx.size.width;
    const H = ctx.size.height;
    const r = ctx.rng.fork('frame');
    const padY = r.int(6, 14);
    const padX = r.int(8, 20);
    let width = W - 2 * padX;
    const maxW = r.pick([0, 0, 1180, 1080, 1000]);
    if (maxW && width > maxW + 40) width = maxW;
    const align = r.pick(['left', 'center', 'center', 'right']);
    const left = align === 'left' ? padX : align === 'right' ? W - padX - width : Math.round((W - width) / 2);
    const cover = scope.frameCover(ctx);
    const app = util.el('div', 'as-app' + (o.flow ? ' flow' : ''), ctx.stage);
    app.dataset.role = 'app';
    scope.framePlace(app, { flow: !!o.flow, width, left, padY, H, cover });
    const top = util.el('div', 'as-top', app);
    const brand = util.el('div', 'as-brand', top);
    if (o.word) {
      const w = util.el('span', 'as-word', brand);
      w.style.fontSize = '21px';
      [...o.brand].forEach((ch, i) => { util.el('span', '', w, ch).style.color = scope.WORD_COLORS[i % scope.WORD_COLORS.length]; });
    } else {
      const logo = util.el('span', 'as-logo', brand);
      logo.innerHTML = o.icon || '';
      util.el('span', '', brand, o.brand);
    }
    if (o.nav) {
      const nav = util.el('nav', 'as-nav', top);
      o.nav.forEach((n, i) => util.el('span', i === o.on ? 'on' : '', nav, n));
    }
    if (o.right) util.el('div', 'as-right', top).innerHTML = o.right;
    const body = util.el('div', 'as-body', app);
    return { app, top, body, brand };
  }

  function listPane(scope, ctx, pane, { keys, build, rows, pitch, gap, scroll, label }) {
    const { util } = ctx;
    pane.replaceChildren();
    const list = util.el('div', 'as-list', pane);
    list.dataset.role = 'list';
    list.style.height = rows * pitch - gap + 'px';
    const opts = keys.map((k, i) => {
      const r = build(k, i);
      r.style.height = pitch - gap + 'px';
      if (i) r.style.marginTop = gap + 'px';
      list.append(r);
      return [k, r];
    });
    const track = util.el('div', 'as-track' + (keys.length <= rows ? ' idle' : ''), pane);
    track.dataset.role = 'scrollbar';
    const thumb = util.el('div', 'as-thumb', track);
    thumb.dataset.role = 'thumb';
    const lbx = scope.env.ui.listbox(list, {
      label,
      options: opts,
      onScroll(i) {
        const s = Math.round(i * 1000) / 1000;
        if (ctx.model.scroll !== s) ctx.update({ ...ctx.model, scroll: s });
      },
      scrollbar: { track, thumb, pad: 3, minThumb: 30, onDrag: (on) => thumb.classList.toggle('drag', on) },
    });
    lbx.set({ scroll: scroll || 0 });
    lbx.list = list;
    return lbx;
  }

  function pitchFor(scope, pane, bottomEl, rows, gap, lo, hi, reserve = 0) {
    const top = pane.getBoundingClientRect().top;
    const bottom = bottomEl.getBoundingClientRect().bottom - 18 - reserve;
    return Math.max(lo, Math.min(hi, Math.floor((bottom - top - 2 + gap) / rows)));
  }

  function mirrorPitch(scope, ctx, pitch) {
    if (ctx.model.pitch !== pitch) ctx.update({ ...ctx.model, pitch });
  }

  function irreversible(scope, ctx, click) {
    if (!ctx.spec.judge || ctx.spec.judge.mode !== 'confirm' || !click) return;
    if (click.result !== undefined || click.confirm === 'ok' || click.order || click.book !== undefined || click.place) ctx.flag('irreversible');
  }
  env.template('use-shop/_base-frame', () => ({ adLeader, adCard, ensureStyle, where, productArt, productDrawing, iconLabel, serviceDetails, recommendations, accountChrome, stageWidth, trackFocus, frameCover, framePlace, frame, listPane, pitchFor, mirrorPitch, irreversible }));
})();
