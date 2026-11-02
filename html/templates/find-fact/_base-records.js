/* find-fact/_base-records: reference builders. S is the live reference unit scope;
 * the wrappers in reference.js retain every design override and its original call order.
 * B holds one render's local state, shared by its setup, painting and interaction functions. */
(function () {
  'use strict';

  function buildTable(S, ctx, work, up, room) {
    const { spec, util, rng } = ctx;
    const sub = spec.kind === 'record' ? `ID ${rng.int(10000, 99999)}` : `${spec.rows.length} rows`;
    const { card: tc, body } = S.card(util, work, spec.title, sub);
    body.style.padding = '0';
    const cards = S.LOOK === 'cards';
    const striped = rng.bool(0.6);
    const pad = rng.pick(['6px', '7px', '8px']);
    const numeric = (c) => spec.kind === 'grid' && spec.cols[c].num;
    // cards: a record is one tile of label / value lines, a grid is one tile per row ("Column  value" lines
    // under the row's first cell as the title); every other look draws the table.
    const t = cards ? util.el('div', 'rl-tiles' + (spec.kind === 'record' ? ' kv' : ''), body)
      : S.table(util, body, 'rl-table' + (spec.kind === 'record' ? ' kv' : '') + (striped ? ' striped' : ''));
    t.style.setProperty('--rl-pad', pad);
    if (cards) {
      if (spec.kind === 'record') {
        const tile = util.el('div', 'rl-tile', t);
        spec.rows.forEach((r) => {
          const line = util.el('div', 'rl-tl', tile);
          util.el('span', 'k', line, r[0]);
          util.el('span', 'v', line, r[1]);
        });
      } else {
        spec.rows.forEach((r) => S.tileOf(util, t, spec.columns, r, numeric));
        // Tiles flow into columns of the card, so it needs a width of its own (up to four tiles wide).
        tc.style.width = Math.min(room.w, 4 * 222 + 28) + 'px';
      }
    } else {
      if (spec.kind === 'grid') {
        const tr = util.el('tr', '', util.el('thead', '', t));
        spec.columns.forEach((c, i) => util.el('th', numeric(i) ? 'num' : '', tr, c));
      }
      const tb = util.el('tbody', '', t);
      spec.rows.forEach((r) => {
        const tr = util.el('tr', '', tb);
        r.forEach((v, i) => util.el('td', (i === 0 ? 'key' : '') + (numeric(i) ? ' num' : ''), tr, v));
      });
    }
    const fields = S.answerForm(ctx, work, spec.fields.map((f) => f.label), ctx.model, (i, v) => {
      const answers = ctx.model.answers.slice();
      answers[i] = v;
      up({ answers });
    });
    tc.style.flex = 'none';
    const form = work.lastElementChild;
    // Too wide or too tall: compact table first, then a narrower answer card (so it goes beside the
    // table), then tighter rows, until the answer card ends inside the work area.
    const wr = () => work.getBoundingClientRect();
    const over = () => !S.fits(work, { w: room.w + 40, h: room.h + 32 }) || form.getBoundingClientRect().bottom > wr().bottom - 4
      || work.scrollHeight > work.clientHeight + 1 || work.scrollWidth > work.clientWidth + 1;
    if (over() || form.getBoundingClientRect().top > tc.getBoundingClientRect().top + 1) t.classList.add('compact');
    if (over()) form.classList.add('narrow');
    if (over()) room.grow();
    if (over()) t.classList.add('tight');
    // Tiles: last resort, a narrower card with the answer form beside it, tight tiles in more columns.
    if (cards && spec.kind === 'grid' && over()) {
      tc.style.width = Math.max(300, room.w - 244) + 'px';
      form.classList.add('narrow');
    }
    return {
      sync(m) { fields.forEach((f, i) => f.set(m.answers[i])); },
      locate: (tg) => (tg.field !== undefined && fields[tg.field] ? fields[tg.field].locate() : null),
    };
  }

  function buildFindWord(S, ctx, work, up, room) {
    const { spec, util, rng } = ctx;
    const title = rng.pick(['Daily reading', 'Passage', 'Excerpt', 'Field notes', 'Article', 'Memo']);
    const { card: rc, body } = S.card(util, work, title, spec.mode === 'nth' ? '1 paragraph' : `${spec.paragraphs.length} paragraphs`);
    rc.classList.add('rl-read');
    rc.style.maxWidth = Math.min(660, room.w) + 'px';
    for (const p of spec.paragraphs) util.el('p', '', body, p);
    const fields = S.answerForm(ctx, work, [null], ctx.model, (i, v) => up({ answers: [v] }));
    for (const fs of [16, 15, 14, 13]) {
      if (S.fits(work, { w: room.w + 40, h: room.h + 32 }) && work.scrollHeight <= work.clientHeight + 1) break;
      rc.style.setProperty('--rl-fs', fs + 'px');
    }
    return {
      sync(m) { fields[0].set(m.answers[0]); },
      locate: (tg) => (tg.field === 0 ? fields[0].locate() : null),
    };
  }

  function buildPhoneBook(S, ctx, work, up, room) {
    const B = { S, ctx, work, up, room };
    B.linkEl = (...args) => contactLink(B, ...args);
    B.paint = (...args) => paintPhoneBook(B, ...args);
    ({ spec: B.spec, util: B.util, rng: B.rng } = B.ctx);
    B.fam = B.S.env.taskDef;
    B.search = B.spec.mode === 'search';
    B.per = B.search ? B.spec.maxResults : B.spec.perPage;
    B.cardsFit = Math.floor((B.room.w - 30) / 292);
    B.asCards = B.per <= Math.min(3, B.cardsFit) && (B.per === 1 || B.rng.bool(0.6));
    ({ card: B.bc, body: B.body } = B.S.card(B.util, B.work, B.rng.pick(['Contact book', 'Address book', 'People']), `${B.spec.contacts.length} contacts`));
    B.bc.classList.add('rl-book');
    B.W = Math.min(B.asCards ? Math.max(B.per * 292, 560) : 860, B.room.w - 30);
    B.bc.style.width = B.W + 30 + 'px';
    B.searchField = null;
    if (B.search) {
      const box = B.util.el('div', 'rl-search', B.body);
      box.innerHTML = B.S.SEARCH_ICON;
      const inp = B.S.input(B.util, box, 'search', B.rng.pick(['Search contacts', 'Search by name', 'Find a person…']));
      B.searchField = B.S.env.ui.textField(inp, { value: B.ctx.model.query, label: 'search', onInput: (v) => { B.up({ query: v, page: 0 }); B.paint(); } });
    }
    B.status = B.util.el('div', 'rl-status', B.body);
    B.statusText = B.util.el('span', '', B.status);
    B.undoBtn = B.util.el('button', 'rl-undo', B.status, B.rng.pick(['Undo', 'Go back', 'Undo action']));
    B.undoBtn.type = 'button';
    B.undoBtn.dataset.role = 'undo';
    B.undo = B.S.env.ui.buttons([B.undoBtn], {
      keys: ['undo'],
      label: 'undo',
      onClick() {
        const m = B.ctx.model;
        if (!B.fam.helpers.wrongPick(m, B.spec)) return;
        const picks = m.picks.filter((p) => p.contact === B.spec.target && p.prop === B.spec.prop);
        B.up({ picks });
        B.paint();
      },
    });
    B.results = B.util.el('div', 'rl-results', B.body);
    B.rowH = B.room.h < 420 ? 34 : 39;
    B.cardH = 150;
    B.results.style.height = (B.asCards ? B.cardH : 34 + B.per * B.rowH) + 'px';
    B.results.style.width = B.W + 'px';
    B.foot = B.util.el('div', '', B.body);
    B.foot.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px';
    B.count = null;
    B.pager = null;
    B.pinfo = null;
    B.pageEls = [];
    if (B.search) B.count = B.util.el('div', 'rl-count', B.foot);
    else {
      const n = B.fam.helpers.pageCount(B.spec);
      const nav = B.util.el('div', 'rl-pager', B.foot);
      const btn = (label, key) => {
        const b = B.S.pagerEl(B.util, nav, B.S.LOOK === 'portal' ? { '‹ Prev': '<< Prev', 'Next ›': 'Next >>' }[label] || `[${label}]` : label);
        b.dataset.key = key;
        b.dataset.role = 'pager';
        B.pageEls.push(b);
        return b;
      };
      btn('‹ Prev', 'prev');
      if (B.spec.pager === 'numbers') for (let p = 0; p < n; p++) btn(String(p + 1), `p${p}`);
      else B.pinfo = B.util.el('span', 'rl-pinfo', nav);
      btn('Next ›', 'next');
      B.count = B.util.el('div', 'rl-count', B.foot);
      B.pager = B.S.env.ui.buttons(B.pageEls, {
        label: 'pager',
        mark: () => {},
        onClick(key) {
          const m = B.ctx.model;
          let page = m.page;
          if (key === 'prev') page = Math.max(0, page - 1);
          else if (key === 'next') page = Math.min(n - 1, page + 1);
          else page = Number(key.slice(1));
          if (page !== m.page) {
            B.up({ page });
            B.paint();
          }
        },
      });
    }
    B.links = null;
    B.initials = (c) => c.first[0] + c.last[0];
    B.paint();
    if (B.pageEls.length && B.foot.scrollWidth > B.foot.clientWidth + 1) for (const b of B.pageEls) { b.style.minWidth = '26px'; b.style.padding = '0 6px'; }
    return {
      sync(m) {
        if (B.searchField) B.searchField.set(m.query);
        B.paint();
      },
      locate(t) {
        if (t.search) return B.searchField && B.searchField.locate();
        if (t.undo) return B.undo.locate('undo');
        if (t.page !== undefined) return B.pager && B.pager.locate(`p${t.page}`);
        if (t.pager) return B.pager && B.pager.locate(t.pager);
        if (t.contact !== undefined) return B.links && B.links.locate(`${t.contact}:${t.prop}`);
        return null;
      },
    };
  }

  function contactLink(B, parent, c, i, prop, clicked) {
    const a = B.util.el('span', 'rl-link', parent, c[prop]);
    a.dataset.key = `${i}:${prop}`;
    a.dataset.role = 'link';
    if (clicked) a.setAttribute('data-clicked', 'true');
    return a;
  }

  function paintPhoneBook(B) {
    const m = B.ctx.model;
    const idx = B.fam.helpers.shown(m, B.spec);
    B.results.replaceChildren();
    const picked = new Set(m.picks.map((p) => `${p.contact}:${p.prop}`));
    const els = [];
    if (!idx.length) B.util.el('div', 'rl-empty', B.results, 'No contacts match your search.');
    else if (B.asCards) {
      const row = B.util.el('div', 'rl-cards', B.results);
      for (const i of idx) {
        const c = B.spec.contacts[i];
        const bx = B.util.el('div', 'rl-contact', row);
        const h = B.util.el('h4', '', bx);
        const av = B.util.el('span', 'rl-av', h, B.initials(c));
        av.style.background = B.S.AV_COLORS[(c.first.charCodeAt(0) + c.last.charCodeAt(0)) % B.S.AV_COLORS.length];
        B.util.el('span', '', h, c.name);
        for (const prop of ['phone', 'email', 'address']) {
          const line = B.util.el('div', 'rl-prop', bx);
          B.util.el('span', '', line, { phone: 'Phone', email: 'Email', address: 'Address' }[prop]);
          const v = B.util.el('span', '', line);
          els.push(B.linkEl(v, c, i, prop, picked.has(`${i}:${prop}`)));
        }
      }
    } else {
      const t = B.S.table(B.util, B.results, 'rl-table rl-rows' + (B.room.h < 420 ? ' compact' : ''));
      t.style.width = '100%';
      t.style.tableLayout = 'fixed';
      const tr0 = B.util.el('tr', '', B.util.el('thead', '', t));
      ['Name', 'Phone', 'Email', 'Address'].forEach((h, k) => {
        const th = B.util.el('th', '', tr0, h);
        th.style.width = ['24%', '20%', '30%', '26%'][k];
      });
      const tb = B.util.el('tbody', '', t);
      for (const i of idx) {
        const c = B.spec.contacts[i];
        const tr = B.util.el('tr', '', tb);
        B.util.el('td', 'name', tr, c.name);
        for (const prop of ['phone', 'email', 'address']) els.push(B.linkEl(B.util.el('td', '', tr), c, i, prop, picked.has(`${i}:${prop}`)));
      }
    }
    B.links = B.S.env.ui.buttons(els, {
      label: 'contact',
      onClick(key) {
        const [ci, prop] = key.split(':');
        const pick = { contact: Number(ci), prop };
        const wrong = pick.contact !== B.spec.target || pick.prop !== B.spec.prop;
        B.up({ picks: B.ctx.model.picks.concat([pick]), wrongs: (B.ctx.model.wrongs || 0) + (wrong ? 1 : 0) });
        B.paint();
      },
      point: (el) => B.S.firstBox(el),
    });
    // Status strip: the last pick.
    const last = m.picks[m.picks.length - 1];
    const bad = B.fam.helpers.wrongPick(m, B.spec);
    B.status.className = 'rl-status' + (bad ? ' bad' : last ? ' ok' : '');
    if (last) {
      const c = B.spec.contacts[last.contact];
      B.statusText.textContent = `Opened ${c.first}’s ${B.fam.helpers.PROPS[last.prop]}: ${c[last.prop]}`;
    } else B.statusText.textContent = B.search ? 'Search by first or last name.' : 'Click a phone number, email or address to open it.';
    B.undoBtn.style.visibility = bad && B.spec.recoverable ? 'visible' : 'hidden';
    if (B.search) {
      const total = B.spec.contacts.filter((c) => c.name.toLowerCase().includes(String(m.query).trim().replace(/\s+/g, ' ').toLowerCase())).length;
      B.count.textContent = total ? `Showing ${idx.length} of ${total} contact${total === 1 ? '' : 's'}` : '';
    } else {
      const n = B.fam.helpers.pageCount(B.spec);
      if (B.pinfo) B.pinfo.textContent = `Page ${m.page + 1} of ${n}`;
      B.count.textContent = `${m.page * B.spec.perPage + 1}–${Math.min(B.spec.contacts.length, (m.page + 1) * B.spec.perPage)} of ${B.spec.contacts.length}`;
      for (const b of B.pageEls) {
        const k = b.dataset.key;
        b.classList.toggle('on', k === `p${m.page}`);
        const off = (k === 'prev' && m.page === 0) || (k === 'next' && m.page === n - 1);
        if (b.tagName === 'BUTTON') b.disabled = off;
        else b.classList.toggle('off', off);
      }
    }
  }

  function buildSimilar(S, ctx, work, up, room) {
    const { spec, util, rng } = ctx;
    const { card: c, body } = S.card(util, work, rng.pick(['Word list', 'Synonym check', 'Vocabulary']), `${spec.words.length} words`);
    c.style.minWidth = '300px';
    const tiles = rng.bool(0.45);
    const rowsFit = Math.floor((room.h - 110) / (tiles ? 42 : 38));
    const cols = spec.words.length > rowsFit || (spec.words.length > 4 && rng.bool(0.6)) ? 2 : 1;
    if (rng.bool(0.6)) util.el('div', 'rl-hint', body, rng.pick(['Tick every word that means the same as one of the words in the task.', 'Check all synonyms that apply.', 'Select the matching words.']));
    const grid = util.el('div', 'rl-words' + (tiles ? ' tiles' : ''), body);
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(150px, max-content))`;
    if (tiles) grid.style.gap = '8px 12px';
    const labels = {};
    const inputs = spec.words.map((w) => {
      const lab = util.el('label', 'rl-cb', grid);
      lab.dataset.role = 'option';
      const inp = util.el('input', '', lab);
      inp.type = 'checkbox';
      inp.value = w.text;
      util.el('span', '', lab, w.text);
      labels[w.text] = lab;
      return [w.text, inp];
    });
    const ch = S.env.ui.choices(inputs, {
      label: 'word',
      multi: true,
      values: ctx.model.values,
      onChange(values) {
        const order = spec.words.map((w) => w.text);
        up({ values: order.filter((x) => values.includes(x)) });
        mark(ctx.model);
      },
    });
    function mark(m) {
      for (const w of spec.words) labels[w.text].classList.toggle('on', m.values.includes(w.text));
    }
    mark(ctx.model);
    return {
      sync(m) { ch.set(m.values); mark(m); },
      locate: (t) => (t.word !== undefined ? ch.locate(t.word) : null),
    };
  }

  function buildJoin(S, ctx, work, up, room) {
    const { spec, util, rng } = ctx;
    const strip = util.el('div', 'rl-strip', work);
    const lab = util.el('label', '', strip, rng.pick(['Answer', 'Your answer', 'Result']));
    const inp = S.input(util, strip, 'field', rng.pick(['Type the value', '', 'Answer']));
    inp.id = 'rl-jans';
    lab.htmlFor = inp.id;
    util.el('span', 'rl-count', strip, rng.pick(['Linked by ID', 'Two related tables', '']));
    const field = S.env.ui.textField(inp, { value: ctx.model.answers[0], label: 'answer0', onInput: (v) => up({ answers: [v] }) });
    const sides = rng.bool(0.5) ? [spec.left, spec.right] : [spec.right, spec.left];
    const tables = sides.map((s) => {
      const { card: c, body } = S.card(util, work, s.title, `${s.rows.length} rows`);
      body.style.padding = '0';
      c.style.flex = '0 1 auto';
      const t = S.table(util, body, 'rl-table' + (rng.bool(0.5) ? ' striped' : ''));
      const tr0 = util.el('tr', '', util.el('thead', '', t));
      s.cols.forEach((h) => util.el('th', '', tr0, h));
      const tb = util.el('tbody', '', t);
      s.rows.forEach((r) => {
        const tr = util.el('tr', '', tb);
        r.forEach((v, i) => util.el('td', i === 0 ? 'key' : '', tr, v));
      });
      return { c, t };
    });
    const over = () => !S.fits(work, { w: room.w + 40, h: room.h + 32 }) || work.scrollHeight > work.clientHeight + 1
      || tables[1].c.getBoundingClientRect().top > tables[0].c.getBoundingClientRect().top + 1;
    if (over()) tables.forEach(({ t }) => t.classList.add('compact'));
    if (over()) tables.forEach(({ t }) => { t.style.fontSize = '12px'; for (const td of t.querySelectorAll('td')) td.style.padding = '3px 6px'; });
    return {
      sync(m) { field.set(m.answers[0]); },
      locate: (tg) => (tg.field === 0 ? field.locate() : null),
    };
  }

  env.template('find-fact/_base-records', () => ({ buildTable, buildFindWord, buildPhoneBook, buildSimilar, buildJoin }));
})();
