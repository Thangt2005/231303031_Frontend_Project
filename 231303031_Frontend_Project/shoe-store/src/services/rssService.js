function getText(item, tagName) {
  const element = item.querySelector(tagName);
  return element ? element.textContent.trim() : '';
}

// Chuyển RSS 2.0 thành mảng object để component dùng map() hiển thị.
export function parseRssXml(xmlText) {
  const xml = new DOMParser().parseFromString(xmlText, 'application/xml');
  if (xml.querySelector('parsererror')) {
    throw new Error('XML không hợp lệ. Hãy kiểm tra các thẻ đóng và mở.');
  }
  if (xml.documentElement.tagName !== 'rss' ||
      xml.documentElement.getAttribute('version') !== '2.0' ||
      !xml.querySelector('rss > channel')) {
    throw new Error('Dữ liệu phải có cấu trúc RSS 2.0 với thẻ channel.');
  }

  const items = xml.querySelectorAll('rss > channel > item');
  const ids = [];
  return Array.from(items).map((item, index) => {
    const title = getText(item, 'title');
    const link = getText(item, 'link');
    const description = getText(item, 'description');
    // RSS ngoài có thể dùng URL làm guid; không bắt buộc guid là slug.
    const id = getText(item, 'guid') || link || 'post-' + (index + 1);
    if (!title) throw new Error('Bài viết số ' + (index + 1) + ' thiếu tiêu đề.');
    if (ids.includes(id)) throw new Error('Mã bài viết bị trùng: ' + id);
    ids.push(id);
    return {
      id,
      title,
      link,
      description,
      pubDate: getText(item, 'pubDate'),
      category: getText(item, 'category') || 'Chưa phân loại',
    };
  });
}

export async function getBlogPosts(url = `${import.meta.env?.BASE_URL ?? '/'}blog.xml`) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Không tải được bài viết (HTTP ' + response.status + ').');
  }
  const xmlText = await response.text();
  return parseRssXml(xmlText);
}
