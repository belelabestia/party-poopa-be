import { Json } from 'modules/core';
import * as err from 'modules/error';

type Person = {
  id: number,
  data: Json | null
};

export const getAllPeople = async (base: string, cookies: string[]) => {
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
    return { people };
  }
  catch (error) {
    console.error('getting all people failed', error);
    return { error: err.coalesce(error) };
  }
};

export const addPerson = async (base: string, data: Json | null, cookies: string[]) => {
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
    return { id };
  }
  catch (error) {
    console.error('adding person failed', error);
    return { error: err.coalesce(error) };
  }
};

export const updatePerson = async (base: string, id: number, data: Json | null, cookies: string[]) => {
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
  }
  catch (error) {
    console.error('updating person failed', error);
    return err.coalesce(error);
  }
};

export const deletePerson = async (base: string, id: number, cookies: string[]) => {
  console.log('updating person');

  try {
    await fetch(`${base}/people/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies.join('; ')
      }
    });
  }
  catch (error) {
    console.error('updating person failed', error);
    return err.coalesce(error);
  }
};
