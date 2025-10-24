// src/stores/persons.ts
import type { Person } from '$lib/types';
import { writable } from 'svelte/store';

export const persons = writable<Person[]>([]);
