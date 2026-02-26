const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método não permitido' };
    }

    try {
        const dados = JSON.parse(event.body);

        // 1. Salvar na Planilha
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

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Oba! Presença confirmada. 🎉" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};