const puppeteer = require("puppeteer");
let url = "https://www.jumia.com.dz/catalog/?q=";
function initialzeQueries(urlWithoutQueries, SearchItem) {
  const finalQeury = SearchItem.split(" ").join("+");
  url = urlWithoutQueries + finalQeury;
  return url;
}
url = initialzeQueries(
  url,
  /*put here what you wanna search about:*/ "samsung"
);
async function scrape(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" }); // wait until page load

  const allArticles = await page.evaluate(() => {
    const articles = document.querySelectorAll("article.prd._fb.col.c-prd");
    return Array.from(articles).map((article) => {
      const title = article.querySelector("div.info h3.name")?.innerText;
      const productHtml = article.innerHTML;
      const curretPrice = article.querySelector("div.info div.prc")?.innerText;
      const oldPrice = article.querySelector(
        "div.info div.s-prc-w .old"
      )?.innerText;
      const discount = article.querySelector(
        "div.s-prc-w .bdg._dsct._sm"
      )?.innerText;
      const rating = article.querySelector("div.rev .stars._s")?.innerText;
      const image = article.querySelector("div.img-c img")?.dataset.src;
      const link = article.querySelector("a.core")?.href;
      return {
        title,
        curretPrice,
        oldPrice,
        discount,
        rating,
        image,
        link,
        productHtml,
      };
    });
  });

  console.log(allArticles);
  await browser.close();
  return allArticles;
}

scrape(url);

