import { Pipe, PipeTransform } from '@angular/core';
import { CitaDTO } from '../../../interfaces/CitaDTO';

@Pipe({
    name: 'filtroPorNombre',
    standalone: true
})
export class FiltroPorNombrePipe implements PipeTransform {
    transform(citas: CitaDTO[], nombre: string): CitaDTO[] {
        if (!nombre) return citas;
        const filtro = nombre.toLowerCase();
        return citas.filter(c => c.paciente.nombre.toLowerCase().includes(filtro));
    }
}
