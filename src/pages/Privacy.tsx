import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useLanguage } from "@/i18n/LanguageContext";

const privacyCopy = {
  fr: {
    title: "Confidentialité et protection des données",
    subtitle: "Informations essentielles sur la collecte, l'usage et la protection des données personnelles transmises à TransferAI Africa.",
    sections: [
      {
        title: "Données collectées",
        text: "Nous collectons uniquement les informations nécessaires au traitement des demandes de catalogue, de renseignement, d'inscription, de devis et de prise de rendez-vous : identité, email, téléphone, entreprise, besoin exprimé et informations utiles à la qualification de la demande.",
      },
      {
        title: "Finalités",
        text: "Ces données sont utilisées exclusivement pour répondre au prospect, préparer une proposition commerciale, organiser un échange ou une inscription, et assurer le suivi de la relation commerciale.",
      },
      {
        title: "Protection technique",
        text: "Les formulaires publics sont traités via des fonctions sécurisées. Les tables de données prospects ne sont pas exposées en lecture publique. Les analytics accessibles au front sont limités à des statistiques agrégées.",
      },
      {
        title: "Vos droits",
        text: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à",
      },
      {
        title: "Point important",
        text: "Cette page soutient la conformité et la transparence du site, mais ne remplace pas un audit juridique local. Pour une conformité complète, il reste recommandé de faire valider la politique de confidentialité, la rétention et les bases légales par un juriste ou un DPO.",
      },
    ],
  },
  en: {
    title: "Privacy and data protection",
    subtitle: "Key information about how personal data shared with TransferAI Africa is collected, used and protected.",
    sections: [
      {
        title: "Data collected",
        text: "We collect only the information required to process catalogue requests, information requests, registrations, quote requests and appointment bookings: identity, email, phone number, company, expressed need and any information useful to qualify the request.",
      },
      {
        title: "Purposes",
        text: "This data is used exclusively to answer the prospect, prepare a commercial proposal, organize an exchange or registration, and ensure proper follow-up of the business relationship.",
      },
      {
        title: "Technical protection",
        text: "Public forms are handled through secured functions. Prospect data tables are not exposed for public reading. Analytics available to the frontend are limited to aggregated statistics.",
      },
      {
        title: "Your rights",
        text: "You may request access, correction or deletion of your data by writing to",
      },
      {
        title: "Important note",
        text: "This page supports transparency and privacy compliance, but it does not replace a local legal audit. For full compliance, the privacy policy, retention rules and legal bases should still be validated by legal counsel or a DPO.",
      },
    ],
  },
} as const;

const Privacy = () => {
  const { language } = useLanguage();
  const copy = privacyCopy[language];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedLogoWatermarks />
        <Navbar />
        <PageHeader title={copy.title} subtitle={copy.subtitle} />

        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4 lg:px-8">
            <div className="space-y-8 rounded-3xl border border-border bg-card/80 p-8 text-sm leading-relaxed text-muted-foreground">
              {copy.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-heading text-xl font-bold text-card-foreground">{section.title}</h2>
                  <p className="mt-3">
                    {section.text}{" "}
                    {section.title === copy.sections[3].title && (
                      <a href="mailto:contact@transferai.ci" className="text-primary hover:underline">
                        contact@transferai.ci
                      </a>
                    )}
                    {section.title === copy.sections[3].title ? "." : ""}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Privacy;
