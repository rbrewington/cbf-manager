import { Button, Card, TextInput } from "@mantine/core";
import Papa from "papaparse";
import { useRef, useState } from "react";

const transactionIdProperty = "Transaction ID";
const netSalesProperty = "Net Sales";
interface ItemResult {
  Category: string;
  Notes: string;
  SKU: string;
  [transactionIdProperty]: string;
  [netSalesProperty]: string;
}

interface TransactionResult {
  Card: string;
  Cash: string;
  Fees: string;
  [transactionIdProperty]: string;
  [netSalesProperty]: string;
}

interface ItemDisplayData {
  description: string;
  sku: string;
  fees: number;
  cardAmount: number;
  cashAmount: number;
  saleType: "card" | "cash" | "split";
}
interface CategoryDisplayData {
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

const CbfSalesCalculator: React.FunctionComponent = () => {
  const transactionsInputRef = useRef<HTMLInputElement>(null);
  const itemsInputRef = useRef<HTMLInputElement>(null);

  const [calculatedCategories, setCalculatedCategories] = useState<
    CategoryDisplayData[]
  >([]);

  const handleFileUpload = () => {
    const transactionsReport = transactionsInputRef.current?.files?.[0];
    const itemsReport = itemsInputRef.current?.files?.[0];
    if (!transactionsReport || !itemsReport) {
      return;
    }
    Papa.parse<File>(transactionsReport, {
      header: true,
      complete: (transactionsResult) => {
        const transactionsData =
          transactionsResult.data as unknown as TransactionResult[];
        console.log("parsed transactions", transactionsData);
        Papa.parse<File>(itemsReport, {
          header: true,
          complete: (itemsResult) => {
            const itemsData: ItemResult[] =
              itemsResult.data as unknown as ItemResult[];
            const groupedByCategory = itemsData.reduce<{
              [key: string]: ItemDisplayData[];
            }>((acc, currentItem) => {
              const categoryName = currentItem.Category;
              if (!categoryName) {
                return acc;
              }

              const transactionId = currentItem[transactionIdProperty];
              const transactionForItem = transactionsData.find(
                (transaction) =>
                  transaction[transactionIdProperty] === transactionId,
              );

              if (!transactionForItem) {
                throw new Error(`No transaction found for id ${transactionId}`);
              }

              const netTransactionAmount = transformCurrencyStringToFloat(
                transactionForItem[netSalesProperty],
              );
              const netItemAmount = transformCurrencyStringToFloat(
                currentItem[netSalesProperty],
              );

              const percentageOfTransaction =
                netItemAmount / netTransactionAmount;

              const transactionFees = transformCurrencyStringToFloat(
                transactionForItem.Fees,
              );
              const feesForItem = transactionFees * percentageOfTransaction;

              const transactionAmountOnCard = transformCurrencyStringToFloat(
                transactionForItem.Card,
              );
              const itemAmountOnCard = Math.round(
                transactionAmountOnCard * percentageOfTransaction,
              );

              const transactionAmountInCash = transformCurrencyStringToFloat(
                transactionForItem.Cash,
              );
              const itemAmountInCash = Math.round(
                transactionAmountInCash * percentageOfTransaction,
              );

              const itemDetails: ItemDisplayData = {
                cardAmount: itemAmountOnCard,
                cashAmount: itemAmountInCash,
                description: currentItem.Notes,
                fees: feesForItem,
                sku: currentItem.SKU,
                saleType:
                  itemAmountInCash === 0
                    ? "card"
                    : itemAmountOnCard === 0
                      ? "cash"
                      : "split",
              };

              return {
                ...acc,
                [categoryName]: [...(acc[categoryName] || []), itemDetails],
              };
            }, {});

            const categories = Object.keys(
              groupedByCategory,
            ).map<CategoryDisplayData>((categoryName) => {
              const items = groupedByCategory[categoryName];
              const { cashSales, cardSales, squareFees } = items.reduce(
                (acc, curr) => {
                  return {
                    cashSales: acc.cashSales + curr.cashAmount,
                    cardSales: acc.cardSales + curr.cardAmount,
                    squareFees: acc.squareFees + curr.fees,
                  };
                },
                { cashSales: 0, cardSales: 0, squareFees: 0 },
              );
              const totalSales = cashSales + cardSales;
              return {
                cashSales,
                cardSales,
                cashItems: items.filter((item) => item.saleType === "cash"),
                cardItems: items.filter((item) => item.saleType === "card"),
                name: categoryName,
                splitTenderItems: items.filter(
                  (item) => item.saleType === "split",
                ),
                totalSales,
                squareFees,
                totalAfterFees: totalSales + squareFees,
              };
            });

            console.log("calculated categories", categories);
            setCalculatedCategories(categories);
          },
        });
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: "flex-start",
        gap: "20px",
      }}
    >
      <Card style={{ alignItems: "flex-start" }}>
        <TextInput
          label="Transactions CSV"
          multiple={false}
          ref={transactionsInputRef}
          type="file"
          accept=".csv"
        />
        <TextInput
          label="Items CSV"
          multiple={false}
          ref={itemsInputRef}
          type="file"
          accept=".csv"
        />
        <Button
          style={{ marginTop: "12px" }}
          onClick={() => handleFileUpload()}
        >
          Calculate Sales Totals
        </Button>
      </Card>
      <div style={{ display: "flex", flexFlow: "row wrap", gap: "10px" }}>
        {calculatedCategories.map((category) => (
          <CategoryCard key={category.name} {...category} />
        ))}
      </div>
    </div>
  );
};

const CategoryCard: React.FunctionComponent<CategoryDisplayData> = ({
  name,
  cashSales,
  cashItems,
  splitTenderItems,
  cardSales,
  cardItems,
  totalSales,
  squareFees,
  totalAfterFees,
}) => {
  // TODO: add toggle for community donation
  // TODO: list item names
  // add tab for sold items by category
  // add print button for categories
  // clean up and organize
  return (
    <Card>
      <h3 style={{ margin: "0px" }}>{name}</h3>
      <div>Cash: {cashSales}</div>
      <div>{cashItems.length} items</div>
      <div>Card: {cardSales}</div>
      <div>{cardItems.length} items</div>
      <div>Split Tender Items: {splitTenderItems.length}</div>
      <div>Total Sales: {totalSales}</div>
      <div>Square Fees: {squareFees}</div>
      <div>Total After Fees: {totalAfterFees}</div>
    </Card>
  );
};

const transformCurrencyStringToFloat = (currency: string): number => {
  const decimalAndDigitsOnly = currency.replace(/[^0-9.-]+/g, "");
  return parseFloat(decimalAndDigitsOnly);
};

export { CbfSalesCalculator };
