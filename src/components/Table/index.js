import React from 'react';
import numeral from 'numeral';
import './styles.css';

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map((country, index) => (
        <div key={index}>
          <strong>{country.country}</strong>
          <strong>{numeral(country.cases).format('0,0')}</strong>
        </div>
      ))}
    </div>
  );
}

export default Table;
