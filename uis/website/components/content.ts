import type {
  ContactItem,
  DepartmentItem,
  HighlightItem,
  NavItem,
  ServiceItem,
} from "./types";

export const navItems: NavItem[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Por que Nexova", href: "#por-que-nexova" },
  { label: "Organizacion", href: "#organizacion" },
  { label: "Contacto", href: "#contacto" },
];

export const services: ServiceItem[] = [
  {
    title: "Headhunting Ejecutivo",
    bullets: [
      "Busqueda y seleccion de perfiles ejecutivos y mandos medios",
      "Proceso personalizado con garantia de reemplazo",
    ],
  },
  {
    title: "Outsourcing de Atencion al Cliente",
    bullets: [
      "Equipos especializados para empresas tecnologicas",
      "Formacion continua y supervision dedicada",
    ],
  },
  {
    title: "Formacion Corporativa",
    bullets: [
      "Programas de soft skills y liderazgo",
      "Cursos presenciales y en linea adaptados a cada organizacion",
    ],
  },
];

export const highlights: HighlightItem[] = [
  { text: "12 anos de experiencia en el mercado latinoamericano" },
  { text: "Presencia regional: Espana y Estados Unidos" },
  { text: "+500 procesos exitosos de seleccion completados" },
  { text: "Especializacion en tecnologia, retail y finanzas" },
];

export const coreDepartments: DepartmentItem[] = [
  {
    title: "Operaciones de Seleccion",
    description:
      "Lidera los procesos de reclutamiento de principio a fin, desde la definicion del perfil hasta la incorporacion del talento.",
  },
  {
    title: "Formacion Corporativa",
    description:
      "Disena e imparte programas de liderazgo, comunicacion y gestion de equipos para fortalecer capacidades internas de los clientes.",
  },
  {
    title: "Soporte al Cliente Externalizado",
    description:
      "Proporciona equipos dedicados de atencion para acompanar a empresas de tecnologia, retail y servicios financieros.",
  },
  {
    title: "Ventas y Desarrollo de Negocio",
    description:
      "Impulsa el crecimiento comercial con gestion de cuentas, nuevas oportunidades y expansion de relaciones con clientes.",
  },
  {
    title: "Marketing y Comunicacion",
    description:
      "Gestiona la presencia de marca en canales digitales y contenidos para fortalecer posicionamiento y alcance.",
  },
];

export const supportDepartments: DepartmentItem[] = [
  {
    title: "Recursos Humanos",
    description:
      "Acompana el ciclo de vida del colaborador, incluyendo incorporacion, desarrollo y gestion administrativa interna.",
  },
  {
    title: "Tecnologia e Infraestructura",
    description:
      "Sostiene el ecosistema tecnologico de la compania y habilita la operacion digital de todas las areas.",
  },
];

export const contacts: ContactItem[] = [
  {
    label: "Email",
    value: "contacto@nexova.com",
    href: "mailto:contacto@nexova.com",
  },
  {
    label: "Valencia",
    value: "+34 960 123 456",
    href: "tel:+34960123456",
  },
  {
    label: "Miami",
    value: "+1 305 555 0191",
    href: "tel:+13055550191",
  },
];
