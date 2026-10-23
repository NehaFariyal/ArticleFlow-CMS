const connectDB = require('../config/db');

describe('MongoDB configuration diagnostics', () => {
  const originalMongoUri = process.env.MONGODB_URI;
  const originalMongoAlias = process.env.MONGO_URI;

  afterEach(() => {
    if (originalMongoUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = originalMongoUri;
    if (originalMongoAlias === undefined) delete process.env.MONGO_URI;
    else process.env.MONGO_URI = originalMongoAlias;
  });

  it('identifies a placeholder Atlas hostname without exposing the URI', () => {
    process.env.MONGODB_URI = 'mongodb+srv://test-user:test-password@your_cluster_host/articleflow';
    delete process.env.MONGO_URI;

    expect(connectDB.getConfigurationStatus()).toEqual({
      category: 'configuration_invalid',
      message: 'MONGODB_URI still contains a placeholder hostname. Copy the real connection host from MongoDB Atlas.',
    });
  });

  it('preserves the CMS database name regardless of the URI path', () => {
    process.env.MONGODB_URI = 'mongodb+srv://test-user:test-password@cluster0.example.mongodb.net/articleflow';
    delete process.env.MONGO_URI;

    expect(connectDB.getConfigurationStatus()).toMatchObject({
      category: null,
      databaseName: 'content_management_system',
    });
  });

  it.each([
    [{ code: 18, message: 'authentication details omitted' }, 'authentication_failed'],
    [{ message: 'IP address is not whitelisted' }, 'ip_access_restricted'],
    [{
      message: "Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that the IP isn't whitelisted.",
    }, 'cluster_unavailable'],
    [{
      name: 'MongooseServerSelectionError',
      message: 'Could not connect to any servers. One common reason is an IP that is not whitelisted.',
      reason: {
        servers: new Map([['atlas.example:27017', {
          error: Object.assign(new Error('TLS alert internal error'), {
            cause: Object.assign(new Error('TLS handshake failed'), {
              code: 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR',
            }),
          }),
        }]]),
      },
    }, 'tls_handshake_failed'],
    [{ code: 'ENOTFOUND', message: 'querySrv failed' }, 'dns_or_network_failure'],
    [{ message: 'Server selection timed out' }, 'cluster_unavailable'],
  ])('classifies MongoDB connection errors without logging their message', (error, category) => {
    expect(connectDB.classifyMongoError(error)).toBe(category);
  });
});
