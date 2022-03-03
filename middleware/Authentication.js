import jwt from 'jsonwebtoken'
export const auth = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        const auth = token && token.split(' ')[1];
        console.log(req.headers)
        if (!auth)
            return res.status(401).json({ msg: "No authentication token, access denied" });
        const verified = jwt.verify(auth, process.env.JWT_SECRET);
        if (!verified)
            return res.status(401).json({ msg: "Token verification failed, authorization denied" });
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
