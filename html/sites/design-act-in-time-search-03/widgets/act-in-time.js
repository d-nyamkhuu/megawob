// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-search-03',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  template: 'act-in-time/base',
  design: {
    parts: {
      'buildSearch': (base, S) => function buildSearch(ctx, f) {
        const { ICON, env, spinner } = S;
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
              const desc = util.el('small', '', nm);
              const lower = it.name.toLowerCase();
              const photo = /towel|mat|bath/.test(lower) ? 0 : /lamp|light/.test(lower) ? 1 : /pillow|cushion/.test(lower) ? 2 : /frame|picture/.test(lower) ? 3 : /storage|bin|basket/.test(lower) ? 4 : /canister|jar|glass/.test(lower) ? 5 : /board|bamboo/.test(lower) ? 6 : /curtain|shower/.test(lower) ? 7 : /linen|blanket/.test(lower) ? 8 : i % 9;
              th.classList.add(`ut-photo-${photo}`);
              desc.textContent = /towel|mat|bath/.test(lower) ? 'Soft cotton fabric for daily comfort.' : /lamp|light/.test(lower) ? 'Classic styling with a warm, soft glow.' : /pillow|cushion/.test(lower) ? 'Comfortable fill with easy-care materials.' : /frame|picture/.test(lower) ? 'A sturdy accent for displaying favorite photos.' : /storage|bin|basket/.test(lower) ? 'Durable construction keeps household items tidy.' : /canister|jar|glass/.test(lower) ? 'Clear airtight storage for kitchen essentials.' : /board|bamboo/.test(lower) ? 'A natural surface for everyday meal preparation.' : /curtain|shower/.test(lower) ? 'Easy-care fabric with lasting color.' : 'A quality home essential for everyday use.';
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
      },
    },
  },
});
