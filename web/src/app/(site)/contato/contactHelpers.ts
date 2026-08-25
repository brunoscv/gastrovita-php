export function toWhatsappLink(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent("Olá, eu gostaria de mais informações!")}`;
}
