const BASE_URL = import.meta.env?.BASE_URL || '/';
// Proxy được cấu hình trong vite.config.js
const RSS_URL = BASE_URL + 'rss-proxy/feed/';
const BACKUP_URL = BASE_URL + 'blog.xml';

// Lấy nội dung của thẻ
function getText(parent, tagName) {
  const element = parent.getElementsByTagName(tagName)[0];
  return element ? element.textContent.trim() : '';
}

// Đọc tác giả và nội dung dù nguồn RSS dùng tên prefix khác
function getTextNS(parent, namespace, tagName) {
  const element = parent.getElementsByTagNameNS(namespace, tagName)[0];
  return element ? element.textContent.trim() : '';
}

function makeSlug(guid, title, index) {
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(guid)) {
    return guid;
  }

  const slug = title.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'bai-viet-' + (index + 1);
}

export function parseRssXml(xmlText) {
  const xml = new DOMParser().parseFromString(xmlText, 'application/xml');

  if (xml.querySelector('parsererror')) {
    throw new Error('File XML không hợp lệ');
  }

  const root = xml.documentElement;
  const channel = xml.querySelector('rss > channel');
  if (root.tagName !== 'rss' || root.getAttribute('version') !== '2.0' || !channel) {
    throw new Error('Dữ liệu phải là RSS 2.0 và có thẻ channel');
  }

  const items = xml.querySelectorAll('rss > channel > item');
  const blogList = [];
  const usedSlugs = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const title = getText(item, 'title');
    if (!title) {
      throw new Error('Bài viết số ' + (i + 1) + ' thiếu tiêu đề');
    }

    const slug = makeSlug(getText(item, 'guid'), title, i);
    if (usedSlugs.includes(slug)) {
      throw new Error('Đường dẫn bài viết bị trùng: ' + slug);
    }
    usedSlugs.push(slug);

    const description = getText(item, 'description');
    blogList.push({
      id: slug,
      slug,
      title,
      link: getText(item, 'link'),
      author: getTextNS(item, 'http://purl.org/dc/elements/1.1/', 'creator') || getText(item, 'author') || 'Shoe Store',
      category: getText(item, 'category') || 'Chưa phân loại',
      pubDate: getText(item, 'pubDate'),
      description,
      content: getTextNS(item, 'http://purl.org/rss/1.0/modules/content/', 'encoded') || description,
    });
  }

  // Nguồn rỗng cũng chuyển sang dữ liệu dự phòng
  if (blogList.length === 0) {
    throw new Error('RSS không có bài viết nào');
  }
  return blogList;
}

async function loadRss(url) {
  const controller = new AbortController();
  // Không chờ nguồn RSS quá 8 giây
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error('Không tải được RSS. HTTP ' + response.status);
    }
    return parseRssXml(await response.text());
  } finally {
    clearTimeout(timeout);
  }
}

// Thử proxy trước, nếu lỗi thì dùng blog.xml
export async function getBlogPosts(url = RSS_URL) {
  try {
    return await loadRss(url);
  } catch {
    if (url === BACKUP_URL) {
      throw new Error('Không tải được blog.xml. Vui lòng thử lại sau.');
    }
    try {
      return await loadRss(BACKUP_URL);
    } catch {
      throw new Error('Không tải được RSS và blog.xml. Vui lòng thử lại sau.');
    }
  }
}
