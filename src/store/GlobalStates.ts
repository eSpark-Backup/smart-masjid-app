import { atom } from 'jotai';

{
  /**
//* remove this code just used for testing state management
*/
}

const countAtom = atom(4);
const countryAtom = atom('Japan');
const citiesAtom = atom(['Tokyo', 'Kyoto', 'Osaka']);
const mangaAtom = atom({
  'Dragon Ball': 1984,
  'One Piece': 1997,
  Naruto: 1999,
});
const userAtom = atom<{ devId?: string }>({ devId: undefined });

export { countAtom, countryAtom, citiesAtom, mangaAtom, userAtom };
