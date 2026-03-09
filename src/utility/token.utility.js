import jwt from "jsonwebtoken";

const EncodeToken = (email, _id) => {
    const key = process.env.JWT_KEY;
    const expire = process.env.JWT_Expire_Time;

    const payload = { email, _id };
    return jwt.sign(payload, key, { expiresIn: expire });
}

const DecodeToken = (token) => {
    try {
        const key = process.env.JWT_KEY;

        const tokenDecode = jwt.verify(token, key);
        return tokenDecode;

    } catch (error) {

        return null;
    }
}
const tokenHelper = {
    EncodeToken,
    DecodeToken,
}

export default tokenHelper;

