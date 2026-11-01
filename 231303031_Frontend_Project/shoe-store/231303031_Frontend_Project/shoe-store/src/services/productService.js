// Tải danh sách sản phẩm từ file JSON tĩnh trong thư mục public.
export async function getProducts(
  url = `${import.meta.env?.BASE_URL ?? '/'}products.json`,
) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      'Không tải được danh sách sản phẩm (HTTP ' + response.status + ').',
    );
  }
  return response.json();
}
