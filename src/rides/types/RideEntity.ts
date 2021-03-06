export interface NewRideEntity {
    startLat: number;
    startLong: number;
    endLat: number;
    endLong: number;
    riderName: string;
    driverName: string;
    driverVehicle: string;
}

export default interface RideEntity extends NewRideEntity {
    rideID: number;
    created: string;
}
