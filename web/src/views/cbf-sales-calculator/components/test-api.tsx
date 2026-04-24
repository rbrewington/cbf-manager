import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// payment data: GET /v2/payments
//   - begin_date (iso date string)
//   - end_date (iso date string)
// orders data: POST /v2/orders/batch-retrieve
//   - all unique order ids in payments data
// item data: POST /v2/catalog/batch-retrieve
//   - all line item catalog ids
//   - include related objects
//   - include deleted objects
// categories: GET /v2/catalog/list?types=CATEGORY
// unsold items: POST /v2/inventory/counts/batch-retrieve
//   - updated_after (iso date string)
const TestApi: React.FunctionComponent = () => {
  useQuery({
    queryKey: ["payments"],
    queryFn: ({ signal }) => {
      return axios
        .get("/api/square/payments", {
          signal,
          params: {
            beginTime: new Date("04/11/2026 00:00").toISOString(),
            endTime: new Date("04/11/2026 23:59").toISOString(),
          },
        })
        .then((response) => {
          console.log(response);
        });
    },
  });
  // const orderIds = Array.from(
  //   new Set(paymentsData.payments.map((payment) => payment.order_id)),
  // );
  // console.log(orderIds.length, orderIds);
  return null;
};

export { TestApi };
