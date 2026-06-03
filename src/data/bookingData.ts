/** Display-only deposit shown in booking summary (matches server default). */
export const bookingDepositGbp = 49

export const bookingSteps = [
  { id: 1, label: 'Service & property', short: 'Service' },
  { id: 2, label: 'Schedule', short: 'Schedule' },
  { id: 3, label: 'Details & pay', short: 'Review' },
] as const

export const serviceOptions: { name: string; description: string }[] = [
  { name: 'Patio Cleaning', description: 'Deep clean patios, slabs & outdoor living areas.' },
  { name: 'Driveway Cleaning', description: 'Remove oil stains, weeds & built-up grime.' },
  { name: 'Pressure Washing', description: 'High-pressure wash for hard exterior surfaces.' },
  { name: 'Decking Cleaning', description: 'Safe wash & revive timber or composite decking.' },
  { name: 'Pathway Cleaning', description: 'Clear moss, algae & slippery buildup on paths.' },
  { name: 'Fence Cleaning', description: 'Refresh wooden or composite fence panels.' },
  { name: 'Moss and Algae Removal', description: 'Targeted treatment for green growth & stains.' },
]
