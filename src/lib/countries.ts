// Countries with their cities - Gulf and European countries
export interface CountryOption {
  value: string;
  label: string;
}

export interface CityOption {
  value: string;
  label: string;
}

export const COUNTRIES: CountryOption[] = [
  // Pakistan (Default)
  { value: 'Pakistan', label: 'Pakistan' },
  
  // Gulf Countries
  { value: 'UAE', label: 'United Arab Emirates' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'Oman', label: 'Oman' },
  
  // European Countries
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Norway', label: 'Norway' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'Finland', label: 'Finland' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Greece', label: 'Greece' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Czech Republic', label: 'Czech Republic' },
].sort((a, b) => {
  // Keep Pakistan first
  if (a.value === 'Pakistan') return -1;
  if (b.value === 'Pakistan') return 1;
  return a.label.localeCompare(b.label);
});

export const CITIES_BY_COUNTRY: Record<string, CityOption[]> = {
  // Pakistan Cities
  'Pakistan': [
    // Punjab Cities
    { value: 'Lahore', label: 'Lahore' },
    { value: 'Faisalabad', label: 'Faisalabad' },
    { value: 'Multan', label: 'Multan' },
    { value: 'Rawalpindi', label: 'Rawalpindi' },
    { value: 'Gujranwala', label: 'Gujranwala' },
    { value: 'Sialkot', label: 'Sialkot' },
    { value: 'Bahawalpur', label: 'Bahawalpur' },
    { value: 'Sargodha', label: 'Sargodha' },
    { value: 'Jhelum', label: 'Jhelum' },
    { value: 'Gujrat', label: 'Gujrat' },
    { value: 'Sheikhupura', label: 'Sheikhupura' },
    { value: 'Sahiwal', label: 'Sahiwal' },
    { value: 'Okara', label: 'Okara' },
    // Sindh Cities
    { value: 'Karachi', label: 'Karachi' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Sukkur', label: 'Sukkur' },
    { value: 'Larkana', label: 'Larkana' },
    { value: 'Nawabshah', label: 'Nawabshah' },
    // KPK Cities
    { value: 'Peshawar', label: 'Peshawar' },
    { value: 'Mardan', label: 'Mardan' },
    { value: 'Abbottabad', label: 'Abbottabad' },
    { value: 'Swat', label: 'Swat' },
    { value: 'Mansehra', label: 'Mansehra' },
    // Balochistan Cities
    { value: 'Quetta', label: 'Quetta' },
    { value: 'Turbat', label: 'Turbat' },
    { value: 'Gwadar', label: 'Gwadar' },
    // Islamabad
    { value: 'Islamabad', label: 'Islamabad' },
    // Gilgit-Baltistan
    { value: 'Gilgit', label: 'Gilgit' },
    { value: 'Skardu', label: 'Skardu' },
    { value: 'Hunza', label: 'Hunza' },
    // Azad Kashmir
    { value: 'Muzaffarabad', label: 'Muzaffarabad' },
    { value: 'Mirpur', label: 'Mirpur' },
    { value: 'Rawalakot', label: 'Rawalakot' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // UAE Cities
  'UAE': [
    { value: 'Dubai', label: 'Dubai' },
    { value: 'Abu Dhabi', label: 'Abu Dhabi' },
    { value: 'Sharjah', label: 'Sharjah' },
    { value: 'Ajman', label: 'Ajman' },
    { value: 'Ras Al Khaimah', label: 'Ras Al Khaimah' },
    { value: 'Fujairah', label: 'Fujairah' },
    { value: 'Umm Al Quwain', label: 'Umm Al Quwain' },
    { value: 'Al Ain', label: 'Al Ain' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Saudi Arabia Cities
  'Saudi Arabia': [
    { value: 'Riyadh', label: 'Riyadh' },
    { value: 'Jeddah', label: 'Jeddah' },
    { value: 'Makkah', label: 'Makkah' },
    { value: 'Madinah', label: 'Madinah' },
    { value: 'Dammam', label: 'Dammam' },
    { value: 'Dhahran', label: 'Dhahran' },
    { value: 'Khobar', label: 'Khobar' },
    { value: 'Tabuk', label: 'Tabuk' },
    { value: 'Abha', label: 'Abha' },
    { value: 'Taif', label: 'Taif' },
    { value: 'Jubail', label: 'Jubail' },
    { value: 'Yanbu', label: 'Yanbu' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Qatar Cities
  'Qatar': [
    { value: 'Doha', label: 'Doha' },
    { value: 'Al Wakrah', label: 'Al Wakrah' },
    { value: 'Al Khor', label: 'Al Khor' },
    { value: 'Al Rayyan', label: 'Al Rayyan' },
    { value: 'Lusail', label: 'Lusail' },
    { value: 'Dukhan', label: 'Dukhan' },
    { value: 'Mesaieed', label: 'Mesaieed' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Kuwait Cities
  'Kuwait': [
    { value: 'Kuwait City', label: 'Kuwait City' },
    { value: 'Hawalli', label: 'Hawalli' },
    { value: 'Salmiya', label: 'Salmiya' },
    { value: 'Farwaniya', label: 'Farwaniya' },
    { value: 'Fahaheel', label: 'Fahaheel' },
    { value: 'Jahra', label: 'Jahra' },
    { value: 'Ahmadi', label: 'Ahmadi' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Bahrain Cities
  'Bahrain': [
    { value: 'Manama', label: 'Manama' },
    { value: 'Riffa', label: 'Riffa' },
    { value: 'Muharraq', label: 'Muharraq' },
    { value: 'Hamad Town', label: 'Hamad Town' },
    { value: 'Isa Town', label: 'Isa Town' },
    { value: 'Sitra', label: 'Sitra' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Oman Cities
  'Oman': [
    { value: 'Muscat', label: 'Muscat' },
    { value: 'Salalah', label: 'Salalah' },
    { value: 'Sohar', label: 'Sohar' },
    { value: 'Nizwa', label: 'Nizwa' },
    { value: 'Sur', label: 'Sur' },
    { value: 'Barka', label: 'Barka' },
    { value: 'Ibri', label: 'Ibri' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // United Kingdom Cities
  'United Kingdom': [
    { value: 'London', label: 'London' },
    { value: 'Manchester', label: 'Manchester' },
    { value: 'Birmingham', label: 'Birmingham' },
    { value: 'Leeds', label: 'Leeds' },
    { value: 'Glasgow', label: 'Glasgow' },
    { value: 'Liverpool', label: 'Liverpool' },
    { value: 'Edinburgh', label: 'Edinburgh' },
    { value: 'Bristol', label: 'Bristol' },
    { value: 'Sheffield', label: 'Sheffield' },
    { value: 'Newcastle', label: 'Newcastle' },
    { value: 'Nottingham', label: 'Nottingham' },
    { value: 'Cardiff', label: 'Cardiff' },
    { value: 'Belfast', label: 'Belfast' },
    { value: 'Leicester', label: 'Leicester' },
    { value: 'Bradford', label: 'Bradford' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Germany Cities
  'Germany': [
    { value: 'Berlin', label: 'Berlin' },
    { value: 'Munich', label: 'Munich' },
    { value: 'Hamburg', label: 'Hamburg' },
    { value: 'Frankfurt', label: 'Frankfurt' },
    { value: 'Cologne', label: 'Cologne' },
    { value: 'Düsseldorf', label: 'Düsseldorf' },
    { value: 'Stuttgart', label: 'Stuttgart' },
    { value: 'Dortmund', label: 'Dortmund' },
    { value: 'Essen', label: 'Essen' },
    { value: 'Leipzig', label: 'Leipzig' },
    { value: 'Bremen', label: 'Bremen' },
    { value: 'Dresden', label: 'Dresden' },
    { value: 'Hannover', label: 'Hannover' },
    { value: 'Nuremberg', label: 'Nuremberg' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // France Cities
  'France': [
    { value: 'Paris', label: 'Paris' },
    { value: 'Marseille', label: 'Marseille' },
    { value: 'Lyon', label: 'Lyon' },
    { value: 'Toulouse', label: 'Toulouse' },
    { value: 'Nice', label: 'Nice' },
    { value: 'Nantes', label: 'Nantes' },
    { value: 'Strasbourg', label: 'Strasbourg' },
    { value: 'Montpellier', label: 'Montpellier' },
    { value: 'Bordeaux', label: 'Bordeaux' },
    { value: 'Lille', label: 'Lille' },
    { value: 'Rennes', label: 'Rennes' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Italy Cities
  'Italy': [
    { value: 'Rome', label: 'Rome' },
    { value: 'Milan', label: 'Milan' },
    { value: 'Naples', label: 'Naples' },
    { value: 'Turin', label: 'Turin' },
    { value: 'Florence', label: 'Florence' },
    { value: 'Venice', label: 'Venice' },
    { value: 'Bologna', label: 'Bologna' },
    { value: 'Genoa', label: 'Genoa' },
    { value: 'Palermo', label: 'Palermo' },
    { value: 'Verona', label: 'Verona' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Spain Cities
  'Spain': [
    { value: 'Madrid', label: 'Madrid' },
    { value: 'Barcelona', label: 'Barcelona' },
    { value: 'Valencia', label: 'Valencia' },
    { value: 'Seville', label: 'Seville' },
    { value: 'Zaragoza', label: 'Zaragoza' },
    { value: 'Malaga', label: 'Malaga' },
    { value: 'Murcia', label: 'Murcia' },
    { value: 'Bilbao', label: 'Bilbao' },
    { value: 'Alicante', label: 'Alicante' },
    { value: 'Cordoba', label: 'Cordoba' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Netherlands Cities
  'Netherlands': [
    { value: 'Amsterdam', label: 'Amsterdam' },
    { value: 'Rotterdam', label: 'Rotterdam' },
    { value: 'The Hague', label: 'The Hague' },
    { value: 'Utrecht', label: 'Utrecht' },
    { value: 'Eindhoven', label: 'Eindhoven' },
    { value: 'Tilburg', label: 'Tilburg' },
    { value: 'Groningen', label: 'Groningen' },
    { value: 'Breda', label: 'Breda' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Belgium Cities
  'Belgium': [
    { value: 'Brussels', label: 'Brussels' },
    { value: 'Antwerp', label: 'Antwerp' },
    { value: 'Ghent', label: 'Ghent' },
    { value: 'Bruges', label: 'Bruges' },
    { value: 'Liege', label: 'Liege' },
    { value: 'Charleroi', label: 'Charleroi' },
    { value: 'Namur', label: 'Namur' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Sweden Cities
  'Sweden': [
    { value: 'Stockholm', label: 'Stockholm' },
    { value: 'Gothenburg', label: 'Gothenburg' },
    { value: 'Malmo', label: 'Malmo' },
    { value: 'Uppsala', label: 'Uppsala' },
    { value: 'Vasteras', label: 'Vasteras' },
    { value: 'Orebro', label: 'Orebro' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Norway Cities
  'Norway': [
    { value: 'Oslo', label: 'Oslo' },
    { value: 'Bergen', label: 'Bergen' },
    { value: 'Trondheim', label: 'Trondheim' },
    { value: 'Stavanger', label: 'Stavanger' },
    { value: 'Drammen', label: 'Drammen' },
    { value: 'Kristiansand', label: 'Kristiansand' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Denmark Cities
  'Denmark': [
    { value: 'Copenhagen', label: 'Copenhagen' },
    { value: 'Aarhus', label: 'Aarhus' },
    { value: 'Odense', label: 'Odense' },
    { value: 'Aalborg', label: 'Aalborg' },
    { value: 'Esbjerg', label: 'Esbjerg' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Finland Cities
  'Finland': [
    { value: 'Helsinki', label: 'Helsinki' },
    { value: 'Espoo', label: 'Espoo' },
    { value: 'Tampere', label: 'Tampere' },
    { value: 'Vantaa', label: 'Vantaa' },
    { value: 'Oulu', label: 'Oulu' },
    { value: 'Turku', label: 'Turku' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Ireland Cities
  'Ireland': [
    { value: 'Dublin', label: 'Dublin' },
    { value: 'Cork', label: 'Cork' },
    { value: 'Limerick', label: 'Limerick' },
    { value: 'Galway', label: 'Galway' },
    { value: 'Waterford', label: 'Waterford' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Austria Cities
  'Austria': [
    { value: 'Vienna', label: 'Vienna' },
    { value: 'Graz', label: 'Graz' },
    { value: 'Linz', label: 'Linz' },
    { value: 'Salzburg', label: 'Salzburg' },
    { value: 'Innsbruck', label: 'Innsbruck' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Switzerland Cities
  'Switzerland': [
    { value: 'Zurich', label: 'Zurich' },
    { value: 'Geneva', label: 'Geneva' },
    { value: 'Basel', label: 'Basel' },
    { value: 'Bern', label: 'Bern' },
    { value: 'Lausanne', label: 'Lausanne' },
    { value: 'Winterthur', label: 'Winterthur' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Portugal Cities
  'Portugal': [
    { value: 'Lisbon', label: 'Lisbon' },
    { value: 'Porto', label: 'Porto' },
    { value: 'Braga', label: 'Braga' },
    { value: 'Coimbra', label: 'Coimbra' },
    { value: 'Faro', label: 'Faro' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Greece Cities
  'Greece': [
    { value: 'Athens', label: 'Athens' },
    { value: 'Thessaloniki', label: 'Thessaloniki' },
    { value: 'Patras', label: 'Patras' },
    { value: 'Heraklion', label: 'Heraklion' },
    { value: 'Larissa', label: 'Larissa' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Poland Cities
  'Poland': [
    { value: 'Warsaw', label: 'Warsaw' },
    { value: 'Krakow', label: 'Krakow' },
    { value: 'Lodz', label: 'Lodz' },
    { value: 'Wroclaw', label: 'Wroclaw' },
    { value: 'Poznan', label: 'Poznan' },
    { value: 'Gdansk', label: 'Gdansk' },
  ].sort((a, b) => a.label.localeCompare(b.label)),

  // Czech Republic Cities
  'Czech Republic': [
    { value: 'Prague', label: 'Prague' },
    { value: 'Brno', label: 'Brno' },
    { value: 'Ostrava', label: 'Ostrava' },
    { value: 'Plzen', label: 'Plzen' },
    { value: 'Liberec', label: 'Liberec' },
  ].sort((a, b) => a.label.localeCompare(b.label)),
};

// Helper function to get cities for a country
export const getCitiesForCountry = (country: string): CityOption[] => {
  return CITIES_BY_COUNTRY[country] || [];
};

// Default country
export const DEFAULT_COUNTRY = 'Pakistan';
