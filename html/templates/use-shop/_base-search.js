/* use-shop/_base-search: reference search units; scope reads preserve live design overrides. */
(function () {
  'use strict';
  function buildSearch(scope, ctx, body) {
    // One render owns the elements and callbacks shared by its named steps.
    const view = { scope, ctx, body };
    view.paintFoot = (...args) => paintFoot(view, ...args);
    view.feedMore = (...args) => feedMore(view, ...args);
    view.rebuildVisit = (...args) => rebuildVisit(view, ...args);
    view.rebuild = (...args) => rebuild(view, ...args);
    view.paint = (...args) => paint(view, ...args);
    createSearchView(view);
    return {
      paint: view.paint,
      locate(t) {
        if (t.field) return view.tf.locate();
        if (t.button) return view.scope.where(view.go, 'Search button');
        if (t.back) return view.scope.where(view.back, 'Back to results');
        if (t.page !== undefined) return view.scope.where(view.pages[t.page], `page ${t.page}`);
        if (t.pager) return view.scope.where(t.pager === 'prev' ? view.prev : view.next, `pager ${t.pager}`);
        if (t.thumb) return view.lbx.locateThumb();
        if (t.scroll !== undefined) return view.lbx.locateThumbFor(t.scroll);
        if (t.pane) return view.scope.where(view.lbx.list, 'results list');
        if (t.result !== undefined) return view.scope.where(view.titles[t.result], `result ${t.result}`);
        return null;
      },
    };
  }

  function paintFoot(view, m) {
    const f = view.feed.foot;
    f.replaceChildren();
    if (m.loading > 0) {
      f.classList.add('busy');
      view.util.el('span', '', f, 'Loading more results…');
      view.util.el('i', 'as-inline-icon', f).innerHTML = view.scope.ICON.clock;
    } else {
      f.classList.remove('busy');
      view.util.el('span', '', f, m.loaded >= view.spec.results.length ? 'You have reached the end of the results.' : 'Scroll down for more results');
    }
  }

  function feedMore(view, m) {
    while (view.feed.shown < m.loaded) {
      const i = view.feed.shown++;
      const r = view.feed.mkCard(i);
      r.style.height = view.cardH + 'px';
      view.lbx.list.insertBefore(r, view.feed.foot);
      view.lbx.option(i, r);
    }
    view.feed.track.classList.toggle('idle', m.loaded <= view.spec.rows);
    view.paintFoot(m);
    view.lbx.refresh();
  }

  function rebuildVisit(view, m) {
    view.visit.replaceChildren();
    const r = view.scope.F().resultsFor(view.spec, m.query)[m.pick.index];
    const vb = view.util.el('div', 'se-vbar', view.visit);
    view.back = view.scope.btn(view.util, 'as-btn sm', vb, '← Back to results', 'back');
    view.back.addEventListener('click', () => view.commit(view.scope.F().apply(view.ctx.model, view.spec, { click: { back: true } })));
    view.util.el('span', '', vb, `https://${r.host}/${r.path}`);
    const page = view.util.el('div', 'se-vpage', view.visit);
    const site = view.util.el('div', 'se-vsite', page);
    const fav = view.util.el('span', 'se-fav', site, r.host.charAt(0).toUpperCase());
    fav.style.background = view.scope.FAV[view.scope.hashStr(r.host) % view.scope.FAV.length];
    view.util.el('span', '', site, r.host.replace(/^www\./, ''));
    view.util.el('h2', '', page, r.title);
    view.util.el('p', '', page, r.desc);
    view.scope.iconLabel(view.util, page, 'shield', 'Independent publisher · About this website');
    view.util.el('div', 'as-micro', page, 'Home / Articles / Featured resources');
    const extra = view.scope.env.content.SENTENCES || [];
    if (extra.length) {
      const h = view.scope.hashStr(`${r.host}|${r.title}`);
      view.util.el('p', '', page, [0, 1, 2].map((k) => extra[(h + k * 7919) % extra.length]).join(' '));
    }
  }

  function rebuild(view, m) {
    view.list.replaceChildren();
    view.pager.replaceChildren();
    view.titles = [];
    view.pages = [];
    view.list.hidden = view.pager.hidden = !!m.pick;
    if (view.inf) view.list.classList.toggle('idle', m.query === null);
    view.visit.hidden = !m.pick;
    if (m.pick) {
      view.rebuildVisit(m);
      return;
    }
    if (m.query === null) {
      view.meta.textContent = '';
      const e = view.util.el('div', 'se-empty', view.list);
      e.innerHTML = `${view.scope.ICON.search}<div>Search for ideas, places and useful answers.</div>`;
      const browse = view.util.el('div', 'se-empty-browse', e);
      view.util.el('b', '', browse, 'Popular now');
      const chips = view.util.el('div', 'se-chips', browse);
      for (const term of ['Weekend escapes', 'Seasonal recipes', 'Home office ideas', 'Outdoor essentials', 'Local events']) view.util.el('span', '', chips, term);
      view.scope.iconLabel(view.util, browse, 'clock', 'Your recent searches will appear here');
      return;
    }
    const res = view.scope.F().resultsFor(view.spec, m.query);
    const n = 1000 + (view.scope.hashStr(m.query.toLowerCase()) % 90000) * 13;
    view.meta.textContent = `About ${n.toLocaleString('en-US')} results for "${m.query.trim()}"`;
    const mkCard = (i, parent) => {
      const r = res[i];
      const card = view.util.el('div', 'se-card', parent);
      card.style.height = view.cardH + 'px';
      const url = view.util.el('div', 'se-url', card);
      const fav = view.util.el('span', 'se-fav', url, r.host.charAt(0).toUpperCase());
      fav.style.background = view.scope.FAV[view.scope.hashStr(r.host) % view.scope.FAV.length];
      view.util.el('span', 'se-host', url, r.host);
      view.util.el('span', 'se-path', url, `› ${r.path.replace(/\//g, ' › ')}`);
      const t = view.util.el('a', 'se-title', card, r.title);
      t.dataset.role = 'result';
      t.dataset.index = i;
      t.addEventListener('click', () => {
        if (view.ctx.model.pick) return;
        view.scope.irreversible(view.ctx, { result: i });
        view.commit(view.scope.F().apply(view.ctx.model, view.spec, { click: { result: i } }));
      });
      view.titles[i] = t;
      if (view.spec.corpus) {
        // Corpus results (products, people, apps): the metadata fields under the title.
        const cm = view.util.el('div', 'se-cmeta', card);
        view.scope.F().resultMeta(view.spec, r).forEach(([label, text], k) => {
          const e = view.util.el(k === 0 && view.spec.corpus === 'products' ? 'b' : 'span', '', cm, text);
          e.title = label;
        });
      }
      if (view.lines > (view.spec.corpus ? 1 : 0)) view.util.el('div', 'se-desc', card, r.desc);
      return card;
    };
    if (view.inf) {
      view.feed = { res, mkCard, shown: m.loaded };
      view.lbx = view.scope.listPane(view.ctx, view.list, { keys: [...Array(m.loaded).keys()], build: (i) => mkCard(i), rows: view.spec.rows, pitch: view.cardH, gap: 0,
        scroll: m.scroll, label: 'results' });
      view.feed.foot = view.util.el('div', 'se-foot', view.lbx.list);
      view.feed.foot.style.height = Math.round(view.cardH * 0.6) + 'px';
      view.feed.track = view.list.querySelector('.as-track');
      view.paintFoot(m);
      return;
    }
    const p0 = m.page * view.spec.perPage;
    for (let k = 0; k < view.spec.perPage && p0 + k < res.length; k++) mkCard(p0 + k, view.list);
    const mk = (label, page, cls = '') => {
      const b = view.scope.btn(view.util, 'se-pg' + cls, view.pager, label);
      b.addEventListener('click', () => {
        if (view.ctx.model.pick || b.disabled) return;
        const p = page === 'prev' ? view.ctx.model.page - 1 : page === 'next' ? view.ctx.model.page + 1 : page;
        if (p >= 0 && p < view.spec.pages && p !== view.ctx.model.page) view.commit({ ...view.ctx.model, page: p });
      });
      return b;
    };
    view.prev = mk('‹', 'prev');
    view.prev.disabled = m.page === 0;
    for (let p = 0; p < view.spec.pages; p++) view.pages[p] = mk(String(p + 1), p, p === m.page ? ' on' : '');
    view.next = mk('›', 'next');
    view.next.disabled = m.page === view.spec.pages - 1;
  }

  function paint(view, m) {
    if (view.input.value !== m.text) view.tf.set(m.text);
    const key = JSON.stringify([m.query, m.page, m.pick, view.inf ? 0 : null]);
    if (key !== view.shown) {
      view.shown = key;
      view.rebuild(m);
    } else if (view.feed && !m.pick && m.query !== null) {
      if (view.feed.shown !== m.loaded || view.feed.foot.classList.contains('busy') !== (m.loading > 0)) view.feedMore(m);
    }
  }
  function createSearchView(view) {
    ({ util: view.util, spec: view.spec, rng: view.rng } = view.ctx);
    view.commit = (m) => { view.ctx.update(m); view.paint(view.ctx.model); };
    view.main = view.util.el('div', 'se-main', view.body);
    view.main.style.paddingLeft = view.rng.int(18, 40) + 'px';
    view.col = view.util.el('div', 'se-col', view.main);
    view.bar = view.util.el('div', 'se-bar', view.col);
    view.box = view.util.el('div', 'se-box', view.bar);
    view.box.innerHTML = view.scope.ICON.search;
    view.input = view.util.el('input', 'se-input', view.box);
    Object.assign(view.input, { type: 'text', autocomplete: 'off', spellcheck: false,
      placeholder: view.rng.pick(['Search the web', `Search ${view.spec.engine}`, 'Type to search', 'What are you looking for?']) });
    view.input.dataset.role = 'search-field';
    view.go = view.scope.btn(view.util, 'as-btn primary se-go', view.bar, view.rng.pick(['Search', 'Search', 'Go']), 'search-button');
    view.meta = view.util.el('div', 'se-meta', view.col);
    view.inf = !!view.spec.infinite;
    view.list = view.util.el('div', view.inf ? 'as-pane se-pane' : 'se-list', view.col);
    view.pager = view.util.el('div', 'se-pager', view.col);
    view.visit = view.util.el('div', 'se-visit', view.col);
    view.visit.hidden = true;
    view.pager.style.minHeight = '44px';
    view.bh = view.body.getBoundingClientRect().height;
    view.avail = view.bh - 32 - 46 - 40 - 50;
    view.cardH = view.inf ? Math.max(62, Math.min(112, Math.floor((view.bh - 134) / view.spec.rows)))
      : Math.max(60, Math.min(118, Math.floor(view.avail / view.spec.perPage)));
    view.lines = view.cardH >= 98 ? 2 : view.cardH >= 78 ? 1 : 0;
    if (view.inf) {
      view.pager.remove();
      view.list.style.height = view.spec.rows * view.cardH + 2 + 'px';
      view.scope.mirrorPitch(view.ctx, view.cardH);
    }
    view.col.style.setProperty('--se-lines', Math.max(1, view.lines));
    if (view.body.getBoundingClientRect().width > 900) {
      const side = view.util.el('aside', 'se-side', view.main);
      const b1 = view.util.el('div', 'se-box2', side);
      view.util.el('h4', '', b1, 'Related searches');
      const chips = view.util.el('div', 'se-chips', b1);
      for (const t of view.rng.sample(['news', 'reviews', 'near me', 'images', 'wiki', 'videos', 'prices', 'today', 'map'], 5)) view.util.el('span', '', chips, t);
      const b2 = view.util.el('div', 'se-box2', side);
      view.util.el('h4', '', b2, 'Your search preferences');
      view.util.el('p', '', b2, 'Region: United States · Language: English');
      view.scope.iconLabel(view.util, b2, 'shield', 'Safe search is on');
      view.util.el('p', '', b2, 'Search history · Privacy controls');
    }
    view.tf = view.scope.env.ui.textField(view.input, { value: view.ctx.model.text, label: 'search', onInput: (v) => view.commit({ ...view.ctx.model, text: v }) });
    view.scope.trackFocus(view.ctx, view.input, 'search');
    view.doSearch = () => {
      if (!view.input.value.trim() || view.ctx.model.pick) return;
      view.commit(view.scope.F().apply({ ...view.ctx.model, text: view.input.value }, view.spec, { click: { button: 'search' } }));
    };
    view.go.addEventListener('click', view.doSearch);
    view.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        view.doSearch();
      }
    });
    view.shown = null;
    view.titles = [];
    view.pages = [];
    view.feed = null;
    view.lbx = null;
    view.prev = null;
    view.next = null;
    view.back = null;
    view.paint(view.ctx.model);
  }
  env.template('use-shop/_base-search', () => ({ buildSearch }));
})();
