const fs = require('fs')
const path = require('path')
const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')

const createSitemap = (articles) => {
  const sections = [...new Set(articles.map(article => article.section))]
  const sectionLinks = sections.map(section => ({ url: `/${section}/`,  changefreq: 'monthly', priority: 0.7  }))
  const articleLinks = articles.map(article => ({ url: `/${article.section}/${article.canonical}`,  changefreq: 'monthly', priority: 0.7  }))

  // An array with your links
  const links = [{ url: `/`,  changefreq: 'monthly', priority: 0.7  }].concat(sectionLinks, articleLinks)

  // Create a stream to write to
  const stream = new SitemapStream( { hostname: 'https://boyd648.github.io/' } )

  // Return a promise that resolves with your XML string
  return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
  )
}

const buildSitemap = async (articles) => {
  const sm = await createSitemap(articles)
  const sitemapPath = path.resolve(__dirname, '..', 'docs', 'sitemap.xml')
  fs.writeFileSync(sitemapPath, sm)
}

module.exports = {buildSitemap}