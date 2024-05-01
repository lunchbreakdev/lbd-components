const fs = require('fs')
const path = require('path')

const { EleventyRenderPlugin } = require('@11ty/eleventy')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin)
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough')
  eleventyConfig.addPassthroughCopy({ './docs/global.css': 'global.css' })
  eleventyConfig.addPassthroughCopy({ './docs/prism.css': 'prism.css' })
  eleventyConfig.addPassthroughCopy({
    './packages/components/dist/lbd-components.js': 'lbd-components.js',
  })
  eleventyConfig.addGlobalData('currentYear', () => new Date().getFullYear())
  eleventyConfig.addGlobalData('components', () => {
    return fs
      .readdirSync(path.resolve(__dirname, './components'), {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
  })
  eleventyConfig.addGlobalData('packages', () => {
    return fs
      .readdirSync(path.resolve(__dirname, './packages'), {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
  })

  return {
    dir: {
      includes: 'docs/_includes',
      layouts: 'docs/_layouts',
      data: 'docs/_data',
      output: 'docs/_site',
    },
    templateFormats: ['html', 'md', 'njk'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: false,
  }
}
