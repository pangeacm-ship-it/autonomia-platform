import type { SubscriptionStatus } from "@/types/database";

export function canAccessApp(status: SubscriptionStatus | null | undefined) {
  return status === "trial" || status === "active" || status === "past_due";
}

export function canAccessOperationalModules(status: SubscriptionStatus | null | undefined) {
  return status === "trial" || status === "active" || status === "past_due";
}

export function shouldShowPaymentWarning(status: SubscriptionStatus | null | undefined) {
  return status === "past_due";
}

export function getSubscriptionAccessMessage(status: SubscriptionStatus | null | undefined) {
  switch (status) {
    case "trial":
      return "Tu periodo de prueba está activo.";
    case "active":
      return "Tu suscripción está activa.";
    case "past_due":
      return "El último cobro ha fallado. Actualiza el método de pago para evitar la suspensión.";
    case "suspended":
      return "La suscripción está suspendida. Regulariza el pago para recuperar el acceso operativo.";
    case "canceled":
      return "La suscripción está cancelada. El acceso operativo no está disponible fuera del periodo pagado.";
    default:
      return "No se ha podido confirmar el estado de la suscripción.";
  }
}
