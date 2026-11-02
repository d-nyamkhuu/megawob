/*
 * use-desktop-tools / terminal: delete the described file in a fake shell.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-desktop-tools');
  const { C, fileNameIn, freshFile, LV, othersOf, recoverable, say, tpl } = fam.lib;
  const { clone, quote: q } = env.util;

  const SH_NAMES = ['flowers', 'code', 'script', 'bash', 'index', 'image', 'converter', 'file', 'shark',
    'memes', 'cats', 'puppy', 'media', 'search', 'page', 'buzzer', 'trace', 'emacs', 'vim', 'nano', 'apache',
    'mountains', 'window', 'photos2', 'compression', 'digital', 'inspector', 'navigator', 'secret', 'secrets',
    'password', 'encrypted', 'pizza', 'report', 'todo', 'budget', 'notes', 'backup', 'deploy', 'build',
    'requirements', 'Makefile', 'LICENSE', 'docker-compose', 'setup', 'config', 'id_rsa', 'known_hosts', 'acorn',
    'pebbles', 'meadow', 'thunder', 'otter', 'moth', 'cricket', 'lantern', 'teapot', 'hammock', 'marbles', 'origami',
    'cinnamon', 'lentils', 'waffles', 'telescope', 'compass', 'hourglass', 'quilt', 'riddle', 'maze', 'sonnet',
    'overture', 'picnic', 'itinerary', 'guestbook', 'roster', 'inventory', 'syllabus', 'worksheet', 'timestamps',
    'checksum', 'parser', 'socket', 'queue', 'mutex', 'fixture', 'benchmark', 'cache', 'CHANGELOG', 'AUTHORS',
    'smoke-test', 'seed_data', 'badger', 'heron', 'gecko', 'canyon', 'tundra', 'estuary', 'volcano', 'glacier',
    'apricot', 'radish', 'saffron', 'spatula', 'colander', 'thimble', 'pulley', 'anvil', 'mosaic', 'dialogue',
    'almanac', 'scrapbook', 'blueprint', 'receipt', 'harmonica', 'trampoline', 'allocator', 'bytecode', 'dispatch',
    'handshake', 'renderer', 'scheduler', 'watchdog', 'payload', 'bitmask', 'keyring', 'NOTICE', 'ROADMAP', 'VERSION',
    'asset_map', 'task_graph', 'retry_count', 'exit_status', 'line_breaks', 'dry-run', 'pre-commit', 'word-count',
    'phase2', 'kestrel', 'wombat', 'firefly', 'bramble', 'kelp', 'mangrove', 'limestone', 'aurora', 'monsoon',
    'tamarind', 'couscous', 'pretzel', 'carafe', 'trivet', 'bellows', 'pendulum', 'loom', 'folklore', 'charcoal',
    'vignette', 'festival', 'regatta', 'rehearsal', 'rubric', 'fieldwork', 'quantizer', 'grammar', 'entropy',
    'deadlock', 'linker', 'codepoint', 'FAQ', 'SUPPORT', 'color_depth', 'cursor_pos', 'lint_rules', 'sample_rate',
    'round-trip', 'warm-start', 'zero-pad', 'waypoint', 'sandcastle', 'bookmark'];
  const SH_EXTS = ['png', 'jpg', 'gif', 'sh', 'json', 'txt', 'py', 'rb', 'html', 'zip', 'tar.gz', '', 'gpg', 'md',
    'csv', 'yml', 'log', 'pdf', 'js', 'toml'];
  const SH_DIRS = ['docs', 'projects', 'pictures', 'music', 'backup', 'notes', 'scripts', 'downloads',
    'archive', 'src', 'web', 'data', 'old', 'work', 'misc', 'tmp', 'games', 'keys', 'invoices', 'photos-2024',
    'client_work', 'reports', 'thesis', 'dotfiles', 'exports', 'taxes', 'recipes', 'travel', 'assets', 'tests', 'bin',
    'lib', 'logs', 'cache', 'config', 'fonts', 'templates', 'sketches', 'models', 'videos', 'maps', 'textures',
    'shaders', 'fixtures', 'locales', 'migrations', 'containers', 'packages', 'benchmarks', 'experiments',
    'prototypes', 'releases', 'staging', 'public', 'shared', 'incoming', 'outgoing', 'puzzles', 'genealogy',
    'inventory', 'letters', 'sewing', 'woodworking', 'astronomy', 'api', 'cli', 'plugins', 'drivers', 'firmware',
    'kernels', 'sockets', 'queues', 'schemas', 'queries', 'parsers', 'codecs', 'sessions', 'telemetry', 'diagrams',
    'palettes', 'brushes', 'typesetting', 'subtitles', 'podcasts', 'lectures', 'origami', 'pottery', 'weaving',
    'calligraphy', 'beekeeping', 'aquariums', 'geology', 'weather', 'cycling', 'camping', 'meal_plans', 'book_club',
    'seat_charts', 'lost_found', 'adapters', 'compilers', 'linters', 'hooks', 'pipelines', 'workers', 'signals',
    'mounts', 'volumes', 'validators', 'renderers', 'surveys', 'storyboards', 'animations', 'screenplays', 'comics',
    'essays', 'poetry', 'auditions', 'rehearsals', 'set_design', 'field_trips', 'souvenirs', 'breadmaking',
    'tea_blends', 'climbing', 'kayaking', 'archery', 'juggling', 'bonsai', 'kites', 'rockets'];
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const BINARY = new Set(['png', 'jpg', 'gif', 'zip', 'tar.gz', 'gpg', 'pdf']);

  const nameOf = (p) => p.slice(p.lastIndexOf('/') + 1);
  const dirOf = (p) => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '');
  const extOf = (n) => (nameOf(n).includes('.') ? nameOf(n).slice(nameOf(n).indexOf('.') + 1) : '');
  const join = (d, n) => (d ? `${d}/${n}` : n);

  // A shell-safe realistic name: env.content.fileName without spaces or brackets, one dot.
  function shellName(crng, split) {
    for (let k = 0; k < 20; k++) {
      const n = fileNameIn(crng, split).replace(/\s+/g, '_').replace(/[()'",]/g, '');
      if (/^[A-Za-z0-9_-]+\.[a-z0-9]+(\.gz)?$/.test(n) && n.length <= 34) return n;
    }
    return null;
  }

  function sampleTerminal(rng, opts) {
    const crng = rng.fork('content');
    for (;;) {
      const kind0 = rng.pick(['here', 'here', 'folder', 'folder', 'find']);
      const kind = opts.level === 'easy' ? 'here' : opts.level === 'medium' && kind0 === 'find' ? 'folder' : kind0;
      const dirNames = rng.shuffle(C.split(SH_DIRS, opts.csplit).length > 6 ? C.split(SH_DIRS, opts.csplit) : SH_DIRS);
      let di = 0;
      const dirs = [];
      const nRoot = kind === 'here' ? rng.int(1, 2) : rng.int(2, opts.ood ? 4 : 3);
      for (let i = 0; i < nRoot; i++) {
        const d = dirNames[di++];
        dirs.push(d);
        if (rng.bool(opts.ood ? 0.7 : 0.4)) {
          const d2 = `${d}/${dirNames[di++]}`;
          dirs.push(d2);
          if (opts.ood && rng.bool(0.5)) dirs.push(`${d2}/${dirNames[di++]}`);
        }
      }
      const files = [];
      const fill = (d, n) => {
        const here = new Set();
        for (let tries = 0; here.size < n && tries < 200; tries++) {
          let name;
          if (rng.bool(0.45)) name = shellName(crng, opts.csplit);
          if (!name) {
            const ext = rng.pick(SH_EXTS);
            name = rng.pick(SH_NAMES) + (ext ? `.${ext}` : '');
          }
          if (here.has(name) || dirs.some((x) => x === join(d, name))) continue;
          here.add(name);
          files.push(join(d, name));
        }
      };
      fill('', LV(opts) ? rng.int(3, 4) : rng.int(3, opts.ood ? 9 : 6));
      for (const d of dirs) fill(d, LV(opts) ? rng.int(2, 3) : rng.int(2, opts.ood ? 7 : 4));
      files.sort();
      const dir = kind === 'here' ? '' : rng.pick(dirs);
      const inDir = files.filter((f) => dirOf(f) === dir);
      let pool;
      if (kind === 'find') pool = inDir.filter((f) => files.filter((g) => nameOf(g) === nameOf(f)).length === 1);
      else pool = inDir.filter((f) => inDir.filter((g) => extOf(g) === extOf(f)).length === 1);
      if (!pool.length) continue;
      const target = rng.pick(pool);
      const login = `${rng.pick(DAYS)} ${rng.pick(MON)} ${rng.int(1, 28)} ${String(rng.int(7, 22)).padStart(2, '0')}:${String(rng.int(0, 59)).padStart(2, '0')}:${String(rng.int(0, 59)).padStart(2, '0')} on ttys00${rng.int(0, 4)}`;
      const spec = { kind, dirs, files, target, dir, ext: extOf(target), login, recoverable: recoverable(rng, opts) };
      if (opts.traits && opts.traits.meta) spec.meta = termMeta(rng.fork('meta'), spec);
      return spec;
    }
  }

  // Trait meta: cosmetic per-path metadata for `ls -l` / `ls -la` ('' = ~, '..' = its parent): { size, mtime }, mtime
  // as ls prints it ('Mar  3 14:22', or 'Mar  3  2024' for old files). Drawn from its own fork of the spec rng.
  const SIZE_RANGE = { png: [18e3, 3.2e6], jpg: [40e3, 4e6], gif: [8e3, 9e5], zip: [12e3, 9e6], 'tar.gz': [30e3, 8e6],
    gpg: [1e3, 6e4], pdf: [30e3, 2e6], sh: [120, 4e3], json: [60, 9e3], txt: [30, 2e4], py: [200, 12e3], rb: [150, 8e3],
    html: [400, 3e4], md: [100, 1.5e4], csv: [300, 4e5], yml: [80, 3e3], log: [500, 9e5], js: [200, 5e4], toml: [60, 2e3],
    '': [100, 2e4] };
  function termMeta(r, spec) {
    const when = () => {
      const mo = MON[r.int(0, 11)];
      const d = String(r.int(1, 28)).padStart(2, ' ');
      if (r.bool(0.22)) return `${mo} ${d}  ${r.int(2022, 2024)}`;
      return `${mo} ${d} ${String(r.int(0, 23)).padStart(2, '0')}:${String(r.int(0, 59)).padStart(2, '0')}`;
    };
    const meta = { '': { size: 4096, mtime: when() }, '..': { size: 4096, mtime: when() } };
    for (const d of spec.dirs) meta[d] = { size: 4096, mtime: when() };
    for (const f of spec.files) {
      const [lo, hi] = SIZE_RANGE[extOf(f)] || SIZE_RANGE[''];
      meta[f] = { size: Math.round(lo + (hi - lo) * r.next() ** 2), mtime: when() };
    }
    return meta;
  }

  // `ls -l` lines for the entries of directory p (names, dirs with a trailing '/'); all adds . and ..
  function longListing(m, spec, p, items, all) {
    const meta = spec.meta;
    const one = (path, name, dir) => {
      const e = meta[path] || { size: dir ? 4096 : 0, mtime: 'Jan  1 00:00' };
      const links = dir ? 2 + m.dirs.filter((x) => dirOf(x) === path).length : 1;
      const exec = !dir && /\.sh$/.test(name);
      return { perm: dir ? 'drwxr-xr-x' : exec ? '-rwxr-xr-x' : '-rw-r--r--', links, size: e.size, mtime: e.mtime, name };
    };
    const rowsL = [];
    if (all) {
      rowsL.push(one(p, '.', true));
      rowsL.push(one(p ? dirOf(p) : '..', '..', true));
    }
    for (const it of items) {
      const dir = it.endsWith('/');
      const name = dir ? it.slice(0, -1) : it;
      rowsL.push(one(join(p, name), name, dir));
    }
    const wL = Math.max(...rowsL.map((x) => String(x.links).length), 1);
    const wS = Math.max(...rowsL.map((x) => String(x.size).length), 1);
    const blocks = rowsL.reduce((a, x) => a + Math.max(4, Math.ceil(x.size / 4096) * 4), 0);
    return [`total ${blocks}`].concat(rowsL.map((x) => `${x.perm} ${String(x.links).padStart(wL)} user user ${String(x.size).padStart(wS)} ${x.mtime} ${x.name}`));
  }

  function termInit(spec, rng) {
    let m = { cwd: '', dirs: spec.dirs.slice(), files: spec.files.slice(), history: [], line: '', seen: false,
      removed: [], trash: [], wrong: 0, cleared: 0, exited: false };
    if (spec.startMode === 'scene') {
      // The session already at the target's folder after a short startup transcript (pwd / cd / ls, long with the
      // meta trait), the prompt there; the file is listed but nothing removed.
      const sr = rng.fork('scene');
      const ls = spec.meta ? sr.pick(['ls -la', 'ls -la', 'ls -l']) : 'ls';
      const cmds = [];
      if (sr.bool(0.5)) cmds.push('pwd');
      if (spec.dir) cmds.push(sr.bool(0.5) ? `cd ${spec.dir}` : `cd ~/${spec.dir}`);
      if (spec.dir && sr.bool(0.3)) cmds.push('pwd');
      cmds.push(ls);
      for (const c of cmds) m = run(m, spec, c);
      return m;
    }
    if (spec.startMode === 'partial') {
      if (spec.dir) m = run(m, spec, rng.bool(0.5) ? `cd ${spec.dir}` : `cd ~/${spec.dir}`);
      else m = run(m, spec, 'ls');
      return m;
    }
    if (spec.startMode === 'wrong') {
      const wrongs = spec.files.filter((f) => f !== spec.target);
      const w = rng.pick(wrongs);
      if (spec.recoverable) {
        m = run(m, spec, dirOf(w) ? `cd ${dirOf(w)}` : 'ls');
        return run(m, spec, `rm ${nameOf(w)}`);
      }
      const other = spec.dirs.filter((d) => d !== spec.dir);
      if (other.length) m = run(m, spec, `cd ${rng.pick(other)}`);
      return { ...m, line: `rm ${nameOf(w)}` };
    }
    return m;
  }

  // Resolve a path argument against cwd. Returns a path relative to ~ ('' = ~) or null if it leaves ~.
  function resolvePath(cwd, arg) {
    let parts;
    let a = arg;
    if (a === '~' || a.startsWith('~/')) {
      parts = [];
      a = a.slice(1);
    } else if (a.startsWith('/home/user')) {
      parts = [];
      a = a.slice('/home/user'.length);
    } else if (a.startsWith('/')) return null;
    else parts = cwd ? cwd.split('/') : [];
    for (const seg of a.split('/')) {
      if (!seg || seg === '.') continue;
      if (seg === '..') {
        if (!parts.length) return null;
        parts.pop();
      } else parts.push(seg);
    }
    return parts.join('/');
  }

  const isDir = (m, p) => p === '' || m.dirs.includes(p);
  const isFile = (m, p) => m.files.includes(p);
  function listing(m, d) {
    const kids = m.dirs.filter((x) => dirOf(x) === d).map((x) => `${nameOf(x)}/`)
      .concat(m.files.filter((x) => dirOf(x) === d).map(nameOf));
    return kids.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }
  function hash(s) {
    let h = 7;
    for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  }
  const CAT_LINES = ['TODO: clean this up before Friday.', 'hello world', 'version = 1.4.2', 'do not share this file',
    'last edited by user', '# notes from the meeting', 'echo "build ok"', '{ "enabled": true }', 'remember to back up',
    'total,amount\n2024-03,1180.50', 'DEBUG=false', 'see the wiki for details', '# draft from the afternoon review',
    'meeting moved to room 3', 'warning: retry count reached 2', 'name,count', 'cedar,14',
    'keep this section for reference', 'status: waiting on response', '{"mode": "quiet"}',
    'check the labels before packing', 'owner = "ops"', 'remove old copies after review', 'path,kind',
    'log level set to info', 'maybe split this into two parts', 'items remaining: 8',
    'include a short summary at the top', 'port = 8081', '# copied from the whiteboard', 'alpha,beta,gamma',
    'sync paused until noon', 'use the newer draft for edits', '{"retries": 3, "active": false}',
    'contact list refreshed', 'keep filenames lowercase', 'build finished in 12 seconds', 'section,enabled',
    'search,true', 'ask Maya about the missing page', 'nothing to report today', 'backup completed at 18:45',
    'review notes before sending', 'file,bytes', 'changes saved locally', '# agenda for the next check-in',
    'cache = false', 'please leave the side gate clear', 'item,category,quantity', 'queued for the morning pickup',
    '{"display": "compact"}', 'reminder: bring the updated map', 'batch finished with 4 skipped rows', 'region,active',
    'north,false', '# labels still need a second pass', 'parcel held at the front desk', 'source,target',
    'inbox,archive', 'no changes since the last snapshot', 'retry delay set to 5 seconds', 'shelf,position',
    '# use the spare key after lunch', '{"visible": false, "rank": 2}', 'code,description',
    'folder list updated this morning', 'warning: one field was left blank', 'sort order set to ascending',
    '{"source": "local", "fresh": true}', 'records,archived', 'last scan found no loose pages', 'format = "wide"',
    'section title needs a shorter name', '# shelf check from the early shift', 'status,updated', 'west wing,yes',
    'export finished with 2 empty rows', 'label = "unassigned"', 'station,operator', 'packing,night',
    '# spare parts count after cleanup', 'keep the receipt with the parcel', 'scan,match',
    'folder renamed for easier sorting', 'category,total', '# measurements from the west shelf', 'mode = "manual"',
    'no labels were damaged in transit', 'page,visible', 'cover,true', 'keep this copy near the entrance',
    '{"columns": 2, "border": true}', 'section,owner', 'supplies,desk', '# notes for the closing shift',
    'file size remains below the limit'];

  // The shell: run one command line, return the next model (pure).
  function run(model, spec, line) {
    const m = clone(model);
    const cmdText = String(line);
    const out = [];
    const args = cmdText.trim().split(/\s+/).filter(Boolean);
    const cmd = args.shift() || '';
    const entry = { cwd: m.cwd, cmd: cmdText, out };
    m.line = '';
    m.trash = m.trash || [];
    switch (cmd) {
      case '':
        break;
      case 'help':
        out.push('ls [dir]      list a directory', 'cd [dir]      change directory (~ is home, .. goes up)',
          'pwd           print the current directory', 'cat <file>    print a file',
          spec.recoverable ? 'rm <file>...  move files to the Trash' : 'rm <file>...  remove files',
          ...(spec.recoverable ? ['undo          restore the last file removed with rm'] : []),
          'clear         clear the screen', 'exit          end the session');
        break;
      case 'ls': {
        const targets = args.filter((a) => !a.startsWith('-'));
        // -l / -a only with the meta trait (spec.meta); without it the flags are accepted and ignored.
        const flags = args.filter((a) => a.startsWith('-')).join('');
        const long = !!spec.meta && flags.includes('l');
        const all = !!spec.meta && /a|A/.test(flags);
        if (!targets.length) targets.push('.');
        for (const a of targets) {
          const p = resolvePath(m.cwd, a);
          if (p !== null && isDir(m, p)) {
            const items = listing(m, p);
            if (targets.length > 1) out.push(`${a}:`);
            if (long) out.push(...longListing(m, spec, p, items, all));
            else out.push((all ? ['.', '..', ...items] : items).join('  '));
            if (p === spec.dir && items.includes(nameOf(spec.target)) && m.files.includes(spec.target)) m.seen = true;
          } else if (p !== null && isFile(m, p)) out.push(long ? longListing(m, spec, dirOf(p), [nameOf(p)], false)[1] : a);
          else out.push(`ls: cannot access '${a}': No such file or directory`);
        }
        break;
      }
      case 'cd': {
        const a = args[0] || '~';
        if (args.length > 1) {
          out.push('cd: too many arguments');
          break;
        }
        const p = resolvePath(m.cwd, a);
        if (p === null) out.push(`cd: ${a}: Permission denied`);
        else if (isDir(m, p)) m.cwd = p;
        else if (isFile(m, p)) out.push(`cd: ${a}: Not a directory`);
        else out.push(`cd: ${a}: No such file or directory`);
        break;
      }
      case 'pwd':
        out.push('/home/user' + (m.cwd ? `/${m.cwd}` : ''));
        break;
      case 'whoami':
        out.push('user');
        break;
      case 'echo':
        out.push(args.join(' '));
        break;
      case 'cat': {
        if (!args.length) {
          out.push('cat: missing file operand');
          break;
        }
        for (const a of args) {
          const p = resolvePath(m.cwd, a);
          if (p !== null && isFile(m, p)) out.push(...(BINARY.has(extOf(p)) ? [`cat: ${a}: binary file`] : CAT_LINES[hash(p) % CAT_LINES.length].split('\n')));
          else if (p !== null && isDir(m, p)) out.push(`cat: ${a}: Is a directory`);
          else out.push(`cat: ${a}: No such file or directory`);
        }
        break;
      }
      case 'rm': {
        if (!args.length) {
          out.push('rm: missing operand');
          break;
        }
        for (const a of args) {
          if (a.startsWith('-')) {
            out.push(`rm: option '${a}' is not supported`);
            continue;
          }
          if (a.includes('*') || a.includes('?')) {
            out.push('rm: wildcards are not supported; type the exact file name');
            continue;
          }
          const p = resolvePath(m.cwd, a);
          if (p !== null && isFile(m, p)) {
            m.files = m.files.filter((f) => f !== p);
            m.removed.push(p);
            if (p !== spec.target) m.wrong = (m.wrong || 0) + 1;
            if (spec.recoverable) {
              m.trash.push(p);
              out.push(`moved '${a}' to the Trash (type undo to restore it)`);
            }
          } else if (p !== null && isDir(m, p)) out.push(`rm: cannot remove '${a}': Is a directory`);
          else out.push(`rm: cannot remove '${a}': No such file or directory`);
        }
        break;
      }
      case 'undo': {
        if (!spec.recoverable) {
          out.push('undo: command not found');
          break;
        }
        const p = m.trash.pop();
        if (p === undefined) out.push('undo: nothing to restore');
        else {
          m.files = m.files.concat([p]).sort();
          m.removed = m.removed.filter((x) => x !== p);
          out.push(`restored '~/${p}'`);
        }
        break;
      }
      case 'clear':
        m.history.push(entry);
        m.cleared = m.history.length;
        return m;
      case 'exit':
        out.push('logout');
        m.exited = true;
        break;
      default:
        out.push(`${cmd}: command not found`);
    }
    m.history.push(entry);
    if (m.history.length > 200) {
      const drop = m.history.length - 200;
      m.history = m.history.slice(drop);
      m.cleared = Math.max(0, m.cleared - drop);
    }
    return m;
  }

  const termLimit = (spec) => (spec.recoverable ? 2 : 1);
  function termError(model, spec) {
    if (model.exited || model.removed.some((p) => p !== spec.target)) return 1;
    if (model.removed.includes(spec.target)) return 0;
    return 1 - (model.cwd === spec.dir ? 1 / 3 : 0) - (model.seen ? 1 / 3 : 0);
  }

  function termCommand(model, spec) {
    if (model.removed.some((p) => p !== spec.target)) return 'undo';
    if (model.cwd !== spec.dir) return spec.dir ? (model.cwd === '' ? `cd ${spec.dir}` : `cd ~/${spec.dir}`) : 'cd';
    if (!model.seen) return 'ls';
    return `rm ${nameOf(spec.target)}`;
  }

  function termPlan(model, spec) {
    if (termError(model, spec) === 0 || model.exited || (model.wrong || 0) >= termLimit(spec)) return null;
    if (model.removed.some((p) => p !== spec.target) && !spec.recoverable) return null;
    const want = termCommand(model, spec);
    return model.line === want ? { key: 'Enter' } : { type: [{ prompt: true }, want] };
  }

  const T_TERM = {
    here: ['Use the terminal below to delete {what}.', 'Remove {what} in the terminal.', 'Delete {what} using the shell.',
      'Delete {what} from your home directory with the terminal.',
      'Get rid of {what} using the command line.', 'Remove {what} from the home folder (use the terminal).',
      'Handle the removal of {what} in the shell.', 'Make {what} the file you remove in a shell.',
      'Use the shell to ensure {what} is deleted.'],
    folder: ['Use the terminal below to delete {what} in the folder {dir}.', 'Go to {dir} in the terminal and delete {what} there.',
      'Remove {what} inside {dir} using the shell.', 'Delete {what} from the {dir} directory.',
      'Remove {what} that is in {dir}, using the command line.', 'Clean up {dir}: delete {what} there with the terminal.',
      'Your shell task is to delete {what} in {dir}.', 'In {dir}, {what} is the file to remove via the shell.',
      'Use a shell command for the removal of {what} from {dir}.', 'Work in a shell on {dir}, deleting {what}.',
      'The terminal task for {dir}: deletion of {what}.', 'I need {what} deleted from {dir} through the shell.',
      'Let a shell command delete {what} from {dir}.', 'With {dir} as the shell directory, delete {what}.',
      'In the shell, {dir} has {what} for you to delete.', 'Deletion requested via terminal: {what} in {dir}.'],
    find: ['Use the terminal below to find and delete the file {f}.',
      'Delete the file named {f}, which is somewhere under your home directory.',
      'Find {f} with the terminal and remove it.', 'Delete the file {f}; it is in one of the folders in ~.',
      'Locate {f} with the shell and rm it.', 'Remove {f} from the file system using the terminal.',
      'Search under ~ in the terminal for {f}, then delete it.',
      'Track down {f} under ~; remove it through the shell.',
      'Search home folders for {f} and delete it via the shell.',
      '{f} is the file to locate and delete in the terminal.', 'I need {f} found and deleted through the terminal.',
      'Before deleting {f}, find it under ~ in the shell.', 'Please delete {f} in the shell after locating it.',
      'Find where {f} lives under ~; delete it in the terminal.',
      'For {f}, use a terminal search followed by deletion.', 'Deletion is needed for {f}; find it using the shell.',
      'The file name is {f}; find and delete it in the shell.', 'In the shell, work out where {f} is under ~; rm it.',
      'Handle finding and deleting {f} under ~ via the shell.'],
  };

  // Exposed for widgets.
  Object.assign(fam.helpers, { run });

  env.scenario('use-desktop-tools', {
    name: 'terminal',
    sample: sampleTerminal,
    init: termInit,
    error: termError,
    plan: termPlan,
    ended(model, spec) {
      if ((model.wrong || 0) >= termLimit(spec)) return 'wrong-delete';
      if (model.exited) return 'exit';
      return null;
    },
    solve(spec, m) {
      m.files = m.files.filter((f) => f !== spec.target);
      m.removed = [spec.target];
      m.exited = false;
      return m;
    },
    instruction(spec, rng) {
      const what = spec.ext
        ? rng.pick([`a file ending with the extension .${spec.ext}`, `the .${spec.ext} file`, `the file with the .${spec.ext} extension`])
        : rng.pick(['a file that has no file extension', 'the file without an extension']);
      const dir = rng.pick([`~/${spec.dir}`, q(spec.dir)]);
      const f = q(nameOf(spec.target));
      const core = tpl(rng, spec, T_TERM[spec.kind], { what, dir, f });
      const terse = spec.kind === 'find' ? `rm ${f}` : `delete ${what}${spec.kind === 'folder' ? ` in ${dir}` : ''}`;
      return say(rng, spec, core, terse);
    },
    changed: (m) => (m.removed || []).length > 0,
    prepared: (m, spec, e) => (m.cwd === spec.dir && m.seen && m.line === `rm ${nameOf(spec.target)}` && !m.removed.length ? 0 : e),
    confirmVerb: 'run the rm command',
    ambiguous(jr, spec) {
      const cands = spec.files.filter((p) => dirOf(p) !== '');
      const p = jr.pick(cands.length ? cands : spec.files);
      const dirs = spec.dirs.concat(['']).filter((d) => d !== dirOf(p) && !spec.files.includes(join(d, nameOf(p))));
      if (!dirs.length) return undefined;
      const d2 = jr.pick(dirs);
      spec.files = spec.files.concat([join(d2, nameOf(p))]).sort();
      const f = q(nameOf(p));
      const words = (d) => (d === '' ? ['home', '~', 'home directory'] : [d, d.split('/').pop()]);
      const show = (d) => (d === '' ? '~' : `~/${d}`);
      const near = (d) => d.split('/').map((_, i, a) => a.slice(0, i + 1).join('/')); // the folder and its parents
      const skip = [dirOf(p), d2].flatMap((d) => near(d).flatMap((x) => [x, x.split('/').pop()]));
      return { mode: 'ambiguous', cands: [words(dirOf(p)), words(d2)],
        others: othersOf(spec.dirs.flatMap((d) => [d, d.split('/').pop()]), skip, words(dirOf(p)), words(d2)),
        message: `There are two files named ${f}: one in ${show(dirOf(p))} and one in ${show(d2)}. Which one should I delete?`,
        templates: T_TERM.find, vars: { f }, terse: `rm ${f}` };
    },
    impossible(jr, spec) {
      const name = freshFile(jr, spec, new Set(spec.files.map((p) => nameOf(p).toLowerCase())), shellName);
      const f = q(name);
      return { mode: 'impossible', what: [name], message: `I can't do that: there is no file named ${name} in the file system.`, templates: T_TERM.find, vars: { f }, terse: `rm ${f}` };
    },
    facts(model, spec, add) {
      const dirText = spec.dir ? `~/${spec.dir}` : '~';
      // the home directory's value is /home/user: a bare '~' has no word to compare (kit/runtime/reply.js sameName)
      if (model.cwd) add('Current directory', `~/${model.cwd}`, [`/home/user/${model.cwd}`]);
      else add('Current directory', '/home/user', ['~', 'home', 'home directory']);
      add(`Files in ${dirText}`, model.files.filter((f) => dirOf(f) === spec.dir).length, null, ['files in the folder']);
      add('Files removed', model.removed.length, null, ['removed files']);
    },
    silent(next, prev, spec, rng, cands) {
      if (next.removed.includes(spec.target) && !prev.removed.includes(spec.target)) {
        cands.push((m) => {
          m.removed = m.removed.filter((x) => x !== spec.target);
          m.files = m.files.concat([spec.target]).sort();
          m.trash = (m.trash || []).filter((x) => x !== spec.target);
        });
      }
      if (next.cwd === spec.dir && prev.cwd !== spec.dir) cands.push((m) => { m.cwd = prev.cwd; });
    },
    retarget(s, spec, model, rng) {
      const pool = [];
      const dirs = spec.kind === 'here' ? [''] : spec.dirs;
      for (const d of dirs) {
        const inDir = model.files.filter((f) => dirOf(f) === d);
        for (const f of inDir) {
          if (f === spec.target) continue;
          const ok = spec.kind === 'find' ? model.files.filter((g) => nameOf(g) === nameOf(f)).length === 1
            : inDir.filter((g) => extOf(g) === extOf(f)).length === 1;
          if (ok) pool.push(f);
        }
      }
      if (!pool.length) return false;
      s.target = rng.pick(pool);
      s.dir = dirOf(s.target);
      s.ext = extOf(s.target);
      return true;
    },
    simulate(m, spec, step, now, t) {
      if (step.type) m = { ...m, line: step.type[1] };
      else m = run(m, spec, m.line);
      return m;
    },
    check() {
      const fails = [];
      const ts = { scenario: 'terminal', dirs: ['a', 'a/b'], files: ['x.txt', 'a/b/y.py'], target: 'a/b/y.py', dir: 'a/b' };
      let tm = termInit(ts);
      tm = run(tm, ts, 'cd a/b/../b');
      if (tm.cwd !== 'a/b') fails.push(`terminal: cd with .. gave ${tm.cwd}`);
      tm = run(tm, ts, 'cd ..');
      tm = run(tm, ts, 'ls b');
      if (!tm.seen) fails.push('terminal: ls of the target folder should mark it seen');
      if (run(tm, ts, 'rm *').removed.length) fails.push('terminal: rm * must not remove');
      if (run(tm, ts, 'rm ~/x.txt').removed[0] !== 'x.txt') fails.push('terminal: rm ~/x.txt failed');
      const tmeta = { ...ts, meta: termMeta(new env.Rng(5), ts) };
      const lla = run(termInit(tmeta), tmeta, 'ls -la').history[0].out;
      if (lla.length !== 5 || !/^total \d+$/.test(lla[0]) || !/^d\S+ +3 user user +4096 .+ \.$/.test(lla[1]) || !/ x\.txt$/.test(lla[4])) fails.push(`terminal: ls -la gave ${JSON.stringify(lla)}`);
      if (run(termInit(ts), ts, 'ls -l').history[0].out.join('|') !== 'a/  x.txt') fails.push('terminal: ls -l without meta must stay the short listing');
      const tr = { ...ts, recoverable: true };
      const tu = run(run(termInit(tr), tr, 'rm x.txt'), tr, 'undo');
      if (tu.removed.length || !tu.files.includes('x.txt')) fails.push('terminal: undo should restore the removed file');
      return fails;
    },
  });
})();
