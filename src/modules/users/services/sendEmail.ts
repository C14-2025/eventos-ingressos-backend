const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();
async function main() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'Pipeline Executado',
    text: 'O pipeline foi executado com sucesso!',
  });

  console.log('Mensagem enviada: %s', info.messageId);
}

main().catch(console.error);
