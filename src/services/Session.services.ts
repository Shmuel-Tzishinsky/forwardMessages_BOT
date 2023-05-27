import Session from "../core/db/models/session"

const getAndEditSession = async (query, newData) => {
    try {
        const session = await Session.findOneAndUpdate(query, newData, {
            new: true,
            runValidators: true,
        });

        return session;
    } catch (err:any) {
        throw Error(err);
    }
};

const getSingleSessionService = async (query) => {
    try {
        const session = await Session.findOne(query);
        return session;
    } catch (err:any) {
        throw Error(err);
    }
};

export { getSingleSessionService, getAndEditSession };
