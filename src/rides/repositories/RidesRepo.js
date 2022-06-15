const { promisify } = require('util');

class RidesRepo {
    constructor(db) {
        this.db = db;
    }

    async clear() {
        return promisify(this.db.run.bind(this.db))(`DELETE FROM Rides`);
    }
}

module.exports = RidesRepo;
