import * as cheerio from "cheerio";
import { writeFile } from "node:fs/promises"
import { setTimeout as delay } from "node:timers/promises";

type Book = {
    title: string,
    price: number,
    availability: string
}

const url = "https://books.toscrape.com/";

async function downloadPage(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed ${response.status}`);
  }

  const html = await response.text();
  return html;
}

try {
  const MAX_PAGES = 3;
  let currentUrl: string | undefined = url
  const books: Book[] = [];

  for(let page = 1; page <= MAX_PAGES && currentUrl; page++){
    console.log(`Downloading page ${page}: ${currentUrl}`);
    
    const html = await downloadPage(currentUrl);
    const $ = cheerio.load(html)
  

  const cards = $(".product_pod");

  if (cards.length === 0) {
    throw new Error("No book cards found. Check the selector and downloaded HTML.");
  }

  cards.each((_index, element) => {
     const card = $(element)

     const title = card.find("h3 a").attr("title");
     const priceText = card.find(".price_color").text();
     const availability = card.find(".availability").text().trim();

     if (!title || !priceText) {
       throw new Error("The book title title or price is missing");
     }

     const price = Number(priceText.replace("£", ""));

     if (!Number.isFinite(price)) {
       throw new Error(`The price is invalid ${priceText}`);
     }

     books.push({title, price, availability})
  });

  const nextHref = $(".next a").attr("href");

  currentUrl = nextHref ? new URL(nextHref,currentUrl).href : undefined;

  if(currentUrl && page < MAX_PAGES){
    await delay(1000)
  }
}


  const outputFile = new URL("../books.json", import.meta.url);

  const affordableBooks = books.filter((book) => book.price < 20)

  await writeFile(
    outputFile,
    JSON.stringify(affordableBooks, null, 2),
    "utf-8",
  )

  console.table(affordableBooks);
  console.log(`Saved ${affordableBooks.length} books to books.json`);
} catch (error) {
  console.log("Could not save books: ", error);
}
