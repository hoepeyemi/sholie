// Import Vercel KV if available
let kv: any;
try {
  // This will only work in environments where @vercel/kv is available
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const vercelKv = require('@vercel/kv');
  kv = vercelKv.kv;
} catch (error) {
  console.log('Vercel KV not available, using in-memory storage');
  kv = null;
}

// In-memory store for verification sessions (fallback when KV is not available)
// In a production app, you would use a database
interface VerificationSession {
  userId: string;
  status: 'pending' | 'verified' | 'failed';
  timestamp: number;
  userData?: any;
}

const verificationSessions: Record<string, VerificationSession> = {};

// Clean up old sessions (older than 1 hour)
const cleanupSessions = () => {
  if (kv) return; // Skip cleanup if using KV (it has its own TTL)
  
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  Object.keys(verificationSessions).forEach(userId => {
    if (now - verificationSessions[userId].timestamp > oneHour) {
      delete verificationSessions[userId];
    }
  });
};

// Run cleanup every hour (only for in-memory storage)
if (!kv) {
  setInterval(cleanupSessions, 60 * 60 * 1000);
}

export const createSession = async (userId: string): Promise<VerificationSession> => {
  const session: VerificationSession = {
    userId,
    status: 'pending',
    timestamp: Date.now(),
  };
  
  if (kv) {
    // Store in Vercel KV with 30-minute expiration
    await kv.set(userId, JSON.stringify(session), { ex: 1800 });
  } else {
    // Fallback to in-memory storage
    verificationSessions[userId] = session;
  }
  
  return session;
};

export const getSession = async (userId: string): Promise<VerificationSession | null> => {
  if (kv) {
    // Get from Vercel KV
    const sessionData = await kv.get(userId);
    return sessionData ? JSON.parse(sessionData) : null;
  } else {
    // Fallback to in-memory storage
    return verificationSessions[userId] || null;
  }
};

export const updateSession = async (
  userId: string, 
  status: 'pending' | 'verified' | 'failed',
  userData?: any
): Promise<VerificationSession | null> => {
  let session: VerificationSession | null;
  
  if (kv) {
    // Get existing session from KV
    const existingSession = await kv.get(userId);
    if (!existingSession) return null;
    
    // Update session
    session = {
      ...JSON.parse(existingSession),
      status,
      userData,
      timestamp: Date.now(),
    };
    
    // Store updated session with 30-minute expiration
    await kv.set(userId, JSON.stringify(session), { ex: 1800 });
  } else {
    // Fallback to in-memory storage
    if (!verificationSessions[userId]) return null;
    
    session = {
      ...verificationSessions[userId],
      status,
      userData,
      timestamp: Date.now(),
    };
    
    verificationSessions[userId] = session;
  }
  
  return session;
};

export const deleteSession = async (userId: string): Promise<boolean> => {
  if (kv) {
    // Delete from Vercel KV
    await kv.del(userId);
    return true;
  } else {
    // Fallback to in-memory storage
    if (!verificationSessions[userId]) {
      return false;
    }
    
    delete verificationSessions[userId];
    return true;
  }
};

// Check if a user is verified
export const isUserVerified = async (userId: string): Promise<boolean> => {
  const session = await getSession(userId);
  return session !== null && session.status === 'verified';
}; 