export interface RecetaDTO {
    id_receta: number;
    cita: {
        id: number;
        tratamiento: string;
        fecha: string;
        horario: string;
        duracion: number;
        nombre: string;
        medico: string;
        estado: string;
        notas: string;
    };
    instrucciones_adicionales: string;
    firma_medico: string;
    fecha: string;
}