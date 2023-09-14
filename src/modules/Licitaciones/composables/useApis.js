import { ref } from "vue";
//peticiones axios
export function useApis() {
  const data = ref([
    {
      id: 1,
      licitacion: "Licitación Instalacion de Cierre Perimetral Sectores Parque Las Carboneras y Lo Errazuris",
    },
    {
      id: 2,
      licitacion: "Licitación Servicio de Mantenimiento de Sistemas de Señalización y Comunicaciones Tramo Alameda – Concepción",
    },
    {
      id: 3,
      licitacion: "Licitación Mantenimiento de Vías",
    },
    {
      id: 4,
      licitacion: "Licitación Mantenimiento Vía Ramal Talca - Constitución",
    },
    {
      id: 5,
      licitacion: "Licitación Mantenimiento y Cambio de Rieles - Balasto",
    },
    {
      id: 6,
      licitacion: "Normalizacion de vias y patios Alameda- Barrancas -  Suministro de Riel X",
    },
  ]);

  return {
    data,
  };
}
