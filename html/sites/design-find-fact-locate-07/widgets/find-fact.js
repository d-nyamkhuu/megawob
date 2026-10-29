// Design on templates/find-fact/base.js: the base site's find-fact widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-locate-07',
  name: 'design',
  split: 'train',
  scenarios: ['locate'],
  template: 'find-fact/base',
  design: {
    parts: {
      'buildFind': (base, S) => function buildFind(ctx, work, up, room) {
        const { SEARCH_ICON, answerForm, card, env, input } = S;
        const { spec, util, rng } = ctx;
        const fam = env.taskDef;
        const beside = room.w >= 860; // the answer card beside the document, else a footer strip in it
        work.style.flexWrap = 'nowrap';
        // A compact document index keeps the source's sections discoverable above the answer strip.
        const index = util.el('section', 'rl-index', work);
        const indexTable = util.el('table', 'rl-index-table', index);
        const indexHead = util.el('thead', '', indexTable);
        const headRow = util.el('tr', '', indexHead);
        ['Name', 'Type', 'Location'].forEach((label) => util.el('th', '', headRow, label));
        const indexBody = util.el('tbody', '', indexTable);
        spec.sections.slice(0, 5).forEach((sec) => {
          const row = util.el('tr', '', indexBody);
          util.el('td', '', row, sec.heading);
          util.el('td', '', row, 'Guide section');
          util.el('td', '', row, 'Parks Guide');
        });
        const { card: dc, body } = card(util, work, spec.title, `${spec.sections.length} sections`);
        dc.classList.add('rl-doc');
        dc.style.width = (beside ? room.w - 300 - 20 : room.w) + 'px';
        dc.style.height = room.h + 'px';
        body.style.padding = '0';

        const tools = util.el('div', 'rl-tools', body);
        const tbtn = (key, label) => {
          const b = util.el('button', 'rl-tbtn', tools);
          b.type = 'button';
          b.dataset.key = key;
          if (key === 'open') b.innerHTML = SEARCH_ICON;
          util.el('span', '', b, label);
          return b;
        };
        const findBtn = tbtn('open', rng.pick(['Find', 'Search', 'Find in page']));
        findBtn.title = 'Find (Ctrl+F)';
        const expandLabels = rng.pick([['Expand all', 'Collapse all'], ['Show all sections', 'Hide sections'], ['Open all', 'Close all']]);
        const expandBtn = spec.collapsed ? tbtn('expand', expandLabels[0]) : null;
        const tip = rng.pick(['Tip: press Ctrl+F to search this page.', 'Ctrl+F finds text in this document.', '', '']);
        if (tip) util.el('span', 'rl-count', tools, tip);

        const wrap = util.el('div', 'rl-dwrap', body);
        const pane = util.el('div', 'rl-dpane', wrap);
        pane.dataset.role = 'document';
        pane.style.setProperty('--rl-fs', rng.pick(['14.5px', '15px', '16px']));
        const track = util.el('div', 'rl-vbar', wrap);
        track.dataset.role = 'scrollbar';
        const thumb = util.el('div', 'rl-vthumb', track);
        thumb.dataset.role = 'thumb';
        // Sections: a heading (a toggle button when the section folds) and its paragraphs; els[b] is block b's element.
        const secs = spec.sections.map((sec, s) => {
          const se = util.el('section', 'rl-sec', pane);
          const h = util.el(sec.fold ? 'button' : 'h4', 'rl-sech', se);
          let chev = null;
          if (sec.fold) {
            h.type = 'button';
            h.dataset.key = `s${s}`;
            chev = util.el('span', 'rl-chev', h, '▸');
          }
          const els = [util.el('span', '', h, sec.heading)];
          const sb = util.el('div', 'rl-secb', se);
          sec.paras.forEach((p) => els.push(util.el('p', '', sb, p.join(' '))));
          return { h, chev, sb, els };
        });

        // The find bar floats over the top right of the document, as a browser's does.
        const bar = util.el('div', 'rl-findbar', wrap);
        const sbox = util.el('div', 'rl-search', bar);
        sbox.innerHTML = SEARCH_ICON;
        const finp = input(util, sbox, 'find', rng.pick(['Find in document', 'Search this page', 'Find…']));
        finp.setAttribute('aria-label', 'Find in document');
        const counter = util.el('span', 'rl-fcount', bar);
        const fbtn = (key, label, title) => {
          const b = util.el('button', 'rl-fbtn', bar, label);
          b.type = 'button';
          b.dataset.key = key;
          b.title = title;
          b.setAttribute('aria-label', title);
          return b;
        };
        const caseBtn = fbtn('case', 'Aa', 'Match case');
        const wholeBtn = fbtn('whole', 'ab', 'Match whole word');
        wholeBtn.classList.add('whole');
        const fbtns = [caseBtn, wholeBtn, fbtn('prev', '▲', 'Previous match'), fbtn('next', '▼', 'Next match'), fbtn('close', '✕', 'Close')];
        const ofWord = rng.pick([' of ', '/']);
        const noneText = rng.pick(['No results', '0 of 0', 'Not found']);

        let field;
        if (beside) {
          [field] = answerForm(ctx, work, [null], ctx.model, (i, v) => up({ answers: [v] }));
        } else {
          const foot = util.el('div', 'rl-gfoot', body);
          const ans = util.el('div', 'rl-ans', foot);
          const al = util.el('label', '', ans, rng.pick(['Answer', 'Your answer', 'Result']));
          const ainp = input(util, ans, 'field', rng.pick(['Type the answer', '', 'Answer']));
          ainp.id = 'rl-fans';
          al.htmlFor = ainp.id;
          field = env.ui.textField(ainp, { value: ctx.model.answers[0], label: 'answer0', onInput: (v) => up({ answers: [v] }) });
        }

        const sp = env.ui.scrollPane(pane, { thumb, track, onScroll: () => placeThumb() });
        function placeThumb() {
          const th = track.clientHeight;
          const ratio = pane.clientHeight / Math.max(1, pane.scrollHeight);
          const h = Math.max(24, Math.min(th, th * ratio));
          const max = sp.max();
          thumb.style.height = h + 'px';
          thumb.style.top = (max > 0 ? (sp.get() / max) * (th - h) : 0) + 'px';
          thumb.style.display = ratio >= 1 ? 'none' : '';
        }
        const findField = env.ui.textField(finp, { value: ctx.model.find.query, label: 'find', onInput: (v) => setFind({ query: v, cur: 0 }, true) });
        const setFind = (patch, scroll) => {
          up({ find: { ...ctx.model.find, ...patch } });
          paint();
          if (scroll) toCur();
        };
        function openFind() {
          if (!ctx.model.find.open) setFind({ open: true });
          finp.focus();
          finp.select();
        }
        function step(d) {
          const n = fam.helpers.findMatches(ctx.model, spec).length;
          if (n) setFind({ cur: (fam.helpers.findCur(ctx.model, n) + d + n) % n }, true);
        }
        finp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
          else if (e.key === 'Escape') { e.preventDefault(); setFind({ open: false }); }
        });
        if (S.findKeys) document.removeEventListener('keydown', S.findKeys);
        S.findKeys = (e) => {
          if (!dc.isConnected || e.altKey || !(e.ctrlKey || e.metaKey) || (e.key !== 'f' && e.key !== 'F')) return;
          e.preventDefault();
          openFind();
        };
        document.addEventListener('keydown', S.findKeys);
        const allOpen = () => spec.sections.every((sec, s) => !sec.fold || ctx.model.expanded.includes(s));
        const btns = env.ui.buttons([findBtn, ...(expandBtn ? [expandBtn] : []), ...fbtns, ...secs.filter((x) => x.chev).map((x) => x.h)], {
          label: 'find',
          mark: () => {},
          onClick(key) {
            const f = ctx.model.find;
            if (key === 'open') openFind();
            else if (key === 'case') setFind({ mcase: !f.mcase, cur: 0 }, true);
            else if (key === 'whole') setFind({ whole: !f.whole, cur: 0 }, true);
            else if (key === 'next' || key === 'prev') step(key === 'next' ? 1 : -1);
            else if (key === 'close') setFind({ open: false });
            else if (key === 'expand') {
              up({ expanded: allOpen() ? [] : spec.sections.map((sec, s) => (sec.fold ? s : -1)).filter((s) => s >= 0) });
              paint();
            } else if (key[0] === 's') {
              const s = Number(key.slice(1));
              const ex = ctx.model.expanded;
              up({ expanded: ex.includes(s) ? ex.filter((x) => x !== s) : ex.concat(s).sort((a, b) => a - b) });
              paint();
            }
          },
        });

        // Highlights are rebuilt as text nodes and <mark>s (no HTML from the text).
        function paint() {
          const m = ctx.model;
          const f = m.find;
          bar.style.display = f.open ? '' : 'none';
          for (const [b, on] of [[caseBtn, f.mcase], [wholeBtn, f.whole]]) {
            b.classList.toggle('on', !!on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
          }
          if (expandBtn) expandBtn.lastChild.textContent = expandLabels[allOpen() ? 1 : 0];
          secs.forEach((x, s) => {
            if (!x.chev) return;
            const open = m.expanded.includes(s);
            x.sb.style.display = open ? '' : 'none';
            x.chev.textContent = open ? '▾' : '▸';
            x.h.setAttribute('aria-expanded', open ? 'true' : 'false');
          });
          const ms = fam.helpers.findMatches(m, spec);
          const cur = fam.helpers.findCur(m, ms.length);
          const by = new Map();
          ms.forEach((x, i) => {
            const k = `${x.s}:${x.b}`;
            if (!by.has(k)) by.set(k, []);
            by.get(k).push([x.at, x.len, i === cur]);
          });
          secs.forEach((x, s) => x.els.forEach((el, b) => {
            const hits = by.get(`${s}:${b}`);
            if (!hits && !el.dataset.marked) return;
            const text = b === 0 ? spec.sections[s].heading : spec.sections[s].paras[b - 1].join(' ');
            el.replaceChildren();
            let pos = 0;
            for (const [at, len, isCur] of hits || []) {
              if (at > pos) el.append(document.createTextNode(text.slice(pos, at)));
              util.el('mark', isCur ? 'rl-hl cur' : 'rl-hl', el, text.slice(at, at + len));
              pos = at + len;
            }
            if (pos < text.length) el.append(document.createTextNode(text.slice(pos)));
            if (hits) el.dataset.marked = '1';
            else delete el.dataset.marked;
          }));
          counter.textContent = !f.query ? '' : ms.length ? `${cur + 1}${ofWord}${ms.length}` : noneText;
          placeThumb();
        }
        // Bring the current match into view a third of the way down (clear of the find bar).
        function toCur() {
          const mk = pane.querySelector('mark.cur');
          if (!mk) return;
          const pr = pane.getBoundingClientRect();
          const r = mk.getBoundingClientRect();
          if (r.top < pr.top + bar.offsetHeight + 16 || r.bottom > pr.bottom - 8) sp.to(sp.get() + (r.top - pr.top) - pr.height / 3);
        }
        paint();
        if (ctx.model.find.open) toCur();
        const at = (el) => {
          const r = el.getBoundingClientRect();
          return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null;
        };
        return {
          sync(m) {
            field.set(m.answers[0]);
            findField.set(m.find.query);
            paint();
          },
          locate(tg) {
            if (tg.field === 0) return field.locate();
            if (tg.find) return findField.locate();
            if (tg.findOpen) return btns.locate('open');
            if (tg.findCase) return btns.locate('case');
            if (tg.findWhole) return btns.locate('whole');
            if (tg.findNext) return btns.locate('next');
            if (tg.expandAll) return expandBtn && btns.locate('expand');
            if (tg.doc) return at(pane);
            return null;
          },
        };
      },
    },
  },
});
