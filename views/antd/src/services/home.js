
import * as request from 'request';
import * as urls from 'urls';

export async function query(data) {
  return request.get(urls.homeTable, data);
}
