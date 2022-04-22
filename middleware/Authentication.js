import jwt from 'jsonwebtoken'
export const auth = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        const auth = token && token.split(' ')[1];
        if (!auth)
            return res.json({ status: '401', message: "No authentication token, access denied" });
        const verified = jwt.verify(auth, process.env.JWT_SECRET);
        if (!verified)
            return res.json({ status: "401", message: "Token verification failed, authorization denied" });
        req.user = verified.id;
        next();
    } catch (err) {
        res.json({ status: "500", message: err.message });
    }
}
