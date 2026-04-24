import { Button, Card, Tabs, TextInput } from "@mantine/core";
import Papa from "papaparse";
import { useRef, useState } from "react";
import { FlexColumnNoWrap, FlexRowNoWrap } from "../../components/flex";
import { CbfCalculatorInstructions } from "./components/form-instructions";
import { CbfCalculatorSalesTotalsByCategory } from "./components/sales-totals";
import { CbfCalculatorSoldItemsTable } from "./components/sold-items-table";
import {
  SalesDataTabs,
  type CategoryDisplayData,
  type ItemResult,
  type TransactionResult,
} from "./interfaces";
import {
  groupItemsByCategory,
  transformCategoryNameAndItemsToCategoryDisplayData,
} from "./utils";
import { TestApi } from "./components/test-api";

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
            "Invalid columns. Did you upload the correct file?",
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
                "Invalid columns. Did you upload the correct file?",
              );
              return;
            }

            const itemsByCategory = itemsData.reduce(
              groupItemsByCategory(transactionsData),
              {},
            );

            const categoriesToDisplay = Object.keys(
              itemsByCategory,
            ).map<CategoryDisplayData>(
              transformCategoryNameAndItemsToCategoryDisplayData(
                itemsByCategory,
              ),
            );

            setCalculatedCategories(categoriesToDisplay);
          },
        });
      },
    });
  };

  return (
    <FlexColumnNoWrap style={{ alignItems: "stretch", gap: "20px" }}>
      <Card style={{ alignItems: "flex-start" }}>
        <FlexRowNoWrap style={{ gap: "50px" }}>
          <FlexColumnNoWrap>
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
            <Button
              style={{ marginTop: "12px", alignSelf: "flex-start" }}
              onClick={() => handleFileUpload()}
            >
              Calculate Sales Totals
            </Button>
          </FlexColumnNoWrap>
          <CbfCalculatorInstructions />
        </FlexRowNoWrap>
      </Card>
      <TestApi />
      {calculatedCategories.length ? (
        <Tabs defaultValue={SalesDataTabs.salesData}>
          <Tabs.List style={{ marginBottom: "20px" }}>
            <Tabs.Tab value={SalesDataTabs.salesData}>Sales Data</Tabs.Tab>
            <Tabs.Tab value={SalesDataTabs.soldItems}>Sold Items</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value={SalesDataTabs.salesData}>
            <CbfCalculatorSalesTotalsByCategory
              categoriesToDisplay={calculatedCategories}
            />
          </Tabs.Panel>
          <Tabs.Panel value={SalesDataTabs.soldItems}>
            <CbfCalculatorSoldItemsTable
              categoriesToDisplay={calculatedCategories}
            />
          </Tabs.Panel>
        </Tabs>
      ) : null}
    </FlexColumnNoWrap>
  );
};

export { CbfSalesCalculator };
