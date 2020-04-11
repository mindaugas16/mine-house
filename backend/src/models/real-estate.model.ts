import { Document, model, Schema } from 'mongoose';
import { PortalInterface } from './portal.model';

export interface RealEstateInterface extends Document {
  title: string;
  link: string;
  price: number;
  area: number;
  buildingStatus: number;
  priceChange: number;
  priceChangePercentage: number;
  new: boolean;
  portal: PortalInterface;
  lastSeenAt: number;
  lastPriceChanges: {
    priceChangeFrom: number;
    priceChangeTo: number;
    changedAt: Date;
  }[];
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
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
  starred: {
    type: Boolean,
    default: false,
  },
  portal: {
    type: Schema.Types.ObjectId,
    ref: 'Portal',
    required: true,
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
  imagePath: {
    type: String,
    unique: true,
    sparse: true,
  },
});

export default model<RealEstateInterface>('RealEstate', realEstateSchema);
