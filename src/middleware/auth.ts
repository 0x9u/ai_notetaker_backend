import { supabase } from '@/db/supabase';
import { NextFunction, Request, Response } from 'express';

 async function middlewareAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    const token = authHeader.split(' ')[1];

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);

    if (error) {
        console.error('from middleware auth', error);
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    req.user = user;

    next();
}

export default middlewareAuth;
