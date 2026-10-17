import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legacyAsset } from '../lib/assets.ts';

test('legacy media resolves beside New under the GitHub Pages repository path', () => {
  assert.equal(legacyAsset('AIGC/绥远方志.jpg', '/Portfolio-YoungSliker/New/'),
    '/Portfolio-YoungSliker/AIGC/%E7%BB%A5%E8%BF%9C%E6%96%B9%E5%BF%97.jpg');
});
test('spaces, hash and percent in filenames are encoded without becoming URL syntax', () => {
  assert.equal(legacyAsset('images/a #100%.png', '/New/'), '/images/a%20%23100%25.png');
});
test('legacy asset paths cannot escape the repository or use external URLs', () => {
  for (const path of ['../secret', '/private', 'https://example.com/a', 'AIGC/../../a', 'a\\b']) {
    assert.throws(() => legacyAsset(path, '/Portfolio-YoungSliker/New/'));
  }
});
