import { Application, Router } from 'oak';
import { AppConfig } from './options.ts';
import { InternalConsole } from './infra/console-handler.ts';
import { Transpiler, TranspilerWatchResult } from './transpiler/mod.ts';
import { parse } from 'deno/path/mod.ts';
import { clearReloadSockets, sendReloadEvent } from './routes/livereload.ts';
import { registerRoutes } from './routes/mod.ts';

export interface DevServer {
  start(): Promise<number>;
  stop(): void;
}

export class DinovelServer implements DevServer {
  #config: AppConfig;
  #console: InternalConsole;
  #transpiler: Transpiler;
  #controler?: AbortController;
  #watcher?: TranspilerWatchResult;
  #mainScript?: string;

  constructor(
    config: AppConfig,
    console: InternalConsole,
    transpiler: Transpiler,
  ) {
    this.#config = config;
    this.#console = console;
    this.#transpiler = transpiler;
  }

  async start(force = false): Promise<number> {
    this.#console.debug('Starting server...');
    if (this.#controler && !force) {
      this.#console.warn('Server already running.');
      return 5;
    }

    this.#controler?.abort();
    this.#controler = new AbortController();

    const app = new Application();
    const router = new Router();

    if (!this.#config.production) {
      this.#console.debug('Compiling...');
      await this.#registerMainScript(router);
      this.#console.debug('Compiling Done');
      this.#registerAbortRoute(router);
    }

    registerRoutes(this.#config, router, app);

    app.use(router.routes());
    app.use(router.allowedMethods());

    try {
      console.debug('Server started at: http://localhost:' + this.#config.port + '/');
      await app.listen({
        port: this.#config.port,
        signal: this.#controler.signal,
        secure: false,
        hostname: '0.0.0.0',
      });
      return 0;
    } catch (err) {
      this.#console.error(err);
      return 1;
    }
  }

  stop(): void {
    clearReloadSockets();
    this.#watcher?.stop();
    this.#controler?.abort();
  }

  #registerAbortRoute(router: Router): void {
    router.get('/abort', (ctx) => {
      this.stop();
      ctx.response.body = 'OK';
    });
  }

  async #registerMainScript(router: Router) {
    if (this.#watcher) {
      this.#watcher.stop();
    }

    this.#watcher = await this.#transpiler.watch(
      [parse(this.#config.entry).dir],
      ['ts', 'tsx', 'js', 'jsx'],
    );

    this.#watcher.results.subscribe((result) => {
      if (result.success) {
        this.#mainScript = result.output;
        sendReloadEvent();
      }
    });

    router.get('/main.js', (ctx) => {
      const result = this.#mainScript ?? 'alert("No main script found")';

      ctx.response.body = result;
      ctx.response.headers.set('Content-Type', 'application/javascript');
    });
  }
}
