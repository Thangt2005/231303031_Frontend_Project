import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { parseRssXml, getBlogPosts } from '../src/services/rssService.js';

// Node không có DOMParser nên lấy từ jsdom
globalThis.DOMParser = new JSDOM('').window.DOMParser;

const blogXml = await readFile(new URL('../public/blog.xml', import.meta.url), 'utf8');

// Tạo RSS mẫu từ danh sách item
function makeFeed(items) {
  return '<rss version="2.0"><channel>' + items + '</channel></rss>';
}

test('Đọc đủ 6 bài trong blog.xml', () => {
  const posts = parseRssXml(blogXml);

  assert.equal(posts.length, 6);
  assert.equal(posts[0].slug, 'cach-chon-size-giay-online');
  assert.equal(posts[0].author, 'SHOE STORE');
  assert.ok(posts[0].content.includes('<h2>'));
});

test('Báo lỗi khi XML hỏng', () => {
  assert.throws(() => parseRssXml('<rss>'));
});

test('Báo lỗi khi RSS không có bài nào', () => {
  assert.throws(() => parseRssXml(makeFeed('')));
});

test('Bỏ qua bài không có tiêu đề', () => {
  const posts = parseRssXml(makeFeed('<item></item><item><title>A</title><guid>bai-a</guid></item>'));

  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, 'A');
});

test('Tạo slug từ guid, link hoặc số thứ tự', () => {
  const posts = parseRssXml(makeFeed(
    '<item><title>A</title><guid>bai-a</guid></item>' +
    '<item><title>B</title><guid>https://abc.com/?p=2</guid><link>https://abc.com/bai-b/</link></item>' +
    '<item><title>C</title><guid>https://abc.com/?p=3</guid></item>'
  ));

  assert.equal(posts[0].slug, 'bai-a');
  assert.equal(posts[1].slug, 'bai-b');
  assert.equal(posts[2].slug, 'bai-viet-3');
});

test('Proxy chạy được thì không đọc blog.xml', async () => {
  const urls = [];

  globalThis.fetch = async (url) => {
    urls.push(url);
    return new Response(blogXml);
  };

  const posts = await getBlogPosts();

  assert.equal(posts.length, 6);
  assert.deepEqual(urls, ['/rss-proxy/feed/']);
});

test('Proxy lỗi thì đọc blog.xml', async () => {
  const urls = [];

  globalThis.fetch = async (url) => {
    urls.push(url);

    if (url === '/blog.xml') {
      return new Response(blogXml);
    }

    return new Response('', { status: 502 });
  };

  const posts = await getBlogPosts();

  assert.equal(posts.length, 6);
  assert.deepEqual(urls, ['/rss-proxy/feed/', '/blog.xml']);
});

test('Báo lỗi khi cả proxy và blog.xml đều lỗi', async () => {
  globalThis.fetch = async () => {
    throw new Error('Mất mạng');
  };

  await assert.rejects(getBlogPosts());
});