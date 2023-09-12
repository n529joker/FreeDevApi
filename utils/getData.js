const cheerio = require("cheerio");
//const cron = require("node-cron");

const getData = async (data) => {
  let results = [];
  let $ = cheerio.load(data);
  let card = $(".cards");
  let count = 0;
  card.each((i, el) => {
    let item = {};
    item.imgSrc = $(el).find("img").attr("src") || null;
    item.title = $(el).find("h3").text().trim() || null;
    item.description =
      $(el).find("p.snippet").text().trim() ||
      $(el).find("div p:nth-child(2)").text().trim() ||
      null;
    let link =
      $(el).find("div:nth-child(3) > a:nth-child(4)").attr("href") ||
      $(el)
        .find("div:nth-child(3) > p:nth-child(1) > a:nth-child(1)")
        .attr("href") ||
      null;
    item.tag =
      $(el)
        .find("div:nth-child(2) > p:nth-child(3) > em:nth-child(1)")
        .text()
        .slice(5) ||
      $(el)
        .find("div:nth-child(2) > div:nth-child(3)")
        .text()
        .trim()
        .replace(/\s\s+/g, "")
        .replace(/^#/g, "")
        .replace(/#/g, ", ") ||
      null;

    item.link = link.split("?")[0];
    item.by = "64ef1ab0141bced575819691";
    item.validated = true;

    if (results.length < 75) {
      //check if an item with item.link already exists in results
      let exists = results.some(
        (result) =>
          result.link === item.link || result.description === item.description
      );
      if (!exists) {
        results.push(item);
      }
    } else {
      return false;
    }
  });

  let res = await results;
  return res;
};

module.exports = getData;
