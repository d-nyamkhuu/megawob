(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-autocomplete-06', 'instruction': 'top', 'briefTitle': 'Instructions' };
  const FALLBACK_MAP =
    '<svg viewBox="0 0 1180 590" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
    '<g stroke="#2b5878" stroke-width="1" stroke-dasharray="2 5" fill="none"><path d="M60 128H1170M60 220H1170M60 312H1170M60 404H1170M60 496H1170"/><path d="M60 40V540M240 40V540M420 40V540M600 40V540M780 40V540M960 40V540M1115 40V540"/></g>' +
    '<g stroke="#4fb4e8" stroke-width="1.4" fill="#0b2740" fill-opacity=".6" stroke-linejoin="round">' +
    '<path d="M110 85L180 60L260 70L300 60L350 90L330 130L300 160L250 200L260 240L220 270L190 230L150 200L120 140Z"/>' +
    '<path d="M250 290L330 285L370 320L350 380L320 440L300 480L280 420L270 340Z"/>' +
    '<path d="M560 110L600 80L660 90L700 70L760 100L720 140L650 150L600 160Z"/>' +
    '<path d="M560 200L640 195L690 230L700 300L680 380L640 420L610 380L590 300L555 250Z"/>' +
    '<path d="M700 90L800 60L960 70L1090 100L1040 160L980 220L930 300L880 260L830 200L760 190L720 150Z"/>' +
    '<path d="M900 400L980 380L1030 420L1000 470L930 470Z"/></g>' +
    '<g fill="#9ccbe8" font-family="monospace" font-size="14"><text x="12" y="132">60° N</text><text x="12" y="224">30° N</text><text x="26" y="316">0°</text><text x="12" y="408">30° S</text><text x="12" y="500">60° S</text><text x="38" y="578">180° W</text><text x="218" y="578">120° W</text><text x="396" y="578">60° W</text><text x="590" y="578">0°</text><text x="752" y="578">60° E</text><text x="920" y="578">120° E</text><text x="1090" y="578">180° E</text><text x="94" y="530" font-size="12">0</text><text x="150" y="530" font-size="12">2,500</text><text x="222" y="530" font-size="12">5,000</text><text x="290" y="530" font-size="12">7,500 km</text></g>' +
    '<path d="M96 548H306M96 540V548M166 540V548M236 540V548M306 540V548" stroke="#9ccbe8" fill="none"/>' +
    '<g stroke="#ffd83a" stroke-width="2.5" fill="none"><path d="M692 205V190H706M728 190H742V205M742 225V240H728M706 240H692V225"/><path d="M717 207V231M705 219H729"/></g>' +
    '<g stroke="#9ccbe8" fill="none"><circle cx="96" cy="58" r="22"/><path d="M96 28V88M66 58H126" /></g><g fill="#9ccbe8" font-family="monospace" font-size="12"><text x="92" y="22">N</text><text x="92" y="105">S</text><text x="52" y="62">W</text><text x="132" y="62">E</text></g></svg>';
  const MAP =
    '<svg viewBox="3 200 1183 591" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><image href="sites/design-choose-option-autocomplete-06/assets/map-reference.webp" width="1672" height="941"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="8"/><path d="M13 1V25M1 13H25M13 5L16 13L13 21L10 13Z"/></svg>';
      u.el('span', 'ds-brand', top, 'Route Planner - Global Navigation');
      const wc = u.el('span', 'ds-wc', top);
      wc.innerHTML = '<i class="ds-min"></i><i class="ds-max"></i><i class="ds-close"></i>';
      const nav = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Tools', 'Window', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const small = document.body.clientWidth <= 1100;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : small
            ? C.instruction
            : ctx.display === 'toast'
              ? 'toast'
              : ctx.display === 'panel'
                ? 'panel'
                : C.instruction;
      function fill(parent) {
        const t = String(ctx.instruction);
        const re = /("[^"]+")/g;
        let last = 0,
          m;
        while ((m = re.exec(t))) {
          if (m.index > last) parent.append(t.slice(last, m.index));
          u.el('span', 'ds-q', parent, m[1]);
          last = m.index + m[0].length;
        }
        if (last < t.length) parent.append(t.slice(last));
      }
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        const d = u.el('div', 'ds-instruction', b);
        fill(d);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      const map = u.el('div', 'ds-map', main);
      map.innerHTML = MAP;
      if (mode === 'panel') {
        const b = briefing(map, 'ds-episode-panel');
        u.el('h2', '', b, 'Route instructions');
        b.insertBefore(b.lastChild, b.firstChild);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-episode-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const ro = u.el('div', 'ds-readout', foot);
      [
        ['CURSOR', '33.4° N   44.4° E'],
        ['ELEV', '312 m'],
        ['GRID', '10°'],
        ['MODE', 'Route Planning'],
      ].forEach((r) => {
        u.el('span', '', ro, r[0]);
        u.el('span', '', ro, r[1]);
      });
      u.el('div', 'ds-spacer', foot);
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Clear');
      cancel.type = 'button';
      const reset = u.el('button', 'ds-travel-cancel', foot, 'Reset');
      reset.type = 'button';
      function decoy(button, label, collide) {
        button.dataset.role = 'xtra';
        button.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
      }
      decoy(cancel, 'Clear', false);
      decoy(reset, 'Reset', false);
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const reference = er.bool(0.5);
      const placement = reference ? 'footer' : er.pick(['toolbar', 'link']);
      const label = reference ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? nav : foot;
        submit = u.el(
          'button',
          placement === 'link' ? 'ds-end-link' : 'ds-submit' + (placement === 'toolbar' ? ' ds-toolbar-submit' : ''),
          parent,
          label,
        );
        if (placement === 'link') foot.insertBefore(submit, ro);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const word = cr.pick(options);
          const b = u.el('button', 'ds-toolbar-xtra', nav, word);
          b.type = 'button';
          decoy(b, word, true);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
