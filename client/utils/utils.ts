const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const humanDate = (date: string): string => {
  const created = new Date(Date.parse(date));
  return `${created.toLocaleDateString("default", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const expiresDays = (date: string): string => {
  const today = Date.now();
  const expireDate = new Date(Date.parse(date)).getTime();
  const diffSeconds = Math.floor((expireDate - today) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}`;
};
