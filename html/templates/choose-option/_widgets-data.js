/* choose-option/_widgets-data: constants, tokens and DOM helpers of widgets. */
(function () {
  'use strict';
  env.template('choose-option/_widgets-data', () => {
    const CSS = env.templateLib('choose-option/_styles').WIDGET_CSS;

    const CHEV =
      '<svg class="fp-chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg>';

    const TICK =
      '<svg class="fp-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';

    const SEARCH =
      '<svg class="fp-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14"/></svg>';

    const OK =
      '<svg class="fp-ok" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';

    const BOXTICK =
      '<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';

    function ensureStyle(id, css) {
      if (document.getElementById(id)) return;
      const s = document.createElement('style');
      s.id = id;
      s.textContent = css;
      document.head.append(s);
    }

    const center = (el) => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    };

    const req = (el, what) => {
      if (!el || !el.isConnected) throw new Error(`choose-option: ${what} is not rendered`);
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) throw new Error(`choose-option: ${what} is hidden`);
      return center(el);
    };

    const TOKENS = {
      cardClass: 'fp-card',
      cardWidth: true,
      radius: '3px',
      controlRadius: '2px',
      titleTag: 'div',
      titleClass: 'fp-title',
      titleText: null,
      note: true,
      fieldClass: 'fp-field',
      compact: false,
      freeze: true,
      scale: true,
      scaleBeforeLayout: false,
      scaleInset: 10,
      // choices
      choiceFlow: null,
      choiceRows: null,
      choiceRowsVar: null,
      choiceRowsDivisor: 3,
      clearSelector: null,
      detailTable: {},
      detailFallback: null,
      // radio
      emailHeader: false,
      emailTitle: 'Email Preferences',
      emailNote:
        'Select how often you would like to receive emails from Riverton University. You can change these settings at any time.',
      emailContent: false,
      emailContentTitle: 'Email content:',
      emailOptions: ['University news', 'Events and activities', 'Alumni stories'],
      resetSelector: null,
      optionCount: false,
      // dropdown
      chevron: CHEV,
      rowMaxExtra: 0,
      revealOptions: false,
      details: false,
      motif: false,
      motifTitle: 'Title:',
      motifValue: 'Update user guide',
      motifFields: [
        ['Priority:', 'Medium'],
        ['Due Date:', 'Apr 24, 1991'],
        ['Status:', 'In Progress'],
      ],
      // autocomplete
      searchSvg: SEARCH,
      okSvg: OK,
      marker: false,
      travelExtra: false,
      suggestionColumns: false,
      // listbox
      sampleRows: true,
      syncScroll: true,
      scrollPad: 2,
      minThumb: 28,
      keyboard: false,
      railClass: 'fp-rail',
      arrows: true,
      arrowClass: 'fp-arrow',
      arrowUp: '⌃',
      arrowDown: '⌄',
      arrowStep: 'row',
      stopArrows: false,
      integralRows: false,
      emptyText: 'Nothing selected',
      rowBox: false,
    };

    const SCENARIOS = {
      radio: {
        emailHeader: true,
        emailContent: true,
        resetSelector: '.ds-reset',
        optionCount: true,
        scaleBeforeLayout: true,
        scaleInset: 8,
      },
      dropdown: { details: true, motif: true, scaleBeforeLayout: true, scaleInset: 8 },
      autocomplete: {
        marker: true,
        titleTag: 'h3',
        titleClass: 'ds-destination-title',
        titleText: 'Destination',
        travelExtra: true,
        suggestionColumns: true,
        scale: false,
      },
      listbox: { compact: true, syncScroll: false, integralRows: true },
    };
    return { CSS, CHEV, TICK, SEARCH, OK, BOXTICK, ensureStyle, center, req, TOKENS, SCENARIOS };
  }, { uses: ['choose-option/_styles'] });
})();
