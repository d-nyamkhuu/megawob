// Browser-free loader for the megawob kit: boots play.html's script chain (kit/runtime/*.js, kit/env.js, kit/ui, kit/content,
// kit/instruct.js, the site, the task logic and the widget) in a Node vm context with a small fake DOM, so the
// kit's pure parts (RNG, knobs, sampling, scoring, clock, oracle in model terms) run without a browser.
//
//   import { bootPage, loadKit } from './stubdom.mjs';
//   const { env } = await bootPage({ task: 'slider', site: 'base', widget: 'classic', seed: 0 });
//   const { env, win } = await loadKit();        // the kit + content + instruct only; register test tasks yourself
//
// Sites and widgets load for real, but their DOM work is not: site.frame() and widget.render() are replaced by stubs
// (a stage element and an end control; no anchors), site.overlay() and the fault / hazard / notice hooks by a stub
// overlay. So reset() runs the real knob draws, sample(), init(), tolerance(), instruction() and the start-mode loop,
// and its result matches the page's state right after reset, before the widget renders (a widget's render may still
// mirror layout facts into the model).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const HTML = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../html');

// Anything: every property is itself, calling or constructing it returns itself. Stands in for browser APIs the
// loaded code touches at load time but the snapshot does not depend on (fonts, observers, canvas contexts).
const anything = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : k === 'then' || k === Symbol.iterator ? undefined
    : k === 'length' ? 0 : anything),
  apply: () => anything,
  construct: () => anything,
  set: () => true,
});

const scripts = new Map(); // compiled vm.Script per file, shared across contexts
function compiled(file) {
  if (!scripts.has(file)) scripts.set(file, new vm.Script(fs.readFileSync(file, 'utf8'), { filename: file }));
  return scripts.get(file);
}

class FakeStyle {
  constructor() { this._p = {}; }
  setProperty(k, v) { this._p[k] = String(v); }
  getPropertyValue(k) { return this._p[k] || ''; }
  removeProperty(k) { delete this._p[k]; }
}
const styleProxy = () => new Proxy(new FakeStyle(), {
  get: (t, k) => (k in t ? (typeof t[k] === 'function' ? t[k].bind(t) : t[k]) : (typeof k === 'string' ? t._p[k] ?? '' : undefined)),
  set: (t, k, v) => { t._p[k] = String(v); return true; },
});

function makeDom(win, { width, height }) {
  let doc;
  class FakeElement {
    constructor(tag, ns) {
      this.tagName = String(tag).toUpperCase();
      this.nodeName = this.tagName;
      this.localName = String(tag).toLowerCase();
      this.namespaceURI = ns || 'http://www.w3.org/1999/xhtml';
      this.nodeType = 1;
      this.children = [];
      this.parentElement = null;
      this.style = styleProxy();
      this.dataset = {};
      this._attrs = {};
      this._listeners = {};
      this._cls = new Set();
      this.hidden = false;
      this.id = '';
      this._text = '';
      this.value = '';
      this.checked = false;
      this.disabled = false;
      this.scrollTop = 0;
      this.scrollLeft = 0;
      this._rect = null;
      const cls = this._cls;
      this.classList = {
        add: (...c) => c.forEach((x) => cls.add(x)),
        remove: (...c) => c.forEach((x) => cls.delete(x)),
        toggle: (c, force) => {
          const on = force === undefined ? !cls.has(c) : !!force;
          if (on) cls.add(c); else cls.delete(c);
          return on;
        },
        contains: (c) => cls.has(c),
        replace: (a, b) => { cls.delete(a); cls.add(b); },
        get length() { return cls.size; },
        [Symbol.iterator]: () => cls[Symbol.iterator](),
      };
    }
    // CSS-in-JS libraries (emotion in speedy mode) insert rules into a style element's sheet.
    get sheet() { return this.localName === 'style' ? (this._sheet ||= { cssRules: [], insertRule(r, i) { this.cssRules.splice(i ?? 0, 0, r); return 0; }, deleteRule() {} }) : undefined; }
    get className() { return [...this._cls].join(' '); }
    set className(v) { this._cls.clear(); String(v).split(/\s+/).filter(Boolean).forEach((c) => this._cls.add(c)); }
    get parentNode() { return this.parentElement; }
    get childNodes() { return this.children; }
    get firstChild() { return this.children[0] || null; }
    get lastChild() { return this.children[this.children.length - 1] || null; }
    get firstElementChild() { return this.firstChild; }
    get lastElementChild() { return this.lastChild; }
    get childElementCount() { return this.children.length; }
    get nextElementSibling() { const p = this.parentElement; return p ? p.children[p.children.indexOf(this) + 1] || null : null; }
    get previousElementSibling() { const p = this.parentElement; return p ? p.children[p.children.indexOf(this) - 1] || null : null; }
    get nextSibling() { return this.nextElementSibling; }
    get previousSibling() { return this.previousElementSibling; }
    get isConnected() { let e = this; while (e.parentElement) e = e.parentElement; return e === doc.documentElement; }
    get ownerDocument() { return doc; }
    get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); }
    set textContent(v) { this.children.forEach((c) => { c.parentElement = null; }); this.children = []; this._text = String(v ?? ''); }
    get innerText() { return this.textContent; }
    set innerText(v) { this.textContent = v; }
    get innerHTML() { return this._html || ''; }
    set innerHTML(v) {
      this.textContent = '';
      this._html = String(v);
      // Just enough markup for feature tests (jQuery's support checks): nested tags, attributes, text.
      const stack = [this];
      for (const m of this._html.matchAll(/<(\/?)([a-z][\w-]*)([^>]*?)(\/?)>|([^<]+)/gi)) {
        const top = stack[stack.length - 1];
        if (m[5] !== undefined) top._text += m[5];
        else if (m[1]) { if (stack.length > 1) stack.pop(); }
        else {
          const el = new FakeElement(m[2]);
          for (const a of m[3].matchAll(/([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g)) el.setAttribute(a[1], a[2] ?? a[3] ?? a[4] ?? '');
          top.append(el);
          if (!m[4] && !/^(br|hr|img|input|link|meta)$/i.test(m[2])) stack.push(el);
        }
      }
    }
    get outerHTML() { return `<${this.localName}>${this.innerHTML}</${this.localName}>`; }
    get offsetWidth() { return this.getBoundingClientRect().width; }
    get offsetHeight() { return this.getBoundingClientRect().height; }
    get offsetLeft() { return this.getBoundingClientRect().left; }
    get offsetTop() { return this.getBoundingClientRect().top; }
    get offsetParent() { return this.parentElement; }
    get clientWidth() { return this.getBoundingClientRect().width; }
    get clientHeight() { return this.getBoundingClientRect().height; }
    get scrollWidth() { return this.clientWidth; }
    get scrollHeight() { return this.clientHeight; }
    _adopt(n) {
      if (n == null) return null;
      if (typeof n !== 'object') { this._text += String(n); return null; }
      if (n.isFragment) { const kids = n.children.slice(); kids.forEach((k) => this._adopt(k)); n.children = []; return null; }
      if (n.parentElement) n.remove();
      n.parentElement = this;
      return n;
    }
    append(...ns) { for (const n of ns) { const a = this._adopt(n); if (a) { this.children.push(a); this._connected(a); } } }
    prepend(...ns) { for (const n of ns.reverse()) { const a = this._adopt(n); if (a) { this.children.unshift(a); this._connected(a); } } }
    appendChild(n) { this.append(n); return n; }
    insertBefore(n, ref) {
      const a = this._adopt(n);
      if (!a) return n;
      const i = ref ? this.children.indexOf(ref) : -1;
      if (i < 0) this.children.push(a); else this.children.splice(i, 0, a);
      this._connected(a);
      return n;
    }
    insertAdjacentElement(where, n) { if (/beforeend/i.test(where)) this.append(n); else if (/afterbegin/i.test(where)) this.prepend(n); else if (/afterend/i.test(where)) this.after(n); else this.before(n); return n; }
    insertAdjacentHTML() {}
    insertAdjacentText() {}
    before(...ns) { const p = this.parentElement; if (p) for (const n of ns) p.insertBefore(n, this); }
    after(...ns) { const p = this.parentElement; if (!p) return; let ref = this.nextElementSibling; for (const n of ns) p.insertBefore(n, ref); }
    replaceWith(...ns) { const p = this.parentElement; if (!p) return; this.before(...ns); this.remove(); }
    replaceChildren(...ns) { this.children.forEach((c) => { c.parentElement = null; }); this.children = []; this._text = ''; this._html = ''; this.append(...ns); }
    replaceChild(n, old) { old.replaceWith(n); return old; }
    removeChild(n) { n.remove(); return n; }
    remove() { const p = this.parentElement; if (p) { p.children.splice(p.children.indexOf(this), 1); this.parentElement = null; } }
    contains(n) { for (let e = n; e; e = e.parentElement) if (e === this) return true; return false; }
    _connected(n) { if (this === doc.head || this === doc.body) doc._load(n); }
    closest() { return null; }
    matches() { return false; }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    getElementsByTagName() { return []; }
    getElementsByClassName() { return []; }
    setAttribute(k, v) { this._attrs[k] = String(v); if (k === 'id') this.id = String(v); if (k === 'class') this.className = v; }
    getAttribute(k) { return k === 'class' ? this.className : k in this._attrs ? this._attrs[k] : null; }
    getAttributeNS(ns, k) { return this.getAttribute(k); }
    setAttributeNS(ns, k, v) { this.setAttribute(k, v); }
    hasAttribute(k) { return k in this._attrs; }
    removeAttribute(k) { delete this._attrs[k]; }
    toggleAttribute(k, force) { const on = force === undefined ? !(k in this._attrs) : !!force; if (on) this._attrs[k] = ''; else delete this._attrs[k]; return on; }
    addEventListener(type, fn) { (this._listeners[type] ||= []).push(fn); }
    removeEventListener(type, fn) { const l = this._listeners[type]; if (l) this._listeners[type] = l.filter((f) => f !== fn); }
    dispatchEvent() { return true; }
    getBoundingClientRect() {
      const r = this._rect || (this === doc.documentElement || this === doc.body ? { left: 0, top: 0, width, height } : { left: 0, top: 0, width: 0, height: 0 });
      return { x: r.left, y: r.top, left: r.left, top: r.top, width: r.width, height: r.height, right: r.left + r.width, bottom: r.top + r.height };
    }
    getClientRects() { return []; }
    getBBox() { return { x: 0, y: 0, width: 0, height: 0 }; }
    getTotalLength() { return 0; }
    getPointAtLength() { return { x: 0, y: 0 }; }
    getContext() { return anything; }
    focus() {}
    blur() {}
    click() {}
    select() {}
    setSelectionRange() {}
    scrollIntoView() {}
    scrollTo() {}
    scrollBy() {}
    setPointerCapture() {}
    releasePointerCapture() {}
    hasPointerCapture() { return false; }
    animate() { return anything; }
    getAnimations() { return []; }
    attachShadow() { return new FakeElement('shadow-root'); }
    cloneNode(deep) {
      const c = new FakeElement(this.localName, this.namespaceURI);
      c.isFragment = this.isFragment;
      Object.assign(c._attrs, this._attrs);
      this._cls.forEach((x) => c._cls.add(x));
      c._text = this._text;
      c.value = this.value;
      c.checked = this.checked;
      if (deep) for (const k of this.children) c.append(k.cloneNode(true));
      return c;
    }
  }

  doc = {
    nodeType: 9,
    styleSheets: [],
    readyState: 'complete',
    title: '',
    cookie: '',
    currentScript: null,
    createElement: (tag) => new FakeElement(tag),
    createElementNS: (ns, tag) => new FakeElement(tag, ns),
    createTextNode: (text) => String(text),
    createComment: () => '',
    createDocumentFragment: () => Object.assign(new FakeElement('#fragment'), { isFragment: true }),
    createRange: () => anything,
    // jQuery builds its parsing document with implementation.createHTMLDocument.
    implementation: { createHTMLDocument: () => makeDom(win, { width, height }).doc, hasFeature: () => true },
    createTreeWalker: () => anything,
    getElementById: () => null,
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    querySelector: (q) => (q === 'head' ? doc.head : q === 'body' ? doc.body : null),
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => true,
    elementFromPoint: (x, y) => (doc.hit ? doc.hit(x, y) : null),
    elementsFromPoint: () => [],
    getAnimations: () => [],
    getSelection: () => anything,
    hasFocus: () => true,
    execCommand: () => false,
    fonts: { ready: Promise.resolve(), load: () => Promise.resolve([]), check: () => true, add() {}, forEach() {} },
    get defaultView() { return win; },
    get activeElement() { return doc.body; },
    get scrollingElement() { return doc.documentElement; },
    _load: () => {},
  };
  doc.documentElement = new FakeElement('html');
  doc.head = new FakeElement('head');
  doc.body = new FakeElement('body');
  doc.documentElement.children.push(doc.head, doc.body);
  doc.head.parentElement = doc.documentElement;
  doc.body.parentElement = doc.documentElement;
  return { doc, FakeElement };
}

// A fresh browser-like global with the fake DOM. params become location.search.
export function makeWindow({ params = {}, width = 1280, height = 720 } = {}) {
  const ctx = {};
  const win = vm.createContext(ctx);
  const { doc, FakeElement } = makeDom(win, { width, height });
  const listeners = {};
  let ids = 0;
  const href = pathToFileURL(path.join(HTML, 'play.html')).href + '?' + new URLSearchParams(params);
  class Ev {
    constructor(type, init = {}) { Object.assign(this, init); this.type = type; this.defaultPrevented = false; }
    preventDefault() { this.defaultPrevented = true; }
    stopPropagation() {}
    stopImmediatePropagation() { this._stopped = true; }
  }
  class Observer { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
  Object.assign(ctx, {
    window: win, self: win, top: win, parent: win, document: doc,
    location: { href, search: '?' + new URLSearchParams(params), pathname: '/play.html', hash: '', origin: 'file://' },
    navigator: { userAgent: 'node', language: 'en-US', languages: ['en-US'], platform: 'Linux', maxTouchPoints: 0,
      clipboard: anything, hardwareConcurrency: 1 },
    console, performance, URL, URLSearchParams, TextEncoder, TextDecoder, structuredClone, queueMicrotask,
    AbortController, AbortSignal,
    innerWidth: width, innerHeight: height, outerWidth: width, outerHeight: height, devicePixelRatio: 1,
    scrollX: 0, scrollY: 0, pageXOffset: 0, pageYOffset: 0,
    screen: { width, height, availWidth: width, availHeight: height },
    scrollTo() {}, scrollBy() {}, focus() {}, blur() {}, print() {}, alert() {}, confirm: () => false, prompt: () => null,
    // Timers never fire: task time is the kit clock; anything on a wall-time timer is cosmetic.
    setTimeout: () => ++ids, clearTimeout() {}, setInterval: () => ++ids, clearInterval() {},
    requestAnimationFrame: () => ++ids, cancelAnimationFrame() {},
    requestIdleCallback: () => ++ids, cancelIdleCallback() {},
    addEventListener: (type, fn) => { (listeners[type] ||= []).push(fn); },
    removeEventListener: (type, fn) => { if (listeners[type]) listeners[type] = listeners[type].filter((f) => f !== fn); },
    dispatchEvent: (e) => { for (const fn of listeners[e.type] || []) { fn(e); if (e._stopped) break; } return !e.defaultPrevented; },
    getComputedStyle: () => new Proxy({}, { get: (t, k) => (k === 'getPropertyValue' ? () => '' : k === 'position' ? 'static' : k === 'overflowY' || k === 'overflowX' || k === 'overflow' ? 'visible' : '') }),
    matchMedia: (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
    getSelection: () => anything,
    CSS: { supports: () => true, escape: (s) => String(s) },
    Event: Ev, CustomEvent: Ev, UIEvent: Ev, MouseEvent: Ev, PointerEvent: Ev, KeyboardEvent: Ev, WheelEvent: Ev,
    FocusEvent: Ev, InputEvent: Ev, DragEvent: Ev, TouchEvent: Ev, ClipboardEvent: Ev,
    ResizeObserver: Observer, MutationObserver: Observer, IntersectionObserver: Observer, PerformanceObserver: Observer,
    Node: FakeElement, Element: FakeElement, HTMLElement: FakeElement, SVGElement: FakeElement, Text: FakeElement,
    HTMLIFrameElement: class {}, HTMLInputElement: FakeElement, HTMLCanvasElement: FakeElement, HTMLImageElement: FakeElement,
    DocumentFragment: FakeElement, ShadowRoot: FakeElement,
    Image: class { constructor() { return new FakeElement('img'); } },
    FontFace: class { constructor() { return anything; } },
    DOMParser: class { parseFromString() { return doc; } },
    DOMRect: class { constructor(x = 0, y = 0, w = 0, h = 0) { Object.assign(this, { x, y, width: w, height: h, left: x, top: y, right: x + w, bottom: y + h }); } },
    Path2D: class {},
    customElements: { define() {}, get: () => undefined },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {}, clear() {} },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {}, clear() {} },
    fetch: () => Promise.reject(new Error('no network')),
    _listeners: listeners,
  });
  ctx.globalThis = win;
  // Script and stylesheet elements added to the head load like a browser would: the file runs on a later
  // microtask, then onload (or onerror when it is missing).
  doc._load = (el) => {
    if (el.localName === 'script' && el.src) {
      const file = fileURLToPath(el.src);
      queueMicrotask(() => {
        if (!fs.existsSync(file)) return el.onerror && el.onerror(new Error('missing'));
        try {
          doc.currentScript = el;
          compiled(file).runInContext(win);
        } catch (err) {
          win._loadErrors.push(`${path.relative(HTML, file)}: ${err && err.stack || err}`);
        } finally {
          doc.currentScript = null;
        }
        if (el.onload) el.onload();
      });
    } else if (el.localName === 'link' && el.onload) {
      queueMicrotask(() => el.onload());
    }
  };
  ctx._loadErrors = [];
  ctx._FakeElement = FakeElement;
  return win;
}

// The kit files play.html loads with <script> tags (kit/runtime/*.js, then kit/env.js), in order.
export const PAGE_SCRIPTS = [...fs.readFileSync(path.join(HTML, 'play.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)]
  .map((m) => m[1]);
// kit/ui and kit/content files in env.js's load order (its UI_PRIMITIVES and CONTENT_FILES lists).
const envList = (name) => JSON.parse(
  fs.readFileSync(path.join(HTML, 'kit/env.js'), 'utf8').match(new RegExp(`const ${name} = (\\[[^\\]]*\\])`))[1].replace(/'/g, '"'),
);
const UI_FILES = envList('UI_PRIMITIVES');
const CONTENT_FILES = envList('CONTENT_FILES');

// Run one kit file in the window, like a <script> tag in play.html.
export function runFile(win, rel) {
  const file = path.join(HTML, rel);
  win.document.currentScript = { src: pathToFileURL(file).href };
  try {
    compiled(file).runInContext(win);
  } finally {
    win.document.currentScript = null;
  }
}

// Replace the DOM-building parts of site and widget definitions as they register (see the file header).
function stubPages(win) {
  const env = win.env;
  const E = win._FakeElement;
  const site = env.site.bind(env);
  const widget = env.widget.bind(env);
  const frame = (ctx) => {
    const stage = new E('main');
    stage._rect = { left: 0, top: 0, width: win.innerWidth, height: win.innerHeight };
    win.document.body.append(stage);
    const submit = ctx.finish ? null : new E('button');
    if (submit) win.document.body.append(submit);
    return { stage, submit };
  };
  const overlay = (ctx) => {
    const el = new E('aside');
    const dismiss = new E('button');
    el.append(dismiss);
    win.document.body.append(el);
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 3 : 0 };
  };
  // A live view of the definition, not a copy, so keys a site sets after registering it still count.
  env.site = function (def) {
    return site(new Proxy(def, {
      // The round-2 hooks (fault, hazard, notice) draw like overlays: a stub box with a dismiss control.
      get: (t, k) => (k === 'frame' ? frame : k === 'overlay' || k === 'fault' || k === 'hazard' || k === 'notice'
        ? t[k] && overlay : t[k]),
    }));
  };
  env.widget = function (def) {
    return widget({ ...def, render: () => ({ anchors: [] }), locate: () => [0, 0] });
  };
}

// The kit alone (play.html's scripts, ui, content, instruct): for unit tests that register their own tasks, sites and widgets.
export function loadKit(opts = {}) {
  const win = makeWindow(opts);
  for (const f of PAGE_SCRIPTS) runFile(win, f);
  for (const f of UI_FILES) runFile(win, `kit/ui/${f}.js`);
  for (const f of CONTENT_FILES) runFile(win, `kit/content/${f}.js`);
  runFile(win, 'kit/instruct.js');
  return { win, env: win.env };
}

// A stage element with a fixed rect (left, top, width, height) in a fresh window.
export function element(win, tag, rect) {
  const el = new win._FakeElement(tag);
  if (rect) el._rect = { left: rect[0], top: rect[1], width: rect[2], height: rect[3] };
  win.document.body.append(el);
  return el;
}

// Unit-test page: the kit with a test task, site and widget set directly (no boot). Defaults: a site whose end
// control is centred at (600, 670) and whose overlays have their dismiss control centred at (100, 100) (toasts
// expire after 3 steps), and a widget whose locate(t) is [t.x, t.y]. Pass partial definitions to override any field;
// returns { win, env }.
export function testEnv({ task, site = {}, widget = {}, params = {} }) {
  const { win, env } = loadKit({ params });
  const siteDef = {
    name: 'unit',
    frame(ctx) {
      const stage = element(win, 'main', [0, 50, 1280, 600]);
      const submit = ctx.finish ? null : element(win, 'button', [580, 660, 40, 20]);
      return { stage, submit };
    },
    overlay(ctx) {
      const el = element(win, 'aside', [0, 0, 300, 200]);
      const dismiss = element(win, 'button', [90, 90, 20, 20]);
      el.append(dismiss);
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 3 : 0 };
    },
    ...site,
  };
  const widgetDef = { task: task.name, site: siteDef.name, name: 'unit', split: 'train', scenarios: task.scenarios,
    render: () => ({ anchors: [] }), locate: (t) => [t.x, t.y], ...widget };
  env.task(task);
  env.site(siteDef);
  env.widget(widgetDef);
  env.taskDef = task;
  env.siteDef = siteDef;
  env.widgetDef = widgetDef;
  return { win, env };
}

// Boot one page (task, site, widget, seed) the way play.html does, with frame / render / overlay stubbed.
export async function bootPage({ task, site = 'base', widget, seed = 0, params = {}, width, height }) {
  const query = { task, site, ...(widget ? { widget } : {}), seed, ...params };
  const win = makeWindow({ params: query, width, height });
  for (const f of PAGE_SCRIPTS) runFile(win, f);
  stubPages(win);
  await win.env.boot();
  if (win.env.bootError || win._loadErrors.length) {
    throw new Error(`boot ${task}/${site}/${widget || ''}: ${win.env.bootError || ''} ${win._loadErrors.join('\n')}`.trim());
  }
  return { win, env: win.env };
}
