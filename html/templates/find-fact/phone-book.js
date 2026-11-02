/*
 * find-fact/phone-book: phone-book widget extracted from the L1 medoid design-find-fact-table-01.
 * Scenarios served: phone-book. With design: {} reproduces design-find-fact-phone-book-01 exactly.
 * Other widget builders and wrapper registration code are deliberately omitted.
 * Tokens (defaults first; VARIANTS below applies the scenario's shared presentation):
 *   roomInset: [48, 48], full-stage room width/height subtraction.
 *   cards: true, allow the medoid card-mode selection and rng draw (preset false for all 12 sites).
 *   searchIcon: SEARCH_ICON, original magnifier SVG.
 *   headers: ['Name','Phone','Email','Address'], row column captions.
 *   widths: ['24%','20%','30%','26%'], column widths.
 *   props: ['phone','email','address'], linked property order (email-first 6/12; address-first 2/12).
 *   footClass: '', optional footer class.
 *   idleClass: '', idle status suffix (two sites use ' idle').
 *   hideIdle: false, display:none until a pick (2/12).
 * Scenario preset: phone-book cards false (12/12); rows skip the medoid card-mode rng draw.
 * Parts (replace with (base, S) => replacement; call inner parts through S.P):
 *   style() -> void; install the original rl-style stylesheet once
 *   frame(ctx) -> {app, work, room}; full-stage frame with roomInset
 *   card(util, parent, title, sub) -> {card, body}; original card DOM
 *   begin(ctx) -> void; before frame, default no-op
 *   framed(ctx, frame, up) -> void; before widget, default no-op
 *   rendered(ctx, frame, up) -> void; after widget, default no-op
 *   input(util, parent, role, placeholder) -> input; original text input
 *   firstBox(el) -> point; center of first link line box
 *   build(ctx, work, up, room) -> view; row contact book and original pager/search/undo
 *   link(ctx, parent, contact, index, prop, clicked) -> span; contact action
 *   headers(ctx, B, table) -> void; headers and widths tokens
 *   header(ctx, th, index) -> void; per-header decoration, default no-op
 *   cards(ctx, B, indices, picked, links) -> void; original contact-card layout
 *   row(ctx, B, tr, contact, index, picked, links) -> void; name then props
 *   name(ctx, B, tr, contact, index, picked, links) -> void; plain name cell
 *   book(ctx, B) -> void; before sizing, default no-op
 *   searchParent(ctx, B) -> element; body by default
 *   searchInput(ctx, B, box, input) -> void; before binding, default no-op
 *   searchBound(ctx, B) -> void; after binding, B.searchField available, default no-op
 *   status(ctx, B) -> void; before undo creation, default no-op
 *   results(ctx, B) -> element; original result container
 *   pager(ctx, B, buttons) -> void; before pager binding, default no-op
 *   rowsRendered(ctx, B) -> void; before link binding, default no-op
 *   picked(ctx, B, model, lastPick, wrong) -> void; before status text, default no-op
 *   footer(ctx, B, count) -> void; after count text, default no-op
 *   ready(ctx, B) -> void; before initial paint, B.paint available, default no-op
 * B is per render: work, room, bc, body, search, per, fam, up; searchField, status,
 * statusText, results, foot and paint become available at the documented hooks.
 * S.ctx, S.spec, S.view and S.frame are live getters; S.D and S.P expose resolved tokens/parts.
 * All episode state belongs to this factory. Hooks run before anchors are returned.
 * Preserve each replaced part's rng draws and order; fork any new decoration randomness.
 */
(function () {
  'use strict';



  const AV_COLORS = ['#2f6fed', '#d9480f', '#0b8a5b', '#7c3aed', '#c2255c', '#0c8599', '#8d5524', '#5c7cfa'];
  const SEARCH_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg>';

  const TOKENS = { roomInset: [48, 48], cards: true, searchIcon: SEARCH_ICON, headers: ['Name', 'Phone', 'Email', 'Address'], widths: ['24%', '20%', '30%', '26%'], props: ['phone', 'email', 'address'], footClass: '', idleClass: '', hideIdle: false };
  const SCENARIOS = { 'phone-book': { cards: false } };

  env.template('find-fact/phone-book', (design, def) => {
    const { CSS } = env.templateLib('find-fact/_style');
    let D, P;
    let view = null;
    let ctxRef, frameRef;
    const BASE = {};
    const S = {
      get ctx() { return ctxRef; }, get spec() { return ctxRef && ctxRef.spec; },
      get view() { return view; }, get frame() { return frameRef; },
      get D() { return D; }, get P() { return P; },
    };
    BASE.style = () => {
      if (document.getElementById('rl-style')) return;
      const s = document.createElement('style');
      s.id = 'rl-style';
      s.textContent = CSS;
      document.head.append(s);
    };
    BASE.frame = (ctx) => {
      const { util, size } = ctx;
      const app = util.el('div', 'rl-app', ctx.stage);
      app.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column';
      const work = util.el('div', 'rl-work', app);
      return { app, work, room: { w: size.width - D.roomInset[0], h: size.height - D.roomInset[1], grow: () => false } };
    };
    BASE.card = (util, parent, title, sub) => {
      const c = util.el('div', 'rl-card', parent);
      const h = util.el('h3', '', c, title);
      if (sub) util.el('small', '', h, sub);
      const b = util.el('div', 'rl-card-b', c);
      return { card: c, body: b };
    };
    BASE.begin = () => {};
    BASE.framed = () => {};
    BASE.rendered = () => {};
    BASE.input = (util, parent, role, placeholder) => {
      const inp = util.el('input', 'rl-input', parent);
      inp.type = 'text';
      inp.autocomplete = 'off';
      inp.spellcheck = false;
      inp.dataset.role = role;
      if (placeholder) inp.placeholder = placeholder;
      return inp;
    };
    BASE.firstBox = (el) => {
      const rs = el.getClientRects();
      const r = rs.length ? rs[0] : el.getBoundingClientRect();
      if (!r || !r.width) return null;
      return [r.left + Math.min(r.width / 2, 40), r.top + r.height / 2];
    };
    BASE.build = (ctx, work, up, room) => {
      const { spec, util, rng } = ctx;
      const fam = env.taskDef;
      const search = spec.mode === 'search';
      const per = search ? spec.maxResults : spec.perPage;
      const cardsFit = Math.floor((room.w - 30) / 292);
      const asCards = D.cards && per <= Math.min(3, cardsFit) && (per === 1 || rng.bool(0.6));
      const { card: bc, body } = P.card(util, work, rng.pick(['Contact book', 'Address book', 'People']), `${spec.contacts.length} contacts`);
      bc.classList.add('rl-book');
      const B = { work, room, bc, body, search, per, fam, up };
      P.book(ctx, B);
      const W = Math.min(asCards ? Math.max(per * 292, 560) : 860, room.w - 30);
      bc.style.width = W + 30 + 'px';

      let searchField = null;
      if (search) {
        const box = util.el('div', 'rl-search', P.searchParent(ctx, B));
        box.innerHTML = D.searchIcon;
        const inp = P.input(util, box, 'search', rng.pick(['Search contacts', 'Search by name', 'Find a person…']));
        P.searchInput(ctx, B, box, inp);
        searchField = env.ui.textField(inp, { value: ctx.model.query, label: 'search', onInput: (v) => { up({ query: v, page: 0 }); paint(); } });
      }
      B.searchField = searchField;
      P.searchBound(ctx, B);
      const status = util.el('div', 'rl-status', body);
      const statusText = util.el('span', '', status);
      B.status = status;
      B.statusText = statusText;
      P.status(ctx, B);
      const undoBtn = util.el('button', 'rl-undo', status, rng.pick(['Undo', 'Go back', 'Undo action']));
      undoBtn.type = 'button';
      undoBtn.dataset.role = 'undo';
      const undo = env.ui.buttons([undoBtn], {
        keys: ['undo'],
        label: 'undo',
        onClick() {
          const m = ctx.model;
          if (!fam.helpers.wrongPick(m, spec)) return;
          const picks = m.picks.filter((p) => p.contact === spec.target && p.prop === spec.prop);
          up({ picks });
          paint();
        },
      });
      const results = P.results(ctx, B);
      B.results = results;
      const rowH = room.h < 420 ? 34 : 39;
      const cardH = 150;
      results.style.height = (asCards ? cardH : 34 + per * rowH) + 'px';
      results.style.width = W + 'px';

      const foot = util.el('div', D.footClass, body);
      B.foot = foot;
      foot.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px';
      let count = null;
      let pager = null;
      let pinfo = null;
      const pageEls = [];
      if (search) count = util.el('div', 'rl-count', foot);
      else {
        const n = fam.helpers.pageCount(spec);
        const nav = util.el('div', 'rl-pager', foot);
        const btn = (label, key) => {
          const b = util.el('button', 'rl-pg', nav, label);
          b.type = 'button';
          b.dataset.key = key;
          b.dataset.role = 'pager';
          pageEls.push(b);
          return b;
        };
        btn('‹ Prev', 'prev');
        if (spec.pager === 'numbers') for (let p = 0; p < n; p++) btn(String(p + 1), `p${p}`);
        else pinfo = util.el('span', 'rl-pinfo', nav);
        btn('Next ›', 'next');
        P.pager(ctx, B, pageEls);
        count = util.el('div', 'rl-count', foot);
        pager = env.ui.buttons(pageEls, {
          label: 'pager',
          mark: () => {},
          onClick(key) {
            const m = ctx.model;
            let page = m.page;
            if (key === 'prev') page = Math.max(0, page - 1);
            else if (key === 'next') page = Math.min(n - 1, page + 1);
            else page = Number(key.slice(1));
            if (page !== m.page) {
              up({ page });
              paint();
            }
          },
        });
      }

      let links = null;
      const paintState = { fam, spec, util, results, asCards, room, up, status, statusText, search, undoBtn, count, pinfo, pageEls, paint,
        set links(value) { links = value; } };
      function paint() { paintBook(ctx, B, paintState); }
      B.paint = paint;
      P.ready(ctx, B);
      paint();
      // Many pages on a narrow stage: shrink the pager buttons.
      if (pageEls.length && foot.scrollWidth > foot.clientWidth + 1) for (const b of pageEls) { b.style.minWidth = '26px'; b.style.padding = '0 6px'; }
      return {
        sync(m) {
          if (searchField) searchField.set(m.query);
          paint();
        },
        locate(t) {
          if (t.search) return searchField && searchField.locate();
          if (t.undo) return undo.locate('undo');
          if (t.page !== undefined) return pager && pager.locate(`p${t.page}`);
          if (t.pager) return pager && pager.locate(t.pager);
          if (t.contact !== undefined) return links && links.locate(`${t.contact}:${t.prop}`);
          return null;
        },
      };
    };
    function paintBook(ctx, B, state) {
      const { fam, spec, util, results, asCards, room, up, status, statusText, search,
        undoBtn, count, pinfo, pageEls, paint } = state;
      const m = ctx.model;
      const idx = fam.helpers.shown(m, spec);
      results.replaceChildren();
      const picked = new Set(m.picks.map((p) => `${p.contact}:${p.prop}`));
      const els = [];
      if (!idx.length) util.el('div', 'rl-empty', results, 'No contacts match your search.');
      else if (asCards) P.cards(ctx, B, idx, picked, els);
      else {
        const t = util.el('table', 'rl-table rl-rows' + (room.h < 420 ? ' compact' : ''), results);
        t.style.width = '100%';
        t.style.tableLayout = 'fixed';
        P.headers(ctx, B, t);
        const tb = util.el('tbody', '', t);
        for (const i of idx) {
          const c = spec.contacts[i];
          const tr = util.el('tr', '', tb);
          P.row(ctx, B, tr, c, i, picked, els);
        }
      }
      P.rowsRendered(ctx, B);
      state.links = env.ui.buttons(els, {
        label: 'contact',
        onClick(key) {
          const [ci, prop] = key.split(':');
          const pick = { contact: Number(ci), prop };
          const wrong = pick.contact !== spec.target || pick.prop !== spec.prop;
          up({ picks: ctx.model.picks.concat([pick]), wrongs: (ctx.model.wrongs || 0) + (wrong ? 1 : 0) });
          paint();
        },
        point: (el) => P.firstBox(el),
      });
      // Status strip: the last pick.
      const last = m.picks[m.picks.length - 1];
      const bad = fam.helpers.wrongPick(m, spec);
      status.className = 'rl-status' + (bad ? ' bad' : last ? ' ok' : D.idleClass);
      if (D.hideIdle) status.style.display = last ? 'flex' : 'none';
      P.picked(ctx, B, m, last, bad);
      if (last) {
        const c = spec.contacts[last.contact];
        statusText.textContent = `Opened ${c.first}’s ${fam.helpers.PROPS[last.prop]}: ${c[last.prop]}`;
      } else statusText.textContent = search ? 'Search by first or last name.' : 'Click a phone number, email or address to open it.';
      undoBtn.style.visibility = bad && spec.recoverable ? 'visible' : 'hidden';
      if (search) {
        const total = spec.contacts.filter((c) => c.name.toLowerCase().includes(String(m.query).trim().replace(/\s+/g, ' ').toLowerCase())).length;
        count.textContent = total ? `Showing ${idx.length} of ${total} contact${total === 1 ? '' : 's'}` : '';
      } else {
        const n = fam.helpers.pageCount(spec);
        if (pinfo) pinfo.textContent = `Page ${m.page + 1} of ${n}`;
        count.textContent = `${m.page * spec.perPage + 1}–${Math.min(spec.contacts.length, (m.page + 1) * spec.perPage)} of ${spec.contacts.length}`;
        for (const b of pageEls) {
          const k = b.dataset.key;
          b.classList.toggle('on', k === `p${m.page}`);
          b.disabled = (k === 'prev' && m.page === 0) || (k === 'next' && m.page === n - 1);
        }
      }
      P.footer(ctx, B, count);
    }
    BASE.link = (ctx, parent, c, i, prop, clicked) => {
      const a = ctx.util.el('span', 'rl-link', parent, c[prop]);
      a.dataset.key = `${i}:${prop}`;
      a.dataset.role = 'link';
      if (clicked) a.setAttribute('data-clicked', 'true');
      return a;
    };
    BASE.headers = (ctx, B, t) => {
      const tr = ctx.util.el('tr', '', ctx.util.el('thead', '', t));
      D.headers.forEach((h, k) => {
        const th = ctx.util.el('th', '', tr, h);
        th.style.width = D.widths[k];
        P.header(ctx, th, k);
      });
    };
    BASE.cards = (ctx, B, idx, picked, els) => {
      const { util, spec } = ctx;
      const { results } = B;
          const row = util.el('div', 'rl-cards', results);
          for (const i of idx) {
            const c = spec.contacts[i];
            const bx = util.el('div', 'rl-contact', row);
            const h = util.el('h4', '', bx);
            const av = util.el('span', 'rl-av', h, c.first[0] + c.last[0]);
            av.style.background = AV_COLORS[(c.first.charCodeAt(0) + c.last.charCodeAt(0)) % AV_COLORS.length];
            util.el('span', '', h, c.name);
            for (const prop of ['phone', 'email', 'address']) {
              const line = util.el('div', 'rl-prop', bx);
              util.el('span', '', line, { phone: 'Phone', email: 'Email', address: 'Address' }[prop]);
              const v = util.el('span', '', line);
              els.push(P.link(ctx, v, c, i, prop, picked.has(`${i}:${prop}`)));
            }
          }
    };
    BASE.name = (ctx, B, tr, c, i, picked, els) => {
      ctx.util.el('td', 'name', tr, c.name);
    };
    BASE.row = (ctx, B, tr, c, i, picked, els) => {
      P.name(ctx, B, tr, c, i, picked, els);
      for (const prop of D.props) els.push(P.link(ctx, ctx.util.el('td', '', tr), c, i, prop, picked.has(`${i}:${prop}`)));
    };
    BASE.searchParent = (ctx, B) => B.body;
    BASE.results = (ctx, B) => {
      return ctx.util.el('div', 'rl-results', B.body);
    };
    BASE.book = () => {};
    BASE.searchInput = () => {};
    BASE.searchBound = () => {};
    BASE.status = () => {};
    BASE.pager = () => {};
    BASE.header = () => {};
    BASE.rowsRendered = () => {};
    BASE.picked = () => {};
    BASE.footer = () => {};
    BASE.ready = () => {};

    ({ D, P } = env.templateDesign('find-fact/phone-book', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      render(ctx) {
        ctxRef = ctx;
        P.style();
        P.begin(ctx);
        frameRef = P.frame(ctx);
        const { app, work, room } = frameRef;
        const up = (patch) => ctx.update({ ...ctx.model, ...patch });
        P.framed(ctx, frameRef, up);
        view = P.build(ctx, work, up, room);
        P.rendered(ctx, frameRef, up);
        return { anchors: [app], sync: (m) => view.sync(m) };
      },
      locate(t) {
        const p = view && view.locate(t);
        if (!p) throw new Error(`find-fact/records cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    };
  }, { uses: ['find-fact/_style'] });
})();
