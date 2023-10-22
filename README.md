# openGraphScraperLite

[![Node.js CI](https://github.com/jshemas/openGraphScraperLite/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/jshemas/openGraphScraperLite/actions?query=branch%3Amaster)
[![Known Vulnerabilities](https://snyk.io/test/github/jshemas/openGraphScraperLite/badge.svg)](https://snyk.io/test/github/jshemas/openGraphScraperLite)

A simple javascript module for scraping Open Graph and Twitter Card info from given HTML. For Node.js usage, we recommend `open-graph-scraper` by the same people and can do HTTP requests.

## Installation

```bash
npm install open-graph-scraper-lite --save
```

## Usage

```javascript
const ogs = require('open-graph-scraper');
const options = {
  html: `<html><head>
  <link rel="icon" type="image/png" href="https://bar.com/foo.png" />
  <meta charset="utf-8" />
  <meta property="og:description" name="og:description" content="html description example" />
  <meta property="og:image" name="og:image" content="https://www.foo.com/bar.jpg" />
  <meta property="og:title" name="og:title" content="foobar" />
  <meta property="og:type" name="og:type" content="website" />
  </head></html>`
};
ogs(options)
  .then((data) => {
    const { result } = data;
    console.log('result:', result);
  })
```

## Results JSON

```javascript
result: {
  ogDescription: 'html description example',
  ogTitle: 'foobar',
  ogType: 'website',
  ogImage: [ { url: 'https://www.foo.com/bar.jpg', type: 'jpg' } ],
  favicon: 'https://bar.com/foo.png',
  charset: 'utf-8',
  success: true
}
```

## Options

| Name                 | Info                                                                       | Default Value | Required |
|----------------------|----------------------------------------------------------------------------|---------------|----------|
| html                 | You can pass in an HTML string to run ogs on it. (use without options.url) | x             |          |
| onlyGetOpenGraphInfo | Only fetch open graph info and don't fall back on anything else.           | false         |          |
| customMetaTags       | Here you can define custom meta tags you want to scrape.                   | []            |          |

## Custom Meta Tag Example

```javascript
const ogs = require('open-graph-scraper');
const options = {
  html: `<html><head>
  <link rel="icon" type="image/png" href="https://bar.com/foo.png" />
  <meta charset="utf-8" />
  <meta property="og:description" name="og:description" content="html description example" />
  <meta property="og:image" name="og:image" content="https://www.foo.com/bar.jpg" />
  <meta property="og:title" name="og:title" content="foobar" />
  <meta property="og:type" name="og:type" content="website" />
  <meta name="hostname" content="github.com">
  </head></html>`,
  customMetaTags: [{
    multiple: false, // is there more than one of these tags on a page (normally this is false)
    property: 'hostname', // meta tag name/property attribute
    fieldName: 'hostnameMetaTag', // name of the result variable
  }],
};
ogs(options)
  .then((data) => {
    const { result } = data;
    console.log('hostnameMetaTag:', result.customMetaTags.hostnameMetaTag); // hostnameMetaTag: github.com
  })
```
