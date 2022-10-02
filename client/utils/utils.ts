export const humanDate = (date: string): string => {
  const created = new Date(Date.parse(date));
  return `${created.toLocaleDateString("default", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const expiresDays = (date: string): string => {
  const today = Date.now();
  const expireDate = new Date(Date.parse(date)).getTime();
  const diffSeconds = Math.round((expireDate - today) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffHours <= 1) {
    return `${diffMinutes} ${diffMinutes == 1 ? "MINUTE" : "MINUTES"}`;
  } else if (diffDays <= 1) {
    return `${diffHours} ${diffHours == 1 ? "HOUR" : "HOURS"}`;
  } else {
    return `${diffDays} ${diffDays == 1 ? "DAY" : "DAYS"}`;
  }
};
