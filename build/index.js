const fs = require('fs')
const path = require('path')
const {buildHome} = require('./build-home')
const {buildSection} = require('./build-section')
const {buildArticle} = require('./build-article')
const {buildSitemap} = require('./build-sitemap')

const srcFolder = path.resolve(__dirname, '..', 'src')

const getAllArticles = () => {
  const articles = []
  const files = fs.readdirSync(srcFolder)

  for (const file of files) {
    const filePath = path.join(srcFolder, file)
    const data = fs.readFileSync(filePath, 'utf8')
    articles.push(JSON.parse(data))
  }

  return articles
}

const build = async (article, rebuild=false) => {
  const articles = getAllArticles()

  if (rebuild) {
    articles.forEach(article => buildArticle(article))
    const sections = [...new Set(articles.map(article => article.section))]
    sections.forEach(section => buildSection(section, articles))
  }

  if (article) {
    buildArticle(article)
    buildSection(article.section, articles)
  }

  buildHome(articles)
  await buildSitemap(articles)
}

build(undefined, true)

module.exports = {build}