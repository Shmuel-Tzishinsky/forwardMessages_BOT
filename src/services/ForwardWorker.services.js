const ForwardWorker = require("../core/db/models/forwardWorker")


const getAndEditUser = async (query, newData) => {
    try {
        const user = await ForwardWorker.findOneAndUpdate(query, newData, {
            new: true,
            runValidators: true,
        });

        return user;
    } catch (err) {
        throw Error(err);
    }
};

const getSingleUserService = async (query) => {
    try {
        const user = await ForwardWorker.findOne(query);
        return user;
    } catch (err) {
        throw Error(err);
    }
};

module.exports =  { getSingleUserService, getAndEditUser };
