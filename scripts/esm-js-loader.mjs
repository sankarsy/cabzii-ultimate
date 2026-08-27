/** Node ESM loader: resolve extensionless relative imports the way Next.js does. */
export async function resolve(specifier, context, nextResolve) {
  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !/\.[a-zA-Z][a-zA-Z0-9]*$/.test(specifier)
  ) {
    return nextResolve(`${specifier}.js`, context);
  }
  return nextResolve(specifier, context);
}
