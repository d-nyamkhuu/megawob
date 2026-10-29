// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      base(_c);
      // The Open Look title and toolbar need more vertical room than the base
      // frame. Use its header fallback before a toast can cover the file rows.
      if (_c.display === 'toast' && _c.H < 800) {
        _c.display = 'header';
        document.body.classList.remove('ref-has-note');
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const toolbar = util.el('div', 'ol-toolbar', document.body);
      const tools = [['←','Back'], ['→','Forward'], ['↑','Up'], ['✂','Cut'], ['▣','Copy'], ['▧','Paste'], ['✕','Delete'], ['▦','Icons'], ['▤','Details']];
      for (const [icon, label] of tools) {
        if (label === 'Cut' || label === 'Delete' || label === 'Icons') {
          util.el('i', 'ol-toolbar-sep', toolbar);
        }
        const b = util.el('div', 'ol-toolbar-button', toolbar);
        util.el('span', 'ol-toolbar-icon', b, icon);
        util.el('span', 'ol-toolbar-label', b, label);
        b.setAttribute('role', 'button');
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => {
          const wanted = label.toLowerCase();
          const native = [...document.querySelectorAll('button,[role="button"]')]
            .find((candidate) => candidate !== b && candidate.textContent.trim().toLowerCase() === wanted);
          if (native) native.click();
        });
      }
      const appTitle = util.el('div', 'ol-app-title', document.body);
      util.el('span', 'ol-app-folder', appTitle, '▰');
      util.el('strong', '', appTitle, 'File Manager');
      const controls = util.el('span', 'ol-window-controls', appTitle);
      util.el('i', '', controls, '−');
      util.el('i', '', controls, '□');
      util.el('i', '', controls, '×');

      // A passive companion index, matching the reference's related-records pane.
      // It is visual frame only; file rows and all task interactions remain in the widget.
      const related = util.el('aside', 'ol-related', document.body);
      util.el('div', 'ol-related-title', related, 'Related Records');
      util.el('div', 'ol-related-head', related, 'Name                                      Type');
      const relatedRows = [
        ['Budget_2024.xlsx', 'Spreadsheet'], ['meeting notes-signed.pptx', 'Presentation'],
        ['ProjectPlan_2024-12.pdf', 'PDF Document'], ['Proposal v2 FINAL.fig', 'FIG File'],
        ['Resume_2020-05_Friedman.rtf', 'RTF Document'], ['Schedule_2024-12_Schmidt.7z', '7z Archive'],
        ['Forecast_2020-05_Karam.odt', 'OpenDocument Text'], ['TeamPhoto.jpg', 'JPEG Image'],
        ['todo.txt', 'Text Document'], ['Travel_Itinerary.pdf', 'PDF Document'],
      ];
      for (const [file, type] of relatedRows) {
        const row = util.el('div', 'ol-related-row', related);
        util.el('span', '', row, file);
        util.el('span', '', row, type);
      }
      Object.assign(_c, { appTitle, controls, related, relatedRows, stage, toolbar, tools });
    },
  };

  env.site({
    name: 'design-use-file-manager-rangemix-02',
    template: 'site/base',
    design: { parts },
  });
})();
