import { ConsoleHandler } from './server/infra/console-handler.ts';
import { AppConfig, buildAppConfig } from './server/options.ts';
import { Transpiler } from './server/transpiler/mod.ts';
import { join, toFileUrl } from 'deno/path/mod.ts';
import { DinovelServer } from './server/server.ts';

export async function startDevServer(config: AppConfig): Promise<number> {
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

await startDevServer(buildAppConfig({
  entry: './www/mod.ts',
  assetsPath: './public',
}));
