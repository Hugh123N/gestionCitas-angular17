import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { ServiceService } from "../../service/service.service";
import { inject } from "@angular/core";

export const RoleGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(ServiceService);
  const router = inject(Router);

  const userRole = ""; //authService.getRole(); // Ej: 'paciente'
  const allowedRoles = route.data?.['roles'] as string[];

  if (allowedRoles?.includes(userRole)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};