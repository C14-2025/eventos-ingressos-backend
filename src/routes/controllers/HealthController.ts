import { Request, Response } from 'express';

async function checkDatabase(): Promise<string> {
    return 'OK';
}

async function checkCache(): Promise<string> {
    return 'OK';
}

export class HealthController {
    public async handle(request: Request, response: Response): Promise<Response> {
        const dbStatus = await checkDatabase();
        const cacheStatus = await checkCache();

        if (dbStatus === 'OK' && cacheStatus === 'OK') {
            return response.status(200).json({
                status: 'online',
                service: 'Eventos API',
                database: dbStatus,
                cache: cacheStatus
            });
        } else {
            return response.status(503).json({
                status: 'degraded',
                database: dbStatus,
                cache: cacheStatus
            });
        }
    }
}