import type { Route } from './router';
import type { CacheFs } from '../shared/lib/utils';
import { PagesManifest } from '../build/webpack/plugins/pages-manifest-plugin';
import BaseServer from './base-server';
export * from './base-server';
export default class NextNodeServer extends BaseServer {
    protected getHasStaticDir(): boolean;
    protected getPagesManifest(): PagesManifest | undefined;
    protected getBuildId(): string;
    protected generatePublicRoutes(): Route[];
    private _validFilesystemPathSet;
    protected getFilesystemPaths(): Set<string>;
    protected getCacheFilesystem(): CacheFs;
}
