const CbfCalculatorInstructions: React.FunctionComponent = () => {
  return (
    <>
      <p style={{ margin: "0px" }}>To get reports:</p>
      <ul>
        <li>Go to 'Payments and Invoices'</li>
        <li>Click 'Transactions</li>
        <li>In the top right, click 'Export'</li>
        <li>
          From the menu, click 'Generate' next to 'Transactions CSV' and 'Items
          Detail CSV'
        </li>
      </ul>
    </>
  );
};

export { CbfCalculatorInstructions };
