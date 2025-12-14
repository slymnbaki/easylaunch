// Basit bellek içi cache middleware
const cache = {};
module.exports = (duration = 10) => (req, res, next) => {
  const key = req.originalUrl;
  if (cache[key] && (Date.now() - cache[key].ts < duration * 1000)) {
    return res.json(cache[key].data);
  }
  const send = res.json.bind(res);
  res.json = (body) => {
    cache[key] = { data: body, ts: Date.now() };
    send(body);
  };
  next();
};
