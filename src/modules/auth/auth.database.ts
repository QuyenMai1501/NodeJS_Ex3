import type { ObjectId } from "mongodb";
import type { RefreshTokenDoc } from "./auth.model.js";
import { getDb } from "../../database/mongo.js";

export type RefreshTokenEntity = RefreshTokenDoc & { _id: ObjectId };

export class AuthDatabase {
    private col() {
        return getDb().collection<RefreshTokenDoc>("refreshTokens");
    }

    async insert(doc: RefreshTokenDoc): Promise<RefreshTokenEntity> {
        const res = await this.col().insertOne(doc);
        return { ...doc, _id: res.insertedId };
    }

    async findActiveByTokenId(tokenId: string): Promise<RefreshTokenEntity | null> {
        return this.col().findOne({
            tokenId,
            revokedAt: { $exists: false },
            expiresAt: { $gt: new Date() },
        }) as Promise<RefreshTokenEntity | null>;
    }

    async revoke(tokenId: string, replaceByTokenId?: string): Promise<void> {
        await this.col().updateOne(
            { tokenId },
            {
                $set: {
                    revokedAt: new Date(),
                    ...(replaceByTokenId ? { replaceByTokenId } : {})
                }
            }
        );
    }
}