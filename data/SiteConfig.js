const config = {
  siteTitle: "parav01d",
  siteTitleShort: "parav01d",
  siteTitleAlt: "parav01d",
  siteLogo: "/logos/logo-1024.png",
  siteUrl: "https://www.parav01d.de",
  pathPrefix: "",
  siteDescription: "parav01d re-qui-en blog",
  siteRss: "/rss.xml",
  siteFBAppID: "",
  googleAnalyticsID: "",
  dateFromFormat: "YYYY-MM-DD",
  dateFormat: "DD/MM/YYYY",
  userName: "Tom Kunzemann",
  userEmail: "tkunzema@gmail.com",
  userTwitter: "",
  userGitHub: "parav01d",
  userLocation: "World Wide Web, Earth",
  userAvatar: "/logos/logo-1024.png",
  userDescription: "Senior Of The Senior Developers Most Important Person Of Master Developers To The Max",
  copyright: "Copyright © 2020. All rights reserved.",
  themeColor: "#c62828",
  backgroundColor: "red"
};

// Validate

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === "/") {
  config.pathPrefix = "";
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, "")}`;
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === "/")
  config.siteUrl = config.siteUrl.slice(0, -1);

// Make sure siteRss has a starting forward slash
// if (config.siteRss && config.siteRss[0] !== "/")
//   config.siteRss = `/${config.siteRss}`;

module.exports = config;
