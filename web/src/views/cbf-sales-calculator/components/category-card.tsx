import { Card, Checkbox } from "@mantine/core";
import { useState } from "react";
import { FlexColumnNoWrap, FlexRowNoWrap } from "../../../components/flex";
import { BoldText } from "../../../components/text-styles";
import type { CategoryDisplayData } from "../interfaces";
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
  const [isDonationApplied, setIsDonationApplied] = useState<boolean>(false);

  const donationAmount = 0 - totalAfterFees * 0.1;
  const finalTotal = isDonationApplied
    ? totalAfterFees + donationAmount
    : totalAfterFees;

  return (
    <Card style={style}>
      <FlexRowNoWrap
        style={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ margin: "0px" }}>{name}</h3>
        <Checkbox
          color="pink"
          checked={isDonationApplied}
          onChange={(event) => {
            setIsDonationApplied(event.target.checked);
          }}
          style={{ cursor: "pointer" }}
          label="Comm Donation"
          labelPosition="left"
        />
      </FlexRowNoWrap>
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
      <FlexColumnNoWrap style={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <ValueWithLabel
          label="Total Sales"
          value={formatCurrency(totalSales)}
        />
        <ValueWithLabel
          label="Square Fees"
          value={formatCurrency(squareFees)}
        />
        {isDonationApplied ? (
          <>
            <ValueWithLabel
              label="Total After Fees"
              value={formatCurrency(totalAfterFees)}
            />
            <ValueWithLabel
              label="Comm Donation"
              value={formatCurrency(donationAmount)}
            />
          </>
        ) : null}
        <div
          style={{
            height: "6px",
            marginBottom: "5px",
            borderBottom: `2px solid pink`,
          }}
        />
        <ValueWithLabel
          label="Final Total"
          value={formatCurrency(finalTotal)}
        />
      </FlexColumnNoWrap>
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
