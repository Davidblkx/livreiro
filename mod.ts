import { ConsoleHandler } from './server/infra/console-handler.ts';
import { AppConfig, buildAppConfig } from './server/options.ts';
import { Transpiler } from './server/transpiler/mod.ts';
import { join, toFileUrl } from 'deno/path/mod.ts';
import { DinovelServer } from './server/server.ts';

const build = Deno.env.get('BUILD') || 'dev';

export async function startProdServer(config: AppConfig): Promise<number> {
  const internalConsole = new ConsoleHandler({
    minLogLevel: config.logLevel,
    canClear: true,
    showColors: true,
  });

  const transpiler = Transpiler.createESBuild({
    optimize: false,
    importMapURL: toFileUrl(join(config.root, config.importMapPath)),
    target: toFileUrl(join(config.root, config.entry)),
    useImportMap: config.useImportMap,
  });

  const server = new DinovelServer(config, internalConsole, transpiler);
  return await server.start();
}

const template = await Deno.readTextFile('./public/index.html');

await startProdServer(buildAppConfig({
  assetsPath: './public',
  production: true,
  port: 8080,
  indexTemplate: template,
  build,
}));
