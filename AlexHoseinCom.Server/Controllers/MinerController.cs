using Domain.Dto;
using Domain.Services;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MinerController : ControllerBase
    {
        private readonly ILuxorTechService _luxorTechService;
        private readonly IBitcoinService _bitcoinService;

        public MinerController(ILuxorTechService luxorTechService, IBitcoinService bitcoinService)
        {
            _luxorTechService = luxorTechService;
            _bitcoinService = bitcoinService;
        }

        [HttpGet]
        [Route("GetTotalMiningRevenue")]
        public async Task<List<MiningRevenue>> GetTotalMiningRevenue()
        {
            return await _luxorTechService.GetTotalMiningRevenue();
        }

        [HttpGet]
        [Route("GetBitcoinPricing")]
        public async Task<double> GetBitcoinPricing()
        {
            return await _bitcoinService.GetBitcoinPricing();
        }

        [HttpGet]
        [Route("GetPendingBalance")]
        public async Task<string> GetPendingBalance()
        {
            return await _luxorTechService.GetPendingBalance();
        }

        /*
        [HttpGet]
        [Route("GetWorkerDetails")]
        public async Task<WorkerDetails> GetWorkerDetails()
        {
            return await _luxorTechService.GetWorkerDetails();
        }

        

        [HttpGet]
        [Route("GetWorkerHashRate")]
        public async Task<string> GetWorkerHashRate()
        {
            return await _luxorTechService.GetWorkerHashRate();
        }

        [HttpGet]
        [Route("GetMiningSummary")]
        public async Task<string> GetMiningSummary()
        {
            return await _luxorTechService.GetMiningSummary();
        }

        [HttpGet]
        [Route("GetHashRateScoreHistory")]
        public async Task<string> GetHashRateScoreHistory()
        {
            return await _luxorTechService.GetHashRateScoreHistory();
        }
        */
    }
}
