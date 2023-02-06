import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotels-repository";
import { PaymentRequiredError } from "./errors";

async function getAllHotels(userId: number) {
  await verifyTicketAndEnrollment(userId);

  return await hotelRepository.getAllHotels();
}

async function getRoomsBySpecifiedHotel(hotelId: number, userId: number) {
  await verifyTicketAndEnrollment(userId);

  return await hotelRepository.getRoomsBySpecifiedHotel(hotelId);
}

async function verifyTicketAndEnrollment(userId: number) {
  const enrollment = await hotelRepository.getEnrollmentByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await hotelRepository.getTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.TicketType.isRemote) {
    throw PaymentRequiredError();
  }

  if (!ticket.TicketType.includesHotel) {
    throw PaymentRequiredError();
  }

  if (ticket.status === "RESERVED") {
    throw PaymentRequiredError();
  }
}

const hotelsService = {
  getAllHotels,
  getRoomsBySpecifiedHotel,
};

export default hotelsService;
