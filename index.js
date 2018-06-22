const request = require ("request")
const cheerio = require("cheerio")

const URLS = {
    a:"https://talk.macpowerusers.com/posts.rss",
    e:"https://talk.macpowerusers.com/c/episodes.rss",
    h:"https://talk.macpowerusers.com/c/hardware.rss",
    s:"https://talk.macpowerusers.com/c/software.rss",
    hs: "https://talk.macpowerusers.com/c/homescreens.rss",
    w: "https://talk.macpowerusers.com/c/cool-workflows.rss",
    A: "https://talk.macpowerusers.com/c/announcements.rss",
    u: "https://talk.macpowerusers.com/c/uncategorized.rss"}

const app = {
    init: function(feedWanted){

    }
}