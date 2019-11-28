var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.ingenia.es',
    port: 25,
    secure: false, // true for 465, false for other ports
});

function sendMail(mail) {
    var mailOptions = {
        from: 'nangulo@ingenia.es',
        to: mail,
        subject: 'Cambio de Contraseña',
        text: 'Para crear una nueva contraseña vaya al siguiente enlace: http://192.168.19.116:3000/users'
    };

    console.log("sending email", mailOptions);

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("ERROR!!!!!!", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendMail };