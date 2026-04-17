import { FlexRowNoWrap, FlexRowWrap } from "../../../components/flex";
import type { CategoryDisplayData } from "../interfaces";
import { formatCurrency } from "../utils";
import { CbfSalesCategoryCard } from "./category-card";

interface Props {
  categoriesToDisplay: CategoryDisplayData[];
}
const CbfCalculatorSalesTotalsByCategory: React.FunctionComponent<Props> = ({
  categoriesToDisplay,
}) => {
  const totalSales = calculateSumFromCategories({
    categories: categoriesToDisplay,
    propertyNameToTotal: "totalSales",
  });
  const totalFees = calculateSumFromCategories({
    categories: categoriesToDisplay,
    propertyNameToTotal: "squareFees",
  });
  return (
    <>
      <FlexRowNoWrap style={{ gap: "50px" }}>
        <h3 style={{ marginTop: "0px" }}>
          Sum of Category Sales: {formatCurrency(totalSales)}
        </h3>
        <h3 style={{ marginTop: "0px" }}>
          Sum of Category Fees: {formatCurrency(totalFees)}
        </h3>
        <h3 style={{ marginTop: "0px" }}>
          Sum of Category Sales After Fees:{" "}
          {formatCurrency(totalSales + totalFees)}
        </h3>
      </FlexRowNoWrap>
      <FlexRowWrap style={{ gap: "1%" }}>
        {categoriesToDisplay.map((category) => (
          <CbfSalesCategoryCard
            key={category.name}
            {...category}
            style={{ width: "32.5%", marginBottom: "1%" }}
          />
        ))}
      </FlexRowWrap>
    </>
  );
};

const calculateSumFromCategories = ({
  categories,
  propertyNameToTotal,
}: {
  categories: CategoryDisplayData[];
  propertyNameToTotal: keyof CategoryDisplayData;
}) => {
  return categories.reduce<number>((accumulatedSum, currentCategory) => {
    const totalToAdd = currentCategory[propertyNameToTotal];
    if (typeof totalToAdd !== "number") {
      return accumulatedSum;
    }
    return accumulatedSum + totalToAdd;
  }, 0);
};

export { CbfCalculatorSalesTotalsByCategory };
