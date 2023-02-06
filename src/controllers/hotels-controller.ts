import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req

        const hotels = await hotelsService.getAllHotels(userId)
        if (!hotels) return res.sendStatus(httpStatus.NOT_FOUND)

        res.status(httpStatus.OK).send(hotels)

    } catch (error) {
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function getSpecifiedHotel(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req

        const hotelId = parseInt(req.params.hotelId)
        if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST)

        const hotel = await hotelsService.getSpecifiedHotel(hotelId, userId)
        if (!hotel) return res.sendStatus(httpStatus.NOT_FOUND)

        res.status(httpStatus.OK).send(hotel)


    } catch (error) {
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}