// ════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO MENSAL — edite SÓ este arquivo todo mês 💙
// ════════════════════════════════════════════════════════════════

export const monthlyConfig = {
  // Número do mês (1 = primeiro mês, 2 = segundo, etc)
  monthNumber: 1,

  // Limite acumulado deste mês (até bater 1000 no total)
  // Ex: mês 1 = 50, mês 2 = 120, mês 3 = 200...
  monthlyLimit: 60,

  monthName: "Abril",

  tsuruColor: "#7aa9ff", // azul

  // Cor dos tsurus deste mês (hex). Todos os tsurus assumem essa cor.
  // Os de meses anteriores ficam parados no fundo, com a nova cor.
  Color: "#3880f4", // azul
  boxColor: "#ffffff",

  // ID da música do Spotify (a parte depois de /track/ e antes do ?)
  // Ex em https://open.spotify.com/track/2nl8Hksvufd3cDF7vkzQW5?si=...
  // o id é: 2nl8Hksvufd3cDF7vkzQW5
  spotifyTrackId: "2nl8Hksvufd3cDF7vkzQW5",

  // Mensagem que aparece no pop-up quando bate o limite mensal
  monthlyMessage: "O primeiro mês de muitos, azul como O som do nosso amor",
};
