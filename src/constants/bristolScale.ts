export type BristolStatus = 'ok' | 'watch' | 'alert';

export interface BristolType {
  type: number;
  description: string;
  detail: string;
  comment: string;   // courte étiquette clinique
  medical: string;   // explication pour les parents
  status: BristolStatus;
  urgent?: boolean;
}

export const BRISTOL_SCALE: BristolType[] = [
  {
    type: 1,
    description: 'Petites billes dures',
    detail: 'Constipation sévère',
    comment: 'Constipation sévère — transit très lent',
    medical:
      "Selles en petites billes sèches et dures, difficiles à évacuer et parfois douloureuses. " +
      "Signe d'un transit très ralenti (>3 jours). " +
      "Causes fréquentes : manque de fibres, déshydratation, sédentarité. " +
      "Chez le nourrisson : rare avant 6 mois si allaitement exclusif. " +
      "Consulter si persistant plus de 3–5 jours ou accompagné de douleurs.",
    status: 'alert',
  },
  {
    type: 2,
    description: 'En boudin bosselé',
    detail: 'Constipation légère',
    comment: 'Constipation légère — transit lent',
    medical:
      "Selles en boudin mais avec des bosses : transit un peu lent. " +
      "Souvent lié à un manque d'hydratation ou de fibres. " +
      "Augmenter l'apport en eau, fruits et légumes. " +
      "Surveiller si se produit plusieurs jours de suite.",
    status: 'watch',
  },
  {
    type: 3,
    description: 'Boudin avec craquelures',
    detail: 'Normal',
    comment: 'Normal — transit légèrement ferme',
    medical:
      "Selles bien formées avec quelques craquelures en surface. " +
      "Transit correct, légèrement ferme. " +
      "Augmenter légèrement l'hydratation si récurrent.",
    status: 'ok',
  },
  {
    type: 4,
    description: 'Boudin lisse et souple',
    detail: 'Idéal',
    comment: 'Forme idéale — transit parfait',
    medical:
      "La selle idéale selon l'échelle de Bristol. " +
      "Forme de saucisse lisse et souple, facile à évacuer, sans effort ni douleur. " +
      "Dr Kousmine : « la selle normale est brun clair à brun foncé, en forme de saucisse ». " +
      "Indique un transit intestinal sain et une bonne hydratation.",
    status: 'ok',
  },
  {
    type: 5,
    description: 'Morceaux mous distincts',
    detail: 'A surveiller',
    comment: 'Transit un peu rapide — à surveiller',
    medical:
      "Morceaux mous aux bords bien définis : transit légèrement accéléré. " +
      "Peut indiquer un début de diarrhée, un repas riche en graisses, ou une irritation intestinale légère. " +
      "Surveiller si persistant plus de 24h.",
    status: 'watch',
  },
  {
    type: 6,
    description: 'Bouillie molle',
    detail: 'Diarrhée légère',
    comment: 'Diarrhée légère — transit trop rapide',
    medical:
      "Selles molles et pâteuses sans forme définie. " +
      "Transit accéléré : la bile n'a pas le temps d'être transformée. " +
      "Causes fréquentes : gastroentérite, intolérance alimentaire, stress, antibiotiques. " +
      "Hydrater régulièrement. Consulter si dure plus de 24–48h ou accompagnée de fièvre.",
    status: 'watch',
  },
  {
    type: 7,
    description: 'Liquide sans morceaux',
    detail: 'Diarrhée sévère',
    comment: 'Diarrhée sévère — risque de déshydratation',
    medical:
      "Selles entièrement liquides : diarrhée sévère avec risque de déshydratation rapide, " +
      "surtout chez le nourrisson. " +
      "Signes à surveiller : bouche sèche, yeux creux, fontanelle enfoncée, moins de 4 couches mouillées/jour. " +
      "Consulter rapidement si nourrisson < 3 mois, ou si diarrhée > 6h.",
    status: 'alert',
    urgent: true,
  },
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
