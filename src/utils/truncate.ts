export const truncate = (str = "", max = 20, sep = "...") => {
  const len = str.length;
  if (len > max) {
    const seplen = sep.length;

    // If seperator is larger than character limit,
    // well then we don't want to just show the seperator,
    // so just show right hand side of the string.
    if (seplen > max) {
      return str.substr(len - max);
    }

    // Half the difference between max and string length.
    // Multiply negative because small minus big.
    // Must account for length of separator too.
    const n = -0.5 * (max - len - seplen);

    // This gives us the centerline.
    const center = len / 2;

    const front = str.substr(0, center - n);
    const back = str.substr(len - center + n); // without second arg, will automatically go to end of line.

    return front + sep + back;
  }

  return str;
};
