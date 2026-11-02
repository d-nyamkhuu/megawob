/* choose-option/_base-frame: initialize reference units in their original order.
 * Every original unit keeps its design.parts hook and live scope entry.
 */
(function () {
  'use strict';
  function initialize(scopeRef, set, __has, __parts) {
    set('CSS', __has('CSS') ? __parts['CSS'](undefined, scopeRef) : (scopeRef.env.templateLib('choose-option/_styles').CSS));

    set('CSS3', __has('CSS3') ? __parts['CSS3'](undefined, scopeRef) : (scopeRef.env.templateLib('choose-option/_styles').CSS3));

    set('CHEV', __has('CHEV') ? __parts['CHEV'](undefined, scopeRef) : ('<svg class="fp-chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>'));

    set('TICK', __has('TICK') ? __parts['TICK'](undefined, scopeRef) : ('<svg class="fp-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>'));

    set('SEARCH', __has('SEARCH') ? __parts['SEARCH'](undefined, scopeRef) : ('<svg class="fp-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg>'));

    set('OK', __has('OK') ? __parts['OK'](undefined, scopeRef) : ('<svg class="fp-ok" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>'));

    set('BOXTICK', __has('BOXTICK') ? __parts['BOXTICK'](undefined, scopeRef) : ('<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>'));

    set('st', __has('st') ? __parts['st'](undefined, scopeRef) : (null));

    set('st2', __has('st2') ? __parts['st2'](undefined, scopeRef) : (null));

    if (__has('stmt0.0')) __parts['stmt0.0'](undefined, scopeRef);
    else window.addEventListener('pointerdown', (e) => {
      for (const s of [scopeRef.st, scopeRef.st2]) if (s && s.outside && s.alive()) s.outside(e);
    }, true);

    set('center', __has('center') ? __parts['center'](undefined, scopeRef) : { center: (el) => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    } }.center);

    set('req', __has('req') ? __parts['req'](undefined, scopeRef) : { req: (el, what) => {
      if (!el || !el.isConnected) throw new Error(`choose-option: ${what} is not rendered`);
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) throw new Error(`choose-option: ${what} is hidden`);
      return scopeRef.center(el);
    } }.req);

    set('set', __has('set') ? __parts['set'](undefined, scopeRef) : { set: (patch) => scopeRef.st.ctx.update({ ...scopeRef.st.ctx.model, ...patch }) }.set);

    set('CSS_MX', __has('CSS_MX') ? __parts['CSS_MX'](undefined, scopeRef) : (scopeRef.env.templateLib('choose-option/_styles').CSS_MX));

    set('WIDTH', __has('WIDTH') ? __parts['WIDTH'](undefined, scopeRef) : ({
      dropdown: [380, 500], radio: [400, 520], checkbox: [440, 580], autocomplete: [400, 520], listbox: [400, 520],
      grouped: [400, 520], combobox: [440, 560], chips: [460, 600], tags: [460, 600], toggles: [460, 560], tree: [380, 480], dependent: [400, 500],
      matrix: [660, 780],
    }));

    set('POPUP', __has('POPUP') ? __parts['POPUP'](undefined, scopeRef) : (new Set(['dropdown', 'autocomplete', 'grouped', 'combobox', 'chips', 'tags', 'dependent'])));

  }
  env.template('choose-option/_base-frame', () => ({ initialize }));
})();
