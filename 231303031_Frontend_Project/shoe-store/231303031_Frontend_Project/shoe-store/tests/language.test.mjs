import test from 'node:test';
import assert from 'node:assert/strict';
import reducer, { changeLanguage } from '../src/store/slice/LanguageSlice.js';
import { translate } from '../src/utils/translations.js';

test('Chuyển Việt–Anh và bỏ qua mã ngôn ngữ không hỗ trợ', () => {
  let language = reducer(undefined, { type: 'init' });
  assert.equal(language, 'vi');
  language = reducer(language, changeLanguage('en'));
  assert.equal(translate('Trang chủ', language), 'Home');
  assert.equal(reducer(language, changeLanguage('invalid')), 'en');
  language = reducer(language, changeLanguage('vi'));
  assert.equal(translate('Trang chủ', language), 'Trang chủ');
  assert.equal(translate('Nike Air Force', 'en'), 'Nike Air Force');
});
