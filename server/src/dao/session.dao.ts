import { SessionModel } from "../models/session.model.js";

class SessionDao {
  async createSession(input: {
    sessionId?: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent: string;
    ipAddress: string;
  }) {
    const { sessionId, ...sessionData } = input;

    return SessionModel.create({
      ...(sessionId ? { _id: sessionId } : {}),
      ...sessionData,
    });
  }

  
}

export const sessionDao = new SessionDao();