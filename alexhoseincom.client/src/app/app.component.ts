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
  public pendingBalance: number = 0;

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
          let totalCost = totalKilowattHours * .110469375

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
        this.getPendingBalance();
       
        

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

  getPendingBalance() {
    this.http.get<string>('https://localhost:7197/Miner/GetPendingBalance').subscribe(
      (result) => {
        this.pendingBalance = parseFloat(result);

        console.log(this.miningRevenues);
        let dateObject = new Date(this.miningRevenues[0].date);
        dateObject.setDate(dateObject.getDate() + 1);

        let estimatedMiningRevenue: MiningRevenue = {
          date: dateObject.toISOString(),
          uptimePercent: 0,
          timeInHours: 0,
          totalKilowattHours: 0,
          totalRevenueBTC: (this.pendingBalance - this.totalRevenueBtc).toString().slice(0,10),
          totalRevenueUSD: (this.pendingBalance - this.totalRevenueBtc) * this.currentBitcoinPrice,
          totalCost: 0,
          totalProfit: 0
        }

        this.miningRevenues.unshift(estimatedMiningRevenue)
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
