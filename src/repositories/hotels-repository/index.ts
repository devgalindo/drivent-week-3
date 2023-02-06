import { prisma } from "@/config"


async function getAllHotels() {
    return await prisma.hotel.findMany()
}

async function getSpecifiedHotel(hotelId: number) {
    return await prisma.hotel.findUnique({
        where: {id: hotelId}
    })
}

async function getEnrollmentByUserId(userId: number) {
    return await prisma.enrollment.findUnique({
        where: {userId}
    })
}

async function getTicketByEnrollmentId(enrollmentId: number) {
    return await prisma.ticket.findUnique({
        where: {id: enrollmentId},
    })
}

const hotelRepository = {
    getAllHotels,
    getSpecifiedHotel,
    getEnrollmentByUserId,
    getTicketByEnrollmentId
}

export default hotelRepository