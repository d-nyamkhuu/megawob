/* act-in-time/_base-lists: shared template implementation; parts remain on the calling template. */
(function () {
  'use strict';
  function buildLoading(unitScope, ctx, f) {
    const { env, ICON, stars, spinner } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
    const main = util.el('div', 'ut-main', f.body);
    const mr = main.getBoundingClientRect();
    const W = Math.min(660, Math.floor(mr.width));
    const H = Math.floor(mr.height);
    const col = util.el('div', 'ut-col', main);
    col.style.width = W + 'px';
    col.style.height = H + 'px';
    col.style.left = Math.round(rng.float(0, 1) * Math.max(0, mr.width - W)) + 'px';
    col.style.top = '0px';
    const row = util.el('div', 'ut-searchrow', col);
    const sbox = util.el('div', 'ut-sbox', row);
    sbox.innerHTML = ICON.search;
    util.el('span', '', sbox, spec.query);
    const go = util.el('button', 'ut-btn primary', row, rng.pick(['Search', 'Search', 'Find', 'Go']));
    go.type = 'button';
    go.addEventListener('click', () => ev({ search: true }));
    const res = util.el('div', 'ut-res', col);
    const head = util.el('div', 'ut-reshead', res);
    const headL = util.el('span', '', head);
    util.el('span', '', head, rng.pick(['Sort: Relevance', 'Sort: Featured', 'Best match']));
    const empty = util.el('div', 'ut-empty', res);
    const n = spec.results.length;
    const rh = Math.max(34, Math.min(56, Math.floor((H - 40 - 12 - 36) / n)));
    const list = util.el('div', '', res);
    const skel = util.el('div', '', res);
    const rows = spec.results.map((r, i) => {
      const el = util.el('div', 'ut-row2', list);
      el.style.height = rh + 'px';
      el.dataset.role = 'result';
      const th = util.el('div', 'ut-thumb', el);
      th.style.background = `linear-gradient(135deg, hsl(${(i * 67 + 20) % 360},55%,70%), hsl(${(i * 67 + 70) % 360},45%,48%))`;
      const nm = util.el('div', 'ut-rn', el);
      util.el('b', '', nm, r.name);
      util.el('small', '', nm, `${stars(r.rating)} ${r.rating.toFixed(1)} (${r.reviews.toLocaleString('en-US')})${rh >= 44 ? ' · ' + r.note : ''}`);
      util.el('div', 'ut-rp', el, fam.helpers.fmt$(r.price));
      el.addEventListener('click', () => ev({ result: i }));
      return el;
    });
    for (let i = 0; i < n; i++) {
      const el = util.el('div', 'ut-row2', skel);
      el.style.height = rh + 'px';
      el.style.cursor = 'default';
      util.el('div', 'ut-thumb ut-skel', el).style.height = '30px';
      const c = util.el('div', 'ut-rn', el);
      util.el('div', 'ut-skel', c).style.width = `${45 + ((i * 23) % 40)}%`;
      util.el('div', 'ut-skel', c).style.cssText = 'width:30%;margin-top:6px;height:9px';
    }
    const detail = util.el('div', 'ut-detail', res);
    const backB = util.el('button', 'ut-link', detail, '← Back to results');
    backB.type = 'button';
    backB.addEventListener('click', () => ev({ back: true }));
    const dT = util.el('h3', '', detail);
    const dP = util.el('div', 'ut-price', detail);
    const dR = util.el('p', '', detail);
    util.el('button', 'ut-btn', detail, 'Add to wishlist').type = 'button';
    const emptyT = util.el('span', '', empty);
    const spin = spinner(util, head);
    spin.svg.style.cssText = 'width:16px;height:16px;margin-right:auto;margin-left:8px';
    head.insertBefore(spin.svg, head.children[1]);

    function sync(m) {
      const shown = fam.helpers.resultsShown(spec, m);
      const loading = m.searched !== null && !shown;
      empty.style.display = m.searched === null ? '' : 'none';
      spin.svg.style.display = loading ? '' : 'none';
      spin.arc.setAttribute('transform', `rotate(${Math.round((m.t / spec.beat) * 135) % 360} 11 11)`);
      emptyT.textContent = `Press ${go.textContent} to see results for “${spec.query}”.`;
      skel.style.display = loading ? '' : 'none';
      list.style.display = shown ? '' : 'none';
      headL.textContent = shown ? `${n} results for “${spec.query}”` : loading ? 'Searching…' : 'Results';
      detail.hidden = m.open === null;
      detail.style.display = m.open === null ? 'none' : '';
      if (m.open !== null) {
        const r = spec.results[m.open];
        dT.textContent = r.name;
        dP.textContent = fam.helpers.fmt$(r.price);
        dR.textContent = `${stars(r.rating)} ${r.rating.toFixed(1)} · ${r.reviews.toLocaleString('en-US')} reviews · ${r.note}`;
      }
      f.setStatus(m.open !== null ? 'Product page' : shown ? `<b>${n}</b> results` : loading ? 'Searching…' : 'Ready');
    }
    return {
      sync,
      locate(tg) {
        if (tg.search) return util.center(go);
        if (tg.back) return util.center(backB);
        if (tg.result !== undefined) {
          const r = rows[tg.result].getBoundingClientRect();
          return [r.left + Math.min(220, r.width * 0.35), r.top + r.height / 2];
        }
        return null;
      },
    };
}

  function buildCarousel(unitScope, ctx, f) {
    const { env } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
    const main = util.el('div', 'ut-main', f.body);
    const mr = main.getBoundingClientRect();
    const W = Math.min(760, Math.floor(mr.width));
    const SH = Math.max(170, Math.min(280, Math.floor(mr.height - 120)));
    const car = util.el('div', 'ut-car', main);
    car.style.width = W + 'px';
    util.el('h4', '', car, spec.kind === 'news' ? rng.pick(['Top stories', 'In the news']) : rng.pick(['Featured', 'This week', 'Deals for you']));
    const stage = util.el('div', 'ut-stage2', car);
    stage.style.height = SH + 'px';
    const slides = spec.slides.map((s, i) => {
      const el = util.el('div', 'ut-slide', stage);
      el.dataset.role = 'slide';
      el.style.background = `linear-gradient(120deg, hsl(${s.hue},58%,46%), hsl(${(s.hue + 50) % 360},52%,34%))`;
      util.el('b', '', el, s.title);
      util.el('span', '', el, s.sub);
      util.el('div', 'ut-cta', el, s.cta);
      el.addEventListener('click', () => ev({ slide: true }));
      el.hidden = true;
      return el;
    });
    const prev = util.el('button', 'ut-arrow prev', stage, '‹');
    const next = util.el('button', 'ut-arrow next', stage, '›');
    prev.type = 'button';
    next.type = 'button';
    prev.setAttribute('aria-label', 'Previous slide');
    next.setAttribute('aria-label', 'Next slide');
    prev.addEventListener('click', () => ev({ arrow: 'prev' }));
    next.addEventListener('click', () => ev({ arrow: 'next' }));
    const prog = util.el('div', 'ut-prog', stage);
    const paused = util.el('div', 'ut-paused', stage, 'Paused');
    const page = util.el('div', 'ut-page', stage);
    const pT = util.el('h3', '', page);
    const pS = util.el('p', '', page);
    const backB = util.el('button', 'ut-btn', page, '← Back');
    backB.type = 'button';
    backB.style.alignSelf = 'flex-start';
    backB.addEventListener('click', () => ev({ back: true }));
    const dotsEl = util.el('div', 'ut-dots', car);
    const dots = spec.slides.map((s, i) => {
      const d = util.el('button', 'ut-dot', dotsEl);
      d.type = 'button';
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => ev({ dot: i }));
      return d;
    });
    if (mr.height - SH - 70 > 80) {
      const tiles = util.el('div', 'ut-tiles', car);
      for (const t of rng.sample(['Free returns within 30 days', 'Gift cards', 'Order tracking', 'Customer service', 'New this week', 'Weekly newsletter'], 3)) util.el('div', 'ut-tile', tiles, t);
    }
    car.style.left = Math.round(rng.float(0, 1) * Math.max(0, mr.width - W)) + 'px';
    car.style.top = Math.round(rng.float(0, 1) * Math.max(0, mr.height - car.offsetHeight)) + 'px';

    function sync(m) {
      const cur = fam.helpers.slideAt(spec, m);
      slides.forEach((el, i) => { el.hidden = i !== cur; });
      dots.forEach((d, i) => d.classList.toggle('on', i === cur));
      prog.style.width = `${Math.round(100 * fam.helpers.slideProgress(spec, m))}%`;
      paused.hidden = !m.paused;
      page.hidden = m.opened === null;
      if (m.opened !== null) {
        const s = spec.slides[m.opened];
        pT.textContent = s.title;
        pS.textContent = `${s.sub}. You opened this from the carousel.`;
      }
      f.setStatus(m.opened !== null ? 'Viewing a page' : `Slide <b>${cur + 1}</b> of ${spec.slides.length}`);
    }
    return {
      sync,
      locate(tg) {
        if (tg.slide) {
          const r = stage.getBoundingClientRect();
          return [r.left + r.width / 2, r.top + r.height * 0.45];
        }
        if (tg.dot !== undefined) return util.center(dots[tg.dot]);
        if (tg.arrow) return util.center(tg.arrow === 'next' ? next : prev);
        if (tg.back) return util.center(backB);
        return null;
      },
    };
}

  function buildRefresh(unitScope, ctx, f) {
    const { env, spinner, initials } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
    const main = util.el('div', 'ut-main', f.body);
    const mr = main.getBoundingClientRect();
    const W = Math.min(620, Math.floor(mr.width));
    const H = Math.floor(mr.height);
    const col = util.el('div', 'ut-col', main);
    col.style.width = W + 'px';
    col.style.height = H + 'px';
    col.style.left = Math.round(rng.float(0, 1) * Math.max(0, mr.width - W)) + 'px';
    col.style.top = '0px';
    const res = util.el('div', 'ut-res', col);
    const head = util.el('div', 'ut-reshead', res);
    util.el('span', '', head, spec.label);
    const busyTag = util.el('span', 'ut-busy', head);
    const spin = spinner(util, busyTag);
    const busyT = util.el('span', '', busyTag);
    const n = spec.items.length;
    const rh = Math.max(36, Math.min(58, Math.floor((H - 32 - 14) / n)));
    const list = util.el('div', 'ut-list', res);
    const skel = util.el('div', '', res);
    for (let i = 0; i < n; i++) {
      const el = util.el('div', 'ut-row2', skel);
      el.style.height = rh + 'px';
      util.el('div', 'ut-thumb ut-skel', el).style.borderRadius = '50%';
      const c = util.el('div', 'ut-rn', el);
      util.el('div', 'ut-skel', c).style.width = `${40 + ((i * 29) % 40)}%`;
      util.el('div', 'ut-skel', c).style.cssText = 'width:55%;margin-top:6px;height:9px';
      el.addEventListener('click', () => ev({ item: i }));
    }
    const detail = util.el('div', 'ut-detail', res);
    const backB = util.el('button', 'ut-link', detail, '← Back to the list');
    backB.type = 'button';
    backB.addEventListener('click', () => ev({ back: true }));
    const dT = util.el('h3', '', detail);
    const dP = util.el('p', '', detail);
    let rows = new Map();
    let built = -1;

    function rebuild(order) {
      list.replaceChildren();
      rows = new Map();
      order.forEach((i, pos) => {
        const it = spec.items[i];
        const el = util.el('div', 'ut-row2', list);
        el.style.height = rh + 'px';
        el.dataset.role = 'row';
        const av = util.el('div', 'ut-avatar', el, initials(it.name));
        av.style.background = `hsl(${(i * 53 + 17) % 360},48%,46%)`;
        const nm = util.el('div', 'ut-rn', el);
        util.el('b', '', nm, it.name);
        util.el('small', '', nm, it.note);
        util.el('div', 'ut-rt', el, `${9 + (pos % 9)}:${String((pos * 17 + 5) % 60).padStart(2, '0')}`);
        el.addEventListener('click', () => ev({ item: i }));
        rows.set(i, el);
      });
    }

    function sync(m) {
      const busy = fam.helpers.refreshBusy(spec, m.t);
      const epoch = fam.helpers.refreshEpoch(spec, m.t);
      if (epoch !== built && m.t >= spec.first - 1e-9) {
        built = epoch;
        rebuild(fam.helpers.refreshOrder(spec, m.t));
      }
      const loading = m.t < spec.first - 1e-9;
      skel.style.display = loading ? '' : 'none';
      list.style.display = loading ? 'none' : '';
      list.classList.toggle('busy', busy);
      busyTag.style.visibility = busy ? 'visible' : 'hidden';
      busyT.textContent = loading ? 'Loading…' : 'Refreshing…';
      spin.arc.setAttribute('transform', `rotate(${Math.round((m.t / spec.beat) * 135) % 360} 11 11)`);
      detail.style.display = m.open === null ? 'none' : '';
      if (m.open !== null) {
        dT.textContent = spec.items[m.open].name;
        dP.textContent = spec.items[m.open].note;
      }
      f.setStatus(m.open !== null ? 'Opened' : busy ? 'Refreshing…' : `<b>${n}</b> items`);
    }
    return {
      sync,
      locate(tg) {
        if (tg.back) return util.center(backB);
        if (tg.row !== undefined && rows.get(tg.row)) {
          const r = rows.get(tg.row).getBoundingClientRect();
          return [r.left + Math.min(200, r.width * 0.3), r.top + r.height / 2];
        }
        return null;
      },
    };
}

  function buildDeadline(unitScope, ctx, f) {
    const { env, spinner, sec1 } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
    const main = util.el('div', 'ut-main', f.body);
    const mr = main.getBoundingClientRect();
    const card = util.el('div', 'ut-dl', main);
    card.style.left = Math.round(rng.float(0.1, 0.9) * Math.max(0, mr.width - 440)) + 'px';
    card.style.top = Math.round(rng.float(0.1, 0.9) * Math.max(0, mr.height - 270)) + 'px';
    const h3 = util.el('h3', '', card);
    const p = util.el('p', '', card);
    const state = util.el('div', 'ut-dlstate', card);
    const spin = spinner(util, state);
    const stTxt = util.el('span', '', state);
    const bar = util.el('div', 'ut-dlbar', card);
    const barI = util.el('i', '', bar);
    const row = util.el('div', spec.kind === 'slot' ? 'ut-chips2' : 'ut-row', card);
    if (spec.kind !== 'slot') row.style.justifyContent = rng.pick(['flex-start', 'flex-end', 'center']);
    const els = spec.buttons.map((bt) => {
      const el = util.el('button', 'ut-btn' + (bt.key === 'go' && spec.kind === 'offer' ? ' primary' : ''), row, bt.label);
      el.type = 'button';
      el.dataset.key = bt.key;
      el.addEventListener('click', () => ev({ button: bt.key }));
      return el;
    });
    const loadingTitle = spec.kind === 'slot' ? 'Loading delivery slots…' : 'Looking for offers…';

    function sync(m) {
      const ready = fam.helpers.deadlineReady(spec, m.t);
      const over = fam.helpers.deadlineOver(spec, m.t);
      const live = ready && !over;
      h3.textContent = ready ? spec.title : loadingTitle;
      p.textContent = ready ? spec.text : 'This only takes a moment.';
      spin.svg.style.display = ready ? 'none' : '';
      spin.arc.setAttribute('transform', `rotate(${Math.round((m.t / spec.beat) * 135) % 360} 11 11)`);
      // the first claim inside the window is confirmed on the card, with the time that was left
      const claim = m.clicks.find((c) => c.key === 'go' && fam.helpers.deadlineReady(spec, c.t) && !fam.helpers.deadlineOver(spec, c.t));
      stTxt.textContent = !ready ? 'Please wait…' : claim ? `${spec.kind === 'slot' ? 'Slot booked' : 'Offer claimed'} with ${sec1(spec.ready + spec.window - claim.t)} s to spare`
        : over ? (spec.kind === 'slot' ? 'The slots were released.' : 'This offer has expired.') : `${spec.kind === 'slot' ? 'Held for' : 'Ends in'} ${sec1(fam.helpers.deadlineLeft(spec, m.t))} s`;
      bar.style.visibility = live ? 'visible' : 'hidden';
      const frac = Math.max(0, Math.min(1, fam.helpers.deadlineLeft(spec, m.t) / spec.window));
      barI.style.width = `${100 * frac}%`;
      bar.classList.toggle('low', frac < 0.34);
      for (const el of els) {
        el.classList.toggle('skeleton', !ready);
        el.setAttribute('aria-disabled', live ? 'false' : 'true');
        el.style.opacity = over ? '0.4' : '';
      }
      f.setStatus(claim ? '<b>Done</b>' : over ? 'Expired' : live ? `<b>${sec1(fam.helpers.deadlineLeft(spec, m.t))} s</b> left` : 'Loading');
    }
    return {
      sync,
      locate(tg) {
        const i = tg.button ? spec.buttons.findIndex((b) => b.key === tg.button) : -1;
        return i >= 0 ? util.center(els[i]) : null;
      },
    };
}

  function buildSearch(unitScope, ctx, f) {
    const { env, ICON, spinner } = unitScope;
    const { spec, util, rng } = ctx;
    const fam = env.taskDef;
    const ev = (e) => { ctx.update(fam.helpers.act(ctx.model, spec, e)); sync(ctx.model); };
    const main = util.el('div', 'ut-main', f.body);
    const mr = main.getBoundingClientRect();
    const W = Math.min(660, Math.floor(mr.width));
    const H = Math.floor(mr.height);
    const col = util.el('div', 'ut-col', main);
    col.style.width = W + 'px';
    col.style.height = H + 'px';
    col.style.left = Math.round(rng.float(0, 1) * Math.max(0, mr.width - W)) + 'px';
    col.style.top = '0px';
    const srow = util.el('div', 'ut-searchrow', col);
    const box = util.el('div', 'ut-sbox', srow);
    box.innerHTML = ICON.search;
    const inp = util.el('input', 'ut-sinput', box);
    inp.type = 'text';
    inp.autocomplete = 'off';
    inp.spellcheck = false;
    inp.placeholder = spec.label;
    const spin = spinner(util, box);
    spin.svg.setAttribute('class', 'ut-sspin');
    const res = util.el('div', 'ut-res', col);
    const head = util.el('div', 'ut-reshead', res);
    const headL = util.el('span', '', head);
    util.el('span', '', head, rng.pick(['Sort: Relevance', 'Best match', 'Sort: Featured']));
    const list = util.el('div', '', res);
    const detail = util.el('div', 'ut-detail', res);
    const backB = util.el('button', 'ut-link', detail, '← Back to results');
    backB.type = 'button';
    backB.addEventListener('click', () => ev({ back: true }));
    const dT = util.el('h3', '', detail);
    const dP = util.el('div', 'ut-price', detail);
    const rh = 46;
    const tf = env.ui.textField(inp, { value: ctx.model.q, label: 'q', onInput: (v) => ev({ input: v }) });
    inp.addEventListener('focus', () => { if (!ctx.model.focus) ev({ focus: true }); });
    inp.addEventListener('blur', () => { if (ctx.model.focus) ev({ focus: false }); });
    let rows = new Map();
    let built = null;

    function sync(m) {
      if (inp.value !== m.q) tf.set(m.q);
      const st = fam.helpers.searchState(spec, m);
      spin.svg.style.display = st === 'loading' ? '' : 'none';
      spin.arc.setAttribute('transform', `rotate(${Math.round((m.t / spec.beat) * 135) % 360} 11 11)`);
      if (built !== m.settled) {
        built = m.settled;
        list.replaceChildren();
        rows = new Map();
        const ids = fam.helpers.searchList(spec, m.settled);
        if (!ids.length) util.el('div', 'ut-snote', list, 'No matching products');
        for (const i of ids) {
          const it = spec.items[i];
          const el = util.el('div', 'ut-row2', list);
          el.style.height = rh + 'px';
          el.dataset.role = 'result';
          const th = util.el('div', 'ut-thumb', el);
          th.style.background = `linear-gradient(135deg, hsl(${(i * 67 + 20) % 360},55%,70%), hsl(${(i * 67 + 70) % 360},45%,48%))`;
          const nm = util.el('div', 'ut-rn', el);
          util.el('b', '', nm, it.name);
          util.el('small', '', nm, spec.category);
          util.el('div', 'ut-rp', el, fam.helpers.fmt$(it.price));
          el.addEventListener('click', () => ev({ result: i }));
          rows.set(i, el);
        }
        headL.textContent = m.settled ? `${ids.length} results for “${m.settled}”` : 'Popular products';
      }
      detail.style.display = m.open === null ? 'none' : '';
      if (m.open !== null) {
        dT.textContent = spec.items[m.open].name;
        dP.textContent = fam.helpers.fmt$(spec.items[m.open].price);
      }
      f.setStatus(m.open !== null ? 'Product page' : st === 'loading' ? 'Searching…' : st === 'typing' ? 'Typing…' : 'Ready');
    }
    return {
      sync,
      locate(tg) {
        if (tg.field) return tf.locate();
        if (tg.back) return util.center(backB);
        if (tg.result !== undefined && rows.get(tg.result)) {
          const r = rows.get(tg.result).getBoundingClientRect();
          return [r.left + Math.min(220, r.width * 0.35), r.top + r.height / 2];
        }
        return null;
      },
    };
}
  env.template('act-in-time/_base-lists', () => ({ buildLoading, buildCarousel, buildRefresh, buildDeadline, buildSearch }));
})();
