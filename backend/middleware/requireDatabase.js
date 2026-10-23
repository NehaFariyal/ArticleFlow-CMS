const mongoose = require('mongoose');
const connectDB = require('../config/db');

const getDatabaseUnavailableMessage = (category) => {
  switch (category) {
    case 'configuration_missing':
      return 'MongoDB is not configured. Set MONGODB_URI in backend/.env and restart the backend. No article was saved.';
    case 'configuration_invalid':
      return 'MongoDB connection settings are invalid. Copy the connection string from Atlas and replace its placeholder host. No article was saved.';
    case 'authentication_failed':
      return 'MongoDB rejected the database credentials. Check the Atlas Database Access user and encoded password. No article was saved.';
    case 'ip_access_restricted':
      return 'MongoDB Atlas blocked this IP address. Add your current public IP in Atlas Network Access. No article was saved.';
    case 'tls_handshake_failed':
      return 'MongoDB TLS negotiation failed. Check network TLS inspection/firewall policy and Atlas connectivity. No article was saved.';
    case 'dns_or_network_failure':
      return 'MongoDB host could not be reached. Verify the Atlas cluster hostname and network/DNS access. No article was saved.';
    case 'cluster_unavailable':
      return 'MongoDB cluster is unavailable. Check that the Atlas cluster is running and try again. No article was saved.';
    default:
      return 'MongoDB is unavailable. Check the database connection and try again. No article was saved.';
  }
};

const requireDatabase = async (req, res, next) => {
  let failureCategory = null;
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (error) {
      failureCategory = error.dbCategory || connectDB.classifyMongoError(error);
      console.error(
        `[Database Readiness] MongoDB connection failed before article write [${failureCategory}] (${error.name}).`
      );
    }
  }

  if (mongoose.connection.readyState === 1) {
    return next();
  }

  const configStatus = connectDB.getConfigurationStatus();
  failureCategory = failureCategory || configStatus.category;
  return res.status(503).json({
    success: false,
    code: 'DATABASE_UNAVAILABLE',
    category: failureCategory || 'connection_failed',
    message: getDatabaseUnavailableMessage(failureCategory),
  });
};

module.exports = requireDatabase;
