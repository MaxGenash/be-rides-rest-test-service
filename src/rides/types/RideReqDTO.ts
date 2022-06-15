export default interface RideReqDTO {
    start_lat: number | string;
    start_long: number | string;
    end_lat: number | string;
    end_long: number | string;
    rider_name: string;
    driver_name: string;
    driver_vehicle: string;
}
