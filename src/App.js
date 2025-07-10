import './App.css';
import React, { useEffect, useState, useRef } from 'react';

const uyirList = ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"];
const meiList = ["க்", "ங்", "ச்", "ஞ்", "ட்", "ண்", "த்", "ந்", "ப்", "ம்", "ய்", "ர்", "ல்", "ள்", "ற்", "ன்", "வ்", "ழ்"];

const uyirmeiMap = {
  "க்": ["க", "கா", "கி", "கீ", "கு", "கூ", "கெ", "கே", "கை", "கொ", "கோ", "கௌ"],
  "ங்": ["ங", "ஙா", "ஙி", "ஙீ", "ஙு", "ஙூ", "ஙெ", "ஙே", "ஙை", "ஙொ", "ஙோ", "ஙௌ"],
  "ச்": ["ச", "சா", "சி", "சீ", "சு", "சூ", "செ", "சே", "சை", "சொ", "சோ", "சௌ"],
  "ஞ்": ["ஞ", "ஞா", "ஞி", "ஞீ", "ஞு", "ஞூ", "ஞெ", "ஞே", "ஞை", "ஞொ", "ஞோ", "ஞௌ"],
  "ட்": ["ட", "டா", "டி", "டீ", "டு", "டூ", "டெ", "டே", "டை", "டொ", "டோ", "டௌ"],
  "ண்": ["ண", "ணா", "ணி", "ணீ", "ணு", "ணூ", "ணெ", "ணே", "ணை", "ணொ", "ணோ", "ணௌ"],
  "த்": ["த", "தா", "தி", "தீ", "து", "தூ", "தெ", "தே", "தை", "தொ", "தோ", "தௌ"],
  "ந்": ["ந", "நா", "நி", "நீ", "நு", "நூ", "நெ", "நே", "நை", "நொ", "நோ", "நௌ"],
  "ப்": ["ப", "பா", "பி", "பீ", "பு", "பூ", "பெ", "பே", "பை", "பொ", "போ", "பௌ"],
  "ம்": ["ம", "மா", "மி", "மீ", "மு", "மூ", "மெ", "மே", "மை", "மொ", "மோ", "மௌ"],
  "ய்": ["ய", "யா", "யி", "யீ", "யு", "யூ", "யெ", "யே", "யை", "யொ", "யோ", "யௌ"],
  "ர்": ["ர", "ரா", "ரி", "ரீ", "ரு", "ரூ", "ரெ", "ரே", "ரை", "ரொ", "ரோ", "ரௌ"],
  "ல்": ["ல", "லா", "லி", "லீ", "லு", "லூ", "லெ", "லே", "லை", "லொ", "லோ", "லௌ"],
  "ள்": ["ள", "ளா", "ளி", "ளீ", "ளு", "ளூ", "ளெ", "ளே", "ளை", "ளொ", "ளோ", "ளௌ"],
  "ற்": ["ற", "றா", "றி", "றீ", "று", "றூ", "றெ", "றே", "றை", "றொ", "றோ", "றௌ"],
  "ன்": ["ன", "னா", "னி", "னீ", "னு", "னூ", "னெ", "னே", "னை", "னொ", "னோ", "னௌ"]
};

const keyStyle = {
  padding: "6px 10px", fontSize: "18px", cursor: "pointer",
  borderRadius: "6px", border: "1px solid #ccc", backgroundColor: "#f9f9f9",
  margin: "3px"
};


function App() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [lastMei, setLastMei] = useState(null);
  const [expandedSongs, setExpandedSongs] = useState(new Set());
  const [activeLanguages, setActiveLanguages] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    fetch("/songs.json")
      .then(res => res.json())
      .then(data => setSongs(data));
  }, []);

  const handleSearch = () => {
    setSearchText(query.trim());
    setShowKeyboard(false);
    setExpandedSongs(new Set());
    setActiveLanguages({});
  };

  const toggleSong = (id) => {
    setExpandedSongs(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase()
        ? <span key={index} style={{ backgroundColor: "yellow", fontWeight: "bold" }}>{part}</span>
        : part
    );
  };

  const filteredByPadal = [];
  const filteredByVilakkam = [];

  songs.forEach((song, index) => {
    const padal = (song.padal || "");
    const vilakkam = (song.vilakkam || "");
    const q = searchText.toLowerCase();
    if (q && padal.toLowerCase().includes(q)) {
      filteredByPadal.push({ song, index });
    } else if (q && vilakkam.toLowerCase().includes(q)) {
      filteredByVilakkam.push({ song, index });
    }
  });
  

  return (
  
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* College Header */}
{/* Header with logo and title */}
<header style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f0f0f0",
  padding: "20px",
  borderBottom: "1px solid #ccc",
  marginBottom: "20px",
  flexDirection: "column"
}}>
  <img
    src="/logo.png"  // ✅ Put your college logo in the public folder with this name
    alt="College Logo"
    style={{ height: "60px", marginBottom: "10px" }}
  />
  <h1 style={{
    margin: 0,
    fontSize: "28px",
    color: "#333",
    fontWeight: "bold",
    textAlign: "center"
  }}>
    திருமந்திரம் தேடல்
  </h1>
</header>


      

      <div style={{
  maxWidth: "600px",
  margin: "0 auto",
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
}}>
  <input
    ref={inputRef}
    type="text"
    value={query}
    onClick={() => setShowKeyboard(true)}
    onChange={e => setQuery(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    placeholder="சொல்லை உள்ளிடவும்"
    style={{ flex: 1, padding: "10px", fontSize: "16px" }}
  />
  <button onClick={handleSearch} style={{ padding: "10px 16px", fontSize: "16px" }}>
    தேடு
  </button>
</div>


      {showKeyboard && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "10px", padding: "10px", marginBottom: "20px" }}>
          <strong>மெய் எழுத்துகள்</strong>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {meiList.map((mei, idx) => (
              <button key={idx} onClick={() => { setQuery(prev => prev + mei); setLastMei(mei); }} style={keyStyle}>{mei}</button>
            ))}
          </div>
          <strong>உயிர் எழுத்துகள்</strong>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {uyirList.map((uyir, idx) => (
              <button key={idx} onClick={() => {
                if (lastMei && uyirmeiMap[lastMei]) {
                  const idx = uyirList.indexOf(uyir);
                  const combo = uyirmeiMap[lastMei][idx];
                  setQuery(prev => prev.slice(0, -lastMei.length) + combo);
                  setLastMei(null);
                } else {
                  setQuery(prev => prev + uyir);
                }
              }} style={keyStyle}>{uyir}</button>
            ))}
          </div>
        </div>
      )}

      {searchText !== "" && (
        <>
          <h3>பாடலில் உள்ளவை</h3>
          {filteredByPadal.length === 0 && <p>பொருத்தமான பாடல் எதுவும் கிடைக்கவில்லை</p>}
          {filteredByPadal.map(({ song, index }) => (
            <div key={index}>
              <div
                onClick={() => toggleSong(index)}
                style={{
                  display: "inline-block", margin: "10px", padding: "10px 20px",
                  border: "2px solid #3f51b5", borderRadius: "50px",
                  background: "#e8eaf6", cursor: "pointer"
                }}
              >
                பாடல் {song.song_number}
              </div>

              {expandedSongs.has(index) && (
                <div style={{ margin: "10px 20px", background: "#fff" }}>
                  <p style={{ whiteSpace: "pre-line" }}>{highlightText(song.padal, searchText)}</p>

                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => setActiveLanguages(prev => ({ ...prev, [index]: "ta" }))} style={{ marginRight: "10px" }}>
                      தமிழ் விளக்கம்
                    </button>
                    <button onClick={() => setActiveLanguages(prev => ({ ...prev, [index]: "en" }))}>
                      English Meaning
                    </button>
                  </div>

                  {activeLanguages[index] === "ta" && (
                    <p style={{ backgroundColor: "#fff8e1", padding: "10px", whiteSpace: "pre-line" }}>
                      <strong>விளக்கம்:</strong><br />
                      {highlightText(song.vilakkam, searchText)}
                    </p>
                  )}

                  {activeLanguages[index] === "en" && (
                    <p style={{ backgroundColor: "#e1f5fe", padding: "10px", whiteSpace: "pre-line" }}>
                      <strong>Meaning:</strong><br />
                      {highlightText(song.vilakkam_en, searchText)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          <h3>விளக்கத்தில் உள்ளவை</h3>
          {filteredByVilakkam.length === 0 && <p>பொருத்தமான விளக்கம் எதுவும் கிடைக்கவில்லை</p>}
          {filteredByVilakkam.map(({ song, index }) => (
            <div key={index}>
              <div
                onClick={() => toggleSong(index + 1000)}
                style={{
                  display: "inline-block", margin: "10px", padding: "10px 20px",
                  border: "2px solid #ff9800", borderRadius: "50px",
                  background: "#fff3e0", cursor: "pointer"
                }}
              >
                பாடல் {song.song_number}
              </div>

              {expandedSongs.has(index + 1000) && (
                <div style={{ margin: "10px 20px", background: "#fff" }}>
                  <p style={{ whiteSpace: "pre-line" }}>{highlightText(song.padal, searchText)}</p>

                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => setActiveLanguages(prev => ({ ...prev, [index + 1000]: "ta" }))} style={{ marginRight: "10px" }}>
                      தமிழ் விளக்கம்
                    </button>
                    <button onClick={() => setActiveLanguages(prev => ({ ...prev, [index + 1000]: "en" }))}>
                      English Meaning
                    </button>
                  </div>

                  {activeLanguages[index + 1000] === "ta" && (
                    <p style={{ backgroundColor: "#fff8e1", padding: "10px", whiteSpace: "pre-line" }}>
                      <strong>விளக்கம்:</strong><br />
                      {highlightText(song.vilakkam, searchText)}
                    </p>
                  )}
                  {activeLanguages[index + 1000] === "en" && (
                    <p style={{ backgroundColor: "#e1f5fe", padding: "10px", whiteSpace: "pre-line" }}>
                      <strong>Meaning:</strong><br />
                      {highlightText(song.vilakkam_en, searchText)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      <footer style={{
        backgroundColor: "#8B0000",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
        fontSize: "16px",
        marginTop: "auto"
      }}>
        <p>
          Source: <a href="https://kvnthirumoolar.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#ffe0b2" }}>
            திருமூலர் அருளிய திருமந்திரம்
          </a>
        </p>
        <p>Google Translator</p>
      </footer>
    </div>
  );
}

export default App;
