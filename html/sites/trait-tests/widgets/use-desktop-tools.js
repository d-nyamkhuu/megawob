env.traitTests.derive('use-desktop-tools', [
  { name: 'meta', base: 'workspace', scenarios: ['terminal'], traits: { meta: true } },
  { name: 'selectors', base: 'workspace', scenarios: ['calendar'], traits: { selectors: true, dayRange: [8, 18] } },
  { name: 'tools', base: 'workspace', scenarios: ['editor'],
    traits: { tools: ['bold', 'underline', 'color', 'size', 'align-left', 'align-center', 'bullet', 'undo'] } },
]);
