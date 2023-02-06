import { prisma } from "@/config";

async function getAllHotels() {
  return await prisma.hotel.findMany({
    include: { Rooms: true },
  });
}

async function getRoomsBySpecifiedHotel(hotelId: number) {
  return await prisma.room.findMany({
    where: { hotelId },
  });
}

async function getEnrollmentByUserId(userId: number) {
  return await prisma.enrollment.findUnique({
    where: { userId },
  });
}

async function getTicketByEnrollmentId(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

const hotelRepository = {
  getAllHotels,
  getRoomsBySpecifiedHotel,
  getEnrollmentByUserId,
  getTicketByEnrollmentId,
};

export default hotelRepository;
