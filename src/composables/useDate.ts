export function useDate() {
  const formatDate = (date: string) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });

    return `${day} ${month}`;
  };

  const formatFullDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatRelative = (date: string) => {
    const now = new Date();
    const d = new Date(date);

    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return {
    formatDate,
    formatFullDate,
    formatRelative,
  };
}
