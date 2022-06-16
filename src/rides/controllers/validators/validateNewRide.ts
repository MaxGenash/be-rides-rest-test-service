import { NewRideEntity } from '../../types/RideEntity';

export const validationErrors = {
    // TODO (Future): make error messages INVALID_START_COORDINATE and INVALID_END_COORDINATE more clear
    INVALID_START_COORDINATE:
        'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
    INVALID_END_COORDINATE:
        'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
    INVALID_RIDER_NAME: 'Rider name must be a non empty string',
    INVALID_DRIVER_NAME: 'Driver name must be a non empty string',
    INVALID_DRIVER_VEHICLE: 'Driver vehicle must be a non empty string',
};

export default function validateNewRide(rideEntity: NewRideEntity): string | undefined {
    const { startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle } =
        rideEntity;

    if (startLat < -90 || startLat > 90 || startLong < -180 || startLong > 180) {
        return validationErrors.INVALID_START_COORDINATE;
    }

    if (endLat < -90 || endLat > 90 || endLong < -180 || endLong > 180) {
        return validationErrors.INVALID_END_COORDINATE;
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
        return validationErrors.INVALID_RIDER_NAME;
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
        return validationErrors.INVALID_DRIVER_NAME;
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
        return validationErrors.INVALID_DRIVER_VEHICLE;
    }

    return undefined;
}
