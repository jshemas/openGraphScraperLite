import { expect } from 'chai';

/* eslint-disable mocha/no-setup-in-describe */
import {
  findImageTypeFromUrl,
  isImageTypeValid,
  optionSetup,
  removeNestedUndefinedValues,
} from '../../lib/utils';

describe('utils', function () {
  describe('findImageTypeFromUrl', function () {
    it('foobar.com/image.png?test=true', function () {
      const type = findImageTypeFromUrl('foobar.com/image.png?test=true');
      expect(type).to.eql('png');
    });
    it('foobar.com/image.png', function () {
      const type = findImageTypeFromUrl('foobar.com/image.png');
      expect(type).to.eql('png');
    });
    it('image.png', function () {
      const type = findImageTypeFromUrl('image.png');
      expect(type).to.eql('png');
    });
    it('image', function () {
      const type = findImageTypeFromUrl('image');
      expect(type).to.eql('image');
    });
    it('empty string', function () {
      const type = findImageTypeFromUrl('');
      expect(type).to.eql('');
    });
  });

  describe('isImageTypeValid', function () {
    it('when type is png', function () {
      const valid = isImageTypeValid('png');
      expect(valid).to.eql(true);
    });
    it('when type is foo', function () {
      const valid = isImageTypeValid('foo');
      expect(valid).to.eql(false);
    });
  });

  describe('removeNestedUndefinedValues', function () {
    it('when there is no undef values', function () {
      const object = removeNestedUndefinedValues({ one: 1 });
      expect(object).to.eql({ one: 1 });
    });
    it('when there is undef values', function () {
      const object = removeNestedUndefinedValues({ one: 1, two: undefined });
      expect(object).to.eql({ one: 1 });
    });
    it('when there is a nested undef value', function () {
      const object = removeNestedUndefinedValues({ one: 1, two: { three: undefined } });
      expect(object).to.eql({ one: 1, two: {} });
    });
  });

  describe('optionSetup', function () {
    it('when passing nothing into optionSetup', function () {
      const { options } = optionSetup({});
      expect(options).to.eql({ onlyGetOpenGraphInfo: false });
    });
    it('when passing onlyGetOpenGraphInfo into optionSetup', function () {
      const { options } = optionSetup({ onlyGetOpenGraphInfo: true });
      expect(options).to.eql({ onlyGetOpenGraphInfo: true });
    });
  });
});
