const { Item } = require("../models/model");

module.exports.data_get = async (req, res) => {
  let Q = req.query.q;
  let data;
  if (Q) {
    data = await Item.find({ $text: { $search: Q }, validated: true })
      .select("-_id -__v -addedOn -validated")
      .sort({
        addedOn: 1,
      });
    if (data.length === 0) {
      return res.status(404).json({ Error: `${Q} not found!` });
    } else {
      return res.status(200).json({ data: data });
    }
  } else {
    let num = parseInt(req.query.num) || 50;
    let page = parseInt(req.query.page) || 0;
    let documents = await Item.countDocuments().where({ validated: true });
    if (documents === 0) {
      return res.status(500).json({ Error: "No items were found" });
    } else {
      let pages = Math.ceil(documents / num);
      if (page > pages) {
        return res
          .status(400)
          .json({
            Error: `Invalid page number, pages range from 0 - ${pages}`,
          });
      } else {
        let skipPages = page * num;
        let range = documents - skipPages;
        let numLimit;
        if (range % num !== 0 && range < 0) {
          skipPages = (page - 1) * 1;
          numLimit = -range;
        } else {
          numLimit = num;
        }
        data = await Item.find({ validated: true })
          .select("-_id -__v -addedOn -validated")
          .populate({ path: "by", select: "-_id -__v -email -password -role" })
          .sort({
            addedOn: 1,
          })
          .skip(skipPages)
          .limit(numLimit);
        const response = {
          length: data.length,
          pages: pages,
          data: data,
        };
        return res.status(200).json(response);
      }
    }
  }
};

module.exports.data_get_param = async (req, res) => {
  try{
    let param = req.params.param;
    let data = await Item.find({ $text: { $search: param }, validated: true })
      .select("-_id -__v -addedOn -validated")
      .populate({ path: "by", select: "-_id -__v -email -password -role" })
      .sort({
        addedOn: 1,
      });
    if (data.length === 0) {
      return res.status(404).json({ Error: `${param} not found!` });
    } else {
      return res.status(200).json({ data: data });
    }
  }catch(err){
    res.status(200).json({Error: "Something went wrong"})
  }
}