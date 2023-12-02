import { Component } from '@angular/core';

@Component({
  selector: 'app-bill-estimator',
  templateUrl: './bill-estimator.component.html',
  styleUrls: ['./bill-estimator.component.css']
})
export class BillEstimatorComponent {
  basicServiceDays = 1;
  kilowattHours = 65;
  mfcCostPerKWH = 0.002415;
  deliveryChargeKwhPrice = 0.0916;
  powerSupplyCostPerUnit = 0.101205;
  derChargeCostPerUnit = 0.005228;
  deliveryServiceAdjustment = 0.000405;
  basicServiceCostPerDay = 0.4800;
  revenueDecouplingAdjustmentApproximateCost = 0.0362;
  nyStateAssessmentApproximateCost = .00279;
  revenueBasedPilotEstimatedCost = .01377;
  suffolkPropertyTaxAdjustment = .01987;
  salesTax = .025;

  basicServiceTotal = this.basicServiceDays * this.basicServiceCostPerDay;
  mfcTotal = this.kilowattHours * this.mfcCostPerKWH;
  totalDeliveryCharge = this.kilowattHours * this.deliveryChargeKwhPrice;
  totalPowerSupplyCost = this.kilowattHours * this.powerSupplyCostPerUnit;
  totalDeliveryAndSystemCharge = this.basicServiceTotal + this.mfcTotal + this.totalDeliveryCharge;
  totalDerChargeCost = this.derChargeCostPerUnit * this.kilowattHours;
  totalDeliveryServiceAdjustment = this.deliveryServiceAdjustment * (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * -1;
  totalRevenueDecouplingAdjustment = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * this.revenueDecouplingAdjustmentApproximateCost * -1;
  totalNyStateAssessment = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * this.nyStateAssessmentApproximateCost;
  totalRevenueBasedPilot = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * this.revenueBasedPilotEstimatedCost;
  totalsuffolkPropertyTaxAdjustment = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * this.suffolkPropertyTaxAdjustment;
  totalSalesTax = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost + this.totalDerChargeCost) * this.salesTax
  totalTaxesAndOtherCharges = this.totalDerChargeCost + this.totalDeliveryServiceAdjustment + this.totalRevenueDecouplingAdjustment + this.totalNyStateAssessment + this.totalRevenueBasedPilot + this.totalsuffolkPropertyTaxAdjustment + this.totalSalesTax;
  totals = this.totalTaxesAndOtherCharges + this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost;
  updateTotals() {
    this.basicServiceTotal = this.basicServiceDays * this.basicServiceCostPerDay;
    this.mfcTotal = this.kilowattHours * this.mfcCostPerKWH;
    this.totalDeliveryCharge = this.kilowattHours * this.deliveryChargeKwhPrice;
    this.totalPowerSupplyCost = this.kilowattHours * this.powerSupplyCostPerUnit;
    this.totalDeliveryAndSystemCharge = this.basicServiceTotal + this.mfcTotal + this.totalDeliveryCharge;
    this.totalDerChargeCost = this.derChargeCostPerUnit * this.kilowattHours;
    this.totalDeliveryServiceAdjustment = this.deliveryServiceAdjustment * (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * -1;
    this.totalRevenueDecouplingAdjustment = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * this.revenueDecouplingAdjustmentApproximateCost * -1;
    this.totalNyStateAssessment = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * this.nyStateAssessmentApproximateCost;
    this.totalRevenueBasedPilot = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * this.revenueBasedPilotEstimatedCost;
    this.totalsuffolkPropertyTaxAdjustment = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost) * this.suffolkPropertyTaxAdjustment;
    this.totalSalesTax = (this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost + this.totalDerChargeCost) * this.salesTax
    this.totalTaxesAndOtherCharges = this.totalDerChargeCost + this.totalDeliveryServiceAdjustment + this.totalRevenueDecouplingAdjustment + this.totalNyStateAssessment + this.totalRevenueBasedPilot + this.totalsuffolkPropertyTaxAdjustment + this.totalSalesTax;
    this.totals = this.totalTaxesAndOtherCharges + this.totalDeliveryAndSystemCharge + this.totalPowerSupplyCost;
  }
}
