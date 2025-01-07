import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url:string) {
   if(!url) return;

   // curl -i --proxy brd.superproxy.io:33335 --proxy-user brd-customer-hl_5c6de576-zone-pricify:56xkfzout3ij -k "https://geo.brdtest.com/welcome.txt?product=unlocker&method=native"

   //BrightData proxy configuration
   const username = String(process.env.BRIGHT_DATA_USERNAME);
   const password = String(process.env.BRIGHT_DATA_PASSWORD);
   const port = 33335;
   const session_id = (1000000 * Math.random()) | 0;

   const options = {
      auth: {
         username: `${username}-session-${session_id}`,
         password,
      },
      host: 'brd.superproxy.io',
      port,
      rejectUnauthorized: false,
   }

   try {
      //fetch product page
      const res = await axios.get(url, options);
      const $ = cheerio.load(res.data);

      //Extract Product title
      const title = $('#productTitle').text().trim();
      const currentPrice = extractPrice(
         $('.priceToPay span.a-price-whole'),
         $('a.size.base.a-color-price'),
         $('.a-button-selected .a-color-base')
      );

      const originalPrice = extractPrice(
         $('#priceblock_ourprice'),
         $('.a-price.a-text-price span.a-offscreen'),
         $('#listPrice'),
         $('#priceblock_dealPrice'),
         $('.a-size-base.a-color-price')
      );

      const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

      const images = 
      $('#landingImage').attr('data-a-dynamic-image') ||
      $('#imgBlkFront').attr('data-a-dynamic-image') ||
      '{}';

      const imageUrls = Object.keys(JSON.parse(images)) //since images returns multiple urls, we get just the keys returned(image urls)

      const currency =  extractCurrency($('.a-price-symbol'));
      const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');
      const reviewsCount = parseInt($('#acrCustomerReviewText').text().trim().split(' ')[0].replace(/,/g, ''), 10) || 100;
      const stars = $('.cm-cr-review-stars-spacing-big').text().replace(/^.*?(\b\d\.\d out of 5 stars\b).*$/, '$1');
      
      const description = extractDescription($);

      //construct data object with scraped information
      const data = {
         url,
         currency: currency || '$',
         image: imageUrls[0],
         title,
         currentPrice: Number(currentPrice) || Number(originalPrice),
         originalPrice: Number(originalPrice) || Number(currentPrice),
         priceHistory: [],
         discountRate: Number(discountRate),
         category: 'category',
         reviewsCount: reviewsCount,
         stars: (stars && Number(stars.split(' ')[0])) || 5,
         isOutOfStock: outOfStock,
         description,
         lowestPrice: Number(currentPrice) || Number(originalPrice),
         highestPrice: Number(originalPrice) || Number(currentPrice),
         averagePrice: Number(currentPrice) || Number(originalPrice),

      }
      return data;
   } catch(error) {
      throw new Error(`failed to scrape product: ${error}`)
   }
}