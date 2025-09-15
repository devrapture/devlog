/**
 * Test framework: Jest (ts-jest) for a NestJS project.
 * Scope: Unit tests for BookmarksService focusing on bookmarkPost, unBookmarkPost, and getBookmarkedPosts.
 * Strategy: Directly instantiate the service with mocked TypeORM repositories and EntityManager.
 */

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookmarksService } from './bookmarks.service';
import { Bookmarks } from './entities/bookmark.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>> & {
  manager?: { transaction: jest.Mock };
};

const createQueryBuilderMock = (items: any[] = [], total = 0) => {
  const qb = {
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([items, total]),
  };
  return qb;
};

describe('BookmarksService (unit)', () => {
  let service: BookmarksService;

  let bookmarkRepository: MockRepo<Bookmarks>;
  let userRepository: MockRepo<User>;
  let postRepository: MockRepo<Post>;
  let manager: {
    save: jest.Mock;
    increment: jest.Mock;
    decrement: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(() => {
    bookmarkRepository = {
      findOne: jest.fn(),
    };

    userRepository = {
      findOne: jest.fn(),
    };

    manager = {
      save: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      remove: jest.fn(),
    };

    postRepository = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: {
        transaction: jest.fn(async (cb: any) => {
          return cb(manager);
        }),
      },
    };

    service = new BookmarksService(
      bookmarkRepository as unknown as Repository<Bookmarks>,
      userRepository as unknown as Repository<User>,
      postRepository as unknown as Repository<Post>,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bookmarkPost', () => {
    it('throws NotFoundException when post does not exist', async () => {
      (postRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.bookmarkPost('u1', 'p1')).rejects.toThrow(
        NotFoundException,
      );
      expect(bookmarkRepository.findOne).not.toHaveBeenCalled();
      expect(postRepository.manager.transaction).not.toHaveBeenCalled();
    });

    it('throws ConflictException when bookmark already exists', async () => {
      (postRepository.findOne as jest.Mock).mockResolvedValue({ id: 'p1' });
      (bookmarkRepository.findOne as jest.Mock).mockResolvedValue({

        id: 'b1',
      });


      await expect(service.bookmarkPost('u1', 'p1')).rejects.toThrow(
        ConflictException,
      );
      expect(postRepository.manager.transaction).not.toHaveBeenCalled();
    });

    it('creates bookmark and increments post.bookmarkCount on success', async () => {
      (postRepository.findOne as jest.Mock).mockResolvedValue({ id: 'p1' });

      (bookmarkRepository.findOne as jest.Mock).mockResolvedValue(undefined);


      await expect(service.bookmarkPost('u1', 'p1')).resolves.toBeUndefined();


      expect(postRepository.manager.transaction).toHaveBeenCalledTimes(1);
      expect(manager.save).toHaveBeenCalledWith(Bookmarks, {

        user: { id: 'u1' },
        post: { id: 'p1' },
      });
      expect(manager.increment).toHaveBeenCalledWith(

        Post,
        { id: 'p1' },
        'bookmarkCount',
        1,
      );
    });
  });

  describe('unBookmarkPost', () => {
    it('throws NotFoundException when post does not exist', async () => {
      (postRepository.findOne as jest.Mock).mockResolvedValue(null);


      await expect(service.unBookmarkPost('u1', 'p1')).rejects.toThrow(
        NotFoundException,
      );
      expect(bookmarkRepository.findOne).not.toHaveBeenCalled();
      expect(postRepository.manager.transaction).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when bookmark is already removed', async () => {
      (postRepository.findOne as jest.Mock).mockResolvedValue({ id: 'p1' });
      (bookmarkRepository.findOne as jest.Mock).mockResolvedValue(undefined);


      await expect(service.unBookmarkPost('u1', 'p1')).rejects.toThrow(
        NotFoundException,
      );
      expect(postRepository.manager.transaction).not.toHaveBeenCalled();
    });

    it('removes bookmark and decrements post.bookmarkCount on success', async () => {
      const existing = { id: 'b1' };
      (postRepository.findOne as jest.Mock).mockResolvedValue({ id: 'p1' });
      (bookmarkRepository.findOne as jest.Mock).mockResolvedValue(existing);


      await expect(service.unBookmarkPost('u1', 'p1')).resolves.toBeUndefined();


      expect(postRepository.manager.transaction).toHaveBeenCalledTimes(1);
      expect(manager.remove).toHaveBeenCalledWith(Bookmarks, existing);
      expect(manager.decrement).toHaveBeenCalledWith(

        Post,
        { id: 'p1' },
        'bookmarkCount',
        1,
      );
    });
  });

  describe('getBookmarkedPosts', () => {
    it('throws NotFoundException when user does not exist', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);


      await expect(
        service.getBookmarkedPosts('u1', { page: 1, limit: 10 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('returns items with default pagination when page/limit omitted', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue({ id: 'u1' });

      const items = [{ id: 'p1' }];

      const qb = createQueryBuilderMock(items, 1);
      (postRepository.createQueryBuilder as jest.Mock).mockReturnValue(qb);


      const res = await service.getBookmarkedPosts('u1', {} as any);


      // QueryBuilder chain assertions

      expect(postRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(qb.innerJoin).toHaveBeenCalledWith(

        'post.bookmarks',
        'bookmarks',
        'bookmarks.userId = :userId',
        { userId: 'u1' },
      );
      expect(qb.leftJoin).toHaveBeenCalledWith('post.author', 'author');
      expect(qb.addSelect).toHaveBeenCalledWith([

        'author.id',
        'author.displayName',
        'author.avatar',
      ]);
      expect(qb.orderBy).toHaveBeenCalledWith('post.createdAt', 'DESC');
      expect(qb.skip).toHaveBeenCalledWith(0); // (1 - 1) * 10
      expect(qb.take).toHaveBeenCalledWith(10);


      // Result assertions

      expect(res.items).toEqual(items);
      expect(res.metadata).toEqual({

        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });
    });

    it('respects pagination and sets hasNext/hasPrevious correctly', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue({ id: 'u1' });

      const items = [{ id: 'p4' }, { id: 'p5' }, { id: 'p6' }];

      const totalItems = 7; // limit=3 => totalPages=3, page=2 => hasPrev=true, hasNext=true

      const qb = createQueryBuilderMock(items, totalItems);
      (postRepository.createQueryBuilder as jest.Mock).mockReturnValue(qb);


      const res = await service.getBookmarkedPosts('u1', {
        page: 2,
        limit: 3,
      } as any);


      expect(qb.skip).toHaveBeenCalledWith(3); // (2 - 1) * 3
      expect(qb.take).toHaveBeenCalledWith(3);


      expect(res.items).toEqual(items);
      expect(res.metadata).toEqual({

        currentPage: 2,
        itemsPerPage: 3,
        totalItems: 7,
        totalPages: 3,
        hasPreviousPage: true,
        hasNextPage: true,
      });
    });
  });
});