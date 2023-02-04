import { prisma } from "@/config"


async function getAllHotels() {
    return await prisma.hotel.findMany()
}

async function getSpecifiedHotel(hotelId: number) {
    return await prisma.hotel.findUnique({
        where: {id: hotelId}
    })
}

const hotelRepository = {
    getAllHotels,
    getSpecifiedHotel
}

export default hotelRepository