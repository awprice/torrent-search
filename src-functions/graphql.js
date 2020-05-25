import { ApolloServer, gql } from 'apollo-server-lambda';
import { Deluge } from '@ctrl/deluge';
import torrentAPI from '../lib/torrentapi';

const DEFAULT_LIMIT = 100;

/**
 * @param keywords
 * @param limit
 * @param minSeeders
 * @param minLeechers
 * @returns {Promise<*[]|*>}
 */
const searchTorrents = async (keywords, limit, minSeeders, minLeechers) => {
  const token = await torrentAPI.getToken();
  if (token === null) {
    return [];
  }
  const torrents = await torrentAPI.searchTorrents(token, keywords, limit);
  return torrents !== null ? torrents : [];
};

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
  return searchTorrents(keywords, DEFAULT_LIMIT, minSeeders, minLeechers);
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
