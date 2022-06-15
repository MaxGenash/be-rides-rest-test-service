export default interface ReqDTOToEntityMapper<ReqDTO, Entity> {
    mapReqDTOToEntity(dto: ReqDTO): Entity;
}
