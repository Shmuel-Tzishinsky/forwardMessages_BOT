import { Schema, model } from 'mongoose';


interface ISession {
    id:number,
    name:string,
    session:string,
    dialogs:[],
    isBot:boolean
}


const sessionSchema = new Schema<ISession>({
    id:Number,
    name:String,
    session:String,
    dialogs:[],
    isBot:Boolean
});


export default model<ISession>('Session', sessionSchema);

