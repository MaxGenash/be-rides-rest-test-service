import EntityToResDTOMapper from '../../common/mappers/EntityToResDTOMapper';
import RideEntity from '../types/RideEntity';
import RideResDTO from '../types/RideResDTO';
import RideReqDTO from '../types/RideReqDTO';
import ReqDTOToEntityMapper from '../../common/mappers/ReqDTOToEntityMapper';

export default class RidesMapper
    implements
        EntityToResDTOMapper<RideEntity, RideResDTO>,
        ReqDTOToEntityMapper<RideReqDTO, RideEntity>
{
    mapReqDTOToEntity(dto: RideReqDTO): RideEntity {
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

    mapEntityToResDTO(entity: RideEntity): RideResDTO {
        return { ...entity };
    }
}
