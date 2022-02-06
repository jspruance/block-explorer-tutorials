"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRender = getRender;
var _render = require("../../../../server/web/render");
var _utils = require("../../../../server/web/utils");
const createHeaders = (args)=>({
        ...args,
        'x-middleware-ssr': '1'
    })
;
function sendError(req, error) {
    const defaultMessage = 'An error occurred while rendering ' + req.url + '.';
    return new Response(error && error.message || defaultMessage, {
        status: 500,
        headers: createHeaders()
    });
}
function getRender({ App , Document , pageMod , errorMod , rscManifest , buildManifest , reactLoadableManifest , isServerComponent , restRenderOpts  }) {
    return async function render(request) {
        const { nextUrl: url , cookies , headers  } = request;
        const { pathname , searchParams  } = url;
        const query = Object.fromEntries(searchParams);
        const req = {
            url: pathname,
            cookies,
            headers: (0, _utils).toNodeHeaders(headers)
        };
        // Preflight request
        if (request.method === 'HEAD') {
            return new Response(null, {
                headers: createHeaders()
            });
        }
        if (Document.getInitialProps) {
            const err = new Error('`getInitialProps` in Document component is not supported with `concurrentFeatures` enabled.');
            return sendError(req, err);
        }
        const renderServerComponentData = isServerComponent ? query.__flight__ !== undefined : false;
        const serverComponentProps = isServerComponent && query.__props__ ? JSON.parse(query.__props__) : undefined;
        delete query.__flight__;
        delete query.__props__;
        const renderOpts = {
            ...restRenderOpts,
            // Locales are not supported yet.
            // locales: i18n?.locales,
            // locale: detectedLocale,
            // defaultLocale,
            // domainLocales: i18n?.domains,
            dev: process.env.NODE_ENV !== 'production',
            App,
            Document,
            buildManifest,
            Component: pageMod.default,
            pageConfig: pageMod.config || {
            },
            getStaticProps: pageMod.getStaticProps,
            getServerSideProps: pageMod.getServerSideProps,
            getStaticPaths: pageMod.getStaticPaths,
            reactLoadableManifest,
            env: process.env,
            supportsDynamicHTML: true,
            concurrentFeatures: true,
            // When streaming, opt-out the `defer` behavior for script tags.
            disableOptimizedLoading: true,
            renderServerComponentData,
            serverComponentProps,
            serverComponentManifest: isServerComponent ? rscManifest : null,
            ComponentMod: null
        };
        const transformStream = new TransformStream();
        const writer = transformStream.writable.getWriter();
        const encoder = new TextEncoder();
        let result;
        let renderError;
        try {
            result = await (0, _render).renderToHTML(req, {
            }, pathname, query, renderOpts);
        } catch (err) {
            console.error('An error occurred while rendering the initial result:', err);
            const errorRes = {
                statusCode: 500,
                err
            };
            renderError = err;
            try {
                req.url = '/_error';
                result = await (0, _render).renderToHTML(req, errorRes, '/_error', query, {
                    ...renderOpts,
                    err,
                    Component: errorMod.default,
                    getStaticProps: errorMod.getStaticProps,
                    getServerSideProps: errorMod.getServerSideProps,
                    getStaticPaths: errorMod.getStaticPaths
                });
            } catch (err2) {
                return sendError(req, err2);
            }
        }
        if (!result) {
            return sendError(req, new Error('No result returned from render.'));
        }
        result.pipe({
            write: (str)=>writer.write(encoder.encode(str))
            ,
            end: ()=>writer.close()
        });
        return new Response(transformStream.readable, {
            headers: createHeaders(),
            status: renderError ? 500 : 200
        });
    };
}

//# sourceMappingURL=render.js.map