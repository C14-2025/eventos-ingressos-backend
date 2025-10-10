import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ShowUserService } from '@modules/users/services/showUser/ShowUserService';

export class ShowSelfUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      // JWKS (express-jwt) normalmente coloca o ID do user em request.auth.payload.sub
      const userId = (request as any).auth?.payload?.sub;

      if (!userId) {
        return response.status(401).json({
          status: 'error',
          message: 'Usuário não autenticado.',
        });
      }

      const showUserService = container.resolve(ShowUserService);
      const user = await showUserService.execute(userId);


      return response.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      console.error('Erro em ShowSelfUserController:', error);
      return response.status(500).json({
        status: 'error',
        message: 'Erro ao buscar informações do usuário.',
      });
    }
  }
}
