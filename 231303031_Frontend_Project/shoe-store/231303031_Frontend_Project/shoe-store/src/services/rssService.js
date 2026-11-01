// Lấy nội dung thẻ XML, trả về chuỗi rỗng nếu không có thẻ.
function getText(blogItem, tagName) {
  const tag = blogItem.querySelector(tagName);

  if (!tag) {
    return '';
  }

  return tag.textContent.trim();
}

// Chuyển RSS 2.0 thành mảng bài viết để hiển thị.
export function parseRssXml(xmlText) {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(xmlText, 'application/xml');

  if (xmlDocument.querySelector('parsererror')) {
    throw new Error('File XML không đúng định dạng.');
  }

  const rssTag = xmlDocument.documentElement;
  const channelTag = xmlDocument.querySelector('rss > channel');

  if (
    rssTag.tagName !== 'rss' ||
    rssTag.getAttribute('version') !== '2.0' ||
    !channelTag
  ) {
    throw new Error('Dữ liệu không đúng định dạng RSS 2.0.');
  }

  const blogItems = xmlDocument.querySelectorAll('rss > channel > item');

  const blogIds = [];

  const blogList = Array.from(blogItems).map((blogItem, index) => {
    const title = getText(blogItem, 'title');
    const link = getText(blogItem, 'link');
    const description = getText(blogItem, 'description');
    const pubDate = getText(blogItem, 'pubDate');

    let id = getText(blogItem, 'guid');
    let category = getText(blogItem, 'category');

    // Dùng link hoặc số thứ tự làm mã nếu bài viết thiếu guid.
    if (!id) {
      id = link;
    }

    if (!id) {
      id = 'post-' + (index + 1);
    }

    if (!category) {
      category = 'Chưa phân loại';
    }

    if (!title) {
      throw new Error(
        'Bài viết thứ ' + (index + 1) + ' chưa có tiêu đề.',
      );
    }

    if (blogIds.includes(id)) {
      throw new Error('Mã bài viết đã tồn tại: ' + id);
    }

    blogIds.push(id);

    return {
      id,
      title,
      link,
      description,
      pubDate,
      category,
    };
  });

  return blogList;
}

// Tải XML và chuyển thành danh sách bài viết.
async function loadBlogPosts(blogUrl) {
  const abortController = new AbortController();

  // Dừng tải sau 8 giây để có thể chuyển sang nguồn dự phòng.
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, 8000);

  try {
    const response = await fetch(blogUrl, {
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(
        'Không tải được bài viết. Mã lỗi: ' + response.status,
      );
    }

    const xmlText = await response.text();
    const blogList = parseRssXml(xmlText);

    return blogList;
  } finally {
    // Xóa bộ hẹn giờ sau khi tải xong hoặc gặp lỗi.
    clearTimeout(timeoutId);
  }
}

const baseUrl = import.meta.env?.BASE_URL ?? '/';

// File blog.xml dự phòng nằm trong thư mục public.
const localBlogUrl = baseUrl + 'blog.xml';

// Dùng nguồn RSS đã cấu hình, mặc định đọc blog.xml.
const rssUrl = import.meta.env?.VITE_RSS_URL || localBlogUrl;

// Lấy danh sách bài viết, dùng file dự phòng nếu nguồn ngoài bị lỗi.
export async function getBlogPosts(blogUrl = rssUrl) {
  try {
    return await loadBlogPosts(blogUrl);
  } catch (error) {
    // Báo lỗi nếu file dự phòng cũng không tải được.
    if (blogUrl === localBlogUrl) {
      throw error;
    }

    try {
      return await loadBlogPosts(localBlogUrl);
    } catch {
      throw new Error(
        'Không tải được bài viết từ cả hai nguồn. Vui lòng thử lại sau.',
      );
    }
  }
}
