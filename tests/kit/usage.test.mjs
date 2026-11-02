// The kit-layer rule (html/kit/README.md, "The kit is a contract, not a framework"): the kit is minimal and every option has a user. A primitive
// option no site or kit file passes, a primitive option its file's header does not name, a trait no registered
// widget declares and a declared trait its task never reads each fail here.
//
// The checks are textual, so they prove absence, not use: a name that appears as a key somewhere counts as used.
// Users are every site (reference, trait-tests, mock-*, design-*), the widget templates (templates/<task>/*.js, which
// the design-* widgets are built from) and the other kit files. trait-tests counts: its widgets are how a trait no training
// widget declares yet stays tested.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { HTML } from './stubdom.mjs';

const read = (rel) => fs.readFileSync(path.join(HTML, rel), 'utf8');
const ls = (rel) => (fs.existsSync(path.join(HTML, rel)) ? fs.readdirSync(path.join(HTML, rel)) : []);
// Code without comments (strings stay: a key inside a string is not a read, but none of the patterns below match one).
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');
const header = (src) => (src.match(/^\/\*[\s\S]*?\*\//) || [''])[0];

const SITES = ls('sites').filter((s) => fs.existsSync(path.join(HTML, 'sites', s, 'manifest.json')));
const siteFiles = SITES.flatMap((s) => [`sites/${s}/site.js`, ...ls(`sites/${s}/widgets`).filter((f) => f.endsWith('.js')).map((f) => `sites/${s}/widgets/${f}`)])
  .filter((f) => fs.existsSync(path.join(HTML, f)));
const TEMPLATE_FILES = ls('templates').filter((f) => fs.statSync(path.join(HTML, 'templates', f)).isDirectory()).flatMap((f) => ls(`templates/${f}`).filter((x) => x.endsWith('.js')).map((x) => `templates/${f}/${x}`));
const KIT_FILES = ['kit/env.js', 'kit/instruct.js', ...ls('kit/runtime').map((f) => `kit/runtime/${f}`),
  ...ls('kit/ui').map((f) => `kit/ui/${f}`), ...ls('kit/content').map((f) => `kit/content/${f}`)].filter((f) => f.endsWith('.js'));

test('every kit/ui option has a user and is named in its file header', () => {
  const sites = [...siteFiles, ...TEMPLATE_FILES].map((f) => code(read(f))).join('\n');
  const problems = [];
  for (const file of ls('kit/ui').filter((f) => f.endsWith('.js') && f !== '_base.js')) {
    const src = read(`kit/ui/${file}`);
    const body = code(src);
    const doc = header(src);
    const names = new Set([...body.matchAll(/\bopts\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]));
    for (const m of body.matchAll(/(?:const|let)\s*\{([^}]*)\}\s*=\s*opts\b/g)) {
      for (const part of m[1].split(',')) { const k = part.split(/[:=]/)[0].trim(); if (k) names.add(k); }
    }
    const others = sites + '\n' + KIT_FILES.filter((f) => f !== `kit/ui/${file}`).map((f) => code(read(f))).join('\n');
    for (const name of [...names].sort()) {
      const key = new RegExp(`(?:\\b${name}\\s*:|[{,]\\s*${name}\\s*[,}]|\\.${name}\\s*=[^=]|\\b${name}\\s*\\()`);
      if (!key.test(others)) problems.push(`${file}: opts.${name} has no user`);
      if (!new RegExp(`\\b${name}\\b`).test(doc)) problems.push(`${file}: opts.${name} is not in the header`);
    }
  }
  assert.deepEqual(problems, []);
});

// Registered widgets, loaded the way the kit audit counts them: each widgets/*.js runs in a vm context whose env
// records what widget() and trait-tests.derive() receive; everything else is a permissive stub. A widget that names a
// template is built from it the way the kit builds it (the widget file's own keys win; a template may return several).
function declaredTraits() {
  const any = new Proxy(function () {}, {
    get: (t, k) => (k === Symbol.toPrimitive ? () => '' : k === 'then' || k === Symbol.iterator ? undefined : any),
    apply: () => any, construct: () => any, set: () => true,
  });
  const out = []; // { where, task, traits }
  for (const f of siteFiles.filter((x) => x.includes('/widgets/'))) {
    const defs = [];
    const templates = {};
    const uses = {};
    const libs = {};
    const env = new Proxy({
      widget: (d) => defs.push(d),
      template: (name, make, opts) => { templates[name] = make; uses[name] = (opts && opts.uses) || []; },
      templateLib: (name) => (Object.hasOwn(libs, name) ? libs[name] : (libs[name] = templates[name]())),
      traitTests: { derive: (task, entries) => entries.forEach((e) => defs.push({ task, traits: e.traits })) },
    }, { get: (t, k) => (k in t ? t[k] : any) });
    const document = new Proxy({ currentScript: { src: `file:///x/${f}` } }, { get: (t, k) => (k in t ? t[k] : any) });
    const sandbox = { env, window: { env, __env: env, addEventListener() {}, document }, document, console, Math, JSON,
      Object, Array, Map, Set, WeakMap, WeakSet, String, Number, Boolean, Error, TypeError, Symbol, RegExp, Intl, Promise,
      Reflect, Proxy, URL, URLSearchParams, Date, parseInt, parseFloat, isNaN, isFinite, encodeURIComponent,
      decodeURIComponent, Uint8Array, Float32Array, Float64Array, Int32Array,
      location: { search: '', href: 'file:///x/play.html', origin: 'file://', pathname: '/play.html' }, CSS: any, HTMLElement: any,
      Element: any, Node: any, Event: any, CustomEvent: any,
      navigator: any, getComputedStyle: () => any, performance: { now: () => 0 }, setTimeout() {}, requestAnimationFrame() {} };
    vm.createContext(sandbox);
    // play.html loads site.js before the widgets, and a design-* widget may call the helpers it defines (window.<name>).
    // Only the widgets are counted, so a site.js that needs more of the page than the stubs give is skipped.
    const siteJs = f.replace(/widgets\/[^/]+$/, 'site.js');
    if (f.startsWith('sites/design-') && fs.existsSync(path.join(HTML, siteJs))) {
      try { vm.runInContext(read(siteJs), sandbox, { filename: siteJs, timeout: 2000 }); } catch { /* helpers only */ }
    }
    vm.runInContext(read(f), sandbox, { filename: f, timeout: 2000 });
    const built = defs.flatMap((d) => {
      if (!d.template) return [d];
      const load = (name) => {
        const file = `templates/${name}.js`;
        if (!templates[name]) vm.runInContext(read(file), sandbox, { filename: file, timeout: 2000 });
        for (const lib of uses[name] || []) load(lib);
      };
      load(d.template);
      const { design, ...own } = d;
      return [].concat(templates[d.template](design || {}, d)).map((x) => ({ ...x, ...own }));
    });
    for (const d of built) if (d.traits) out.push({ where: f, task: d.task, traits: JSON.parse(JSON.stringify(d.traits)) });
  }
  return out;
}

// Trait names a task's files read (logic.js and the files it lists, e.g. scenarios/<scenario>.js): x in traits.x /
// traits['x'] / { x } = traits, where the traits object is opts.traits, a name bound to it (const t = opts.traits ||
// {}), or a parameter named traits or tr (the tasks' convention for helpers that take it).
function readTraits(task) {
  const files = fs.readdirSync(path.join(HTML, 'tasks', task), { recursive: true }).filter((f) => f.endsWith('.js'));
  const body = files.map((f) => code(read(`tasks/${task}/${f}`))).join('\n');
  const names = new Set();
  const scan = (text, h) => {
    for (const m of text.matchAll(new RegExp(`\\b(?:${h})\\s*(?:\\.|\\[['"])([A-Za-z_][\\w$]*)`, 'g'))) names.add(m[1]);
    for (const m of text.matchAll(new RegExp(`(?:const|let)\\s*\\{([^}]*)\\}\\s*=\\s*\\(?\\s*(?:${h})\\b`, 'g'))) {
      for (const part of m[1].split(',')) { const k = part.split(/[:=]/)[0].trim(); if (k) names.add(k); }
    }
  };
  // The conventional names count everywhere, unless the task binds them to something else (an rng called tr).
  const other = (n) => new RegExp(`(?:const|let|var)\\s+${n}\\s*=(?!\\s*\\(?\\s*opts\\.traits)`).test(body);
  scan(body, ['opts\\.traits', ...['traits', 'tr'].filter((n) => !other(n))].join('|'));
  // Other names bound to opts.traits count from the binding to the end of its block (the closing brace two spaces
  // left of the binding), since short names like t are reused elsewhere.
  for (const m of body.matchAll(/\n( *)(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\(?\s*opts\.traits\s*(?:\|\||;|\))/g)) {
    const end = body.indexOf(`\n${m[1].slice(2)}}`, m.index + 1);
    scan(body.slice(m.index, end < 0 ? undefined : end), m[2]);
  }
  return names;
}

test('every trait a task reads is declared by a widget, and every declared trait is read', () => {
  const tasks = ls('tasks').filter((f) => fs.existsSync(path.join(HTML, 'tasks', f, 'logic.js')));
  const reads = Object.fromEntries(tasks.map((f) => [f, readTraits(f)]));
  const declared = Object.fromEntries(tasks.map((f) => [f, new Set()]));
  const problems = [];
  for (const { where, task, traits } of declaredTraits()) {
    for (const [k, v] of Object.entries(traits)) {
      // Composite tasks take their parts' traits keyed by the part's task name.
      if (tasks.includes(k) && k !== task && v && typeof v === 'object') {
        for (const sub of Object.keys(v)) {
          declared[k].add(sub);
          if (!reads[k].has(sub)) problems.push(`${where}: declares ${k} trait '${sub}', which ${k} never reads`);
        }
        continue;
      }
      declared[task].add(k);
      if (!reads[task].has(k)) problems.push(`${where}: declares ${task} trait '${k}', which ${task} never reads`);
    }
  }
  for (const f of tasks) {
    for (const k of reads[f]) if (!declared[f].has(k) && !tasks.includes(k)) problems.push(`${f}: reads trait '${k}', which no widget declares`);
  }
  assert.deepEqual([...new Set(problems)].sort(), []);
});
