/**
 * Converts a UUID to bytes32 format.
 * @param {string} uuid - The UUID to convert.
 * @returns {string} - The bytes32 representation of the UUID.
 */
export const uuidToBytes32 = (uuid: string) => {
  // Remove dashes from the UUID
  const hexStr = uuid.replace(/-/g, "");

  // Pad the hex string to ensure it's 32 bytes (64 hex chars)
  const paddedHex = hexStr.padStart(64, "0");

  return `0x${paddedHex}`;
};

/**
 * Converts a bytes32 back to UUID format.
 * @param {string} bytes32 - The bytes32 string to convert back to UUID.
 * @returns {string} - The UUID representation.
 */
export const bytes32ToUuid = (bytes32: string) => {
  // Remove the '0x' prefix if present
  const hexStr = bytes32.replace(/^0x/, "");

  // Trim leading zeros
  const trimmedHex = hexStr.replace(/^0+/, "");

  // Ensure the hex string is at least 32 characters
  const uuidHex = trimmedHex.padStart(32, "0");

  // Insert dashes at appropriate positions to form a UUID
  return `${uuidHex.slice(0, 8)}-${uuidHex.slice(8, 12)}-${uuidHex.slice(12, 16)}-${uuidHex.slice(16, 20)}-${uuidHex.slice(20)}`;
};
