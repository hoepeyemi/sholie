import { NextApiRequest, NextApiResponse } from 'next';
import { SelfBackendVerifier, getUserIdentifier } from '@selfxyz/core';
import { updateSession, getSession, createSession } from '../../../utils/selfVerification';

// Initialize Self Backend Verifier with your app scope
const selfBackendVerifier = new SelfBackendVerifier(
  process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org', // Celo RPC url
  process.env.NEXT_PUBLIC_SELF_SCOPE || 'core-battle-arena' // Must match the scope used in the frontend
);

// Configure verification options
selfBackendVerifier.setMinimumAge(18);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the proof and publicSignals from the request body
    const { proof, publicSignals } = req.body;

    if (!proof || !publicSignals) {
      return res.status(400).json({ error: 'Missing proof or publicSignals' });
    }

    // Extract user ID from the proof
    const userId = await getUserIdentifier(publicSignals);
    console.log("Extracted userId:", userId);

    // Create or get the session for this user
    let session = getSession(userId);
    if (!session) {
      session = createSession(userId);
    }

    // Verify the proof
    const result = await selfBackendVerifier.verify(proof, publicSignals);
    
    if (result.isValid) {
      // Update the session status to verified
      updateSession(userId, 'verified', result.credentialSubject);
      
      // Return successful verification response
      return res.status(200).json({
        status: 'success',
        result: true,
        credentialSubject: result.credentialSubject
      });
    } else {
      // Update the session status to failed
      updateSession(userId, 'failed');
      
      // Return failed verification response
      return res.status(400).json({
        status: 'error',
        result: false,
        message: 'Verification failed',
        details: result.isValidDetails
      });
    }
  } catch (error) {
    console.error('Error verifying proof:', error);
    return res.status(500).json({
      status: 'error',
      result: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
} 