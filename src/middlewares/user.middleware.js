import tokenHelper from "../utility/token.utility.js"

const userValidation =  (req, res, next) => {
    const token = req.cookies['user-token'];
    const decoded = tokenHelper.DecodeToken(token);

    if(decoded === null){
        return res.status(401).json({
            status: 401,
            message: 'Invalid token',
        });
    } else {
        const email = decoded['email'];
        const _id = decoded['_id'];

        req.header.email = email;
        req.header._id = _id;

        next();
    }
}

export default userValidation;