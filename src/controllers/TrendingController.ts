import { Request, Response } from "express";
import BaseController from "./BaseController";
import AxiosInstance from "../config/axios";

class TrendingController extends BaseController {
  getTrendings = async (req: Request, res: Response): Promise<Response> => {
    const { type, time } = req.params;
    const language = req.query.language || "en-US";
    const page = req.query.page || 1;
    try {
      const trendings = await AxiosInstance.get(
        `trending/${type}/${time}?language=${language}&page=${page}`
      );
      
      const results = trendings.data.results.map((trending: any) => {
        return {
          id: trending.id,
          title: trending.title ? trending.title : trending.name,
          poster: `https://image.tmdb.org/t/p/w780${trending.poster_path}`,
          media_type: trending.media_type,
          adult: trending.adult,
        };
      });

      const response = {
        page: trendings.data.page,
        total_pages: trendings.data.total_pages,
        results,
      };
      return this.successRes(res, 201, "Success getting data", response);
    } catch (error) {
      return this.errorRes(res, 500, "Internal server error", error);
    }
  };
}

export default new TrendingController();
