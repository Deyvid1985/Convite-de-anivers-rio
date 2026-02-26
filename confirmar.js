const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // No Netlify, verificamos o método via event.httpMethod
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido' })
        };
    }

    try {
        // No Netlify, os dados chegam como string no event.body
        const dados = JSON.parse(event.body);

        // 1. Salvar na Planilha (Sheet.best)
        await fetch('https://api.sheetbest.com/sheets/f7270ca8-0a06-4fed-9f19-e88532c62707', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        // 2. Configurar o transporte de E-mail
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        // 3. Enviar o E-mail
        await transporter.sendMail({
            from: `"Convite Online" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `Nova Confirmação: ${dados.Crianca}`,
            text: `A criança ${dados.Crianca} confirmou presença!\nResponsável: ${dados.Responsavel}\nTelefone: ${dados.Telefone}`
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'Sucesso' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};