import { env } from "../../config/env.js";
import { verifyPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import type { UserDatabase } from "../user/user.database.js";
import type { AuthDatabase } from "./auth.database.js";
import type { RefreshTokenDoc } from "./auth.model.js";
import type { ObjectId } from "mongodb";

function randomTokenId(): string {
    return crypto.randomUUID();
}

function createRefreshTokenDoc(
    userId: ObjectId,
    tokenId: string,
    metadata?: { userAgent?: string; ip?: string }
): RefreshTokenDoc {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + env.refreshTokenTtlSeconds * 1000);
    return {
        userId,
        tokenId,
        issuedAt: now,
        expiresAt,
        ...(metadata?.userAgent !== undefined ? { userAgent: metadata.userAgent } : {}),
        ...(metadata?.ip !== undefined ? { ip: metadata.ip } : {}),
    };
}

function createMetadata(userAgent?: string, ip?: string): { userAgent?: string; ip?: string } {
    const metadata: { userAgent?: string; ip?: string } = {};
    if (userAgent !== undefined) metadata.userAgent = userAgent;
    if (ip !== undefined) metadata.ip = ip;
    return metadata;
}

function generateAccessToken(userId: string, role: "customer" | "admin"): string {
    return signAccessToken({
        sub: userId,
        role,
    });
}

function generateRefreshToken(userId: string, tokenId: string): string {
    return signRefreshToken({
        sub: userId,
        jti: tokenId,
    });
}

export class AuthService {
    constructor(private readonly userDb: UserDatabase, private readonly authDb: AuthDatabase) { }

    async login(input: { email: string, password: string, userAgent?: string; ip?: string }) {
        const email = input.email.trim().toLowerCase();
        const user = await this.userDb.findByEmail(email);
        if (!user) throw new ApiError(400, { message: "Invalid email" });
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok) throw new ApiError(401, { message: "Invalid password" });

        const accessToken = generateAccessToken(user._id.toString(), user.role);

        const tokenId = randomTokenId();
        
        const doc = createRefreshTokenDoc(user._id, tokenId, createMetadata(input.userAgent, input.ip));

        await this.authDb.insert(doc);

        const refreshToken = generateRefreshToken(user._id.toString(), tokenId);

        return { accessToken, refreshToken };
    }

    async logout(refreshToken: string) {
        let payload: { sub: string, jti: string };
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            return;
        }
        await this.authDb.revoke(payload.jti);
    }

    async refresh(refreshToken: string) {
        let payload: { sub: string, jti: string };
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            throw new ApiError(401, { message: "Invalid or expired Refresh Token" });
        }
        const active = await this.authDb.findActiveByTokenId(payload.jti);
        if (!active) {
            throw new ApiError(401, { message: "Refresh Token not found or Already revoked" });
        }

        const user = await this.userDb.findById(payload.sub);
        if (!user) {
            throw new ApiError(401, { message: "User is no longer exists" });
        }

        const newTokenId = randomTokenId();
        const doc = createRefreshTokenDoc(user._id, newTokenId, createMetadata(active.userAgent, active.ip));

        await this.authDb.insert(doc);
        await this.authDb.revoke(payload.jti, newTokenId);

        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const newRefreshToken = generateRefreshToken(user._id.toString(), newTokenId);

        return { accessToken, refreshToken: newRefreshToken };
    }
}