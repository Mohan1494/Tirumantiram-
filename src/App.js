import './App.css';
import React, { useEffect, useState, useRef } from 'react';

const uyirList = ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"];
const meiList = ["க்", "ச்", "ட்", "த்", "ப்", "ற்", "ஞ்", "ந்", "ம்", "வ்", "ழ்", "ள்", "ய்", "ர்", "ல்"];

const uyirmeiMap = {
  "க்": ["க", "கா", "கி", "கீ", "கு", "கூ", "கெ", "கே", "கை", "கொ", "கோ", "கௌ"],
  "ச்": ["ச", "சா", "சி", "சீ", "சு", "சூ", "செ", "சே", "சை", "சொ", "சோ", "சௌ"],
  "ட்": ["ட", "டா", "டி", "டீ", "டு", "டூ", "டெ", "டே", "டை", "டொ", "டோ", "டௌ"],
  "த்": ["த", "தா", "தி", "தீ", "து", "தூ", "தெ", "தே", "தை", "தொ", "தோ", "தௌ"],
  "ப்": ["ப", "பா", "பி", "பீ", "பு", "பூ", "பெ", "பே", "பை", "பொ", "போ", "பௌ"],
  "ம்": ["ம", "மா", "மி", "மீ", "மு", "மூ", "மெ", "மே", "மை", "மொ", "மோ", "மௌ"],
  "ய்": ["ய", "யா", "யி", "யீ", "யு", "யூ", "யெ", "யே", "யை", "யொ", "யோ", "யௌ"],
  "ர்": ["ர", "ரா", "ரி", "ரீ", "ரு", "ரூ", "ரெ", "ரே", "ரை", "ரொ", "ரோ", "ரௌ"],
  "ல்": ["ல", "லா", "லி", "லீ", "லு", "லூ", "லெ", "லே", "லை", "லொ", "லோ", "லௌ"],
  "வ்": ["வ", "வா", "வி", "வீ", "வு", "வூ", "வெ", "வே", "வை", "வொ", "வோ", "வௌ"],
  "ழ்": ["ழ", "ழா", "ழி", "ழீ", "ழு", "ழூ", "ழெ", "ழே", "ழை", "ழொ", "ழோ", "ழௌ"],
  "ள்": ["ள", "ளா", "ளி", "ளீ", "ளு", "ளூ", "ளெ", "ளே", "ளை", "ளொ", "ளோ", "ளௌ"],
  "ற்": ["ற", "றா", "றி", "றீ", "று", "றூ", "றெ", "றே", "றை", "றொ", "றோ", "றௌ"],
  "ன்": ["ன", "னா", "னி", "னீ", "னு", "னூ", "னெ", "னே", "னை", "னொ", "னோ", "னௌ"],
  "ஞ்": ["ஞ", "ஞா", "ஞி", "ஞீ", "ஞு", "ஞூ", "ஞெ", "ஞே", "ஞை", "ஞொ", "ஞோ", "ஞௌ"],
  "ங்": ["ங", "ஙா", "ஙி", "ஙீ", "ஙு", "ஙூ", "ஙெ", "ஙே", "ஙை", "ஙொ", "ஙோ", "ஙௌ"],
  "ண்": ["ண", "ணா", "ணி", "ணீ", "ணு", "ணூ", "ணெ", "ணே", "ணை", "ணொ", "ணோ", "ணௌ"],
  "ந்": ["ந", "நா", "நி", "நீ", "நு", "நூ", "நெ", "நே", "நை", "நொ", "நோ", "நௌ"]
};

const keyStyle = {
  padding: "6px 10px",
  fontSize: "18px",
  cursor: "pointer",
  borderRadius: "6px",
  border: "1px solid #ccc",
  backgroundColor: "#f9f9f9",
  margin: "3px"
};

function App() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [lastMei, setLastMei] = useState(null);
  const [expandedSongs, setExpandedSongs] = useState(new Set());
  const inputRef = useRef(null);

  useEffect(() => {
    fetch("/songs.json")
      .then(res => res.json())
      .then(data => setSongs(data));
  }, []);

  const handleMeiClick = (mei) => {
    setQuery(prev => prev + mei);
    setLastMei(mei);
    inputRef.current.focus();
  };

  const handleUyirClick = (uyir) => {
    if (lastMei && uyirmeiMap[lastMei]) {
      const idx = uyirList.indexOf(uyir);
      if (idx !== -1) {
        const combo = uyirmeiMap[lastMei][idx];
        setQuery(prev => prev.slice(0, prev.length - lastMei.length) + combo);
        setLastMei(null);
        inputRef.current.focus();
        return;
      }
    }
    setQuery(prev => prev + uyir);
    inputRef.current.focus();
  };

  const toggleVilakkam = (index) => {
    const newSet = new Set(expandedSongs);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedSongs(newSet);
  };

  const filteredByPadal = [];
  const filteredByVilakkam = [];

  songs.forEach((song, index) => {
    const padal = (song.padal || "").toLowerCase().replace(/\s/g, '');
    const vilakkam = (song.vilakkam || "").toLowerCase().replace(/\s/g, '');
    const q = query.toLowerCase().replace(/\s/g, '');

    if (q && padal.includes(q)) {
      filteredByPadal.push({ song, index });
    } else if (q && vilakkam.includes(q)) {
      filteredByVilakkam.push({ song, index });
    }
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>📚 திருமந்திரம் தேடல்</h1>

      <div style={{ position: "relative", width: "100%", maxWidth: "600px", marginBottom: "20px" }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onClick={() => setShowKeyboard(true)}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setShowKeyboard(false);
          }}
          placeholder="சொல்லை உள்ளிடவும்"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px"
          }}
        />

        {showKeyboard && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "10px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            width: "100%"
          }}>
            <div style={{ marginBottom: "5px" }}><strong>மெய் எழுத்துகள்</strong></div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {meiList.map((mei, idx) => (
                <button key={idx} onClick={() => handleMeiClick(mei)} style={keyStyle}>
                  {mei}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "10px", marginBottom: "5px" }}><strong>உயிர் எழுத்துகள்</strong></div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {uyirList.map((uyir, idx) => (
                <button key={idx} onClick={() => handleUyirClick(uyir)} style={keyStyle}>
                  {uyir}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setQuery("")} style={{ ...keyStyle, backgroundColor: "#ffecec" }}>🧹 Clear</button>
              <button onClick={() => setShowKeyboard(false)} style={{ ...keyStyle, backgroundColor: "#eee" }}>❌ Close</button>
            </div>
          </div>
        )}
      </div>

      {query.trim() !== "" && (
  <>
    {/* 🎵 Matches in Padal Section */}
    <h3>🎵 பாடலில் உள்ளவை</h3>
    {filteredByPadal.length === 0 && <p>🔍 பொருத்தமான பாடல் எதுவும் கிடைக்கவில்லை</p>}
    {filteredByPadal.map(({ song, index }) => (
      <div key={`padal-${index}`}>
        <div
          onClick={() => toggleVilakkam(`padal-${index}`)}
          style={{
            display: "inline-block",
            margin: "10px",
            padding: "10px 20px",
            border: "2px solid #3f51b5",
            borderRadius: "50px",
            background: "#e8eaf6",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          பாடல் {song.song_number}
        </div>

        {/* Show Padal */}
        {expandedSongs.has(`padal-${index}`) && (
          <div
            onClick={() => toggleVilakkam(`padal-line-${index}`)}
            style={{
              margin: "10px 20px",
              padding: "10px",
              background: "#fff",
              borderLeft: "3px solid #3f51b5",
              cursor: "pointer"
            }}
          >
            <p>{song.padal}</p>

            {/* Show Vilakkam if expanded */}
            {expandedSongs.has(`padal-line-${index}`) && (
              <p style={{ marginTop: "10px", backgroundColor: "#fff8e1", padding: "10px" }}>
                <strong>விளக்கம்:</strong><br />{song.vilakkam}
              </p>
            )}
          </div>
        )}
      </div>
    ))}

    {/* 📜 Matches in Vilakkam Section */}
    <h3 style={{ marginTop: "30px" }}>📜 விளக்கத்தில் உள்ளவை</h3>
    {filteredByVilakkam.length === 0 && <p>🔍 பொருத்தமான விளக்கம் எதுவும் கிடைக்கவில்லை</p>}
    {filteredByVilakkam.map(({ song, index }) => (
      <div key={`vilakkam-${index}`}>
        <div
          onClick={() => toggleVilakkam(`vilakkam-${index}`)}
          style={{
            display: "inline-block",
            margin: "10px",
            padding: "10px 20px",
            border: "2px solid #ff9800",
            borderRadius: "50px",
            background: "#fff3e0",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          பாடல் {song.song_number}
        </div>

        {/* Show Padal */}
        {expandedSongs.has(`vilakkam-${index}`) && (
          <div
            onClick={() => toggleVilakkam(`vilakkam-line-${index}`)}
            style={{
              margin: "10px 20px",
              padding: "10px",
              background: "#fff",
              borderLeft: "3px solid #ff9800",
              cursor: "pointer"
            }}
          >
            <p>{song.padal}</p>

            {/* Show Vilakkam if expanded */}
            {expandedSongs.has(`vilakkam-line-${index}`) && (
              <p style={{ marginTop: "10px", backgroundColor: "#fffde7", padding: "10px" }}>
                <strong>விளக்கம்:</strong><br />{song.vilakkam}
              </p>
            )}
          </div>
        )}
      </div>
    ))}
  </>
)}

    </div>
  );
}

export default App;
