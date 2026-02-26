const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const dados = req.body;

    try {
        // 1. Salvar na Planilha (Sheet.best)
        await fetch('https://api.sheetbest.com/sheets/f7270ca8-0a06-4fed-9f19-e88532c62707', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        // 2. Enviar E-mail
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        await transporter.sendMail({
            from: `"Convite Online" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `Nova Confirmação: ${dados.Crianca}`,
            text: `A criança ${dados.Crianca} confirmou presença!\nResponsável: ${dados.Responsavel}\nTelefone: ${dados.Telefone}`
        });

        return res.status(200).json({ status: 'Sucesso' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}