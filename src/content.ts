import browser from "webextension-polyfill";
import type { BrowserRuntimeMessage, Platform } from "./lib/types";

/*
* Detect job platform
*/


function detectPlatform(): Platform {
  const url = window.location.href;

  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("greenhouse.io") || url.includes("boards.greenhouse.io")) return "greenhouse";
  if (url.includes("jobs.lever.co")) return "lever";
  if (url.includes("myworkdayjobs.com")) return "workday";
  if (url.includes("apply.workable.com")) return "workable";
  if (url.includes("jobs.ashbyhq.com")) return "ashby";

  return "generic";
}

function scrapeTitle(platform: Platform): string {
  let title = "";

  switch (platform) {
    case "linkedin":
      title = document.querySelector("h1")?.textContent || "";
      break;

    case "greenhouse":
      title = document.querySelector("h1.section-header")?.textContent || "";
      break;

    case "lever":
      title = document.querySelector(".posting-headline h2")?.textContent || "";
      break;

    case "workday":
      title = document.querySelector('[data-automation-id="jobPostingHeader"]')?.textContent || "";
      break;

    case "workable":
    case "ashby":
    case "generic":
      title = document.querySelector("h1")?.textContent || "";
      break;
  }

  return title.trim();
}


function scrapeDescription(platform: Platform): string {
  let description = "";

  switch (platform) {
    case "linkedin":
      // LinkedIn puts descriptions in a special div with id
      const linkedInDesc = document.querySelector("#job-details");
      description = linkedInDesc?.textContent || "";
      break;

    case "greenhouse":
      // Greenhouse uses class name job__description
      const ghContent = document.querySelector("div.job__description");
      description = ghContent?.textContent || "";
      break;

    case "lever":
      // Lever uses name job-description in data-qa attribute
      const leverSection = document.querySelector('[data-qa="job-description"]');
      description = leverSection?.textContent || "";
      break;

    case "workday":
      // Workday uses name jobPostingDescription in data-automation-id attribute
      const workdayContent = document.querySelector('[data-automation-id="jobPostingDescription"]');
      description = workdayContent?.textContent || "";
      break;

    case "workable":
      // Workable uses name job-description in data-ui attribute
      const workableDesc = document.querySelector('[data-ui="job-description"]');
      description = workableDesc?.textContent || "";
      break;

    case "ashby":
      // Ashby uses a dynamic class name starting with "_descriptionText_"
      const ashbyDesc = document.querySelector('[class*="_descriptionText"]');
      description = ashbyDesc?.textContent || "";
      break;

    case "generic":
      // For unknown sites, find the biggest text block
      description = findLargestTextBlock();
      break;
  }

  return description.trim();
}

function findLargestTextBlock(): string {
  const divs = Array.from(document.querySelectorAll("div"));

  let largestDiv = divs[0];
  let maxLength = 0;

  for (const div of divs) {
    const textLength = div.textContent?.length || 0;
    if (textLength > maxLength) {
      maxLength = textLength;
      largestDiv = div;
    }
  }

  return largestDiv?.textContent?.trim() || "";
}


browser.runtime.onMessage.addListener((message: BrowserRuntimeMessage, sender, sendResponse) => {
  if (message.type === "SCRAPE_REQUEST") {

    const platform = detectPlatform();

    // Grab the title and description
    const title = scrapeTitle(platform);
    const description = scrapeDescription(platform);
    const url = window.location.href;

    sendResponse({
      type: "SCRAPE_RESULT",
      payload: {
        url,
        title,
        description
      }
    });

    return true;
  }
});
