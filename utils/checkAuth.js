import jwt from 'jsonwebtoken';

export default (req, res, next)=>{
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'alexander_genius');
            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(403).json({
                message:'Чето с токеном',
            })
        }
        
    } else {
        return res.status(403).json({
            message:'Нет доступа',
        })
    }

}