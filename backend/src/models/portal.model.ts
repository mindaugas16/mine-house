import { model, Schema, Document } from 'mongoose';

export interface PortalInterface extends Document {
  title: string;
  link: string;
  totalResults?: number;
  imagePath: string;
  active: boolean;
  name: string;
}

const schema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    unique: true,
  },
  imagePath: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default model<PortalInterface>('Portal', schema);
