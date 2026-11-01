import test from 'node:test';
import assert from 'node:assert/strict';
import reducer, {
  addProduct,
  removeProduct,
} from '../src/store/slice/CompareSlice.js';
import productReducer, { load } from '../src/store/slice/ProductListSlice.js';

test('So sánh từ chối dữ liệu sai, trùng ID và sản phẩm thứ tư', () => {
  let state = reducer(undefined, { type: 'init' });
  state = reducer(state, addProduct(null));
  state = reducer(state, addProduct({ name: 'Thiếu ID' }));
  assert.equal(state.length, 0);
  state = reducer(state, addProduct({ id: 1, name: 'A' }));
  state = reducer(state, addProduct({ id: 1, name: 'Trùng' }));
  assert.equal(state.length, 1);
  state = reducer(state, addProduct({ id: 2 }));
  state = reducer(state, addProduct({ id: 3 }));
  state = reducer(state, addProduct({ id: 4 }));
  assert.deepEqual(
    state.map((product) => product.id),
    [1, 2, 3],
  );
  state = reducer(state, removeProduct(2));
  state = reducer(state, addProduct({ id: 4 }));
  assert.deepEqual(
    state.map((product) => product.id),
    [1, 3, 4],
  );
  for (const id of [1, 3, 4]) state = reducer(state, removeProduct(id));
  assert.deepEqual(state, []);
});

test('Reducer sản phẩm giữ nguyên hành vi sau khi chuyển sang JavaScript', () => {
  const products = [{ id: 1, name: 'Giày' }];
  assert.deepEqual(productReducer(undefined, load(products)), products);
});
