namespace Domain.Constants
{
    public class LuxorTechConstants
    {
        public const string Url = "https://api.beta.luxor.tech/graphql";
        public const string ApiKey = "lxk.77b634531bc7b74041ad10ed7ac966ec";
        public const string HeaderKey = "x-lux-api-key";

        public const string GetWorkerDetailsQuery = @"query getWorkerDetails {
              getWorkerDetails(duration: { days: 10 }, mpn: BTC, uname: ""coldbakd"", first: 10) {
                edges {
                  node {
                    minerId
                    workerName
                    miningProfileName
                    updatedAt
                    status
                    hashrate
                    validShares
                    staleShares
                    invalidShares
                    lowDiffShares
                    badShares
                    duplicateShares
                    revenue
                    efficiency
                  }
                }
              }
            }";

        public const string GetWorkerHashRateHistory = @"query getWorkerHashrateHistory {
              getWorkerHashrateHistory(
                inputBucket: _15_MINUTE
                inputDuration: _15_MINUTE
                mpn: BTC 
                username: ""coldbakd""
                workerName: ""s19jpro""
                first: 10
              ) {
                edges {
                  node {
                    time
                    hashrate
                  }
                }
              }
            }";

        public const string GetMiningSummary = @"query getMiningSummary {
              getMiningSummary(inputDuration: _15_MINUTE, mpn: BTC, userName: ""coldbakd"") {
                username
                validShares
                invalidShares
                staleShares
                lowDiffShares
                badShares
                duplicateShares
                revenue
                hashrate
              }
            }";

        public const string GetHashRateScoreHistory = @"query getHashrateScoreHistory {
              getHashrateScoreHistory(mpn: BTC, uname: ""coldbakd"", first: 10, orderBy: DATE_DESC) {
                edges {
                  node {
                    date
                    efficiency
                    hashrate
                    revenue
                    uptimePercentage
                    uptimeTotalMinutes
                    uptimeTotalMachines
                  }
                }
              }
            }";

        public const string GetTransactionHistory = @"query getTransactionHistory {
          getTransactionHistory(cid: BTC, uname: ""coldbakd"", first: 10) {
            nodes {
              amount
              coinPrice
              createdAt
              rowId
              status
              transactionId
            }
          }
        }
        ";
    }
}
