import { RecetaDTO } from "./RecetaDTO";

export interface CitaDTO {
    idCitas: number;
    paciente: {
        idUsuario: number;
        nombre: string;
        apellido: string;
        grupoSanguineo: string;
    };
    medico: {
        idUsuario: number;
        nombre: string;
        apellido: string;
        especialidad: string;
    };
    fecha: string;
    hora: string;
    tratamiento: string;
    notasMedicas: string;
    diagnostico: string;
    estado: string;
    recetaDTO?: RecetaDTO;
}
