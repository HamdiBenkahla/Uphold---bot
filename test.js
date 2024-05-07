let chai;
const { retrieveCurrencyPairRate } = require('./bot'); // 
import('chai').then(chaiModule => {
  chai = chaiModule;
  const { expect } = chai;

  
  describe('retrieveCurrencyPairRate', () => {
    it('should retrieve the exchange rate for a valid currency pair', async () => {
      const currencyPair = 'BTC-USD';
      const rate = await retrieveCurrencyPairRate(currencyPair);
      expect(rate).to.be.an('object').that.includes.all.keys('ask', 'bid', 'currency');
    });
  
  });

});






