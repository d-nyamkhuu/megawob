/* fill-form/_modes: reference builders. scope is the live unit scope; reference.js retains all design hooks. */
(function () {
  'use strict';
function renderWizard(scope, ctx, host, rng) {
        const { util, spec } = ctx;
        const W = spec.layout.wizard;
        const fam = scope.env.taskDef.helpers;
        const n = W.steps.length;
        const form = util.el('div', 'ff-form ff-wiz', host);
        form.dataset.role = 'form';
        scope.recordBar(util,form);
        util.el('h2', '', form, spec.formTitle);
        const bar = rng.bool(0.5);
        const head = util.el(bar ? 'div' : 'ol', bar ? 'ff-prog' : 'ff-steps', form);
        const stps = [];
        let barText;
        let barFill;
        if (bar) {
          barText = util.el('small', '', head);
          barFill = util.el('b', '', util.el('div', '', head));
        } else {
          [...W.steps.map((x) => x.title), W.reviewTitle].forEach((title, i) => {
            const li = util.el('li', 'ff-stp', head);
            util.el('i', '', li, String(i + 1));
            util.el('span', '', li, title);
            stps.push(li);
          });
        }
        const panels = util.el('div', 'ff-wizpanels', form);
        const panes = W.steps.map((stp) => {
          const pane = util.el('div', 'ff-wizpanel', panels);
          util.el('h3', '', pane, stp.title);
          const grid = util.el('div', 'ff-grid' + (spec.layout.cols === 2 ? ' two' : ''), pane);
          for (const f of spec.fields) if (stp.ids.includes(f.id)) scope.addField(util, grid, f, ctx.model.fields[f.id], true);
          return pane;
        });
        const review = util.el('div', 'ff-wizpanel', panels);
        util.el('h3', '', review, W.reviewTitle);
        const table = util.el('table', 'ff-review', review);
        const foot = util.el('div', 'ff-wizfoot', form);
        const back = util.el('button', 'ff-btn', foot, 'Back');
        const next = util.el('button', 'ff-btn primary', foot, rng.pick(scope.NEXT_LABELS));
        for (const b of [back, next]) { b.type = 'button'; b.dataset.role = 'button'; }
        const edits = [];

        const fillReview = () => {
          table.textContent = '';
          edits.length = 0;
          W.steps.forEach((stp, k) => {
            const tr = util.el('tr', 'grp', table);
            const td = util.el('td', '', tr, stp.title);
            td.colSpan = 2;
            const a = util.el('a', '', td, 'Edit');
            a.dataset.role = 'edit';
            a.addEventListener('click', () => go(k));
            edits[k] = a;
            for (const f of spec.fields.filter((x) => stp.ids.includes(x.id))) {
              const v = ctx.model.fields[f.id];
              const r = util.el('tr', '', table);
              util.el('td', '', r, f.label);
              const shown = f.kind === 'checkbox' ? (v ? 'Yes' : 'No') : String(v || '');
              util.el('td', shown ? '' : 'none', r, shown || 'not provided');
            }
          });
        };
        const paint = (m) => {
          const k = m.step;
          if (document.activeElement && form.contains(document.activeElement)) document.activeElement.blur();
          panes.forEach((p, i) => p.classList.toggle('on', i === k));
          review.classList.toggle('on', k === n);
          stps.forEach((li, i) => { li.classList.toggle('on', i === k); li.classList.toggle('done', i < k); });
          if (bar) {
            barText.textContent = k === n ? `Review · step ${n + 1} of ${n + 1}` : `Step ${k + 1} of ${n + 1} · ${W.steps[k].title}`;
            barFill.style.width = `${Math.round(((k + 1) / (n + 1)) * 100)}%`;
          }
          back.classList.toggle('hide', k === 0);
          next.classList.toggle('hide', k === n);
          if (k === n) fillReview();
          for (const f of spec.fields) {
            const e = scope.st.el[f.id];
            const er = (m.errors || {})[f.id];
            e.err.textContent = er === 'required' ? 'This field is required.' : er === 'format' ? 'Check the format of this value.' : '';
            if (e.input) e.input.classList.toggle('bad', !!er);
          }
        };
        const go = (to) => {
          const m = fam.wizardGo(ctx.model, spec, to);
          ctx.update(m);
          paint(m);
        };
        back.addEventListener('click', () => go('back'));
        next.addEventListener('click', () => go('next'));
        form.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type === 'text' && ctx.model.step < n) {
            e.preventDefault();
            go('next');
          }
        });
        fillReview(); // built up front so the panel stack is as tall as the review page from the start
        paint(ctx.model);
        scope.st.extra = {
          next: () => util.center(next),
          back: () => util.center(back),
          edit: (t) => util.center(edits[t.edit]),
        };
        return form;
      }

function renderViewer(scope, ctx) {
        scope.ensureStyle();
        scope.ensureStyle2();
        const { util, rng, spec } = ctx;
        const L = spec.layout;
        const P = L.pdf;
        const d = spec.doc;
        scope.st = { ctx, spec, el: {}, tabs: null, extra: {} };
        if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();

        const box = scope.stageBox(ctx);
        const availW = Math.min(box.width - 32, 1360);
        const availH = box.height - 24;
        const root = util.el('div', 'ff-root' + (L.docSide === 'right' ? ' doc-right' : ''), box.host);
        root.style.width = availW + 'px';
        root.style.margin = '12px 16px';
        root.style.setProperty('--ff-paper', '#ffffff');
        const ink = `hsl(${rng.int(0, 359)}, ${rng.int(35, 60)}%, ${rng.int(24, 36)}%)`;
        root.style.setProperty('--ff-ink', ink);
        scope.st.root = root;

        const docW = Math.round(availW * rng.float(0.43, 0.5));
        const viewer = util.el('div', 'ff-pdf', root);
        viewer.dataset.role = 'document';
        viewer.style.width = docW + 'px';
        viewer.style.height = availH + 'px';
        const tb = util.el('div', 'ff-pdfbar', viewer);
        util.el('span', 'name', tb, P.file);
        const pg = util.el('span', 'pg', tb, '');
        const zm = util.el('span', 'zm', tb);
        scope.icon(util,zm,'minus');
        util.el('span', '', zm, `${Math.round(P.zoom * 100)}%`);
        scope.icon(util,zm,'plus');
        const body = util.el('div', 'ff-pdfbody', viewer);
        const pane = util.el('div', 'ff-pdfpane', body);
        pane.dataset.role = 'pdf';
        const sbar = util.el('div', 'ff-pdfscroll', body);
        const thumb = util.el('div', 'ff-pdfthumb', sbar);
        thumb.dataset.role = 'scrollbar';
        const content = util.el('div', 'ff-pdfdoc', pane);
        const formPane = util.el('div', 'ff-formpane', root);

        // Pages: optional cover sheet or cover note, the document, optional terms page.
        const pages = [];
        const page = (cls = '') => {
          const el = util.el('div', 'ff-pdfpage' + (cls ? ` ${cls}` : ''), content);
          pages.push(el);
          return el;
        };
        let docPage;
        const build = () => {
          pages.length = 0;
          content.textContent = '';
          const paneW = pane.clientWidth;
          const pageW = Math.max(180, Math.round((paneW - 28) * P.zoom));
          const pageH = Math.round(pageW * 1.29);
          const fit = (el) => { el.style.width = `${pageW}px`; el.style.fontSize = `${P.zoom}em`; };
          if (P.cover === 'cover') {
            const c = page('pad');
            fit(c);
            c.style.minHeight = `${pageH}px`;
            util.el('h4', '', c, rng.fork('ct').pick(scope.PDF_TITLES));
            util.el('div', 'rule', c);
            util.el('div', 'meta', c, `File: ${P.file}\nPages: ${2 + (P.filler ? 1 : 0)}\nResolution: 300 dpi\nReceived by the mail room`).style.whiteSpace = 'pre-line';
            util.el('div', 'code', c);
          } else if (P.cover === 'letter') {
            const c = page('pad');
            fit(c);
            c.style.minHeight = `${pageH}px`;
            util.el('h4', '', c, rng.fork('ct').pick(['Records office', 'Document processing', 'Back office']));
            util.el('div', 'rule', c);
            util.el('p', '', c, P.note);
            util.el('p', '', c, 'Please do not reply to this message. Regards, the records team.');
          }
          docPage = page('pad');
          fit(docPage);
          docPage.classList.toggle('pad', false);
          docPage.style.padding = `${(0.8 * P.zoom).toFixed(2)}em`;
          docPage.style.minHeight = `${pageH}px`;
          if (L.image) {
            const receipt = d.kind === 'invoice' && d.style === 'receipt';
            scope.renderImage(util, docPage, d, rng.fork('img'), receipt ? Math.min(pageW - 20, 360) : pageW - 20, 2400, scope.imageLook(rng.fork('look'), d, receipt, ink));
          } else scope.renderDoc(util, docPage, d, rng.fork('doc'));
          if (P.filler) {
            const f = page('pad');
            fit(f);
            f.style.minHeight = `${pageH}px`;
            util.el('h4', '', f, P.filler.title);
            util.el('div', 'rule', f);
            for (const t of P.filler.paras) util.el('p', '', f, t);
          }
        };

        scope.renderForm(util, formPane, spec, ctx.model, rng.fork('form'));
        scope.mirrorFocus(root);

        // Base font: as large as fits for the form; the viewer has a fixed size.
        let fs = Math.max(12, Math.min(17.5, availH / 40));
        for (;;) {
          root.style.fontSize = fs + 'px';
          if ((formPane.offsetHeight <= availH && formPane.scrollWidth <= formPane.clientWidth + 1) || fs <= 9) break;
          fs -= 0.5;
        }
        build();

        return bindViewerScroll(scope, { ctx, util, spec, L, root, viewer, formPane, pane, sbar, thumb, pages, docPage, pg });
      }

      function bindViewerScroll(scope, B) {
        const { ctx, util, spec, L, root, viewer, formPane, pane, sbar, thumb, pages, docPage, pg } = B;
        // Scrolling: wheel or the viewer's own scrollbar; everything mirrored into model.pdf.
        const S = { max: 0, trackH: 0, thumbH: 0 };
        const pos = {};
        const measure = () => {
          S.max = Math.max(0, pane.scrollHeight - pane.clientHeight);
          S.trackH = sbar.clientHeight;
          S.thumbH = Math.max(24, Math.round((pane.clientHeight / Math.max(1, pane.scrollHeight)) * S.trackH));
          thumb.style.height = `${S.thumbH}px`;
          sbar.style.visibility = S.max > 0 ? 'visible' : 'hidden';
        };
        const yOf = (rect) => Math.round(rect.bottom - pane.getBoundingClientRect().top + pane.scrollTop);
        const norm = (x) => x.replace(/\s+/g, ' ').trim();
        const pinDown = () => {
          const end = yOf(docPage.getBoundingClientRect());
          const walker = document.createTreeWalker(docPage, NodeFilter.SHOW_TEXT);
          const nodes = [];
          for (let nd = walker.nextNode(); nd; nd = walker.nextNode()) nodes.push(nd);
          for (const f of spec.fields) {
            if (f.src === null) continue;
            pos[f.id] = end;
            if (L.image || f.computed || typeof f.src !== 'string') continue;
            const want = norm(f.src);
            for (const nd of nodes) {
              const at = nd.data.indexOf(f.src);
              if (at < 0 && !norm(nd.data).includes(want)) continue;
              const r = document.createRange();
              r.selectNodeContents(nd);
              if (at >= 0) { r.setStart(nd, at); r.setEnd(nd, at + f.src.length); }
              const rects = [...r.getClientRects()];
              if (rects.length) pos[f.id] = Math.min(end, yOf({ bottom: Math.max(...rects.map((q) => q.bottom)) }));
              break;
            }
          }
        };
        const thumbTop = (y) => (S.max > 0 ? (y / S.max) * (S.trackH - S.thumbH) : 0);
        const mirror = () => {
          thumb.style.top = `${thumbTop(pane.scrollTop)}px`;
          const top = Math.round(pane.scrollTop);
          const view = pane.clientHeight;
          let cur = 0;
          pages.forEach((el, i) => { if (el.offsetTop <= top + view / 2) cur = i; });
          pg.textContent = `${cur + 1} / ${pages.length}`;
          const old = ctx.model.pdf || {};
          const seen = Math.max(old.seen || 0, top + view);
          if (old.top === top && old.view === view && old.seen === seen && old.max === S.max && old.pos === pos) return;
          ctx.patch({ pdf: { top, view, max: S.max, seen, pos } });
        };
        scope.env.ui.scrollPane(pane, {
          max: () => S.max,
          thumb,
          track: sbar,
          travel: () => S.trackH - S.thumbH,
          trackPage: 0.85,
          onScroll: () => mirror(),
          onDrag(on) {
            thumb.classList.toggle('on', on);
            if (!on) mirror();
          },
        });
        measure();
        pinDown();
        mirror();
        scope.st.extra = {
          pdfPane: () => { const r = pane.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; },
          pdfThumb: () => util.center(thumb),
          pdfTo: (t) => {
            const tr = thumb.getBoundingClientRect();
            const br = sbar.getBoundingClientRect();
            return [tr.left + tr.width / 2, br.top + thumbTop(Math.max(0, Math.min(S.max, t.pdfTo))) + S.thumbH / 2];
          },
        };
        return { anchors: [root, viewer, formPane] };
      }

function renderErp(scope, ctx) {
        scope.ensureStyle();
        scope.ensureStyle2();
        const { util, rng, spec } = ctx;
        const L = spec.layout;
        const d = spec.doc;
        scope.st = { ctx, spec, el: {}, tabs: null, extra: {} };
        if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();

        const box = scope.stageBox(ctx);
        const availW = Math.min(box.width - 32, 1360);
        const availH = box.height - 24;
        const root = util.el('div', 'ff-root ff-erp', box.host);
        root.style.width = availW + 'px';
        root.style.margin = '12px 16px';
        root.style.setProperty('--ff-paper', rng.pick(scope.PAPERS));
        const ink = `hsl(${rng.int(190, 250)}, ${rng.int(30, 50)}%, ${rng.int(22, 32)}%)`;
        root.style.setProperty('--ff-ink', ink);
        scope.st.root = root;

        const tt = util.el('div', 'ff-erp-title', root);
        util.el('b', '', tt, rng.pick(scope.ERP_APPS).toUpperCase());
        util.el('span', '', tt, `${L.mainLabel} · ${spec.formTitle}`);
        util.el('span', 'r', tt, `Client ${rng.int(100, 900)}`);
        const rib = util.el('div', 'ff-erp-rib', root);
        for (const b of rng.sample(scope.ERP_RIB, rng.int(5, 7))) util.el('span', '', rib, b);
        const main = util.el('div', 'ff-erp-main' + (L.docSide === 'right' ? ' doc-right' : ''), root);

        // Panes: the document, the form and the decoy tabs ("History", "Notes", ...).
        const docH = Math.max(200, availH - (L.tabs ? 190 : 150)); // image documents: what is left under the window frame
        const decoyKeys = L.decoys.map((_, i) => `x${i}`);
        const mkDecoy = (host, label, i) => {
          const dr = rng.fork(`decoy${i}`);
          const wrap = util.el('div', 'ff-erp-dec', host);
          util.el('div', 'hd', wrap, label);
          if (dr.bool(0.3)) { util.el('div', 'empty', wrap, 'No entries for this record.'); return; }
          const t = util.el('table', '', wrap);
          const hr = util.el('tr', '', t);
          for (const h of ['Date', 'User', 'Change']) util.el('th', '', hr, h);
          for (let k = 0; k < dr.int(2, 5); k++) {
            const tr = util.el('tr', '', t);
            util.el('td', '', tr, `${pad2(dr.int(1, 28))}.${pad2(dr.int(1, 12))}.${dr.int(2021, 2024)}`);
            util.el('td', '', tr, dr.pick(scope.ERP_USERS));
            util.el('td', '', tr, dr.pick(scope.ERP_CHANGES));
          }
        };
        const pad2 = (n) => String(n).padStart(2, '0');
        const buildDoc = (host, W, H) => {
          const receipt = d.kind === 'invoice' && d.style === 'receipt';
          if (L.image) scope.renderImage(util, host, d, rng.fork('img'), receipt ? Math.min(W, 360) : W, H, scope.imageLook(rng.fork('look'), d, receipt, ink));
          else scope.renderDoc(util, host, d, rng.fork('doc'));
        };
        const buildForm = (host) => {
          const form = util.el('div', 'ff-form', host);
          form.dataset.role = 'form';
          util.el('h2', '', form, L.mainLabel);
          const grid = util.el('div', 'ff-grid three', form);
          for (const f of spec.fields) scope.addField(util, grid, f, ctx.model.fields[f.id]);
        };

        let docPane;
        let formPane;
        let strip;
        let panes;
        const tabEls = [];
        const mkTab = (label, host) => {
          const b = util.el('button', 'ff-tab', host, label);
          b.type = 'button';
          b.dataset.role = 'tab';
          b.setAttribute('role', 'tab');
          tabEls.push(b);
          return b;
        };
        const keys = [];
        const panels = [];
        if (L.tabs) {
          strip = util.el('div', 'ff-erp-tabs', main);
          main.style.flexDirection = 'column';
          main.style.alignItems = 'stretch';
          panes = util.el('div', 'ff-erp-panes', main);
          mkTab(L.tabLabels[0], strip);
          keys.push('doc');
          docPane = util.el('div', 'ff-erp-pane', panes);
          panels.push(docPane);
          mkTab(L.mainLabel, strip);
          keys.push('form');
          formPane = util.el('div', 'ff-erp-pane', panes);
          panels.push(formPane);
          buildDoc(docPane, Math.min(availW - 60, 640), docH);
          buildForm(formPane);
        } else {
          const docBox = util.el('div', 'ff-erp-doc', main);
          docBox.style.width = `${Math.round((availW - 40) * rng.float(0.3, 0.36))}px`;
          docBox.dataset.role = 'document';
          util.el('div', 'hd', docBox, 'Attachment');
          docPane = util.el('div', '', docBox);
          buildDoc(docPane, parseInt(docBox.style.width, 10), docH);
          const fp = util.el('div', 'ff-erp-fp', main);
          strip = util.el('div', 'ff-erp-tabs', fp);
          panes = util.el('div', 'ff-erp-panes', fp);
          mkTab(L.mainLabel, strip);
          keys.push('form');
          formPane = util.el('div', 'ff-erp-pane', panes);
          panels.push(formPane);
          buildForm(formPane);
        }
        L.decoys.forEach((label, i) => {
          mkTab(label, strip);
          keys.push(decoyKeys[i]);
          const p = util.el('div', 'ff-erp-pane', panes);
          mkDecoy(p, label, i);
          panels.push(p);
        });
        tabEls.forEach((b) => b.setAttribute('aria-selected', 'false'));
        scope.st.tabs = scope.env.ui.tabs(tabEls, panels, {
          keys,
          value: ctx.model.tab || 'form',
          show: (p, vis) => p.classList.toggle('off', !vis),
          onChange: (k) => scope.st.ctx.update({ ...scope.st.ctx.model, tab: k, seen: scope.st.ctx.model.seen || k === 'doc', open: null }),
        });
        const stat = util.el('div', 'ff-erp-status', root);
        util.el('span', '', stat, 'Ready');
        util.el('span', '', stat, `Records: ${rng.int(1, 40)}`);
        util.el('span', '', stat, rng.pick(scope.ERP_USERS));
        scope.mirrorFocus(root);

        let fs = Math.max(11, Math.min(14.5, availH / 44));
        const fits = () => root.offsetHeight <= availH && root.scrollWidth <= root.clientWidth + 1;
        for (;;) {
          root.style.fontSize = fs + 'px';
          if (fits() || fs <= 9) break;
          fs -= 0.5;
        }
        return { anchors: [root, strip] };
      }


  env.template('fill-form/_modes', () => ({ renderWizard, renderViewer, renderErp }));
})();
