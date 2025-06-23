import { RecetaDTO } from "./RecetaDTO";

export interface MedicamentoDTO {
    id_medicamento?: number;
    receta?: any;
    nombre_medicamento: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    observaciones: string;
}
