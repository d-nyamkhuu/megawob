/*
 * solve-puzzle/hot-cold: scenario hot-cold; design {} reproduces lineage medoid hot-cold-02.
 * Preset empty: 6/12 sites have exactly the medoid body. Keeps every original look/board rng draw.
 * Tokens: colors={hot:'#e03131',warm:'#f08c00',cold:'#1c7ed6',ice:'#66d9e8'} feedback palette;
 * minHeight=-Infinity (no clamp; 01/12 clamp); minWidth=-Infinity (01 clamps dimensions to 1).
 * State: S.st (live widgets, geometry, look), S.ctx, S.D, S.P, S.ARROW_UP/DOWN.
 * Parts (called through P):
 * usable(ctx) -> available stage box avoiding end control; build(ctx,box,squeeze) -> puzzle card;
 * clearStage(stage) clears children; fit(ctx,avail) -> {bw,bh,side} with original rng width draw;
 * board(ctx,body,avail) builds and wires board; svgAttrs(bw,bh) -> SVG attributes;
 * prepared(ctx,geo) no-op before wiring board; rect(board) -> border rectangle for input mapping;
 * scale(geo) -> {sx,sy,width,height} from sampled dimensions (07/09 override for live geometry);
 * marker(probe) -> SVG string for one numbered probe (probe includes u,v,i,fb,x,y,lastOne,ps,
 * sx,sy,width,height); panel(model,last,geo) no-op before feedback; trend(last) writes arrow markup;
 * status(model,last) writes remaining clicks (override can mirror feedback into frame).
 */
(function () {
  'use strict';
  env.template('solve-puzzle/hot-cold', (design, def) => {
    const { hotColdCSS: CSS, ARROW_UP, ARROW_DOWN, BAND_COLOR, META: allMeta, ICONS, FONTS } = env.templateLib('solve-puzzle/_theme');
    const META = allMeta['hot-cold'];
    const ICON = ICONS.flame;
    function ensureStyle() {
      if (document.getElementById('pz-style')) return;
      const s = document.createElement('style');
      s.id = 'pz-style';
      s.textContent = CSS;
      document.head.append(s);
    }
    const TOKENS = { colors: BAND_COLOR, minHeight: -Infinity, minWidth: -Infinity };
    const SCENARIOS = { 'hot-cold': {} };
    let D,
      P,
      st = null,
      ctxRef;
    const BASE = {};
    const S = {
      get st() {
        return st;
      },
      get ctx() {
        return ctxRef;
      },
      get D() {
        return D;
      },
      get P() {
        return P;
      },
      ARROW_UP,
      ARROW_DOWN,
    };
    BASE.usable = function (ctx) {
      const box = { x: 0, y: 0, w: ctx.size.width, h: ctx.size.height };
      const sr = ctx.stage.getBoundingClientRect();
      const sub = env.submitEl && env.submitEl.getBoundingClientRect();
      if (
        sub &&
        sub.width &&
        sub.left < sr.right &&
        sub.right > sr.left &&
        sub.top < sr.bottom &&
        sub.bottom > sr.top
      ) {
        const cutH = sr.bottom - sub.top + 10;
        const cutW = sr.right - sub.left + 10;
        if (cutH * box.w <= cutW * box.h) box.h -= cutH;
        else box.w -= cutW;
      }
      return box;
    };

    BASE.clearStage = (stage) => stage.replaceChildren();
    BASE.fit = (ctx, avail) => {
      const { spec, rng } = ctx;
      const panelW = 200;
      const side = avail.width - panelW - 20 >= 360;
      let bw = Math.min(rng.int(560, 700), side ? avail.width - panelW - 20 : avail.width);
      const maxH = Math.max(D.minHeight, avail.height - (side ? 0 : 70));
      if ((bw * spec.H) / spec.W > maxH) bw = (maxH * spec.W) / spec.H;
      bw = Math.max(D.minWidth, Math.floor(bw));
      const bh = Math.max(D.minWidth, Math.floor((bw * spec.H) / spec.W));
      return { bw, bh, side };
    };
    BASE.svgAttrs = (bw, bh) => ({ width: bw, height: bh, viewBox: `0 0 ${bw} ${bh}` });
    BASE.prepared = () => {};
    BASE.rect = (board) => board.getBoundingClientRect();
    BASE.scale = ({ bw, bh, spec }) => ({ sx: bw / spec.W, sy: bh / spec.H, width: bw, height: bh });
    BASE.marker = ({ u, v, i, fb, x, y, lastOne, ps, sx, sy }) => {
      const parts = [];
      if (lastOne)
        parts.push(
          `<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${D.colors[fb.band]}" stroke-width="2.5" opacity=".75"/>`,
        );
      parts.push(
        `<circle cx="${x}" cy="${y}" r="${lastOne ? 9 : 7}" fill="${D.colors[fb.band]}" stroke="var(--panel)" stroke-width="2"/>`,
      );
      if (ps.length <= 30)
        parts.push(
          `<text x="${x}" y="${(v * sy - 13).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--muted)">${i + 1}</text>`,
        );
      return parts.join('');
    };
    BASE.panel = () => {};
    BASE.trend = (last) => {
      st.trend.innerHTML =
        last.trend === 'warmer'
          ? `${ARROW_UP}Warmer than your last click`
          : `${ARROW_DOWN}Colder than your last click`;
    };
    BASE.status = (m) => {
      const spec = ctxRef.spec,
        fam = env.taskDef.helpers;
      st.status.innerHTML = `<span>Clicks left: <b>${fam.left(m, spec)}</b> of ${spec.budget}</span>`;
    };
    BASE.board = function (ctx, body, avail) {
      const { spec, util, rng } = ctx;
      const fam = env.taskDef.helpers;
      const { bw, bh, side } = P.fit(ctx, avail);
      const wrap = util.el('div', 'pz-hc' + (side ? '' : ' below'), body);
      const board = util.el('div', 'pz-board' + (rng.bool(0.4) ? ' lines' : ''), wrap);
      board.dataset.role = 'board';
      board.style.width = `${bw}px`;
      board.style.height = `${bh}px`;
      board.style.setProperty('--pz-grid', `${Math.round(bw / rng.pick([10, 12, 16, 20]))}px`);
      const svg = util.svg('svg', P.svgAttrs(bw, bh), board);
      const panel = util.el('div', 'pz-panel', wrap);
      st.temp = util.el('div', 'pz-temp', panel);
      st.trend = util.el('div', 'pz-trend none', panel);
      const legend = util.el('div', 'pz-legend', panel);
      for (const [band, label] of [
        ['hot', 'HOT'],
        ['warm', 'WARM'],
        ['cold', 'COLD'],
        ['ice', 'ICE COLD'],
      ]) {
        util.el('i', '', legend).style.background = D.colors[band];
        util.el('span', '', legend, label);
      }
      const geo = { board, svg, panel, bw, bh, spec };
      Object.assign(st, geo);
      P.prepared(ctx, geo);
      const rect = () => P.rect(board);
      st.board = env.ui.board(board, {
        toBoard: ([x, y]) => {
          const r = rect();
          return [((x - r.left) / r.width) * spec.W, ((y - r.top) / r.height) * spec.H];
        },
        fromBoard: ([u, v]) => {
          const r = rect();
          return [r.left + (u / spec.W) * r.width, r.top + (v / spec.H) * r.height];
        },
        bounds: { x0: 0, y0: 0, x1: spec.W, y1: spec.H },
        precision: 3,
        label: 'board',
        inside: () => !fam.locked(ctx.model, spec),
        onChange(p) {
          const m = fam.probe(ctx.model, spec, p);
          ctx.update(m);
          st.paint(m);
        },
      });
      st.main = board;
      st.paint = (m) => {
        const ps = m.probes;
        const { sx, sy, width, height } = P.scale(geo);
        const parts = [];
        if (ps.length > 1) {
          parts.push(
            `<polyline points="${ps.map(([u, v]) => `${(u * sx).toFixed(1)},${(v * sy).toFixed(1)}`).join(' ')}" fill="none" ` +
              'stroke="color-mix(in srgb, var(--fg) 30%, transparent)" stroke-width="1.5" stroke-dasharray="4 4"/>',
          );
        }
        ps.forEach(([u, v], i) => {
          const fb = fam.feedback(spec, ps, i);
          const x = (u * sx).toFixed(1);
          const y = (v * sy).toFixed(1);
          const lastOne = i === ps.length - 1;
          parts.push(P.marker({ u, v, i, fb, x, y, lastOne, ps, sx, sy, width, height }));
        });
        svg.innerHTML = parts.join('');
        const last = ps.length ? fam.feedback(spec, ps, ps.length - 1) : null;
        P.panel(m, last, geo);
        st.temp.className = 'pz-temp' + (last ? ` ${last.band}` : '');
        st.temp.textContent = last ? last.label : '—';
        if (!last) {
          st.trend.className = 'pz-trend none';
          st.trend.textContent = 'Click anywhere on the board to start.';
        } else if (!last.trend) {
          st.trend.className = 'pz-trend none';
          st.trend.textContent = 'First click. Try another spot.';
        } else if (last.trend === 'same') {
          st.trend.className = 'pz-trend none';
          st.trend.textContent = 'Same as your last click.';
        } else {
          st.trend.className = `pz-trend ${last.trend}`;
          P.trend(last);
        }
        P.status(m, last);
      };
    };
    BASE.build = function (ctx, box, squeeze) {
      const { spec, util, stage } = ctx;
      const rng = ctx.rng.fork('look'); // the same draws on every pass
      const meta = META;
      const look = {
        band: rng.bool(0.55),
        font: rng.pick(['sans', 'sans', 'mono', 'serif']),
        r: rng.pick([8, 10, 12, 16]),
        pad: squeeze ? 14 : rng.int(18, 28),
        title: rng.pick(meta.titles),
        sub: squeeze > 1 ? '' : rng.pick(meta.subs),
        placeholder: rng.bool(0.5),
        fs: rng.int(34, 46) - 6 * squeeze,
        fh: rng.int(46, 56) - 6 * squeeze,
        fw: rng.int(120, 170),
        rh: rng.int(42, 50) - 5 * squeeze,
        gap: rng.int(8, 14) - 3 * squeeze,
        dw: rng.int(140, 180) - 20 * squeeze,
        width: rng.int(400, 500),
        align: [
          rng.pick(['start', 'center', 'center', 'end']),
          rng.pick(['start', 'center', 'center', 'end']),
        ],
        jitter: [rng.float(-1, 1), rng.float(-1, 1)],
      };
      P.clearStage(stage);
      st = { look, squeeze, oeRows: Math.max(3, Math.floor((box.h - 140) / (look.rh + look.gap))) };
      const card = util.el('section', `pz-card ${look.band ? 'band' : 'ruled'}`, stage);
      card.dataset.role = 'puzzle';
      card.style.position = 'absolute';
      card.style.maxWidth = `${box.w - 8}px`;
      const vars = {
        '--pz-r': `${look.r}px`,
        '--pz-pad': `${look.pad}px`,
        '--pz-font': FONTS[look.font],
        '--pz-fs': `${look.fs}px`,
        '--pz-fh': `${look.fh}px`,
        '--pz-fw': `${look.fw}px`,
        '--pz-rh': `${look.rh}px`,
        '--pz-gap': `${look.gap}px`,
        '--pz-dw': `${look.dw}px`,
      };
      for (const [k, v] of Object.entries(vars)) card.style.setProperty(k, v);
      const head = util.el('div', 'pz-head', card);
      if (squeeze) head.style.padding = '9px 16px';
      util.el('div', 'pz-badge', head).innerHTML = ICON;
      const tt = util.el('div', '', head);
      util.el('div', 'pz-title', tt, look.title);
      if (look.sub) util.el('div', 'pz-sub', tt, look.sub);
      const body = util.el('div', 'pz-body', card);
      const foot = util.el('div', 'pz-foot', card);
      st.status = util.el('div', 'pz-status', foot);
      st.status.style.display = 'contents';

      // Room for the body: the usable box minus the card's head, foot and padding.
      const avail = {
        width: box.w - 2 * look.pad - 12 - 16,
        height: box.h - (squeeze ? 46 : 64) - 40 - 2 * look.pad - 12,
      };
      P.board(ctx, body, avail);
      st.paint(ctx.model);
      return card;
    };

    ({ D, P } = env.templateDesign('solve-puzzle/hot-cold', design, def, {
      tokens: TOKENS,
      scenarios: SCENARIOS,
      base: BASE,
      state: S,
    }));
    return {
      render(ctx) {
        ctxRef = ctx;

        ensureStyle();
        const { spec } = ctx;
        const box = P.usable(ctx);
        let card;
        for (const squeeze of [0, 1, 2]) {
          card = P.build(ctx, box, squeeze);
          const r = card.getBoundingClientRect();
          if (
            r.width <= box.w - 4 &&
            r.height <= box.h - 4 &&
            card.scrollWidth <= card.clientWidth + 1 &&
            card.scrollHeight <= card.clientHeight + 1
          )
            break;
        }
        // Freeze the card's size so later content changes never move the scored controls, then place it.
        const r = card.getBoundingClientRect();
        const w = Math.ceil(r.width);
        const h = Math.ceil(Math.min(r.height, box.h - 4));
        card.style.width = `${w}px`;
        card.style.height = `${h}px`;
        const { align, jitter } = st.look;
        const place = (a, room, size, j) => {
          const free = Math.max(0, room - size - 8);
          const base = a === 'start' ? 4 : a === 'end' ? free + 4 : free / 2 + 4;
          return Math.round(Math.max(4, Math.min(free + 4, base + j * Math.min(free / 4, 60))));
        };
        card.style.left = `${box.x + place(align[0], box.w, w, jitter[0])}px`;
        card.style.top = `${box.y + place(align[1], box.h, h, jitter[1])}px`;
        return {
          anchors: [card, st.main],
          sync(m) {
            st.paint(m);
          },
        };
      },

      locate(t) {
        if (t.point && st.board) return st.board.locate(t.point);
        throw new Error(`solve-puzzle/puzzle cannot locate ${JSON.stringify(t)}`);
      },
    };
  }, { uses: ['solve-puzzle/_theme'] });
})();
