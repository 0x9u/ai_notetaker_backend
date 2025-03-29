import { User } from '@supabase/supabase-js';
import 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user: User;
    }
}
