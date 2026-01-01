export const analyzeCompliance = async (input) => {
  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }) // ✅ send as JSON
    });

    if (!response.ok) throw new Error("Backend failed");

    return await response.json();
  } catch (err) {
    console.error("❌ Compliance mapping failed:", err);
    throw err;
  }
};
