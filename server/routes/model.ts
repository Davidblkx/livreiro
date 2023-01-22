import type { Application, Router } from 'oak';
import { AppConfig } from '../options.ts';

export type RouteConfig = (config: AppConfig, router: Router, app: Application) => void;
