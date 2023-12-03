import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';

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

@Component({
  selector: 'app-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.css']
})
export class MinerComponent implements OnInit{
  public miningRevenues: MiningRevenue[] = [];
  public pendingBalance: number = 0;
  public pricePerKilowattHour: number = .19;

  public transactionTotalRevenue: number = 0;
  public currentBitcoinPrice: number = 0;
  public totalUptimePercent:number = 0
  public totalTimeInHours: number = 0;
  public totalKilowattHours: number = 0;
  public totalRevenueBtc: number = 0;
  public totalRevenueUsd: number = 0;
  public totalCost: number = 0;
  public totalProfit: number = 0;
  constructor(private http: HttpClient, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle("Miner")
    this.getTransactionTotalsHistory();
    this.getBitcoinPricing();
  }

  getMiningRevenue() {
    this.http.get<MiningRevenueResponse[]>(`${environment.apiUrl}Miner/GetTotalMiningRevenue`).subscribe(
      (result) => {

        result.forEach(miningRevenueResponse => {
          let totalKilowattHours = miningRevenueResponse.timeInHours * 2832 / 1000;
          let totalRevenue = miningRevenueResponse.totalRevenueBTC  * this.currentBitcoinPrice;
          let totalCost = totalKilowattHours * this.pricePerKilowattHour

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
          }
          this.miningRevenues.push(miningRevenue);
        });
      },
      (error) => {
        console.error(error);
      }, () => {
        this.getPendingBalance();
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
        console.log(this.transactionTotalRevenue)
        console.log(this.pendingBalance)
        console.log(this.totalRevenueBtc)
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
          hashrate : 0
        }

        this.miningRevenues.unshift(estimatedMiningRevenue)
      },
      (error) => {
        console.error(error);
      }
    );
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

  title = 'S19J';
}
