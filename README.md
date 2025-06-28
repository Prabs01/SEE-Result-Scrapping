# SEE Result Scraper

**Author:** Prabesh Bastola

---

## Overview

**SEE Result Scraper** is a simple, configurable web scraping project using **Puppeteer** to extract SEE exam results from the Nepal Telecom website.

The scraper collects GPA data based on provided symbol numbers and saves the results in both `JSON` and `CSV` formats.

---

## Features

- Scrapes GPA data for a range of symbol numbers.
- Automatically retries if GPA is not found on the first attempt.
- Saves data in:
  - `see_results.json` (JSON file)
  - `see_results.csv` (CSV file suitable for Excel or Pandas)
- Provides detailed logging with attempt tracking.
- User-configurable scraping range.

---

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/see-result-scraper.git
cd see-result-scraper
```

### Step 2: Install Dependencies

Run the following command in your project directory to install all necessary dependencies:

```bash
npm install
```

### Step 3: Run the Scrapper

Run this program to start the scrapper
```bash
npm start
```

**Note**:
You can configure the symbol number range inside the scrape.js file by editing:
```js
const startSymbol = 2916538;  // Start symbol
const endSymbol = 2916625;    // End symbol
```

## Output Files
- see_results.json — JSON file containing all scraped results.
- see_results.csv — CSV file suitable for spreadsheet or data analysis tools.

## Notes
- Please scrape responsibly. Scraping too fast may lead to IP blocking.
- You may add optional delays between requests to reduce server load.

## Requirements
- Node.js
- Puppeteer
- p-limit library
- json2csv library

Dependencies will be installed automatically using:
```bash
npm install
```

## Future Improvements
- Parallel scraping for faster execution.
- CLI argument support for dynamic symbol range input.
- Progress bar for better visual tracking.
- Resume support for interrupted scraping sessions.

## License
This project is licensed under the MIT License.

