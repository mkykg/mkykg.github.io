self.__uv$config = {
    prefix: '/mk/search/',
    bare:'https://petezahgames.com/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/mk/uv/uv.handler.js',
    bundle: '/mk/uv/uv.bundle.js',
    config: '/mk/uv/uv.config.js',
    sw: '/mk/uv/uv.sw.js',
};
