import { Document } from "mongoose";

export interface IMedia {
  MediaID: number | null;
  title: string | null;
  original_title: string | null;
  original_language: string | null;
  overview: string | null;
  poster: string | null;
  backdrop: string | null;
  videos: string | null;
  year: number | null;
  criticReviewCount: number | null;
  userReviewCount: number | null;
  criticScoreAvg: number | null;
  userScoreAvg: number | null;
  genres: Object[] | null;
  cast: Object[] | null;
  similar: Object[] | null;
  mediaType: string | null;
  seasons: Object[] | null;
}

export interface IMediaDocument extends IMedia, Document {}
