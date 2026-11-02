// Adds the calibration date decoration and segmented time readout to the shared time design.
(function () {
  const CALENDAR_ICON = '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="20" fill="#eee9d9" stroke="#333"/><path d="M3 4h18v5H3z" fill="#688cae"/><path d="M7 1v6M17 1v6" stroke="#222" stroke-width="2"/><path d="M4 11h16M4 15h16M4 19h16M7 10v12M12 10v12M17 10v12" stroke="#555"/><path d="M8 12h3v2H8z" fill="#a84737"/><path d="M4 4h3M12 4h4" stroke="#ccc"/></svg>';

  env.widget({
    task: 'set-date',
    site: 'design-set-date-time-08',
    name: 'design',
    split: 'train',
    scenarios: ['time'],
    traits: { timeControls: ['spin'] },
    template: 'set-date/calendar',
    design: {
      title: 'Reservation Time',
      calendarIcon: CALENDAR_ICON,
      parts: {
        timeReadout: (base, S) => (txt, value, util) => {
          const p = value === null ? { h: '--', m: '--', ap: '--' } : S.fam.helpers.parts12(value);
          txt.replaceChildren();
          util.el('span', 'fd-preview-number', txt, String(p.h));
          util.el('span', 'fd-preview-colon', txt, ':');
          util.el('span', 'fd-preview-number', txt, String(p.m).padStart(2, '0'));
          util.el('span', 'fd-preview-ap', txt, p.ap);
        },
        bodyStart: (base, S) => (ctx, extras) => {
          const { util } = ctx;
          const { card, D } = S;
          util.el('div', 'fd-intro', card, 'Set the date and time for the next calibration run.');
          const date = util.el('div', 'fd-date-row', card);
          util.el('span', 'fd-date-label', date, 'Date:');
          util.el('span', 'fd-date-display', date, 'Apr 14, 2004');
          const dateIcon = util.el('span', 'fd-date-icon', date);
          dateIcon.innerHTML = D.calendarIcon;
        },
      },
    },
  });
})();
