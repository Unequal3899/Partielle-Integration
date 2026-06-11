function hexToHsl(hex) {
  
  hex = hex.replace('#', '');
  
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;

  let h, s, l = (max + min) / 2;

  
  if (delta === 0) {
    h = 0;
  } else if (max === r) {
    h = 60 * (((g - b) / delta) % 6);
  } else if (max === g) {
    h = 60 * (((b - r) / delta) + 2);
  } else {
    h = 60 * (((r - g) / delta) + 4);
  }

  
  if (delta === 0) {
    s = 0;
  } else {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  
  if (h < 0) h += 360;

  return { h: Math.round(h), s: Math.round(s * 120), l: Math.round(l * 120) };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;

  let r, g, b;
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}


document.getElementById('colorPicker').addEventListener('input', function() {
  const mainColor = this.value;
  const hsl = hexToHsl(mainColor);
  const hue = hsl.h;

  
  const complementaryHue = (hue + 120) % 360;
  const complementaryColor = hslToHex(complementaryHue, hsl.s, hsl.l);

  
  const analogousHue = (hue + 30) % 360;
  const analogousColor = hslToHex(analogousHue, hsl.s, hsl.l);

  
  document.documentElement.style.setProperty('--bg-main', mainColor);
  document.documentElement.style.setProperty('--bg-card', complementaryColor);
  document.documentElement.style.setProperty('--text-accent', analogousColor);
  document.documentElement.style.setProperty('--border-accent', analogousColor);
});
  
    const aufgaben = [
      {
        integral:  "∫ x · eˣ dx",
        hint:      "Tipp: Was steht in der LIATE-Merkregel weiter vorne?",
        u:         ["x", "eˣ", "1", "xeˣ"],
        v:         ["eˣ", "x", "eˣ + 1", "ln(x)"],
        correctU:  "x",
        correctV:  "eˣ",
        feedback:  "Richtig! x ist algebraisch (A), eˣ ist exponential (E) — also wird x zu u. Ergebnis: eˣ(x − 1) + C"
      },
      {
        integral:  "∫ x · cos(x) dx",
        hint:      "Tipp: Schau dir die LIATE-Merkregel nochmal an.",
        u:         ["cos(x)", "x", "sin(x)", "x²"],
        v:         ["sin(x)", "cos(x)", "x", "−sin(x)"],
        correctU:  "x",
        correctV:  "cos(x)",
        feedback:  "Richtig! x ist algebraisch (A), cos(x) ist trigonometrisch (T). Ergebnis: x·sin(x) + cos(x) + C"
      },
      {
        integral:  "∫ ln(x) dx",
        hint:      "Tipp: LIATE-Merkregel und denk dran das man manche Zahlen beim Multiplizieren nicht hinschreiben muss.",
        u:         ["ln(x)", "1/x", "x", "1"],
        v:         ["1", "ln(x)", "x²", "1/x"],
        correctU:  "ln(x)",
        correctV:  "1",
        feedback:  "Richtig! Der Trick: v′ = 1 setzen, damit ln(x) durch Ableiten verschwindet. Ergebnis: x·ln(x) − x + C"
      },
      {
        integral:  "∫ x² · sin(x) dx",
        hint:      "Tipp: Auch hier hilft die LIATE-Merkregel.",
        u:         ["sin(x)", "x²", "cos(x)", "2x"],
        v:         ["−cos(x)", "sin(x)", "x²", "cos(x)"],
        correctU:  "x²",
        correctV:  "sin(x)",
        feedback:  "Richtig! x² ist algebraisch, sin(x) trigonometrisch. Hier braucht man zweimal partielle Integration."
      },
      {
        integral:  "∫ x · ln(x) dx",
        hint:      "Tipp: LIATE-Merkregel hilft auch hier..",
        u:         ["x", "ln(x)", "1/x", "x · ln(x)"],
        v:         ["x", "ln(x)", "x²/2", "1/x"],
        correctU:  "ln(x)",
        correctV:  "x",
        feedback:  "Richtig! ln(x) ist Logarithmus (L), x ist algebraisch (A). Ergebnis: x²/2 · ln(x) − x²/4 + C"
      }
    ];
 
    let aktuelleAufgabe = 0;   
    let gewaehlteU      = null; 
    let gewaehlteV      = null; 
    let ergebnisse      = [];   
 
    function zeigeBildschirm(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
 
    function startGame() {
      aktuelleAufgabe = 0;
      ergebnisse      = [];
      zeigeBildschirm('screen-game');
      ladeAufgabe(0);
    }
 
    
    function ladeAufgabe(i) {
      const aufgabe = aufgaben[i];
      gewaehlteU = null;
      gewaehlteV = null;
 
      
      const prozent = (i / aufgaben.length) * 100;
      document.getElementById('progress-bar').style.width = prozent + '%';
 
      
      document.getElementById('task-counter').textContent =
        'Aufgabe ' + (i + 1) + ' von ' + aufgaben.length;
 
     
      document.getElementById('task-question').textContent = aufgabe.integral;
      document.getElementById('task-hint').textContent     = aufgabe.hint;
 
      
      const fb = document.getElementById('feedback');
      fb.style.display = 'none';
      fb.className = 'feedback';
 
      
      document.getElementById('btn-check').disabled    = true;
      document.getElementById('btn-check').style.display = 'inline-block';
      document.getElementById('btn-next').style.display  = 'none';
 
  
      const uContainer = document.getElementById('u-options');
      uContainer.innerHTML = ''; 
      aufgabe.u.forEach(option => {
        const btn = document.createElement('button');
        btn.className   = 'choice-btn';
        btn.textContent = option;
        btn.onclick = () => waehleOption('u', option, btn);
        uContainer.appendChild(btn);
      });

      const vContainer = document.getElementById('v-options');
      vContainer.innerHTML = '';
      aufgabe.v.forEach(option => {
        const btn = document.createElement('button');
        btn.className   = 'choice-btn';
        btn.textContent = option;
        btn.onclick = () => waehleOption('v', option, btn);
        vContainer.appendChild(btn);
      });
    }
 
    function waehleOption(typ, wert, btn) {
      if (typ === 'u') {
        
        document.querySelectorAll('#u-options .choice-btn')
          .forEach(b => b.classList.remove('selected'));
        gewaehlteU = wert;
      } else {
        document.querySelectorAll('#v-options .choice-btn')
          .forEach(b => b.classList.remove('selected'));
        gewaehlteV = wert;
      }
      
      btn.classList.add('selected');
 
      if (gewaehlteU && gewaehlteV) {
        document.getElementById('btn-check').disabled = false;
      }
    }
 
   
    function checkAnswer() {
      const aufgabe = aufgaben[aktuelleAufgabe];
      const richtig = (gewaehlteU === aufgabe.correctU) &&
                      (gewaehlteV === aufgabe.correctV);
 
      
      ergebnisse.push(richtig);
 
      
      document.querySelectorAll('#u-options .choice-btn').forEach(btn => {
        if (btn.textContent === aufgabe.correctU) {
          btn.classList.add('correct'); 
        } else if (btn.classList.contains('selected')) {
          btn.classList.add('wrong');  
        }
        btn.onclick = null; 
      });
      
      document.querySelectorAll('#v-options .choice-btn').forEach(btn => {
        if (btn.textContent === aufgabe.correctV) {
          btn.classList.add('correct');
        } else if (btn.classList.contains('selected')) {
          btn.classList.add('wrong');
        }
        btn.onclick = null;
      });
 
      
      const fb = document.getElementById('feedback');
      fb.style.display = 'block';
      if (richtig) {
        fb.className   = 'feedback correct';
        fb.textContent = '✓ ' + aufgabe.feedback;
      } else {
        fb.className   = 'feedback wrong';
        fb.textContent = '✗ Nicht ganz. ' + aufgabe.feedback;
      }
 
      document.getElementById('btn-check').style.display = 'none';
 
      const btnNext = document.getElementById('btn-next');
      btnNext.style.display = 'inline-block';
      if (aktuelleAufgabe === aufgaben.length - 1) {
        btnNext.textContent = 'Auswertung →';
      } else {
        btnNext.textContent = 'Weiter →';
      }
    }
 
    
    function nextTask() {
      aktuelleAufgabe++;
      if (aktuelleAufgabe < aufgaben.length) {
        ladeAufgabe(aktuelleAufgabe);
      } else {
        zeigeStatistik();
      }
    }
 
    function zeigeStatistik() {
      const richtigAnzahl = ergebnisse.filter(e => e).length;
      const falschAnzahl  = ergebnisse.filter(e => !e).length;
      const prozent       = Math.round((richtigAnzahl / ergebnisse.length) * 100);
 
      
      document.getElementById('stat-correct').textContent = richtigAnzahl;
      document.getElementById('stat-wrong').textContent   = falschAnzahl;
      document.getElementById('stat-percent').textContent = prozent + '%';
      document.getElementById('stat-total').textContent   = ergebnisse.length;
 
      
      const pEl = document.getElementById('stat-percent');
      pEl.className = 'stat-number';
      if (prozent >= 80)      pEl.classList.add('good');
      else if (prozent < 50)  pEl.classList.add('bad');
 
      
      const liste = document.getElementById('result-list');
      liste.innerHTML = '';
      ergebnisse.forEach((richtig, index) => {
        const li = document.createElement('li');
        li.innerHTML =
          '<span>' + aufgaben[index].integral + '</span>' +
          '<span class="result-icon ' + (richtig ? 'ok' : 'bad') + '">' +
          (richtig ? '✓' : '✗') + '</span>';
        liste.appendChild(li);
      });
 
      
      document.getElementById('progress-bar').style.width = '100%';
 
      zeigeBildschirm('screen-stats');
    }
 
    function restartGame() {
      zeigeBildschirm('screen-theory');
    }
