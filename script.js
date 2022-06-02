//Pulling in all the data from JSON object

let page_title = document.body.textContent;
let pageParse = JSON.parse(page_title)
let timezone = pageParse.site.timezone
let siteHeadCode = pageParse.siteMeta[0]?.head
let siteFooterCode = pageParse.siteMeta[0]?.postBody
let recaptchaStatus = pageParse.site.recaptchaRequired
let redirectsData = pageParse.siteMeta[0]?.redirects
let redirectsString = []
let baseTag = pageParse.siteMeta[0]?.base
let hrefTag = pageParse.siteMeta[0]?.siteBasePath
let stylesData = pageParse.styles.styles
let legacy = false
let canonical = pageParse.siteMeta[0]?.globalCanonicalTag
let robots = pageParse.siteMeta[0]?.robots
let sitemap = pageParse.siteMeta[0]?.defaultSitemap
let optimize = pageParse.siteMeta[0]?.googleOptimizeId
let allPages = pageParse.pages



// Legacy Interactions Finder 
for (let i = 0; i < stylesData.length; i++){
    if (stylesData[i].data.sel.includes("html.w-mod-js")){  
        legacy = true
    } else {
        legacy = false
    }
  }



// Look for template page - NEED TO FIX FOLDER ISSUE

// try{
// for (let i = 0; i < allPages.length; i++){
//     if (allPages[i].page.type !== "page"){  
//         console.log("FOLDER")  } 
//     else if (allPages[i].page.seoTitle === ""){
//         console.log("BLANK")
//     }
//     else if (allPages[i].page.type === "folder"){
//         console.log("FOLDER")
//     } else if (allPages[i].page.type === "page" && allPages[i].page.seoTitle.includes('template')){
//         console.log("Template")
//     } else {
//         console.log("SEO Title OK")
//     }
// }} catch(e){
//     console.log("YO",e)
//  }


// List all 301 redirects
try{
if (redirectsData === null){
    redirectsString = "No redirects"
} else {
        for (let i = 0; i < redirectsData.length; i++){
            redirectsString.push(redirectsData[i].src + " > " + redirectsData[i].target + "\n")
        }
       }
    }catch(e){
        console.log("Error",e)
     }

// Prepare JSON data 
let data = JSON.stringify({time: timezone, headCode: siteHeadCode, footerCode: siteFooterCode, redirects: redirectsString, base: baseTag, href: hrefTag, legacy: legacy, recaptcha: recaptchaStatus, canonical: canonical, robots: robots, sitemap: sitemap, optimize: optimize, });

// Send message back to popup script
chrome.runtime.sendMessage(null, data);


