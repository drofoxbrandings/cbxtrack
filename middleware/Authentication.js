import jwt from 'jsonwebtoken'
export const auth = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        const auth = token && token.split(' ')[1];
        if (!auth)
            return res.status(401).send("No authentication token, access denied");
//            return res.send(401, { error: "some elaborate error message"});
        const verified = jwt.verify(auth, process.env.JWT_SECRET);
        if (!verified)
            return res.status(401).json({ message: "Token verification failed, authorization denied" });
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
