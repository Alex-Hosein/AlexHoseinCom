using Domain.Constants;
using Domain.Dto;
using Domain.Services;
using Domain.Services.Responses;
using Newtonsoft.Json;
using System.Text;

namespace Infrastructure.Services
{
    public class LuxorTechService : ILuxorTechService
    {
        private readonly HttpClient _httpClient;
        public LuxorTechService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add(LuxorTechConstants.HeaderKey, LuxorTechConstants.ApiKey);
        }

        public async Task<List<MiningRevenue>> GetTotalMiningRevenue()
        {
            var miningRevenues = new List<MiningRevenue>();
            var hashRateScoreHistoryString = await GetHashRateScoreHistory();
            var hashRateScoreHistoryObject = JsonConvert.DeserializeObject<HashrateScoreHistoryResponse>(hashRateScoreHistoryString);
            if(hashRateScoreHistoryObject == null ) 
            {
                return miningRevenues;
            }

            foreach (var node in hashRateScoreHistoryObject.Data.GetHashrateScoreHistory.GetHashrateScoreHistoryNodes)
            {
                var miningRevenue = new MiningRevenue
                {
                    Date = node.GetHashrateScoreHistoryNode.Date.ToUniversalTime(),
                    UptimePercent = node.GetHashrateScoreHistoryNode.UptimePercentage,
                    TotalRevenueBTC = node.GetHashrateScoreHistoryNode.Revenue,
                    Hashrate = node.GetHashrateScoreHistoryNode.Hashrate / 1000000000000
                };
                miningRevenues.Add(miningRevenue);
            }

            return miningRevenues;
        }


        public async Task<WorkerDetails> GetWorkerDetails()
        {
            var body = new { query = LuxorTechConstants.GetWorkerDetailsQuery };
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(LuxorTechConstants.Url, content);

            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<dynamic>(responseContent);

            if (result == null)
            {
                return new WorkerDetails();
            }

            var workerDetail = new WorkerDetails
            {
                MinerId = result.data.getWorkerDetails.edges[0].node.minerId,
                WorkerName = result.data.getWorkerDetails.edges[0].node.workerName,
                MiningProfileName = result.data.getWorkerDetails.edges[0].node.miningProfileName,
                UpdatedAt = result.data.getWorkerDetails.edges[0].node.updatedAt,
                Status = result.data.getWorkerDetails.edges[0].node.status,
                Hashrate = result.data.getWorkerDetails.edges[0].node.hashrate,
                ValidShares = result.data.getWorkerDetails.edges[0].node.validShares,
                StaleShares = result.data.getWorkerDetails.edges[0].node.staleShares,
                InvalidShares = result.data.getWorkerDetails.edges[0].node.invalidShares,
                LowDiffShares = result.data.getWorkerDetails.edges[0].node.lowDiffShares,
                BadShares = result.data.getWorkerDetails.edges[0].node.badShares,
                DuplicateShares = result.data.getWorkerDetails.edges[0].node.duplicateShares,
                //Revenue = result.data.getWorkerDetails.edges[0].node.revenue,
                Efficiency = result.data.getWorkerDetails.edges[0].node.efficiency,
            };


            return workerDetail;
        }

        public async Task<string> GetPendingBalance()
        {
            var body = new { query = (string?)null, documentId = "4def7c79a628f8a9b028a5573e3cbce5", variables = new { username = "coldbakd", cid = "BTC" } };
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(LuxorTechConstants.Url, content);

            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
            return result?.data.wallet.pendingBalance;
        }

        public async Task<string> GetWorkerHashRate()
        {
            var body = new { query = LuxorTechConstants.GetWorkerHashRateHistory };
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(LuxorTechConstants.Url, content);

            var responseContent = await response.Content.ReadAsStringAsync();
            return responseContent;
        }

        public async Task<string> GetMiningSummary()
        {
            var body = new { query = LuxorTechConstants.GetMiningSummary };
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(LuxorTechConstants.Url, content);

            var responseContent = await response.Content.ReadAsStringAsync();
            return responseContent;
        }

        public async Task<string> GetHashRateScoreHistory()
        {
            var body = new { query = LuxorTechConstants.GetHashRateScoreHistory };
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(LuxorTechConstants.Url, content);

            var responseContent = await response.Content.ReadAsStringAsync();
            return responseContent;
        }

        public async Task<double> GetTransactionTotalsHistory()
        {
            var body = new { query = LuxorTechConstants.GetTransactionHistory };
            var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(LuxorTechConstants.Url, content);

            var responseContent = await response.Content.ReadAsStringAsync();
            var transactionHistoryResponse = JsonConvert.DeserializeObject<GetTransactionHistoryResponse>(responseContent);

            double totals = 0;
            foreach (var item in transactionHistoryResponse.TransactionHistoryData.GetTransactionHistory.TransactionHistoryNodes)
            {
                totals += item.Amount;
            }

            return totals;
        }
    }
}
