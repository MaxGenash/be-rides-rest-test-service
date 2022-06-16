/* eslint-disable import/prefer-default-export */
import { getRandomNumber } from '../../../common/utils';
import RideReqDTO from '../../../rides/types/RideReqDTO';
import { NewRideEntity } from '../../../rides/types/RideEntity';

export function generateRideReqDTO(overrides?: Partial<RideReqDTO>): RideReqDTO {
    return {
        start_lat: getRandomNumber(-90, 90),
        start_long: getRandomNumber(-180, 180),
        end_lat: getRandomNumber(-90, 90),
        end_long: getRandomNumber(-180, 180),
        rider_name: `rider name ${Math.random()}`,
        driver_name: `driver name ${Math.random()}`,
        driver_vehicle: `driver vehicle ${Math.random()}`,
        ...overrides,
    };
}

export function generateNewRideEntity(overrides?: Partial<NewRideEntity>): NewRideEntity {
    return {
        startLat: getRandomNumber(-90, 90),
        startLong: getRandomNumber(-180, 180),
        endLat: getRandomNumber(-90, 90),
        endLong: getRandomNumber(-180, 180),
        riderName: `rider name ${Math.random()}`,
        driverName: `driver name ${Math.random()}`,
        driverVehicle: `driver vehicle ${Math.random()}`,
        ...overrides,
    };
}
