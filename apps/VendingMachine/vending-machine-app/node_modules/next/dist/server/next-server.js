"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
};
exports.default = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = require("path");
var _constants = require("../shared/lib/constants");
var _recursiveReaddirSync = require("./lib/recursive-readdir-sync");
var _router = require("./router");
var _baseServer = _interopRequireWildcard(require("./base-server"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
class NextNodeServer extends _baseServer.default {
    getHasStaticDir() {
        return _fs.default.existsSync((0, _path).join(this.dir, 'static'));
    }
    getPagesManifest() {
        const pagesManifestPath = (0, _path).join(this.serverBuildDir, _constants.PAGES_MANIFEST);
        return require(pagesManifestPath);
    }
    getBuildId() {
        const buildIdFile = (0, _path).join(this.distDir, _constants.BUILD_ID_FILE);
        try {
            return _fs.default.readFileSync(buildIdFile, 'utf8').trim();
        } catch (err) {
            if (!_fs.default.existsSync(buildIdFile)) {
                throw new Error(`Could not find a production build in the '${this.distDir}' directory. Try building your app with 'next build' before starting the production server. https://nextjs.org/docs/messages/production-start-no-build-id`);
            }
            throw err;
        }
    }
    generatePublicRoutes() {
        if (!_fs.default.existsSync(this.publicDir)) return [];
        const publicFiles = new Set((0, _recursiveReaddirSync).recursiveReadDirSync(this.publicDir).map((p)=>encodeURI(p.replace(/\\/g, '/'))
        ));
        return [
            {
                match: (0, _router).route('/:path*'),
                name: 'public folder catchall',
                fn: async (req, res, params, parsedUrl)=>{
                    const pathParts = params.path || [];
                    const { basePath  } = this.nextConfig;
                    // if basePath is defined require it be present
                    if (basePath) {
                        const basePathParts = basePath.split('/');
                        // remove first empty value
                        basePathParts.shift();
                        if (!basePathParts.every((part, idx)=>{
                            return part === pathParts[idx];
                        })) {
                            return {
                                finished: false
                            };
                        }
                        pathParts.splice(0, basePathParts.length);
                    }
                    let path = `/${pathParts.join('/')}`;
                    if (!publicFiles.has(path)) {
                        // In `next-dev-server.ts`, we ensure encoded paths match
                        // decoded paths on the filesystem. So we need do the
                        // opposite here: make sure decoded paths match encoded.
                        path = encodeURI(path);
                    }
                    if (publicFiles.has(path)) {
                        await this.serveStatic(req, res, (0, _path).join(this.publicDir, ...pathParts), parsedUrl);
                        return {
                            finished: true
                        };
                    }
                    return {
                        finished: false
                    };
                }
            }, 
        ];
    }
    getFilesystemPaths() {
        if (this._validFilesystemPathSet) {
            return this._validFilesystemPathSet;
        }
        const pathUserFilesStatic = (0, _path).join(this.dir, 'static');
        let userFilesStatic = [];
        if (this.hasStaticDir && _fs.default.existsSync(pathUserFilesStatic)) {
            userFilesStatic = (0, _recursiveReaddirSync).recursiveReadDirSync(pathUserFilesStatic).map((f)=>(0, _path).join('.', 'static', f)
            );
        }
        let userFilesPublic = [];
        if (this.publicDir && _fs.default.existsSync(this.publicDir)) {
            userFilesPublic = (0, _recursiveReaddirSync).recursiveReadDirSync(this.publicDir).map((f)=>(0, _path).join('.', 'public', f)
            );
        }
        let nextFilesStatic = [];
        nextFilesStatic = !this.minimalMode && _fs.default.existsSync((0, _path).join(this.distDir, 'static')) ? (0, _recursiveReaddirSync).recursiveReadDirSync((0, _path).join(this.distDir, 'static')).map((f)=>(0, _path).join('.', (0, _path).relative(this.dir, this.distDir), 'static', f)
        ) : [];
        return this._validFilesystemPathSet = new Set([
            ...nextFilesStatic,
            ...userFilesPublic,
            ...userFilesStatic, 
        ]);
    }
    getCacheFilesystem() {
        return {
            readFile: (f)=>_fs.default.promises.readFile(f, 'utf8')
            ,
            readFileSync: (f)=>_fs.default.readFileSync(f, 'utf8')
            ,
            writeFile: (f, d)=>_fs.default.promises.writeFile(f, d, 'utf8')
            ,
            mkdir: (dir)=>_fs.default.promises.mkdir(dir, {
                    recursive: true
                })
            ,
            stat: (f)=>_fs.default.promises.stat(f)
        };
    }
    constructor(...args){
        super(...args);
        this._validFilesystemPathSet = null;
    }
}
exports.default = NextNodeServer;
Object.keys(_baseServer).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _baseServer[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _baseServer[key];
        }
    });
});

//# sourceMappingURL=next-server.js.map