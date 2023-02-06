import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotels-repository';
import httpStatus from 'http-status';
import { PaymentRequiredError } from './errors';

async function getAllHotels(userId: number) {
  verifyTicketAndEnrollment(userId);

  return await hotelRepository.getAllHotels();
}

async function getRoomsBySpecifiedHotel(hotelId: number, userId: number) {
  verifyTicketAndEnrollment(userId);

  return await hotelRepository.getRoomsBySpecifiedHotel(hotelId);
}

async function verifyTicketAndEnrollment(userId: number) {
  const enrollment = await hotelRepository.getEnrollmentByUserId(userId);

  if (!enrollment) throw notFoundError()

  const ticket = await hotelRepository.getTicketByEnrollmentId(enrollment.id);

  if (!ticket) throw notFoundError();

  if (!ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status === 'RESERVED') {
    throw PaymentRequiredError();
  }
}

const hotelsService = {
  getAllHotels,
  getRoomsBySpecifiedHotel,
};

export default hotelsService;
