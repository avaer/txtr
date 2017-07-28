const txtr = require('.');

const textures = txtr(10, 10);
const n2 = textures.pack(2, 10);
const n3 = textures.pack(2, 2);
console.log(textures.uv(n3));
