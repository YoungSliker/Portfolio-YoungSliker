import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
test('initial entry stays below 600 KiB before optional effects',()=>{
 const html=fs.readFileSync('dist/index.html','utf8');const src=html.match(/<script[^>]+src="([^"]+)"/)![1];
 const bytes=fs.statSync(path.join('dist',src.split('/New/')[1])).size;
 console.log('initial entry bytes',bytes);expect(bytes).toBeLessThan(600*1024);
});
