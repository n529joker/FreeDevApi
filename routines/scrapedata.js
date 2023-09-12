const cron = require("node-cron");
const { Item } = require("../models/model");
const axios = require("axios");
const getData = require("../utils/getData");

const URLS = require("../utils/urls");

const newItems = {};

const scrapedData = async () => {
  let data = [];
  try {
    for (let url of URLS) {
      let res = await axios.get(url);
      let resData = await res.data;
      let items = await getData(resData);
      data.push(items);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

//schedule a cron Job that executes after every three minutes
const scrapeRoutine = () => {
  cron.schedule("0 0 */3 * *", async () => {
    let number = await Item.countDocuments();
    if (number >= 900) {
      let drop = await Item.deleteMany({});
    }
    let data = await scrapedData()
    let count = 0;
    for (let i of data) {
        for(let obj of i){
            let status = await Item.findOne({ link: obj.link });
            if (!status) {
              let item = await Item.create(obj);
              count++;
            }
        }
    }
    newItems.num = count
    newItems.date = new Date().getUTCDate()
  });
};

module.exports = { scrapeRoutine, newItems };
