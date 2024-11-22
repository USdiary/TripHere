import React, { createContext, useContext, useState } from 'react';

const PlaceContext = createContext();

export const PlaceProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);

  const addPlace = (place) => {
    setPlaces((prev) => [...prev, place]);
  };

  return (
    <PlaceContext.Provider value={{ places, addPlace }}>
      {children}
    </PlaceContext.Provider>
  );
};

export const usePlaces = () => useContext(PlaceContext);