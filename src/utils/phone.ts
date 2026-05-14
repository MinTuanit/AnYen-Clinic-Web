export const DEFAULT_COUNTRY_CODE = '+84';

export const countryCodes = [
  { code: '+84', flag: 'https://flagcdn.com/w20/vn.png', name: 'VN' },
  { code: '+1', flag: 'https://flagcdn.com/w20/us.png', name: 'US' },
  { code: '+44', flag: 'https://flagcdn.com/w20/gb.png', name: 'UK' },
  { code: '+33', flag: 'https://flagcdn.com/w20/fr.png', name: 'FR' },
  { code: '+49', flag: 'https://flagcdn.com/w20/de.png', name: 'DE' },
];

export const splitPhoneNumber = (phoneNumber?: string | null) => {
  const rawPhone = String(phoneNumber || '').trim().replace(/\s+/g, '');
  const matchedCountry = [...countryCodes]
    .sort((a, b) => b.code.length - a.code.length)
    .find((country) => rawPhone.startsWith(country.code));

  if (matchedCountry) {
    return {
      countryCode: matchedCountry.code,
      nationalNumber: rawPhone.slice(matchedCountry.code.length),
    };
  }

  return {
    countryCode: DEFAULT_COUNTRY_CODE,
    nationalNumber: rawPhone,
  };
};

export const formatPhoneWithCountryCode = (
  countryCode: string = DEFAULT_COUNTRY_CODE,
  phoneNumber?: string | null,
) => {
  const selectedCode = countryCode || DEFAULT_COUNTRY_CODE;
  const codeDigits = selectedCode.replace('+', '');
  const rawPhone = String(phoneNumber || '').trim().replace(/\s+/g, '');

  if (!rawPhone) return '';
  if (rawPhone.startsWith('+')) return rawPhone;
  if (rawPhone.startsWith(codeDigits)) return `+${rawPhone}`;
  if (rawPhone.startsWith('0')) return `${selectedCode}${rawPhone.slice(1)}`;
  return `${selectedCode}${rawPhone}`;
};
