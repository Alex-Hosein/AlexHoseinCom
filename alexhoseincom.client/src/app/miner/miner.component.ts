import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';
import { MatTabChangeEvent } from '@angular/material/tabs';

interface MiningRevenueResponse {
  date: string;
  uptimePercent: number;
  timeInHours: number;
  totalRevenueBTC: number;
  hashrate: number;
}

interface MiningRevenue {
  date: string;
  uptimePercent: number;
  timeInHours: number;
  totalKilowattHours: number;
  totalRevenueBTC: number;
  totalRevenueUSD: number;
  totalCost: number;
  totalProfit: number;
  hashrate: number;
}

interface MiningTotal {
  totalUptimePercent: number;
  totalTimeInHours: number;
  totalKilowattHours: number;
  totalRevenueBtc: number;
  totalRevenueUsd: number;
  totalCost: number;
  totalProfit: number;
}

interface MiningRevenuesByMonth {
  month: string;
  miningRevenues: MiningRevenue[];
  estimatedData: MiningRevenue | null;
  total: MiningTotal;
}

@Component({
  selector: 'app-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.scss'],
  
})
export class MinerComponent implements OnInit {
  public miningRevenues: MiningRevenue[] = [];
  public miningRevenuesByMonth: MiningRevenuesByMonth[] = [];
  public pendingBalance: number = 0;
  public pricePerKilowattHour: number = 0.19;
  public transactionTotalRevenue: number = 0;
  public currentBitcoinPrice: number = 0;
  public totalUptimePercent: number = 0;
  public totalTimeInHours: number = 0;
  public totalKilowattHours: number = 0;
  public totalRevenueBtc: number = 0;
  public totalRevenueUsd: number = 0;
  public totalCost: number = 0;
  public totalProfit: number = 0;
  public activeTabIndex: number = 2; 

  public overallTotals: MiningTotal = {
    totalUptimePercent: 0,
    totalTimeInHours: 0,
    totalKilowattHours: 0,
    totalRevenueBtc: 0,
    totalRevenueUsd: 0,
    totalCost: 0,
    totalProfit: 0,
  };

  constructor(private http: HttpClient, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Miner');
    this.getTransactionTotalsHistory();
    this.getBitcoinPricing();
    this.activeTabIndex = 1;
  }

  getMiningRevenue() {
    this.http.get<MiningRevenueResponse[]>(`${environment.apiUrl}Miner/GetTotalMiningRevenue`).subscribe(
      (result) => {
        const miningRevenuesByMonth: { [month: string]: MiningRevenue[] } = {};

        result.forEach(miningRevenueResponse => {
          const monthKey = miningRevenueResponse.date.substring(0, 7);
          if (!miningRevenuesByMonth[monthKey]) {
            miningRevenuesByMonth[monthKey] = [];
          }

          let totalKilowattHours = miningRevenueResponse.timeInHours * 2832 / 1000;
          let totalRevenue = miningRevenueResponse.totalRevenueBTC * this.currentBitcoinPrice;
          let totalCost = (miningRevenueResponse.hashrate * 100 / miningRevenueResponse.uptimePercent) > 150 ? totalKilowattHours * (this.pricePerKilowattHour * 2) : totalKilowattHours * this.pricePerKilowattHour;

          this.totalUptimePercent += (miningRevenueResponse.uptimePercent / result.length);
          this.totalTimeInHours += miningRevenueResponse.timeInHours;
          this.totalKilowattHours += totalKilowattHours;
          this.totalRevenueBtc += miningRevenueResponse.totalRevenueBTC;
          this.totalRevenueUsd += totalRevenue;
          this.totalCost += totalCost;
          this.totalProfit += totalRevenue - totalCost;

          let miningRevenue: MiningRevenue = {
            date: miningRevenueResponse.date,
            uptimePercent: miningRevenueResponse.uptimePercent,
            timeInHours: miningRevenueResponse.timeInHours,
            totalKilowattHours: totalKilowattHours,
            totalRevenueBTC: miningRevenueResponse.totalRevenueBTC,
            totalRevenueUSD: totalRevenue,
            totalCost: totalCost,
            totalProfit: totalRevenue - totalCost,
            hashrate: miningRevenueResponse.hashrate * 100 / miningRevenueResponse.uptimePercent
          };
          miningRevenuesByMonth[monthKey].push(miningRevenue);
        });

        this.miningRevenuesByMonth = Object.keys(miningRevenuesByMonth).map(key => ({
          month: key,
          miningRevenues: miningRevenuesByMonth[key],
          total: this.calculateTotals(miningRevenuesByMonth[key]),
          estimatedData: null
        }));

        this.overallTotals = this.calculateTotals(
          this.miningRevenuesByMonth.reduce((allRevenues, monthData) => allRevenues.concat(monthData.miningRevenues), [] as MiningRevenue[])
        );
        //this.calculateEstimatedData();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getBitcoinPricing() {
    this.http.get<number>(`${environment.apiUrl}Miner/GetBitcoinPricing`).subscribe(
      (result) => {
        this.currentBitcoinPrice = result;
        this.getMiningRevenue();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getPendingBalance() {
    this.http.get<string>(`${environment.apiUrl}Miner/GetPendingBalance`).subscribe(
      (result) => {
        this.pendingBalance = parseFloat(result);
        let dateObject = new Date(this.miningRevenues[0].date);
        let totalRevenueBtc = this.pendingBalance + this.totalRevenueBtc - this.transactionTotalRevenue - this.miningRevenues[0].totalRevenueBTC;
        dateObject.setDate(dateObject.getDate() + 1);

        let estimatedMiningRevenue: MiningRevenue = {
          date: dateObject.toISOString(),
          uptimePercent: 0,
          timeInHours: 0,
          totalKilowattHours: 0,
          totalRevenueBTC: totalRevenueBtc,
          totalRevenueUSD: totalRevenueBtc * this.currentBitcoinPrice,
          totalCost: 0,
          totalProfit: 0,
          hashrate: 0
        };

        this.miningRevenues.unshift(estimatedMiningRevenue);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  calculateEstimatedData() {
    const currentMonthKey = new Date().toISOString().slice(0, 7);
    const currentMonthData = this.miningRevenuesByMonth.find(data => data.month === currentMonthKey);

    if (currentMonthData) {
      const cumulativeTotalRevenueBtc = this.miningRevenuesByMonth.reduce((total, month) => total + month.total.totalRevenueBtc, 0);
      const mostRecentMiningRevenue = currentMonthData.miningRevenues[currentMonthData.miningRevenues.length - 1];
      const estimatedTotalRevenueBtc = this.pendingBalance + cumulativeTotalRevenueBtc - this.transactionTotalRevenue - mostRecentMiningRevenue.totalRevenueBTC;
      console.log(cumulativeTotalRevenueBtc);

      currentMonthData.estimatedData = {
        uptimePercent: 0,
        timeInHours: 0,
        totalKilowattHours: 0,
        totalRevenueUSD: 0,
        totalCost: 0,
        totalProfit: 0,
        hashrate: 0,
        totalRevenueBTC: estimatedTotalRevenueBtc,
        date: new Date().toISOString()
      };
    }
  }

  calculateTotals(miningRevenue: MiningRevenue[]): MiningTotal {
    const numRevenues = miningRevenue.length;
    let total: MiningTotal = {
      totalUptimePercent: 0,
      totalTimeInHours: 0,
      totalKilowattHours: 0,
      totalRevenueBtc: 0,
      totalRevenueUsd: 0,
      totalCost: 0,
      totalProfit: 0,
    };

    miningRevenue.forEach(miningRevenue => {
      total.totalUptimePercent += miningRevenue.uptimePercent;
      total.totalTimeInHours += miningRevenue.timeInHours;
      total.totalKilowattHours += miningRevenue.totalKilowattHours;
      total.totalRevenueBtc += miningRevenue.totalRevenueBTC;
      total.totalRevenueUsd += miningRevenue.totalRevenueUSD;
      total.totalCost += miningRevenue.totalCost;
      total.totalProfit += miningRevenue.totalProfit;
    });

    total.totalUptimePercent /= numRevenues;

    return total;
  }

  getTransactionTotalsHistory() {
    this.http.get<number>(`${environment.apiUrl}Miner/GetTransactionTotalsHistory`).subscribe(
      (result) => {
        this.transactionTotalRevenue = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  removeTime(dateString: string): string {
    return dateString ? dateString.split('T')[0] : '';
  }

  getMonthYearString(month: string): string {
    const [year, monthNumber] = month.split('-');
    const monthName = new Date(`${year}-${monthNumber}-02`).toLocaleString('en-us', { month: 'long' });
    return `${monthName} ${year}`;
  }
  
  onTabChanged(event: MatTabChangeEvent): void {
    this.activeTabIndex = event.index;
  }
}
