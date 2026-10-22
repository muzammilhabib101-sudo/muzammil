/** Joins truthy class names. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Prefixes a public asset path with the configured base path. `next/link`
 * does this automatically for routes, but plain `<a href>` to files does not.
 */
export function withBasePath(path: `/${string}`): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
