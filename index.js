/**
 * {% linkPreview https://www.amazon.com/ %}
 **/

'use strict';
const metascraper = require("metascraper")([
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-logo-favicon")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
]);

const got = require("got");

hexo.extend.tag.register('linkPreview', function(args) {
  return getTag({url: args[0], target: args[1], rel: args[2]}).then(tag => {
    return tag;
  });
}, {async: true});

async function getTag(options) {
  try {
    const { body: html, url } = await got(options.url);
    const metadata = await metascraper({ html, url });
    const result = `
    <div style="width: 99%; max-width: 99%; margin-top: 5px; margin-bottom: 5px; height: 108px; display: flex;">
      <a target="_blank" style="display: block; color: inherit; text-decoration: none; flex-grow: 1; min-width: 0px;" href="${metadata.url}">
        <div style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; width: 100%; display: flex; flex-wrap: wrap-reverse; align-items: stretch; text-align: left; overflow: hidden; border: 1px solid rgba(55, 53, 47, 0.16); border-radius: 3px; position: relative; color: inherit; fill: inherit;">
        <div style="flex: 4 1 180px; padding: 12px 14px 14px; overflow: hidden; text-align: left;">
          <div style="font-size: 14px; line-height: 20px; color: rgb(55, 53, 47); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-height: 24px; margin-bottom: 2px;">${metadata.title || ''}</div>
          <div style="font-size: 12px; line-height: 16px; color: rgba(55, 53, 47, 0.6); height: 32px; overflow: hidden;">${metadata.description || ''}</div>
          <div style="display: flex; margin-top: 6px;">
            <img src="${metadata.logo}" style="display: ${metadata.logo ? 'visible' : 'none'};width: 16px; height: 16px; min-width: 16px; margin-right: 6px;">
            <div style="font-size: 12px; line-height: 16px; color: rgb(55, 53, 47); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${metadata.url}</div>
          </div>
          </div>
          <div style="flex: 1 1 180px; display: block; position: relative;">
            <div style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px;">
              <div style="width: 100%; height: 100%;">
                <img src="${metadata.image}" style="display: ${metadata.image ? 'block' : 'none'}; object-fit: cover; border-radius: 1px; width: 100%; height: 100%;">
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
    `
    return result;
  } catch (e) {
    console.error(e);
  }
}
