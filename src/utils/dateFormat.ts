const formatDate = (isoString: string): string => {
    const date = new Date(isoString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
}

export default formatDate
