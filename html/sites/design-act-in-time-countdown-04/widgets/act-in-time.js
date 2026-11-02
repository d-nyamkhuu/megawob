// Keep the template's behavior and fit the reservation to the available stage.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-countdown-04',
  name: 'design',
  split: 'train',
  scenarios: ['countdown'],
  template: 'act-in-time/base',
  design: {
    parts: {
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('ds-countdown-fit')) return;
        const style = document.createElement('style');
        style.id = 'ds-countdown-fit';
        style.textContent = `
        /* Share the stage's height so booking never falls into the chrome. */
        .ds-stage .ut-holdhead { flex: 0 0 26%; min-height: 0; }
        .ds-stage .ut-grp { display: flex; flex-direction: column; flex: 1 1 0; min-height: 0; margin: 11px 0 0; padding: 12px 18px 12px 9.5%; }
        .ds-stage .ut-grp .ut-k { flex: none; margin: 0 0 9px; }
        .ds-stage .ut-chips { flex: 1 1 0; min-height: 0; }
        .ds-stage .ut-chip { height: 100%; min-height: 0; }
        .ds-stage .ut-btn.primary { max-height: 11%; }
        @media (max-height: 800px) {
          .ds-stage .ut-grp { margin-top: 8px; padding-top: 6px; padding-bottom: 6px; }
          .ds-stage .ut-grp .ut-k { font-size: clamp(18px, 3vh, 24px) !important; margin-bottom: 5px; }
        }
        `;
        document.head.append(style);
      },
    },
  },
});
