export type ColorStatus = 'ok' | 'watch' | 'alert';

export interface StoolColor {
  id: string;
  label: string;
  hex: string;
  status: ColorStatus;
  bordered?: boolean;
  comment: string;      // description médicale courte
  detail: string;       // explication pour les parents
  urgent?: boolean;     // consulter rapidement
}

export interface UrineColor {
  id: string;
  label: string;
  hex: string;
  status: ColorStatus;
  bordered?: boolean;
  comment: string;
  detail: string;
  urgent?: boolean;
}

export const STOOL_COLORS: StoolColor[] = [
  {
    id: 'ja',
    label: 'Jaune',
    hex: '#E8C547',
    status: 'ok',
    comment: 'Normal chez le nourrisson allaité',
    detail:
      "Couleur habituelle des selles du nourrisson allaité, due à la bilirubine. " +
      "Chez l'enfant plus grand, une teinte jaune pâle peut indiquer une malabsorption des graisses " +
      "(pancréas, intolérance au gluten). Consulter si persistant.",
  },
  {
    id: 'bj',
    label: 'Brun-jaune',
    hex: '#C99A3A',
    status: 'ok',
    comment: 'Normal — transit sain',
    detail:
      "Selle typique d'un nourrisson en transition (allaitement + solides). " +
      "La couleur est déterminée par la dégradation de la bile dans l'intestin.",
  },
  {
    id: 'br',
    label: 'Brun',
    hex: '#8B5E3C',
    status: 'ok',
    comment: 'Couleur idéale — tout va bien',
    detail:
      "Selle brune normale : bien formée, facile à évacuer. " +
      "La couleur est due aux pigments biliaires. " +
      "Dr Kousmine : « la selle normale est brun clair à brun foncé, en forme de saucisse ».",
  },
  {
    id: 'bf',
    label: 'Brun foncé',
    hex: '#5C3D2E',
    status: 'ok',
    comment: 'Normal — souvent alimentation riche',
    detail:
      "Plus foncé si alimentation carnée ou riche en fer. " +
      "Sans odeur forte ni autre symptôme, c'est normal.",
  },
  {
    id: 've',
    label: 'Vert',
    hex: '#5E8B5E',
    status: 'watch',
    comment: 'Transit rapide ou alimentation verte',
    detail:
      "Causes bénignes : épinards, brocoli, spiruline, suppléments de fer, transit accéléré " +
      "(la bile reste verte si elle passe trop vite dans le côlon). " +
      "Surveiller si persistant plus de 2 jours ou accompagné de fièvre/douleurs.",
  },
  {
    id: 'or',
    label: 'Orange',
    hex: '#E07B3A',
    status: 'watch',
    comment: 'Excès de bêta-carotène ou bile',
    detail:
      "Souvent lié à une consommation importante de carottes, patates douces, courges. " +
      "Peut aussi indiquer un problème biliaire si l'alimentation n'explique pas la couleur.",
  },
  {
    id: 'ro',
    label: 'Rouge',
    hex: '#C84B4B',
    status: 'alert',
    comment: 'Sang possible — consulter',
    detail:
      "Peut signifier un saignement du tube digestif inférieur (hémorroïdes, fissure anale, " +
      "maladie de Crohn, polypes). Parfois bénin : betteraves, tomates, colorants alimentaires. " +
      "Consulter si non expliqué par l'alimentation ou si accompagné de douleurs.",
    urgent: true,
  },
  {
    id: 'no',
    label: 'Noir',
    hex: '#2A2220',
    status: 'alert',
    comment: 'Consulter — saignement possible',
    detail:
      "Selles noires et goudronneuses : signe possible d'un saignement haut " +
      "(estomac, intestin grêle — ulcère, tumeur). " +
      "Cause bénigne : suppléments de fer, réglisse noire, myrtilles. " +
      "Consulter rapidement si pas expliqué par les médicaments ou alimentation.",
    urgent: true,
  },
  {
    id: 'bl',
    label: 'Blanc/Gris',
    hex: '#C8C0B8',
    status: 'alert',
    bordered: true,
    comment: 'Urgence — foie ou voies biliaires',
    detail:
      "Selles pâles ou grises : la bile n'arrive pas dans l'intestin. " +
      "Peut indiquer un blocage des voies biliaires, un problème de foie ou de vésicule biliaire. " +
      "Si les urines sont foncées en même temps, c'est un cas urgent. Consulter sans délai.",
    urgent: true,
  },
];

export const URINE_COLORS: UrineColor[] = [
  {
    id: 'in',
    label: 'Incolore',
    hex: '#F0EDE4',
    status: 'watch',
    bordered: true,
    comment: 'Trop hydraté ou diabète insipide',
    detail:
      "Urines très claires : hydratation excessive ou, rarement, diabète insipide. " +
      "Surveiller si persistant.",
  },
  {
    id: 'jp',
    label: 'Jaune pâle',
    hex: '#F5EEB0',
    status: 'ok',
    comment: 'Hydratation idéale',
    detail: "Couleur cible : bonne hydratation, reins fonctionnels.",
  },
  {
    id: 'ja',
    label: 'Jaune',
    hex: '#E8D047',
    status: 'ok',
    comment: 'Normal',
    detail: "Urines normales. Continuer à bien hydrater.",
  },
  {
    id: 'jf',
    label: 'Jaune foncé',
    hex: '#D4A017',
    status: 'watch',
    comment: 'Hydratation insuffisante',
    detail:
      "Urines concentrées : nourrisson pas assez hydraté. " +
      "Augmenter les tétées ou l'apport en eau selon l'âge.",
  },
  {
    id: 'am',
    label: 'Ambre/Brun',
    hex: '#B87333',
    status: 'alert',
    comment: 'Déshydratation ou problème hépatique',
    detail:
      "Urines très foncées : déshydratation sévère, ou problème de foie (jaunisse). " +
      "Si associé à des selles pâles, consulter en urgence.",
    urgent: true,
  },
  {
    id: 'rg',
    label: 'Rose/Rouge',
    hex: '#E87878',
    status: 'alert',
    comment: 'Sang possible — consulter',
    detail:
      "Peut indiquer du sang dans les urines (infection urinaire, calcul, traumatisme). " +
      "Parfois dû aux betteraves ou certains médicaments. " +
      "Consulter si non expliqué par l'alimentation.",
    urgent: true,
  },
];
