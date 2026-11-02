/* use-desktop-tools/_shared: shared template code; no DOM work until a builder runs. */
(function () {
  'use strict';
  const ICON = {
    files: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2h8A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-14A1.5 1.5 0 0 1 3 17.5z"/>',
    terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5"/>',
    editor: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/>',
    home: '<path d="M4 11l8-6.5 8 6.5M6 9.5V19h12V9.5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  };
  const svg = (body, vb = 24, extra = '') => `<svg viewBox="0 0 ${vb} ${vb}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${extra}>${body}</svg>`;
  const FOLDER_SVG = (open) => (open
    ? '<svg class="ico" viewBox="0 0 20 20"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.6l1.6 1.6h7.8A1.5 1.5 0 0 1 18 7.1V8H5.4L2 15z" fill="#d9a520"/><path d="M5 8.5h14l-3 7.5H2z" fill="#f2c94c"/></svg>'
    : '<svg class="ico" viewBox="0 0 20 20"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h3.6l1.6 1.6h7.8A1.5 1.5 0 0 1 18 7.1v8.4a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 15.5z" fill="#e8b43a"/></svg>');
  const EXT_COLOR = { png: '#2f9e44', jpg: '#2f9e44', svg: '#2f9e44', heic: '#2f9e44', webp: '#2f9e44', gif: '#2f9e44', py: '#3b74e0', js: '#d4a20b',
    json: '#8d6e00', html: '#e8590c', css: '#7048e8', txt: '#868e96', md: '#495057', pdf: '#e03131', docx: '#1c7ed6', doc: '#1c7ed6', odt: '#1c7ed6',
    rtf: '#1c7ed6', csv: '#0b8a5b', xlsx: '#0b8a5b', ods: '#0b8a5b', zip: '#8d5524', '7z': '#8d5524', 'tar.gz': '#8d5524', mp3: '#d6336c',
    wav: '#d6336c', m4a: '#d6336c', mp4: '#c2255c', mov: '#c2255c', pptx: '#e8590c', key: '#e8590c', psd: '#1971c2', fig: '#7048e8' };
  const FILE_SVG = (name, cls, c) => {
    return `<svg class="${cls}" viewBox="0 0 20 20"><path d="M5 2.5h7l3.5 3.5v11.5H5z" fill="color-mix(in srgb, ${c} 14%, transparent)" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 2.5V6h3.5" fill="none" stroke="${c}" stroke-width="1.3"/></svg>`;
  };
  const SPIN = (deg) => `<svg class="at-spin" viewBox="0 0 16 16" style="transform: rotate(${deg}deg)"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="2"/><path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  const PROJECTS = ['my-workspace', 'shared-drive', 'home', 'team-files', 'personal', 'studio', 'client-share'];
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const isField = (t) => t && t.closest && t.closest('input, textarea, [contenteditable="true"]');

  function hitPoint(el, fx = [0.5, 0.3, 0.7, 0.15, 0.85], fy = [0.5, 0.3, 0.7]) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return null;
    for (const v of fy) {
      for (const u of fx) {
        const x = r.left + r.width * u;
        const y = r.top + r.height * v;
        const hit = document.elementFromPoint(x, y);
        if (hit && (hit === el || el.contains(hit))) return [x, y];
      }
    }
    return [r.left + r.width / 2, r.top + r.height / 2];
  }

  function freeAt(owner, x, y) {
    const hit = document.elementFromPoint(x, y);
    return !!hit && (hit === owner || owner.contains(hit));
  }
  env.template('use-desktop-tools/_shared', () => ({ ICON, svg, FOLDER_SVG, EXT_COLOR, FILE_SVG, SPIN, PROJECTS, clamp, same, isField, hitPoint, freeAt }));
})();
