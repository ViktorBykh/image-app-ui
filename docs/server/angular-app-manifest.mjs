
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/image-app-ui/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/image-app-ui"
  }
],
  assets: {
    'index.csr.html': {size: 9117, hash: '2a5ff5700972efcdf325f3bc3100756a235e3039161d1e0d4560fc48d54ebbf0', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1042, hash: '9192f03225ef5619c09c8990cc8729484f92ac56c07b5c4d2b2edca5c5f75d91', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 18297, hash: '5cc46e5d21ec0b718c6aacc27b7abb573d8c5461152dfe15a73129ba4322ec27', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-C3CZPCGS.css': {size: 19836, hash: 'HLYwTYZ+rOs', text: () => import('./assets-chunks/styles-C3CZPCGS_css.mjs').then(m => m.default)}
  },
};
