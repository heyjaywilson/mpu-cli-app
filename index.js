#!/usr/bin/env node

const request = require("request");
const cheerio = require("cheerio");
const optimist = require("optimist");

const feedWanted = optimist.argv["feed"];

const URLS = {
  a: "https://talk.macpowerusers.com/posts.rss",
  e: "https://talk.macpowerusers.com/c/episodes.rss",
  hw: "https://talk.macpowerusers.com/c/hardware.rss",
  s: "https://talk.macpowerusers.com/c/software.rss",
  hs: "https://talk.macpowerusers.com/c/homescreens.rss",
  w: "https://talk.macpowerusers.com/c/cool-workflows.rss",
  A: "https://talk.macpowerusers.com/c/announcements.rss",
  u: "https://talk.macpowerusers.com/c/uncategorized.rss"
};

const posts = [];

const app = {
  init: function(feedWanted) {
    request(URLS[feedWanted], function(error, response, xml) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(xml, {
          xml: { normalizWhitespace: true }
        });
        $("item").each(function(i, element) {
          let html = $(this)
            .find("description")
            .contents()
            .text();
          let descript = $(html)
            .remove("a")
            .text();
          posts.push({
            title: $(this)
              .find("title")
              .text(),
            date: $(this)
              .find("pubDate")
              .text(),
            creator: $(this)
              .find("dc\\:creator")
              .text(),
            description: descript,
            link: $(this)
              .find("link")
              .text()
          });
        });
        let i = posts.length-1
        while (i>=0){
          console.log("\x1b[0m", posts[i].description);
          console.log("\x1b[0m", "\x1b[34m", posts[i].creator + " AT " + posts[i].date);
          console.log("\x1b[30m", "\x1b[43m", posts[i].title, "\x1b[0m", posts[i].link);
          console.log("\x1b[0m")
          i--;
        }
      }
    });
  }
};

app.init(feedWanted);

module.exports = app;
