import { ref } from "vue";
//peticiones axios
export function useServicios() {
  const data = ref([
    {
      id: 1,
      servicio: "Servicios Tecnologicos TI",
    },
    {
      id: 2,
      servicio: "Importadora  de pernos, tuerca, golillas ",
    },
    {
      id: 3,
      servicio: "Soluciones Mecánicas",
    },
    {
      id: 4,
      servicio: "Reciclaje residuos electrónicos y eléctricos ",
    },
    {
      id: 5,
      servicio: "Importación Repuestos originales Komatsu, Caterpillar, Sandvik y más.",
    },
    {
      id: 6,
      servicio: "Consultoria de transporte",
    },
  ]);

  return {
    data,
  };
}
