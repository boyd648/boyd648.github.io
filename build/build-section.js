const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const template = fs.readFileSync(path.resolve(__dirname, '..', 'views', 'section.ejs'), 'utf8')

const buildSection = (section, articles) => {
  const secArticles = articles.filter(article => article.section == section)
  const dir = path.resolve(__dirname, '..', 'docs')
  const htmlPath = path.resolve(dir, `${section}/index.html`)
  const content = ejs.render(template, {section, articles: secArticles})

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(htmlPath, content)
}

module.exports = {buildSection}