// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-comments-04',
  name: 'design',
  split: 'train',
  scenarios: ['comments'],
  template: 'use-slides/office',
  design: {
    uiFont: '"Courier New", monospace',
    documentFont: 'Georgia, "Times New Roman", serif',
    brand: 'Office Suite',
    workspace: 'Review Document',
    editorLabel: 'Office Suite document review',
    frameInset: 6,
    compactAt: 850,
    tightAt: 620,
    navigationAt: 0,
    inspectorAt: 0,
    outlineAt: 9999,
    reviewWidth: 300,
    compactReviewWidth: 260,
    maxScale: 1.6,
    parts: {
      outline: (base, S) => (main) => undefined,
      navigation: (base, S) => (main) => undefined,
      comments: (base, S) => (side, body) => {
        base(side, body);
        side.classList.add('gem-comment-pane');
        const stage = side.closest('.ref-stage');
        if (stage) {
          const nodes = Array.from(stage.querySelectorAll('*'));
          const mark = (test, cls, maxHeight) => {
            const found = nodes.filter((el) => {
              const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
              const r = el.getBoundingClientRect();
              return test(text) && r.width > stage.clientWidth * 0.42 && r.height > 8 && r.height < maxHeight;
            }).sort((a, b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height);
            if (found[0]) found[0].classList.add(cls);
          };
          mark((t) => t.includes('Review notes.doc') && t.includes('Launch checklist.doc'), 'gem-web-files', 100);
          mark((t) => /\bFile\s+Edit\s+View\s+Insert\s+Format\s+Review\s+Help\b/.test(t), 'gem-web-menu', 80);
          mark((t) => t.includes('Normal text') && t.includes('Sans') && t.includes('Fit'), 'gem-web-format', 100);
          mark((t) => t.includes('Words:') && t.includes('Comments:'), 'gem-web-status', 70);
          mark((t) => t.includes('New comment') && t.includes('Reviewers'), 'gem-review-actions', 65);
          for (const button of nodes.filter((el) => /^(All markup|Reviewers)$/.test((el.innerText || '').trim()))) button.classList.add('gem-extra-action');
        }
        let host = side.parentElement;
        while (host && host.parentElement) {
          const peer = Array.from(host.children).find((el) => el !== side && (el.textContent || '').length > 250);
          if (peer) {
            host.classList.add('gem-doc-review-row');
            peer.classList.add('gem-document-pane');
            break;
          }
          side = host;
          host = host.parentElement;
        }
      },
    },
  },
});
