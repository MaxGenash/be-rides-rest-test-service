const { getRandomNumber } = require('../../../src/common/utils');

function generateRideReqDTO(overrides) {
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

module.exports = {
    generateRideReqDTO,
};
