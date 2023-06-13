const Session = require("../core/db/models/session");

const { getSingleSessionService, getAndEditSession, deleteSessionService } = require("../services/Session.services");

const setSingleSession = async (userAttrib) => {
    try {
        //   Checking if the user is already in the db
        const uniqueNameExist = await Session.findOne({
            id: userAttrib.id,
        });

        if (uniqueNameExist) {
            throw "The session already exists";
        }

        // Create a new user
        const session = new Session(userAttrib);

        await session.save();

        console.log("Sessions save !");

        return true;
    } catch (err) {
        return err.message;
    }
};

const getSingleSession = async (id) => {
    try {
        const Session = await getSingleSessionService({ id: id });
        return Session;
    } catch (err) {
        return err.message;
    }
};

const deleteSessionAction = async (id) => {
    console.log("🚀 ~ file: sessionController.js:39 ~ deleteSessionAction ~ id:", id);
    try {
        const session = await deleteSessionService({ id: id });
        return session;
    } catch (err) {
        return err.message;
    }
};

module.exports = { setSingleSession, getSingleSession, deleteSessionAction };
