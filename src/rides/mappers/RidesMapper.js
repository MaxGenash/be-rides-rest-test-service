module.exports = class RidesMapper {
    mapReqDTOToEntity(dto) {
        return {
            startLat: Number(dto.start_lat),
            startLong: Number(dto.start_long),
            endLat: Number(dto.end_lat),
            endLong: Number(dto.end_long),
            riderName: dto.rider_name,
            driverName: dto.driver_name,
            driverVehicle: dto.driver_vehicle,
        };
    }

    mapEntityToResDTO(entity) {
        return { ...entity };
    }
};
