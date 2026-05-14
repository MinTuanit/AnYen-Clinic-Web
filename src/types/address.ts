export interface Address {
  id: string;
  province_code: string;
  province_name: string | null;
  district_code?: string | null;
  district_name?: string | null;
  ward_code: string;
  ward_name: string | null;
  street: string;
}

export interface Province {
  provinceCode: string;
  provinceName: string;
}

export interface District {
  districtCode: string;
  districtName: string;
}

export interface Ward {
  wardCode: string;
  wardName: string;
  districtCode?: string;
}
