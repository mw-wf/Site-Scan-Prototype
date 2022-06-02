'use strict';

// start navigation when #startNavigation button is clicked
startNavigation.onclick = function (element) {
  // query the current tab to find its id
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      let urlCurrent = tabs[0].url;
      let apiURL = '';
      let rawUrl = urlCurrent.split('?')[0];
      let dataURL = urlCurrent.split('&')[0];
      let siteSettings = urlCurrent;
      let pageId = '';

      if (urlCurrent.includes('https://webflow.com/design/')) {
        apiURL = rawUrl.replace(
          'https://webflow.com/design/',
          'https://webflow.com/api/data?s='
        );
      } else if (urlCurrent.includes('https://preview.webflow.com/')) {
        apiURL = rawUrl.replace(
          'https://preview.webflow.com/preview/',
          'https://webflow.com/api/data?s='
        );
      } else if (urlCurrent.includes('https://webflow.com/dashboard/')) {
        apiURL = siteSettings.replace(
          'https://webflow.com/dashboard/sites/',
          ''
        );
        pageId = apiURL.split(/\/(.+)/)[0];
        apiURL = `https://webflow.com/api/data?s=${pageId}`;
      } else if (urlCurrent.includes('https://webflow.com/api/')) {
        apiURL = dataURL;
      } else {
        console.log('not found');
      }

      const jsonURL =
        apiURL +
        '&reason=Testing a new feature on an existing site to enhance customer experience';

      // list of urls to navigate
      let urls_list = [jsonURL];

      for (let i = 0; i < urls_list.length; i++) {
        // navigate to next url
        await goToPage(urls_list[i], i + 1, tabs[0].id);
        // wait for 5 seconds
        await waitSeconds(5);
      }
    }
  );
  // navigation of all pages is finished
  // alert('Navigation Completed');
};

async function goToPage(url, url_index, tab_id) {
  return new Promise(function (resolve, reject) {
    // update current tab with new url
    chrome.tabs.update({ url: url });

    // fired when tab is updated
    chrome.tabs.onUpdated.addListener(function openPage(tabID, changeInfo) {
      // tab has finished loading, validate whether it is the same tab
      if (tab_id == tabID && changeInfo.status === 'complete') {
        // remove tab onUpdate event as it may get duplicated
        chrome.tabs.onUpdated.removeListener(openPage);

        // fired when content script sends a message
        chrome.runtime.onMessage.addListener(function getDOMInfo(message) {
          // remove onMessage event as it may get duplicated
          chrome.runtime.onMessage.removeListener(getDOMInfo);

          // save data from message to a JSON file and download
          let json_data = {
            time: JSON.parse(message).time,
            headCode: JSON.parse(message).headCode,
            footerCode: JSON.parse(message).footerCode,
            redirects: JSON.parse(message).redirects,
            base: JSON.parse(message).base,
            href: JSON.parse(message).href,
            legacy: JSON.parse(message).legacy,
            recaptcha: JSON.parse(message).recaptcha,
            canonical: JSON.parse(message).canonical,
            robots: JSON.parse(message).robots,
            sitemap: JSON.parse(message).sitemap,
            optimize: JSON.parse(message).optimize,
          };

          // Setting sections from popup.html as variables

          const headCodeSection = document.getElementById('head-code');
          const footerCodeSection = document.getElementById('footer-code');
          const timezoneSection = document.getElementById('timezone-data');
          const redirectsSection = document.getElementById('redirects');
          const baseSection = document.getElementById('base');
          const hrefSection = document.getElementById('href');
          const legacySection = document.getElementById('legacy');
          const recaptchaSection = document.getElementById('recaptcha');
          const canonicalSection = document.getElementById('canonical');
          const robotsSection = document.getElementById('robots');
          const googleOptimizeSection = document.getElementById('optimize');

          // Listing sections as an array to be matched with outputs

          const sections = [
            headCodeSection,
            footerCodeSection,
            redirectsSection,
            baseSection,
            hrefSection,
            legacySection,
            recaptchaSection,
            canonicalSection,
            timezoneSection,
            robotsSection,
            googleOptimizeSection,
          ];

          // Listing outputs to be matched up with sections

          const outputs = [
            json_data.headCode,
            json_data.footerCode,
            json_data.redirects,
            json_data.base,
            json_data.href,
            json_data.legacy,
            json_data.recaptcha,
            json_data.canonical,
            json_data.time,
            json_data.robots,
            json_data.optimize,
          ];

          // Bubble conditionals

          if (json_data.recaptcha === true) {
            $('#recaptcha-bubble').addClass('yellow');
          } else if (json_data.recaptcha === false) {
            $('#recaptcha-bubble').addClass('green');
          }

          if (json_data.legacy === true) {
            $('#legacy-bubble').addClass('yellow');
          } else if (json_data.legacy === false) {
            $('#legacy-bubble').addClass('green');
          }

          if (json_data.headCode === undefined) {
            $('#headcode-bubble').addClass('green');
          } else if (
            json_data.headCode.includes('<style>') &&
            !json_data.headCode.includes('</style>')
          ) {
            $('#headcode-bubble').addClass('red');
          } else if (
            json_data.headCode.includes('<script') &&
            !json_data.headCode.includes('</script>')
          ) {
            $('#headcode-bubble').addClass('red');
          } else {
            $('#headcode-bubble').addClass('yellow');
          }

          if (json_data.footerCode === undefined) {
            $('#footer-bubble').addClass('green');
          } else if (
            json_data.footerCode.includes('<style>') &&
            !json_data.footerCode.includes('</style>')
          ) {
            $('#footer-bubble').addClass('red');
          } else if (
            json_data.footerCode.includes('<script') &&
            !json_data.footerCode.includes('</script>')
          ) {
            $('#footer-bubble').addClass('red');
          } else {
            $('#footer-bubble').addClass('yellow');
          }
          if (json_data.base === undefined) {
            $('#base-bubble').addClass('green');
          } else {
            $('#base-bubble').addClass('yellow');
          }

          if (json_data.href === undefined) {
            $('#href-bubble').addClass('green');
          } else {
            $('#href-bubble').addClass('yellow');
          }

          if (json_data.redirects === 'No redirects') {
            $('#redirect-bubble').addClass('green');
          } else {
            $('#redirect-bubble').addClass('yellow');
          }

          if (json_data.canonical === undefined) {
            $('#canonical-bubble').addClass('green');
          } else if (json_data.canonical.charAt(json_data.canonical.length - 1 ) === '/') {
            $('#canonical-bubble').addClass('red');
          } else {
            $('#canonical-bubble').addClass('yellow');
          }

          if (json_data.robots === undefined) {
            $('#robots-bubble').addClass('green');
          } else if (
            json_data.robots.includes('Sitemap') &&
            json_data.sitemap === true
          ) {
            $('#robots-bubble').addClass('red');
          } else {
            $('#robots-bubble').addClass('green');
          }

          if (json_data.optimize === undefined) {
            $('#optimize-bubble').addClass('green');
          } else {
            $('#optimize-bubble').addClass('yellow');
          }

          // Dropdown Toggle

          $('.dropdown-content').on('click', function (e) {
            $('p', this).slideToggle('fast');
            e.preventDefault();
          });
          $('.dropdown-content').on('click', function (e) {
            $('pre', this).slideToggle('fast');
            e.preventDefault();
          });

          // Create output textnode

          for (let i = 0; i < outputs.length; i++) {
            let outputText = document.createTextNode(outputs[i]);
            sections[i].appendChild(outputText);
          }
        });

        // Execute content script
        chrome.tabs.executeScript({ file: 'script.js' }, function () {
          // Resolve Promise after content script has executed
          Prism.highlightAll()
          resolve();
        });
      }
    });
  });
}

// async function to wait for x seconds
async function waitSeconds(seconds) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, seconds * 1000);
  });
}
