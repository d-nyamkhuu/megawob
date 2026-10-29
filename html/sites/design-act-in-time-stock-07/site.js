(function () {
  'use strict';
  const C = { site: 'design-act-in-time-stock-07', brand: 'TradeTask', nav: ['Markets', 'Watchlist', 'Orders', 'Account'] };
  env.site({
    name: C.site, styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util, body = document.body;
      const word = (x) => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
      const rng = ctx.rng.fork('chrome/end');
      const labels = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const sampledLabel = word(rng.pick(labels));
      const sampledPlacement = ctx.finish ? 'none' : rng.pick(['dock', 'dock', 'dock', 'dock', 'header', 'link', 'icon']);
      // Preserve the existing draws; the reference pair remains the common form.
      const endRng = ctx.rng.fork('chrome/end/reference');
      const referenceEnd = endRng.bool(0.5);
      const label = referenceEnd ? 'Submit' : sampledLabel;
      const placement = ctx.finish ? 'none' : referenceEnd ? 'dock' :
        (sampledPlacement === 'dock' ? endRng.pick(['header', 'link', 'icon']) : sampledPlacement);
      const header = u.el('header', 'tt-header', body);
      u.el('div', 'tt-brand', header, C.brand);
      const nav = u.el('nav', 'tt-nav', header);
      C.nav.forEach((item) => u.el('span', '', nav, item));
      const user = u.el('div', 'tt-user', header);
      u.el('span', 'tt-user-icon', user, '●');
      u.el('b', 'tt-avatar', user, 'J');
      u.el('span', '', user, 'Jordan  ▾');
      const tools = u.el('div', 'tt-head-tools', header);
      let submit = null;
      const makeSubmit = (parent, cls, text) => {
        const b = u.el(cls === 'tt-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit'; b.setAttribute('aria-label', label); b.title = label;
        b.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const other = labels.map(word).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (other.length) {
          const text = collideRng.pick(other), decoy = u.el('button', 'tt-xtra', tools, text);
          decoy.type = 'button'; decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      if (!ctx.finish && (placement === 'header' || placement === 'icon')) submit = makeSubmit(tools, placement === 'icon' ? 'tt-end-button tt-icon-end' : 'tt-end-button', placement === 'icon' ? '✓' : label);
      // Use available frame space, before the stage is laid out or anchored.
      const roomy = body.clientWidth >= 1536;
      const tall = body.clientHeight >= 740;
      const display = (ctx.display === 'panel' && !roomy) ||
        (ctx.display === 'toast' && !tall) ? 'header' : ctx.display;
      body.classList.toggle('tt-hidden-goal', display === 'hidden');
      body.classList.toggle('tt-finish-episode', !!ctx.finish);
      if (display === 'header') {
        const note = u.el('section', 'tt-instruction', body);
        u.el('span', 'tt-roundel', note, '◉');
        u.el('div', '', note, ctx.instruction);
      }
      const main = u.el('main', 'tt-workspace' + (display === 'panel' ? ' has-panel' : ''), body);
      if (display === 'panel') {
        const note = u.el('aside', 'tt-panel-note', main);
        u.el('b', '', note, 'Task'); u.el('div', '', note, ctx.instruction);
      }
      const stage = u.el('div', 'ds-stage', main);
      if (display === 'toast') {
        const note = u.el('aside', 'tt-toast', body, ctx.instruction);
        const close = u.el('button', '', note, '×'); close.type = 'button';
        close.setAttribute('aria-label', 'Close'); close.title = 'Close';
        // Keep the reserved note space so dismissing it cannot move task anchors.
        close.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
        body.insertBefore(note, main);
      }
      const dock = u.el('footer', 'tt-dock', body);
      const dockItems = [['▱', 'Trade'], ['★', 'Watchlist'], ['▤', 'Orders'], ['⌕', 'Research'], ['♧', 'Alerts'], ['♟', 'Account']];
      dockItems.forEach(([icon, text], i) => {
        const item = u.el('button', i === 0 ? 'tt-dock-item active' : 'tt-dock-item', dock);
        item.type = 'button'; u.el('span', 'tt-dock-icon', item, icon); u.el('span', '', item, text);
        item.addEventListener('click', () => env.log('decoy', { what: 'dock', label: text }));
      });
      if (!ctx.finish && (placement === 'dock' || placement === 'link')) u.el('span', 'tt-dock-divider', dock);
      if (!ctx.finish && placement === 'dock') submit = makeSubmit(dock, 'tt-dock-submit', label);
      if (!ctx.finish && placement === 'link') submit = makeSubmit(dock, 'tt-end-link', label + '  ›');
      if (ctx.finish) dock.classList.add('finish-mode');
      if (placement === 'header' || placement === 'icon') dock.classList.add('no-end');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util, el = u.el('section', 'tt-overlay tt-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Your watchlist has been updated.', chat: 'Hello. How can we help?', promo: 'Explore more market tools.', banner: 'Market data refresh is scheduled shortly.' };
      u.el('div', '', el, texts[ctx.kind] || texts.toast);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
