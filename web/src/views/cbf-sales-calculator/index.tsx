import { Button, Card, TextInput } from "@mantine/core";
import Papa from "papaparse";
import { useRef, useState } from "react";
import {
  type CategoryDisplayData,
  type ItemResult,
  type TransactionResult,
} from "./interfaces";
import {
  groupItemsByCategory,
  transformCategoryNameAndItemsToCategoryDisplayData,
} from "./utils";
import { CbfSalesCategoryCard } from "./components/category-card";
import { CbfCalculatorInstructions } from "./components/form-instructions";

const CbfSalesCalculator: React.FunctionComponent = () => {
  const transactionsInputRef = useRef<HTMLInputElement>(null);
  const itemsInputRef = useRef<HTMLInputElement>(null);

  const [transactionsFileValidationError, setTransactionsFileValidationError] =
    useState<string>("");
  const [itemsFileValidationError, setItemsFileValidationError] =
    useState<string>("");
  const [calculatedCategories, setCalculatedCategories] = useState<
    CategoryDisplayData[]
  >([]);

  const handleFileUpload = () => {
    const transactionsReport = transactionsInputRef.current?.files?.[0];
    const itemsReport = itemsInputRef.current?.files?.[0];

    if (!transactionsReport) {
      setTransactionsFileValidationError("Transactions CSV is required");
      return;
    }

    if (!itemsReport) {
      setItemsFileValidationError("Items Detail CSV is required");
      return;
    }

    Papa.parse<File>(transactionsReport, {
      header: true,
      complete: (transactionsResult) => {
        const transactionsData =
          transactionsResult.data as unknown as TransactionResult[];

        if (!transactionsData[0].Fees) {
          setTransactionsFileValidationError(
            "Invalid columns. Did you upload the correct file?"
          );
          return;
        }

        Papa.parse<File>(itemsReport, {
          header: true,
          complete: (itemsResult) => {
            const itemsData: ItemResult[] =
              itemsResult.data as unknown as ItemResult[];

            if (!itemsData[0].SKU) {
              setItemsFileValidationError(
                "Invalid columns. Did you upload the correct file?"
              );
              return;
            }

            const itemsByCategory = itemsData.reduce(
              groupItemsByCategory(transactionsData),
              {}
            );

            const categoriesToDisplay = Object.keys(
              itemsByCategory
            ).map<CategoryDisplayData>(
              transformCategoryNameAndItemsToCategoryDisplayData(
                itemsByCategory
              )
            );

            setCalculatedCategories(categoriesToDisplay);
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
        <CbfCalculatorInstructions />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: "20px",
          }}
        >
          <TextInput
            label="Transactions CSV"
            multiple={false}
            ref={transactionsInputRef}
            type="file"
            accept=".csv"
            style={{ marginBottom: "10px" }}
            error={transactionsFileValidationError}
            onChange={() => setTransactionsFileValidationError("")}
          />
          <TextInput
            label="Items Detail CSV"
            multiple={false}
            ref={itemsInputRef}
            type="file"
            accept=".csv"
            style={{ marginBottom: "10px" }}
            error={itemsFileValidationError}
            onChange={() => setItemsFileValidationError("")}
          />
        </div>
        <Button
          style={{ marginTop: "12px", alignSelf: "flex-end" }}
          onClick={() => handleFileUpload()}
        >
          Calculate Sales Totals
        </Button>
      </Card>
      <div style={{ display: "flex", flexFlow: "row wrap", gap: "10px" }}>
        {calculatedCategories.map((category) => (
          <CbfSalesCategoryCard key={category.name} {...category} />
        ))}
      </div>
    </div>
  );
};

export { CbfSalesCalculator };
