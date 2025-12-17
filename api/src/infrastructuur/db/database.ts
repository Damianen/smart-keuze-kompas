import { MongoClient} from 'mongodb';
import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
dotenv.config();

@Module({

    providers: [
        {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                const client = new MongoClient(process.env.STRING_CONNECTION || '');
                try {
                    await client.connect();
                    return client.db(process.env.DB_NAME);
                } catch (e) {
                    console.error('Database connection error:', e);
                    throw e;
                }
            },
        },
    ],
    exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}