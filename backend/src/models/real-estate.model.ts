import { Document, model, Schema } from 'mongoose';

export enum RealEstateProvider {
  ARUODAS,
  DOMOPLIUS,
  SKELBIU,
  KAMPAS,
}

export interface RealEstateInterface extends Document {
  title: string;
  link: string;
  price: number;
  area: number;
  buildingStatus: number;
  priceChange: number;
  priceChangePercentage: number;
  new: boolean;
  provider: RealEstateProvider;
  lastSeenAt: number;
  lastPriceChanges: {
    priceChangeFrom: number;
    priceChangeTo: number;
    changedAt: Date;
  }[];
}

const realEstateSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
  },
  buildingStatus: {
    type: String,
  },
  priceChange: {
    type: Number,
  },
  priceChangePercentage: {
    type: Number,
  },
  new: {
    type: Boolean,
  },
  provider: {
    type: Number,
  },
  lastSeenAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
  lastPriceChanges: {
    type: Array,
    default: [],
  },
});

export default model<RealEstateInterface>('RealEstate', realEstateSchema);
