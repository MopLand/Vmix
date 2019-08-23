module.exports = {
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    worker: {
      // page 的入口
      entry: 'src/worker/main.js',
      // 模板来源
      template: 'public/worker.html',
      // 在 dist/index.html 的输出
      filename: 'worker.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'project B Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'chunk-worker-vendors', 'worker']
    },
    company: {
      // page 的入口
      entry: 'src/company/main.js',
      // 模板来源
      template: 'public/company.html',
      // 在 dist/index.html 的输出
      filename: 'company.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'project A Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'chunk-company-vendors', 'company']
    },
  }