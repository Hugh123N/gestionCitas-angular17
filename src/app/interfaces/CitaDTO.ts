export interface CitaDTO {
    id: number;
    tratamiento: string;
    fecha: string;
    horario: string;
    duracion: number;
    nombre: string;       // nombre del paciente
    medico: string;       // nombre del médico
    estado: string;       // 'Finalizada', 'Pendiente', etc.
    notas: string;        // notas médicas
}