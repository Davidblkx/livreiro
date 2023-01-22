import { Application, Router } from 'oak';
import { AppConfig } from '../options.ts';
import { RouteConfig } from './model.ts';

import { registerAssetsRoute } from './assets.ts';
import { registerFrontendRoute } from './frontend.ts';
import { registerLivereloadRoute } from './livereload.ts';

import { registerApiOptionsRoute } from './api/options.ts';
import { registerApiSearchRoute } from './api/search.ts';

const AppRoutes: RouteConfig[] = [
  registerFrontendRoute,
  registerLivereloadRoute,

  // API
  registerApiSearchRoute,
  registerApiOptionsRoute,

  // Allways register assets route last
  registerAssetsRoute,
];

export function registerRoutes(config: AppConfig, router: Router, app: Application) {
  AppRoutes.forEach((route) => route(config, router, app));
}
