import hotelsService from "@/services/hotels-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getAllHotels(req: Request, res: Response) {
    try {

        const hotels = await hotelsService.getAllHotels()

        if (!hotels) return res.sendStatus(httpStatus.NOT_FOUND)

    } catch (error) {
        
    }
}

export async function getSpecifiedHotel(req: Request, res: Response) {
    try {
        const hotelId = parseInt(req.params.hotelId)

        if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST)

        const hotel = await hotelsService.getSpecifiedHotel(hotelId)

        if (!hotel) return res.sendStatus(httpStatus.NOT_FOUND)


    } catch (error) {
        
    }
}