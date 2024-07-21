const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const {build} = require('../build')
const app = express()
const port = 3002

app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').__express)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload())

app.use(express.static('docs', {'extensions': ['html']}))

app.get('/write', (req, res) => {
  res.render('write', {  })
})

const writeImage = (image, section, writeImage=true) => {
  const imgDir = path.resolve(__dirname, '..', 'docs', 'assets', 'imgs', section)
  const imgPath = path.resolve(imgDir, image.name)

  if (writeImage) {
    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir, { recursive: true })
    }
    image.mv(imgPath)
  }

  return `/${section}/${image.name}`
}

const writeArticle = (article, writeArticle=true) => {
  const articlePath = path.resolve(__dirname, '..', 'src', `${article.canonical}.json`)
  if (writeArticle) {
    const articleJson = JSON.stringify(article, null, 2)
    fs.writeFileSync(articlePath, articleJson, 'utf8')
  }
  return articlePath
}

app.post('/submit', (req, res) => {
  const articleData = req.body
  const { image } = req.files
  articleData.canonical = articleData.canonical.toLowerCase()
  articleData.section = articleData.section.toLowerCase()
  articleData.imgPath = writeImage(image, articleData.section)
  articleData.published = (new Date()).toISOString()
  const articlePath = writeArticle(articleData)
  build(articleData)
  console.log(articleData)
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})