export const TEMPERATURE = {
  MIN: -20,
  MAX: 40,
  STEP: 1,
  UNIT: '°C'
} as const;

export const WEATHER_CONDITIONS = {
  NONE: 'none',
  TEMPERATURE: 'temp',
  CONDITION: 'condition'
} as const;

export const TEMPERATURE_OPERATORS = {
  ABOVE: 'above',
  BELOW: 'below'
} as const; 