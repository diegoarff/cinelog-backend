import { Request, Response } from "express";
import BaseController from "./BaseController";
import { Media, Review } from "../models";
import AxiosInstance from "../config/axios";
import { AuthRequest, IReviewDocument } from "../interfaces";

const calculateScore = async (MediaID: string) => {
  const reviews: any[] = await Review.find({ MediaID: MediaID }).populate(
    "userId"
  );
  let criticReviewCount = 0;
  let userReviewCount = 0;
  let totalReviewCount = 0;
  let sumCritic = 0;
  let sumUser = 0;
  let sumTotal = 0;

  if (reviews.length === 0) {
    return {
      criticReviewCount,
      userReviewCount,
      totalReviewCount,
      criticScoreAvg: 0,
      userScoreAvg: 0,
      totalScoreAvg: 0,
    };
  }

  for (const review of reviews) {
    if (review.userId.critic == true) {
      criticReviewCount++;
      sumCritic += review.score;
    } else {
      userReviewCount++;
      sumUser += review.score;
    }
    totalReviewCount++;
    sumTotal += review.score;
  }

  const criticScoreAvg = (sumCritic / criticReviewCount).toFixed(1);
  const userScoreAvg = (sumUser / userReviewCount).toFixed(1);
  const totalScoreAvg = (sumTotal / totalReviewCount).toFixed(1);

  return {
    criticReviewCount,
    userReviewCount,
    totalReviewCount,
    criticScoreAvg: criticScoreAvg === "NaN" ? 0 : criticScoreAvg,
    userScoreAvg: userScoreAvg === "NaN" ? 0 : userScoreAvg,
    totalScoreAvg: totalScoreAvg === "NaN" ? 0 : totalScoreAvg,
  };
};

class MediaController extends BaseController {
  getMedia = async (req: Request, res: Response): Promise<Response> => {
    const { mediaType, id } = req.params;
    try {
      const media = await Media.findOne({ MediaID: id });
      if (media == null) {
        const media2 = await AxiosInstance.get(
          `${mediaType}/${id}?append_to_response=similar%2Cvideos%2Ccredits%2Crelease_dates`
        );
        const mediaData = media2.data;
        let videos = mediaData.videos.results;
        if (videos.length === 0) {
          videos = null;
        }
        let cast = null;
        if (mediaData.credits.cast || mediaData.credits.cast.length > 0) {
          cast = mediaData.credits.cast.map((person: any) => ({
            id: person.id || null,
            name: person.name || null,
            character: person.character || null,
            profile: `https://image.tmdb.org/t/p/w780${person.profile_path}`,
          }));
        }
        let similar = null;

        if (mediaData.similar.results || mediaData.similar.results.length > 0) {
          similar = mediaData.similar.results.map((media: any) => ({
            id: media.id || null,
            title: media.title || media.name || null,
            poster: `https://image.tmdb.org/t/p/w780${media.poster_path}`,

            media_type: mediaType,
            adult: media.adult || null,
          }));
        }
        const newmedia = new Media({
          MediaID: id,
          title: mediaData.title || mediaData.name || null,
          original_title:
            mediaData.original_title || mediaData.original_name || null,
          original_language: mediaData.original_language || null,
          overview: mediaData.overview || null,
          poster: `https://image.tmdb.org/t/p/w780${mediaData.poster_path}`,

          backdrop: `https://image.tmdb.org/t/p/w780${mediaData.backdrop_path}`,
          videos: videos,
          year: mediaData.release_date
            ? mediaData.release_date.split("-")[0]
            : mediaData.first_air_date
            ? mediaData.first_air_date.split("-")[0]
            : null,
          genres: mediaData.genres || null,
          cast: cast ? cast.slice(0, 10) : null,
          similar: similar,
          mediaType: mediaType,
          seasons: mediaData.seasons || null,
        });
        await newmedia.save();
        const response = {
          ...newmedia.toObject(),
          ...(await calculateScore(newmedia._id)),
        };

        return this.successRes(res, 200, "media found", response);
      }

      const response = {
        ...media.toObject(),
        ...(await calculateScore(media._id)),
      };
      return this.successRes(res, 200, "media found", response);
    } catch (error) {
      return this.errorRes(res, 500, "Error getting media", error);
    }
  };
}

export default new MediaController();
