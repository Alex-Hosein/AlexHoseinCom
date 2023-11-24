import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface MiningRevenueResponse {
  date: string;
  uptimePercent: number;
  timeInHours: number;
  totalRevenueBTC: string;
}

interface MiningRevenue {
  date: string;
  uptimePercent: number;
  timeInHours: number;
  totalKilowattHours: number;
  totalRevenueBTC: string;
  totalRevenueUSD: number;
  totalCost: number;
  totalProfit: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public miningRevenues: MiningRevenue[] = [];

  public currentBitcoinPrice: number = 0;
  public totalTimeInHours: number = 0;
  public totalKilowattHours: number = 0;
  public totalRevenueBtc: number = 0;
  public totalRevenueUsd: number = 0;
  public totalCost: number = 0;
  public totalProfit: number = 0;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBitcoinPricing();
  }

  getMiningRevenue() {
    this.http.get<MiningRevenueResponse[]>('https://localhost:7197/Miner/GetTotalMiningRevenue').subscribe(
      (result) => {

        result.forEach(miningRevenueResponse => {
          let totalRevenueBtcParse = parseFloat(miningRevenueResponse.totalRevenueBTC);
          let totalKilowattHours = miningRevenueResponse.timeInHours * 2800 / 1000;
          let totalRevenue = totalRevenueBtcParse  * this.currentBitcoinPrice;
          let totalCost = totalKilowattHours * .1

          this.totalTimeInHours += miningRevenueResponse.timeInHours;
          this.totalKilowattHours += totalKilowattHours;
          this.totalRevenueBtc += totalRevenueBtcParse;
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
            totalProfit: totalRevenue - totalCost
          }
          this.miningRevenues.push(miningRevenue);
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getBitcoinPricing() {
    this.http.get<number>('https://localhost:7197/Miner/GetBitcoinPricing').subscribe(
      (result) => {
        this.currentBitcoinPrice = result;
        this.getMiningRevenue();
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
