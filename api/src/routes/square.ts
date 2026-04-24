import express, { type Request, type Response } from "express";
import {
  query,
  validationResult,
  type ValidationError,
} from "express-validator";
import {
  SquareClient,
  SquareEnvironment,
  type Order,
  type Payment,
} from "square";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const squareRouter = express.Router();

interface PaymentsResponse {
  payments: Payment[];
  orders: Order[];
}

squareRouter.get(
  "/payments",
  [
    query("beginTime")
      .isISO8601()
      .withMessage("Date must be a valid ISO 8601 format"),
    query("endTime")
      .isISO8601()
      .withMessage("Date must be a valid ISO 8601 format"),
  ],
  async (
    request: Request<
      {},
      PaymentsResponse,
      any,
      { beginTime: string; endTime: string }
    >,
    response: Response<PaymentsResponse | { errors: ValidationError[] }>,
  ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const client = new SquareClient({
      environment: SquareEnvironment.Production,
      token: process.env.SQUARE_ACCESS_TOKEN,
    });

    const {
      query: { beginTime, endTime },
    } = request;

    const firstPage = await client.payments.list({ beginTime, endTime });

    let paymentPages = [firstPage];
    let hasNextPage = firstPage.hasNextPage();
    let cursor = firstPage.response.cursor;

    while (hasNextPage && cursor) {
      const nextPage = await client.payments.list({
        cursor,
        beginTime,
        endTime,
      });
      paymentPages = [...paymentPages, nextPage];
      hasNextPage = nextPage.hasNextPage();
      cursor = nextPage.response.cursor;
    }

    const paymentsData = paymentPages.flatMap((page) => page.data);

    const orderIds = Array.from(
      new Set(paymentsData.map((payment) => payment.orderId)),
    ).filter(checkIsStringAndNotEmpty);

    const ordersData = await client.orders.batchGet({ orderIds });

    response.send({ payments: paymentsData, orders: ordersData.orders || [] });
  },
);

const checkIsStringAndNotEmpty = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};

export { squareRouter };
