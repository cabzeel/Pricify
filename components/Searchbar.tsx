"use client"
import { scrapeAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, useState } from 'react'

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostName = parsedURL.hostname;

    //scraping for amazon: checking if hostname contains amazon.com

    if(hostName.includes('amazon.com') ||
      hostName.includes('amazon.') ||
      hostName.endsWith('amazon')
    ) {
      return true
    }
  } catch (error) {
    return false;
  }

  return false;
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setisLoading] = useState(false) //naming convention for anything boolean is 'isWhateverVariableName'
   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const isValidLink = isValidAmazonProductURL(searchPrompt);
     //inputed link has to be a complete url with the protocol included otherwise everything returns false
    


     if(!isValidLink) {alert('Please provide a valid amazon link or prefix your amazon link with https://')}

     try {
      setisLoading(true);

      //scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt)
     } catch (error) {
      console.log(error)
     } finally {
      setisLoading(false);
     }
   }
  return (
    <form
     className='flex flex-wrap gap-4 mt-12' 
     onSubmit={handleSubmit}
    >
      <input 
        type='text' 
        placeholder='Enter Product Link' 
        className='searchbar-input' 
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />

      <button 
        type='submit' 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
         { isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar