export function legacyAsset(path: string, base: string): string {
  if (!path || path.startsWith('/') || /[:\\]/.test(path) || path.split('/').some(p => p === '..' || p === '.')) {
    throw new Error('Expected a repository-relative media path');
  }
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  return new URL(`../${encoded}`, `https://local.invalid${base}`).pathname;
}
