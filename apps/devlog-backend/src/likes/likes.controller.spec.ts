/**
 * Testing library and framework: Jest + @nestjs/testing (ts-jest).
 * Focus: Unit tests for LikesController methods introduced/modified in the PR.
 * - Behavior tests with mocked LikesService
 * - Decorator/routing metadata verification (HTTP method, path, guards, HTTP code, pipes)
 */

import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

import {
  ParseUUIDPipe,
  HttpStatus,
  RequestMethod,
} from '@nestjs/common';

import {
  PATH_METADATA,
  METHOD_METADATA,
  HTTP_CODE_METADATA,
  GUARDS_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

describe('LikesController - decorators & routing metadata', () => {
  it('should have controller-level path "likes"', () => {
    const path = Reflect.getMetadata(PATH_METADATA, LikesController);
    expect(path).toBe('likes');
  });

  it('likePost should be POST ":postId", guarded by JwtAuthGuard, with HttpCode 200 and ParseUUIDPipe on postId', () => {
    const target = LikesController.prototype;

    const method = 'likePost' as const;

    // Route mapping
    const path = Reflect.getMetadata(PATH_METADATA, target, method);
    const httpMethod = Reflect.getMetadata(METHOD_METADATA, target, method);
    expect(path).toBe(':postId');
    expect(httpMethod).toBe(RequestMethod.POST);

    // Guards
    const guards: any[] = Reflect.getMetadata(GUARDS_METADATA, target, method) || [];
    const guardTokens = guards.map((g) => (typeof g === 'function' ? g : g?.constructor));
    expect(guardTokens).toEqual(expect.arrayContaining([JwtAuthGuard]));

    // HttpCode
    const httpCode = Reflect.getMetadata(HTTP_CODE_METADATA, target, method);
    expect(httpCode).toBe(HttpStatus.OK);

    // Param pipes (ParseUUIDPipe on :postId)
    const argsMeta: Record<string, any> = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, method) || {};
    const allPipes = Object.values(argsMeta).flatMap((m: any) => m?.pipes ?? []);
    // The decorator stores the class (not instance) when used as @Param('id', ParseUUIDPipe)
    expect(allPipes).toEqual(expect.arrayContaining([ParseUUIDPipe]));
  });

  it('unlikePost should be DELETE ":postId", guarded by JwtAuthGuard, with HttpCode 200 and ParseUUIDPipe on postId', () => {
    const target = LikesController.prototype;
    const method = 'unlikePost' as const;

    // Route mapping
    const path = Reflect.getMetadata(PATH_METADATA, target, method);
    const httpMethod = Reflect.getMetadata(METHOD_METADATA, target, method);
    expect(path).toBe(':postId');
    expect(httpMethod).toBe(RequestMethod.DELETE);

    // Guards
    const guards: any[] = Reflect.getMetadata(GUARDS_METADATA, target, method) || [];
    const guardTokens = guards.map((g) => (typeof g === 'function' ? g : g?.constructor));
    expect(guardTokens).toEqual(expect.arrayContaining([JwtAuthGuard]));

    // HttpCode
    const httpCode = Reflect.getMetadata(HTTP_CODE_METADATA, target, method);
    expect(httpCode).toBe(HttpStatus.OK);

    // Param pipes (ParseUUIDPipe on :postId)
    const argsMeta: Record<string, any> = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, method) || {};
    const allPipes = Object.values(argsMeta).flatMap((m: any) => m?.pipes ?? []);
    expect(allPipes).toEqual(expect.arrayContaining([ParseUUIDPipe]));
  });

  it('getLikedPosts should be GET "posts" and be guarded by JwtAuthGuard', () => {
    const target = LikesController.prototype;
    const method = 'getLikedPosts' as const;

    const path = Reflect.getMetadata(PATH_METADATA, target, method);
    const httpMethod = Reflect.getMetadata(METHOD_METADATA, target, method);
    expect(path).toBe('posts');
    expect(httpMethod).toBe(RequestMethod.GET);

    const guards: any[] = Reflect.getMetadata(GUARDS_METADATA, target, method) || [];
    const guardTokens = guards.map((g) => (typeof g === 'function' ? g : g?.constructor));
    expect(guardTokens).toEqual(expect.arrayContaining([JwtAuthGuard]));

    // No explicit HttpCode decorator expected; default 200
    const httpCode = Reflect.getMetadata(HTTP_CODE_METADATA, target, method);
    expect(httpCode).toBeUndefined();
  });
});

describe('LikesController - behavior with mocked LikesService (unit)', () => {
  let controller: LikesController;
  let likesService: jest.Mocked<LikesService>;

  beforeEach(async () => {
    const likesServiceMock: jest.Mocked<LikesService> = {
      likePost: jest.fn(),
      unlikePost: jest.fn(),
      getLikedPosts: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [{ provide: LikesService, useValue: likesServiceMock }],
    }).compile();

    controller = module.get<LikesController>(LikesController);
    likesService = module.get(LikesService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('likePost', () => {
    it('delegates to LikesService.likePost and returns result (happy path)', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const postId = '22222222-2222-2222-2222-222222222222';
      const serviceResult = { success: true, message: 'Liked successfully' } as any;

      likesService.likePost.mockResolvedValueOnce(serviceResult);

      const result = await controller.likePost(userId, postId);

      expect(likesService.likePost).toHaveBeenCalledTimes(1);
      expect(likesService.likePost).toHaveBeenCalledWith(userId, postId);
      expect(result).toBe(serviceResult);
    });

    it('propagates errors from LikesService.likePost (failure path)', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const postId = 'invalid-post-id'; // runtime call bypasses pipes in unit test
      const err = new Error('DB down');

      likesService.likePost.mockRejectedValueOnce(err);

      await expect(controller.likePost(userId, postId)).rejects.toThrow(err);
      expect(likesService.likePost).toHaveBeenCalledWith(userId, postId);
    });
  });

  describe('unlikePost', () => {
    it('delegates to LikesService.unlikePost and returns result (happy path)', async () => {
      const userId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const postId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
      const serviceResult = { success: true, message: 'Unliked successfully' } as any;

      likesService.unlikePost.mockResolvedValueOnce(serviceResult);

      const result = await controller.unlikePost(userId, postId);

      expect(likesService.unlikePost).toHaveBeenCalledTimes(1);
      expect(likesService.unlikePost).toHaveBeenCalledWith(userId, postId);
      expect(result).toBe(serviceResult);
    });

    it('propagates errors from LikesService.unlikePost (failure path)', async () => {
      const userId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const postId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
      const err = new Error('transaction aborted');

      likesService.unlikePost.mockRejectedValueOnce(err);

      await expect(controller.unlikePost(userId, postId)).rejects.toThrow(err);
      expect(likesService.unlikePost).toHaveBeenCalledWith(userId, postId);
    });
  });

  describe('getLikedPosts', () => {
    it('calls service with userId and pagination dto (happy path)', async () => {
      const userId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
      const pagination = { limit: 10, page: 2 } as any;
      const paginated = {
        data: [{ id: 'p1' }, { id: 'p2' }],
        meta: { total: 2, page: 2, limit: 10 },
      } as any;

      likesService.getLikedPosts.mockResolvedValueOnce(paginated);

      const result = await controller.getLikedPosts(userId, pagination);

      expect(likesService.getLikedPosts).toHaveBeenCalledTimes(1);
      expect(likesService.getLikedPosts).toHaveBeenCalledWith(userId, pagination);
      expect(result).toBe(paginated);
    });

    it('passes through when pagination dto is undefined (edge case)', async () => {
      const userId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
      const paginated = { data: [], meta: { total: 0, page: 1, limit: 20 } } as any;

      likesService.getLikedPosts.mockResolvedValueOnce(paginated);

      const result = await controller.getLikedPosts(userId, undefined as any);

      expect(likesService.getLikedPosts).toHaveBeenCalledWith(userId, undefined);
      expect(result).toBe(paginated);
    });

    it('propagates errors from LikesService.getLikedPosts (failure path)', async () => {
      const userId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
      const pagination = { limit: 0, page: -1 } as any; // invalid values hypothetically caught by validation layer
      const err = new Error('invalid pagination');

      likesService.getLikedPosts.mockRejectedValueOnce(err);

      await expect(controller.getLikedPosts(userId, pagination)).rejects.toThrow(err);
      expect(likesService.getLikedPosts).toHaveBeenCalledWith(userId, pagination);
    });
  });
});