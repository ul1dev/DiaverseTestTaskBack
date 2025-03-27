export async function getTransactionInfo(hashHex: string) {
  try {
    const response = await fetch(
      `https://tonapi.io/v2/blockchain/transactions/${hashHex}`,
    );

    if (!response.ok) return null;

    return response.json();
  } catch (error) {
    return null;
  }
}
