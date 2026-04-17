export const transactionIdProperty = "Transaction ID";
export const netSalesProperty = "Net Sales";
export interface ItemResult {
  Category: string;
  Notes: string;
  SKU: string;
  [transactionIdProperty]: string;
  [netSalesProperty]: string;
}

export interface TransactionResult {
  Card: string;
  Cash: string;
  Fees: string;
  [transactionIdProperty]: string;
  [netSalesProperty]: string;
}

export interface CategoryTotals {
  cardSales: number;
  cashSales: number;
  squareFees: number;
}
export interface ItemDisplayData {
  description: string;
  sku: string;
  fees: number;
  cardAmount: number;
  cashAmount: number;
  saleType: "card" | "cash" | "split";
}
export interface CategoryDisplayData {
  cashSales: number;
  cardSales: number;
  cashItems: ItemDisplayData[];
  cardItems: ItemDisplayData[];
  splitTenderItems: ItemDisplayData[];
  name: string;
  totalAfterFees: number;
  totalSales: number;
  squareFees: number;
}

export enum SalesDataTabs {
  salesData = "0",
  soldItems = "1",
}
