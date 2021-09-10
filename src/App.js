import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import numeral from 'numeral';
import { prettyPrintStat, sortData } from './utils';
import Box from './components/Box';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import covid19Api from './api/covid19Api';
import './styles/index.css';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [country, setInputCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    async function fetchCountryInfo() {
      const data = await covid19Api.getCountryInfo();
      setCountryInfo(data);
    }

    fetchCountryInfo();
  }, []);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const data = await covid19Api.getCountriesData();
      const countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      let sortedData = sortData(data);
      setCountries(countries);
      setMapCountries(data);
      setTableData(sortedData);
    };

    fetchCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        countryCode === 'worldwide'
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracking</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <Box
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus Cases"
            isRed
            active={casesType === 'cases'}
            cases={prettyPrintStat(countryInfo?.todayCases)}
            total={numeral(countryInfo?.cases).format('0.0a')}
          />
          <Box
            onClick={(e) => setCasesType('recovered')}
            title="Recovered"
            active={casesType === 'recovered'}
            cases={prettyPrintStat(countryInfo?.todayRecovered)}
            total={numeral(countryInfo?.recovered).format('0.0a')}
          />
          <Box
            onClick={(e) => setCasesType('deaths')}
            title="Deaths"
            isRed
            active={casesType === 'deaths'}
            cases={prettyPrintStat(countryInfo?.todayDeaths)}
            total={numeral(countryInfo?.deaths).format('0.0a')}
          />
        </div>
        <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide New {casesType.charAt(0).toUpperCase() + casesType.slice(1)}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
