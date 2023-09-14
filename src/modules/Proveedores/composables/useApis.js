import { ref } from "vue";
//peticiones axios
export function useApis() {
  const data = ref([
    {
      id: 1,
      nombreProveedor: "MARIA BEATRIZ VALENCIA LÓPEZ",
      referencia: "RESTAURANT",
      codSAP: '0086576929',
      nroIdentificacion: "4687465-K",
      ps: "CL",
      poblacion: "CONCEPCION",
      calle: "VOLCAN VILLARRICA Nº 800",
      direccion: "0000050407"
    },
    {
      id: 2,
      nombreProveedor: "LEONEL BADILLA LIZAMA",
      referencia: "ACREEDOR",
      codSAP: '0081115893',
      nroIdentificacion: "8111589-3",
      ps: "CL",
      poblacion: "SANTIAGO",
      calle: "ESTACION CENTRAL",
      direccion: "0000049969"
    },
    {
      id: 3,
      nombreProveedor: "RUTH LANATA FUENZALIDA",
      referencia: "SERVICIOS",
      codSAP: '0082636722',
      nroIdentificacion: "8263672-2",
      ps: "CL",
      poblacion: "CONCEPCION",
      calle: "OHIGGINS DPTO. 603 630",
      direccion: "0000038736"
    },
    {
      id: 4,
      nombreProveedor: "ANA ROZAS MEDINA",
      referencia: "CAMPAMENTO",
      codSAP: '0082921230',
      nroIdentificacion: "8292123-0",
      ps: "CL",
      poblacion: "PEÑAFLOR",
      calle: "CAMPAMENTO JUAN PABLO II S/N",
      direccion: "0000039310"
    },
    {
      id: 5,
      nombreProveedor: "LIBERTAD PACO BOLAÑOS",
      referencia: "SUPERMERCADO",
      codSAP: '0083571721',
      nroIdentificacion: "8357172-1",
      ps: "CL",
      poblacion: "PUTRE",
      calle: "BAQUEDANO 301",
      direccion: "0000036380"
    },
  ]);

  return {
    data,
  };
}
