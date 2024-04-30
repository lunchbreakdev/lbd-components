const fs = require('fs')
const path = require('path')

const { EleventyRenderPlugin } = require('@11ty/eleventy')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginWebc = require('@11ty/eleventy-plugin-webc')

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin)
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.addPlugin(pluginWebc, {
		components: [
			"npm:@11ty/eleventy-plugin-syntaxhighlight/*.webc",
		],
	})
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough')
  eleventyConfig.addPassthroughCopy({ './docs/global.css': 'global.css' })
  eleventyConfig.addPassthroughCopy({ './docs/prism.css': 'prism.css' })
  eleventyConfig.addPassthroughCopy({
    './packages/components/dist/lbd-components.min.js': 'lbd-components.min.js'
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
      .filter((dirent) => dirent.isDirectory() && fs.existsSync(path.resolve('./packages', dirent.name, 'package.json')) )
      .map((dirent) => {
        const packageJson = JSON.parse(fs.readFileSync(path.resolve('./packages', dirent.name, 'package.json')))

        return packageJson.name
      })
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
