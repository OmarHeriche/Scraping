const puppeteer = require("puppeteer");
let url = "https://www.ouedkniss.com/s/1?keywords=";
function initialzeQueries(urlWithoutQueries, SearchItem) {
  const finalQeury = SearchItem.split(" ").join("-");
  url = urlWithoutQueries + finalQeury;
  return url;
}
url = initialzeQueries(
  url,
  /*put here what you wanna search about:*/ "iphone 12"
);
async function scrape(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" }); // wait until page load

  const allArticles = await page.evaluate(() => {
    const articles = document.querySelectorAll(
      "div.col-sm-6.col-md-4.col-lg-3.col-12"
    );
    console.log("articles content is :", articles);
    return Array.from(articles).map((article) => {
      const articleHtml = article?.innerHTML;
      const nextChieldTest = article.querySelector(
        "div.search-view-item div.o-announ-card-column"
      )?.innerHTML;
      const title = article.querySelector("div.mx-2 h2")?.innerText;
      const infosHtml = article.querySelector("div.mx-2")?.innerHTML;
      return {
        articleHtml,
        nextChieldTest,
        title,
        infosHtml,
      };
    });
  });

  console.log(allArticles);
  await browser.close();
  return allArticles;
}
const routeOmar = "https://www.ouedkniss.com/s/1?keywords=macbook";
scrape(routeOmar);