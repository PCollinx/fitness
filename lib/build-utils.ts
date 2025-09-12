/**
 * Utilities to help with build-time vs runtime database access
 */

// Used to determine if we're in a build environment
export const isBuildTime = () => {
  return (
    process.env.NODE_ENV === 'production' && 
    (process.env.NEXT_PHASE === 'phase-production-build' || 
     process.env.VERCEL_ENV === 'production')
  );
};

// Database access wrapper for build vs runtime
export const withDatabaseAccess = async <T>(
  buildFallback: T,
  runtimeFunction: () => Promise<T>
): Promise<T> => {
  // During build time, return fallback data to avoid database access
  if (isBuildTime()) {
    console.log('Build-time detected: Using fallback data instead of database access');
    return buildFallback;
  }

  try {
    // During runtime, execute the database function
    return await runtimeFunction();
  } catch (error) {
    console.error('Database access error:', error);
    // If database access fails at runtime, still return fallback
    return buildFallback;
  }
};