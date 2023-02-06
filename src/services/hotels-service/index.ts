import { notFoundError } from "@/errors"
import hotelRepository from "@/repositories/hotels-repository"


async function getAllHotels(userId: number) {

    verifyTicketAndEnrollment(userId)

    return await hotelRepository.getAllHotels()
}

async function getSpecifiedHotel(hotelId: number, userId: number) {

    verifyTicketAndEnrollment(userId)

    return await hotelRepository.getSpecifiedHotel(hotelId)
}


async function verifyTicketAndEnrollment(userId: number) {

    const enrollment = await hotelRepository.getEnrollmentByUserId(userId)
    
    const ticket = await hotelRepository.getTicketByEnrollmentId(enrollment.id)

    if (!ticket || !enrollment) throw notFoundError()

    
}

const hotelsService = {
    getAllHotels,
    getSpecifiedHotel
}

export default hotelsService