/* click-control/_controls-buttons: buttons parts of click-control/controls.
 * install(BASE, scopeRef) keeps each part replaceable through the parent's design.parts.
 */
(function () {
  'use strict';

  function seqButton(scopeRef, ctx, s, e) {
    const b = ctx.util.el('button', 'uc-btn', s, e.label);
    b.dataset.key = e.key;
    return b;
  }

  function seqPlace(scopeRef, b, index, geo) {
    const p = geo.spots[index % geo.spots.length];
    Object.assign(b.style, {
      width: geo.w + 'px',
      height: geo.h + 'px',
      left: p[0] * (geo.W - geo.w) + 'px',
      top: p[1] * (geo.H - geo.h) + 'px',
    });
  }

  function seqDecoyLabel(scopeRef, ctx, k, labels) { return labels[k] || 'Preferences'; }

  function seqDecoyMade(scopeRef) {}

  function seqSynced(scopeRef) {}

  function buildSequence(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const { box: s, W, H } = scopeRef.P.surface(ctx, content);
    const geo = { W, H, w: Math.min(scopeRef.D.seqW, W * scopeRef.D.seqWFrac), h: Math.min(scopeRef.D.seqH, H * scopeRef.D.seqHFrac), spots: scopeRef.D.seqSpots };
    const els = spec.buttons.map((e, i) => {
      const b = scopeRef.P.seqButton(ctx, s, e, i);
      scopeRef.P.seqPlace(b, i, geo);
      return b;
    });
    const labels = scopeRef.D.seqLabels.filter((label) => !spec.buttons.some((b) => b.label === label));
    for (let j = els.length; j < scopeRef.D.seqDecoys; j++) {
      const label = scopeRef.P.seqDecoyLabel(ctx, j - els.length, labels, j);
      const el = util.el('button', 'uc-btn sequence-xtra', s, label);
      el.type = 'button';
      scopeRef.P.seqPlace(el, j, geo);
      scopeRef.P.seqDecoyMade(ctx, el, label, j);
    }
    const btns = env.ui.buttons(els, { label: 'sequence', history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync: (m) => { btns.set(m.clicks); scopeRef.P.seqSynced(ctx, m); },
      locate: (t) => (t.button !== undefined ? btns.locate(t.button) : null),
      recover: 'toast',
    };
  }

  function buttonHost(scopeRef, ctx, s) { return s; }

  function buttonEl(scopeRef, ctx, host, e) { return ctx.util.el('button', 'uc-btn', host, e.label); }

  function buttonBuilt(scopeRef) {}

  function buttonSynced(scopeRef, ctx, m) {
    const status = document.querySelectorAll('.status-row');
    if (status.length) {
      status[1].querySelector('.status-value').textContent = m.clicks.length ? 'Clicked' : 'Not completed';
      status[2].querySelector('.status-value').textContent = m.clicks.length;
    }
  }

  function buildButton(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const { box: s } = scopeRef.P.surface(ctx, content);
    const host = scopeRef.P.buttonHost(ctx, s, content);
    s.classList.toggle('multiple-controls', spec.elements.length > 2);
    const els = [];
    for (const e of spec.elements) {
      if (e.type === 'text') util.el('div', 'uc-text', host, e.text);
      else if (e.type === 'input') {
        const row = util.el('label', 'uc-inrow', host, e.label || '');
        const inp = util.el('input', 'uc-input', row);
        inp.style.width = e.width + 'px';
        inp.type = 'text';
      } else {
        const b = scopeRef.P.buttonEl(ctx, host, e);
        b.type = 'button';
        b.dataset.key = e.key;
        if (e.disabled) {
          b.classList.add('dis');
          b.setAttribute('aria-disabled', 'true');
        }
        els.push(b);
      }
    }
    if (scopeRef.D.helper) {
      util.el('div', 'button-helper', s, ctx.finish
        ? 'After clicking the button, finish to continue.'
        : 'After clicking the button, press Submit to continue.');
    }
    scopeRef.P.buttonBuilt(ctx, s, els, content);
    const dis = new Set(spec.elements.filter((e) => e.disabled).map((e) => e.key));
    const btns = env.ui.buttons(els, {
      label: 'button',
      history: ctx.model.clicks,
      disabled: (k) => dis.has(k),
      onChange: (h) => up({ clicks: h }),
    });
    return {
      sync: (m) => { btns.set(m.clicks); scopeRef.P.buttonSynced(ctx, m); },
      locate: (t) => (t.button !== undefined ? btns.locate(t.button) : null),
      recover: 'toast',
    };
  }

  function linkHead(scopeRef, ctx, art) { return ctx.util.el('h3', '', art, ctx.spec.heading); }

  function linkList(scopeRef, ctx, art, content) {
    const { spec, util, rng } = ctx;
    util.el('p', '', art, rng.pick(['Pick a topic to read more.', 'Everything you need, in one place.', 'Handpicked for you.'])).style.color = 'var(--muted)';
    const rc = content.getBoundingClientRect();
    const col = rng.bool(0.4) && spec.blocks[0].length * 40 + 90 < rc.height;
    const list = util.el('div', 'uc-links' + (col ? ' col' : ''), art);
    return spec.blocks[0].map((w, i) => {
      const a = util.el('span', 'uc-link' + (w.look === 'button' ? ' btnlook' : w.look === 'chip' ? ' chip' : ''), list, w.text);
      a.dataset.key = `0.${i}`;
      a.dataset.role = 'link';
      return a;
    });
  }

  function linkParagraphs(scopeRef, ctx, art) { return ctx.spec.blocks.flatMap((ws, k) => scopeRef.P.paragraph(ctx, art, ws, k)); }

  function linkDecor(scopeRef) {}

  function linkSynced(scopeRef) {}

  function clearArticle(scopeRef, art) {
    Array.from(art.children).forEach((el) => {
      if (el.tagName !== 'H3') el.remove();
    });
  }

  function linkSpan(scopeRef, ctx, parent, text, key, links) {
    const a = ctx.util.el('span', 'uc-link', parent, text);
    a.dataset.key = key;
    a.dataset.role = 'link';
    links.push(a);
    return a;
  }

  function linkResources(scopeRef, ctx, art, links, { intro, labels, after = false }) {
    const { util } = ctx;
    scopeRef.P.clearArticle(art);
    util.el('p', 'notebook-intro', art, intro);
    const resources = util.el('ul', 'notebook-resources', art);
    links.forEach((a, i) => {
      const row = util.el('li', '', resources);
      if (!after) row.append(labels[i % labels.length]);
      row.append(a);
      if (after) row.append(labels[i % labels.length]);
    });
    return resources;
  }

  function buildLink(scopeRef, ctx, content, up) {
    const { spec, util } = ctx;
    const b = scopeRef.P.box(ctx, content);
    const art = util.el('div', 'uc-article', b);
    scopeRef.P.linkHead(ctx, art);
    const links = spec.mode === 'list' ? scopeRef.P.linkList(ctx, art, content) : scopeRef.P.linkParagraphs(ctx, art);
    scopeRef.P.linkDecor(ctx, art, links, content);
    const lk = env.ui.buttons(links, { label: 'link', point: scopeRef.linkPoint, history: ctx.model.clicks, onChange: (h) => up({ clicks: h }) });
    return {
      sync: (m) => { lk.set(m.clicks); scopeRef.P.linkSynced(ctx, m, links); },
      locate: (t) => (t.link !== undefined ? lk.locate(t.link) : null),
      recover: 'view',
    };
  }

  function install(BASE, scopeRef) {
    BASE.seqButton = (...args) => seqButton(scopeRef, ...args);
    BASE.seqPlace = (...args) => seqPlace(scopeRef, ...args);
    BASE.seqDecoyLabel = (...args) => seqDecoyLabel(scopeRef, ...args);
    BASE.seqDecoyMade = (...args) => seqDecoyMade(scopeRef, ...args);
    BASE.seqSynced = (...args) => seqSynced(scopeRef, ...args);
    BASE.buildSequence = (...args) => buildSequence(scopeRef, ...args);
    BASE.buttonHost = (...args) => buttonHost(scopeRef, ...args);
    BASE.buttonEl = (...args) => buttonEl(scopeRef, ...args);
    BASE.buttonBuilt = (...args) => buttonBuilt(scopeRef, ...args);
    BASE.buttonSynced = (...args) => buttonSynced(scopeRef, ...args);
    BASE.buildButton = (...args) => buildButton(scopeRef, ...args);
    BASE.linkHead = (...args) => linkHead(scopeRef, ...args);
    BASE.linkList = (...args) => linkList(scopeRef, ...args);
    BASE.linkParagraphs = (...args) => linkParagraphs(scopeRef, ...args);
    BASE.linkDecor = (...args) => linkDecor(scopeRef, ...args);
    BASE.linkSynced = (...args) => linkSynced(scopeRef, ...args);
    BASE.clearArticle = (...args) => clearArticle(scopeRef, ...args);
    BASE.linkSpan = (...args) => linkSpan(scopeRef, ...args);
    BASE.linkResources = (...args) => linkResources(scopeRef, ...args);
    BASE.buildLink = (...args) => buildLink(scopeRef, ...args);
  }

  env.template('click-control/_controls-buttons', () => ({ install }));
})();
