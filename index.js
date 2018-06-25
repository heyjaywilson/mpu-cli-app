#!/usr/bin/env node

const inquirer = require("inquirer");
const request = require("request");
const cheerio = require("cheerio");
const optimist = require("optimist");

// const feedWanted = optimist.argv["feed"];

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

const feed_question = {
  type: "input",
  name: "feed",
  message: "What feed do you want?"
};
const getNextPrev = {
  type: "input",
  name: "post",
  message: "Next, previous, or quit? (N/P/Q)"
};
const app = {
  init: function() {
    inquirer.prompt(feed_question).then(answers => {
      this.getFeed(answers.feed);
    });
  },
  printPost(i) {
    console.log(
      "\x1b[30m",
      "\x1b[43m",
      posts[i].title,
      "\x1b[0m",
      posts[i].link
    );
    console.log(
      "\x1b[0m",
      "\x1b[34m",
      posts[i].creator + " AT " + posts[i].date
    );
    console.log("\x1b[0m", posts[i].description);
    console.log("\x1b[0m");
    this.getPost(i);
  },
  getPost: async function(i) {
    await inquirer.prompt(getNextPrev).then(answers => {
      if (answers.post === "N" || answers.post === "n") {
        i = i + 1;
        this.printPost(i);
      } else if (answers.post === "P" || answers.post === "p") {
        if (i !== 0) {
          i = i - 1;
          this.printPost(i);
        } else {
          i = i;
          this.printPost(i);
        }
      } else {
        i = i + posts.length;
        console.log("Enter 'mpu' to look for another feed");
      }
    });
  },
  getFeed(feedLetter) {
    request(URLS[feedLetter], (error, response, xml) => {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(xml, {
          xml: { normalizWhitespace: true }
        });
        $("item").each(function(i, element) {
          let html = $(this)
            .find("description")
            .contents()
            .text();
          let descript = $(html).text();
          // $(html)
          //   .remove("a")
          //  .text();
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
        let i = 0;
        this.printPost(i);
      }
    });
  }
};

app.init();

module.exports = app;
