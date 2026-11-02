// Preserves this design's infinite results feed, custom scroll controls, and people result cards.
(function () {
  'use strict';
  env.widget({
    task: 'use-shop',
    site: 'design-use-shop-search-06',
    name: 'design',
    split: 'train',
    scenarios: ['search'],
    traits: { corpus: 'people', infinite: true },
    template: 'use-shop/store',
    design: {
      parts: {
        buildSearch: (base, S) => (ctx, body) => {
          const { F, hashStr, where, btn, trackFocus, listPane, mirrorPitch, ICON, FAV } = S.H;
    const { util, spec, rng } = ctx;
    const commit = (m) => { ctx.update(m); paint(ctx.model); };
    const main = util.el('div', 'se-main', body);
    main.style.paddingLeft = rng.int(18, 40) + 'px';
    const col = util.el('div', 'se-col', main);
    const bar = util.el('div', 'se-bar', col);
    const box = util.el('div', 'se-box', bar);
    box.innerHTML = ICON.search;
    const input = util.el('input', 'se-input', box);
    Object.assign(input, { type: 'text', autocomplete: 'off', spellcheck: false,
      placeholder: rng.pick(['Search the web', `Search ${spec.engine}`, 'Type to search', 'What are you looking for?']) });
    input.dataset.role = 'search-field';
    const go = btn(util, 'as-btn primary se-go', bar, rng.pick(['Search', 'Search', 'Go']), 'search-button');
    go.textContent = 'Search';
    const erase = btn(util, 'se-erase', box, '×');
    erase.setAttribute('aria-label', 'Clear search text');
    erase.addEventListener('click', () => { tf.set(''); commit({ ...ctx.model, text: '' }); input.focus(); });
    const per = util.el('div', 'se-per', bar);
    util.el('span', '', per, 'Results per page:');
    const perValue = btn(util, 'se-per-value', per, String(spec.perPage));
    util.el('span', 'se-per-arrow', perValue, '');
    perValue.setAttribute('aria-label', `Results per page: ${spec.perPage}`);
    perValue.addEventListener('click', () => {
      const existing = per.querySelector('.se-per-info');
      if (existing) existing.remove();
      else util.el('div', 'se-per-info', per, String(spec.perPage));
    });
    const meta = util.el('div', 'se-meta', col);
    const viewport = util.el('div', 'se-viewport', col);
    const inf = !!spec.infinite;
    const list = util.el('div', 'se-list' + (inf ? ' se-infinite' : ''), viewport);
    const scrollControls = util.el('div', 'se-scroll-controls', viewport);
    const scrollUp = btn(util, 'se-scroll-up', scrollControls, '');
    scrollUp.setAttribute('aria-label', 'Scroll results up');
    let scrollTrack = util.el('div', 'se-scroll-track', scrollControls);
    let scrollThumb = util.el('div', 'se-scroll-thumb', scrollTrack);
    const scrollDown = btn(util, 'se-scroll-down', scrollControls, '');
    scrollDown.setAttribute('aria-label', 'Scroll results down');
    let lbx = null;
    let feed = null;
    const updateScroll = () => {
      if (inf && lbx) {
        const inner = lbx.list;
        const range = Math.max(0, inner.scrollHeight - inner.clientHeight);
        scrollThumb.hidden = !range;
        scrollUp.disabled = !range || inner.scrollTop <= 0;
        scrollDown.disabled = !range || inner.scrollTop >= range;
        return;
      }
      const range = Math.max(0, list.scrollHeight - list.clientHeight);
      const height = scrollTrack.clientHeight;
      const thumbHeight = range ? Math.max(30, height * list.clientHeight / list.scrollHeight) : height;
      scrollThumb.style.height = thumbHeight + 'px';
      scrollThumb.style.top = (range ? list.scrollTop / range * (height - thumbHeight) : 0) + 'px';
      scrollThumb.hidden = !range;
      scrollUp.disabled = !range || list.scrollTop <= 0;
      scrollDown.disabled = !range || list.scrollTop >= range;
    };
    list.addEventListener('scroll', updateScroll);
    scrollUp.addEventListener('click', () => { (lbx ? lbx.list : list).scrollTop -= cardH; updateScroll(); });
    scrollDown.addEventListener('click', () => { (lbx ? lbx.list : list).scrollTop += cardH; updateScroll(); });
    scrollTrack.addEventListener('pointerdown', (e) => {
      if (inf) return; // The listbox owns track clicks and thumb drags.
      if (e.target === scrollThumb) return;
      const y = e.clientY - scrollTrack.getBoundingClientRect().top;
      list.scrollTop += y < scrollThumb.offsetTop ? -list.clientHeight : list.clientHeight;
      updateScroll();
    });
    let thumbDrag = null;
    scrollThumb.addEventListener('pointerdown', (e) => {
      if (inf) return;
      thumbDrag = { y: e.clientY, scroll: list.scrollTop };
      scrollThumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    scrollThumb.addEventListener('pointermove', (e) => {
      if (!thumbDrag) return;
      const travel = scrollTrack.clientHeight - scrollThumb.clientHeight;
      if (travel > 0) list.scrollTop = thumbDrag.scroll + (e.clientY - thumbDrag.y) * (list.scrollHeight - list.clientHeight) / travel;
      updateScroll();
    });
    scrollThumb.addEventListener('pointerup', () => { thumbDrag = null; });
    scrollThumb.addEventListener('pointercancel', () => { thumbDrag = null; });
    const pager = util.el('div', 'se-pager', col);
    pager.hidden = inf;
    const visit = util.el('div', 'se-visit', col);
    visit.hidden = true;
    pager.style.minHeight = '44px';
    const bh = body.getBoundingClientRect().height;
    const avail = bh - 32 - 46 - 40 - 50;
    const cardH = inf ? (viewport.clientHeight - 2) / spec.rows
      : Math.max(60, Math.min(118, Math.floor(avail / spec.perPage)));
    if (inf) {
      viewport.style.setProperty('--se-pitch', cardH + 'px');
      // The task uses the actual row pitch to plan wheel movement.
      mirrorPitch(ctx, cardH);
    }
    const lines = cardH >= 98 ? 2 : cardH >= 78 ? 1 : 0;
    col.style.setProperty('--se-lines', Math.max(1, lines));
    if (body.getBoundingClientRect().width > 1080) {
      const side = util.el('aside', 'se-side', main);
      const b1 = util.el('div', 'se-box2', side);
      util.el('h4', '', b1, 'Related searches');
      const chips = util.el('div', 'se-chips', b1);
      for (const t of rng.sample(['news', 'reviews', 'near me', 'images', 'wiki', 'videos', 'prices', 'today', 'map'], 5)) util.el('span', '', chips, t);
      const b2 = util.el('div', 'se-box2', side);
      util.el('h4', '', b2, 'Search tips');
      util.el('p', '', b2, 'Results are listed a few per page. Use the page numbers below the results to see more.');
    }

    const tf = env.ui.textField(input, { value: ctx.model.text, label: 'search', onInput: (v) => commit({ ...ctx.model, text: v }) });
    trackFocus(ctx, input, 'search');
    const doSearch = () => {
      if (!input.value.trim() || ctx.model.pick) return;
      commit(F().apply({ ...ctx.model, text: input.value }, spec, { click: { button: 'search' } }));
    };
    go.addEventListener('click', doSearch);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch();
      }
    });

    let shown = null;
    let titles = [];
    let pages = [];
    let prev = null;
    let next = null;
    let back = null;
    function paintFoot(m) {
      feed.foot.classList.toggle('busy', m.loading > 0);
      feed.foot.textContent = m.loading > 0 ? 'Loading more results…'
        : m.loaded >= spec.results.length ? 'You have reached the end of the results.'
        : 'Scroll down for more results';
    }
    function feedMore(m) {
      while (feed.shown < m.loaded) {
        const i = feed.shown++;
        const card = feed.mkCard(i);
        lbx.list.insertBefore(card, feed.foot);
        lbx.option(i, card);
      }
      feed.track.classList.toggle('idle', m.loaded <= spec.rows);
      paintFoot(m);
      lbx.refresh();
      updateScroll();
    }
    function rebuildVisit(m) {
      visit.replaceChildren();
      const r = F().resultsFor(spec, m.query)[m.pick.index];
      const vb = util.el('div', 'se-vbar', visit);
      back = btn(util, 'as-btn sm', vb, '← Back to results', 'back');
      back.addEventListener('click', () => commit(F().apply(ctx.model, spec, { click: { back: true } })));
      util.el('span', '', vb, `https://${r.host}/${r.path}`);
      const page = util.el('div', 'se-vpage', visit);
      const site = util.el('div', 'se-vsite', page);
      const fav = util.el('span', 'se-fav', site, r.host.charAt(0).toUpperCase());
      fav.style.background = FAV[hashStr(r.host) % FAV.length];
      util.el('span', '', site, r.host.replace(/^www\./, ''));
      util.el('h2', '', page, r.title);
      util.el('p', '', page, r.desc);
      const extra = env.content.SENTENCES || [];
      if (extra.length) {
        const h = hashStr(`${r.host}|${r.title}`);
        util.el('p', '', page, [0, 1, 2].map((k) => extra[(h + k * 7919) % extra.length]).join(' '));
      }
    }
    function rebuild(m) {
      if (lbx && lbx.destroy) lbx.destroy();
      lbx = null;
      feed = null;
      list.replaceChildren();
      pager.replaceChildren();
      titles = [];
      pages = [];
      list.hidden = !!m.pick;
      pager.hidden = !!m.pick || !!spec.infinite;
      viewport.hidden = !!m.pick;
      scrollControls.hidden = false;
      visit.hidden = !m.pick;
      if (m.pick) {
        rebuildVisit(m);
        return;
      }
      if (m.query === null) {
        meta.textContent = 'No results to display.';
        const e = util.el('div', 'se-empty', list);
        e.textContent = 'Enter a search query above.';
        return;
      }
      const res = F().resultsFor(spec, m.query);
      meta.textContent = `Results for "${m.query.trim()}" (${res.length} found)`;
      const mkCard = (i, parent) => {
        const r = res[i];
        const card = util.el('div', 'se-card', parent);
        card.style.height = cardH + 'px';
        util.el('span', 'se-number', card, `${i + 1}.`);
        util.el('span', 'se-avatar', card);
        const metaRows = F().resultMeta ? F().resultMeta(spec, r) : [];
        const emailRow = metaRows.find(([, value]) => String(value).includes('@'));
        const details = metaRows.filter(([, value]) => !emailRow || value !== emailRow[1]).slice(0, 2);
        const url = util.el('div', 'se-url', card);
        const fav = util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
        fav.style.background = FAV[hashStr(r.host) % FAV.length];
        util.el('span', 'se-host', url, emailRow ? emailRow[1] : r.host);
        // Host-based search goals still need the source domain when it differs
        // from the person's email domain.
        if (emailRow && String(emailRow[1]).split('@').pop().toLowerCase() !== r.host.toLowerCase()) {
          util.el('span', 'se-source-host', card, r.host);
        }
        if (!emailRow) util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
        const t = util.el('a', 'se-title', card, r.title);
        t.dataset.role = 'result';
        t.dataset.index = i;
        t.addEventListener('click', () => {
          if (ctx.model.pick) return;
          commit(F().apply(ctx.model, spec, { click: { result: i } }));
        });
        titles[i] = t;
        const description = util.el('div', 'se-desc', card);
        if (details.length) details.slice().reverse().forEach(([label, value], k) => {
          const line = util.el('span', k === 0 ? 'se-location' : 'se-role', description, value);
          line.title = label;
        });
        else description.textContent = r.desc;
        return card;
      };
      if (inf) {
        // Use the reference's list construction and viewport row count exactly.
        // A fresh inner list also removes old listeners after a new query or Back.
        scrollTrack.remove();
        lbx = listPane(ctx, list, {
          keys: [...Array(m.loaded).keys()], build: i => mkCard(i),
          rows: spec.rows, pitch: cardH, gap: 0, scroll: m.scroll, label: 'results',
        });
        scrollTrack = list.querySelector('.as-track');
        scrollThumb = scrollTrack.querySelector('.as-thumb');
        scrollTrack.classList.add('se-scroll-track');
        scrollThumb.classList.add('se-scroll-thumb');
        scrollControls.insertBefore(scrollTrack, scrollDown);
        lbx.list.addEventListener('scroll', updateScroll);
        feed = { shown: m.loaded, mkCard, track: scrollTrack, foot: util.el('div', 'se-foot', lbx.list) };
        feed.foot.style.height = Math.round(cardH * .6) + 'px';
        paintFoot(m);
        lbx.refresh();
        updateScroll();
        lbx.set({ scroll: m.scroll || 0 });
        return;
      }
      const p0 = m.page * spec.perPage;
      for (let k = 0; k < spec.perPage && p0 + k < res.length; k++) mkCard(p0 + k, list);
      const mk = (label, page, cls = '') => {
        const b = btn(util, 'se-pg' + cls, pager, label);
        b.addEventListener('click', () => {
          if (ctx.model.pick || b.disabled) return;
          const p = page === 'prev' ? ctx.model.page - 1 : page === 'next' ? ctx.model.page + 1 : page;
          if (p >= 0 && p < spec.pages && p !== ctx.model.page) commit({ ...ctx.model, page: p });
        });
        return b;
      };
      prev = mk('‹', 'prev');
      prev.disabled = m.page === 0;
      for (let p = 0; p < spec.pages; p++) pages[p] = mk(String(p + 1), p, p === m.page ? ' on' : '');
      next = mk('›', 'next');
      next.disabled = m.page === spec.pages - 1;
    }
    function paint(m) {
      if (input.value !== m.text) tf.set(m.text);
      const steps = document.querySelectorAll('.step');
      steps.forEach((el, i) => el.classList.toggle('on', i === (m.pick ? 2 : m.query === null ? 0 : 1)));
      const selected = document.querySelector('.dv');
      if (selected) selected.textContent = m.pick ? F().resultsFor(spec, m.query)[m.pick.index].title : 'None';
      const key = JSON.stringify([m.query, m.page, m.pick]);
      if (key !== shown) {
        shown = key;
        rebuild(m);
        updateScroll();
      } else if (feed && !m.pick && m.query !== null) {
        if (feed.shown !== m.loaded || feed.foot.classList.contains('busy') !== (m.loading > 0)) feedMore(m);
      }
    }
    paint(ctx.model);
    return {
      paint,
      locate(t) {
        if (t.thumb) return lbx ? lbx.locateThumb() : where(scrollThumb, 'search results scrollbar thumb');
        if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
        if (t.pane) return where(lbx ? lbx.list : list, 'search results list');
        if (t.field) return tf.locate();
        if (t.button) return where(go, 'Search button');
        if (t.back) return where(back, 'Back to results');
        if (t.page !== undefined) return where(pages[t.page], `page ${t.page}`);
        if (t.pager) return where(t.pager === 'prev' ? prev : next, `pager ${t.pager}`);
        if (t.result !== undefined) return where(titles[t.result], `result ${t.result}`);
        return null;
      },
    };
        },
      },
    },
  });
})();
