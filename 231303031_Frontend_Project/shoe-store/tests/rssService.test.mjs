import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { parseRssXml, getBlogPosts } from '../src/services/rssService.js';

// Chỉ dùng jsdom trong kiểm thử vì Node không có DOMParser của trình duyệt.
const dom = new JSDOM('');
globalThis.DOMParser = dom.window.DOMParser;
const xml = await readFile(new URL('../public/blog.xml', import.meta.url), 'utf8');
const feed = (items) => '<rss version="2.0"><channel>' + items + '</channel></rss>';

test('File dự phòng có 6 bài đầy đủ, mã duy nhất và tiếng Việt đúng', () => {
  const posts = parseRssXml(xml);
  assert.equal(posts.length, 6);
  assert.equal(new Set(posts.map(post => post.id)).size, 6);
  assert.equal(posts[0].title, 'Chọn giày cho một ngày đến trường');
  for (const post of posts) {
    assert.ok(post.description.includes('\n\n'));
    assert.ok(post.link.startsWith('https://'));
    assert.ok(!Number.isNaN(Date.parse(post.pubDate)));
    assert.notEqual(post.category, 'Chưa phân loại');
  }
});

test('Từ chối XML hỏng, HTML và dữ liệu không phải RSS 2.0', () => {
  for (const input of ['', '<rss><channel></rss>', '<html />', '<rss version="1.0"><channel /></rss>']) {
    assert.throws(() => parseRssXml(input), /XML không hợp lệ|RSS 2.0/);
  }
});

test('RSS không có bài trả mảng rỗng', () => {
  assert.deepEqual(parseRssXml(feed('')), []);
});

test('Đọc CDATA và entity như text, chấp nhận guid dạng URL', () => {
  const [post] = parseRssXml(feed('<item><title>A &amp; B</title><guid>https://example.com/1</guid><description><![CDATA[<b>Nội dung</b>]]></description></item>'));
  assert.equal(post.id, 'https://example.com/1');
  assert.equal(post.title, 'A & B');
  assert.equal(post.description, '<b>Nội dung</b>');
  assert.equal(post.category, 'Chưa phân loại');
  assert.equal(post.pubDate, '');
});

test('Thiếu guid thì dùng link, thiếu cả hai thì dùng số thứ tự', () => {
  const posts = parseRssXml(feed('<item><title>Một</title><link>https://example.com/a</link></item><item><title>Hai</title></item>'));
  assert.equal(posts[0].id, 'https://example.com/a');
  assert.equal(posts[1].id, 'post-2');
});

test('Báo lỗi tiêu đề trống và mã bài trùng', () => {
  assert.throws(() => parseRssXml(feed('<item><title> </title></item>')), /thiếu tiêu đề/);
  assert.throws(() => parseRssXml(feed('<item><title>A</title><guid>x</guid></item>'.repeat(2))), /bị trùng/);
});

test('Tải file mặc định và URL do người gọi truyền vào', async (context) => {
  const urls = [];
  context.mock.method(globalThis, 'fetch', async (url) => {
    urls.push(url);
    return new Response(xml);
  });
  assert.equal((await getBlogPosts()).length, 6);
  assert.equal((await getBlogPosts('/custom.xml')).length, 6);
  assert.deepEqual(urls, ['/blog.xml', '/custom.xml']);
});

test('Không che lỗi HTTP, lỗi mạng và XML lỗi do server trả về', async (context) => {
  const fetchMock = context.mock.method(globalThis, 'fetch', async () => new Response('', { status: 404 }));
  await assert.rejects(getBlogPosts(), /HTTP 404/);
  fetchMock.mock.mockImplementation(async () => { throw new Error('Mất mạng'); });
  await assert.rejects(getBlogPosts(), /Mất mạng/);
  fetchMock.mock.mockImplementation(async () => new Response('<html />'));
  await assert.rejects(getBlogPosts(), /RSS 2.0/);
});

test('Nguồn ngoài lỗi HTTP, mạng hoặc XML thì đọc file dự phòng', async (context) => {
  for (const failure of ['http', 'network', 'xml']) {
    const urls = [];
    const mock = context.mock.method(globalThis, 'fetch', async (url) => {
      urls.push(url);
      if (url === '/blog.xml') return new Response(xml);
      if (failure === 'network') throw new TypeError('Failed to fetch');
      return failure === 'http' ? new Response('', { status: 503 }) : new Response('<html />');
    });
    assert.equal((await getBlogPosts('https://rss.example/feed')).length, 6);
    assert.deepEqual(urls, ['https://rss.example/feed', '/blog.xml']);
    mock.mock.restore();
  }
});

test('Báo lỗi khi cả RSS ngoài và dữ liệu dự phòng đều thất bại', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => new Response('', { status: 404 }));
  await assert.rejects(getBlogPosts('https://rss.example/feed'), /RSS và dữ liệu Blog dự phòng/);
});
