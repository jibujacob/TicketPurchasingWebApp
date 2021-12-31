import mongoose from "mongoose";
import {Order,OrderStatus} from "./order";

interface TicketAttrs{
    id:string;
    title:string;
    price:number;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs:TicketAttrs) : TicketDoc;
}

export interface TicketDoc extends mongoose.Document{
    title:string;
    price:number;
    isReserved():Promise<boolean>;
}

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

ticketSchema.statics.build = (attrs : TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title:attrs.title,
        price:attrs.price
    });
}

ticketSchema.methods.isReserved = async function(){
    const existingOrder = await Order.findOne({
        ticket:this,
        status:{
            $in : [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });
   
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>("Ticket",ticketSchema);

export {Ticket}