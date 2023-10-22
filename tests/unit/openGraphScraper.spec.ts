import { expect } from 'chai';
import sinon from 'sinon';

import chardet from 'chardet';
import ogs from '../../index';

const basicHTML = `
  <html>
    <head>
      <meta charset="utf-8">
      <meta property="og:description" content="test description">
      <meta property="og:title" content="test page">
      <meta property="foo" content="bar">
    </head>
    <body>
      <h1>hello test page</h1>
      <img width="360" src="test.png" alt="test">
      <img width="360" alt="test2">
    </body>
  </html>`;

const multipleImageHTML = `
  <html>
    <head>
      <title>test page</title>
      <meta property="og:image" content="test1.png">
      <meta property="og:image" content="test2.png">
    </head>
    <body>
      <h1>hello test page</h1>
    </body>
  </html>`;

const metaDescriptionHTML = `
  <html>
    <head>
      <title>test page</title>
      <meta name="description" content="test description from meta">
    </head>
    <body>
      <h1>hello test page</h1>
    </body>
  </html>`;

const encodingHTML = `
  <html>
    <head>
      <title>тестовая страница</title>
      <meta property="og:description" content="привет тестовая страница<">
    </head>
    <body>
      <h1>привет тестовая страница<</h1>
    </body>
  </html>`;

const sandbox = sinon.createSandbox();

describe('return ogs', function () {
  afterEach(function () {
    sandbox.restore();
  });

  context('should be able to hit site and find OG title info', function () {
    it('with html', function () {
      return ogs({ html: basicHTML })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.ogTitle).to.be.eql('test page');
          expect(data.html).to.be.eql(basicHTML);
        });
    });

    it('with encoding set to null (this has been deprecated, but should still work)', function () {
      return ogs({ html: encodingHTML })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.charset).to.be.eql('UTF-8');
          expect(data.result.ogTitle).to.be.eql('тестовая страница');
          expect(data.result.ogDescription).to.be.eql('привет тестовая страница<');
          expect(data.html).to.be.eql(encodingHTML);
        });
    });

    it('when there is more then one image', function () {
      return ogs({ html: multipleImageHTML })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.ogTitle).to.be.eql('test page');
          expect(data.result.ogImage).to.be.eql([{
            url: 'test1.png',
            type: 'png',
          }, {
            url: 'test2.png',
            type: 'png',
          }]);
          expect(data.html).to.be.eql(multipleImageHTML);
        });
    });

    it('when meta description exist while og description does not', function () {
      return ogs({ html: metaDescriptionHTML })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.ogTitle).to.be.eql('test page');
          expect(data.result.ogDescription).to.be.eql('test description from meta');
          expect(data.html).to.be.eql(metaDescriptionHTML);
        });
    });

    it('using onlyGetOpenGraphInfo', function () {
      return ogs({ html: metaDescriptionHTML, onlyGetOpenGraphInfo: true })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.ogTitle).to.be.eql(undefined);
          expect(data.result.ogDescription).to.be.eql(undefined);
          expect(data.html).to.be.eql(metaDescriptionHTML);
        });
    });

    it('when there is a og:image:secure_url tag', function () {
      const secureUrlHTML = `
        <html>
          <head>
            <meta property="og:image:secure_url" content="test1.png">
          </head>
          <body></body>
        </html>`;

      return ogs({ html: secureUrlHTML })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.ogImage).to.be.eql([{
            url: 'test1.png', type: 'png',
          }]);
          expect(data.html).to.be.eql(secureUrlHTML);
        });
    });

    it('when there is a meta property tag but it has no content', function () {
      const missingContentHTML = `
        <html>
          <head>
            <meta property="og:title">
          </head>
        </html>`;

      return ogs({ html: missingContentHTML })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.ogTitle).to.not.exist;
          expect(data.html).to.be.eql(missingContentHTML);
        });
    });

    it('when there is a og:image:url tag', function () {
      const secureUrlHTML = `
        <html>
          <head>
            <meta property="og:image:url" content="test1.png">
          </head>
          <body></body>
        </html>`;

      return ogs({ html: secureUrlHTML })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.ogImage).to.be.eql([{
            url: 'test1.png', type: 'png',
          }]);
          expect(data.html).to.be.eql(secureUrlHTML);
        });
    });

    context('when charset and chardet are unknown', function () {
      beforeEach(async function () {
        sandbox.stub(chardet, 'detect').returns(false);
      });
      it('using promises', function () {
        return ogs({ html: basicHTML })
          .then(function (data) {
            expect(data.result.success).to.be.eql(true);
            expect(data.result.ogTitle).to.be.eql('test page');
            expect(data.html).to.be.eql(basicHTML);
          });
      });
    });

    it('when passing in a custom tag', function () {
      return ogs({
        html: basicHTML,
        customMetaTags: [{
          multiple: false,
          property: 'foo',
          fieldName: 'fooTag',
        }, {
          multiple: false,
          property: 'bar',
          fieldName: 'barTag',
        }],
      })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.customMetaTags?.fooTag).to.be.eql('bar');
          expect(data.result.ogTitle).to.be.eql('test page');
          expect(data.html).to.be.eql(basicHTML);
        });
    });

    it('when passing in a custom tag and nothing is found', function () {
      return ogs({
        html: basicHTML,
        customMetaTags: [{
          multiple: false,
          property: 'bar',
          fieldName: 'barTag',
        }],
      })
        .then(function (data) {
          expect(data.result.success).to.be.eql(true);
          expect(data.result.customMetaTags).to.be.undefined;
          expect(data.result.ogTitle).to.be.eql('test page');
          expect(data.html).to.be.eql(basicHTML);
        });
    });
  });

  context('should return the proper error data', function () {
    it('when trying to pass in empty html', function () {
      return ogs({ html: '' })
        .then(function () {
          expect('').to.be.eql('this should not happen');
        })
        .catch(function (data) {
          expect(data.error).to.be.eql(true);
          expect(data.result.success).to.be.eql(false);
          expect(data.result.error).to.eql('Must pass in `html` option.');
          expect(data.result.errorDetails.toString()).to.eql('Error: Must pass in `html` option.');
          expect(data.response).to.be.eql(undefined);
        });
    });
  });
});
