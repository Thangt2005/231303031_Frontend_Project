
const CONTENT_NS = 'http://purl.org/rss/1.0/modules/content/';
const DC_NS = 'http://purl.org/dc/elements/1.1/';

// Lấy nội dung của thẻ 
function getText(parent, tagName) {
  const element = parent.getElementsByTagName(tagName)[0];

  if (element) {
    return element.textContent.trim();
  }

  return '';
}

// Lấy nội dung của thẻ có namespace
function getTextNS(parent, namespace, tagName) {
  const element = parent.getElementsByTagNameNS(namespace, tagName)[0];

  if (element) {
    return element.textContent.trim();
  }

  return '';
}

// Chuyển tiêu đề thành slug
export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Tạo slug 
function makeSlug(guid, title, index) {
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(guid)) {
    return guid;
  }

  const slug = slugify(title);

  if (slug) {
    return slug;
  }

  return 'bai-viet-' + (index + 1);
}

// Chuyển XML thành danh sách blog
export function parseRssXml(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'application/xml');

  // Kiểm Tra lỗi XML
  if (xml.getElementsByTagName('parsererror').length > 0) {
    throw new Error('File XML không hợp lệ');
  }

  const root = xml.documentElement;

  if (!root || root.nodeName !== 'rss') {
    throw new Error('Dữ liệu không phải RSS');
  }

  if (root.getAttribute('version') !== '2.0') {
    throw new Error('Chỉ hỗ trợ RSS 2.0');
  }

  const channel = root.getElementsByTagName('channel')[0];

  if (!channel) {
    throw new Error('RSS thiếu thẻ channel');
  }

  const items = channel.getElementsByTagName('item');
  const blogList = [];
  const usedSlugs = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const title = getText(item, 'title');
    const guid = getText(item, 'guid');
    const link = getText(item, 'link');
    const description = getText(item, 'description');

    if (!title) {
      throw new Error('Bài viết số ' + (i + 1) + ' thiếu tiêu đề');
    }

    const baseSlug = makeSlug(guid, title, i);
    let slug = baseSlug;
    let count = 2;

    while (usedSlugs.includes(slug)) {
      slug = baseSlug + '-' + count;
      count++;
    }

    usedSlugs.push(slug);

    const author =
      getTextNS(item, DC_NS, 'creator') ||
      getText(item, 'author') ||
      'Shoe Store';

    const category =
      getText(item, 'category') || 'Chưa phân loại';

    const pubDate = getText(item, 'pubDate');

    const content =
      getTextNS(item, CONTENT_NS, 'encoded') || description;

    // Thêm bài viết vào danh sách
    blogList.push({
      id: slug,
      slug: slug,
      title: title,
      link: link,
      author: author,
      category: category,
      pubDate: pubDate,
      description: description,
      content: content,
    });
  }

  return blogList;
}

async function loadRss(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      'Không tải được RSS. HTTP ' + response.status
    );
  }

  const xmlText = await response.text();

  return parseRssXml(xmlText);
}

const baseUrl = import.meta.env?.BASE_URL || '/';

const localBlogUrl =
  baseUrl.replace(/\/?$/, '/') + 'blog.xml';

const rssUrl =
  import.meta.env?.VITE_RSS_URL || localBlogUrl;

// Lấy danh sách bài viết từ RSS
export async function getBlogPosts(url = rssUrl) {
  try {
    return await loadRss(url);
  } catch (error) {
    if (url === localBlogUrl) {
      throw error;
    }

    try {
      return await loadRss(localBlogUrl);
    } catch (backupError) {
      throw new Error(
        'Không tải được RSS và file blog dự phòng'
      );
    }
  }
}
