import { register } from "node:module";

register(new URL("./esm-js-loader.mjs", import.meta.url));
