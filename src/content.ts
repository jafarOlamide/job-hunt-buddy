import browser from "webextension-polyfill";
import type { BrowserRuntimeMessage, Platform } from "./lib/types";

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
    case "linkedin": {
      const linkedInDesc = document.querySelector("#job-details");
      description = linkedInDesc ? cleanHTML(linkedInDesc) : "";
      break;
    }

    case "greenhouse": {
      const ghContent = document.querySelector("div.job__description");
      description = ghContent ? cleanHTML(ghContent) : "";
      break;
    }

    case "lever": {
      const leverSection = document.querySelector('[data-qa="job-description"]');
      description = leverSection ? cleanHTML(leverSection) : "";
      break;
    }

    case "workday": {
      const workdayContent = document.querySelector('[data-automation-id="jobPostingDescription"]');
      description = workdayContent ? cleanHTML(workdayContent) : "";
      break;
    }

    case "workable": {
      const workableDesc = document.querySelector('[data-ui="job-description"]');
      description = workableDesc ? cleanHTML(workableDesc) : "";
      break;
    }

    case "ashby": {
      const ashbyDesc = document.querySelector('[class*="_descriptionText"]');
      description = ashbyDesc ? cleanHTML(ashbyDesc) : "";
      break;
    }

    case "generic":
      // For unknown sites, find the biggest text block
      description = findLargestTextBlock();
      break;
  }

  return description.trim();
}

function isJobPage(platform: Platform): boolean {
  if (platform !== "generic") return true;

  const url = window.location.href.toLowerCase();
  const pageText = document.body.innerText.toLowerCase();

  const urlJobKeywords = ["job", "career", "opening", "position", "apply", "hiring", "vacancy", "recruitment"];
  const contentJobKeywords = [
    "responsibilities", "qualifications", "requirements",
    "apply now", "job description", "about the role",
    "we are looking for", "we're looking for",
    "compensation", "salary", "years of experience"
  ];

  const urlMatch = urlJobKeywords.some((kw) => url.includes(kw));
  const contentMatchCount = contentJobKeywords.filter((kw) => pageText.includes(kw)).length;

  return urlMatch || contentMatchCount >= 2;
}

function cleanHTML(element: Element): string {
  const clone = element.cloneNode(true) as Element;

  const unwanted = [
    "script", "style", "button", "input", "textarea", "select", "form",
    "nav", "header", "footer", "iframe", "img", "svg", "video", "audio",
    "noscript", "link", "meta", "picture", "canvas"
  ];
  unwanted.forEach((tag) => clone.querySelectorAll(tag).forEach((el) => el.remove()));

  clone.querySelectorAll("*").forEach((el) => {
    const href = el.tagName === "A" ? el.getAttribute("href") : null;
    while (el.attributes.length > 0) {
      el.removeAttribute(el.attributes[0].name);
    }
    if (href) {
      el.setAttribute("href", href);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  return clone.innerHTML.replace(/(\s*\n\s*){3,}/g, "\n\n").trim();
}

function findLargestTextBlock(): string {
  const divs = Array.from(document.querySelectorAll("div"));

  let largestDiv = divs[0];
  let maxLength = 0;

  for (const div of divs) {
    if (div === document.body || div.contains(document.body)) continue;
    const textLength = div.textContent?.length || 0;
    if (textLength > maxLength) {
      maxLength = textLength;
      largestDiv = div;
    }
  }

  return largestDiv ? cleanHTML(largestDiv) : "";
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
        description,
        isJobPage: isJobPage(platform)
      }
    });

    return true;
  }
});
