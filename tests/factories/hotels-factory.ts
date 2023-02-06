import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.word.noun(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return await prisma.room.create({
    data: {
      name: faker.word.noun(),
      capacity: faker.datatype.number(5),
      hotelId,
    },
  });
}
