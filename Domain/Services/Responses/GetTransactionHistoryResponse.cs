using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Responses
{
    public class GetTransactionHistoryResponse
    {
        [JsonProperty("data")]
        public TransactionHistoryData TransactionHistoryData { get; set; }
    }

    public class TransactionHistoryData
    {
        [JsonProperty("getTransactionHistory")]
        public GetTransactionHistory GetTransactionHistory { get; set; }
    }

    public class GetTransactionHistory
    {
        [JsonProperty("nodes")]
        public List<TransactionHistoryNode> TransactionHistoryNodes { get; set; }
    }

    public class TransactionHistoryNode
    {
        public double Amount { get; set; }
        public string CoinPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public int RowId { get; set; }
        public string Status { get; set; }
        public string TransactionId { get; set; }
    }
}