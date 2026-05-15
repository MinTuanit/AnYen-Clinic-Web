import axios from 'axios';
import { District, Province, Ward } from '../types/address';

const BASE_URL = 'https://provinces.open-api.vn/api/v2';

export const addressService = {
  getProvinces: async (): Promise<Province[]> => {
    const response = await axios.get(`${BASE_URL}/p/`);
    return response.data.map((e: any) => ({
      provinceCode: e.code.toString(),
      provinceName: e.name,
    }));
  },

  getDistricts: async (provinceCode: string): Promise<District[]> => {
    const response = await axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`);
    const districts = response.data?.districts || [];
    return districts.map((d: any) => ({
      districtCode: d.code.toString(),
      districtName: d.name,
    }));
  },

  getWards: async (districtCode: string): Promise<Ward[]> => {
    const response = await axios.get(`${BASE_URL}/d/${districtCode}?depth=2`);
    const wards = response.data?.wards || [];
    return wards.map((w: any) => ({
      wardCode: w.code.toString(),
      wardName: w.name,
      districtCode,
    }));
  },

  getWardsByProvince: async (provinceCode: string): Promise<Ward[]> => {
    const response = await axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`);
    const directWards = response.data?.wards || [];

    if (directWards.length > 0) {
      return directWards.map((w: any) => ({
        wardCode: w.code.toString(),
        wardName: w.name,
      }));
    }

    const districts = response.data?.districts || [];
    return districts.flatMap((d: any) => (d.wards || []).map((w: any) => ({
      wardCode: w.code.toString(),
      wardName: w.name,
      districtCode: d.code.toString(),
    })));
  },
};
