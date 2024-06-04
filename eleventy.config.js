const fs = require('fs')
const path = require('path')

const { EleventyRenderPlugin } = require('@11ty/eleventy')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const pluginTOC = require('eleventy-plugin-toc')

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
  eleventyConfig.setLibrary(
    'md',
    markdownIt().use(markdownItAnchor, {
      tabIndex: false,
      level: [2, 3, 4]
    })
  )
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3', 'h4']
  })
  eleventyConfig.ignores.add('**/*.md')
  eleventyConfig.addWatchTarget("**/README.md");
  eleventyConfig.addWatchTarget("**/CHANGELOG.md");

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
