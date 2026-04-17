import {
  netSalesProperty,
  type ItemResult,
  type TransactionResult,
  transactionIdProperty,
  type ItemDisplayData,
  type CategoryDisplayData,
  type CategoryTotals,
} from "./interfaces";

const calculateItemPercentOfTransaction = ({
  item,
  transaction,
}: {
  item: ItemResult;
  transaction: TransactionResult;
}) => {
  const netTransactionAmount = transformCurrencyStringToFloat(
    transaction[netSalesProperty]
  );
  const netItemAmount = transformCurrencyStringToFloat(item[netSalesProperty]);

  return netItemAmount / netTransactionAmount;
};

const calculateItemFees = ({
  percentOfTransaction,
  transaction,
}: {
  percentOfTransaction: number;
  transaction: TransactionResult;
}) => {
  const transactionFees = transformCurrencyStringToFloat(transaction.Fees);
  return transactionFees * percentOfTransaction;
};

const calculateItemSaleAmountsByPaymentType = ({
  percentOfTransaction,
  transaction,
}: {
  percentOfTransaction: number;
  transaction: TransactionResult;
}): { cardAmount: number; cashAmount: number } => {
  const transactionAmountOnCard = transformCurrencyStringToFloat(
    transaction.Card
  );
  const transactionAmountInCash = transformCurrencyStringToFloat(
    transaction.Cash
  );

  return {
    cardAmount: Math.round(transactionAmountOnCard * percentOfTransaction),
    cashAmount: Math.round(transactionAmountInCash * percentOfTransaction),
  };
};

const calculateItemSaleType = ({
  cardAmount,
  cashAmount,
}: {
  cardAmount: number;
  cashAmount: number;
}): "card" | "cash" | "split" => {
  if (cardAmount === 0) {
    return "cash";
  }
  if (cashAmount === 0) {
    return "card";
  }
  return "split";
};

const calculateTotalsForCategoryItems = (
  accumulatedTotals: CategoryTotals,
  curr
): CategoryTotals => {
  return {
    cashSales: accumulatedTotals.cashSales + curr.cashAmount,
    cardSales: accumulatedTotals.cardSales + curr.cardAmount,
    squareFees: accumulatedTotals.squareFees + curr.fees,
  };
};

const groupItemsByCategory =
  (transactionsData: TransactionResult[]) =>
  (
    accumulatedCategories: { [category: string]: ItemDisplayData[] },
    currentItem: ItemResult
  ): { [category: string]: ItemDisplayData[] } => {
    const categoryName = currentItem.Category;
    if (!categoryName) {
      return accumulatedCategories;
    }

    const transactionId = currentItem[transactionIdProperty];
    const transactionForItem = transactionsData.find(
      (transaction) => transaction[transactionIdProperty] === transactionId
    );

    if (!transactionForItem) {
      throw new Error(`No transaction found for id ${transactionId}`);
    }

    const itemDetails = transformItemResultToItemDisplayData({
      item: currentItem,
      transaction: transactionForItem,
    });

    return {
      ...accumulatedCategories,
      [categoryName]: [
        ...(accumulatedCategories[categoryName] || []),
        itemDetails,
      ],
    };
  };

const transformItemResultToItemDisplayData = ({
  item,
  transaction,
}: {
  item: ItemResult;
  transaction: TransactionResult;
}): ItemDisplayData => {
  const percentOfTransaction = calculateItemPercentOfTransaction({
    item,
    transaction,
  });
  const fees = calculateItemFees({
    percentOfTransaction,
    transaction,
  });
  const saleAmounts = calculateItemSaleAmountsByPaymentType({
    percentOfTransaction,
    transaction,
  });
  const { cardAmount, cashAmount } = saleAmounts;

  return {
    cardAmount,
    cashAmount,
    description: item.Notes,
    fees,
    sku: item.SKU,
    saleType: calculateItemSaleType(saleAmounts),
  };
};

const transformCurrencyStringToFloat = (currency: string): number => {
  const decimalAndDigitsOnly = currency.replace(/[^0-9.-]+/g, "");
  return parseFloat(decimalAndDigitsOnly);
};

const transformCategoryNameAndItemsToCategoryDisplayData =
  (itemsByCategory: { [category: string]: ItemDisplayData[] }) =>
  (categoryName: string): CategoryDisplayData => {
    const items = itemsByCategory[categoryName];

    const { cashSales, cardSales, squareFees } = items.reduce<CategoryTotals>(
      calculateTotalsForCategoryItems,
      { cashSales: 0, cardSales: 0, squareFees: 0 }
    );

    const totalSales = cashSales + cardSales;

    return {
      name: categoryName,
      cashSales,
      cardSales,
      cashItems: items.filter((item) => item.saleType === "cash"),
      cardItems: items.filter((item) => item.saleType === "card"),
      splitTenderItems: items.filter((item) => item.saleType === "split"),
      squareFees,
      totalSales,
      totalAfterFees: totalSales + squareFees,
    };
  };

export {
  groupItemsByCategory,
  transformCategoryNameAndItemsToCategoryDisplayData,
};
