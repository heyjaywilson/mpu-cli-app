#!/usr/bin/env node

const request = require("request");
const cheerio = require("cheerio");
const optimist = require("optimist");

const feedWanted = optimist.argv["feed"];

const URLS = {
  a: "https://talk.macpowerusers.com/posts.rss",
  e: "https://talk.macpowerusers.com/c/episodes.rss",
  h: "https://talk.macpowerusers.com/c/hardware.rss",
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
        console.log("res works");
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
        posts.forEach(post => {
          console.log("\x1b[30m", "\x1b[43m", post.title);
          console.log("\x1b[0m", "\x1b[34m", post.creator + " AT " + post.date);
          console.log("\x1b[0m", post.description);
        });
      }
    });
  }
};

app.init(feedWanted);

module.exports = app;
