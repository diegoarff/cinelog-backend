import { Schema, model } from "mongoose";
import { IMediaDocument } from "../interfaces";

const MediaSchema = new Schema<IMediaDocument>(
  {
    MediaID: { type: Number, default: null },
    title: { type: String, default: null },
    original_title: { type: String, default: null },
    original_language: { type: String, default: null },
    overview: { type: String, default: null },
    poster: { type: String, default: null },
    backdrop: { type: String, default: null },
    videos: { type: [Object], default: null },
    year: { type: Number, default: null },
    genres: { type: [Object], default: null },
    cast: { type: [Object], default: null },
    similar: { type: [Object], default: null },
    mediaType: { type: String, default: null },
    seasons: { type: [Object], default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IMediaDocument>("Media", MediaSchema);
