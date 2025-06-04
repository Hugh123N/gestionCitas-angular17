import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { ServiceService } from "../../service/service.service";
import { inject } from "@angular/core";

import { AuthService } from '../../service/auth.service';
import { UserRole } from '../models/roles.enum';

export const RoleGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  const allowedRoles = route.data?.['roles'] as string[];

  if (!authService.isLoggedIn()) {
    // Si el usuario no está logueado, redirigir al login
    console.warn('Acceso denegado: Usuario no autenticado.');
    router.navigate(['/login']);
    return false;
  }

   // Si no hay roles permitidos definidos en la ruta, permitir el acceso (o aplicar otra lógica por defecto)
  if (!allowedRoles || allowedRoles.length === 0) {
    console.warn(
      `Advertencia: La ruta ${route.path} no tiene roles definidos. Acceso permitido por defecto.`
    );
    return true; // Considera si esto debe ser un `true` o `false` por defecto
  }

  // Verificar si el rol del usuario está entre los roles permitidos
  if (allowedRoles.includes(userRole)) {
    console.log(`Acceso permitido para rol: ${userRole}`);
    return true;
  }

  // Lógica especial para el ADMINISTRADOR: el ADMIN puede acceder a todas las rutas protegidas por roles.
  if (userRole === UserRole.ADMIN) {
    console.log(
      `Acceso permitido para ADMINISTRADOR a ruta protegida por roles: ${route.path}`
    );
    return true;
  }

  // Si el usuario no tiene un rol permitido y no es ADMIN, denegar el acceso
  console.warn(
    `Acceso denegado: Rol ${userRole} no autorizado para ${route.path}. Roles permitidos: ${allowedRoles.join(
      ', '
    )}`
  );
  router.navigate(['/']); // Redirigir a una página por defecto, o una página de "acceso denegado"
  return false;

};