/* use-file-manager/reporting.js: shared reporting; loaded through logic.js files before the scenarios. */
(function () {
  'use strict';
  const lib = env.taskOf('use-file-manager').lib;
  const { C, childrenOf, itemOf, nameOf, parentOf, isDeleted, effective } = lib;

  function dateText(iso) {
    if (C.formatDate) {
      try { return C.formatDate(iso, 'en-US', 'medium'); } catch (e) { /* fall through */ }
    }
    const [y, mo, d] = iso.split('-').map(Number);
    return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][mo - 1]} ${d}, ${y}`;
  }

  // What the window shows at the end: the status bar of the open folder, the path bar, the selection count, the viewer.
  function factsOf(m, spec) {
    const n = childrenOf(m, spec, m.cwd).length;
    const out = [
      { label: 'Items', value: `${n} ${n === 1 ? 'item' : 'items'}`, aliases: [String(n)], labels: ['Item count', 'Number of items', 'Items in this folder'] },
      { label: 'Current folder', value: itemOf(spec, m.cwd).name, labels: ['Folder', 'Location', 'Current location'] },
    ];
    if (m.viewer) {
      const f = itemOf(spec, m.viewer);
      out.push({ label: 'File size', value: f.size, labels: ['Size'] });
      out.push({ label: 'Modified', value: dateText(f.date), aliases: [f.date], labels: ['Date modified', 'Last modified'] });
    } else if (m.selected.length) {
      out.push({ label: 'Selected', value: `${m.selected.length} selected`, aliases: [String(m.selected.length)], labels: ['Selection', 'Selected items'] });
    }
    return out;
  }

  // preempt=cancel: the files by name (value: name now, deleted or folder, copies made), "Selection" where the selection is
  // the goal, "Current folder" for navigate and "Opened file" for open. A name two files share gets its folder.
  function partsOf(m, spec) {
    const count = new Map();
    for (const f of spec.files) count.set(f.name, (count.get(f.name) || 0) + 1);
    const g = spec.goal;
    const copies = (id) => (m.copies || []).filter((c) => c.slice(1).split('_')[0] === id && !isDeleted(m, c)).length;
    const out = spec.files.map((f) => ({
      name: count.get(f.name) > 1 ? `${f.name} (${itemOf(spec, f.parent).name})` : f.name,
      value: [nameOf(m, spec, f.id), isDeleted(m, f.id) ? null : parentOf(m, spec, f.id), copies(f.id)],
      ...(g && g.file === f.id && g.name ? { aliases: [g.name] } : {}) }));
    const e = effective(spec);
    if (e === 'select') out.push({ name: 'Selection', value: m.selected.slice().sort(), aliases: ['Selected files'] });
    if (e === 'navigate') out.push({ name: 'Current folder', value: m.cwd, aliases: ['Location', 'Open folder'] });
    if (e === 'open') out.push({ name: 'Opened file', value: m.viewer || null, aliases: ['Viewer', 'Open file'] });
    return out;
  }

  Object.assign(lib, { factsOf, partsOf });
})();
