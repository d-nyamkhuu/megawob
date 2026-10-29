(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-06',
    'brand': 'Account Setup',
    'rail': 'Create Password|Profile Details|Preferences|Finish',
    'menu': 'File|Edit|View|Window|Help',
    'instruction': 'top',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const mb = u.el('header', 'ds-menubar', document.body);
      const ap = u.el('span', 'ap', mb);
      ap.innerHTML =
        '<svg width="18" height="22" viewBox="0 0 18 22"><path fill="#f2f5f9" d="M12.6 0c.1 1.4-.4 2.6-1.2 3.4-.8.9-1.9 1.4-3 1.3-.1-1.300.5-2.600 1.300-3.400C10.600.4 11.700-.1 12.600 0zM16.800 15.800c-.6 1.400-1.400 2.800-2.500 3.900-.9.9-1.800 1.300-2.800 1.300-1.100 0-1.600-.5-2.800-.5s-1.800.5-2.800.5c-1 0-1.900-.5-2.800-1.400C1.200 18.200.2 14.500 1.800 11.800c.8-1.400 2.200-2.200 3.600-2.200 1.100 0 2 .6 2.800.6.800 0 1.700-.7 3-.6.6 0 2.200.2 3.200 1.700-2.600 1.500-2.200 5.200.4 6.500z"/></svg>';
      u.el('b', '', mb, C.brand);
      C.menu.split('|').forEach((t) => u.el('span', '', mb, t));
      u.el('span', 'sp', mb);
      const st = u.el('span', 'st', mb);
      st.innerHTML =
        '<svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="#f2f5f9" stroke-width="2"><path d="M1 6a14 14 0 0 1 20 0M4 10a9 9 0 0 1 14 0M8 14a4 4 0 0 1 6 0"/></svg><svg width="26" height="18" viewBox="0 0 26 18" fill="#f2f5f9" stroke="#f2f5f9" stroke-width="2"><path d="M1 6h4l5-4v14l-5-4H1z" stroke="none"/><path d="M14 5q3 4 0 8M18 3q5 6 0 12" fill="none"/></svg>';
      u.el('span', '', mb, 'Mon Jun 15  10:24 AM');
      const sr = u.el('span', '', mb);
      sr.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#f2f5f9" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="M12.500 12.500L19 19"/></svg>';
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-tbar', win);
      const lt = u.el('div', 'ds-lights', tb);
      u.el('i', '', lt);
      u.el('i', '', lt);
      u.el('i', '', lt);
      u.el('span', '', tb, C.brand);
      const body = u.el('div', 'ds-body', win);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => u.el('div', i === 0 ? 'on' : '', rail, t));
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'top';
      u.el('h1', '', content, 'Create Your Account');
      u.el('div', 'sub', content, 'A secure password helps keep your account safe.');
      if (mode === 'top' || mode === 'toast') {
        const b = u.el('aside', mode === 'toast' ? 'ds-header-note ds-toast-slot' : 'ds-header-note', content);
        u.el('div', 'ds-instruction', b, ctx.instruction);
      } else {
        u.el('div', 'ds-note-slot', content);
      }
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-header-note ds-toast', content);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endR.bool(0.5);
      const placement = referenceEnd ? 'footer' : endR.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endWords);
      const decoyBtn = (parent, label, collide = false) => {
        const b = u.el('button', 'ds-cancel ds-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      const headerTools = u.el('div', 'ds-end-tools', tb);
      if (!ctx.finish) {
        decoyBtn(foot, 'Cancel');
        submit = u.el(
          'button',
          placement === 'link' ? 'ds-endlink' : 'ds-submit',
          placement === 'header' ? headerTools : foot,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      } else foot.classList.add('ds-footer-ready');
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const words = endWords.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (words.length)
          decoyBtn(placement === 'header' && !ctx.finish ? foot : headerTools, collideR.pick(words), true);
      }
      const nt = u.el('div', 'ds-notes', document.body);
      const nb = u.el('div', 'ds-tbar', nt);
      const nl = u.el('div', 'ds-lights', nb);
      u.el('i', '', nl);
      u.el('i', '', nl);
      u.el('i', '', nl);
      u.el('span', '', nb, 'Notes');
      const tool = u.el('div', 'ds-ntool', nt);
      const glyphs = [
        '<path d="M6 3H2v19h19V11M8 3h14v14M9 15L22 2"/>',
        '<path d="M6 6h13l-2 17H8zM4 6h17M9 6V3h8v3M11 10v9M15 10v9"/>',
        '<path d="M14 4l8 6-8 6v-4c-6 0-9 3-10 7 0-8 4-11 10-11zM3 12v11h19v-8"/>',
      ];
      ['New Note', 'Delete', 'Share'].forEach((t, i) => {
        const b = u.el('div', 'tool-item', tool);
        b.innerHTML =
          '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">' +
          glyphs[i] +
          '</svg>';
        u.el('span', '', b, t);
      });
      u.el('div', 'search', tool, 'Search');
      const paper = u.el('div', 'ds-npaper', nt);
      u.el('b', '', paper, 'Account Setup');
      if (mode !== 'hidden') u.el('div', '', paper, ctx.instruction);
      const dock = u.el('div', 'ds-dock', document.body);
      const drawings = [
        '<rect x="5" y="8" width="58" height="55" rx="3" fill="url(#blue)"/><path d="M39 8h24v55H35l-2-23h-7L39 8" fill="#eee"/><path d="M21 21v10M49 21v10M17 44q17 12 36 0M34 40v27" fill="none" stroke="#111" stroke-width="2"/>',
        '<circle cx="34" cy="35" r="30" fill="#111" stroke="#ddd" stroke-width="3"/><circle cx="34" cy="35" r="24" fill="#242424" stroke="#888"/><g fill="#eee" font-size="9" font-family="Georgia" text-anchor="middle"><text x="34" y="19">0</text><text x="50" y="27">1</text><text x="53" y="43">2</text><text x="43" y="55">3</text><text x="24" y="56">4</text><text x="15" y="43">5</text><text x="18" y="27">6</text></g><path d="M34 8v6M60 35h-6M34 61v-5M8 35h6" stroke="#eee" stroke-width="1.5"/><path d="M34 35l-7-17" stroke="#e34" stroke-width="3"/><circle cx="34" cy="35" r="4" fill="#eee"/>',
        '<g transform="rotate(-12 34 34)"><path d="M8 5h52v61H8z" fill="#eee" stroke="#fff" stroke-width="3" stroke-dasharray="2 3"/><rect x="12" y="9" width="44" height="53" fill="url(#blue)"/><path d="M24 37q6-8 5-16l-4-9 9 1 4 7-1 11 13 18-15-5-7 4-5-7-8-3z" fill="#806137" stroke="#382a1a"/><path d="M29 25l12 13 10 11-7-1-15-12z" fill="#c3a371"/><path d="M30 29l13 12M30 32l13 12M31 36l8 8M27 39l8 4" stroke="#483522"/><path d="M27 14l-6 2 7 3" fill="#ddbd7b"/><circle cx="30" cy="17" r="1" fill="#000"/><path d="M25 48l-3 7M30 47l-3 7" stroke="#765023" stroke-width="2"/><path d="M14 56l39-9" stroke="#ccc" opacity=".5"/></g>',
        '<circle cx="34" cy="35" r="30" fill="url(#blue)" stroke="#eee" stroke-width="3"/><circle cx="34" cy="35" r="26" fill="none" stroke="#eee" stroke-dasharray="1 4" stroke-width="3"/><path d="M49 14L28 39l-8 16 20-24z" fill="#fff"/><path d="M49 14L34 35l-6 4z" fill="#ec4745"/><path d="M34 35l-14 20 20-24z" fill="#ddd"/>',
        '<g transform="rotate(-9 34 34)"><rect x="8" y="9" width="51" height="54" fill="#f0f0ec" stroke="#777" stroke-width="3"/><path d="M8 9h51v16H8z" fill="#d66053"/><path d="M17 3v14M29 3v14M42 3v14M53 3v14" stroke="#ddd" stroke-width="3"/><text x="34" y="34" text-anchor="middle" font-family="Arial" font-size="10" fill="#222">JUN</text><text x="34" y="57" text-anchor="middle" font-family="Arial" font-size="28" fill="#222">15</text></g>',
        '<g transform="rotate(-10 34 34)"><rect x="10" y="6" width="47" height="58" rx="3" fill="#ae8950" stroke="#dcc28c" stroke-width="2"/><path d="M15 6v58M53 8v54" stroke="#6c4e28" stroke-width="2"/><circle cx="34" cy="29" r="7" fill="none" stroke="#765830"/><path d="M22 49q0-15 12-15t12 15z" fill="none" stroke="#765830"/><path d="M56 21h5v12h-5M56 40h5v12h-5" fill="#d2c378"/></g>',
        '<g transform="rotate(-13 34 34)"><rect x="9" y="7" width="46" height="51" fill="#fff"/><rect x="12" y="10" width="40" height="43" fill="url(#blue)"/><path d="M12 42l15-17 8 14 17-15v29H12z" fill="#b29a4c"/><rect x="2" y="23" width="38" height="38" fill="#fff"/><rect x="5" y="26" width="32" height="31" fill="#3c7cc0"/><path d="M5 49l12-17 9 14 11-4v15H5z" fill="#ae693e"/></g><circle cx="51" cy="48" r="14" fill="#222" stroke="#ddd" stroke-width="3"/><circle cx="51" cy="48" r="9" fill="#586571" stroke="#aaa"/>',
        '<circle cx="34" cy="35" r="30" fill="url(#blue)" stroke="#eee" stroke-width="3"/><path d="M29 21v29q-16 9-16-2 0-8 12-6V18l25-6v32q-15 9-15-2 0-7 11-6V21z" fill="#eee" stroke="#b4d8f6"/>',
        '<rect x="5" y="7" width="58" height="57" rx="3" fill="url(#silver)" stroke="#ddd" stroke-width="2"/><rect x="10" y="13" width="48" height="45" fill="#353839"/><g transform="translate(34 36)"><path d="M-5-23h10l2 7 6-4 7 7-4 6 7 2v10l-7 2 4 6-7 7-6-4-2 7H-5l-2-7-6 4-7-7 4-6-7-2V-5l7-2-4-6 7-7 6 4z" fill="url(#silver)" stroke="#222"/><circle r="11" fill="#333" stroke="#aaa" stroke-width="4"/></g>',
        '<path d="M2 19V13q0-4 5-4h18l7 8h29q5 0 5 5v39H2z" fill="url(#folder)" stroke="#6598b7"/>',
        '<path d="M13 11h44L51 61q-17 10-32 0z" fill="url(#silver)" stroke="#ddd"/><ellipse cx="35" cy="11" rx="23" ry="7" fill="#999" stroke="#eee" stroke-width="2"/><ellipse cx="35" cy="12" rx="18" ry="4" fill="#222"/><path d="M23 19l5 38M33 20v40M43 19l-3 39" stroke="#ddd" opacity=".4"/>',
      ];
      drawings.forEach((s, i) => {
        const icon = u.el('i', 'dock-icon dock-' + i, dock);
        icon.innerHTML =
          '<svg viewBox="0 0 68 70"><defs><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#6dc4f9"/><stop offset="1" stop-color="#1859ac"/></linearGradient><linearGradient id="silver" x2="1" y2=".2"><stop stop-color="#ddd"/><stop offset=".3" stop-color="#777"/><stop offset=".7" stop-color="#444"/><stop offset="1" stop-color="#bbb"/></linearGradient><linearGradient id="folder" x2="0" y2="1"><stop stop-color="#81b5cf"/><stop offset="1" stop-color="#3c7ea8"/></linearGradient></defs>' +
          s +
          '</svg>';
      });
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
