import { Card } from "@mantine/core";
import type { CategoryDisplayData } from "../interfaces";
import { FlexRowNoWrap } from "../../../components/flex";
import { BoldText } from "../../../components/text-styles";
import { formatCurrency } from "../utils";

const CbfSalesCategoryCard: React.FunctionComponent<
  CategoryDisplayData & { style?: React.CSSProperties }
> = ({
  name,
  cashSales,
  cashItems,
  splitTenderItems,
  cardSales,
  cardItems,
  totalSales,
  squareFees,
  totalAfterFees,
  style,
}) => {
  // TODO: add toggle for community donation
  // TODO: list item names
  // add tab for sold items by category
  // add print button for categories
  // TODO: Display actual total and calculated total
  return (
    <Card style={style}>
      <h3 style={{ margin: "0px 0px 10px" }}>{name}</h3>
      <FlexRowNoWrap style={{ gap: "10px", marginBottom: "12px" }}>
        <PaymentTypeSummary
          style={{ flexGrow: 1 }}
          label="Cash Sales"
          itemCount={cashItems.length}
          totalSales={cashSales}
        />
        <PaymentTypeSummary
          style={{ flexGrow: 1 }}
          label="Card Sales"
          itemCount={cardItems.length}
          totalSales={cardSales}
        />
      </FlexRowNoWrap>
      <ValueWithLabel
        style={{ marginBottom: "12px" }}
        label="Split Tender Items"
        value={splitTenderItems.length}
      />
      <ValueWithLabel label="Total Sales" value={formatCurrency(totalSales)} />
      <ValueWithLabel
        style={{
          borderBottom: `2px solid pink`,
          marginBottom: "5px",
          paddingBottom: "5px",
        }}
        label="Square Fees"
        value={formatCurrency(squareFees)}
      />
      <ValueWithLabel
        label="Final Total"
        value={formatCurrency(totalAfterFees)}
      />
    </Card>
  );
};

interface ValueWithLabelProps {
  label: string;
  value: React.ReactNode;
  style?: React.CSSProperties;
}
const ValueWithLabel: React.FunctionComponent<ValueWithLabelProps> = ({
  label,
  value,
  style,
}) => {
  return (
    <FlexRowNoWrap
      style={{
        fontSize: "0.9rem",
        gap: "5px",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <BoldText>{label}:</BoldText> {value}
    </FlexRowNoWrap>
  );
};

interface PaymentTypeSummaryProps {
  style?: React.CSSProperties;
  label: string;
  itemCount: number;
  totalSales: number;
}
const PaymentTypeSummary: React.FunctionComponent<PaymentTypeSummaryProps> = ({
  itemCount,
  label,
  style,
  totalSales,
}) => {
  return (
    <div
      style={{
        ...style,
        border: `1px solid pink`,
        padding: "8px",
        borderRadius: "5px",
      }}
    >
      <h4 style={{ margin: "0px" }}>{label}</h4>
      <ValueWithLabel label="Items" value={itemCount} />
      <ValueWithLabel label="Total" value={formatCurrency(totalSales)} />
    </div>
  );
};

export { CbfSalesCategoryCard };
