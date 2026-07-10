const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const codes = [
  { code: "P2000", signification: "Valeur trop longue", message: "La valeur fournie dépasse la taille maximale autorisée." },
  { code: "P2001", signification: "Enregistrement introuvable", message: "Aucun enregistrement correspondant trouvé." },
  { code: "P2002", signification: "Contrainte unique violée", message: "Un enregistrement avec cette valeur existe déjà." },
  { code: "P2003", signification: "Violation de contrainte relationnelle", message: "La relation spécifiée est invalide ou inexistante." },
  { code: "P2004", signification: "Violation de contrainte générique", message: "La contrainte de base de données a été violée." },
  { code: "P2005", signification: "Valeur invalide", message: "La valeur fournie n’est pas valide pour ce champ." },
  { code: "P2006", signification: "Type incorrect", message: "Le type de donnée fourni est incorrect." },
  { code: "P2007", signification: "Données invalides", message: "Les données fournies ne respectent pas les règles de validation." },
  { code: "P2008", signification: "Requête invalide", message: "La requête envoyée à la base est invalide." },
  { code: "P2009", signification: "Erreur de validation", message: "Erreur de validation des données." },
  { code: "P2010", signification: "Erreur interne DB", message: "Erreur interne de la base de données." },
  { code: "P2011", signification: "Valeur nulle interdite", message: "Ce champ ne peut pas être nul." },
  { code: "P2012", signification: "Champ requis manquant", message: "Un champ obligatoire est manquant." },
  { code: "P2013", signification: "Argument manquant", message: "Un argument requis est absent." },
  { code: "P2014", signification: "Relation invalide", message: "La relation entre les entités est invalide." },
  { code: "P2015", signification: "Enregistrement lié introuvable", message: "L’enregistrement lié est introuvable." },
  { code: "P2016", signification: "Erreur d’interprétation", message: "La requête n’a pas pu être interprétée." },
  { code: "P2017", signification: "Relation invalide", message: "La relation spécifiée est invalide." },
  { code: "P2018", signification: "Champ relationnel introuvable", message: "Le champ relationnel demandé est introuvable." },
  { code: "P2019", signification: "Entrée invalide", message: "Les données fournies sont invalides." },
  { code: "P2020", signification: "Valeur hors limites", message: "La valeur est en dehors des limites autorisées." },
  { code: "P2021", signification: "Table introuvable", message: "La table spécifiée est introuvable." },
  { code: "P2022", signification: "Colonne introuvable", message: "La colonne spécifiée est introuvable." },
  { code: "P2023", signification: "Type invalide", message: "Le type de donnée est invalide." },
  { code: "P2024", signification: "Timeout", message: "La requête a dépassé le temps limite." },
  { code: "P2025", signification: "Enregistrement introuvable", message: "Impossible de trouver l’enregistrement demandé." },
  { code: "P2026", signification: "Requête non supportée", message: "Cette requête n’est pas supportée." },
  { code: "P2027", signification: "JSON invalide", message: "Le JSON fourni est invalide." },
  { code: "P2028", signification: "Erreur de migration", message: "Erreur lors de l’application des migrations." },
  { code: "P2029", signification: "Erreur de connexion", message: "Impossible de se connecter à la base de données." },
  { code: "P2030", signification: "Erreur interne Prisma", message: "Erreur interne du moteur Prisma." },
];

async function main() {
  console.log("Seeding table CodeErreur...");
  for (const c of codes) {
    await prisma.codeErreur.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
