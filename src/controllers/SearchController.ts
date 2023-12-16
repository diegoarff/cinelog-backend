import { Request, Response } from "express";
import BaseController from "./BaseController";
import AxiosInstance from "../config/axios";

class SearchController extends BaseController {
  searchByText = async (req: Request, res: Response): Promise<Response> => {
    const { query } = req.query;
    const includeAdult = req.query.include_adult || false;
    const page = req.query.page || 1;
    try {
      const search = await AxiosInstance.get(
        `search/multi?query=${query}&include_adult=${includeAdult}&page=${page}`
      );

      const results = search.data.results
        .filter((result: any) => result.media_type !== "person")
        .map((result: any) => ({
          id: result.id,
          title: result.title || result.name,
          poster: `https://image.tmdb.org/t/p/w780${result.poster_path}`,
          media_type: result.media_type,
          adult: result.adult,
        }));

      const response = {
        page: search.data.page,
        total_pages: search.data.total_pages,
        results,
      };

      return this.successRes(res, 201, "Success getting data", response);
    } catch (error) {
      return this.errorRes(res, 500, "Internal server error", error);
    }
  };

  searchFilter = async (req: Request, res: Response): Promise<Response> => {
    const media_type = req.params.media_type || "movie";
    const with_genres = req.query.with_genres || null;
    const sort_by = req.query.sort_by || null;
    const primary_release_year = req.query.primary_release_year || null;
    const first_air_date_year = req.query.first_air_date_year || null;
    const with_original_language = req.query.with_original_language || null;
    const page = req.query.page || null;
    let query = "";
    const filters = {
      with_genres,
      sort_by,
      primary_release_year,
      first_air_date_year,
      with_original_language,
      page,
    };
    for (const [key, value] of Object.entries(filters)) {
      if (value !== null) {
        query += `&${key}=${value}`;
      }
    }
    try {
      const search = await AxiosInstance.get(
        `discover/${media_type}?${query.slice(1)}`
      );

      const results = search.data.results.map((result: any) => ({
        id: result.id,
        title: result.title || result.name,
        poster: `https://image.tmdb.org/t/p/w780${result.poster_path}`,
        media_type: media_type,
        adult: result.adult,
      }));

      const response = {
        page: search.data.page,
        total_pages: search.data.total_pages,
        results,
        query: query.slice(1),
      };

      return this.successRes(res, 201, "Success getting data", response);
    } catch (error) {
      return this.errorRes(res, 500, "Internal server error", error);
    }
  };
}

export default new SearchController();
