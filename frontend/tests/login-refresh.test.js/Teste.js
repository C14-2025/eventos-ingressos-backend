// tests/login-refresh.test.js
import { test, expect } from '@playwright/test';

test.describe('Login com refresh', () => {
  test('deve manter o usuário logado após recarregar a página', async ({ page }) => {
    // Abre o arquivo login.html
    await page.goto('http://localhost:3333/login.html'); // ou o caminho correto do seu front

    // Preenche os campos de login
    await page.fill('#email', process.env.EMAIL);
    await page.fill('#password', process.env.PASSWORD);

    // Clica no botão de login
    await page.click('#loginButton');

    // Aguarda mensagem de sucesso
    await expect(page.locator('#message')).toHaveText('Login realizado com sucesso!', { timeout: 8000 });

    // Simula o refresh (recarrega a página)
    await page.reload();

    // Verifica se o usuário ainda está autenticado
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).not.toBeNull();
  });
});