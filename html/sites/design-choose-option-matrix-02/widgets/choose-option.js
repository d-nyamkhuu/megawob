// Design on templates/choose-option/base.js with a matrix that fits its glass card.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-matrix-02',
  name: 'design',
  split: 'train',
  scenarios: ['matrix'],
  template: 'choose-option/base',
  design: {
    parts: {
      CSS_MX: () => `
        .fp-mx { width: 100%; border-collapse: collapse; margin-top: 4px; }
        .fp-mx th, .fp-mx td { padding: 0; text-align: center; }
        .fp-mx thead th { padding: 6px 4px 8px; font-size: 12px; font-weight: 600; color: var(--muted); line-height: 1.2; vertical-align: bottom; }
        .fp-mx th.r { text-align: left; padding: 0 12px 0 10px; font-size: 14px; font-weight: 500; }
        .fp-mx tbody tr:nth-child(odd) { background: color-mix(in srgb, var(--fg) 4%, var(--panel)); }
        .fp-mx label { display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .fp-mx input { width: 17px; height: 17px; margin: 0; accent-color: var(--accent); cursor: pointer; }
        .ds-stage .fp-card { container-type: size; }
        .ds-stage .fp-mx th.r { font-size: clamp(12px, min(2.7cqw, 4.8cqh), 21px); }
        .ds-stage .fp-mx:has(tbody tr:nth-child(6)) th.r { font-size: clamp(12px, min(2.7cqw, 4cqh), 21px); }
        .ds-stage .fp-mx thead th { font-size: clamp(12px, min(2.3cqw, 4.8cqh), 18px); }
        .ds-stage .fp-mx tbody tr { height: auto; }
        .ds-stage .fp-mx label { height: 100%; min-height: 0; }
      `,
    },
  },
});
