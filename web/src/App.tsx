import { MantineProvider, useMantineTheme } from "@mantine/core";
import { CbfSalesCalculator } from "./views/cbf-sales-calculator";

import "@mantine/core/styles.css";

const App: React.FunctionComponent = () => {
  return (
    <MantineProvider>
      <AppContent />
    </MantineProvider>
  );
};

const AppContent: React.FunctionComponent = () => {
  const { colors } = useMantineTheme();
  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: colors.gray[1],
        padding: "40px",
      }}
    >
      <CbfSalesCalculator />
    </div>
  );
};

export default App;
