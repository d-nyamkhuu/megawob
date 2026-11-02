/* click-control/_controls-frame: frame parts of click-control/controls.
 * install(BASE, scopeRef) keeps each part replaceable through the parent's design.parts.
 */
(function () {
  'use strict';

  function ensureStyle(scopeRef, id, css) {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.prepend(s);
  }

  function frame(scopeRef, ctx) {
    const page = ctx.util.el('div', 'uc-page', ctx.stage);
    const content = ctx.util.el('div', 'uc-content', page);
    return { page, content, h1: content };
  }

  function box(scopeRef, ctx, content) { return ctx.util.el('div', 'uc-box', content); }

  function surface(scopeRef, ctx, content) {
    const b = scopeRef.P.box(ctx, content), s = ctx.util.el('div', 'uc-surface', b), r = content.getBoundingClientRect();
    const W = Math.max(200, r.width - 4), H = Math.max(120, r.height - 4);
    s.style.width = W + 'px';
    s.style.height = H + 'px';
    return { box: s, W, H };
  }

  function paragraph(scopeRef, ctx, parent, segs, block, tag = 'p') {
    const p = ctx.util.el(tag, '', parent);
    const links = [];
    segs.forEach((w, i) => {
      if (i && !/^[.,;:!?)]/.test(w.text)) p.append(' ');
      if (w.link) {
        const a = ctx.util.el('span', 'uc-link', p, w.text);
        a.dataset.key = `${block}.${i}`;
        a.dataset.role = 'link';
        links.push(a);
      } else p.append(w.text);
    });
    return links;
  }

  function recovery(scopeRef, ctx, page, area, up, kind) {
    const { util, rng, spec } = ctx;
    const F = scopeRef.fam();
    const toast = util.el('div', 'uc-toast', page);
    toast.dataset.role = 'toast';
    if (rng.bool(0.5)) toast.style.left = '18px';
    else { toast.style.left = '50%'; toast.style.transform = 'translateX(-50%)'; }
    const msg = util.el('span', '', toast);
    const undo = util.el('button', '', toast, rng.pick(['Undo', 'Undo', 'UNDO', 'Restore', 'Revert']));
    undo.type = 'button';
    toast.hidden = true;
    let nav = null;
    let back = null;
    let navTitle = null;
    let navText = null;
    if (kind === 'view') {
      nav = util.el('div', 'uc-navview', area);
      back = util.el('span', 'uc-back', nav, rng.pick(['← Back', '‹ Back to page', '← Go back', 'Back']));
      back.dataset.role = 'back';
      navTitle = util.el('h2', '', nav);
      navText = util.el('p', '', nav);
      nav.hidden = true;
    }
    const doUndo = () => up(F.helpers.undoModel(ctx.model, spec));
    undo.addEventListener('click', doUndo);
    if (back) back.addEventListener('click', doUndo);
    const sentence = (env.content && env.content.SENTENCES && env.content.SENTENCES.length)
      ? env.content.SENTENCES[Math.floor(rng.next() * env.content.SENTENCES.length)] : '';
    return {
      sync(m) {
        const wk = spec.scenario === 'hover' ? [] : F.helpers.wrongKeys(m, spec);
        const on = wk.length > 0;
        const text = on ? F.helpers.resultText(spec, wk[wk.length - 1]) : '';
        if (nav) {
          nav.hidden = !on;
          if (on) { navTitle.textContent = text; navText.textContent = sentence; }
        } else {
          toast.hidden = !on;
          if (on) msg.textContent = text;
        }
      },
      locate() {
        if (nav && !nav.hidden) return env.util.center(back);
        if (!toast.hidden) return env.util.center(undo);
        return null;
      },
    };
  }

  function mount(scopeRef, ctx, page, content, builder) {
    let rec = null;
    let v = null;
    const syncAll = (m) => {
      if (v) v.sync(m);
      if (rec) rec.sync(m);
      scopeRef.P.synced(ctx, m);
    };
    const up = (patch) => {
      ctx.update({ ...ctx.model, ...patch });
      syncAll(ctx.model);
    };
    v = builder(ctx, content, up, page);
    if (v.recover) rec = scopeRef.P.recovery(ctx, page, v.area || content, up, v.recover);
    syncAll(ctx.model);
    return {
      sync: syncAll,
      locate(t) {
        if (t.undo) return (rec && rec.locate()) || (v.locate(t)) || null;
        if (t.blank) {
          const r = scopeRef.blankEl.getBoundingClientRect();
          return [r.left + Math.min(r.width - 4, 6 + r.width * 0.3), r.top + r.height / 2];
        }
        return v.locate(t);
      },
    };
  }

  function synced(scopeRef) {}

  function rendered(scopeRef, ctx, page, content) {
    const fit = scopeRef.D.articleFit;
    const art = fit && content.querySelector('.uc-article');
    if (!art) return;
    let room;
    if (fit.room !== undefined) room = content.clientHeight - fit.room;
    else {
      const padding = getComputedStyle(content);
      room = content.clientHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom);
    }
    const h = art.scrollHeight;
    if (h > room + (fit.slack || 0)) {
      art.style.fontSize = Math.max(13, ((parseFloat(getComputedStyle(art).fontSize) * room) / h) * 0.85) + 'px';
      const heading = art.querySelector('h3');
      if (heading) heading.style.fontSize = '1.35em';
      const list = art.querySelector('.uc-links');
      if (list) list.style.gap = '3px';
    }
  }

  function install(BASE, scopeRef) {
    BASE.ensureStyle = (...args) => ensureStyle(scopeRef, ...args);
    BASE.frame = (...args) => frame(scopeRef, ...args);
    BASE.box = (...args) => box(scopeRef, ...args);
    BASE.surface = (...args) => surface(scopeRef, ...args);
    BASE.paragraph = (...args) => paragraph(scopeRef, ...args);
    BASE.recovery = (...args) => recovery(scopeRef, ...args);
    BASE.mount = (...args) => mount(scopeRef, ...args);
    BASE.synced = (...args) => synced(scopeRef, ...args);
    BASE.rendered = (...args) => rendered(scopeRef, ...args);
  }

  env.template('click-control/_controls-frame', () => ({ install }));
})();
