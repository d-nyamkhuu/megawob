// Site design on find-fact/similar; shared widget code lives in templates/find-fact/similar.js.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-05',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    briefText: 'Choose one or more matching words for each given word.',
    parts: {
      begin: (base, S) => (ctx) => {
        const tools = ctx.util.el('div', 'ds-utilities', ctx.stage);
        const settings = ctx.util.el('button', '', tools);
        settings.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 2-1 3-3 1-2 3 2 3-1 3 3 2 2 3 3-1 3 1 2-3 3-2-1-3 2-3-2-3-3-1-1-3z"/><circle cx="12" cy="11" r="3"/></svg>Settings';
        const help = ctx.util.el('button', '', tools);
        help.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 2v2"/></svg>Help';
      },
      framed: (base, S) => (ctx, frame, up) => {
        base(ctx, frame, up);
        const brief = document.querySelector('.ds-brief');
        if (!brief) return;
        const vocabularyNote = ctx.util.el('p', 'ds-note', brief);
        vocabularyNote.innerHTML = 'All words are from a <u>general</u> vocabulary. Some options may not be related.';
        ctx.util.el('p', 'ds-note ds-selection-note', brief,
          'Nothing is selected yet. Click the checkboxes, then finish when you are ready.');
      },
      grid: (base, S) => (ctx, c, body, grid) => {
        const { util, spec } = ctx;
        const sources = util.el('div', 'rl-sources', body);
        spec.given.forEach((word) => util.el('div', 'rl-source', sources, word));
        body.style.setProperty('--source-count', spec.given.length);
        body.style.setProperty('--option-rows', Math.max(spec.given.length, Math.ceil(spec.words.length / 4)));
        body.style.setProperty('--compact-rows', Math.max(spec.given.length, Math.ceil(spec.words.length / 3)));
        const backdrops = util.el('div', 'rl-row-backgrounds', body);
        for (let i = 0; i < Math.max(spec.given.length, Math.ceil(spec.words.length / 4)); i++) util.el('div', '', backdrops);
      },
      marked: (base, S) => (ctx, m) => {
        const note = document.querySelector('.ds-selection-note');
        if (note) note.textContent = m.values.length
          ? `${m.values.length} word${m.values.length === 1 ? '' : 's'} selected. You can change your choices or clear all.`
          : ctx.finish ? 'Nothing is selected yet. Click the checkboxes, then finish when you are ready.'
            : 'Nothing is selected yet. Click the checkboxes, then press ' +
              (document.querySelector('[data-role=submit]')?.getAttribute('aria-label') || 'Submit') + ' when you are ready.';
      },
      ready: (base, S) => (ctx, B) => {
        const { up, ch, mark } = B;
        env.widgetDef.clear = () => { up({ values: [] }); ch.set([]); mark(ctx.model); };
      },
    },
  },
});
