const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const template = fs.readFileSync(path.resolve(__dirname, '..', 'views', 'article.ejs'), 'utf8')

const buildArticle = (article) => {
  const canonical = article.canonical.endsWith('html') ? article.canonical : `${article.canonical}.html`
  const dir = path.resolve(__dirname, '..', 'docs', article.section)
  const htmlPath = path.resolve(dir, canonical)
  const content = ejs.render(template, article)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(htmlPath, content)
}

module.exports = {buildArticle}