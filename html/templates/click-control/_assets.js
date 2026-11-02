/* click-control/_assets: SVG icon paths and color tables shared by controls and reference.
 * Each copy preserves the former template-local object identity.
 */
(function () {
  'use strict';

  const ICONS = {
    plus: '<path d="M8 3v10M3 8h10"/>',
    folder: '<path d="M1.8 4.2h4.3l1.5 1.6h6.6v7H1.8z"/>',
    disk: '<path d="M2.5 2.5h9l2 2v9h-11z"/><path d="M5 2.5v3.5h5V2.5M4.8 13.5V9.5h6.4v4"/>',
    print: '<path d="M4.5 6V2.5h7V6"/><rect x="2" y="6" width="12" height="5.5" rx="1"/><path d="M4.5 9.5h7v4h-7z"/>',
    trash: '<path d="M2.8 4.5h10.4M6 4.5V2.8h4v1.7M4.3 4.5l.8 9h5.8l.8-9"/>',
    gear: '<circle cx="8" cy="8" r="2.2"/><path d="M8 1.6v2.3M8 12.1v2.3M1.6 8h2.3M12.1 8h2.3M3.5 3.5l1.6 1.6M10.9 10.9l1.6 1.6M3.5 12.5l1.6-1.6M10.9 5.1l1.6-1.6"/>',
    star: '<path d="M8 1.8l1.9 4.1 4.4.4-3.3 2.9 1 4.4L8 11.3l-4 2.3 1-4.4-3.3-2.9 4.4-.4z"/>',
    zoomin: '<circle cx="6.8" cy="6.8" r="4.4"/><path d="M10 10l4 4M4.8 6.8h4M6.8 4.8v4"/>',
    zoomout: '<circle cx="6.8" cy="6.8" r="4.4"/><path d="M10 10l4 4M4.8 6.8h4"/>',
    prev: '<path d="M3.5 3v10" /><path d="M13 3L6 8l7 5z" fill="currentColor"/>',
    stop: '<rect x="3.5" y="3.5" width="9" height="9" fill="currentColor"/>',
    play: '<path d="M4.5 2.8l9 5.2-9 5.2z" fill="currentColor"/>',
    next: '<path d="M12.5 3v10"/><path d="M3 3l7 5-7 5z" fill="currentColor"/>',
    mail: '<rect x="1.8" y="3.5" width="12.4" height="9" rx="1"/><path d="M2 4.2l6 4.8 6-4.8"/>',
    bell: '<path d="M4 11V7a4 4 0 0 1 8 0v4l1.5 1.3h-11z"/><path d="M6.6 14.2h2.8"/>',
    user: '<circle cx="8" cy="5.3" r="2.7"/><path d="M2.8 14.2c.5-3 2.6-4.6 5.2-4.6s4.7 1.6 5.2 4.6"/>',
    lock: '<rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2"/>',
    home: '<path d="M1.8 8L8 2.5 14.2 8"/><path d="M3.8 6.6v7.2h8.4V6.6"/>',
    heart: '<path d="M8 13.6S2 9.8 2 5.9a3 3 0 0 1 6-1.3 3 3 0 0 1 6 1.3c0 3.9-6 7.7-6 7.7z"/>',
    copy: '<rect x="5.2" y="5" width="8.3" height="9" rx="1"/><path d="M3 11.2V2.5h7.3"/>',
    pencil: '<path d="M10.8 2.7l2.5 2.5-7.6 7.6-3.2.7.7-3.2z"/><path d="M9.5 4l2.5 2.5"/>',
    search: '<circle cx="7" cy="7" r="4.5"/><path d="M10.3 10.3L14 14"/>',
    download: '<path d="M8 2v8M4.8 7L8 10.2 11.2 7"/><path d="M2.5 11v2.5h11V11"/>',
    upload: '<path d="M8 10.5V2.5M4.8 5.7L8 2.5l3.2 3.2"/><path d="M2.5 11v2.5h11V11"/>',
    share: '<circle cx="4" cy="8" r="1.8"/><circle cx="12" cy="3.8" r="1.8"/><circle cx="12" cy="12.2" r="1.8"/><path d="M5.6 7.1l4.8-2.4M5.6 8.9l4.8 2.4"/>',
    link: '<path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2.2-2.2a2.6 2.6 0 0 0-3.7-3.7l-1 1"/><path d="M9.2 6.8a2.6 2.6 0 0 0-3.7 0L3.3 9a2.6 2.6 0 0 0 3.7 3.7l1-1"/>',
    archive: '<rect x="2" y="2.8" width="12" height="3.2" rx=".6"/><path d="M3 6v7.2h10V6M6.3 8.6h3.4"/>',
    tag: '<path d="M2.5 2.5h5.3l5.7 5.7-5.3 5.3-5.7-5.7z"/><circle cx="5.3" cy="5.3" r="1"/>',
    pin: '<path d="M6 2h4l-.6 4.2 2.3 2.3H4.3l2.3-2.3z"/><path d="M8 8.5V14"/>',
    flag: '<path d="M3.5 14V2.5"/><path d="M3.5 3h8.5l-2 3 2 3H3.5"/>',
    refresh: '<path d="M13 8a5 5 0 1 1-1.5-3.6"/><path d="M13 2.5v3h-3"/>',
    undo: '<path d="M5.5 4L2.5 7l3 3"/><path d="M2.5 7h7a3.5 3.5 0 0 1 0 7H7"/>',
    redo: '<path d="M10.5 4l3 3-3 3"/><path d="M13.5 7h-7a3.5 3.5 0 0 0 0 7H9"/>',
    bold: '<path d="M4.5 2.5h4.2a2.6 2.6 0 0 1 0 5.2H4.5zM4.5 7.7h5a2.9 2.9 0 0 1 0 5.8h-5z" stroke-width="1.8"/>',
    italic: '<path d="M6.5 2.5h6M3.5 13.5h6M9.5 2.5l-3 11"/>',
    list: '<path d="M6 4h8M6 8h8M6 12h8"/><circle cx="3" cy="4" r=".9" fill="currentColor"/><circle cx="3" cy="8" r=".9" fill="currentColor"/><circle cx="3" cy="12" r=".9" fill="currentColor"/>',
    calendar: '<rect x="2" y="3" width="12" height="11" rx="1"/><path d="M2 6.5h12M5 1.8v2.4M11 1.8v2.4"/>',
    filter: '<path d="M2 2.8h12L9.3 8.5v4.7l-2.6-1.3V8.5z"/>',
    eye: '<path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/>',
    more: '<circle cx="3.5" cy="8" r="1.1" fill="currentColor"/><circle cx="8" cy="8" r="1.1" fill="currentColor"/><circle cx="12.5" cy="8" r="1.1" fill="currentColor"/>',
    info: '<circle cx="8" cy="8" r="6"/><path d="M8 7.2v4"/><circle cx="8" cy="4.9" r=".8" fill="currentColor"/>',
    comment: '<path d="M2.5 3h11v7.5H7l-3 2.8v-2.8H2.5z"/>',
    cut: '<circle cx="4.5" cy="11.5" r="2"/><circle cx="11.5" cy="11.5" r="2"/><path d="M6 10L12 2.5M10 10L4 2.5"/>',
    image: '<rect x="2" y="2.5" width="12" height="11" rx="1"/><circle cx="5.7" cy="6" r="1.2"/><path d="M2.5 12l3.8-3.8 2.7 2.7 1.8-1.8 3 3"/>',
    bookmark: '<path d="M4 2.5h8v11L8 10.5l-4 3z"/>',
    send: '<path d="M14 2L2 7l5 2 2 5z"/><path d="M14 2L7 9"/>',
    paperclip: '<path d="M11.5 7.5l-4.6 4.6a2.6 2.6 0 0 1-3.7-3.7L8.6 3a1.7 1.7 0 0 1 2.5 2.5L5.8 10.8"/>',
    clock: '<circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2.5 1.5"/>',
    cloud: '<path d="M4.5 12.5a3 3 0 0 1-.3-6 4 4 0 0 1 7.6-.8 3.4 3.4 0 0 1 .2 6.8z"/>',
    check: '<path d="M2.8 8.5l3.3 3.3 7-7.3"/>',
    globe: '<circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c-2 2-2 10 0 12M8 2c2 2 2 10 0 12"/>',
    cart: '<path d="M1.5 2.5h2l1.6 7.5h7.4l1.5-5.5H4.3"/><circle cx="6" cy="13" r="1"/><circle cx="12" cy="13" r="1"/>',
    pause: '<rect x="4" y="3" width="2.6" height="10" fill="currentColor"/><rect x="9.4" y="3" width="2.6" height="10" fill="currentColor"/>',
    moon: '<path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5z"/>',
    sun: '<circle cx="8" cy="8" r="2.8"/><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1"/>',
    logout: '<path d="M6 2.5H2.5v11H6"/><path d="M10.5 5L13.5 8l-3 3M13.5 8H6"/>',
    grid: '<rect x="2.5" y="2.5" width="4.5" height="4.5"/><rect x="9" y="2.5" width="4.5" height="4.5"/><rect x="2.5" y="9" width="4.5" height="4.5"/><rect x="9" y="9" width="4.5" height="4.5"/>',
    camera: '<path d="M2 5h2.8l1.2-1.8h4l1.2 1.8H14v8H2z"/><circle cx="8" cy="8.8" r="2.3"/>',
  };

  const HOVER_FILL = { green: '#2f9e44', blue: '#1c7ed6', red: '#e03131' };

  const FILE_COLORS = { folder: '#e8a93b', pdf: '#e03131', docx: '#1c7ed6', doc: '#1c7ed6', xlsx: '#2f9e44', csv: '#2f9e44',
    pptx: '#f76707', png: '#7048e8', jpg: '#7048e8', jpeg: '#7048e8', heic: '#7048e8', mp4: '#d6336c', mov: '#d6336c',
    mp3: '#0c8599', wav: '#0c8599', zip: '#8d5524', txt: '#868e96', md: '#868e96' };

  env.template('click-control/_assets', () => ({
    icons: () => ({ ...ICONS }),
    hoverFill: () => ({ ...HOVER_FILL }),
    fileColors: () => ({ ...FILE_COLORS }),
  }));
})();
