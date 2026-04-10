import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { formations } from "@/data/formations";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveActiveLanguage } from "@/i18n/resolveLanguage";

const SITE_NAME = "TransferAI Africa";
const DEFAULT_IMAGE_PATH = "/placeholder.svg";

type SeoMeta = {
  title: string;
  description: string;
  robots: string;
  canonicalPath: string;
  ogType: "website" | "article";
};

const setMetaTag = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonicalLink = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const buildAbsoluteUrl = (pathname: string) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.transferai.ci";
  return new URL(pathname, origin).toString();
};

const getDefaultSeoMeta = (language: "fr" | "en"): SeoMeta => {
  if (language === "en") {
    return {
      title: "TransferAI Africa | AI training, certification, and services in Africa",
      description:
        "TransferAI Africa helps professionals, companies, and institutions in Côte d'Ivoire and across Africa learn AI, deploy practical solutions, and access new opportunities.",
      robots: "index,follow",
      canonicalPath: "/",
      ogType: "website",
    };
  }

  return {
    title: "TransferAI Africa | Formations, certification et services IA en Afrique",
    description:
      "TransferAI Africa forme les talents, les entreprises et les institutions en Côte d'Ivoire et en Afrique à l'IA, aux parcours métier, à la certification et aux services de transformation.",
    robots: "index,follow",
    canonicalPath: "/",
    ogType: "website",
  };
};

const getSeoMeta = (pathname: string, language: "fr" | "en"): SeoMeta => {
  const detailMatch = matchPath("/catalogue/:id", pathname);
  if (detailMatch?.params.id) {
    const formation = formations.find((item) => item.id === detailMatch.params.id);

    if (formation) {
      const formationTitle = language === "en" ? formation.titleEn : formation.title;
      const metier = formation.metier;

      return {
        title: `${formationTitle} | ${SITE_NAME}`,
        description:
          language === "en"
            ? `Discover the objectives, delivery format, programme, and next step for ${formationTitle}, an AI training designed for ${metier.toLowerCase()} roles.`
            : `Découvrez les objectifs, le format, le programme et la prochaine étape pour ${formationTitle}, une formation IA conçue pour le domaine ${metier.toLowerCase()}.`,
        robots: "index,follow",
        canonicalPath: pathname,
        ogType: "article",
      };
    }
  }

  const routeMap: Array<{ path: string; meta: SeoMeta }> = language === "en"
    ? [
        {
          path: "/education",
          meta: {
            title: `Education | ${SITE_NAME}`,
            description:
              "Explore AI training paths, catalogue options, certification, and live formats to choose the right learning journey for your profession.",
            robots: "index,follow",
            canonicalPath: "/education",
            ogType: "website",
          },
        },
        {
          path: "/catalogue",
          meta: {
            title: `Catalogue | ${SITE_NAME}`,
            description:
              "Browse 130+ practical AI courses across 13 areas of expertise, compare formats and levels, and quickly find the right training.",
            robots: "index,follow",
            canonicalPath: "/catalogue",
            ogType: "website",
          },
        },
        {
          path: "/parcours",
          meta: {
            title: `Learning paths | ${SITE_NAME}`,
            description:
              "Follow guided AI learning paths by profession, level, and objective to progress with clarity and real-world outcomes.",
            robots: "index,follow",
            canonicalPath: "/parcours",
            ogType: "website",
          },
        },
        {
          path: "/services",
          meta: {
            title: `AI services | ${SITE_NAME}`,
            description:
              "Discover TransferAI Africa's AI consulting, automation, and media services to frame, deploy, and sustain practical AI initiatives.",
            robots: "index,follow",
            canonicalPath: "/services",
            ogType: "website",
          },
        },
        {
          path: "/certification",
          meta: {
            title: `AI certification | ${SITE_NAME}`,
            description:
              "Discover the premium AI certification for support and management roles, with a common core and profession-based specialization starting in October 2026.",
            robots: "index,follow",
            canonicalPath: "/certification",
            ogType: "website",
          },
        },
        {
          path: "/outils-ia",
          meta: {
            title: `AI tools by domain | ${SITE_NAME}`,
            description:
              "Explore the recommended AI tools, low-code stacks, workflow platforms, and training formats for each business domain covered by TransferAI Africa.",
            robots: "index,follow",
            canonicalPath: "/outils-ia",
            ogType: "website",
          },
        },
        {
          path: "/blog",
          meta: {
            title: `Resources & AI watch | ${SITE_NAME}`,
            description:
              "Read practical AI resources, market watch, expert insights, and opportunity-driven content for Côte d'Ivoire and Africa.",
            robots: "index,follow",
            canonicalPath: "/blog",
            ogType: "website",
          },
        },
        {
          path: "/catalogues-domaines",
          meta: {
            title: `Areas of expertise | ${SITE_NAME}`,
            description:
              "Explore all 13 areas of expertise covered by TransferAI Africa's AI training catalogue.",
            robots: "index,follow",
            canonicalPath: "/catalogues-domaines",
            ogType: "website",
          },
        },
      ]
    : [
        {
          path: "/education",
          meta: {
            title: `Education | ${SITE_NAME}`,
            description:
              "Explorez les parcours de formation IA, le catalogue, la certification et les formats live pour choisir la bonne trajectoire selon votre métier.",
            robots: "index,follow",
            canonicalPath: "/education",
            ogType: "website",
          },
        },
        {
          path: "/catalogue",
          meta: {
            title: `Catalogue | ${SITE_NAME}`,
            description:
              "Parcourez plus de 130 formations IA concrètes dans 13 domaines d'expertise, comparez les formats et trouvez rapidement la bonne formation.",
            robots: "index,follow",
            canonicalPath: "/catalogue",
            ogType: "website",
          },
        },
        {
          path: "/parcours",
          meta: {
            title: `Parcours | ${SITE_NAME}`,
            description:
              "Suivez des parcours guidés en IA par métier, niveau et objectif pour progresser avec méthode et obtenir des résultats concrets.",
            robots: "index,follow",
            canonicalPath: "/parcours",
            ogType: "website",
          },
        },
        {
          path: "/services",
          meta: {
            title: `Services IA | ${SITE_NAME}`,
            description:
              "Découvrez les services de conseil, d'automatisation et de veille IA de TransferAI Africa pour cadrer, déployer et animer votre transformation.",
            robots: "index,follow",
            canonicalPath: "/services",
            ogType: "website",
          },
        },
        {
          path: "/certification",
          meta: {
            title: `Certification IA | ${SITE_NAME}`,
            description:
              "Découvrez la certification IA premium pour les métiers support et de gestion, avec socle commun et spécialisations métier dès octobre 2026.",
            robots: "index,follow",
            canonicalPath: "/certification",
            ogType: "website",
          },
        },
        {
          path: "/outils-ia",
          meta: {
            title: `Outils IA par domaine | ${SITE_NAME}`,
            description:
              "Explorez les outils IA recommandés, les stacks low-code, les workflows et les formats de formation adaptés à chaque domaine métier couvert par TransferAI Africa.",
            robots: "index,follow",
            canonicalPath: "/outils-ia",
            ogType: "website",
          },
        },
        {
          path: "/blog",
          meta: {
            title: `Blog, ressources & veille IA | ${SITE_NAME}`,
            description:
              "Consultez les ressources pratiques, la veille IA, les contenus experts et les opportunités utiles pour la Côte d'Ivoire et l'Afrique.",
            robots: "index,follow",
            canonicalPath: "/blog",
            ogType: "website",
          },
        },
        {
          path: "/catalogues-domaines",
          meta: {
            title: `Domaines d'expertise | ${SITE_NAME}`,
            description:
              "Explorez les 13 domaines d'expertise couverts par le catalogue de formations IA de TransferAI Africa.",
            robots: "index,follow",
            canonicalPath: "/catalogues-domaines",
            ogType: "website",
          },
        },
      ];

  const match = routeMap.find((route) => route.path === pathname);
  if (match) {
    return match.meta;
  }

  if (
    pathname === "/back-office" ||
    pathname === "/contact" ||
    pathname === "/inscription" ||
    pathname === "/prise-rdv" ||
    pathname.startsWith("/preview")
  ) {
    const defaultMeta = getDefaultSeoMeta(language);
    return {
      ...defaultMeta,
      robots: "noindex,nofollow",
      canonicalPath: pathname,
    };
  }

  return {
    ...getDefaultSeoMeta(language),
    canonicalPath: pathname,
  };
};

const SeoManager = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const activeLanguage = resolveActiveLanguage(language);

  useEffect(() => {
    const meta = getSeoMeta(location.pathname, activeLanguage);
    const canonicalUrl = buildAbsoluteUrl(meta.canonicalPath);
    const imageUrl = buildAbsoluteUrl(DEFAULT_IMAGE_PATH);

    document.documentElement.lang = activeLanguage;
    document.title = meta.title;

    setCanonicalLink(canonicalUrl);

    setMetaTag("name", "description", meta.description);
    setMetaTag("name", "robots", meta.robots);
    setMetaTag("name", "author", SITE_NAME);
    setMetaTag("name", "theme-color", "#10213d");
    setMetaTag("property", "og:title", meta.title);
    setMetaTag("property", "og:description", meta.description);
    setMetaTag("property", "og:type", meta.ogType);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:locale", activeLanguage === "fr" ? "fr_FR" : "en_GB");
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", meta.title);
    setMetaTag("name", "twitter:description", meta.description);
    setMetaTag("name", "twitter:image", imageUrl);
    setMetaTag("name", "twitter:image:alt", SITE_NAME);
  }, [activeLanguage, location.pathname]);

  return null;
};

export default SeoManager;
