/* protect-privacy/classic: controls parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-controls', () => ({
    install(BASE, state) {
      BASE.begin = () => {};
      BASE.rendered = () => {};
      BASE.drawn = () => {};
      BASE.decorated = () => {};
      BASE.styles = () => state.D.css
        .replace("font: 13px/1.35 system-ui, -apple-system, 'Segoe UI', sans-serif;", `font: ${state.D.font};`)
        .replace('border: 1px solid var(--line); border-radius: 10px;', `border: 1px solid var(--line); border-radius: ${state.D.radius};`)
        .replaceAll('#c62828', state.D.dangerColor).replaceAll('#f9a825', state.D.warningColor)
        .replaceAll('background: #fff; color: #1d2330;', `background: ${state.D.paperBackground}; color: ${state.D.paperColor};`);
      BASE.element = (tag, cls, parent, text, attrs) => {
        const m = typeof text === 'string' && /^#([a-z]+)(?: |$)/.exec(text);
        const e = state.util.el(tag, cls || '', parent, m && state.D.icons[m[1]] ? undefined : text);
        if (m && state.D.icons[m[1]]) {
          const i = document.createElement('span');
          i.className = 'sp-ico';
          i.innerHTML = state.D.icons[m[1]];
          e.append(i);
          if (text.length > m[0].length) e.append(text.slice(m[0].length));
        }
        if (attrs) for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null && v !== false) e.setAttribute(k, v === true ? '' : v);
        state.P.decorated(state.ctx, e);
        return e;
      };
      BASE.key = (e, k) => { e.dataset.k = k; return e; };
      BASE.pointOn = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (!(r.width > 0 && r.height > 0)) return null;
        for (const fy of [0.5, 0.3, 0.7]) {
          for (const fx of [0.5, 0.3, 0.7, 0.15, 0.85]) {
            const p = [r.left + r.width * fx, r.top + r.height * fy];
            const hit = document.elementFromPoint(p[0], p[1]);
            if (hit && (hit === el || el.contains(hit))) return p;
          }
        }
        return [r.left + r.width / 2, r.top + r.height / 2];
      };
      BASE.hashColor = (s) => {
        let h = 0;
        for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        return state.D.avatarColors[h % state.D.avatarColors.length];
      };
      const initials = (name) => String(name).split(/[\s.@]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
      BASE.siteHead = (parent, navs) => {
        const sh = state.P.element('div', 'sp-site-h', parent);
        state.P.element('span', 'sp-logo', sh, state.orgName[0]);
        state.P.element('b', '', sh, state.orgName);
        if (navs) { const n = state.P.element('div', 'sp-navs', sh); for (const x of navs) state.P.element('span', '', n, x); }
        return sh;
      };
      BASE.avatar = (parent, name, size) => {
        const a = state.P.element('span', 'sp-av', parent, initials(name));
        a.style.background = state.P.hashColor(name);
        if (size) { a.style.width = a.style.height = `${size}px`; }
        return a;
      };
      BASE.field = (parent, f, val, opts = {}) => {
        const box = state.P.element('div', `sp-fld${opts.wide ? ' wide' : ''}`, parent);
        const lab = state.P.element('label', '', box, f.label);
        if (opts.req) state.P.element('i', '', lab, ' *');
        if (opts.hint) state.P.element('span', 'hint', box, opts.hint);
        const inp = state.P.element(opts.area ? 'textarea' : 'input', 'sp-in', box, undefined,
          { type: opts.area ? null : opts.type || 'text', rows: opts.area ? 2 : null, autocomplete: 'off', spellcheck: 'false', placeholder: opts.ph || null, readonly: opts.ro || null });
        inp.value = val || '';
        state.P.key(inp, opts.k);
        return box;
      };
      BASE.menu = (parent, items, curVal) => {
        const mn = state.P.element('div', 'sp-menu', parent);
        for (const it of items) {
          if (it === '-') { state.P.element('div', 'sp-sep', mn); continue; }
          state.P.menuItem(mn, it, curVal);
        }
        return mn;
      };
      BASE.kv = (parent, rows) => {
        const dl = state.P.element('dl', 'sp-kv', parent);
        for (const [k, v] of rows) state.P.detailRow(dl, k, v);
        return dl;
      };
      BASE.menuItem = (mn, it, curVal) => {
        const mi = state.P.key(state.P.element('div', `sp-mi${it.v === curVal ? ' cur' : ''}`, mn), it.k);
        const tx = state.P.element('span', '', mi, it.label);
        if (it.sub) state.P.element('small', '', tx, it.sub);
        return mi;
      };
      BASE.detailRow = (dl, k, v) => { state.P.element('dt', '', dl, k); state.P.element('dd', '', dl, v); };
    },
  }));
})();
