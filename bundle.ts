import { Transpiler } from './server/transpiler/mod.ts';
import { join, toFileUrl } from 'deno/path/mod.ts';

const target = Deno.args[0] || Deno.cwd() + '/dist/public/main.js';
console.log('Saving bundle to: ' + target);

const transpiler = Transpiler.createESBuild({
  optimize: false,
  importMapURL: toFileUrl(join(Deno.cwd(), './import_map.json')),
  target: toFileUrl(join(Deno.cwd(), './www/mod.ts')),
  useImportMap: true,
});

const result = await transpiler.transpile();
if (result.output) {
  const saveFile = target;
  await Deno.writeTextFile(saveFile, result.output);
  console.log('File bundled successfully!');
  transpiler.kill();
  Deno.exit(0);
} else {
  console.log('No output, something went wrong!');
  transpiler.kill();
  Deno.exit(1);
}
