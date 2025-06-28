import { MedicamentoDTO } from "./MedicamentoDTO";

export interface RecetaDTO {
    idReceta: number;
    fecha: string;
    nombrePaciente: string;
    grupoSanguineoPaciente: string;
    nombreMedico: string;
    especialidadMedico: string;
    diagnostico: string;
    tratamiento: string;
    instrucciones: string;
    firmaMedico: string;
    medicamentos: string[]; // puede venir como array de strings
}

