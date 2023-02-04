import hotelRepository from "@/repositories/hotels-repository"


async function getAllHotels() {
    return await hotelRepository.getAllHotels()
}

async function getSpecifiedHotel(hotelId: number) {
    return await hotelRepository.getSpecifiedHotel(hotelId)
}

const hotelsService = {
    getAllHotels,
    getSpecifiedHotel
}

export default hotelsService