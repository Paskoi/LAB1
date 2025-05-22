const express = require("express");
const fetch   = require("node-fetch");
const path    = require("path");

const app     = express();
const PORT    = 8000;
const AUTHOR  = "Igor Pąśko";
const TOKEN   = "401cdbbee4170dfb0ac7";
const DAY     = 0;

const CITY_MAP = {
  Bilbao:       "bilbao",
  Sewilla:      "sewilla",
  Madryt:       "madryt",
  Rzeszów:      "rzeszow",
  Tychy:        "tychy",
  Szczecin:     "szczecin",
  Montpellier:  "montpellier",
  Lyon:         "lyon",
  Strasburg:    "strasburg"
};

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Autor: ${AUTHOR} | Nasłuchuję na :${PORT}`);
});

app.post("/weather", async (req, res) => {
  const uiCity = req.body.city;
  const apiCity = CITY_MAP[uiCity];

  if (!apiCity) {
    return res.status(400).json({ error: "Nieobsługiwane miasto." });
  }

  const url = `https://dobrapogoda24.pl/api/v1/weather/simple?city=${apiCity}&day=${DAY}&token=${TOKEN}`;
  try {
    const resp = await fetch(url);
    if (resp.status === 404) {
      return res.status(404).json({ error: `Brak danych pogodowych dla ${uiCity}.` });
    }
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error("Błąd API:", err.message);
    res.status(502).json({ error: "Błąd pobierania danych pogodowych." });
  }
});
