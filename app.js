const puppeteer = require("puppeteer");
const url= "https://www.jumia.com.dz/catalog/?q=ball";

async function scrape(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' }); // wait until page load

  const allArticles = await page.evaluate(() => {
    const articles = document.querySelectorAll("article.prd._fb.col.c-prd");
    return Array.from(articles).map((article) => {
      const title = article.querySelector("h3.name")?.innerText;
      const price = article.querySelector("div.prc")?.innerText;
      const oldPrice = article.querySelector("div.s-prc-w .old")?.innerText;
      const discount = article.querySelector("div.s-prc-w .bdg._dsct._sm")?.innerText;
      const rating = article.querySelector("div.rev .stars._s")?.innerText;
      const image = article.querySelector("div.img-c img")?.dataset.src;
      const link = article.querySelector("a.core")?.href;
      return { title, price, oldPrice, discount, rating, image, link };
    });
  });

  console.log(allArticles);

  await browser.close();
}

scrape(url);