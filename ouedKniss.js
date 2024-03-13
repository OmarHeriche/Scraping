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
  const articles = document.querySelectorAll("div.col-sm-6.col-md-4.col-lg-3.col-12");
  return Array.from(articles).map((article) => {
    const productHtml = article.innerHTML;
    const url = article.querySelector("a")?.href;
    const imageLink = article.querySelector("div.o-announ-card-image img")?.src;
    const title = article.querySelector("div.mx-2 h2.mb-1.announ-title-mobile")?.innerText;
    const price = article.querySelector(".price span")?.innerText;
    const location = article.querySelector(".line-height-1 span")?.innerText;
    const postedTime = article.querySelectorAll(".line-height-1 span")[1]?.innerText;
    const storeName = article.querySelector(".d-inline .text-capitalize.font-weight-bold.ms-2")?.innerText;
    return {
      title,
      imageLink,
      url,
      price,
      location,
      postedTime,
      storeName,
      productHtml,
    };
  });
});

console.log(allArticles);
await browser.close();
return allArticles;
}

scrape(url);