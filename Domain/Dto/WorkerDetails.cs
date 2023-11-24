using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dto
{
    public class WorkerDetails
    {
        public long MinerId { get; set; }
        public string WorkerName { get; set; }
        public string MiningProfileName { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Status { get; set; }
        public string Hashrate { get; set; }
        public long ValidShares { get; set; }
        public long StaleShares { get; set; }
        public long InvalidShares { get; set; }
        public long LowDiffShares { get; set; }
        public long BadShares { get; set; }
        public long DuplicateShares { get; set; }
        //public decimal Revenue { get; set; }
        public decimal Efficiency { get; set; }
    }
}
