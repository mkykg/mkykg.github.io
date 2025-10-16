importScripts('/mk/uv/uv.bundle.js');
importScripts('/mk/uv/uv.config.js');
importScripts(__uv$config.sw || '/mk/uv/uv.sw.js')

const sw = new UVServiceWorker();

self.addEventListener('fetch', event =>
    event.respondWith(
        sw.fetch(event)
    )
);