import { HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/responses/error-response.dto';
import { applyDecorators } from '@nestjs/common';
import { SingleDraftResponseDto } from 'src/posts/dto/draft-response.dto';

export const ApiAuthenticatedEndpoint = (
  summary: string,
  successStatus: HttpStatus = 200,
  responseDto: new (...args: any[]) => any,
) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: successStatus, type: responseDto }),
    ApiUnauthorizedResponse({ type: ErrorResponseDto }),
  );
};

export const ApiUnAuthenticatedEndpoint = (
  summary: string,
  successStatus: HttpStatus = 200,
  responseDto: new (...args: any[]) => any,
) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: successStatus, type: responseDto }),
  );
};

export const ApiDraftEndpoint = (summary: string) => {
  return ApiAuthenticatedEndpoint(summary, 201, SingleDraftResponseDto);
};
