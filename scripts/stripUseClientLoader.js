const path = require("path");

function pascalFromKebab(name) {
  return String(name || "")
    .replace(/\.(mjs|js)$/i, "")
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/** Replace lucide-react with local SVGs so Next 14.2 barrel-optimize cannot
 * crash with TypeError: Cannot read properties of undefined (reading 'call'). */
module.exports = function lucideToRscLoader() {
  const rsc = path.resolve(__dirname, "../src/components/icons/rscIcons.js").replace(/\\/g, "/");
  const file = String(this.resourcePath || "").replace(/\\/g, "/");
  const iconMatch = file.match(/\/icons\/([^/]+)\.(mjs|js)$/i);
  if (iconMatch) {
    const name = pascalFromKebab(iconMatch[1]);
    return `import * as I from ${JSON.stringify(rsc)};
const Icon = I[${JSON.stringify(name)}] || I.IconStub;
export default Icon;
`;
  }
  return `export * from ${JSON.stringify(rsc)};
export { IconStub as default } from ${JSON.stringify(rsc)};
`;
};
