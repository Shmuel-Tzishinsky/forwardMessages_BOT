
import Session from '../core/db/models/session';

import {
  getSingleSessionService,
  getAndEditSession
} from '../services/Session.services'

const setSingleSession = async (userAttrib: any) => {
  try {
      //   Checking if the user is already in the db
      const uniqueNameExist = await Session.findOne({
          id: userAttrib.id,
      });

      if (uniqueNameExist) {
        throw  "The session already exists" 
      }

      // Create a new user
      const session = new Session(userAttrib);

      await session.save();
    
    console.log("Sessions save !");

    return true

  } catch (err:any) {
    return err.message
  }
};

const getSingleSession = async (id: number) => {
  try {
    const Session = await getSingleSessionService({ id: id });
    return Session
  } catch (err:any) {
    return err.message
  }
};


const deleteSessionAction = async (id: number) => {
  try {
    const session = await getSingleSessionService({ id: id });
    // await session.remove();
    return true
  } catch (err:any) {
    return err.message
  }
};


export  {
  setSingleSession,
  getSingleSession,
  deleteSessionAction
};
