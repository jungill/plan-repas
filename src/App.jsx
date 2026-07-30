import React, { useState, useEffect, useMemo } from "react";

/* ------------------------------------------------------------------
   Plan de repas « tartes » — prise de muscle 0,25 kg / 2 semaines
   Base du plan : 2 650 kcal. Vendredi sans viande.
   Les tartes se cuisent entières (moule 26 cm, 6 parts) : c'est le
   nombre de parts qui s'ajuste au poids, pas la recette.
-------------------------------------------------------------------*/

const BASE_KCAL = 2650;
const P = "Viandes & poissons";
const C = "Crèmerie & œufs";
const L = "Fruits & légumes";
const E = "Épicerie";

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const DIMANCHE = 6;
const MERCREDI = 2;

const TYPES = { viande: "viande", poisson: "poisson", vege: "végétarien", sucre: "sucré" };

/* ------------------------------ tartes ------------------------------ */

const TARTES = {
  lorraine: {
    nom: "Quiche lorraine", type: "viande",
    kcalPart: 430, protPart: 19, temps: "1 h",
    jours: [DIMANCHE],
    ing: [
      { q: 1, u: "", n: "pâte brisée (230 g)", cat: E },
      { q: 200, u: "g", n: "lardons fumés", cat: P },
      { q: 4, u: "", n: "œufs", cat: C },
      { q: 200, u: "ml", n: "crème légère 15 %", cat: C },
      { q: 150, u: "g", n: "fromage blanc 3 %", cat: C },
      { q: 100, u: "g", n: "comté râpé", cat: C },
      { q: null, u: "", n: "muscade, poivre", cat: E, fixe: true },
    ],
    etapes: [
      "Sortir la pâte du réfrigérateur 10 minutes avant de commencer. Trop froide, elle se fend dès qu'on la travaille. Préchauffer le four à 200 °C en chaleur tournante.",
      "Dérouler la pâte dans le moule avec son papier cuisson. La pousser dans l'angle du moule avec la pulpe du pouce, sans jamais l'étirer : une pâte étirée se rétracte à la cuisson et le bord retombe. Araser l'excédent en passant le rouleau sur le bord du moule.",
      "Piquer le fond d'une quinzaine de coups de fourchette. Ces trous laissent la vapeur s'échapper et empêchent la pâte de gonfler en cloque.",
      "Cuire à blanc : poser une feuille de papier cuisson sur la pâte, la remplir de légumes secs ou de riz, et enfourner 10 minutes. Retirer les poids et le papier, puis remettre 3 minutes pour sécher le fond. Il doit être mat et sableux au toucher, pas coloré.",
      "Pendant ce temps, rissoler les lardons 5 minutes à feu moyen, dans une poêle sans matière grasse. Ils doivent dorer sans devenir cassants. Les égoutter sur du papier absorbant et les laisser tiédir : versés brûlants sur l'appareil, ils le feraient coaguler en grumeaux.",
      "Battre les œufs à la fourchette avec la crème et le fromage blanc, sans chercher à faire mousser. Les bulles d'air laissent des trous dans la quiche cuite. Râper la muscade, poivrer généreusement, et ne pas saler : lardons et comté s'en chargent.",
      "Répartir les lardons et le comté sur le fond refroidi, puis verser l'appareil jusqu'aux trois quarts de la hauteur du bord. Il gonfle à la cuisson et déborderait sinon.",
      "Baisser le four à 180 °C et cuire 35 minutes. La quiche est prête quand le centre ne tremble plus qu'à peine et qu'une lame plantée au milieu ressort propre.",
      "Laisser reposer 10 minutes hors du four avant de découper. Coupée trop tôt, la première part s'affaisse et l'appareil coule.",
    ],
    astuce: "Le comté râpé posé directement sur la pâte, avant les lardons, forme une barrière de gras qui protège le fond de l'humidité de l'appareil. La pâte reste croustillante deux jours au réfrigérateur.",
  },
  saumon: {
    nom: "Tarte saumon-épinards", type: "poisson",
    kcalPart: 400, protPart: 20, temps: "55 min",
    jours: [DIMANCHE],
    ing: [
      { q: 1, u: "", n: "pâte brisée (230 g)", cat: E },
      { q: 200, u: "g", n: "saumon fumé", cat: P },
      { q: 400, u: "g", n: "épinards frais", cat: L },
      { q: 4, u: "", n: "œufs", cat: C },
      { q: 150, u: "ml", n: "crème légère 15 %", cat: C },
      { q: 100, u: "g", n: "ricotta", cat: C },
      { q: 100, u: "g", n: "fromage blanc 3 %", cat: C },
      { q: 50, u: "g", n: "parmesan", cat: C },
      { q: null, u: "", n: "échalote, citron", cat: L, fixe: true },
    ],
    etapes: [
      "Ciseler l'échalote et la faire suer 2 minutes dans une grande sauteuse. Ajouter les épinards par poignées, en attendant que chaque poignée retombe avant d'ajouter la suivante. Compter 5 minutes en tout : 400 g réduisent à une grosse boule.",
      "Verser les épinards dans une passoire et les laisser refroidir 5 minutes, sinon impossible de les manipuler.",
      "Les presser fortement entre les mains, en plusieurs fois. Tu dois pouvoir en extraire l'équivalent d'un demi-verre d'eau. C'est cette étape, et pas la cuisson, qui décide si la tarte tient ou se délite.",
      "Hacher grossièrement la boule d'épinards au couteau : sans ça, on tire de longs filaments à chaque bouchée.",
      "Préchauffer à 200 °C. Foncer le moule, piquer le fond, cuire à blanc 10 minutes avec des poids puis 3 minutes sans.",
      "Battre les œufs avec la crème, la ricotta et le fromage blanc. Insister au fouet jusqu'à ce que la ricotta soit totalement lisse, elle a tendance à rester en petits grains. Ajouter le zeste de citron et du poivre, mais pas de sel : saumon fumé et parmesan en apportent déjà beaucoup.",
      "Répartir les épinards sur le fond, poser les lanières de saumon dessus, verser l'appareil et parsemer de parmesan.",
      "Cuire 30 minutes seulement à 180 °C, pas plus : le saumon fumé se dessèche et devient granuleux s'il cuit trop longtemps.",
    ],
    astuce: "Réserve deux lanières de saumon crues et pose-les sur la part au moment de servir. Le contraste entre la tarte tiède et le saumon froid change complètement la bouchée, pour zéro effort.",
  },
  poireaux: {
    nom: "Quiche poulet, poireaux, comté", type: "viande",
    kcalPart: 385, protPart: 21, temps: "1 h 10",
    jours: [MERCREDI],
    ing: [
      { q: 1, u: "", n: "pâte brisée (230 g)", cat: E },
      { q: 250, u: "g", n: "filet de poulet", cat: P },
      { q: 300, u: "g", n: "poireaux", cat: L },
      { q: 4, u: "", n: "œufs", cat: C },
      { q: 150, u: "ml", n: "crème légère 15 %", cat: C },
      { q: 200, u: "g", n: "fromage blanc 3 %", cat: C },
      { q: 100, u: "g", n: "comté râpé", cat: C },
      { q: 10, u: "ml", n: "huile d'olive", cat: E },
    ],
    etapes: [
      "Fendre les poireaux en deux dans la longueur et les passer sous l'eau en écartant les feuilles : le sable se loge entre les couches du blanc et ne part pas si on se contente de rincer l'extérieur. Les émincer en demi-lunes de 5 mm.",
      "Les faire fondre 12 minutes à couvert, à feu doux, dans l'huile d'olive, en remuant de temps en temps. Ils doivent devenir translucides et sucrés, sans prendre de couleur. Saler en fin de cuisson seulement, sinon ils rendent leur eau trop tôt.",
      "Découvrir et monter le feu 2 minutes pour évaporer le liquide au fond de la poêle. Une garniture humide, c'est une quiche détrempée.",
      "Couper le poulet en dés de 2 cm et le saisir 5 minutes à feu vif dans la même poêle. Le sortir encore légèrement rosé au centre : il finit de cuire au four, et un poulet déjà cuit à ce stade ressortira sec.",
      "Préchauffer à 200 °C. Foncer le moule sans étirer la pâte, piquer le fond, cuire à blanc 10 minutes avec des poids, puis 3 minutes sans.",
      "Battre les œufs avec la crème et le fromage blanc, sans mousser, et poivrer. Le fromage blanc remplace une partie de la crème : il faut le fouetter un peu plus longtemps pour qu'il soit parfaitement lisse.",
      "Laisser tiédir la garniture, puis la répartir sur le fond avec le comté. Verser l'appareil aux trois quarts du bord.",
      "Cuire 35 minutes à 180 °C, puis laisser reposer 10 minutes avant de découper.",
    ],
    astuce: "Garde deux cuillerées de poireaux fondus de côté et pose-les sur le dessus avant d'enfourner : elles caramélisent au four et donnent du relief à une quiche qui, sinon, est uniforme d'un bout à l'autre.",
  },
  thon: {
    nom: "Tarte au thon et à la tomate", type: "poisson",
    kcalPart: 370, protPart: 19, temps: "55 min",
    jours: [MERCREDI],
    ing: [
      { q: 1, u: "", n: "pâte feuilletée (230 g)", cat: E },
      { q: 280, u: "g", n: "thon au naturel", cat: P },
      { q: 400, u: "g", n: "tomates", cat: L },
      { q: 3, u: "", n: "œufs", cat: C },
      { q: 150, u: "ml", n: "crème légère 15 %", cat: C },
      { q: 100, u: "g", n: "fromage blanc 3 %", cat: C },
      { q: 80, u: "g", n: "emmental râpé", cat: C },
      { q: null, u: "", n: "moutarde, herbes de Provence", cat: E, fixe: true },
    ],
    etapes: [
      "Commencer par les tomates, c'est l'étape longue. Les trancher en rondelles de 5 mm, les étaler sur une grille ou du papier absorbant, saler légèrement et laisser dégorger 10 minutes.",
      "Éponger les rondelles une par une avec du papier absorbant, sur les deux faces. Sans ce passage, l'eau des tomates se libère au four et la tarte nage.",
      "Préchauffer à 200 °C. Foncer le moule avec la pâte feuilletée en la poussant dans l'angle sans l'étirer, araser le bord, piquer le fond à la fourchette.",
      "Badigeonner le fond d'une fine couche de moutarde au pinceau. Elle parfume, mais surtout elle forme une barrière contre l'humidité.",
      "Cuire à blanc 10 minutes avec un papier cuisson et des légumes secs, puis 3 minutes sans les poids pour sécher le fond.",
      "Égoutter le thon en le pressant dans une passoire avec le dos d'une cuillère : il retient beaucoup d'eau de conserve. L'émietter ensuite à la fourchette.",
      "Battre les œufs avec la crème, le fromage blanc et les herbes, sans faire mousser. Poivrer, saler très peu : le thon en conserve est déjà salé.",
      "Étaler le thon émietté sur le fond, ranger les tomates en rosace en les faisant se chevaucher légèrement, verser l'appareil dans les interstices, puis répartir l'emmental.",
      "Cuire 35 minutes à 180 °C. Le dessus doit être doré et les bords des tomates légèrement confits. Reposer 10 minutes avant de découper.",
    ],
    astuce: "Une cuillerée de chapelure ou de semoule fine saupoudrée sur le fond précuit, sous le thon, absorbe le peu d'humidité qui reste. C'est le vieux réflexe des tartes aux fruits, il marche aussi bien en salé.",
  },
  courgette: {
    nom: "Tarte courgette, chèvre et noix", type: "vege",
    kcalPart: 450, protPart: 22, temps: "1 h 05",
    jours: [MERCREDI],
    ing: [
      { q: 1, u: "", n: "pâte brisée (230 g)", cat: E },
      { q: 400, u: "g", n: "courgettes", cat: L },
      { q: 180, u: "g", n: "bûche de chèvre", cat: C },
      { q: 5, u: "", n: "œufs", cat: C },
      { q: 150, u: "ml", n: "crème légère 15 %", cat: C },
      { q: 250, u: "g", n: "fromage blanc 3 %", cat: C },
      { q: 40, u: "g", n: "parmesan", cat: C },
      { q: 40, u: "g", n: "noix", cat: E },
      { q: 10, u: "ml", n: "huile d'olive", cat: E },
      { q: null, u: "", n: "thym", cat: E, fixe: true },
    ],
    etapes: [
      "Trancher les courgettes en rondelles de 3 mm, à la mandoline si tu en as une, sinon au couteau bien affûté. Des rondelles épaisses restent crues au cœur et relâchent leur eau dans l'appareil.",
      "Les poêler 8 minutes à feu vif dans l'huile, en deux fournées pour ne pas surcharger la poêle. Une poêle trop chargée fait bouillir les courgettes au lieu de les dorer, et elles rendent alors toute leur eau.",
      "Saler seulement en fin de cuisson, puis les débarrasser sur du papier absorbant et laisser tiédir.",
      "Torréfier les noix 3 minutes à la poêle à sec, puis les concasser grossièrement. Sans viande dans cette tarte, ce sont elles qui apportent la mâche et le côté nourrissant — crues, elles seraient fades et un peu amères.",
      "Préchauffer à 200 °C. Foncer le moule, piquer le fond, cuire à blanc 10 minutes avec des poids puis 3 minutes sans.",
      "Battre les cinq œufs avec la crème, le fromage blanc, le parmesan et le thym effeuillé. Cinq œufs au lieu de quatre, c'est ce qui compense l'absence de jambon côté protéines, et l'appareil tient mieux à la découpe.",
      "Ranger les courgettes en rangs serrés en les faisant se chevaucher comme des tuiles, parsemer les noix concassées, verser l'appareil.",
      "Poser les rondelles de chèvre en surface plutôt que de les enfouir, puis cuire 35 minutes à 180 °C. Le chèvre doit être doré et légèrement gonflé.",
      "Laisser reposer 10 minutes avant de découper.",
    ],
    astuce: "Le chèvre laissé en surface fond en taches franches et crémeuses ; mélangé à l'appareil, il donne un goût uniforme et beaucoup plus plat. Même quantité de fromage, résultat très différent.",
  },
  fromageblanc: {
    nom: "Tarte au fromage blanc", type: "sucre",
    kcalPart: 375, protPart: 22, temps: "1 h 15",
    jours: [DIMANCHE, MERCREDI],
    ing: [
      { q: 1, u: "", n: "pâte brisée (230 g)", cat: E },
      { q: 800, u: "g", n: "fromage blanc 3 %", cat: C },
      { q: 4, u: "", n: "œufs", cat: C },
      { q: 80, u: "g", n: "sucre", cat: E },
      { q: 40, u: "g", n: "maïzena", cat: E },
      { q: null, u: "", n: "citron non traité, vanille", cat: L, fixe: true },
    ],
    etapes: [
      "Sortir les œufs et le fromage blanc du réfrigérateur 30 minutes avant. À température ambiante, l'appareil reste lisse ; froid, il fait des grumeaux qui ne partent plus.",
      "Si le fromage blanc est très liquide, l'égoutter 20 minutes dans une passoire fine garnie d'un linge. Une tarte qui retombe, c'est presque toujours un fromage blanc trop humide.",
      "Foncer un moule à bords hauts, au moins 4 cm : l'appareil monte beaucoup à la cuisson. Piquer le fond et réserver au frais le temps de la suite. Préchauffer à 180 °C, en chaleur statique de préférence.",
      "Séparer les blancs des jaunes. Fouetter les jaunes avec le sucre 2 minutes, jusqu'à ce que le mélange blanchisse et épaississe.",
      "Incorporer la maïzena, puis le fromage blanc, le zeste de citron et la vanille. Mélanger sans excès, juste assez pour homogénéiser.",
      "Monter les blancs en neige ferme avec une pincée de sel. Détendre d'abord l'appareil avec un tiers des blancs au fouet, franchement, puis incorporer les deux tiers restants à la maryse en soulevant la masse du bas vers le haut. Il doit rester aérien.",
      "Verser dans le moule, lisser la surface, cuire 45 minutes. Le centre doit encore trembler légèrement quand on secoue le moule.",
      "Éteindre le four et laisser refroidir une heure, porte entrouverte avec une cuillère en bois. Un refroidissement brutal fait retomber la tarte et craqueler le dessus.",
      "Réfrigérer au moins 3 heures avant de découper : c'est au froid qu'elle prend sa tenue.",
    ],
    astuce: "Elle est meilleure le lendemain, quand le citron a eu le temps de diffuser. C'est exactement la tarte à cuire le dimanche soir pour les petits-déjeuners de la semaine.",
  },
};

const ACC = {
  salade: { kcal: 100, prot: 1, ing: [{ q: 80, u: "g", n: "salade verte", cat: L }, { q: 10, u: "ml", n: "huile d'olive", cat: E }] },
  haricots: { kcal: 100, prot: 4, ing: [{ q: 200, u: "g", n: "haricots verts", cat: L }, { q: 5, u: "g", n: "beurre", cat: C }] },
  pain: { kcal: 100, prot: 4, ing: [{ q: 40, u: "g", n: "pain complet", cat: E }] },
  patates: { kcal: 130, prot: 3, ing: [{ q: 150, u: "g", n: "pommes de terre", cat: L }] },
  soupe: { kcal: 200, prot: 5, ing: [{ q: 300, u: "ml", n: "soupe de légumes", cat: L }, { q: 40, u: "g", n: "pain complet", cat: E }] },
  banane: { kcal: 90, prot: 1, ing: [{ q: 1, u: "", n: "banane", cat: L }] },
  orange: { kcal: 60, prot: 1, ing: [{ q: 1, u: "", n: "orange", cat: L }] },
};

const t = (id, parts, acc, h, suffixe) => ({
  h, tarte: id, parts, acc: acc || [],
  t: TARTES[id].nom + (suffixe ? ", " + suffixe : ""),
});

/* ------------------------------ semaine ------------------------------ */

const SEMAINE = [
  {
    jour: "Lundi", abbr: "LUN", num: "01", seance: true,
    repas: [
      t("fromageblanc", 1.5, ["banane"], "07:30", "banane"),
      t("lorraine", 2, ["salade"], "12:30", "salade verte"),
      {
        h: "18:30", t: "Skyr, miel, amandes (après la séance)", kcal: 400, prot: 30, temps: "3 min",
        ing: [
          { q: 250, u: "g", n: "skyr", cat: C },
          { q: 40, u: "g", n: "flocons d'avoine", cat: E },
          { q: 25, u: "g", n: "amandes", cat: E },
          { q: 20, u: "g", n: "miel", cat: E },
        ],
        etapes: [
          "Verser l'avoine dans le skyr et mélanger. Elle absorbe le petit-lait et épaissit l'ensemble, ce qui rend la collation nettement plus rassasiante qu'un skyr nature.",
          "Ajouter le miel et mélanger. Si le skyr sort du réfrigérateur, le miel fige : le détendre d'abord avec une cuillerée de skyr à part.",
          "Concasser les amandes au couteau, ou sous le plat d'une casserole. Entières elles se contentent de craquer ; concassées elles libèrent leur gras et parfument tout le pot.",
          "Laisser reposer 5 minutes le temps que l'avoine gonfle. À prendre dans l'heure qui suit la séance.",
        ],
      },
      t("saumon", 1.5, ["haricots"], "20:30", "haricots verts"),
    ],
  },
  {
    jour: "Mardi", abbr: "MAR", num: "02", seance: false,
    repas: [
      t("fromageblanc", 1.5, ["orange"], "07:30", "orange"),
      t("saumon", 2, ["salade"], "12:30", "salade verte"),
      {
        h: "16:30", t: "Fromage blanc, abricots secs, noix", kcal: 400, prot: 25, temps: "8 min",
        ing: [
          { q: 250, u: "g", n: "fromage blanc 3 %", cat: C },
          { q: 40, u: "g", n: "abricots secs", cat: E },
          { q: 20, u: "g", n: "noix", cat: E },
          { q: 15, u: "g", n: "miel", cat: E },
        ],
        etapes: [
          "Couper les abricots secs en lamelles aux ciseaux plutôt qu'au couteau : ils collent à la lame et c'est bien plus rapide ainsi.",
          "Les laisser 5 minutes dans une cuillerée d'eau très chaude pour les assouplir, puis les égoutter. Réhydratés, ils sont moelleux au lieu d'être coriaces.",
          "Mélanger au fromage blanc avec le miel.",
          "Concasser les noix et les ajouter au dernier moment, juste avant de manger, pour qu'elles restent croquantes.",
        ],
      },
      t("lorraine", 1.5, ["soupe"], "20:00", "soupe de légumes"),
    ],
  },
  {
    jour: "Mercredi", abbr: "MER", num: "03", seance: true,
    repas: [
      t("fromageblanc", 1.5, ["banane"], "07:30", "banane"),
      t("saumon", 2, ["pain"], "12:30", "pain complet"),
      {
        h: "18:30", t: "Smoothie fromage blanc, banane, avoine (après la séance)", kcal: 400, prot: 30, temps: "3 min",
        ing: [
          { q: 200, u: "g", n: "fromage blanc 3 %", cat: C },
          { q: 150, u: "ml", n: "lait demi-écrémé", cat: C },
          { q: 1, u: "", n: "banane", cat: L },
          { q: 30, u: "g", n: "flocons d'avoine", cat: E },
          { q: 15, u: "g", n: "beurre de cacahuète", cat: E },
          { q: null, u: "", n: "cacao non sucré", cat: E, fixe: true },
        ],
        etapes: [
          "Verser les liquides en premier dans le blender, le lait puis le fromage blanc. Les lames tournent dans du liquide et n'attrapent pas de poche d'air : c'est ce qui évite le bloc compact qui refuse de tourner.",
          "Ajouter la banane en morceaux, l'avoine, le beurre de cacahuète et le cacao par-dessus.",
          "Mixer 30 secondes à pleine vitesse. Si c'est trop épais, rallonger avec du lait cuillerée par cuillerée plutôt que d'un coup.",
          "Boire dans l'heure qui suit la séance. Avec une banane coupée puis congelée la veille, on obtient une texture de milkshake sans ajouter de glace.",
        ],
      },
      t("lorraine", 1.5, ["haricots"], "20:30", "haricots verts"),
    ],
  },
  {
    jour: "Jeudi", abbr: "JEU", num: "04", seance: false,
    repas: [
      t("fromageblanc", 1.5, ["orange"], "07:30", "orange"),
      t("poireaux", 2, ["salade"], "12:30", "salade verte"),
      {
        h: "16:30", t: "Fromage blanc, avoine, amandes", kcal: 400, prot: 28, temps: "5 min",
        ing: [
          { q: 250, u: "g", n: "fromage blanc 3 %", cat: C },
          { q: 40, u: "g", n: "flocons d'avoine", cat: E },
          { q: 25, u: "g", n: "amandes", cat: E },
          { q: 20, u: "g", n: "miel", cat: E },
        ],
        etapes: [
          "Mélanger le fromage blanc, l'avoine et le miel dans un bocal.",
          "Concasser les amandes et les ajouter.",
          "Laisser gonfler 5 minutes avant de manger. Préparé la veille au soir et laissé au réfrigérateur, l'ensemble devient franchement crémeux : c'est meilleur, et c'est une collation qui part au travail dans un sac.",
        ],
      },
      t("thon", 2, ["haricots"], "20:00", "haricots verts"),
    ],
  },
  {
    jour: "Vendredi", abbr: "VEN", num: "05", seance: true, sansViande: true,
    repas: [
      t("fromageblanc", 1.5, ["banane"], "07:30", "banane"),
      t("thon", 2, ["patates"], "12:30", "pommes de terre vapeur"),
      {
        h: "18:30", t: "Fromage blanc, compote, granola (après la séance)", kcal: 400, prot: 26, temps: "8 min",
        ing: [
          { q: 250, u: "g", n: "fromage blanc 3 %", cat: C },
          { q: 100, u: "g", n: "compote sans sucres ajoutés", cat: E },
          { q: 40, u: "g", n: "flocons d'avoine", cat: E },
          { q: 20, u: "g", n: "amandes", cat: E },
        ],
        etapes: [
          "Torréfier l'avoine 4 minutes à la poêle, à sec et à feu moyen, en remuant sans arrêt. Elle prend une couleur noisette et une odeur de biscuit, et surtout elle reste croustillante dans le fromage blanc au lieu de ramollir.",
          "Ajouter les amandes concassées dans la poêle pour la dernière minute, puis débarrasser sur une assiette froide.",
          "Mélanger le fromage blanc et la compote en deux fois, sans trop insister : des marbrures sont plus agréables qu'une couleur uniforme.",
          "Verser l'avoine et les amandes tiédies par-dessus, au dernier moment.",
        ],
      },
      t("courgette", 1.5, ["salade"], "20:30", "salade verte"),
    ],
  },
  {
    jour: "Samedi", abbr: "SAM", num: "06", seance: false,
    repas: [
      {
        h: "09:00", t: "Œufs brouillés, pain complet, fromage frais", kcal: 600, prot: 33, temps: "12 min",
        ing: [
          { q: 3, u: "", n: "œufs", cat: C },
          { q: 80, u: "g", n: "pain complet", cat: E },
          { q: 40, u: "g", n: "fromage frais", cat: C },
          { q: 5, u: "g", n: "beurre", cat: C },
          { q: 1, u: "", n: "orange", cat: L },
        ],
        etapes: [
          "Battre les œufs à la fourchette avec une pincée de sel, juste assez pour mélanger jaunes et blancs.",
          "Faire fondre le beurre à feu très doux dans une petite casserole plutôt qu'une poêle : le fond épais et les bords hauts protègent de la surchauffe, qui est la seule cause d'œufs brouillés caoutchouteux.",
          "Verser les œufs et remuer sans arrêt à la spatule en raclant le fond et les bords. Pendant deux minutes rien ne se passe, puis l'ensemble prend d'un coup : c'est le moment de rester attentif.",
          "Retirer du feu quand les œufs sont encore un peu coulants. La chaleur résiduelle de la casserole finit la cuisson pendant que tu dresses. Poivrer hors du feu.",
          "Griller le pain, le tartiner de fromage frais, poser les œufs par-dessus. Servir l'orange à côté.",
        ],
      },
      t("poireaux", 2, ["salade"], "13:00", "salade verte"),
      {
        h: "17:00", t: "Yaourt grec, noix, poire", kcal: 400, prot: 20, temps: "6 min",
        ing: [
          { q: 250, u: "g", n: "yaourt grec", cat: C },
          { q: 25, u: "g", n: "noix", cat: E },
          { q: 20, u: "g", n: "miel", cat: E },
          { q: 1, u: "", n: "poire", cat: L },
        ],
        etapes: [
          "Torréfier les noix 3 minutes à la poêle à sec, en remuant. Une noix crue est un peu amère ; torréfiée, elle devient franchement gourmande. Les concasser après refroidissement.",
          "Couper la poire en dés en gardant la peau : elle apporte des fibres et empêche les morceaux de s'écraser.",
          "Dresser en couches dans un bol — yaourt, poire, noix — et terminer par un filet de miel plutôt que de tout mélanger.",
        ],
      },
      t("courgette", 1.5, ["soupe"], "20:30", "soupe de légumes"),
    ],
  },
  {
    jour: "Dimanche", abbr: "DIM", num: "07", seance: false,
    repas: [
      {
        h: "09:00", t: "Œufs au plat, avocat, pain grillé", kcal: 600, prot: 28, temps: "12 min",
        ing: [
          { q: 3, u: "", n: "œufs", cat: C },
          { q: 80, u: "g", n: "avocat", cat: L },
          { q: 80, u: "g", n: "pain complet", cat: E },
          { q: 100, u: "g", n: "tomate", cat: L },
          { q: 5, u: "g", n: "beurre", cat: C },
        ],
        etapes: [
          "Faire fondre le beurre à feu doux. Casser les œufs dans un bol à côté avant de les glisser dans la poêle : on repère les éclats de coquille et on ne crève pas les jaunes.",
          "Couvrir la poêle 3 minutes. La vapeur emprisonnée cuit le dessus du blanc sans qu'on ait besoin de monter le feu, donc sans durcir le jaune ni brunir le dessous.",
          "Écraser l'avocat à la fourchette avec du sel, du poivre et un filet de citron, en gardant volontairement des morceaux : une purée lisse perd tout intérêt en bouche.",
          "Griller le pain, étaler l'avocat, poser les œufs dessus et poivrer. Servir la tomate en tranches salées à côté.",
        ],
      },
      t("courgette", 1.5, ["salade"], "13:00", "salade verte"),
      {
        h: "17:00", t: "Fromage blanc, avoine, amandes", kcal: 400, prot: 28, temps: "5 min",
        ing: [
          { q: 250, u: "g", n: "fromage blanc 3 %", cat: C },
          { q: 40, u: "g", n: "flocons d'avoine", cat: E },
          { q: 25, u: "g", n: "amandes", cat: E },
          { q: 20, u: "g", n: "miel", cat: E },
        ],
        etapes: [
          "Mélanger le fromage blanc, l'avoine et le miel.",
          "Concasser les amandes et les ajouter.",
          "Laisser gonfler 5 minutes. Profite du dimanche pour en préparer deux bocaux d'avance : celui de jeudi sera prêt.",
        ],
      },
      t("thon", 2, ["haricots"], "20:00", "haricots verts"),
    ],
  },
];

const CATS = [P, C, L, E];

/* ---------------------------- utilitaires ---------------------------- */

function arrondi(n, u) {
  if (u === "g" || u === "ml") {
    if (n >= 100) return Math.round(n / 10) * 10;
    if (n >= 25) return Math.round(n / 5) * 5;
    return Math.max(1, Math.round(n));
  }
  return Math.max(0.5, Math.round(n * 2) / 2);
}

function fmtQ(q, u, scale = 1) {
  if (q === null || q === undefined) return "";
  const v = arrondi(q * scale, u);
  if (u === "g" || u === "ml") return `${v} ${u}`;
  if (Number.isInteger(v)) return `${v}`;
  return v < 1 ? "½" : `${Math.floor(v)} ½`;
}

const fmtParts = (n) => {
  const v = Math.max(0.5, Math.round(n * 2) / 2);
  if (Number.isInteger(v)) return `${v}`;
  return v < 1 ? "½" : `${Math.floor(v)} ½`;
};

const fmtN = (n) => n.toLocaleString("fr-FR");

const labelFournee = (tt) => tt.jours.map((i) => JOURS[i]).join(" et ");

function evalRepas(r, scale) {
  if (!r.tarte) {
    return { kcal: Math.round((r.kcal * scale) / 10) * 10, prot: Math.round(r.prot * scale), parts: null };
  }
  const tt = TARTES[r.tarte];
  const parts = Math.max(0.5, Math.round(r.parts * scale * 2) / 2);
  const acc = r.acc.reduce((s, k) => s + ACC[k].kcal, 0) * scale;
  const accP = r.acc.reduce((s, k) => s + ACC[k].prot, 0) * scale;
  return {
    kcal: Math.round((tt.kcalPart * parts + acc) / 10) * 10,
    prot: Math.round(tt.protPart * parts + accP),
    parts,
  };
}

const BESOINS = (() => {
  const acc = {};
  SEMAINE.forEach((d) => d.repas.forEach((r) => {
    if (r.tarte) acc[r.tarte] = (acc[r.tarte] || 0) + r.parts;
  }));
  return acc;
})();

function repartition(scale) {
  const out = {};
  Object.keys(BESOINS).forEach((id) => {
    const total = Math.max(1, Math.ceil((BESOINS[id] * scale) / 6));
    const js = TARTES[id].jours;
    const base = Math.floor(total / js.length);
    const reste = total % js.length;
    const parJour = {};
    js.forEach((j, k) => { parJour[j] = base + (k < reste ? 1 : 0); });
    out[id] = { total, parJour };
  });
  return out;
}

/* Courses regroupées par rayon */
function parRayon(scale, repart, jourIdx) {
  const acc = {};
  const push = (ing, mult) => {
    const k = `${ing.n}|${ing.u}|${ing.fixe ? 1 : 0}`;
    if (!acc[k]) acc[k] = { ...ing, total: 0 };
    if (!ing.fixe) acc[k].total += ing.q * mult;
  };
  const indices = jourIdx === null ? SEMAINE.map((_, i) => i) : [jourIdx];

  indices.forEach((i) => {
    SEMAINE[i].repas.forEach((r) => {
      if (r.tarte) r.acc.forEach((k) => ACC[k].ing.forEach((g) => push(g, scale)));
      else r.ing.forEach((g) => push(g, scale));
    });
    Object.entries(repart).forEach(([id, r]) => {
      const nb = r.parJour[i] || 0;
      if (nb) TARTES[id].ing.forEach((g) => push(g, nb));
    });
  });

  const parCat = {};
  Object.values(acc).forEach((i) => (parCat[i.cat] = parCat[i.cat] || []).push(i));
  CATS.forEach((c) => parCat[c] && parCat[c].sort((a, b) => a.n.localeCompare(b.n, "fr")));
  return parCat;
}

/* Courses regroupées par plat */
function parPlat(scale, repart, jourIdx) {
  const indices = jourIdx === null ? SEMAINE.map((_, i) => i) : [jourIdx];

  const fournees = [];
  Object.entries(repart).forEach(([id, r]) => {
    const nb = indices.reduce((s, i) => s + (r.parJour[i] || 0), 0);
    if (!nb) return;
    const tt = TARTES[id];
    fournees.push({
      id: "t-" + id,
      nom: tt.nom,
      meta: `${TYPES[tt.type]} · ${tt.temps} · 6 parts par tarte`,
      qte: `${nb} tarte${nb > 1 ? "s" : ""}`,
      items: tt.ing.map((g) => ({ ...g, total: g.fixe ? null : g.q * nb })),
    });
  });

  const repas = [];
  indices.forEach((i) => {
    SEMAINE[i].repas.forEach((r, k) => {
      const tt = r.tarte ? TARTES[r.tarte] : null;
      const src = tt ? r.acc.flatMap((a) => ACC[a].ing) : r.ing;
      if (!src.length && !tt) return;
      const prefixeJour = jourIdx === null ? `${SEMAINE[i].abbr} · ` : "";
      repas.push({
        id: `r-${i}-${k}`,
        nom: r.t,
        meta: `${prefixeJour}${r.h}`,
        qte: null,
        tarte: tt ? {
          nom: tt.nom,
          parts: Math.max(0.5, Math.round(r.parts * scale * 2) / 2),
          fournee: tt.jours.map((x) => JOURS[x]).join(" et "),
          ing: tt.ing,
        } : null,
        items: src.map((g) => ({ ...g, total: g.fixe ? null : g.q * scale })),
      });
    });
  });

  return { fournees, repas };
}

/* ------------------------------ styles ------------------------------ */

const CSS = `
.pm-root{
  --encre:#131E1C; --papier:#EAEDE4; --sauge:#CBD4C6;
  --ardoise:#243B38; --ocre:#D8A521; --ocre-f:#96700C;
  --sans:-apple-system,"Segoe UI Semibold","Helvetica Neue",Arial,sans-serif;
  --serif:Georgia,"Iowan Old Style","Times New Roman",serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  background:var(--papier); color:var(--encre);
  font-family:var(--sans); min-height:100%; padding:0 0 56px;
  -webkit-font-smoothing:antialiased;
}
.pm-wrap{max-width:760px;margin:0 auto;padding:0 20px}

.pm-band{background:var(--encre);color:var(--papier);padding:22px 0 20px}
.pm-eyebrow{font:600 10px/1 var(--mono);letter-spacing:.22em;text-transform:uppercase;color:var(--ocre)}
.pm-title{margin:10px 0 0;font:800 clamp(26px,6vw,38px)/1.02 var(--sans);letter-spacing:-.02em;text-transform:uppercase}
.pm-sub{margin:8px 0 0;font:400 14px/1.5 var(--serif);color:#A9B4AC;max-width:46ch}

.pm-ctrl{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-end;margin-top:22px}
.pm-field label{display:block;font:600 9px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:#8C978F;margin-bottom:6px}
.pm-poids{display:flex;align-items:baseline;gap:6px}
.pm-poids input{width:88px;background:transparent;border:0;border-bottom:2px solid var(--ocre);
  color:var(--papier);font:700 30px/1 var(--mono);padding:0 0 3px;-moz-appearance:textfield}
.pm-poids input::-webkit-outer-spin-button,.pm-poids input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.pm-poids span{font:600 14px/1 var(--mono);color:#8C978F}
.pm-seg{display:flex;border:1px solid #3A4B47;border-radius:3px;overflow:hidden}
.pm-seg button{background:transparent;border:0;color:#A9B4AC;font:600 11px/1 var(--mono);
  letter-spacing:.08em;text-transform:uppercase;padding:11px 12px;cursor:pointer}
.pm-seg button[data-on="1"]{background:var(--ocre);color:var(--encre)}

.pm-targets{display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:1px;
  background:#3A4B47;margin-top:22px;border-radius:3px;overflow:hidden}
.pm-t{background:var(--encre);padding:12px 14px}
.pm-t b{display:block;font:700 20px/1.1 var(--mono);color:var(--papier)}
.pm-t i{display:block;font:600 9px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;
  color:#8C978F;font-style:normal;margin-top:5px}

.pm-switch{display:flex;gap:1px;background:var(--sauge);border-radius:3px;overflow:hidden;margin-top:26px}
.pm-switch button{flex:1;background:var(--papier);border:0;padding:12px 6px;cursor:pointer;
  font:600 10px/1.2 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--encre)}
.pm-switch button[data-on="1"]{background:var(--encre);color:var(--papier)}

.pm-tabs{display:flex;gap:1px;background:var(--sauge);margin-top:14px;border-radius:3px;overflow:hidden}
.pm-tabs button{flex:1;background:var(--papier);border:0;padding:13px 2px 11px;cursor:pointer;
  font:600 11px/1 var(--mono);letter-spacing:.04em;color:var(--encre)}
.pm-tabs button[data-on="1"]{background:var(--encre);color:var(--papier)}
.pm-tabs button[data-wide="1"]{flex:1.25;letter-spacing:.1em}
.pm-dot{display:block;width:5px;height:5px;border-radius:50%;background:var(--ocre);margin:6px auto 0}
.pm-dot[data-off="1"]{background:transparent}
.pm-dot[data-four="1"]{border-radius:0;width:6px;height:6px;background:var(--ocre-f)}

.pm-group{display:flex;gap:1px;background:var(--sauge);border-radius:3px;overflow:hidden;margin-top:8px}
.pm-group button{flex:1;background:var(--papier);border:0;padding:11px 6px;cursor:pointer;
  font:600 10px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ardoise)}
.pm-group button[data-on="1"]{background:var(--ocre);color:var(--encre)}

.pm-dayhead{display:flex;align-items:center;gap:16px;padding:26px 0 6px}
.pm-num{font:800 62px/.78 var(--sans);letter-spacing:-.05em;color:var(--ocre)}
.pm-dayname{font:800 22px/1 var(--sans);text-transform:uppercase;letter-spacing:-.01em}
.pm-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.pm-tag{font:600 9px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;
  padding:5px 7px;border-radius:2px;background:var(--sauge);color:var(--ardoise)}
.pm-tag[data-seance="1"]{background:var(--ocre);color:var(--encre)}
.pm-tag[data-vege="1"]{background:transparent;box-shadow:inset 0 0 0 1.5px var(--ardoise);color:var(--ardoise)}

.pm-meal{border-top:1px solid rgba(19,30,28,.16)}
.pm-mealbtn{width:100%;display:grid;grid-template-columns:54px 1fr auto;gap:12px;align-items:baseline;
  background:transparent;border:0;padding:15px 0;cursor:pointer;text-align:left;color:inherit}
.pm-h{font:600 12px/1.3 var(--mono);color:var(--ocre-f)}
.pm-tt{font:700 15px/1.35 var(--sans);letter-spacing:-.005em}
.pm-parts{display:block;font:600 11px/1.5 var(--mono);color:var(--ardoise);margin-top:3px}
.pm-kc{font:600 11px/1.3 var(--mono);color:var(--ardoise);white-space:nowrap;text-align:right}
.pm-mealbtn:hover .pm-tt{color:var(--ocre-f)}

.pm-total{display:flex;justify-content:space-between;border-top:2px solid var(--encre);
  padding:13px 0 0;margin-bottom:4px;font:600 11px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase}

.pm-recipe{background:var(--sauge);border-radius:3px;padding:18px;margin:0 0 16px}
.pm-rmeta{font:600 9px/1.5 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ardoise);margin-bottom:14px}
.pm-lbl{font:600 9px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--ardoise);
  padding-bottom:8px;border-bottom:2px solid var(--encre);margin-bottom:10px}
.pm-ing{list-style:none;margin:0 0 20px;padding:0}
.pm-ing li{display:flex;align-items:baseline;gap:6px;font:400 14px/1.9 var(--serif)}
.pm-ing .lead{flex:1;border-bottom:1px dotted rgba(19,30,28,.35);transform:translateY(-3px)}
.pm-ing .qty{font:600 12px/1 var(--mono);color:var(--encre)}
.pm-steps{margin:0 0 4px;padding:0;list-style:none;counter-reset:s}
.pm-steps li{counter-increment:s;display:flex;gap:14px;font:400 15px/1.6 var(--serif);margin-bottom:14px}
.pm-steps li::before{content:counter(s);font:700 11px/1.7 var(--mono);color:var(--ocre-f);flex:0 0 16px}
.pm-astuce{border-left:3px solid var(--ocre);padding:2px 0 2px 14px;margin-top:18px}
.pm-astuce b{display:block;font:600 9px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;
  color:var(--ocre-f);margin-bottom:7px}
.pm-astuce p{margin:0;font:italic 400 14px/1.6 var(--serif);color:var(--ardoise)}

.pm-note{background:var(--ardoise);color:var(--papier);border-radius:3px;padding:18px;margin-top:26px}
.pm-note h4{margin:0 0 10px;font:600 9px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--ocre)}
.pm-note p{margin:0 0 9px;font:400 14px/1.6 var(--serif);color:#DCE2D9}
.pm-note p:last-child{margin:0}
.pm-note ol{margin:0;padding:0;list-style:none;counter-reset:b}
.pm-note ol li{counter-increment:b;display:flex;gap:12px;font:400 14px/1.6 var(--serif);color:#DCE2D9;margin-bottom:10px}
.pm-note ol li:last-child{margin:0}
.pm-note ol li::before{content:counter(b);font:700 11px/1.6 var(--mono);color:var(--ocre);flex:0 0 14px}

.pm-catlbl{font:600 9px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--ardoise);
  padding:22px 0 8px;border-bottom:2px solid var(--encre);margin-bottom:2px}
.pm-four{border-top:1px solid rgba(19,30,28,.16);padding:15px 0;display:grid;
  grid-template-columns:1fr auto;gap:10px;align-items:baseline}
.pm-fnom{font:700 15px/1.35 var(--sans)}
.pm-fdet{font:600 11px/1.6 var(--mono);color:var(--ardoise)}
.pm-fq{font:600 12px/1 var(--mono);color:var(--ocre-f);white-space:nowrap}
.pm-type{display:inline-block;margin-left:8px;font:600 8px/1 var(--mono);letter-spacing:.14em;
  text-transform:uppercase;padding:4px 6px;border-radius:2px;background:var(--sauge);
  color:var(--ardoise);vertical-align:2px}
.pm-type[data-t="vege"]{box-shadow:inset 0 0 0 1.5px var(--ardoise);background:transparent}
.pm-type[data-t="poisson"]{background:var(--ardoise);color:var(--papier)}

.pm-scope{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:24px 0 0}
.pm-scopeh{font:800 20px/1.15 var(--sans);text-transform:uppercase;letter-spacing:-.01em}
.pm-scopen{font:600 11px/1 var(--mono);color:var(--ardoise);white-space:nowrap}
.pm-hint{font:400 14px/1.6 var(--serif);color:var(--ardoise);margin:8px 0 0}
.pm-frigo{background:var(--sauge);border-radius:3px;padding:14px 16px;margin-top:16px}
.pm-frigo b{display:block;font:600 9px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;
  color:var(--ardoise);margin-bottom:9px}
.pm-frigo li{display:flex;align-items:baseline;gap:6px;font:400 14px/1.85 var(--serif);list-style:none}
.pm-frigo ul{margin:0;padding:0}
.pm-frigo .lead{flex:1;border-bottom:1px dotted rgba(19,30,28,.35);transform:translateY(-3px)}
.pm-frigo .qty{font:600 12px/1 var(--mono)}

.pm-prog{margin-top:16px}
.pm-progbar{height:3px;background:var(--sauge);border-radius:2px;overflow:hidden}
.pm-progbar span{display:block;height:100%;background:var(--ocre);transition:width .18s ease}
.pm-progl{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-top:9px}
.pm-progn{font:600 10px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ardoise)}
.pm-reset{background:transparent;border:0;padding:0;cursor:pointer;font:600 10px/1 var(--mono);
  letter-spacing:.14em;text-transform:uppercase;color:var(--ocre-f);text-decoration:underline;
  text-underline-offset:3px}
.pm-reset[disabled]{color:rgba(36,59,56,.35);text-decoration:none;cursor:default}

.pm-sect{font:800 13px/1 var(--sans);letter-spacing:.03em;text-transform:uppercase;
  color:var(--encre);margin:30px 0 0;padding-bottom:10px;border-bottom:3px solid var(--encre)}
.pm-plat{margin-top:22px}
.pm-plath{display:flex;align-items:baseline;justify-content:space-between;gap:10px;
  border-bottom:2px solid var(--encre);padding-bottom:9px}
.pm-platn{font:700 15px/1.3 var(--sans)}
.pm-platq{font:600 11px/1 var(--mono);color:var(--ocre-f);white-space:nowrap}
.pm-platm{font:600 9px/1.5 var(--mono);letter-spacing:.14em;text-transform:uppercase;
  color:var(--ardoise);margin-top:5px}

.pm-rappel{background:var(--sauge);border-radius:3px;padding:13px 15px;margin-top:14px}
.pm-rappel b{display:block;font:600 9px/1.5 var(--mono);letter-spacing:.14em;text-transform:uppercase;
  color:var(--ardoise);margin-bottom:9px}
.pm-rappel ul{margin:0;padding:0;list-style:none}
.pm-rappel li{display:flex;align-items:baseline;gap:6px;font:400 14px/1.8 var(--serif);
  color:rgba(36,59,56,.72)}
.pm-rappel .lead{flex:1;border-bottom:1px dotted rgba(19,30,28,.25);transform:translateY(-3px)}
.pm-rappel .qty{font:600 12px/1 var(--mono)}
.pm-rappel p{margin:10px 0 0;font:italic 400 13px/1.5 var(--serif);color:var(--ardoise)}
.pm-souslbl{font:600 9px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;
  color:var(--ardoise);margin:18px 0 2px}

.pm-shop{list-style:none;margin:0;padding:0}
.pm-shop li{border-bottom:1px solid rgba(19,30,28,.10)}
.pm-shopbtn{width:100%;display:flex;align-items:center;gap:11px;background:transparent;border:0;
  padding:12px 2px;cursor:pointer;text-align:left;color:inherit;font:400 15px/1.45 var(--serif)}
.pm-box{flex:0 0 16px;width:16px;height:16px;border:1.5px solid var(--encre);border-radius:2px;
  position:relative;background:transparent}
.pm-shopbtn[data-on="1"] .pm-box{background:var(--ocre);border-color:var(--ocre)}
.pm-shopbtn[data-on="1"] .pm-box::after{content:"";position:absolute;left:3px;top:3px;width:7px;height:3px;
  border-left:2px solid var(--encre);border-bottom:2px solid var(--encre);transform:rotate(-45deg)}
.pm-shopbtn .nom{flex:0 1 auto}
.pm-shopbtn .lead{flex:1 1 auto;min-width:12px;border-bottom:1px dotted rgba(19,30,28,.35);
  transform:translateY(-4px)}
.pm-shopbtn .qty{flex:0 0 auto;font:600 12px/1 var(--mono);color:var(--encre)}
.pm-shopbtn[data-on="1"] .nom{text-decoration:line-through;color:rgba(36,59,56,.45)}
.pm-shopbtn[data-on="1"] .qty{color:rgba(36,59,56,.45)}
.pm-shopbtn[data-on="1"] .lead{border-bottom-color:rgba(19,30,28,.15)}
.pm-fini{background:var(--ocre);color:var(--encre);border-radius:3px;padding:13px 16px;margin-top:20px;
  font:600 10px/1.5 var(--mono);letter-spacing:.14em;text-transform:uppercase}

button:focus-visible,input:focus-visible{outline:2px solid var(--ocre);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
@media (max-width:520px){
  .pm-num{font-size:46px}
  .pm-mealbtn{grid-template-columns:46px 1fr;row-gap:4px}
  .pm-kc{grid-column:2;text-align:left}
  .pm-tabs button{font-size:10px;letter-spacing:0}
  .pm-shopbtn{padding:14px 2px}
}
`;

/* ---------------------------- composant ---------------------------- */

export default function PlanRepas() {
  const [poids, setPoids] = useState(75);
  const [metier, setMetier] = useState("assis");
  const [jour, setJour] = useState(() => (new Date().getDay() + 6) % 7);
  const [ouvert, setOuvert] = useState(null);
  const [vue, setVue] = useState("semaine");
  const [scopeCourses, setScopeCourses] = useState(null);
  const [groupe, setGroupe] = useState("rayon");
  const [coche, setCoche] = useState({});

  useEffect(() => {
    try {
      const p = localStorage.getItem("profil");
      if (p) {
        const o = JSON.parse(p);
        if (o.poids) setPoids(o.poids);
        if (o.metier) setMetier(o.metier);
      }
      const c = localStorage.getItem("courses");
      if (c) setCoche(JSON.parse(c));
    } catch (e) { /* premier lancement */ }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem("profil", JSON.stringify({ poids, metier })); } catch (e) {}
    }, 500);
    return () => clearTimeout(id);
  }, [poids, metier]);

  useEffect(() => {
    try { localStorage.setItem("courses", JSON.stringify(coche)); } catch (e) {}
  }, [coche]);

  const kg = Math.min(140, Math.max(45, Number(poids) || 75));
  const maintien = Math.round(kg * (metier === "assis" ? 32 : 36));
  const cible = maintien + 250;
  const prot = Math.round(kg * 1.8);
  const lip = Math.round(kg * 1);
  const gluc = Math.round((cible - prot * 4 - lip * 9) / 4);
  const scale = cible / BASE_KCAL;

  const repart = useMemo(() => repartition(scale), [scale]);
  const rayons = useMemo(() => parRayon(scale, repart, scopeCourses), [scale, repart, scopeCourses]);
  const plats = useMemo(() => parPlat(scale, repart, scopeCourses), [scale, repart, scopeCourses]);

  const joursFournee = useMemo(() => {
    const s = new Set();
    Object.values(repart).forEach((r) =>
      Object.entries(r.parJour).forEach(([j, n]) => n && s.add(Number(j)))
    );
    return s;
  }, [repart]);

  const prefixe = `${scopeCourses === null ? "sem" : "j" + scopeCourses}|${groupe}|`;
  const basculer = (k) => setCoche((c) => ({ ...c, [k]: !c[k] }));
  const viderScope = () =>
    setCoche((c) => Object.fromEntries(Object.entries(c).filter(([k]) => !k.startsWith(prefixe))));

  const cles = useMemo(() => {
    if (groupe === "rayon") {
      return CATS.flatMap((c) => (rayons[c] || []).map((i) => `${prefixe}${i.n}|${i.u}`));
    }
    return [...plats.fournees, ...plats.repas].flatMap((g) =>
      g.items.map((i, k) => `${prefixe}${g.id}|${k}|${i.n}`)
    );
  }, [groupe, rayons, plats, prefixe]);

  const nbTotal = cles.length;
  const nbCoches = cles.filter((k) => coche[k]).length;
  const fini = nbTotal > 0 && nbCoches === nbTotal;

  const d = SEMAINE[jour];
  const evals = d.repas.map((r) => evalRepas(r, scale));
  const totKcal = evals.reduce((s, e) => s + e.kcal, 0);
  const totProt = evals.reduce((s, e) => s + e.prot, 0);

  const partsDuJour = scopeCourses === null ? [] :
    SEMAINE[scopeCourses].repas.filter((r) => r.tarte).map((r) => ({
      nom: TARTES[r.tarte].nom,
      parts: Math.max(0.5, Math.round(r.parts * scale * 2) / 2),
      cuiteAujourdhui: (repart[r.tarte].parJour[scopeCourses] || 0) > 0,
    }));

  const nbTartesJour = scopeCourses === null ? 0 :
    Object.values(repart).reduce((s, r) => s + (r.parJour[scopeCourses] || 0), 0);

  const ligne = (k, nom, qte) => {
    const on = !!coche[k];
    return (
      <li key={k}>
        <button className="pm-shopbtn" data-on={on ? 1 : 0}
          role="checkbox" aria-checked={on} onClick={() => basculer(k)}>
          <span className="pm-box" />
          <span className="nom">{nom}</span>
          <span className="lead" />
          <span className="qty">{qte}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="pm-root">
      <style>{CSS}</style>

      <div className="pm-band">
        <div className="pm-wrap">
          <div className="pm-eyebrow">Objectif +0,25 kg de muscle / 2 semaines</div>
          <h1 className="pm-title">Une semaine<br />de tartes</h1>
          <p className="pm-sub">
            Six quiches et tartes cuites en deux fournées, découpées en parts sur la
            semaine. Vendredi sans viande. Le nombre de parts s'ajuste à ton poids.
          </p>

          <div className="pm-ctrl">
            <div className="pm-field">
              <label htmlFor="poids">Poids actuel</label>
              <div className="pm-poids">
                <input id="poids" type="number" min="45" max="140" value={poids}
                  onChange={(e) => setPoids(e.target.value)} />
                <span>kg</span>
              </div>
            </div>
            <div className="pm-field">
              <label>Journée hors sport</label>
              <div className="pm-seg">
                <button data-on={metier === "assis" ? 1 : 0} onClick={() => setMetier("assis")}>Plutôt assise</button>
                <button data-on={metier === "actif" ? 1 : 0} onClick={() => setMetier("actif")}>Plutôt debout</button>
              </div>
            </div>
          </div>

          <div className="pm-targets">
            <div className="pm-t"><b>{fmtN(cible)}</b><i>kcal / jour</i></div>
            <div className="pm-t"><b>{prot} g</b><i>protéines</i></div>
            <div className="pm-t"><b>{gluc} g</b><i>glucides</i></div>
            <div className="pm-t"><b>{lip} g</b><i>lipides</i></div>
            <div className="pm-t"><b>+125 g</b><i>par semaine</i></div>
          </div>
        </div>
      </div>

      <div className="pm-wrap">
        <div className="pm-switch">
          <button data-on={vue === "semaine" ? 1 : 0} onClick={() => setVue("semaine")}>Menus</button>
          <button data-on={vue === "fournees" ? 1 : 0} onClick={() => setVue("fournees")}>Fournées</button>
          <button data-on={vue === "courses" ? 1 : 0} onClick={() => setVue("courses")}>Courses</button>
        </div>

        {vue === "semaine" && (
          <>
            <div className="pm-tabs">
              {SEMAINE.map((s, i) => (
                <button key={s.abbr} data-on={i === jour ? 1 : 0}
                  onClick={() => { setJour(i); setOuvert(null); }}
                  aria-label={s.jour + (s.seance ? ", jour de séance" : "")}>
                  {s.abbr}
                  <span className="pm-dot" data-off={s.seance ? 0 : 1} />
                </button>
              ))}
            </div>

            <div className="pm-dayhead">
              <div className="pm-num">{d.num}</div>
              <div>
                <div className="pm-dayname">{d.jour}</div>
                <div className="pm-tags">
                  <span className="pm-tag" data-seance={d.seance ? 1 : 0}>
                    {d.seance ? "Séance · gainage, abdos, squats, pompes" : "Récupération"}
                  </span>
                  {d.sansViande && <span className="pm-tag" data-vege="1">Sans viande</span>}
                </div>
              </div>
            </div>

            {d.repas.map((r, i) => {
              const on = ouvert === i;
              const v = evals[i];
              const tt = r.tarte ? TARTES[r.tarte] : null;
              const rec = tt || r;
              return (
                <div className="pm-meal" key={r.h + r.t}>
                  <button className="pm-mealbtn" aria-expanded={on} onClick={() => setOuvert(on ? null : i)}>
                    <span className="pm-h">{r.h}</span>
                    <span>
                      <span className="pm-tt">{r.t}</span>
                      {v.parts && <span className="pm-parts">{fmtParts(v.parts)} part{v.parts > 1 ? "s" : ""} sur 6</span>}
                    </span>
                    <span className="pm-kc">{fmtN(v.kcal)} kcal · {v.prot} g prot</span>
                  </button>

                  {on && (
                    <div className="pm-recipe">
                      <div className="pm-rmeta">
                        {tt
                          ? `Moule de 26 cm, 6 parts · ${tt.temps} · ${TYPES[tt.type]} · fournée du ${labelFournee(tt)}`
                          : `Pour 1 personne · ${r.temps}`}
                      </div>

                      <div className="pm-lbl">
                        {tt ? "Ingrédients de la tarte entière" : "Ingrédients"}
                      </div>
                      <ul className="pm-ing">
                        {rec.ing.map((ing) => (
                          <li key={ing.n}>
                            <span>{ing.n}</span><span className="lead" />
                            <span className="qty">
                              {ing.fixe ? "au goût" : fmtQ(ing.q, ing.u, tt ? 1 : scale)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="pm-lbl">Préparation</div>
                      <ol className="pm-steps">{rec.etapes.map((e) => <li key={e}>{e}</li>)}</ol>

                      {rec.astuce && (
                        <div className="pm-astuce">
                          <b>Le détail qui compte</b>
                          <p>{rec.astuce}</p>
                        </div>
                      )}

                      {tt && r.acc.length > 0 && (
                        <>
                          <div className="pm-lbl" style={{ marginTop: 22 }}>À côté, pour ce repas</div>
                          <ul className="pm-ing" style={{ marginBottom: 0 }}>
                            {r.acc.flatMap((k) => ACC[k].ing).map((ing) => (
                              <li key={ing.n}>
                                <span>{ing.n}</span><span className="lead" />
                                <span className="qty">{fmtQ(ing.q, ing.u, scale)}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pm-total">
              <span>Total du jour</span>
              <span>{fmtN(totKcal)} kcal · {totProt} g prot</span>
            </div>

            <div className="pm-note">
              <h4>Comment piloter</h4>
              <p>
                Pèse-toi deux fois par semaine, le matin à jeun, et compare les
                moyennes de deux semaines : la cible est +250 g sur cette période.
              </p>
              <p>
                Si la moyenne ne bouge pas, ajoute une demi-part de tarte par jour.
                Si tu prends plus de 400 g, retire-en autant.
              </p>
              <p>
                Une part de quiche apporte beaucoup de lipides et peu de protéines
                pour ses calories : c'est le fromage blanc du matin et des collations
                qui tient la cible protéique. Ne les saute pas.
              </p>
            </div>
          </>
        )}

        {vue === "fournees" && (
          <>
            <div className="pm-note" style={{ marginTop: 24 }}>
              <h4>Les cinq règles d'une quiche réussie</h4>
              <ol>
                <li>Ne jamais étirer la pâte pour la faire entrer dans le moule : elle se rétracte au four et le bord retombe. On la pousse dans l'angle, on ne la tire pas.</li>
                <li>Toujours cuire le fond à blanc, 10 minutes avec des poids puis 3 minutes sans. C'est ce qui sépare une pâte croustillante d'une semelle molle.</li>
                <li>Assécher la garniture avant de la mettre en place, et la laisser tiédir. L'eau des légumes et la chaleur sont les deux ennemies de l'appareil.</li>
                <li>Battre l'appareil sans le faire mousser, et compter un œuf pour 90 à 100 ml de liquide. En dessous ça ne prend pas, au-dessus ça devient une omelette.</li>
                <li>Laisser reposer 10 minutes après la sortie du four avant de découper. La quiche continue de prendre en refroidissant.</li>
              </ol>
            </div>

            {[DIMANCHE, MERCREDI].map((jf) => (
              <div key={jf}>
                <div className="pm-catlbl">
                  {JOURS[jf]} · {jf === DIMANCHE ? "pour lundi à mercredi" : "pour jeudi à dimanche"}
                </div>
                {Object.entries(TARTES).filter(([id]) => (repart[id].parJour[jf] || 0) > 0).map(([id, v]) => {
                  const nb = repart[id].parJour[jf];
                  return (
                    <div className="pm-four" key={id}>
                      <div>
                        <div className="pm-fnom">
                          {v.nom}
                          <span className="pm-type" data-t={v.type}>{TYPES[v.type]}</span>
                        </div>
                        <div className="pm-fdet">
                          {fmtParts(BESOINS[id] * scale)} parts sur la semaine · {v.temps}
                        </div>
                      </div>
                      <div className="pm-fq">{nb} tarte{nb > 1 ? "s" : ""}</div>
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="pm-note">
              <h4>Organisation d'une fournée</h4>
              <p>
                Travaille en chaîne plutôt qu'en série : prépare toutes les garnitures
                d'abord, sur deux feux en parallèle, puis enchaîne les cuissons à blanc
                pendant que les garnitures refroidissent. Compte une heure et demie
                pour la fournée du dimanche, deux heures pour celle du mercredi.
              </p>
              <p>
                La fournée du mercredi couvre quatre jours : congèle à l'unité les parts de
                tarte au thon et de tarte courgette prévues pour dimanche, posées sur une plaque
                avant d'aller en sac. Sortie la veille au frigo, puis 10 minutes à
                160 °C pour retrouver une pâte croustillante.
              </p>
              <p>
                Deux moules de 26 cm te font gagner un temps considérable, l'un cuit
                pendant que tu fonces l'autre.
              </p>
            </div>
          </>
        )}

        {vue === "courses" && (
          <>
            <div className="pm-tabs">
              <button data-wide="1" data-on={scopeCourses === null ? 1 : 0}
                onClick={() => setScopeCourses(null)}>
                SEM
                <span className="pm-dot" data-off="1" />
              </button>
              {SEMAINE.map((s, i) => (
                <button key={s.abbr} data-on={scopeCourses === i ? 1 : 0}
                  onClick={() => setScopeCourses(i)}
                  aria-label={s.jour + (joursFournee.has(i) ? ", jour de fournée" : "")}>
                  {s.abbr}
                  <span className="pm-dot" data-four="1" data-off={joursFournee.has(i) ? 0 : 1} />
                </button>
              ))}
            </div>

            <div className="pm-group">
              <button data-on={groupe === "rayon" ? 1 : 0} onClick={() => setGroupe("rayon")}>
                Par rayon
              </button>
              <button data-on={groupe === "plat" ? 1 : 0} onClick={() => setGroupe("plat")}>
                Par plat
              </button>
            </div>

            <div className="pm-scope">
              <div className="pm-scopeh">
                {scopeCourses === null ? "Toute la semaine" : SEMAINE[scopeCourses].jour}
              </div>
              <div className="pm-scopen">
                {scopeCourses === null
                  ? `${Object.values(repart).reduce((s, r) => s + r.total, 0)} tartes`
                  : nbTartesJour > 0 ? `${nbTartesJour} tarte${nbTartesJour > 1 ? "s" : ""} à cuire` : "rien à cuire"}
              </div>
            </div>

            <p className="pm-hint">
              {groupe === "rayon"
                ? "Tout est additionné et rangé comme dans le magasin. C'est la liste à sortir devant les étals."
                : "Chaque plat avec ses ingrédients à lui. C'est la liste à vérifier avant de se mettre aux fourneaux."}
            </p>

            <div className="pm-prog">
              <div className="pm-progbar">
                <span style={{ width: nbTotal ? `${(nbCoches / nbTotal) * 100}%` : "0%" }} />
              </div>
              <div className="pm-progl">
                <span className="pm-progn">{nbCoches} sur {nbTotal} cochés</span>
                <button className="pm-reset" onClick={viderScope} disabled={nbCoches === 0}>
                  Tout décocher
                </button>
              </div>
            </div>

            {groupe === "rayon" && (
              <>
                {partsDuJour.length > 0 && (
                  <div className="pm-frigo">
                    <b>Parts à prévoir ce jour-là</b>
                    <ul>
                      {partsDuJour.map((p, i) => (
                        <li key={p.nom + i}>
                          <span>{p.nom}{p.cuiteAujourdhui ? " (cuite du jour)" : ""}</span>
                          <span className="lead" />
                          <span className="qty">{fmtParts(p.parts)} part{p.parts > 1 ? "s" : ""}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {CATS.map((c) => (
                  (rayons[c] || []).length > 0 && (
                    <div key={c}>
                      <div className="pm-catlbl">{c}</div>
                      <ul className="pm-shop">
                        {rayons[c].map((i) =>
                          ligne(`${prefixe}${i.n}|${i.u}`, i.n, i.fixe ? "à avoir" : fmtQ(i.total, i.u))
                        )}
                      </ul>
                    </div>
                  )
                ))}
              </>
            )}

            {groupe === "plat" && (
              <>
                {plats.fournees.length > 0 && (
                  <>
                    <div className="pm-sect">Tartes à cuire</div>
                    {plats.fournees.map((g) => (
                      <div className="pm-plat" key={g.id}>
                        <div className="pm-plath">
                          <div>
                            <div className="pm-platn">{g.nom}</div>
                            <div className="pm-platm">{g.meta}</div>
                          </div>
                          <div className="pm-platq">{g.qte}</div>
                        </div>
                        <ul className="pm-shop">
                          {g.items.map((i, k) =>
                            ligne(`${prefixe}${g.id}|${k}|${i.n}`, i.n,
                              i.fixe ? "au goût" : fmtQ(i.total, i.u))
                          )}
                        </ul>
                      </div>
                    ))}
                  </>
                )}

                {plats.repas.length > 0 && (
                  <>
                    <div className="pm-sect">Repas et à-côtés</div>
                    {plats.repas.map((g) => (
                      <div className="pm-plat" key={g.id}>
                        <div className="pm-plath">
                          <div>
                            <div className="pm-platn">{g.nom}</div>
                            <div className="pm-platm">{g.meta}</div>
                          </div>
                        </div>

                        {g.tarte && (
                          <div className="pm-rappel">
                            <b>
                              {fmtParts(g.tarte.parts)} part{g.tarte.parts > 1 ? "s" : ""} de {g.tarte.nom}
                              {" · "}fournée du {g.tarte.fournee}
                            </b>
                            <ul>
                              {g.tarte.ing.map((i) => (
                                <li key={i.n}>
                                  <span>{i.n}</span><span className="lead" />
                                  <span className="qty">{i.fixe ? "au goût" : fmtQ(i.q, i.u)}</span>
                                </li>
                              ))}
                            </ul>
                            <p>
                              Pour la tarte entière, comptés une seule fois dans « Tartes à
                              cuire ». Rien à racheter pour ce repas.
                            </p>
                          </div>
                        )}

                        {g.items.length > 0 && (
                          <>
                            {g.tarte && <div className="pm-souslbl">À acheter en plus</div>}
                            <ul className="pm-shop">
                              {g.items.map((i, k) =>
                                ligne(`${prefixe}${g.id}|${k}|${i.n}`, i.n,
                                  i.fixe ? "au goût" : fmtQ(i.total, i.u))
                              )}
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {fini && <div className="pm-fini">Liste complète — bonne fournée</div>}

            <div className="pm-note">
              <h4>À savoir</h4>
              <p>
                Chaque combinaison de jour et de regroupement garde ses propres cases
                cochées, et elles survivent à la fermeture de l'application. Un même
                ingrédient revient dans plusieurs plats, donc le cocher dans l'un ne
                le coche pas dans les autres.
              </p>
              <p>
                Les ingrédients d'une tarte sont comptés le jour où elle passe au four,
                pas les jours où tu la manges : la somme des sept jours donne
                exactement la liste de la semaine.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
