import { useState } from 'react';
import api, { refreshAccessToken } from '../api';

const useAuth = () => {
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  const refreshTokens = async () => {
    if (!authTokens?.refresh) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await refreshAccessToken(authTokens.refresh);
      const { access } = response.data;
      setAuthTokens({ ...authTokens, access });
      localStorage.setItem('authTokens', JSON.stringify({ ...authTokens, access }));
    } catch (error) {
      console.error('Failed to refresh token', error);
    }
  };

  return { authTokens, refreshTokens };
};

export default useAuth;
