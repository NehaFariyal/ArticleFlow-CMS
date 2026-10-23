const mongoose = require('mongoose');

let connectionAttempt = null;

const getMongoErrorDetails = (error) => {
  const details = [];
  const pending = [error];
  const visited = new Set();

  while (pending.length > 0) {
    const current = pending.pop();
    if (!current || typeof current !== 'object' || visited.has(current)) continue;

    visited.add(current);
    details.push(`${current.code || ''} ${current.codeName || ''} ${current.message || ''}`);

    if (current.cause) pending.push(current.cause);

    const servers = current.reason?.servers;
    if (servers instanceof Map) {
      for (const server of servers.values()) {
        if (server.error) pending.push(server.error);
      }
    }
  }

  return details.join(' ');
};

const classifyMongoError = (error) => {
  const message = getMongoErrorDetails(error);
  const code = String(error?.code || '');
  const codeName = String(error?.codeName || '');

  if (/ERR_SSL|SSL routines|TLS alert|SSL alert|tls handshake|ssl handshake/i.test(message)) {
    return 'tls_handshake_failed';
  }

  if (
    code === '18' ||
    codeName === 'AuthenticationFailed' ||
    /authentication failed|bad auth|sasl authentication/i.test(message)
  ) {
    return 'authentication_failed';
  }

  if (
    /ip address.{0,60}(not allowed|not authorized|not whitelisted|not in .*access list)|not authorized.{0,60}ip/i.test(message)
  ) {
    return 'ip_access_restricted';
  }

  if (
    /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EHOSTUNREACH|ENETUNREACH|querySrv|DNS|network/i.test(
      `${code} ${message}`
    )
  ) {
    return 'dns_or_network_failure';
  }

  if (
    /server selection|no servers found|could not connect to any servers|cluster.*unavailable/i.test(
      message
    )
  ) {
    return 'cluster_unavailable';
  }

  return 'connection_failed';
};

const getMongoConfig = () => {
  const mongoURI = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();
  if (!mongoURI) {
    return { category: 'configuration_missing', error: 'MONGODB_URI is not configured.' };
  }

  let parsedUri;
  try {
    parsedUri = new URL(mongoURI);
  } catch {
    return { category: 'configuration_invalid', error: 'MONGODB_URI is not a valid MongoDB connection string.' };
  }

  if (!['mongodb:', 'mongodb+srv:'].includes(parsedUri.protocol)) {
    return { category: 'configuration_invalid', error: 'MONGODB_URI must use mongodb:// or mongodb+srv://.' };
  }

  if (
    !parsedUri.hostname ||
    /^(your[_-]?cluster[_-]?host|<.*>|\[.*\])$/i.test(parsedUri.hostname)
  ) {
    return {
      category: 'configuration_invalid',
      error: 'MONGODB_URI still contains a placeholder hostname. Copy the real connection host from MongoDB Atlas.',
    };
  }

  return { mongoURI, databaseName: 'content_management_system' };
};

const logConnectionFailure = (error, category) => {
  console.error(
    `[Lumen Database] MongoDB connection failed [${category}] (${error.name || 'Error'}).`
  );
  if (category === 'ip_access_restricted') {
    console.error('[Lumen Database] In Atlas, add this machine public IP to Network Access. Do not use a public 0.0.0.0/0 rule.');
  } else if (category === 'authentication_failed') {
    console.error('[Lumen Database] Verify the Atlas database username/password and ensure the URI-encoded credentials belong to a Database Access user.');
  } else if (category === 'tls_handshake_failed') {
    console.error('[Lumen Database] TLS negotiation with MongoDB failed. Check TLS inspection, firewall/network policy, and Atlas connectivity.');
  } else if (category === 'dns_or_network_failure') {
    console.error('[Lumen Database] Verify the Atlas cluster hostname, DNS/network access, and outbound connectivity.');
  } else if (category === 'cluster_unavailable') {
    console.error('[Lumen Database] Verify the Atlas cluster is available and not paused.');
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Lumen Database] MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Lumen Database] MongoDB reconnected ✅');
});

const connectDB = async () => {
  try {
    // Isolate tests from external database connections unless explicitly requested
    if (process.env.NODE_ENV === 'test' && !process.env.FORCE_DB_TEST) {
      return null;
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const config = getMongoConfig();
    if (config.error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(`[Lumen Database] MongoDB connection failed [${config.category}]. ${config.error}`);
      }
      return null;
    }

    if (!connectionAttempt) {
      connectionAttempt = mongoose.connect(config.mongoURI, {
        dbName: config.databaseName,
        // Force IPv4 — prevents NAT64 IPv6 (64:ff9b::) connection drops.
        family: 4,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 120000,
        connectTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
        maxIdleTimeMS: 120000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
    }

    const attempt = connectionAttempt;
    const conn = await attempt;

    if (connectionAttempt === attempt) {
      connectionAttempt = null;
    }

    console.log('[Lumen Database] Connected to MongoDB successfully.');
    console.log(`[Lumen Database] Database Name: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    connectionAttempt = null;
    const category = classifyMongoError(error);
    error.dbCategory = category;
    logConnectionFailure(error, category);

    throw error;
  }
};

connectDB.classifyMongoError = classifyMongoError;
connectDB.getConfigurationStatus = () => {
  const config = getMongoConfig();
  if (config.error) return { category: config.category, message: config.error };
  return { category: null, message: null, databaseName: config.databaseName };
};

module.exports = connectDB;