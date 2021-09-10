import axiosClient from './axiosClient';

const covid19Api = {
  getCountryInfo: () => {
    const url = '/all';
    return axiosClient.get(url);
  },

  getCountriesData: () => {
    const url = '/countries';
    return axiosClient.get(url);
  },
};

export default covid19Api;
