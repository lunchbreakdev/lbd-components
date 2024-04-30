module.exports = {
  permalink: (data) =>
    data.page.filePathStem
      .replace('/README', '/index') + '.html',
}
