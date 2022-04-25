import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { MetricsMiddleware } from './metrics.middleware';
import { MetricsService } from './metrics.service';

describe('MetricsMiddleware', () => {
  let middleware: MetricsMiddleware;
  let mockMetricsService: MetricsService;
  let mockAuthService: AuthService;
  const mockRequest = { originalUrl: '/' } as Request;
  beforeEach(() => {
    mockAuthService = new AuthService(mockRequest);
    mockMetricsService = new MetricsService();
    middleware = new MetricsMiddleware(mockMetricsService, mockAuthService);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should start logging on use', async () => {
    //Mocks
    const mockResponse = {
      on: jest.fn().mockReturnThis() as any,
    } as Response;
    const mockNextFunction = jest.fn().mockReturnThis() as NextFunction;

    //Spy. We will check that the method gets called with certain values
    const spy = jest.spyOn(mockMetricsService, 'logRequestStarted');

    await middleware.use(mockRequest, mockResponse, mockNextFunction);
    expect(spy).toBeCalledWith({ originalUrl: '/' } as Request);
  });
});
