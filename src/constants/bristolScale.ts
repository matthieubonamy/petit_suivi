export type BristolStatus = 'ok' | 'watch' | 'alert';

export interface BristolType {
  type: number;
  description: string;
  detail: string;
  status: BristolStatus;
}

export const BRISTOL_SCALE: BristolType[] = [
  { type: 1, description: 'Petites billes dures', detail: 'Constipation sévère', status: 'alert' },
  { type: 2, description: 'En boudin bosselé', detail: 'Constipation légère', status: 'watch' },
  { type: 3, description: 'Boudin avec craquelures', detail: 'Normal', status: 'ok' },
  { type: 4, description: 'Boudin lisse et souple', detail: '✓ Idéal', status: 'ok' },
  { type: 5, description: 'Morceaux mous distincts', detail: 'À surveiller', status: 'watch' },
  { type: 6, description: 'Bouillie molle', detail: 'Diarrhée légère', status: 'watch' },
  { type: 7, description: 'Liquide sans morceaux', detail: 'Diarrhée sévère', status: 'alert' },
];

export const AGE_FREQUENCIES = [
  { age: '0–1 mois', stool: '3–8/jour', urine: '6–8 couches', note: 'Allaitement : à chaque tétée possible' },
  { age: '1–3 mois', stool: '1–4/jour', urine: '6–8 couches', note: '1/semaine possible si allaitement exclusif' },
  { age: '3–6 mois', stool: '1–2/jour', urine: '4–6 couches', note: "Variabilité normale à l'introduction des solides" },
  { age: '6–12 mois', stool: '1–2/jour', urine: '4–5 couches', note: '' },
  { age: '1–3 ans', stool: '1/jour (±)', urine: '4–6 mictions', note: "Apprentissage de la propreté" },
  { age: '3–6 ans', stool: '1/jour', urine: '5–8 mictions', note: '' },
];

export const ALERTS = {
  selles: [
    { text: 'Sang rouge vif ou mucus dans les selles', level: 'alert' as const },
    { text: 'Selles noires ou goudronneuses', level: 'alert' as const },
    { text: 'Selles blanches, grises ou décolorées', level: 'alert' as const },
    { text: 'Diarrhée >24h avec déshydratation', level: 'alert' as const },
    { text: 'Selles verdâtres persistantes (>2 jours)', level: 'watch' as const },
    { text: 'Absence de selles depuis 3–5 jours', level: 'watch' as const },
  ],
  urines: [
    { text: 'Urines roses, rouges ou brunes', level: 'alert' as const },
    { text: "Pas d'urine depuis >6h (nourrisson)", level: 'alert' as const },
    { text: 'Odeur forte et inhabituelle persistante', level: 'watch' as const },
    { text: 'Urines très concentrées régulièrement', level: 'watch' as const },
  ],
  comportement: [
    { text: 'Fièvre ≥38°C chez nourrisson <3 mois', level: 'alert' as const },
    { text: 'Fontanelle enfoncée, yeux creux, bouche sèche', level: 'alert' as const },
    { text: 'Pleurs intenses liés aux selles/urines', level: 'watch' as const },
    { text: 'Refus alimentaire + selles anormales', level: 'watch' as const },
  ],
};
