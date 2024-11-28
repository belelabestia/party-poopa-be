import * as err from 'modules/error';

export const hello = async (base: string) => {
  console.log('saying hello');

  try {
    const res = await fetch(`${base}/hello`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const answer = await res.json();
    console.log('saying hello succede');
    return { answer };
  }
  catch (error) {
    console.error('saying hello failed', error);
    return { error: err.coalesce(error) };
  }
};
