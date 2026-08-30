export function getRecipeYoutubeSearchUrl(title: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} 레시피`)}`;
}
