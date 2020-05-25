import axios from 'axios';
import get from 'lodash/get';
import cacache from 'cacache';
import querystring from 'querystring';
import crypto from 'crypto';

const APP_ID = 'torrent-search';
const CACHE_PATH = '/tmp/cache';
const API_TOKEN_CACHE_KEY = 'api_token';

const newAxios = () => axios.create({
  baseURL: 'https://torrentapi.org',
  timeout: 2000,
});

/**
 * @param key
 * @returns {Q.Promise<any>}
 */
const getCachedResult = key => cacache.get(CACHE_PATH, key)
  .then((res) => {
    if (res.metadata.expiry < Date.now()) {
      return null;
    }
    return res.data;
  })
  .catch(() => null);

/**
 * @param key
 * @param value
 * @param expiry
 */
const setCachedResult = (key, value, expiry) => {
  const expiryTime = Date.now() + (expiry * 1000);
  return cacache.put(CACHE_PATH, key, JSON.stringify(value), { metadata: { expiry: expiryTime } });
};

/**
 * @param contents
 * @returns {string}
 */
const hash = contents => crypto.createHash('md5')
  .update(contents)
  .digest('hex');

/**
 * @returns {Promise<null|*>}
 */
const getToken = async () => {
  const cachedResult = await getCachedResult(API_TOKEN_CACHE_KEY);
  if (cachedResult !== null) {
    return JSON.parse(cachedResult.toString());
  }

  const req = newAxios();
  const res = await req({
    method: 'get',
    url: `/pubapi_v2.php?get_token=get_token&app_id=${APP_ID}`,
  });
  if (res.status !== 200) {
    return null;
  }
  const token = get(res.data, 'token', null);
  if (token === null) {
    return null;
  }
  await setCachedResult(API_TOKEN_CACHE_KEY, token, 600);
  return token;
};

/**
 * @param token
 * @param keywords
 * @param limit
 * @returns {Promise<null|any>}
 */
const searchTorrents = async (token, keywords, limit) => {
  const cacheKey = hash(`searchTorrents:${token}:${keywords}:${limit}`);
  const cachedResult = await getCachedResult(cacheKey);
  if (cachedResult !== null) {
    return JSON.parse(cachedResult.toString());
  }
  const req = newAxios();
  const encodedKeywords = querystring.escape(keywords);
  const res = await req({
    method: 'get',
    url: `/pubapi_v2.php?mode=search&search_string=${encodedKeywords}&limit=${limit}&sort=last&format=json_extended&app_id=${APP_ID}&token=${token}`,
  });
  if (res.status !== 200) {
    return null;
  }
  const results = get(res.data, 'torrent_results', null);
  if (results === null) {
    return null;
  }
  // fix the info pages
  results.forEach((torrent, i) => {
    results[i].info_page = `${torrent.info_page}&app_id=${APP_ID}`;
  });
  await setCachedResult(cacheKey, results, 600);
  return results;
};

export default {
  getToken,
  searchTorrents,
};
