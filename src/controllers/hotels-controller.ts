import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const hotels = await hotelsService.getAllHotels(userId);
    if (!hotels) return res.sendStatus(httpStatus.NOT_FOUND);

    res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if ((error.name = 'paymentRequiredError')) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if ((error.name = 'notFoundError')) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getRoomsBySpecifiedHotel(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const hotelId = parseInt(req.params.hotelId);
    if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST);

    const rooms = await hotelsService.getRoomsBySpecifiedHotel(hotelId, userId);
    if (!rooms) return res.sendStatus(httpStatus.NOT_FOUND);

    res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if ((error.name = 'paymentRequiredError')) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if ((error.name = 'notFoundError')) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
