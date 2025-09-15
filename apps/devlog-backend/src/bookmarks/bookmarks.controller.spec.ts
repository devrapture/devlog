/**
 * Generated tests for BookmarksController.
 * Testing library/framework: Jest + @nestjs/testing (NestJS).
 * These unit tests focus on controller behavior and service interaction.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksController', () => {
  let controller: BookmarksController;
  let service: jest.Mocked<BookmarksService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<BookmarksService> = {
      bookmarkPost: jest.fn(),
      unBookmarkPost: jest.fn(),
      getBookmarkedPosts: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [
        { provide: BookmarksService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
    service = module.get<BookmarksService>(BookmarksService) as jest.Mocked<BookmarksService>;
  });

  describe('bookmarkPost', () => {
    it('should delegate to service and return its result (happy path)', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const postId = '22222222-2222-2222-2222-222222222222';
      const svcResult = { success: true, message: 'Bookmarked successfully' };
      service.bookmarkPost.mockResolvedValueOnce(svcResult as any);

      const result = await controller.bookmarkPost(userId, postId);

      expect(service.bookmarkPost).toHaveBeenCalledTimes(1);
      expect(service.bookmarkPost).toHaveBeenCalledWith(userId, postId);
      expect(result).toBe(svcResult);
    });

    it('should propagate errors thrown by service (failure path)', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const postId = 'bad-post-id-but-controller-unit-test-bypasses-pipes';
      const err = new BadRequestException('Invalid postId');
      service.bookmarkPost.mockRejectedValueOnce(err);

      await expect(controller.bookmarkPost(userId, postId)).rejects.toBe(err);
      expect(service.bookmarkPost).toHaveBeenCalledWith(userId, postId);
    });
  });

  describe('unBookmarkPost', () => {
    it('should delegate to service and return its result (happy path)', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const postId = '33333333-3333-3333-3333-333333333333';
      const svcResult = { success: true, message: 'Unbookmarked successfully' };
      service.unBookmarkPost.mockResolvedValueOnce(svcResult as any);

      const result = await controller.unBookmarkPost(userId, postId);

      expect(service.unBookmarkPost).toHaveBeenCalledTimes(1);
      expect(service.unBookmarkPost).toHaveBeenCalledWith(userId, postId);
      expect(result).toBe(svcResult);
    });

    it('should propagate NotFoundException from service (failure path)', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const postId = '44444444-4444-4444-4444-444444444444';
      const err = new NotFoundException('Bookmark not found');
      service.unBookmarkPost.mockRejectedValueOnce(err);

      await expect(controller.unBookmarkPost(userId, postId)).rejects.toBe(err);
      expect(service.unBookmarkPost).toHaveBeenCalledWith(userId, postId);
    });
  });

  describe('getBookmarkedPosts', () => {
    it('should pass pagination params and return paginated result', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const pagination: any = { page: 1, limit: 10 };
      const paginated = {
        data: [{ id: 'post-1' }],
        meta: { total: 1, page: 1, limit: 10 },
      };
      service.getBookmarkedPosts.mockResolvedValueOnce(paginated as any);

      const result = await controller.getBookmarkedPosts(userId, pagination);

      expect(service.getBookmarkedPosts).toHaveBeenCalledTimes(1);
      expect(service.getBookmarkedPosts).toHaveBeenCalledWith(userId, pagination);
      expect(result).toBe(paginated);
    });

    it('should propagate service errors', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const pagination: any = { page: 0, limit: -1 };
      const err = new BadRequestException('Invalid pagination');
      service.getBookmarkedPosts.mockRejectedValueOnce(err);

      await expect(controller.getBookmarkedPosts(userId, pagination)).rejects.toBe(err);
      expect(service.getBookmarkedPosts).toHaveBeenCalledWith(userId, pagination);
    });
  });
});