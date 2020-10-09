const config = require('./data/client.json')
const request = require('request')

function sendemail() {
    request.post({
        uri: `https://api.eu.mailgun.net/v3/${config.mailgunDomain}/messages`,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Basic ${config.mailgunApiKey}`
        },
        formData:{
            'from': `noreply@${mailgunDomain}`,
            'to': sendTo,
            'subject': emailSubject,
            'html': emailBodyHtml
        }
    })
}

module.exports = { sendemail}