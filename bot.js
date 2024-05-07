const dialog = require('dialog');
const axios = require('axios');

async function retrieveCurrencyPairRate(currencyPair) {
 try {
   let {data} = await axios.get(`https://api.uphold.com/v0/ticker/${currencyPair}`); //api call using axios to retrive currency pair price
  return data;
 } catch (e) {
  console.log(`Cannot retrieve the exchange rate of the currency ${e}`);
  return;
 }
}

// Function to Calculate pourcentage difference
const calculateOscillation = (startPrice, currentPrice, pair,oscillation) => {
    // Calculate percentage using Math.abs in case of negative
    const percentageChange = Math.abs((currentPrice - startPrice) / startPrice) * 100;
    console.log(percentageChange,currentPrice,startPrice)
    // Check if percentage change exceeds 0.01% to trigger alert logic
    if (percentageChange >= oscillation) {
      console.log(`${pair} price reached ${oscillation}% oscillation or more!`);
      //dialog.info(" price oscillation percentage reached !")
    }
  };

  //function that retrieve prices of an array of currencies
  const fetchInitialPrices = async (pairs = ["BTC-USD","ETH-EUR"]) => {

    const initialPrices = {};
    // Fetch initial data for all currency pairs concurrently
    const initialDataPromises = pairs.map(async (currencyPair) => {
        const data = await retrieveCurrencyPairRate(currencyPair);
        if (data && !isNaN(+data.ask)) {
          initialPrices[currencyPair] = +data.ask; //storing pairs with initial values
        } else {
          // error fetching initial data
          console.error(`Error fetching initial data for ${currencyPair}`);
        }
      });
    
      // Wait for all initial data fetching to complete
      await Promise.all(initialDataPromises);
      console.log(initialPrices,"houni")
      return initialPrices
  }

 // fetchInitialPrices()

// Function to run the bot for specified currency pairs
const launchBot = async (currencyPairs = ["BTC-USD","ETH-EUR"],oscillation = 0.01,fetchInterval = 5000) => {
    // Initialize initial prices for each currency pair
    let startingPrices = await fetchInitialPrices(currencyPairs)
  
     
    // Set up timer to fetch data for each currency pair every 5 seconds
    setInterval(async () => {
      // Fetch current data for all currency pairs concurrently
      const currentDataPromises = currencyPairs.map(async (pair) => {
        const data = await retrieveCurrencyPairRate(pair);
        if (data) {
          const askPrice = +data.ask; //converting the string to an integer
          calculateOscillation(startingPrices[pair], askPrice, pair,oscillation);
        } else {
          // Handle error fetching current data
          console.error(`Error fetching current data for ${pair}`);
        }
      });
  
      // Wait for all current data fetching to complete
      await Promise.all(currentDataPromises);
    }, fetchInterval);
  };

  launchBot()
