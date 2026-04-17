import { Card } from "@mantine/core";
import type { CategoryDisplayData } from "../interfaces";

const CbfSalesCategoryCard: React.FunctionComponent<CategoryDisplayData> = ({
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

export { CbfSalesCategoryCard };
