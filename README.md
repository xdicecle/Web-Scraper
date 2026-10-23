# Learn TypeScript by building a book scraper

We will build a command-line tool that collects book titles, prices, availability,
and links from [Books to Scrape](https://books.toscrape.com/), a site made for
scraping practice. Its prices and ratings are fictional.

You already know some JavaScript, so each lesson adds a small TypeScript concept
to code you can run and change. This starter contains lesson 1; we will implement
the remaining lessons together.

## What a scraper does

```text
Page URL -> HTTP request -> HTML text -> extract fields -> Book[] -> JSON file
```

A browser downloads HTML and displays it. Our first scraper will download HTML
and read selected elements instead. CSS selectors identify the elements we want,
such as the title inside each book card. Pages that load their data using
JavaScript may need a different approach; we will explore that later.

## Project path

| Lesson | What you build | What you learn |
| --- | --- | --- |
| 1 (ready) | Filter handwritten book data | Object types, arrays, inference, typed functions |
| 2 | Download one page using fetch | async/await, promises, HTTP status codes |
| 3 | Extract books using Cheerio | HTML, CSS selectors, missing values, converting text to numbers |
| 4 | Save books as JSON | Imports, file I/O, handling errors |
| 5 | Follow next-page links with a page limit and delay | Loops, relative URLs, polite request pacing |
| 6 | Handle unexpected HTML and failures | Runtime validation, small parser tests |

## Run lesson 1

Use a terminal in this folder. Node.js 24 or newer is required.
On this Windows machine, use `npm.cmd` to avoid the PowerShell script policy issue.

```powershell
npm.cmd install
npm.cmd run lesson:1
npm.cmd run check
```

The first command installs development tools. The lesson prints Practice Book A,
which costs 12.50, because the budget is 20. A successful type check exits with no
errors.

Node runs this lesson by removing its type annotations. It does **not** check
those types when running it. `npm.cmd run check` asks TypeScript to check them.
Run both commands after an edit.

## Lesson 1: give your data a shape

Open [src/01-books.ts](src/01-books.ts).

```ts
type Book = {
  title: string;
  price: number;
  inStock: boolean;
};
```

This describes an object with three required properties. `Book[]` means an array
of those objects. In `isAffordable(book: Book, budget: number): boolean`, the
annotations describe the two inputs and the return value. The function body is
ordinary JavaScript.

Types help catch mistakes before you run code. They do not inspect incoming web
data: later we must check that a scraped price actually exists and is a valid
number.

### Your first exercise

1. Predict the output, then run the lesson.
2. Add a third book costing 15 with `inStock: false`. Run it again. Why does it appear?
3. Change the filter so a book must be affordable **and** in stock.
4. Temporarily replace a numeric price with `"15"`. Run the type check and read
   the error. Fix the price and check again.

You are done when the type check passes and an inexpensive, out-of-stock book
does not appear in the results. Share your changed filter and we will review it
before moving on to fetching a real page.

## When we start making requests

Begin with one page on the practice site. For other sites, check their scraping
rules and robots.txt, use modest request rates, and stop on access-denied or
rate-limit responses. A public API may be a better source when one is available.

## References

- [TypeScript: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Node.js: Running TypeScript](https://nodejs.org/api/typescript.html)
- [Books to Scrape practice site](https://books.toscrape.com/)
