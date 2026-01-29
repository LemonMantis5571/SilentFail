import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminRoutes } from './admin';
import { db } from '~/server/db';

// Mock the database
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

describe('Admin Routes', () => {
  const mockUser = {
    id: 'user1',
    apiKey: 'valid-api-key',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);
  });

  const createRequest = (path: string, method: string = 'GET', body?: unknown) => {
    return new Request(`http://localhost${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${mockUser.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  describe('GET /stats', () => {
    it('should return correct statistics', async () => {
      const mockMonitors = [
        { id: '1', status: 'UP' },
        { id: '2', status: 'DOWN' },
        { id: '3', status: 'UP' },
      ];
      vi.mocked(db.monitor.findMany).mockResolvedValue(mockMonitors as any);

      const response = await adminRoutes.handle(createRequest('/admin/stats'));
      const data = await response.json();

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
  });

  describe('GET /monitors/:id', () => {
    it('should return monitor details', async () => {
      const mockMonitor = { id: 'm1', name: 'Test Monitor', userId: mockUser.id };
      vi.mocked(db.monitor.findUnique).mockResolvedValue(mockMonitor as any);

      const response = await adminRoutes.handle(createRequest('/admin/monitors/m1'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockMonitor);
      expect(db.monitor.findUnique).toHaveBeenCalledWith({
        where: { id: 'm1', userId: mockUser.id },
      });
    });

    it('should return 500 if monitor not found', async () => {
      vi.mocked(db.monitor.findUnique).mockResolvedValue(null);

      const response = await adminRoutes.handle(createRequest('/admin/monitors/m999'));
      
      expect(response.status).toBe(500); 
    });
  });

  describe('GET /monitors/:id/downtimes', () => {
    it('should return downtimes list', async () => {
      const mockMonitor = { id: 'm1', userId: mockUser.id };
      const mockDowntimes = [{ id: 'd1', startedAt: new Date().toISOString() }];
      
      vi.mocked(db.monitor.findUnique).mockResolvedValue(mockMonitor as any);
      vi.mocked(db.downtime.findMany).mockResolvedValue(mockDowntimes as any);
      vi.mocked(db.downtime.count).mockResolvedValue(1);

      const response = await adminRoutes.handle(createRequest('/admin/monitors/m1/downtimes'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.downtimes).toHaveLength(1);
      expect(data.total).toBe(1);
    });
  });
});

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

describe('Admin Routes', () => {
  const mockUser = {
    id: 'user1',
    apiKey: 'valid-api-key',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (db.user.findUnique as any).mockResolvedValue(mockUser);
  });

  const createRequest = (path: string, method: string = 'GET', body?: any) => {
    return new Request(`http://localhost${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${mockUser.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  describe('GET /stats', () => {
    it('should return correct statistics', async () => {
      const mockMonitors = [
        { id: '1', status: 'UP' },
        { id: '2', status: 'DOWN' },
        { id: '3', status: 'UP' },
      ];
      (db.monitor.findMany as any).mockResolvedValue(mockMonitors);

      const response = await adminRoutes.handle(createRequest('/admin/stats'));
      const data = await response.json();

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
  });

  describe('GET /monitors/:id', () => {
    it('should return monitor details', async () => {
      const mockMonitor = { id: 'm1', name: 'Test Monitor', userId: mockUser.id };
      (db.monitor.findUnique as any).mockResolvedValue(mockMonitor);

      const response = await adminRoutes.handle(createRequest('/admin/monitors/m1'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockMonitor);
      expect(db.monitor.findUnique).toHaveBeenCalledWith({
        where: { id: 'm1', userId: mockUser.id },
      });
    });

    it('should return 500 if monitor not found', async () => {
      (db.monitor.findUnique as any).mockResolvedValue(null);

      const response = await adminRoutes.handle(createRequest('/admin/monitors/m999'));
      
      expect(response.status).toBe(500); 
     
    });
  });

  describe('GET /monitors/:id/downtimes', () => {
    it('should return downtimes list', async () => {
      const mockMonitor = { id: 'm1', userId: mockUser.id };
      const mockDowntimes = [{ id: 'd1', startedAt: new Date() }];
      
      (db.monitor.findUnique as any).mockResolvedValue(mockMonitor);
      (db.downtime.findMany as any).mockResolvedValue(mockDowntimes);
      (db.downtime.count as any).mockResolvedValue(1);

      const response = await adminRoutes.handle(createRequest('/admin/monitors/m1/downtimes'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.downtimes).toHaveLength(1);
      expect(data.total).toBe(1);
    });
  });
});
