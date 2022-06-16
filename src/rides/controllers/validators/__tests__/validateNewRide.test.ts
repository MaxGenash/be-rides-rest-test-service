import validateNewRide, { validationErrors } from '../validateNewRide';
import { generateNewRideEntity } from '../../../../__tests__/helpers/factories/rides';

describe('validateNewRide unit tests', () => {
    describe('Start coordinates', () => {
        it('should return an error when startLat is lower than -90', () => {
            const res = validateNewRide({ ...generateNewRideEntity(), startLat: -91 });

            expect(res).toBe(validationErrors.INVALID_START_COORDINATE);
        });

        it('should return an error when startLat is grater than 90', () => {
            const res = validateNewRide({ ...generateNewRideEntity(), startLat: 91 });

            expect(res).toBe(validationErrors.INVALID_START_COORDINATE);
        });

        it('should return an error when startLong is lower than -180', () => {
            const res = validateNewRide({ ...generateNewRideEntity(), startLong: -181 });

            expect(res).toBe(validationErrors.INVALID_START_COORDINATE);
        });

        it('should return an error when startLong is grater than 180', () => {
            const res = validateNewRide({ ...generateNewRideEntity(), startLong: 181 });

            expect(res).toBe(validationErrors.INVALID_START_COORDINATE);
        });
    });

    describe('End coordinates', () => {
        it('should return an error when endLat is lower than -90', () => {
            const res = validateNewRide({ ...generateNewRideEntity(), endLat: -91 });

            expect(res).toBe(validationErrors.INVALID_END_COORDINATE);
        });

        it('should return an error when endLat is grater than 90', () => {
            const res = validateNewRide({ ...generateNewRideEntity(), endLat: 91 });

            expect(res).toBe(validationErrors.INVALID_END_COORDINATE);
        });

        it('should return an error when endLong is lower than -180', () => {
            const res = validateNewRide({ ...generateNewRideEntity(), endLong: -181 });

            expect(res).toBe(validationErrors.INVALID_END_COORDINATE);
        });

        it('should return an error when endLong is grater than 180', () => {
            const res = validateNewRide({ ...generateNewRideEntity(), endLong: 181 });

            expect(res).toBe(validationErrors.INVALID_END_COORDINATE);
        });
    });

    it('should NOT return an error when the coordinates are equal to the top limit', () => {
        const res = validateNewRide({
            ...generateNewRideEntity(),
            startLat: 90,
            endLat: 90,
            startLong: 180,
            endLong: 180,
        });

        expect(res).toBeUndefined();
    });

    it('should NOT return an error when the coordinates are equal to the bottom limit', () => {
        const res = validateNewRide({
            ...generateNewRideEntity(),
            startLat: -90,
            endLat: -90,
            startLong: -180,
            endLong: -180,
        });

        expect(res).toBeUndefined();
    });

    describe('riderName', () => {
        it('should return an error when riderName is not a string', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = validateNewRide({ ...generateNewRideEntity(), riderName: 7 as any });

            expect(res).toBe(validationErrors.INVALID_RIDER_NAME);
        });

        it('should return an error when riderName length is lower than 1', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = validateNewRide({ ...generateNewRideEntity(), riderName: '' });

            expect(res).toBe(validationErrors.INVALID_RIDER_NAME);
        });
    });

    describe('driverName', () => {
        it('should return an error when driverName is not a string', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = validateNewRide({ ...generateNewRideEntity(), driverName: {} as any });

            expect(res).toBe(validationErrors.INVALID_DRIVER_NAME);
        });

        it('should return an error when driverName length is lower than 1', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = validateNewRide({ ...generateNewRideEntity(), driverName: '' });

            expect(res).toBe(validationErrors.INVALID_DRIVER_NAME);
        });
    });

    describe('driverVehicle', () => {
        it('should return an error when driverVehicle is not a string', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = validateNewRide({ ...generateNewRideEntity(), driverVehicle: true as any });

            expect(res).toBe(validationErrors.INVALID_DRIVER_VEHICLE);
        });

        it('should return an error when driverVehicle length is lower than 1', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = validateNewRide({ ...generateNewRideEntity(), driverVehicle: '' });

            expect(res).toBe(validationErrors.INVALID_DRIVER_VEHICLE);
        });
    });

    it('should NOT return an error when the data is correct', () => {
        const res = validateNewRide(generateNewRideEntity());

        expect(res).toBeUndefined();
    });
});
