// Design of this site on the use-email/mail template (templates/use-email/mail.js): glossy blue icons, a message
// panel with its own scroll bar, a list rebuilt (with its scroll bar) on every folder change, and a mailbox switch
// that is revealed only once a task needs it.
// A revealed mailbox switch must survive sync before the pending pointer click.
(function () {
  'use strict';
  let navExposed = false;
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-07',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      toolbarOps: [['Reply', 'reply'], ['Reply All', 'replyall'], ['Forward', 'forward'], ['Trash', 'delete']],
      toolbarAfter: [['Print', 'print']],
      columns: ['From', 'Subject', 'Date Received', ''],
      paths: { print: 'M7 9V3h10v6 M7 18H3v-9h18v9h-4 M7 14h10v7H7z M17 12h1' },
      parts: {
        begin: () => () => {
          navExposed = false;
        },
        icon: (base, S) => (k) => {
          const filled = ['reply', 'replyall', 'forward', 'delete', 'print'].includes(k);
          return (
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            (filled
              ? '<defs><linearGradient id="blue-' +
                k +
                '" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#b7caf6"/><stop offset="1" stop-color="#5278c5"/></linearGradient></defs>'
              : '') +
            '<path ' +
            (filled ? 'fill="url(#blue-' + k + ')" stroke="#172449" stroke-width="1.2" ' : '') +
            'd="' +
            (S.paths[k] || S.paths.mail) +
            '"/></svg>'
          );
        },
        docMade: (base, S) => () => {
          const { el } = S;
          const { doc, docInside } = S.els;
          const docTrack = el('div', 'doc-scrolltrack', doc),
            docUp = el('button', 'doc-scroll-up', docTrack, '▲'),
            docThumb = el('div', 'doc-scrollthumb', docTrack),
            docDown = el('button', 'doc-scroll-down', docTrack, '▼');
          docUp.type = docDown.type = 'button';
          docUp.setAttribute('aria-label', 'Scroll message up');
          docDown.setAttribute('aria-label', 'Scroll message down');
          function scrollDoc() {
            const pad = docUp.offsetHeight,
              range = Math.max(0, docInside.scrollHeight - docInside.clientHeight),
              room = Math.max(0, docTrack.clientHeight - 2 * pad),
              h = Math.max(25, (room * docInside.clientHeight) / Math.max(docInside.scrollHeight, 1));
            docThumb.style.height = h + 'px';
            docThumb.style.top = pad + (range ? (docInside.scrollTop / range) * (room - h) : 0) + 'px';
          }
          S.els.docUp = docUp;
          S.els.scrollDoc = scrollDoc;
          docInside.addEventListener('scroll', scrollDoc);
          docUp.addEventListener('click', () => {
            docInside.scrollTop -= 50;
            scrollDoc();
          });
          docDown.addEventListener('click', () => {
            docInside.scrollTop += 50;
            scrollDoc();
          });
          let docDrag = null;
          docThumb.addEventListener('pointerdown', (ev) => {
            docDrag = { y: ev.clientY, scroll: docInside.scrollTop };
            docThumb.setPointerCapture(ev.pointerId);
            ev.preventDefault();
          });
          docThumb.addEventListener('pointermove', (ev) => {
            if (!docDrag) return;
            const room = docTrack.clientHeight - 2 * docUp.offsetHeight - docThumb.offsetHeight;
            docInside.scrollTop =
              docDrag.scroll +
              ((ev.clientY - docDrag.y) * Math.max(0, docInside.scrollHeight - docInside.clientHeight)) / Math.max(1, room);
            scrollDoc();
          });
          docThumb.addEventListener('pointerup', () => (docDrag = null));
          docThumb.addEventListener('pointercancel', () => (docDrag = null));
        },
        // Rebuild the primitive's nodes too: old scroll and drag listeners must not survive a folder change.
        listReset: (base, S) => () => {
          const E = S.els;
          E.listWrap.replaceChildren();
          E.list = S.el('div', 'message-list', E.listWrap);
          E.track = S.el('div', 'scrolltrack', E.listWrap);
          E.thumb = S.el('div', 'scrollthumb', E.track);
        },
        occupiedKeep: (base, S) => (v) => v !== S.els.listWrap && getComputedStyle(v).position !== 'fixed',
        availHeight: (base, S) => (occupied) => Math.max(S.spec.rows, S.els.ledger.clientHeight - occupied),
        rowHeightPx: (base, S) => (avail) => Math.max(1, Math.floor(avail / S.spec.rows)),
        rowInit: (base, S) => (r, e, i) => {
          r.addEventListener(
            'click',
            (ev) => {
              if (ev.target.closest('button,input')) return;
              ev.stopImmediatePropagation();
              S.up({ open: i });
            },
            true,
          );
        },
        listboxOptions: (base, S) => (...a) => {
          const o = base(...a);
          const source = S.els.list;
          const onScroll = o.onScroll;
          o.onScroll = (v) => {
            if (!source.isConnected) return;
            onScroll(v);
          };
          o.scrollbar.pad = S.els.docUp.offsetHeight;
          return o;
        },
        applyScroll: (base, S) => (m) => {
          const { lbx } = S.els;
          if (S.els.listKey !== null) {
            lbx.set({ scroll: m.scroll || 0 });
            const s = Math.round(lbx.scrollIndex() * 1000) / 1000;
            if (s !== (S.ctx.model.scroll || 0)) S.ctx.update({ ...S.ctx.model, scroll: s });
          }
        },
        navToggle: (base) => () => {
          navExposed = true;
          base();
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          const mrow = (k, v) => {
            const r = el('div', 'mrow', meta);
            el('b', '', r, k + ':');
            el('span', '', r, v);
          };
          mrow('From', e.name);
          mrow('Subject', e.subject);
          mrow('Date', e.time);
          mrow('To', S.spec.me.name + cc(e));
        },
        docPainted: (base, S) => () => S.els.scrollDoc(),
        paintClasses: (base, S) => (m) => {
          const { doc, root, navTrigger } = S.els;
          const effects = S.fam.helpers.sideEffects(m, S.spec),
            recovery =
              typeof effects === 'number'
                ? effects > 0
                : Array.isArray(effects)
                  ? effects.length > 0
                  : Object.values(effects || {}).some((v) => (Array.isArray(v) ? v.length > 0 : !!v));
          doc.classList.toggle('recovery-flags', recovery);
          navTrigger.classList.toggle('mailbox-switch', navExposed || recovery || m.view !== 'inbox');
          doc.classList.toggle('needs-tools', S.scenario === 'nl' && !S.D.needsToolsExcept.includes(S.spec.task));
          root.classList.toggle('has-query', !!m.query);
          root.classList.toggle('has-cc', !!m.compose?.cc);
        },
        locateAction: (base, S) => (t) => {
          if (!t.action) return;
          const { reg, root, doc, lbx } = S.els;
          const { visible, center } = S;
          let b = reg.get('toolbar:' + t.action) || reg.get('action:' + t.action);
          if (!visible(b)) {
            b =
              [...root.querySelectorAll('[data-target="action:' + t.action + '"]')].find(visible) ||
              reg.get('toolbar:' + t.action);
          }
          if (!visible(b) && ['star', 'important', 'delete'].includes(t.action)) {
            b = reg.get('rowIcon:' + S.ctx.model.open + ':' + t.action);
            if (b) lbx.scrollTo(S.ctx.model.open, 'center');
          }
          if (visible(b)) return center(b);
          if (t.action === 'inbox') {
            doc.classList.add('show-restore');
            return center(reg.get('action:inbox'));
          }
        },
        locateFolder: (base, S) => (t) => {
          if (t.folder === undefined) return;
          const b = S.els.reg.get('folder:' + t.folder);
          if (!S.visible(b)) {
            navExposed = true;
            S.els.navTrigger.classList.add('mailbox-switch');
            return S.center(S.els.navTrigger);
          }
        },
        locateRowIcon: (base, S) => (t) => {
          if (!t.rowIcon) return;
          const { reg, lbx } = S.els;
          const [i, op] = t.rowIcon;
          if (S.ctx.model.open !== i) return lbx.locateOption(i);
          const b = reg.get('toolbar:' + op) || reg.get('action:' + op);
          if (S.visible(b)) return S.center(b);
          return S.center(reg.get('rowIcon:' + i + ':' + op));
        },
      },
    },
  });
})();
