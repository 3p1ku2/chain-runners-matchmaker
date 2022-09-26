/**
 * Split an array into chunks. The result is a two-dimensional array of chunks.
 *
 * @param array
 * @param chunkSize
 * @param cache
 *
 * @see https://youmightnotneed.com/lodash#chunk
 */
export function arrayChunked<T>(
  array: T[],
  chunkSize: number = 1,
  cache: T[][] = []
): T[][] {
  const tmp = [...array];

  if (chunkSize <= 0) return cache;

  while (tmp.length) cache.push(tmp.splice(0, chunkSize));

  return cache;
}
