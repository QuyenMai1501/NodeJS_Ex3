import { env } from "../../config/env.js";
import { verifyPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
function randomTokenId() {
    return crypto.randomUUID();
}
function createRefreshTokenDoc(userId, tokenId, metadata) {
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
function createMetadata(userAgent, ip) {
    const metadata = {};
    if (userAgent !== undefined)
        metadata.userAgent = userAgent;
    if (ip !== undefined)
        metadata.ip = ip;
    return metadata;
}
function generateAccessToken(userId, role) {
    return signAccessToken({
        sub: userId,
        role,
    });
}
function generateRefreshToken(userId, tokenId) {
    return signRefreshToken({
        sub: userId,
        jti: tokenId,
    });
}
export class AuthService {
    userDb;
    authDb;
    constructor(userDb, authDb) {
        this.userDb = userDb;
        this.authDb = authDb;
    }
    async login(input) {
        const email = input.email.trim().toLowerCase();
        const user = await this.userDb.findByEmail(email);
        if (!user)
            throw new ApiError(400, { message: "Invalid email" });
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok)
            throw new ApiError(401, { message: "Invalid password" });
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const tokenId = randomTokenId();
        const doc = createRefreshTokenDoc(user._id, tokenId, createMetadata(input.userAgent, input.ip));
        await this.authDb.insert(doc);
        const refreshToken = generateRefreshToken(user._id.toString(), tokenId);
        return { accessToken, refreshToken };
    }
    async logout(refreshToken) {
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        }
        catch {
            return;
        }
        await this.authDb.revoke(payload.jti);
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        }
        catch {
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
//# sourceMappingURL=auth.service.js.map