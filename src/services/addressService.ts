import axios from 'axios';
import { Province, Ward } from '../types/address';

const BASE_URL = 'https://provinces.open-api.vn/api/v2';

export const addressService = {
  getProvinces: async (): Promise<Province[]> => {
    const response = await axios.get(`${BASE_URL}/p/`);
    return response.data.map((e: any) => ({
      provinceCode: e.code.toString(),
      provinceName: e.name,
    }));
  },

  getWards: async (districtCode: string): Promise<Ward[]> => {
    const response = await axios.get(`${BASE_URL}/w?district_code=${districtCode}`);
    return response.data.map((w: any) => ({
      wardCode: w.code.toString(),
      wardName: w.name,
    }));
  },
};
