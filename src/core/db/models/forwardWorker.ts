import { Schema, model } from 'mongoose';


interface ISession {
    from: [],
    to: [],
    id: number,
    name: string,
    worker:string
}


const ForwardSchema = new Schema<ISession>({
    from: [],
    to: [],
    id: Number,
    name: String,
    worker:String
});


export default  model<ISession>('Forward', ForwardSchema);
