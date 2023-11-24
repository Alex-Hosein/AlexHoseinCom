using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Dto
{
    public class MiningRevenue
    {
        public DateTime Date { get; set; }
        public double UptimePercent { get;set; }
        public double TimeInHours => UptimePercent / 100 * 24;
        public double TotalRevenueBTC { get; set; }
    }
}
