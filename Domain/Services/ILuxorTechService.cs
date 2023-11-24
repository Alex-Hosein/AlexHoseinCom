using Domain.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public interface ILuxorTechService
    {
        Task<List<MiningRevenue>> GetTotalMiningRevenue();
        Task<WorkerDetails> GetWorkerDetails();
        Task<decimal> GetPendingBalance();
        Task<string> GetWorkerHashRate();
        Task<string> GetMiningSummary();
        Task<string> GetHashRateScoreHistory();
    }
}
