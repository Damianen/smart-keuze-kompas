import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getResponse() as any;

        const isJsonPaseError = typeof status?.message === 'string' &&
        status.message.includes('Expected');

        if (isJsonPaseError) {
            return response.status(400).json({
                statusCode: 400,
                message: 'Request body bevat geen geldige JSON.',
                timestamp: new Date().toISOString(),
            });
        }
        return response.status(exception.getStatus()).json({
            statusCode: exception.getStatus(),
            message: status,
            timestamp: new Date().toISOString(),
        });
    }
}