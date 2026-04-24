import { MantineProvider, createTheme, useMantineTheme } from "@mantine/core";
import { CbfSalesCalculator } from "./views/cbf-sales-calculator";

import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const eglTheme = createTheme({
  colors: {
    pink: [
      "#ffeff8",
      "#ffeff8",
      "#f8cfe9",
      "#f8cfe9",
      "#f79fd1",
      "#f79fd1",
      "#f071c2",
      "#f071c2",
      "#6e4973",
      "#6e4973",
    ],
  },
  primaryColor: "pink",
});

const App: React.FunctionComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={eglTheme}>
        <AppContent />
      </MantineProvider>
    </QueryClientProvider>
  );
};

const AppContent: React.FunctionComponent = () => {
  const { colors } = useMantineTheme();
  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: colors.pink[0],
        padding: "40px",
      }}
    >
      <CbfSalesCalculator />
    </div>
  );
};

export default App;
