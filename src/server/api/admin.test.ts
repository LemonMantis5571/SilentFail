import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminRoutes } from './admin';
import { db } from '~/server/db';

vi.mock('~/server/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
    monitor: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    pingEvent: {
      findMany: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
    downtime: {
      findMany: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

const mockUser = {
  id: 'user1',
  apiKey: 'valid-api-key',
  email: 'user@example.com',
};

const mockedDb = db as unknown as {
  user: { findUnique: ReturnType<typeof vi.fn> };
  monitor: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
  downtime: {
    findMany: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
};

function createRequest(path: string, method = 'GET', body?: unknown) {
  return new Request(`http://localhost${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${mockUser.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function readJson<T>(response: Response) {
  return (await response.json()) as T;
}

describe('Admin Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedDb.user.findUnique.mockResolvedValue(mockUser as never);
  });

  it('returns 401 when the API key is missing', async () => {
    const response = await adminRoutes.handle(
      new Request('http://localhost/admin/stats'),
    );
    const message = await response.text();

    expect(response.status).toBe(401);
    expect(message).toBe('Unauthorized');
  });

  it('returns correct statistics', async () => {
    mockedDb.monitor.findMany.mockResolvedValue(
      [
        { id: '1', status: 'UP' },
        { id: '2', status: 'DOWN' },
        { id: '3', status: 'UP' },
      ] as never,
    );

    const response = await adminRoutes.handle(createRequest('/admin/stats'));
    const data = await readJson<{
      total: number;
      active: number;
      down: number;
      monitors: {
        total: number;
        active: number;
        down: number;
      };
    }>(response);

    expect(response.status).toBe(200);
    expect(data).toEqual({
      total: 3,
      active: 2,
      down: 1,
      monitors: {
        total: 3,
        active: 2,
        down: 1,
      },
    });
  });

  it('returns monitor details for the owner', async () => {
    const mockMonitor = { id: 'm1', name: 'Test Monitor', userId: mockUser.id };
    mockedDb.monitor.findUnique.mockResolvedValue(mockMonitor as never);

    const response = await adminRoutes.handle(createRequest('/admin/monitors/m1'));
    const data = await readJson<typeof mockMonitor>(response);

    expect(response.status).toBe(200);
    expect(data).toEqual(mockMonitor);
    expect(mockedDb.monitor.findUnique.mock.calls[0]?.[0]).toEqual({
      where: { id: 'm1', userId: mockUser.id },
    });
  });

  it('returns 404 when a monitor is missing', async () => {
    mockedDb.monitor.findUnique.mockResolvedValue(null as never);

    const response = await adminRoutes.handle(createRequest('/admin/monitors/m999'));
    const message = await response.text();

    expect(response.status).toBe(404);
    expect(message).toBe('Monitor not found');
  });

  it('returns downtime history for a monitor', async () => {
    const mockMonitor = { id: 'm1', userId: mockUser.id };
    const mockDowntimes = [{ id: 'd1', startedAt: new Date() }];

    mockedDb.monitor.findUnique.mockResolvedValue(mockMonitor as never);
    mockedDb.downtime.findMany.mockResolvedValue(mockDowntimes as never);
    mockedDb.downtime.count.mockResolvedValue(1 as never);

    const response = await adminRoutes.handle(
      createRequest('/admin/monitors/m1/downtimes'),
    );
    const data = await readJson<{
      downtimes: typeof mockDowntimes;
      total: number;
    }>(response);

    expect(response.status).toBe(200);
    expect(data.downtimes).toHaveLength(1);
    expect(data.total).toBe(1);
  });
});
