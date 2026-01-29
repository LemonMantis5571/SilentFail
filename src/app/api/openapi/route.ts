import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'SilentFail API',
      version: '1.0.0',
      description: 'Dead man switch monitoring API for heartbeat-based health checks',
    },
    servers: [{ url: `${baseUrl}/api` }],
    tags: [
      { name: 'Admin', description: 'Authenticated endpoints for managing monitors (requires Bearer API key)' },
      { name: 'Ping', description: 'Public heartbeat endpoints for monitors' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Your API key from the Settings page',
        },
      },
      schemas: {
        Monitor: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            key: { type: 'string' },
            interval: { type: 'number', description: 'Interval in minutes' },
            gracePeriod: { type: 'number', description: 'Grace period in minutes' },
            useSmartGrace: { type: 'boolean' },
            status: { type: 'string', enum: ['UP', 'DOWN', 'PENDING'] },
            lastPing: { type: 'string', format: 'date-time', nullable: true },
            secret: { type: 'string', nullable: true, description: 'Secret for private monitors' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateMonitorRequest: {
          type: 'object',
          required: ['name', 'interval', 'useSmartGrace', 'gracePeriod', 'privateMonitor'],
          properties: {
            name: { type: 'string' },
            interval: { type: 'number' },
            useSmartGrace: { type: 'boolean' },
            gracePeriod: { type: 'number' },
            privateMonitor: { type: 'boolean' },
          },
        },
        UpdateMonitorRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            interval: { type: 'number' },
            useSmartGrace: { type: 'boolean' },
            gracePeriod: { type: 'number' },
            privateMonitor: { type: 'boolean' },
          },
        },
      },
    },
    paths: {
      '/admin/stats': {
        get: {
          tags: ['Admin'],
          summary: 'Get system stats',
          description: 'Returns overview statistics of all monitors',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'System statistics',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      active: { type: 'integer' },
                      down: { type: 'integer' },
                      monitors: {
                        type: 'object',
                        properties: {
                          total: { type: 'integer' },
                          active: { type: 'integer' },
                          down: { type: 'integer' },
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': { description: 'Unauthorized' }
          }
        }
      },
      '/admin/monitors': {
        get: {
          tags: ['Admin'],
          summary: 'Get all monitors',
          description: 'Returns all monitors owned by the authenticated user',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of monitors',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Monitor' },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized - Invalid or missing API key' },
          },
        },
        post: {
          tags: ['Admin'],
          summary: 'Create a monitor',
          description: 'Creates a new heartbeat monitor with the specified configuration',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateMonitorRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Created monitor',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Monitor' },
                },
              },
            },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/admin/monitors/{id}': {
        get: {
          tags: ['Admin'],
          summary: 'Get a monitor',
          description: 'Returns details of a specific monitor',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            '200': {
              description: 'Monitor details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Monitor' },
                },
              },
            },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Monitor not found' },
          },
        },
        patch: {
          tags: ['Admin'],
          summary: 'Update a monitor',
          description: 'Partially updates an existing monitor by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateMonitorRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Success', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' } } } } } },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Monitor not found' },
          },
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete a monitor',
          description: 'Permanently deletes a monitor and all its associated data (pings, downtime records)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            '200': { description: 'Monitor deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Monitor not found' },
          },
        },
      },
      '/admin/monitors/{id}/pings': {
        get: {
          tags: ['Admin'],
          summary: 'Get ping history',
          description: 'Returns paginated ping history for a specific monitor',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 50 }, description: 'Number of records to return' },
            { name: 'offset', in: 'query', required: false, schema: { type: 'integer', default: 0 }, description: 'Number of records to skip' },
          ],
          responses: {
            '200': {
              description: 'Paginated ping history',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      pings: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, monitorId: { type: 'string' }, latency: { type: 'number' }, createdAt: { type: 'string', format: 'date-time' } } } },
                      total: { type: 'integer' },
                      limit: { type: 'integer' },
                      offset: { type: 'integer' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Monitor not found' },
          },
        },
      },
      '/admin/monitors/{id}/downtimes': {
        get: {
          tags: ['Admin'],
          summary: 'Get downtime history',
          description: 'Returns paginated downtime history for a specific monitor',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 50 }, description: 'Number of records to return' },
            { name: 'offset', in: 'query', required: false, schema: { type: 'integer', default: 0 }, description: 'Number of records to skip' },
          ],
          responses: {
            '200': {
              description: 'Paginated downtime history',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      downtimes: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, monitorId: { type: 'string' }, startedAt: { type: 'string', format: 'date-time' }, endedAt: { type: 'string', format: 'date-time', nullable: true }, duration: { type: 'integer', nullable: true } } } },
                      total: { type: 'integer' },
                      limit: { type: 'integer' },
                      offset: { type: 'integer' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Monitor not found' },
          },
        },
      },
      '/admin/monitors/{id}/regenerate-key': {
        post: {
          tags: ['Admin'],
          summary: 'Regenerate monitor key',
          description: 'Generates a new unique key for the monitor. The old key will no longer work.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            '200': {
              description: 'New key generated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      key: { type: 'string', description: 'The new monitor key' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Monitor not found' },
          },
        },
      },
      '/ping/{key}': {
        get: {
          tags: ['Ping'],
          summary: 'Send heartbeat (GET)',
          description: 'Records a heartbeat ping for a monitor. For private monitors, include secret as query param or Bearer token.',
          parameters: [
            { name: 'key', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'secret', in: 'query', required: false, schema: { type: 'string' }, description: 'Secret for private monitors' },
          ],
          responses: {
            '200': { description: 'Heartbeat recorded successfully' },
            '401': { description: 'Unauthorized - Invalid secret for private monitor' },
            '404': { description: 'Monitor not found' },
          },
        },
        post: {
          tags: ['Ping'],
          summary: 'Report failure (POST)',
          description: 'Manually reports a monitor as DOWN and creates a downtime record.',
          parameters: [
            { name: 'key', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'secret', in: 'query', required: false, schema: { type: 'string' } },
          ],
          requestBody: {
            content: { 'text/plain': { schema: { type: 'string' } } },
          },
          responses: {
            '200': { description: 'Failure recorded' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Monitor not found' },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
