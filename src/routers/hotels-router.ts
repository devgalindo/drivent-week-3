import { getAllHotels, getSpecifiedHotel } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";


const hotelsRouter = Router()

hotelsRouter
    .all("/*", authenticateToken)
    .get("/", getAllHotels)
    .get("/hotelId", getSpecifiedHotel)

export { hotelsRouter }