const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const {isRealString} = require('../../server/utils/validation');

describe('isRealString', () => {
  it('should return return true for real string', () => {
    var realString = 'test string'

    expect(isRealString(realString)).equal(true)
  });

  it('should return return true for real string with spaces', () => {
    var spaceString = '    spaced string    '

    expect(isRealString(spaceString)).equal(true)
  });

  it('should return return false empty string', () => {
    var emptyString = ''

    expect(isRealString(emptyString)).equal(false)
  });

  it('should return return false for non string', () => {
    var nonString = 1

    expect(isRealString(nonString)).equal(false)
  });
});
