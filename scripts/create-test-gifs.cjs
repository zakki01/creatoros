const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, '..', 'test-assets');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// 1. Valid Animated GIF (2-frame pulsing 32x32 loop, Netscape 2.0 loop extension)
// Base64 of genuine animated GIF89a
const VALID_ANIMATED_GIF_B64 = 
  'R0lGODlhIAAgAPIAAAAAAP///8zMzDMzMwAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQB' +
  'AAAFACwAAAAAIAAgAAADUwi63P4wykmrZjfhzbv/YCiOZGmeaKqubOu+cOym8k3fdb7vff8Pj2CQ' +
  '8IFAgMNiUkmsLpm/YxQK5UFv1+z2F7g6fWBo0qjMfcxmn7S63o/P7/h8nmgAACH5BAEAAAUALAAA' +
  'AAAgACAAAANTCLrc/jDKSau9OOvNu/9gKI5kaZ5oqq5s675wLM/1feN4vu98rw8k2B2MvF6weEw2' +
  'c0VlU1jcLX866k5m/XavWsL4u4ObyyNweB2hmdfrub3+rtvv+Hx+CAEAOw==';

const validGifBuffer = Buffer.from(VALID_ANIMATED_GIF_B64, 'base64');
fs.writeFileSync(path.join(ASSETS_DIR, 'valid-reaction.gif'), validGifBuffer);
console.log('Created valid-reaction.gif:', validGifBuffer.length, 'bytes');

// 2. Fake Renamed File (PNG / Text disguised as .gif)
const fakeBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00This is a malicious executable disguised as a fake gif file.');
fs.writeFileSync(path.join(ASSETS_DIR, 'fake-renamed.gif'), fakeBuffer);
console.log('Created fake-renamed.gif:', fakeBuffer.length, 'bytes');

// 3. Oversized GIF (> 25MB)
// Header has GIF89a, but size is 26MB
const header = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xFF\xFF\xFF!\xF9\x04\x00\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
const padding = Buffer.alloc(26 * 1024 * 1024);
header.copy(padding, 0);
fs.writeFileSync(path.join(ASSETS_DIR, 'oversized.gif'), padding);
console.log('Created oversized.gif:', padding.length, 'bytes');

console.log('Test assets generated successfully in:', ASSETS_DIR);
