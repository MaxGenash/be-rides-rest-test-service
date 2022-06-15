export default interface EntityToResDTOMapper<Entity, ResDTO> {
    mapEntityToResDTO(entity: Entity): ResDTO;
}
