const http = require('http');
const { stringify } = require('querystring');
const helper = require('./app/core/helpers.js');

const hostname = '127.0.0.1';
const port = 3000;
const urlScrape = 'https://wltest.dns-systems.net/';

const getScript = (url) => {
    return new Promise((resolve, reject) => {
        const http = require('http'),
              https = require('https');

        let client = http;

        if (url.toString().indexOf("https") === 0) {
            client = https;
        }

        client.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
};

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    (async (url) => {
        // get all page data from urlScrape
        await getScript(url).then(urlPageContent => {
            // separate pricing table HTML
            const subscriptionsRX = /(?<=<div class="pricing-table">)([\s\S]*?)(?=<!-- \/END ALL PACKAGE)/g; // splitting out monthly and annually subscriptions
            const subscriptionPackages = urlPageContent.match(subscriptionsRX);
            if(subscriptionPackages) {
                // monthly and annually subscription sections
                const monthlySubscriptions = subscriptionPackages[0];
                const annualSubscriptions = subscriptionPackages[1];
    
                // separate package items
                const packageItemRX = /(?<=<div class="package)([\s\S]*?)(?=<!-- \/END PACKAGE -->)/g; // individual package item
                const monthlyPackages = monthlySubscriptions.match(packageItemRX);
                const yearlyPackages = annualSubscriptions.match(packageItemRX);
    
                // create json object
                const jsonObject = {
                    monthly: [],
                    annual: []
                };
                setJsonObject(monthlyPackages, jsonObject.monthly);
                setJsonObject(yearlyPackages, jsonObject.annual);

                jsonObject.monthly = helper.sortDescending(jsonObject.monthly, 'price');
                jsonObject.annual = helper.sortDescending(jsonObject.annual, 'price');
       
                // post to page
                const json = JSON.stringify(jsonObject);
                res.end(json);
            } else {
                res.end("Error - HTML class has been altered");
            }
        })
    })(urlScrape);
});
  
// console output
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function setJsonObject(packageItems, jsonObject) {
    packageItems.forEach(package => {
        const object = {};
 
        object.title = helper.returnRegXResult('<h3>', '</h3>', package);
        object.description = helper.returnRegXResult('<div class="package-description">', '</div>', package);
        // remove HTML tags
        if(object.title) object.title = helper.removeHTMLtags(object.title);
        if(object.description) object.description = helper.removeHTMLtags(object.description);
        
        // separate only the price section HTML to be matched
        const priceSection = helper.returnRegXResult('<div class="package-price">', '</div>', package);
        object.price = helper.returnNumericValue(helper.returnRegXResult('<span class="price-big">', '</span>', priceSection));
        object.discount = helper.returnNumericValue(helper.returnRegXResult('<p', '</p>', priceSection));

        jsonObject.push(object);
    });
};

