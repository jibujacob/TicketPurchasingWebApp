import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import {OrderStatus} from "@jjtickets2021/common";
import {TicketDoc} from "./ticket"


interface OrderAtrrs{
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket : TicketDoc;

}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs:OrderAtrrs) : OrderDoc;
}

interface OrderDoc extends mongoose.Document{
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket : TicketDoc;
    version: number;
}


const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
    },
    expiresAt:{
        type: mongoose.Schema.Types.Date
    },
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set("versionKey","version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs : OrderAtrrs)=>{
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc,OrderModel>("Order",orderSchema);

export {Order,OrderStatus};