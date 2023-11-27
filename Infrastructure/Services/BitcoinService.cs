using Domain.Constants;
using Domain.Services;
using Domain.Services.Responses;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class BitcoinService : IBitcoinService
    {
        private readonly HttpClient _httpClient;
        public BitcoinService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /*
        public async Task<double> GetBitcoinPricing()
        {
            var response = await _httpClient.GetAsync("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
            string jsonResult = await response.Content.ReadAsStringAsync();
            var priceData = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(jsonResult);

            return priceData.bitcoin.usd;
        }
        */

        public async Task<double> GetBitcoinPricing()
        {
            var body = new { query = LuxorTechConstants.GetTransactionHistory };
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Add(LuxorTechConstants.HeaderKey, LuxorTechConstants.ApiKey);
            var response = await _httpClient.PostAsync(LuxorTechConstants.Url, content);

            var responseContent = await response.Content.ReadAsStringAsync();
            var transactionHistoryResponse = JsonConvert.DeserializeObject<GetTransactionHistoryResponse>(responseContent);

            return double.Parse(transactionHistoryResponse.TransactionHistoryData.GetTransactionHistory.TransactionHistoryNodes[0].CoinPrice);
        }
    }
}
