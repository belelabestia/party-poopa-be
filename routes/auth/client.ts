type Admin = { username: string, password: string };

export const register = async (base: string, data: Admin) => {
  console.log('calling register endpoint');

  try {
    const res = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // todo: type this
    const payload = await res.json();
    return { payload };
  }
  catch (error) {
    console.error('register request failed', error);
    return { error };
  }
};

export const login = async (base: string, data: Admin) => {
  console.log('calling login endpoint');

  try {
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const cookies = res.headers.getSetCookie();
    return { cookies };
  }
  catch (error) {
    console.error('login request failed', error);
    return { error };
  }
};
