const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const template = fs.readFileSync(path.resolve(__dirname, '..', 'views', 'home.ejs'), 'utf8')
const htmlPath = path.resolve(__dirname, '..', 'docs', 'index.html')

const buildHome = (articles) => {
  const sections = [...new Set(articles.map(article => article.section))]
  const content = ejs.render(template, {sections, articles})
  fs.writeFileSync(htmlPath, content)
}

module.exports = {buildHome}