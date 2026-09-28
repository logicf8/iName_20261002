//app\calcPage\susRailCalc\config\constants.js
// Konfiguration för alla tre materialtyper
export const MATERIAL_CONFIGS = {
  RAIL: {
    id: 'RAIL',
    shortTitle: 'Skena',
    title: 'Upphängningsskenor',
    length: 2000,
    unit: 'mm'
  },
  PLINTH: {
    id: 'PLINTH',
    shortTitle: 'Sockel',
    title: 'Sockelar',
    length: 2200,
    unit: 'mm'
  },
  MOLDING: {
    id: 'MOLDING',
    shortTitle: 'Dekor-/krönlist',
    title: 'Dekor-/krönlister',
    length: 2210,
    unit: 'mm'
  }
};

// 15 unika och välkontrasterade färger som återanvänds mellan materialen
export const PROFILE_COLORS = [
  '#2b6cb0', // Blå
  '#2f855a', // Grön
  '#c53030', // Röd
  '#d69e2e', // Gul/Guld
  '#805ad5', // Lila
  '#dd6b20', // Orange
  '#319795', // Teal
  '#d53f8c', // Rosa
  '#4a5568', // Mörkgrå
  '#718096', // Skiffer
  '#2c5282', // Mörkblå
  '#276749', // Mörkgrön
  '#9b2c2c', // Mörkröd
  '#975a16', // Mörkgul/Brun
  '#6b46c1'  // Mörklila
];