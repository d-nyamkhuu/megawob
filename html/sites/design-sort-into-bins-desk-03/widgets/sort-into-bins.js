// Design on templates/sort-into-bins/base.js: the base site's sort-into-bins widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'sort-into-bins',
  site: 'design-sort-into-bins-desk-03',
  name: 'design',
  split: 'train',
  scenarios: ['desk'],
  template: 'sort-into-bins/base',
  design: {
    parts: {
      'FOLDER_SVG': (base, S) => ({ FOLDER_SVG: (c) => `<svg viewBox="0 0 64 50"><defs><pattern id="folderDots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#555"/></pattern></defs><path d="M3 12V8Q3 4 7 4h17l7 7h24q5 0 5 5v27q0 5-5 5H8q-5 0-5-5z" fill="#eee" stroke="#080808" stroke-width="2.6"/><path d="M5 17h54v26q0 3-4 3H9q-4 0-4-4z" fill="url(#folderDots)" stroke="#080808" stroke-width="1.8"/><path d="M5 17h54" stroke="#080808" stroke-width="2.3"/></svg>` }.FOLDER_SVG),
      'TRASH_SVG': (base, S) => '<svg viewBox="0 0 64 64"><path d="M14 17h36l-3 42H17z" fill="#eee" stroke="#080808" stroke-width="3"/><path d="M10 12h44v6H10zM24 8V5h16v4" fill="#eee" stroke="#080808" stroke-width="3"/><path d="M24 23v29M32 23v29M40 23v29" stroke="#080808" stroke-width="3"/></svg>',
      'FILE_SVG': (base, S) => ({ FILE_SVG: () => '<svg viewBox="0 0 64 80"><path d="M7 3h34l16 16v55H7z" fill="#f7f7f7" stroke="#080808" stroke-width="3"/><path d="M41 3v16h16" fill="#d8d8d8" stroke="#080808" stroke-width="3"/><path d="M14 31h36M14 39h36M14 47h36M14 55h33M14 63h29" stroke="#111" stroke-width="2"/></svg>' }.FILE_SVG),
    },
  },
});
