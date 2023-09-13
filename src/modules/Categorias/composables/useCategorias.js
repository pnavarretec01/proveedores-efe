import { ref } from "vue";
//peticiones axios
export function useCategorias() {
  const data = ref([
    {
      id: 1,
      categoria: "Infraestructura Ferroviaria",
    },
    {
      id: 2,
      categoria: "Material Rodante",
    },
    {
      id: 3,
      categoria: "Servicios Transversales",
    },
    {
      id: 4,
      categoria: "Servicios Transversales y Suministros",
    },
    {
      id: 5,
      categoria: "Obras Civiles",
    },
    {
      id: 6,
      categoria: "Servicios de Ingenieria",
    },
  ]);

  return {
    data,
  };
}
