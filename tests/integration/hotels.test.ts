import supertest from 'supertest';
import app, { init } from '@/app';
import { cleanDb } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, createTicket, createTicketType, createTicketTypeDoesNotIncludeHotel, createTicketTypeIsRemote, createTicketTypePerfect, createUser } from '../factories';
import { generateValidToken } from '../helpers';
import { TicketStatus } from '@prisma/client';
import { createHotel, createRoom } from '../factories/hotels-factory';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels/", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get('/hotels/');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("when token is valid", () => {
    it("should respond with status 404 if user doesn't have a enrollment", async () => {
        const token = await generateValidToken();

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it ("should respond with status 404 if user doesn't have a ticket", async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user)

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it ("should respond with status 402 if user's ticket doesn't include hotel", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeDoesNotIncludeHotel()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it ("should respond with status 402 if user's ticket is Remote", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeIsRemote()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it ("should respond with status 402 if ticket status is not PAID", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypePerfect()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    })

    it ("should responde with status 404 if there are no hotels", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypePerfect()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    })

    it ("should responde with status 200 if there are valid hotels", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypePerfect()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const hotel1 = await createHotel()
        await createHotel()
        await createRoom(hotel1.id)
        await createRoom(hotel1.id)

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toHaveLength(2)
    })
        
  });
});

describe('GET /hotels/id', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe("when token is valid", () => {

    it("should respond with status 404 if user doesn't have a enrollment", async () => {
        const token = await generateValidToken();

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it ("should respond with status 404 if user doesn't have a ticket", async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user)

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it ("should respond with status 402 if user's ticket doesn't include hotel", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeDoesNotIncludeHotel()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it ("should respond with status 402 if user's ticket is remote", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeIsRemote()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it ("should respond with status 402 if ticket status is not PAID", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypePerfect()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED)

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    })

    it ("should respond with status 404 if there are no hotels", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypePerfect()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    })
    
    it ("should respond with status 404 if hotelId is not a valid Id", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypePerfect()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const hotel1 = await createHotel()
        await createHotel()
        await createRoom(hotel1.id)
        await createRoom(hotel1.id)

        const response = await server.get("/hotels/290148").set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.NOT_FOUND)
    })

    it("should respond with status 200 if hotelId is a valid Id", async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypePerfect()
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const hotel1 = await createHotel()
        await createHotel()
        await createRoom(hotel1.id)
        await createRoom(hotel1.id)

        const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
        expect(response.status).toEqual(httpStatus.OK)
        expect(response.body).toHaveLength(2)
    })
  });
});
