const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const {generateMessage, generateLocationMessage} = require('../../server/utils/message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'admin'
    var text = 'hello'
    expect(generateMessage(from, text)).include({
      from,
      text
    })
    expect(generateMessage(from, text).createdAt).to.be.a('number')
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location message object', () => {
    var from = 'admin'
    var lat = '12345678'
    var lng = '12345678'

    expect(generateLocationMessage(from, lat, lng)).include({
      from,
      url: `https://www.google.com/maps?q=${lat},${lng}`,
    })
    expect(generateLocationMessage(from, lat, lng).createdAt).to.be.a('number')
  });
});
