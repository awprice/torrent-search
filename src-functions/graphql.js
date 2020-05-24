import { ApolloServer, gql } from 'apollo-server-lambda';
import rarbgApi from 'rarbg-api';
import { Deluge } from '@ctrl/deluge';
import cacache from 'cacache';
import crypto from 'crypto';

const APP_ID = 'torrent-search';
const PROMISE_TIMEOUT = 4000;
const CACHE_PATH = '/tmp/cache';

/**
 * @param ms
 * @returns {Promise<unknown>}
 */
const timeout = ms => new Promise((resolve, reject) => {
  const id = setTimeout(() => {
    clearTimeout(id);
    reject(new Error(`Timed out in ${ms}ms`));
  }, ms);
});

/**
 * @param target
 * @returns {Promise<unknown>}
 */
const promiseTimeout = target => Promise.race([
  target,
  timeout(PROMISE_TIMEOUT),
]);

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
  console.log(`Putting key ${key} into cache, expiring in ${expiry} seconds`); // eslint-disable-line
  const expiryTime = Date.now() + (expiry * 1000);
  return cacache.put(CACHE_PATH, key, JSON.stringify(value), { metadata: { expiry: expiryTime } });
};

const generateKey = ({ keywords, minSeeders, minLeechers }) => crypto.createHash('md5')
  .update(`${keywords}:${minSeeders}:${minLeechers}`)
  .digest('hex');

/**
 * @param parent
 * @param keywords
 * @param minSeeders
 * @param minLeechers
 * @returns {Promise<Array>}
 */
const torrents = async (parent, { keywords, minSeeders, minLeechers }) => {
  if (!keywords.length) {
    return [];
  }
  const key = generateKey({
    keywords,
    minSeeders,
    minLeechers,
  });
  const cachedResult = await getCachedResult(key);
  if (cachedResult !== null) {
    console.log(`Using cached result for ${key}`); // eslint-disable-line
    return JSON.parse(cachedResult.toString());
  }
  let results = [];
  try {
    const searchPromise = rarbgApi.search(keywords, {
      APP_ID,
      min_seeders: typeof minSeeders !== 'undefined' ? minSeeders : null,
      min_leechers: typeof minLeechers !== 'undefined' ? minLeechers : null,
      format: 'json_extended',
      limit: 100,
    });
    results = await promiseTimeout(searchPromise);
  } catch (e) {
    console.error(e); // eslint-disable-line
    return [];
  }
  // fix the info pages
  results.forEach((torrent, i) => {
    results[i].info_page = `${torrent.info_page}&app_id=${APP_ID}`;
  });
  await setCachedResult(key, results, 60);
  return results;
};

/**
 * @param parent
 * @param magnetLink
 * @param delugeUrl
 * @param delugePassword
 * @returns {Promise<{success: boolean}>}
 */
const addTorrent = async (parent, { magnetLink, delugeUrl, delugePassword }) => {
  const client = new Deluge({
    baseUrl: delugeUrl,
    password: delugePassword,
    path: '/json',
  });
  const isConnected = await client.connected();
  if (!isConnected) {
    return { success: false };
  }
  const config = await client.getConfig();
  const path = magnetLink;
  const options = {
    file_priorities: [],
    add_paused: config.result.add_paused,
    compact_allocation: config.result.compact_allocation,
    download_location: config.result.download_location,
    move_completed: config.result.move_completed,
    move_completed_path: config.result.move_completed_path,
    max_connections: config.result.max_connections_per_torrent,
    max_download_speed: config.result.max_download_speed_per_torrent,
    max_upload_slots: config.result.max_upload_slots_per_torrent,
    max_upload_speed: config.result.max_upload_speed_per_torrent,
    prioritize_first_last_pieces: config.result.prioritize_first_last_pieces,
  };
  await client.request('web.add_torrents', [[{
    path,
    options,
  }]]);
  return {
    success: true,
  };
};

const typeDefs = gql`
  type Torrent {
    title: String
    category: String
    download: String
    seeders: Float
    leechers: Float
    size: Float
    pubdate: String
    rank: Int
    info_page: String
  }
  
  type MutationResult {
    success: Boolean
  }
  
  type Query {
    torrents(keywords: String!, minSeeders: Int, minLeechers: Int): [Torrent]
  }
  
  type Mutation {
    addTorrent(magnetLink: String!, delugeUrl: String!, delugePassword: String!): MutationResult
  }
`;

const resolvers = {
  Query: {
    torrents,
  },
  Mutation: {
    addTorrent,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

exports.handler = server.createHandler();
