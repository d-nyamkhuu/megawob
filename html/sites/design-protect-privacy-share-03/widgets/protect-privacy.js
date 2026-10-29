// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-share-03',
  name: 'design',
  split: 'train',
  scenarios: ['share'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      view: (base, S) => (m) => {
        base(m);
        const P = S.P;
        const box = P.element('section', 'acme-inspector', S.app);
        const head = P.element('div', 'acme-head', box, 'Properties');
        P.element('button', 'acme-x', head, '×');
        const identity = P.element('div', 'acme-identity', box);
        P.element('span', 'acme-file-icon', identity, '▤');
        const idText = P.element('div', '', identity);
        P.element('strong', '', idText, S.spec.doc);
        P.element('span', 'acme-muted', idText, 'Document');
        const rows = P.element('dl', 'acme-props', box);
        const add = (label, value) => {
          P.element('dt', '', rows, label);
          P.element('dd', '', rows, value);
        };
        add('Location:', S.spec.folder || '/Engineering');
        add('Size:', S.spec.size || '24 KB');
        add('Modified:', S.spec.modified || '2024-05-20 14:28');
        add('Created:', S.spec.created || '2024-05-18 09:11');
        add('Owner:', S.spec.owner);
        add('Shared with:', `${m.people.length} ${m.people.length === 1 ? 'person' : 'people'}`);
        P.element('div', 'acme-label', box, 'Description:');
        P.element('div', 'acme-value', box, S.spec.description || `Document properties for ${S.spec.doc}.`);
        P.element('div', 'acme-label', box, 'Tags:');
        P.element('div', 'acme-value', box, S.spec.tags || 'document, shared, engineering');
      },
    },
  },
});
