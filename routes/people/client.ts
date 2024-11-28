import { Json } from 'modules/core';
import * as err from 'modules/error';

type Person = {
  id: number,
  data: Json | null
};

export const getAllPeople = async (cookies: string[], base: string) => {
  console.log('fetching all people');

  try {
    const res = await fetch(`${base}/people`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies.join('; ')
      }
    });

    const people = await res.json() as Person[];
    console.log('all people fetched');
    return { people };
  }
  catch (error) {
    console.error('fetching all people failed', error);
    return { error: err.coalesce(error) };
  }
};

export const addPerson = async (data: Json | null, cookies: string[], base: string) => {
  console.log('adding person');

  try {
    const res = await fetch(`${base}/people`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies.join('; ')
      },
      body: data ? JSON.stringify(data) : undefined
    });

    const { id } = await res.json() as { id: number };
    console.log('adding person succeded');
    return { id };
  }
  catch (error) {
    console.error('adding person failed', error);
    return { error: err.coalesce(error) };
  }
};

export const updatePerson = async (id: number, data: Json | null, cookies: string[], base: string) => {
  console.log('updating person');

  try {
    await fetch(`${base}/people/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies.join('; ')
      },
      body: data ? JSON.stringify(data) : undefined
    });

    console.log('updating person succeded');
  }
  catch (error) {
    console.error('updating person failed', error);
    return err.coalesce(error);
  }
};

export const deletePerson = async (id: number, cookies: string[], base: string) => {
  console.log('updating person');

  try {
    await fetch(`${base}/people/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies.join('; ')
      }
    });

    console.log('updating person succeded');
  }
  catch (error) {
    console.error('updating person failed', error);
    return err.coalesce(error);
  }
};
