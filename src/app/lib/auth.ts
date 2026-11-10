import {betterAuth} from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import {db} from '../../db/index';
import * as schema from '../../db/schema'
export const auth = betterAuth({
    database: drizzleAdapter(db,{
        provider:"pg",
        schema:schema
    }),
    emailAndPassword :{
        enabled:true
    },
    rateLimit:{
        enabled:true,
        storage:"database",
        window:10,
        max:100,
        customRules:{
            "/sign-in/email":{window:10,max:5},
            "/sign-up/email":{window:10,max:5},
        }
    }
});
