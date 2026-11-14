// Proxy được cấu hình trong vite.config.js
const RSS_URL = '/rss-proxy/feed/';

// File dự phòng đặt trong thư mục public
const BACKUP_URL = '/blog.xml';

// Lấy nội dung của thẻ con
function getText(parent, tagName) {
  const element = parent.getElementsByTagName(tagName)[0];

  if (element) {
    return element.textContent.trim();
  }

  return '';
}

// Tạo slug cho đường dẫn bài viết
function makeSlug(guid, link, index) {
  // guid là chuỗi ngắn (như trong blog.xml) thì dùng luôn
  if (guid !== '' && !guid.includes('/') && !guid.includes(' ')) {
    return guid;
  }

  // Lấy phần cuối của link: https://abc.com/ten-bai-viet/ -> ten-bai-viet
  const parts = link.split('/');
  let lastPart = parts[parts.length - 1];

  if (lastPart === '') {
    lastPart = parts[parts.length - 2];
  }

  if (lastPart && !lastPart.includes('.') && !lastPart.includes('?')) {
    return lastPart;
  }

  return 'bai-viet-' + (index + 1);
}

// Chuyển XML thành danh sách blog
export function parseRssXml(xmlText) {
  const xml = new DOMParser().parseFromString(xmlText, 'text/xml');

  if (xml.querySelector('parsererror')) {
    throw new Error('File XML không hợp lệ');
  }

  const items = xml.getElementsByTagName('item');
  const blogList = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const title = getText(item, 'title');

    // Bỏ qua bài không có tiêu đề
    if (title === '') {
      continue;
    }

    const link = getText(item, 'link');
    const slug = makeSlug(getText(item, 'guid'), link, i);
    const description = getText(item, 'description');

    blogList.push({
      id: slug,
      slug: slug,
      title: title,
      link: link,
      author: getText(item, 'dc:creator') || getText(item, 'author') || 'Shoe Store',
      category: getText(item, 'category') || 'Chưa phân loại',
      pubDate: getText(item, 'pubDate'),
      description: description,
      content: getText(item, 'content:encoded') || description,
    });
  }

  // RSS rỗng cũng chuyển sang dữ liệu dự phòng
  if (blogList.length === 0) {
    throw new Error('RSS không có bài viết nào');
  }

  return blogList;
}

// Tải RSS từ một đường dẫn
async function loadRss(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Không tải được RSS. HTTP ' + response.status);
  }

  const xmlText = await response.text();
  return parseRssXml(xmlText);
}

// Thử proxy trước, nếu lỗi thì dùng blog.xml
export async function getBlogPosts() {
  try {
    return await loadRss(RSS_URL);
  } catch (error) {
    console.log('Không lấy được RSS qua proxy, dùng blog.xml', error);
    return await loadRss(BACKUP_URL);
  }
}