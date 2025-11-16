export const getSessionId = (): string => {
  let sessionId = localStorage.getItem("cartSessionId");

  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("cartSessionId", sessionId);
    console.log("🆕 Created new session:", sessionId);
  } else {
    console.log("♻️ Using existing session:", sessionId);
  }

  return sessionId;
};

export const getUserId = (): string | null => {
  // For now return null (anonymous user)
  return null;
};
