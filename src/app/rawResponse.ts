import {responseFromAPI} from './response';

export interface rawResponse {
  count: number;
  match: responseFromAPI[];
}
