import { ApplicationError } from "@/protocols";

export function PaymentRequiredError(): ApplicationError {
  return {
    name: "PaymentRequiredError",
    message: "Ticket has not been paid for, is remote, or does not include hotel.",
  };
}
