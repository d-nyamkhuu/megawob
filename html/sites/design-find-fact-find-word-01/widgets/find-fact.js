// Site design on find-fact/find-word; shared widget code lives in templates/find-fact/find-word.js.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-find-word-01',
  name: 'design',
  split: 'train',
  scenarios: ['find-word'],
  template: 'find-fact/find-word',
  design: {
    sampledFrame: false,
    parts: {
      readingTitle: () => () => 'Document Viewer',
      paragraphs: (base, S) => (ctx, rc, body) => {
        const { util, spec } = ctx;
        const source = util.el('div', 'rl-source', body);
        for (const p of spec.paragraphs) util.el('p', '', source, p + ' ');
      },
      fit: (base, S) => (ctx, B) => {
        const { work, rc } = B;
        work.querySelector('.rl-form > h3').textContent = 'Your answer';
        const sr=ctx.stage.getBoundingClientRect();for(let fs=innerHeight>820?24:18;fs>=13;fs--){rc.style.setProperty('--rl-fs',fs+'px');const input=work.querySelector('.rl-input');if(work.scrollHeight<=ctx.size.height+1&&work.scrollWidth<=ctx.size.width+1&&(!input||input.getBoundingClientRect().bottom<=sr.bottom-8))break;}
      },
    },
  },
});
