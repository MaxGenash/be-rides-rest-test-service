export interface NewRideRecord {
    startLat: number;
    startLong: number;
    endLat: number;
    endLong: number;
    riderName: string;
    driverName: string;
    driverVehicle: string;
}

export default interface RideRecord extends NewRideRecord {
    rideID: number;
    created: string;
}
