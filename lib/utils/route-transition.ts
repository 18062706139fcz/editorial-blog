type TransitionCheckInput = {
  href: string;
  currentPathname: string;
  currentSearch: string;
};

export function routeTransitionKey(pathname: string, _search: string) {
  return pathname;
}

export function shouldStartRouteTransition({
  href,
  currentPathname,
  currentSearch,
}: TransitionCheckInput) {
  if (
    !href ||
    href.startsWith("http") ||
    href.startsWith("#") ||
    href.startsWith("mailto:")
  ) {
    return false;
  }

  const destination = new URL(href, "http://local");
  const current = new URL(
    `${currentPathname}${currentSearch ? `?${currentSearch}` : ""}`,
    "http://local",
  );

  if (destination.pathname === current.pathname) return false;

  return destination.href !== current.href;
}
