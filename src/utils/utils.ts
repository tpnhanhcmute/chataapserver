import crypto from 'crypto';
const randomNumber = function randomNumber(length:number) : String {
    let numberRandom:String = ""
    for (let i = 0; i < length; i++) {
       let per =  Math.floor(Math.random() * (9 - 0 + 1)) + 0;
       numberRandom +=per.toString()
    }
    return numberRandom
}

const hashMessage =async function hashMessage(message: String): Promise<String> {
    const hash = crypto.createHash('sha256');
    hash.update(message.toString());
    const hashedMessage = hash.digest('hex');
    return hashedMessage;
}
export default {randomNumber,hashMessage}