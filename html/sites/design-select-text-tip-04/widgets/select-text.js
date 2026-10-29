// Inkline's document styling on the shared highlight template. The template
// retains its native selection, hover hints, seeded content and fitting logic.
env.widget({
  task: 'select-text',
  site: 'design-select-text-tip-04',
  name: 'design',
  split: 'train',
  scenarios: ['tip'],
  template: 'select-text/base',
  design: {
    parts: {
      // Keep the sheet's typography in the widget, where the template measures it
      // before freezing anchors and can reduce the font for longer passages.
      ensureStyle: (base, S) => () => {
        env.util.css('hl-style', S.CSS);
        env.util.css('inkline-document', `
          .kinetic .inkline-stage .hl-card {
            flex: 1 1 0; min-width: 0; max-width: 880px; min-height: calc(100cqh - 32px);
            border: 1px solid #dce5ee; border-radius: 11px;
            background: #fff; box-shadow: 0 1px 3px #10223808;
          }
          .kinetic .inkline-stage .hl-card:has(.hl-panerow) { min-height: 0; }
          .kinetic .inkline-stage .hl-head {
            display: block; flex: none; margin: 0 56px;
            padding: 32px 0 20px; border-bottom: 1px solid #dce5ee;
          }
          .kinetic .inkline-stage .hl-head:before {
            content: "PROJECT AURORA"; display: block; color: #102238;
            font: 900 clamp(58px, 8vw, 132px)/.92 Impact,"Arial Narrow",sans-serif;
            letter-spacing: -.045em; white-space: nowrap;
            transform: scaleX(.68); transform-origin: left center;
          }
          .kinetic .inkline-stage .hl-kicker { display: block; margin-top: 9px; font-size: 0; line-height: 1; }
          .kinetic .inkline-stage .hl-kicker:after { content: "O V E R V I E W"; font: 700 25px/1 Arial,sans-serif; color: #71839a; }
          .kinetic .inkline-stage .hl-title, .kinetic .inkline-stage .hl-meta, .kinetic .inkline-stage .hl-foot { display: none; }
          .kinetic .inkline-stage .hl-text {
            width: calc(100% - 114px); max-width: 700px;
            margin: auto 0 auto 66px; padding: 16px; color: #15243c;
            /* Preserve the original 26px prose, while following the template's
               fitted line metric down to 12px for longer documents. */
            font-size: clamp(12px, calc(var(--hl-lh) * 4 - 70px), 26px) !important;
            line-height: 1.3 !important;
          }
          .kinetic .inkline-stage .hl-text p { margin: 0; }
          .kinetic .inkline-stage .hl-text p + p { margin-top: var(--hl-gap); }
          .kinetic .inkline-stage .hl-text.numbered p:before { display: none; }
          .kinetic .inkline-stage .hl-text.serif { font-family: Georgia,"Times New Roman",serif; }
          .kinetic .inkline-stage .hl-tip, .kinetic .inkline-stage .hl-link { color: #102e5a; text-decoration: underline dotted #1684ff; text-decoration-thickness: 1.5px; text-underline-offset: 4px; }
          @container (max-height: 580px) {
            .kinetic .inkline-stage .hl-head { padding: 16px 0 12px; margin: 0 24px; }
            .kinetic .inkline-stage .hl-head:before { font-size: clamp(48px, 6.5vw, 90px); }
            .kinetic .inkline-stage .hl-kicker:after { font-size: 19px; }
            .kinetic .inkline-stage .hl-text { width: auto; max-width: none; margin: auto 0; padding: 16px 28px; }
          }
        `);
      },
    },
  },
});
