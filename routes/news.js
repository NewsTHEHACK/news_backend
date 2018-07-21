const request = require('request');

var express = require('express');
var router = express.Router();

const {insertDB, searchDB} = require("../utils/MongoDB");
const bodyParser = require('body-parser');

let jsonParser = bodyParser.json();

let urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/news_map', jsonParser,(req, res, next) => {
    let title = req.body.title;
    let content = req.body.content;
    let url = req.body.url;
    let tags = req.body.tags;

    let dataObject = {title:title,
        content: content,
        tags: tags,
        url: url};
    processData(dataObject);
});

router.get('/news_map', (req, res, next) => {
    console.log(req.query);// x, y, r, scale
    let ans = [];
    let {x, y, r, scale} = req.query;
    r = 100;
    scale = 10;
    searchDB({}, (res) => {
        res.forEach((it) => {
            ans.push(it);
        });
        console.log(ans.length)
    });
    setTimeout(() => {res.json(ans)}, 2000);
});

router.get('/one_news', (req, res, next) => {
    let ans = [];
   searchDB({url: req.query.id}, (r) => {
       r.forEach((it) => {
           ans.push(it);
       });
   });
   setTimeout(() => {res.json(ans)}, 1500);

});

let processData = (dataObject) => {
    request.get(
        "http://api.map.baidu.com/geocoder/v2/?address=" + dataObject.city + "&output=json&ak=hoDiRIzg2SRe96gQnSZH50yoNTj0cTgS&callback=showLocation",
        {json: {key: 'value'}},
        (err, response, body) => {
            if (!err && response.statusCode === 200) {
                if (body.status === 0) {
                    dataObject.x = body.lng;
                    dataObject.y = body.lat;
                }
            }
        }
    ).then(() => {
        insertDB(dataObject);
    })
};

let calculate = (x, y, px, py) => {
    let radLat1 = (y * Math.PI) / 180;
    let radLat2 = (py * Math.PI) / 180;

    let diffA = radLat1 - radLat2;
    let diffB = (x - px) * Math.PI / 180;

    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(diffA/2), 2))) +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.pow(Math.sin(diffB/2), 2);
    s = s * 6378137;

    s = Math.round(s * 10000) / 10000;

    return s;
};

module.exports = router;
