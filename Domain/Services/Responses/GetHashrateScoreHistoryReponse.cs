using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Responses
{
    public class GetHashrateScoreHistoryNode
    {
        public DateTime Date { get; set; }
        public string Efficiency { get; set; }
        public double Hashrate { get; set; }
        public double Revenue { get; set; }
        public double UptimePercentage { get; set; }
        public int UptimeTotalMinutes { get; set; }
        public int UptimeTotalMachines { get; set; }
    }

    public class GetHashrateScoreHistoryNodes
    {
        [JsonProperty("node")]
        public GetHashrateScoreHistoryNode GetHashrateScoreHistoryNode { get; set; }
    }

    public class GetHashrateScoreHistory
    {
        [JsonProperty("edges")]
        public List<GetHashrateScoreHistoryNodes> GetHashrateScoreHistoryNodes { get; set; }
    }

    public class HashrateScoreHistoryData
    {
        [JsonProperty("getHashrateScoreHistory")]
        public GetHashrateScoreHistory GetHashrateScoreHistory { get; set; }
    }

    public class HashrateScoreHistoryResponse
    {
        [JsonProperty("data")]
        public HashrateScoreHistoryData Data { get; set; }
    }
}
