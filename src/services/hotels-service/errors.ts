import { ApplicationError } from "@/protocols";

export function PaymentRequiredError(): ApplicationError {
  return {
    name: "paymentRequiredError",
    message: "Ticket has not been paid for, is remote, or does not include hotel.",
  };
}