/* find-fact/_base-find: reference builders. S is the live reference unit scope;
 * the wrappers in reference.js retain every design override and its original call order.
 * B holds one render's local state, shared by its setup, painting and interaction functions. */
(function () {
  'use strict';

  function buildTooltip(S, ctx, work, up, room) {
    const { spec, util, rng } = ctx;
    const icon = spec.mode === 'icon';
    const { card: tc, body } = S.card(util, work, spec.title, icon ? `${spec.rows.length} items` : rng.pick(['shared', 'draft', 'last week']));
    body.style.position = 'relative';
    if (icon) body.style.padding = '0';
    const targets = [];
    if (icon) {
      const t = S.table(util, body, 'rl-table');
      const hr = util.el('tr', '', t);
      spec.columns.forEach((c) => util.el('th', '', hr, c));
      util.el('th', '', hr, '');
      spec.rows.forEach((row) => {
        const tr = util.el('tr', '', t);
        row.cells.forEach((c) => util.el('td', '', tr, c));
        const td = util.el('td', '', tr);
        td.style.width = '40px';
        const i = util.el('span', 'rl-info', td);
        i.innerHTML = S.INFO_ICON;
        i.dataset.role = 'info';
        targets.push(i);
      });
    } else {
      tc.style.maxWidth = Math.min(620, room.w) + 'px';
      const ul = util.el('ul', 'rl-notes', body);
      spec.notes.forEach((line) => {
        const li = util.el('li', '', ul);
        for (const seg of line) {
          if (seg.abbr === undefined) { li.append(seg.text); continue; }
          const a = util.el('span', 'rl-abbr', li, spec.abbrs[seg.abbr].abbr);
          a.dataset.role = 'abbr';
          targets[seg.abbr] = a;
        }
      });
    }
    const tip = util.el('div', 'rl-ttip', body);
    tip.hidden = true;
    const show = (i) => {
      tip.textContent = '';
      if (icon) {
        spec.rows[i].tip.forEach(([l, v], k) => {
          if (k) util.el('br', '', tip);
          util.el('b', '', tip, l);
          tip.append(v);
        });
      } else tip.textContent = spec.abbrs[i].full;
      tip.hidden = false;
      const br = body.getBoundingClientRect();
      const r = targets[i].getBoundingClientRect();
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      let x = icon ? r.left - br.left - tw - 8 : r.left - br.left + r.width / 2 - tw / 2;
      let y = icon ? r.top - br.top + r.height / 2 - th / 2 : r.bottom - br.top + 6;
      x = Math.max(4, Math.min(br.width - tw - 4, x));
      if (y + th > br.height - 2 && !icon) y = r.top - br.top - th - 6;
      y = Math.max(2, Math.min(br.height - th - 2, y));
      tip.style.left = Math.round(x) + 'px';
      tip.style.top = Math.round(y) + 'px';
    };
    targets.forEach((el, i) => {
      el.addEventListener('pointerenter', () => {
        el.classList.add('on');
        show(i);
        S.env.log('hover', { what: icon ? 'info' : 'abbr', key: i });
        if (ctx.model.hover !== i) up({ hover: i });
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('on');
        tip.hidden = true;
      });
    });
    const fields = S.answerForm(ctx, work, [null], ctx.model, (i, v) => up({ answers: [v] }));
    return {
      sync(m) { fields[0].set(m.answers[0]); },
      locate(tg) {
        if (tg.field === 0) return fields[0].locate();
        if (tg.tip !== undefined) return S.firstBox(targets[tg.tip]);
        return null;
      },
    };
  }

  function buildFind(S, ctx, work, up, room) {
    const B = { S, ctx, work, up, room };
    B.placeThumb = (...args) => placeFindThumb(B, ...args);
    B.openFind = (...args) => openFindBar(B, ...args);
    B.step = (...args) => stepFindMatch(B, ...args);
    B.paint = (...args) => paintFindDocument(B, ...args);
    B.toCur = (...args) => scrollToFindMatch(B, ...args);
    setupFindDocument(B);
    B.sp = B.S.env.ui.scrollPane(B.pane, { thumb: B.thumb, track: B.track, onScroll: () => B.placeThumb() });
    B.findField = B.S.env.ui.textField(B.finp, { value: B.ctx.model.find.query, label: 'find', onInput: (v) => B.setFind({ query: v, cur: 0 }, true) });
    B.setFind = (patch, scroll) => {
      B.up({ find: { ...B.ctx.model.find, ...patch } });
      B.paint();
      if (scroll) B.toCur();
    };
    B.finp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); B.step(e.shiftKey ? -1 : 1); }
      else if (e.key === 'Escape') { e.preventDefault(); B.setFind({ open: false }); }
    });
    if (B.S.findKeys) document.removeEventListener('keydown', B.S.findKeys);
    B.S.findKeys = (e) => {
      if (!B.dc.isConnected || e.altKey || !(e.ctrlKey || e.metaKey) || (e.key !== 'f' && e.key !== 'F')) return;
      e.preventDefault();
      B.openFind();
    };
    document.addEventListener('keydown', B.S.findKeys);
    B.allOpen = () => B.spec.sections.every((sec, s) => !sec.fold || B.ctx.model.expanded.includes(s));
    B.btns = B.S.env.ui.buttons([B.findBtn, ...(B.expandBtn ? [B.expandBtn] : []), ...B.fbtns, ...B.secs.filter((x) => x.chev).map((x) => x.h)], {
      label: 'find',
      mark: () => {},
      onClick(key) {
        const f = B.ctx.model.find;
        if (key === 'open') B.openFind();
        else if (key === 'case') B.setFind({ mcase: !f.mcase, cur: 0 }, true);
        else if (key === 'whole') B.setFind({ whole: !f.whole, cur: 0 }, true);
        else if (key === 'next' || key === 'prev') B.step(key === 'next' ? 1 : -1);
        else if (key === 'close') B.setFind({ open: false });
        else if (key === 'expand') {
          B.up({ expanded: B.allOpen() ? [] : B.spec.sections.map((sec, s) => (sec.fold ? s : -1)).filter((s) => s >= 0) });
          B.paint();
        } else if (key[0] === 's') {
          const s = Number(key.slice(1));
          const ex = B.ctx.model.expanded;
          B.up({ expanded: ex.includes(s) ? ex.filter((x) => x !== s) : ex.concat(s).sort((a, b) => a - b) });
          B.paint();
        }
      },
    });
    B.paint();
    if (B.ctx.model.find.open) B.toCur();
    B.at = (el) => {
      const r = el.getBoundingClientRect();
      return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null;
    };
    return {
      sync(m) {
        B.field.set(m.answers[0]);
        B.findField.set(m.find.query);
        B.paint();
      },
      locate(tg) {
        if (tg.field === 0) return B.field.locate();
        if (tg.find) return B.findField.locate();
        if (tg.findOpen) return B.btns.locate('open');
        if (tg.findCase) return B.btns.locate('case');
        if (tg.findWhole) return B.btns.locate('whole');
        if (tg.findNext) return B.btns.locate('next');
        if (tg.expandAll) return B.expandBtn && B.btns.locate('expand');
        if (tg.doc) return B.at(B.pane);
        return null;
      },
    };
  }

  function placeFindThumb(B) {
    const th = B.track.clientHeight;
    const ratio = B.pane.clientHeight / Math.max(1, B.pane.scrollHeight);
    const h = Math.max(24, Math.min(th, th * ratio));
    const max = B.sp.max();
    B.thumb.style.height = h + 'px';
    B.thumb.style.top = (max > 0 ? (B.sp.get() / max) * (th - h) : 0) + 'px';
    B.thumb.style.display = ratio >= 1 ? 'none' : '';
  }

  function openFindBar(B) {
    if (!B.ctx.model.find.open) B.setFind({ open: true });
    B.finp.focus();
    B.finp.select();
  }

  function stepFindMatch(B, d) {
    const n = B.fam.helpers.findMatches(B.ctx.model, B.spec).length;
    if (n) B.setFind({ cur: (B.fam.helpers.findCur(B.ctx.model, n) + d + n) % n }, true);
  }

  function paintFindDocument(B) {
    const m = B.ctx.model;
    const f = m.find;
    B.bar.style.display = f.open ? '' : 'none';
    for (const [b, on] of [[B.caseBtn, f.mcase], [B.wholeBtn, f.whole]]) {
      b.classList.toggle('on', !!on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (B.expandBtn) B.expandBtn.lastChild.textContent = B.expandLabels[B.allOpen() ? 1 : 0];
    B.secs.forEach((x, s) => {
      if (!x.chev) return;
      const open = m.expanded.includes(s);
      x.sb.style.display = open ? '' : 'none';
      x.chev.textContent = open ? '▾' : '▸';
      x.h.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    const ms = B.fam.helpers.findMatches(m, B.spec);
    const cur = B.fam.helpers.findCur(m, ms.length);
    const by = new Map();
    ms.forEach((x, i) => {
      const k = `${x.s}:${x.b}`;
      if (!by.has(k)) by.set(k, []);
      by.get(k).push([x.at, x.len, i === cur]);
    });
    B.secs.forEach((x, s) => x.els.forEach((el, b) => {
      const hits = by.get(`${s}:${b}`);
      if (!hits && !el.dataset.marked) return;
      const text = b === 0 ? B.spec.sections[s].heading : B.spec.sections[s].paras[b - 1].join(' ');
      el.replaceChildren();
      let pos = 0;
      for (const [at, len, isCur] of hits || []) {
        if (at > pos) el.append(document.createTextNode(text.slice(pos, at)));
        B.util.el('mark', isCur ? 'rl-hl cur' : 'rl-hl', el, text.slice(at, at + len));
        pos = at + len;
      }
      if (pos < text.length) el.append(document.createTextNode(text.slice(pos)));
      if (hits) el.dataset.marked = '1';
      else delete el.dataset.marked;
    }));
    B.counter.textContent = !f.query ? '' : ms.length ? `${cur + 1}${B.ofWord}${ms.length}` : B.noneText;
    B.placeThumb();
  }

  function scrollToFindMatch(B) {
    const mk = B.pane.querySelector('mark.cur');
    if (!mk) return;
    const pr = B.pane.getBoundingClientRect();
    const r = mk.getBoundingClientRect();
    if (r.top < pr.top + B.bar.offsetHeight + 16 || r.bottom > pr.bottom - 8) B.sp.to(B.sp.get() + (r.top - pr.top) - pr.height / 3);
  }

  function setupFindDocument(B) {
    ({ spec: B.spec, util: B.util, rng: B.rng } = B.ctx);
    B.fam = B.S.env.taskDef;
    B.beside = B.room.w >= 860;
    B.work.style.flexWrap = 'nowrap';
    ({ card: B.dc, body: B.body } = B.S.card(B.util, B.work, B.spec.title, `${B.spec.sections.length} sections`));
    B.dc.classList.add('rl-doc');
    B.dc.style.width = (B.beside ? B.room.w - 300 - 20 : B.room.w) + 'px';
    B.dc.style.height = B.room.h + 'px';
    B.body.style.padding = '0';
    B.tools = B.util.el('div', 'rl-tools', B.body);
    B.tbtn = (key, label) => {
      const b = B.util.el('button', 'rl-tbtn', B.tools);
      b.type = 'button';
      b.dataset.key = key;
      if (key === 'open') b.innerHTML = B.S.SEARCH_ICON;
      B.util.el('span', '', b, label);
      return b;
    };
    B.findBtn = B.tbtn('open', B.rng.pick(['Find', 'Search', 'Find in page']));
    B.findBtn.title = 'Find (Ctrl+F)';
    B.expandLabels = B.rng.pick([['Expand all', 'Collapse all'], ['Show all sections', 'Hide sections'], ['Open all', 'Close all']]);
    B.expandBtn = B.spec.collapsed ? B.tbtn('expand', B.expandLabels[0]) : null;
    B.tip = B.rng.pick(['Tip: press Ctrl+F to search this page.', 'Ctrl+F finds text in this document.', '', '']);
    if (B.tip) B.util.el('span', 'rl-count', B.tools, B.tip);
    B.wrap = B.util.el('div', 'rl-dwrap', B.body);
    B.pane = B.util.el('div', 'rl-dpane', B.wrap);
    B.pane.dataset.role = 'document';
    B.pane.style.setProperty('--rl-fs', B.rng.pick(['14.5px', '15px', '16px']));
    B.track = B.util.el('div', 'rl-vbar', B.wrap);
    B.track.dataset.role = 'scrollbar';
    B.thumb = B.util.el('div', 'rl-vthumb', B.track);
    B.thumb.dataset.role = 'thumb';
    B.secs = B.spec.sections.map((sec, s) => {
      const se = B.util.el('section', 'rl-sec', B.pane);
      const h = B.util.el(sec.fold ? 'button' : 'h4', 'rl-sech', se);
      let chev = null;
      if (sec.fold) {
        h.type = 'button';
        h.dataset.key = `s${s}`;
        chev = B.util.el('span', 'rl-chev', h, '▸');
      }
      const els = [B.util.el('span', '', h, sec.heading)];
      const sb = B.util.el('div', 'rl-secb', se);
      sec.paras.forEach((p) => els.push(B.util.el('p', '', sb, p.join(' '))));
      return { h, chev, sb, els };
    });
    B.bar = B.util.el('div', 'rl-findbar', B.wrap);
    B.sbox = B.util.el('div', 'rl-search', B.bar);
    B.sbox.innerHTML = B.S.SEARCH_ICON;
    B.finp = B.S.input(B.util, B.sbox, 'find', B.rng.pick(['Find in document', 'Search this page', 'Find…']));
    B.finp.setAttribute('aria-label', 'Find in document');
    B.counter = B.util.el('span', 'rl-fcount', B.bar);
    B.fbtn = (key, label, title) => {
      const b = B.util.el('button', 'rl-fbtn', B.bar, label);
      b.type = 'button';
      b.dataset.key = key;
      b.title = title;
      b.setAttribute('aria-label', title);
      return b;
    };
    B.caseBtn = B.fbtn('case', 'Aa', 'Match case');
    B.wholeBtn = B.fbtn('whole', 'ab', 'Match whole word');
    B.wholeBtn.classList.add('whole');
    B.fbtns = [B.caseBtn, B.wholeBtn, B.fbtn('prev', '▲', 'Previous match'), B.fbtn('next', '▼', 'Next match'), B.fbtn('close', '✕', 'Close')];
    B.ofWord = B.rng.pick([' of ', '/']);
    B.noneText = B.rng.pick(['No results', '0 of 0', 'Not found']);
    B.field = undefined;
    if (B.beside) {
      [B.field] = B.S.answerForm(B.ctx, B.work, [null], B.ctx.model, (i, v) => B.up({ answers: [v] }));
    } else {
      const foot = B.util.el('div', 'rl-gfoot', B.body);
      const ans = B.util.el('div', 'rl-ans', foot);
      const al = B.util.el('label', '', ans, B.rng.pick(['Answer', 'Your answer', 'Result']));
      const ainp = B.S.input(B.util, ans, 'field', B.rng.pick(['Type the answer', '', 'Answer']));
      ainp.id = 'rl-fans';
      al.htmlFor = ainp.id;
      B.field = B.S.env.ui.textField(ainp, { value: B.ctx.model.answers[0], label: 'answer0', onInput: (v) => B.up({ answers: [v] }) });
    }
  }

  env.template('find-fact/_base-find', () => ({ buildTooltip, buildFind }));
})();
