import crypto from "crypto";

const webhookTokens = [
    Buffer.from(process.env.webhookToken, 'base64'),
];

export async function reqcheck(req) {
    const receivedSignature = req.header('x-chatworkwebhooksignature');
    if (!receivedSignature) {
        return "f";
    }
    
    const contents = JSON.stringify(req.body);

    for (const token of webhookTokens) {
        const hmac = crypto.createHmac('sha256', token);
        hmac.update(contents);
        const expectedSignature = hmac.digest('base64');
        
        if (receivedSignature === expectedSignature) {
            return "ok";
        }
    }

    return "f";
}
