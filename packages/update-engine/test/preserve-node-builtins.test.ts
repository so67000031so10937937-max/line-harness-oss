import { describe, expect, it } from 'vitest';
import {
  findBareNodeBuiltinSpecifiers,
  preserveNodeBuiltinSpecifiers,
} from '../scripts/preserve-node-builtins.mjs';

describe('preserveNodeBuiltinSpecifiers', () => {
  it('rewrites bare Node built-in specifiers to node: specifiers', () => {
    const source = [
      'import { Readable } from "stream";',
      "import { createHash } from 'crypto';",
      'import "events";',
      'const zlib = require("zlib");',
      "const fs = await import('fs');",
      'import pkg from "tar-stream";',
    ].join('\n');

    const rewritten = preserveNodeBuiltinSpecifiers(source);

    expect(rewritten).toContain('from "node:stream"');
    expect(rewritten).toContain("from 'node:crypto'");
    expect(rewritten).toContain('import "node:events"');
    expect(rewritten).toContain('require("node:zlib")');
    expect(rewritten).toContain("import('node:fs')");
    expect(rewritten).toContain('from "tar-stream"');
    expect(findBareNodeBuiltinSpecifiers(rewritten)).toEqual([]);
  });
});
