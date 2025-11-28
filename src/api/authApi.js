const API_BASE_URL = 'http://localhost:8080/api';

export const signup = async (userId, userName, userPassword, userBirth) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
          userPassword,
          userBirth,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '회원가입에 실패했습니다.');
      }
  
      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

export const login = async (userId, userPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userPassword,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || '로그인에 실패했습니다.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};