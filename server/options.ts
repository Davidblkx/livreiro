import { buildTemplate } from './template.ts';
import type { ConsoleLogLevel } from './infra/console-handler.ts';
import type { CacheType } from './cache/mod.ts';

export interface AppConfig {
  /** Title of the site*/
  title: string;
  /**
   * Port to run the development server on
   * @default 8666
   */
  port: number;
  /**
   * Whether to watch for file changes
   * @default true
   */
  watch: boolean;
  /**
   * Entry file, relative to root
   * @default './main.ts'
   */
  entry: string;
  /**
   * Path to assets folder, relative to root
   * @default './assets'
   */
  assetsPath: string;
  /**
   * Html template to use for the index page
   */
  indexTemplate: string;
  /**
   * Root directory of the project
   * @default Deno.cwd()
   */
  root: string;
  /**
   * Path to folder where the build should be output
   * @default './dist'
   */
  dist: string;
  /**
   * Whether to use an import map
   * @default true
   */
  useImportMap: boolean;
  /**
   * Path to import map file
   * @default './import_map.json'
   */
  importMapPath: string;
  /**
   * Log level, one of 'debug', 'info', 'warn', 'error'
   * @default 'debug'
   */
  logLevel: ConsoleLogLevel;
  /**
   * Whether to run in production mode
   * @default false
   */
  production: boolean;
  /**
   * Version of the build
   */
  build: string;

  /**
   * Cache type to use
   * @default 'memory'
   */
  cache: CacheType;
}

export function buildAppConfig(opt?: Partial<AppConfig>): AppConfig {
  const options: AppConfig = {
    title: 'Livreiro',
    root: Deno.cwd(),
    port: 8666,
    watch: true,
    entry: 'main.ts',
    assetsPath: 'assets',
    indexTemplate: '',
    dist: 'dist',
    importMapPath: './import_map.json',
    useImportMap: true,
    logLevel: 'debug',
    production: false,
    build: 'dev',
    cache: 'memory',
    ...opt,
  };

  if (!options.indexTemplate) {
    options.indexTemplate = buildTemplate(options);
  }

  return options;
}
