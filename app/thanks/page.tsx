export default function ThanksPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#f9fafb",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "16px" }}>
        Благодарим ви 🙏
      </h1>

      <p style={{ fontSize: "18px", color: "#555", maxWidth: "600px", lineHeight: 1.6 }}>
        Получихме вашата заявка успешно.
        <br />
        Нашият екип ще се свърже с вас до няколко часа,
        за да активираме AI рецепциониста за вашия салон.
      </p>
    </div>
  );
}
