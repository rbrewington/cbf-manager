import { Button, Card, Collapse, Table, useMantineTheme } from "@mantine/core";
import type { CategoryDisplayData, ItemDisplayData } from "../interfaces";
import { useState } from "react";

interface Props {
  categoriesToDisplay: CategoryDisplayData[];
}
const CbfCalculatorSoldItemsTable: React.FunctionComponent<Props> = ({
  categoriesToDisplay,
}) => {
  return (
    <Card style={{ padding: "0px" }}>
      {categoriesToDisplay.map((category) => (
        <CategoryTable {...category} />
      ))}
    </Card>
  );
};

const CategoryTable: React.FunctionComponent<CategoryDisplayData> = ({
  cardItems,
  cashItems,
  name,
}) => {
  const {
    colors: { gray, pink },
  } = useMantineTheme();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <>
      <h2
        style={{
          margin: "0px",
          padding: "6px",
          backgroundColor: pink[3],
          borderBottom: `1px solid ${pink[7]}`,
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {name}
        <Button onClick={() => setIsExpanded((current) => !current)} size="xs">
          Toggle Collapse
        </Button>
      </h2>
      <Collapse
        expanded={isExpanded}
        style={{ borderBottom: `1px solid ${gray[3]}` }}
      >
        <TableSectionHeader shouldShowTopBorder={false}>
          Cash Items
        </TableSectionHeader>
        <ItemsTable items={cashItems} />
        <TableSectionHeader shouldShowTopBorder={true}>
          Card Items
        </TableSectionHeader>
        <ItemsTable items={cardItems} />
      </Collapse>
    </>
  );
};

const TableSectionHeader: React.FunctionComponent<
  React.PropsWithChildren<{ shouldShowTopBorder: boolean }>
> = ({ children, shouldShowTopBorder }) => {
  const {
    colors: { pink },
  } = useMantineTheme();
  return (
    <h4
      style={{
        borderBottom: `1px solid ${pink[7]}`,
        borderTop: shouldShowTopBorder ? `1px solid ${pink[7]}` : undefined,
        margin: "0px",
        padding: "8px",
        color: pink[6],
      }}
    >
      {children}
    </h4>
  );
};

interface ItemsTableProps {
  items: ItemDisplayData[];
}
const ItemsTable: React.FunctionComponent<ItemsTableProps> = ({ items }) => {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: "150px" }}>SKU</Table.Th>
          <Table.Th>Item Description</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((item) => (
          <Table.Tr>
            <Table.Td>{item.sku}</Table.Td>
            <Table.Td>{item.description}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export { CbfCalculatorSoldItemsTable };
