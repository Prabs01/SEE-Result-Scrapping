const puppeteer = require('puppeteer');
const fs = require('fs');
const { Parser } = require('json2csv');
const pLimit = require('p-limit');

let allResults = []; // Store results here

async function scrapeSeeResult(symbolNumber) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        let gpa = 'GPA not found';
        let attempt = 0;

        while (gpa === 'GPA not found') {
            attempt++;
            console.log(`Attempt ${attempt} for Symbol Number: ${symbolNumber}`);

            try {
                await page.goto('https://see.ntc.net.np/', { waitUntil: 'domcontentloaded' });

                await page.waitForSelector('input[name="symbol"]');
                await page.type('input[name="symbol"]', '0' + symbolNumber);

                await page.click('input[type="submit"].submitbtn');

                await page.waitForFunction(() => {
                    const rows = document.querySelectorAll('table tr');
                    for (let row of rows) {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 2 && cells[0].innerText.trim().toLowerCase() === 'gpa') {
                            return true;
                        }
                    }
                    return false;
                }, { timeout: 10000 });

                gpa = await page.evaluate(() => {
                    const rows = document.querySelectorAll('table tr');
                    for (let row of rows) {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 2 && cells[0].innerText.trim().toLowerCase() === 'gpa') {
                            return cells[1].innerText.replace(':', '').trim();
                        }
                    }
                    return 'GPA not found';
                });

                if (gpa !== 'GPA not found') {
                    console.log(`✅ Symbol Number: ${symbolNumber} | GPA: ${gpa}`);

                    allResults.push({ symbolNumber: '0' + symbolNumber, gpa: gpa });

                    // Save to JSON
                    fs.writeFileSync('see_results.json', JSON.stringify(allResults, null, 2));

                    // Save to CSV
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(allResults);
                    fs.writeFileSync('see_results.csv', csv);

                    break;
                } else {
                    console.log(`❌ GPA not found, retrying...`);
                    await new Promise(res => setTimeout(res, 2000));
                }
            } catch (err) {
                console.log(`⚠️ Attempt ${attempt} failed for Symbol Number: ${symbolNumber} | Retrying...`);
                await new Promise(res => setTimeout(res, 2000));
            }
        }
    } catch (err) {
        console.error(`❌ Symbol Number: ${symbolNumber} | Fatal Error: ${err.message}`);
    } finally {
        await browser.close();
    }
}

async function main() {
    const startSymbol = 2916538;
    const endSymbol = 2916625;

    for (let symbol = startSymbol; symbol <= endSymbol; symbol++) {
        await scrapeSeeResult(symbol);

        // Optional: Add delay to prevent overloading server
        // await new Promise(res => setTimeout(res, 3000));
    }

    console.log('✅ Scraping Completed. Results saved to see_results.json and see_results.csv.');
}

main();
