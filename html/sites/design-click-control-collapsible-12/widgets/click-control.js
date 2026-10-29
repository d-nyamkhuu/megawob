// Design of this site on the click-control/controls template (templates/click-control/controls.js): a scrollbar rail beside
// the page that scrolls the sections; each header shows a document icon and an item count, and the rows are
// compacted so every open section stays reachable.
(function () {
  'use strict';
  let sectionElements = [];
  let headers = [];
  let bodies = [];
  let naturalRowHeight = null;
  let syncScroll = () => {};
  env.widget({
    task: 'click-control',
    site: 'design-click-control-collapsible-12',
    name: 'design',
    split: 'train',
    scenarios: ['collapsible'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      parts: {
        colAcc: () => (ctx, content, b, acc) => {
          const { util } = ctx;
          const rail = util.el('div', 'uc-scrollbar', content.parentNode);
          const scrollUp = util.el('button', 'scroll-arrow up', rail, '⌃');
          scrollUp.type = 'button';scrollUp.setAttribute('aria-label', 'Scroll sections up');
          const track = util.el('div', 'scroll-track', rail);
          const thumb = util.el('div', 'scroll-thumb', track, '≡');
          const scrollDown = util.el('button', 'scroll-arrow down', rail, '⌄');
          scrollDown.type = 'button';scrollDown.setAttribute('aria-label', 'Scroll sections down');
          sectionElements = [];
          headers = [];
          bodies = [];
          naturalRowHeight = null;
          syncScroll = () => {
            // Expanding a section must leave every header and its contents reachable.
            // The page remains the stable anchor; only the rows inside it become denser.
            if (headers.length) {
              if (naturalRowHeight === null) naturalRowHeight = headers[0].getBoundingClientRect().height;
              const bodyHeight = bodies.reduce((sum, body) => sum + body.getBoundingClientRect().height, 0);
              const trim = sectionElements.reduce((sum, section) => {
                const style = getComputedStyle(section);
                return sum + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
                  + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
            }, 0);
              const fittedRowHeight = Math.min(naturalRowHeight,
                Math.max(24, (content.clientHeight - bodyHeight - trim - 2) / headers.length));
              acc.style.setProperty('--section-row-height', `${fittedRowHeight}px`);
            }
            const extent = Math.max(0, content.scrollHeight - content.clientHeight);
            const height = Math.max(24, track.clientHeight * Math.min(1, content.clientHeight / Math.max(1, content.scrollHeight)));
            thumb.style.height = `${height}px`;
            thumb.style.top = `${extent ? (track.clientHeight - height) * content.scrollTop / extent : 0}px`;
          };
          scrollUp.addEventListener('click', () => { content.scrollTop -= 70;syncScroll(); });
          scrollDown.addEventListener('click', () => { content.scrollTop += 70;syncScroll(); });
          content.addEventListener('scroll', syncScroll);
          let drag = null;
          thumb.addEventListener('pointerdown', e => { drag = { y: e.clientY, scroll: content.scrollTop };thumb.setPointerCapture(e.pointerId);e.preventDefault(); });
          thumb.addEventListener('pointermove', e => {
            if (!drag) return;
            const extent = content.scrollHeight - content.clientHeight;
            const travel = track.clientHeight - thumb.offsetHeight;
            content.scrollTop = drag.scroll + (travel > 0 ? (e.clientY - drag.y) * extent / travel : 0);syncScroll();
          });
          thumb.addEventListener('pointerup', () => { drag = null; });
          thumb.addEventListener('pointercancel', () => { drag = null; });
          track.addEventListener('click', e => { if (e.target === track) { content.scrollTop += (e.clientY < thumb.getBoundingClientRect().top ? -1 : 1) * content.clientHeight;syncScroll(); } });
        },
        colHeader: (base, S) => (ctx, sec, h, s) => {
          h.innerHTML = S.D.chevron;
          const doc = ctx.util.el('span', 'section-icon', h);
          doc.innerHTML = doc.innerHTML = '<svg class="section-doc" viewBox="0 0 26 32" aria-hidden="true"><defs><linearGradient id="section-paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#deecff"/></linearGradient></defs><path d="M2 1h15l7 7v23H2Z" fill="url(#section-paper)" stroke="#2069d1" stroke-width="1.5"/><path d="M17 1v8h7M6 12h13M6 16h13M6 20h13M6 24h13" fill="none" stroke="#3e89e6" stroke-width="1.3"/></svg>';;
          ctx.util.el('span', '', h, s.title);
          const count = s.words.length;
          ctx.util.el('span', 'section-count', h, `${count} ${count === 1 ? 'item' : 'items'}`);
        },
        colBody: (base) => (ctx, bd, s, i, links, h) => {
          sectionElements.push(bd.parentNode);
          headers.push(h);
          bodies.push(bd);
          base(ctx, bd, s, i, links, h);
        },
        colBuilt: () => () => syncScroll(),
        colSynced: () => () => syncScroll(),
      },
    },
  });
})();
