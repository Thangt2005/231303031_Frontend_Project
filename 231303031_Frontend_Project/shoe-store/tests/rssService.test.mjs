import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { parseRssXml, getBlogPosts } from '../src/services/rssService.js';

globalThis.DOMParser = new JSDOM('').window.DOMParser;
const xml = await readFile(new URL('../public/blog.xml', import.meta.url), 'utf8');
const feed = (items) => '<rss version="2.0"><channel>' + items + '</channel></rss>';

test('Đọc đủ 6 bài dự phòng, slug duy nhất và có nội dung', () => {
  const posts = parseRssXml(xml);
  assert.equal(posts.length, 6);
  assert.equal(new Set(posts.map(post => post.slug)).size, 6);
  for (const post of posts) {
    assert.ok(post.title && post.description && post.content);
    assert.ok(!Number.isNaN(Date.parse(post.pubDate)));
  }
});

test('Từ chối XML hỏng, HTML, sai phiên bản, thiếu channel và RSS rỗng', () => {
  for (const value of ['', '<rss>', '<html />', '<rss version="1.0"><channel /></rss>', '<rss version="2.0"/>', feed('')]) {
    assert.throws(() => parseRssXml(value));
  }
});

test('Slug từ tiêu đề không đổi khi thứ tự bài thay đổi', () => {
  const item = '<item><title>Giày mới</title><guid>https://example.com/1</guid></item>';
  const other = '<item><title>Bài khác</title></item>';
  assert.equal(parseRssXml(feed(item))[0].slug, 'giay-moi');
  assert.equal(parseRssXml(feed(other + item))[1].slug, 'giay-moi');
});

test('Đọc namespace và CDATA với prefix khác', () => {
  const [post] = parseRssXml(feed('<item xmlns:a="http://purl.org/dc/elements/1.1/" xmlns:c="http://purl.org/rss/1.0/modules/content/"><title>A &amp; B</title><a:creator>Tác giả</a:creator><c:encoded><![CDATA[<p>Nội dung</p>]]></c:encoded></item>'));
  assert.equal(post.title, 'A & B');
  assert.equal(post.author, 'Tác giả');
  assert.equal(post.content, '<p>Nội dung</p>');
});

test('Báo lỗi bài thiếu tiêu đề hoặc trùng slug', () => {
  assert.throws(() => parseRssXml(feed('<item/>')), /thiếu tiêu đề/);
  assert.throws(() => parseRssXml(feed('<item><title>A</title><guid>a</guid></item>'.repeat(2))), /bị trùng/);
});

test('Proxy thành công thì không tải dự phòng', async (context) => {
  const urls = [];
  context.mock.method(globalThis, 'fetch', async (url) => {
    urls.push(url);
    return new Response(xml);
  });
  assert.equal((await getBlogPosts()).length, 6);
  assert.deepEqual(urls, ['/rss-proxy/feed/']);
});

for (const kind of ['network', 'http', 'xml', 'empty']) {
  test('Dùng dự phòng khi nguồn ngoài lỗi: ' + kind, async (context) => {
    const urls = [];
    context.mock.method(globalThis, 'fetch', async (url) => {
      urls.push(url);
      if (url === '/blog.xml') return new Response(xml);
      if (kind === 'network') throw new TypeError('Failed to fetch');
      if (kind === 'http') return new Response('', { status: 502 });
      return new Response(kind === 'xml' ? '<rss>' : feed(''));
    });
    assert.equal((await getBlogPosts()).length, 6);
    assert.deepEqual(urls, ['/rss-proxy/feed/', '/blog.xml']);
  });
}

test('Sau 8 giây hủy nguồn bị treo và đọc dự phòng', async (context) => {
  let abortRequest;
  context.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    assert.equal(delay, 8000);
    abortRequest = callback;
    return 1;
  });
  context.mock.method(globalThis, 'clearTimeout', () => {});
  context.mock.method(globalThis, 'fetch', (url, options) => {
    if (url === '/blog.xml') return Promise.resolve(new Response(xml));
    return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('Abort')));
    });
  });
  const result = getBlogPosts();
  abortRequest();
  assert.equal((await result).length, 6);
});

test('Báo lỗi khi cả hai nguồn thất bại', async (context) => {
  const urls = [];
  context.mock.method(globalThis, 'fetch', async (url) => {
    urls.push(url);
    throw new Error('Mất mạng');
  });
  await assert.rejects(getBlogPosts(), /Không tải được RSS và blog.xml/);
  assert.deepEqual(urls, ['/rss-proxy/feed/', '/blog.xml']);
});
