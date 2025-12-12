import { MongoClient} from 'mongodb';
import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
dotenv.config();
// Replace the uri string with your MongoDB deployment's connection string.

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@db.jwngav9.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

@Module({
    providers: [
        {
            provide: 'DATABASE_CONNECTION',
            useFactory: async () => {
                const client = new MongoClient(uri);
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