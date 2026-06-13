// Base path the app is deployed under (e.g. "/grains"). Empty = root.
// Read from env so dev and prod stay in sync. Defaults to "/grains".
export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/grains";

/**
 * Resolve a public/static asset path for the current deployment base path.
 *   "/red_wheat.png"     -> "/grains/red_wheat.png"
 *   "./Images/arrow.svg" -> "/grains/Images/arrow.svg"
 *   "Images/foo.svg"     -> "/grains/Images/foo.svg"
 * External URLs (http(s)://, protocol-relative //, data:) are returned untouched.
 */
export function asset(path) {
  if (!path) return path;
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  return `${BASE_PATH}/${path.replace(/^\.?\//, "")}`;
}
