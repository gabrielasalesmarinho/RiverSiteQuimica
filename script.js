const quizzes = {
  alcanos: [
    { q: "Qual é a fórmula geral de um alcano linear?", options: ["CₙH₂ₙ","CₙH₂ₙ₊₂","CₙH₂ₙ₋₂","CₙHₙ"], answer: 1 },
    { q: "Qual sufixo usamos para nomear alcanos?", options: ["-eno","-ano","-ino","-ol"], answer: 1 },
    { q: "Qual propriedade é típica de alcanos?", options: ["Altamente polares","Formam ligações de H facilmente","Baixa solubilidade em água","Reagem prontamente com nucleófilos"], answer: 2 },
    { q: "Qual das reações é característica dos alcanos?", options: ["Adição eletrofílica","Oxidação branda","Halogenação radicalar","Rearranjo intramolecular"], answer: 2 }
  ],
  alcenos: [
    { q: "Qual a principal diferença estrutural entre alceno e alcano?", options: ["Maior número de hidrogênios","Presença de tripla ligação","Presença de dupla ligação","Anel aromático"], answer: 2 },
    { q: "Qual reação é típica de alcenos?", options: ["Substituição nucleofílica","Adição à dupla ligação","Halogenação radicalar típica","Oxidação completa imediata"], answer: 1 },
    { q: "A isomeria geométrica (cis/trans) ocorre quando há:", options: ["Tripla ligação isolada","Átomo de oxigênio na cadeia","Dupla ligação com substituintes diferentes","Moléculas com anéis apenas"], answer: 2 },
    { q: "Um uso industrial importante do eteno (etileno) é:", options: ["Como solvente polar","Produção de polietileno (plástico)","Combustível de foguete","Refrigerante doméstico"], answer: 1 }
  ],
  alcinos: [
    { q: "Qual sufixo nomeia os alcinos?", options: ["-ano","-eno","-ino","-ol"], answer: 2 },
    { q: "Alcinos terminais (com H no carbono do triplo) têm característica:", options: ["Ser mais básicos que alcenos","Ter hidrogênio mais ácido","Não reagir com bases","Ser gasosos exclusivamente"], answer: 1 },
    { q: "Uma reação típica que forma alcinos é:", options: ["Hidratação de alcenos","Eliminação dupla a partir de dihaletos","Adição de halogénios","Esterificação"], answer: 1 },
    { q: "Exemplo de alcino comum usado em soldagem:", options: ["Eteno","Propano","Acetileno (etino)","Metano"], answer: 2 }
  ],
  oxigenados: [
    { q: "Qual grupo funcional corresponde a -OH?", options: ["Cetonas","Ésteres","Álcoois","Éteres"], answer: 2 },
    { q: "Qual sufixo indica uma cetona?", options: ["-al","-ol","-ona","-ico"], answer: 2 },
    { q: "Qual propriedade os compostos oxigenados costumam ter em comum (comparados a hidrocarbonetos)?", options: ["Menor ponto de ebulição","Maior polaridade","Menor reatividade","Sempre insolúveis em água"], answer: 1 },
    { q: "Qual reação converte um álcool primário em um aldeído (em condições controladas)?", options: ["Oxidação","Hidrogenação","Esterificação","Hidrólise"], answer: 0 }
  ]
};
const quizOrder = ['alcanos', 'alcenos', 'alcinos', 'oxigenados'];
const state = {
  currentTopic: 'alcanos',
  currentQuestionIndex: 0,
  userAnswers: { alcanos: [], alcenos: [], alcinos: [], oxigenados: [] },
  completed: { alcanos: false, alcenos: false, alcinos: false, oxigenados: false },
  activeContainer: null,
  selectedQuizTopic: null,
  shuffledQuestions: { alcanos: null, alcenos: null, alcinos: null, oxigenados: null } // Armazena questões embaralhadas
};
function getProfessorQuestions(topic) {
  // Fallback para ambientes sem localStorage (ex: preview do VSCode)
  try {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      console.warn('localStorage não disponível. Usando apenas questões padrão.');
      return [];
    }
    const key = 'professor_questions_' + topic;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    // Se localStorage não estiver disponível, retorna array vazio
    console.warn('localStorage não disponível. Usando apenas questões padrão.');
    return [];
  }
}
function getCombinedQuestions(topic) {
  const def = quizzes[topic] || [];
  const custom = getProfessorQuestions(topic);
  return [...def, ...custom];
}
function getCurrentQuizForGeneral(){
  for(let topic of quizOrder){
    const questions = getCombinedQuestions(topic);
    const answered = state.userAnswers[topic].length;
    if(answered < questions.length){
      return topic;
    }
  }
  return null;
}
// Função para embaralhar array (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function mountQuizToContainer(topic, containerId){
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  // Se não há questões embaralhadas ou o quiz foi resetado, embaralha as questões
  if (!state.shuffledQuestions[topic] || state.userAnswers[topic].length === 0) {
    const originalQuestions = getCombinedQuestions(topic);
    state.shuffledQuestions[topic] = shuffleArray(originalQuestions);
  }
  
  const questions = state.shuffledQuestions[topic];
  const qIndex = Math.min(state.userAnswers[topic].length, questions.length);
  if(qIndex >= questions.length){
    const done = document.createElement('div');
    done.innerHTML = `<p style="margin:8px 0;color:var(--muted)"><strong>Você já respondeu todas as perguntas deste tema.</strong></p>`;
    const summary = document.createElement('div');
    summary.className = 'note';
    const corrects = state.userAnswers[topic].filter(x => x.correct).length;
    summary.innerHTML = `<p style="margin:6px 0">Acertos: <strong>${corrects}</strong> de ${questions.length}</p><p style="margin:6px 0">Porcentagem: <strong>${Math.round((corrects/questions.length)*100)}%</strong></p>`;
    done.appendChild(summary);
    
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '10px';
    btnContainer.style.marginTop = '16px';
    btnContainer.style.flexWrap = 'wrap';
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn primary';
    resetBtn.textContent = 'Refazer este quiz';
    resetBtn.onclick = () => {
      resetQuiz(topic);
      if (state.selectedQuizTopic) {
        mountGeneralQuiz(state.selectedQuizTopic);
      }
    };
    btnContainer.appendChild(resetBtn);
    
    // Se estiver no quiz geral com tópico selecionado, mostra botão para voltar
    if (containerId === 'quiz-geral-container' && state.selectedQuizTopic && state.selectedQuizTopic !== 'todos') {
      const backBtn = document.createElement('button');
      backBtn.className = 'btn ghost';
      backBtn.textContent = 'Escolher Outro Tópico';
      backBtn.onclick = () => backToTopicSelection();
      btnContainer.appendChild(backBtn);
    }
    
    done.appendChild(btnContainer);
    container.appendChild(done);
    updateProgress();
    return;
  }
  const qObj = questions[qIndex];
  
  // Embaralha as alternativas e encontra a nova posição da resposta correta
  const originalAnswerIndex = qObj.answer;
  const shuffledOptions = shuffleArray(qObj.options);
  const shuffledAnswerIndex = shuffledOptions.findIndex((opt, idx) => {
    // Encontra a posição da resposta correta no array embaralhado
    return opt === qObj.options[originalAnswerIndex];
  });
  
  const qBlock = document.createElement('div');
  qBlock.className = 'question-row';
  qBlock.dataset.topic = topic;
  qBlock.dataset.qIndex = qIndex;
  // Armazena o índice da resposta correta no array embaralhado
  qBlock.dataset.shuffledAnswer = shuffledAnswerIndex;
  qBlock.innerHTML = `<div class="question-text">${qObj.q}</div>`;
  const opts = document.createElement('div');
  opts.className = 'options';
  shuffledOptions.forEach((opt, i) => {
    const optDiv = document.createElement('label');
    optDiv.className = 'option';
    optDiv.dataset.index = i;
    optDiv.innerHTML = `
      <input type="radio" name="opt-${topic}-${containerId}" value="${i}" />
      <div style="flex:1">${opt}</div>
    `;
    optDiv.addEventListener('click', () => {
      if (optDiv.classList.contains('disabled')) return;
      const radio = optDiv.querySelector('input[type=radio]');
      radio.checked = true;
      const siblings = optDiv.parentElement.querySelectorAll('.option');
      siblings.forEach(s => s.style.boxShadow = '');
      optDiv.style.boxShadow = '0 8px 20px rgba(8,32,56,0.06)';
    });
    opts.appendChild(optDiv);
  });
  qBlock.appendChild(opts);
  const btns = document.createElement('div');
  btns.className = 'btns';
  const send = document.createElement('button');
  send.className = 'btn primary';
  send.textContent = 'Enviar resposta';
  send.onclick = () => submitAnswer(topic, qIndex, containerId);
  const skip = document.createElement('button');
  skip.className = 'btn ghost';
  skip.textContent = 'Pular';
  skip.onclick = () => {
    state.userAnswers[topic].push({ selected: null, correct: false, skipped:true });
    const isQuizComplete = state.userAnswers[topic].length >= getCombinedQuestions(topic).length;
    if (containerId === 'quiz-geral-container' && isQuizComplete) {
      // Se um tópico específico foi selecionado, mostra resumo
      if (state.selectedQuizTopic && state.selectedQuizTopic !== 'todos') {
        setTimeout(() => {
          const container = document.getElementById(containerId);
          if (container) {
            const questions = getCombinedQuestions(topic);
            const corrects = state.userAnswers[topic].filter(x => x.correct).length;
            const summary = document.createElement('div');
            summary.innerHTML = `
              <h4 style="margin:0 0 10px 0">Quiz de ${capitalize(topic)} Concluído!</h4>
              <div class="note">
                <p style="margin:6px 0"><strong>Resultado:</strong></p>
                <p style="margin:4px 0">Acertos: <strong>${corrects}</strong> de ${questions.length}</p>
                <p style="margin:4px 0">Porcentagem: <strong>${Math.round((corrects/questions.length)*100)}%</strong></p>
              </div>
              <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap">
                <button class="btn primary" onclick="resetQuiz('${topic}'); mountGeneralQuiz('${topic}')">Refazer Quiz</button>
                <button class="btn ghost" onclick="backToTopicSelection()">Escolher Outro Tópico</button>
              </div>
            `;
            container.innerHTML = '';
            container.appendChild(summary);
          }
        }, 500);
      } else {
        setTimeout(() => { mountGeneralQuiz('todos') }, 2000);
      }
    } else if (containerId === 'quiz-geral-container') {
      mountQuizToContainer(topic, containerId);
    } else {
      mountQuizToContainer(topic, containerId);
    }
  };
  btns.appendChild(send);
  btns.appendChild(skip);
  qBlock.appendChild(btns);
  const resultStrip = document.createElement('div');
  resultStrip.className = 'result-strip';
  qBlock.appendChild(resultStrip);
  const title = document.createElement('h4');
  title.textContent = 'Quiz — ' + capitalize(topic);
  title.style.margin = '0 0 10px 0';
  container.insertBefore(title, container.firstChild);
  container.appendChild(qBlock);
  updateProgress();
}
function mountGeneralQuiz(topic = null){
  const container = document.getElementById('quiz-geral-container');
  if (!container) return;
  
  // Se um tópico específico foi selecionado, usa ele
  if (topic && topic !== 'todos') {
    mountQuizToContainer(topic, 'quiz-geral-container');
    return;
  }
  
  // Se for "todos", usa o modo sequencial original
  if (topic === 'todos') {
    const currentTopic = getCurrentQuizForGeneral();
    if (!currentTopic){
      container.innerHTML = `
        <h4 style="margin:0 0 10px 0">Parabéns! Você completou todos os quizzes!</h4>
        <div class="note">
          <p style="margin:6px 0"><strong>Resumo:</strong></p>
          ${quizOrder.map(topic => {
            const questions = getCombinedQuestions(topic);
            const corrects = state.userAnswers[topic].filter(x => x.correct).length;
            return `<p style="margin:4px 0">${capitalize(topic)}: <strong>${corrects}</strong> de ${questions.length}</p>`;
          }).join('')}
        </div>
        <button class="btn ghost" onclick="resetAllQuizzes()" style="margin-top:12px">Reiniciar todos os quizzes</button>
      `;
      updateProgress();
      return;
    }
    mountQuizToContainer(currentTopic, 'quiz-geral-container');
    return;
  }
  
  // Modo padrão: mostra seleção de tópico
  const selectionDiv = document.getElementById('quiz-topic-selection');
  const containerDiv = document.getElementById('quiz-geral-container');
  const backBtn = document.getElementById('quiz-back-btn');
  
  if (selectionDiv) selectionDiv.style.display = 'block';
  if (containerDiv) containerDiv.style.display = 'none';
  if (backBtn) backBtn.style.display = 'none';
}
function submitAnswer(topic, qIndex, containerId){
  const container = document.getElementById(containerId);
  if (!container) return;
  const qBlock = container.querySelector('.question-row');
  if (!qBlock) return;
  const chosen = qBlock.querySelector('input[type=radio]:checked');
  const optionsEls = Array.from(qBlock.querySelectorAll('.option'));
  const allQuestions = getCombinedQuestions(topic);
  // Usa o índice da resposta correta no array embaralhado
  const correctIndex = Number(qBlock.dataset.shuffledAnswer);
  if(!chosen){
    qBlock.style.animation = 'shake 0.3s';
    setTimeout(()=>qBlock.style.animation='none',300);
    return;
  }
  const selectedIndex = Number(chosen.value);
  const isCorrect = (selectedIndex === correctIndex);
  state.userAnswers[topic].push({ selected: selectedIndex, correct: isCorrect, skipped:false });
  optionsEls.forEach((optEl, i) => {
    optEl.classList.add('disabled');
    optEl.style.cursor = 'default';
    const radio = optEl.querySelector('input[type=radio]');
    if(radio) radio.disabled = true;
    if(i === correctIndex){ optEl.classList.add('correct') }
    if(i === selectedIndex && !isCorrect){ optEl.classList.add('wrong') }
  });
  const strip = qBlock.querySelector('.result-strip');
  if(strip){ strip.classList.add(isCorrect ? 'success' : 'mixed') }
  updateProgress();
  const isQuizComplete = state.userAnswers[topic].length >= getCombinedQuestions(topic).length;
  setTimeout(()=> {
    if (containerId === 'quiz-geral-container' && isQuizComplete) {
      // Se um tópico específico foi selecionado, mostra resumo e opção de voltar
      if (state.selectedQuizTopic && state.selectedQuizTopic !== 'todos') {
        const container = document.getElementById(containerId);
        if (container) {
          const questions = getCombinedQuestions(topic);
          const corrects = state.userAnswers[topic].filter(x => x.correct).length;
          const summary = document.createElement('div');
          summary.innerHTML = `
            <h4 style="margin:0 0 10px 0">Quiz de ${capitalize(topic)} Concluído!</h4>
            <div class="note">
              <p style="margin:6px 0"><strong>Resultado:</strong></p>
              <p style="margin:4px 0">Acertos: <strong>${corrects}</strong> de ${questions.length}</p>
              <p style="margin:4px 0">Porcentagem: <strong>${Math.round((corrects/questions.length)*100)}%</strong></p>
            </div>
            <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap">
              <button class="btn primary" onclick="resetQuiz('${topic}'); mountGeneralQuiz('${topic}')">Refazer Quiz</button>
              <button class="btn ghost" onclick="backToTopicSelection()">Escolher Outro Tópico</button>
            </div>
          `;
          container.innerHTML = '';
          container.appendChild(summary);
        }
      } else {
        // Modo sequencial (todos os temas)
        setTimeout(() => { mountGeneralQuiz('todos') }, 2000);
      }
    } else if (containerId === 'quiz-geral-container') {
      mountQuizToContainer(topic, containerId);
    } else {
      mountQuizToContainer(topic, containerId);
    }
  }, 2500);
}
function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1) }
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    showSection(target);
  });
});
function showSection(id){
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
  state.currentTopic = id === 'quizgeral' ? state.currentTopic : id;
  const sidebar = document.querySelector('aside.sidebar');
  const mainContainer = document.querySelector('main.container');
  if (id === 'quizgeral') {
    if (sidebar) sidebar.classList.add('show');
    if (mainContainer) mainContainer.classList.remove('no-sidebar');
    // Mostra a seleção de tópicos ao entrar na seção de quiz
    mountGeneralQuiz();
    // Atualiza as estatísticas de progresso
    setTimeout(() => updateQuizTopicStats(), 100);
    const startBtn = document.getElementById('start-quiz');
    if (startBtn) startBtn.textContent = 'Abrir quiz do tema';
  } else if (id === 'professor') {
    // Redireciona para a página do professor
    window.location.href = 'professor.html';
    return;
  } else {
    if (sidebar) sidebar.classList.remove('show');
    if (mainContainer) mainContainer.classList.add('no-sidebar');
    const startBtn = document.getElementById('start-quiz');
    if (startBtn) startBtn.textContent = 'Abrir quiz do tema';
  }
}
document.getElementById('start-quiz').addEventListener('click', () => {
  const activeSection = document.querySelector('.section.active');
  if (activeSection && activeSection.id === 'quizgeral') {
    mountGeneralQuiz();
    const qEl = document.getElementById('quiz-geral-container');
    if(qEl) qEl.scrollIntoView({behavior:'smooth', block:'center'});
  }
});
function resetAllQuizzes(){
  if(!confirm('Deseja reiniciar todos os quizzes? Isso apagará seu progresso atual no quiz.')) return;
  state.userAnswers = { alcanos: [], alcenos: [], alcinos: [], oxigenados: [] };
  state.completed = { alcanos: false, alcenos: false, alcinos: false, oxigenados: false };
  // Limpa todas as questões embaralhadas para que sejam reembaralhadas
  state.shuffledQuestions = { alcanos: null, alcenos: null, alcinos: null, oxigenados: null };
  const activeSection = document.querySelector('.section.active');
  if (activeSection && activeSection.id === 'quizgeral') {
    mountGeneralQuiz();
  } else {
    mountGeneralQuiz();
  }
  updateProgress();
}
window.resetAllQuizzes = resetAllQuizzes;
document.getElementById('reset-all').addEventListener('click', resetAllQuizzes);

// Função para selecionar um tópico de quiz
function selectQuizTopic(topic) {
  state.selectedQuizTopic = topic;
  const selectionDiv = document.getElementById('quiz-topic-selection');
  const containerDiv = document.getElementById('quiz-geral-container');
  const backBtn = document.getElementById('quiz-back-btn');
  
  if (selectionDiv) selectionDiv.style.display = 'none';
  if (containerDiv) {
    containerDiv.style.display = 'block';
    containerDiv.innerHTML = ''; // Limpa o container
  }
  if (backBtn) backBtn.style.display = 'block';
  
  // Scroll para o quiz
  if (containerDiv) {
    setTimeout(() => {
      containerDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  
  // Monta o quiz do tópico selecionado
  mountGeneralQuiz(topic);
  
  // Atualiza as estatísticas após iniciar o quiz
  setTimeout(() => updateQuizTopicStats(), 200);
}

// Função para voltar à seleção de tópicos
function backToTopicSelection() {
  state.selectedQuizTopic = null;
  const selectionDiv = document.getElementById('quiz-topic-selection');
  const containerDiv = document.getElementById('quiz-geral-container');
  const backBtn = document.getElementById('quiz-back-btn');
  
  if (selectionDiv) selectionDiv.style.display = 'block';
  if (containerDiv) {
    containerDiv.style.display = 'none';
    containerDiv.innerHTML = ''; // Limpa o container
  }
  if (backBtn) backBtn.style.display = 'none';
  
  // Atualiza as estatísticas ao voltar
  setTimeout(() => updateQuizTopicStats(), 100);
  
  // Scroll para a seleção
  if (selectionDiv) {
    setTimeout(() => {
      selectionDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// Função para atualizar as estatísticas de progresso na seleção de tópicos
function updateQuizTopicStats() {
  const topics = ['alcanos', 'alcenos', 'alcinos', 'oxigenados'];
  
  topics.forEach(topic => {
    const totalEl = document.getElementById(`${topic}-total`);
    const doneEl = document.getElementById(`${topic}-done`);
    
    if (totalEl && doneEl) {
      const questions = getCombinedQuestions(topic);
      const answered = state.userAnswers[topic].length;
      const corrects = state.userAnswers[topic].filter(x => x.correct).length;
      
      totalEl.textContent = questions.length;
      doneEl.textContent = `${answered}/${questions.length}`;
      
      // Atualiza a cor do botão baseado no progresso
      const btn = document.querySelector(`.quiz-topic-btn[data-topic="${topic}"]`);
      if (btn) {
        const progress = questions.length > 0 ? (answered / questions.length) * 100 : 0;
        if (progress === 100) {
          btn.style.borderLeftColor = '#10b981';
          btn.style.opacity = '0.9';
        } else if (progress > 0) {
          btn.style.opacity = '1';
        }
      }
    }
  });
  
  // Atualiza o resumo geral
  const summaryEl = document.getElementById('quiz-progress-summary');
  if (summaryEl) {
    let totalQuestions = 0;
    let totalAnswered = 0;
    let totalCorrects = 0;
    
    topics.forEach(topic => {
      const questions = getCombinedQuestions(topic);
      const answered = state.userAnswers[topic].length;
      const corrects = state.userAnswers[topic].filter(x => x.correct).length;
      totalQuestions += questions.length;
      totalAnswered += answered;
      totalCorrects += corrects;
    });
    
    if (totalQuestions > 0) {
      const percentage = Math.round((totalAnswered / totalQuestions) * 100);
      summaryEl.textContent = `${totalAnswered}/${totalQuestions} respondidas (${percentage}%)`;
    } else {
      summaryEl.textContent = 'Nenhuma pergunta disponível';
    }
  }
}

// Exporta as funções para uso global
window.selectQuizTopic = selectQuizTopic;
window.backToTopicSelection = backToTopicSelection;
window.updateQuizTopicStats = updateQuizTopicStats;
function resetQuiz(topic){
  state.userAnswers[topic] = [];
  state.completed[topic] = false;
  // Limpa as questões embaralhadas para que sejam reembaralhadas na próxima vez
  state.shuffledQuestions[topic] = null;
  const activeSection = document.querySelector('.section.active');
  if (activeSection && activeSection.id === 'quizgeral') {
    // Se há um tópico selecionado, mantém ele; senão, volta à seleção
    if (state.selectedQuizTopic) {
      mountGeneralQuiz(state.selectedQuizTopic);
    } else {
      mountGeneralQuiz();
    }
  } else {
    mountGeneralQuiz();
  }
  updateProgress();
}
function updateProgress(){
  // Atualiza também as estatísticas dos tópicos
  updateQuizTopicStats();
  let total = quizOrder.reduce((sum, topic) => sum + getCombinedQuestions(topic).length, 0);
  const answered = Object.keys(state.userAnswers).reduce((s, k) => s + state.userAnswers[k].length, 0);
  const pct = Math.round((answered/total) * 100);
  const bar = document.getElementById('progress');
  if (bar) {
    bar.style.background = `linear-gradient(90deg, ${pct>66 ? 'var(--success)' : pct>33 ? 'var(--accent1)' : 'var(--danger)'} ${pct}%, rgba(0,0,0,0.04) ${pct}%)`;
    bar.textContent = answered + '/' + total;
  }
}
// Image Zoom Functionality
let imageZoomState = {
  scale: 1,
  x: 0,
  y: 0,
  isDragging: false,
  startX: 0,
  startY: 0,
  startScale: 1
};

function openImageZoom(src) {
  const modal = document.getElementById('image-zoom-modal');
  const img = document.getElementById('zoomed-image');
  
  if (!modal || !img) return;
  
  img.src = src;
  imageZoomState.scale = 1;
  imageZoomState.x = 0;
  imageZoomState.y = 0;
  
  updateImageTransform();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeImageZoom() {
  const modal = document.getElementById('image-zoom-modal');
  if (!modal) return;
  
  modal.style.display = 'none';
  document.body.style.overflow = '';
  imageZoomState.scale = 1;
  imageZoomState.x = 0;
  imageZoomState.y = 0;
}

function updateImageTransform() {
  const img = document.getElementById('zoomed-image');
  if (!img) return;
  
  img.style.transform = `translate(${imageZoomState.x}px, ${imageZoomState.y}px) scale(${imageZoomState.scale})`;
}

function zoomIn() {
  imageZoomState.scale = Math.min(imageZoomState.scale * 1.2, 5);
  updateImageTransform();
}

function zoomOut() {
  imageZoomState.scale = Math.max(imageZoomState.scale / 1.2, 0.5);
  updateImageTransform();
}

function resetZoom() {
  imageZoomState.scale = 1;
  imageZoomState.x = 0;
  imageZoomState.y = 0;
  updateImageTransform();
}

// Initialize image zoom on page load
function initImageZoom() {
  // Handle clicks on illustrations (SVG containers)
  document.querySelectorAll('.illustration').forEach(illustration => {
    illustration.style.cursor = 'pointer';
    illustration.addEventListener('click', (e) => {
      // Get the SVG element
      const svg = illustration.querySelector('svg');
      if (svg) {
        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        openImageZoom(url);
      }
    });
  });
  
  // Handle clicks on images (excluding IFTO logo if needed, or include it)
  document.querySelectorAll('img').forEach(img => {
    if (img.classList.contains('ifto-logo')) {
      // Make IFTO logo clickable too
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openImageZoom(img.src);
      });
    } else {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openImageZoom(img.src);
      });
    }
  });
  
  // Close button
  const closeBtn = document.querySelector('.image-zoom-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeImageZoom);
  }
  
  // Zoom controls
  const zoomInBtn = document.querySelector('.zoom-in');
  const zoomOutBtn = document.querySelector('.zoom-out');
  const zoomResetBtn = document.querySelector('.zoom-reset');
  
  if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);
  
  // Close on overlay click
  const overlay = document.querySelector('.image-zoom-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeImageZoom);
  }
  
  // Mouse wheel zoom
  const zoomContent = document.querySelector('.image-zoom-content');
  if (zoomContent) {
    zoomContent.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      imageZoomState.scale = Math.max(0.5, Math.min(imageZoomState.scale * delta, 5));
      updateImageTransform();
    });
  }
  
  // Drag to pan
  if (zoomContent) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startTranslateX = 0;
    let startTranslateY = 0;
    
    zoomContent.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'IMG') {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startTranslateX = imageZoomState.x;
        startTranslateY = imageZoomState.y;
        zoomContent.style.cursor = 'grabbing';
        e.target.classList.add('dragging');
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        imageZoomState.x = startTranslateX + (e.clientX - startX);
        imageZoomState.y = startTranslateY + (e.clientY - startY);
        updateImageTransform();
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        zoomContent.style.cursor = 'grab';
        const img = document.getElementById('zoomed-image');
        if (img) img.classList.remove('dragging');
      }
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('image-zoom-modal');
    if (modal && modal.style.display === 'flex') {
      if (e.key === 'Escape') {
        closeImageZoom();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      } else if (e.key === '0') {
        resetZoom();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Verifica se localStorage está disponível (não funciona no preview do VSCode)
  try {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      console.warn('localStorage não está disponível. Algumas funcionalidades podem não funcionar.');
      // Mostra aviso se estiver em preview mode
      const warning = document.createElement('div');
      warning.style.cssText = 'position:fixed;top:20px;right:20px;background:#fef2f2;border:2px solid #ef4444;border-radius:8px;padding:16px;max-width:300px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
      warning.innerHTML = '<strong style="color:#991b1b;">⚠️ Aviso</strong><p style="margin:8px 0 0 0;color:#64748b;font-size:0.9rem;">Para usar os quizzes, abra este arquivo em um navegador (não no preview do VSCode).</p>';
      document.body.appendChild(warning);
      setTimeout(() => warning.remove(), 10000);
    }
  } catch (e) {
    console.warn('Erro ao verificar localStorage:', e);
  }
  
  const sidebar = document.querySelector('aside.sidebar');
  const mainContainer = document.querySelector('main.container');
  if (sidebar) sidebar.classList.remove('show');
  if (mainContainer) mainContainer.classList.add('no-sidebar');
  updateProgress();
  
  // Initialize image zoom
  initImageZoom();
});
// Funções do professor movidas para professor.js
// Sistema de Texto para Voz (TTS) - Melhorado
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isSpeaking = false;
let currentSectionId = null;

// Função para limpar texto e melhorar pronúncia
function cleanTextForSpeech(text) {
  if (!text) return '';
  
  // Remove tags HTML e mantém apenas texto
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  let cleanText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Melhora pronúncia de fórmulas químicas
  cleanText = cleanText.replace(/C<sub>(\d+)<\/sub>/g, 'C $1');
  cleanText = cleanText.replace(/H<sub>(\d+)<\/sub>/g, 'H $1');
  cleanText = cleanText.replace(/O<sub>(\d+)<\/sub>/g, 'O $1');
  cleanText = cleanText.replace(/<sub>/g, '');
  cleanText = cleanText.replace(/<\/sub>/g, '');
  cleanText = cleanText.replace(/CH<sub>(\d+)<\/sub>/g, 'C H $1');
  cleanText = cleanText.replace(/ₙ/g, 'n');
  cleanText = cleanText.replace(/₂/g, '2');
  cleanText = cleanText.replace(/₃/g, '3');
  cleanText = cleanText.replace(/₄/g, '4');
  cleanText = cleanText.replace(/₅/g, '5');
  cleanText = cleanText.replace(/₊/g, ' mais ');
  cleanText = cleanText.replace(/₋/g, ' menos ');
  cleanText = cleanText.replace(/→/g, ' produz ');
  cleanText = cleanText.replace(/\+/g, ' mais ');
  cleanText = cleanText.replace(/=/g, ' igual a ');
  
  // Remove múltiplos espaços
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  return cleanText;
}

// Função para selecionar melhor voz
function getBestVoice() {
  const voices = speechSynthesis.getVoices();
  // Prioriza vozes em português brasileiro
  const ptBRVoices = voices.filter(v => v.lang.startsWith('pt-BR'));
  if (ptBRVoices.length > 0) {
    // Prioriza vozes femininas (geralmente mais claras)
    const femaleVoice = ptBRVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('heloisa'));
    if (femaleVoice) return femaleVoice;
    return ptBRVoices[0];
  }
  // Fallback para português
  const ptVoices = voices.filter(v => v.lang.startsWith('pt'));
  if (ptVoices.length > 0) return ptVoices[0];
  // Fallback para qualquer voz disponível
  return voices.find(v => v.lang.includes('pt')) || voices[0];
}

// Função para abrir/fechar menu TTS
function toggleTTSMenu(sectionId) {
  const menu = document.getElementById(`tts-menu-${sectionId}`);
  if (!menu) return;
  
  // Fecha todos os outros menus
  document.querySelectorAll('.tts-menu').forEach(m => {
    if (m.id !== `tts-menu-${sectionId}`) {
      m.style.display = 'none';
    }
  });
  
  // Alterna o menu atual
  if (menu.style.display === 'none' || !menu.style.display) {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

// Fecha menus ao clicar fora
document.addEventListener('click', (e) => {
  if (!e.target.closest('.tts-control')) {
    document.querySelectorAll('.tts-menu').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});

function readContent(sectionId, tabId = null) {
  const btn = document.getElementById(`tts-btn-${sectionId}`);
  const icon = document.getElementById(`tts-icon-${sectionId}`);
  
  // Fecha o menu após seleção
  const menu = document.getElementById(`tts-menu-${sectionId}`);
  if (menu) menu.style.display = 'none';
  
  // Se já está falando esta seção, pausa
  if (isSpeaking && currentSectionId === sectionId && currentUtterance) {
    speechSynthesis.cancel();
    isSpeaking = false;
    currentSectionId = null;
    if (btn) {
      btn.classList.remove('playing');
      if (icon) icon.textContent = '🔊';
    }
    return;
  }
  
  // Se está falando outra seção, cancela e inicia nova
  if (isSpeaking && currentUtterance) {
    speechSynthesis.cancel();
    // Remove playing de todos os botões
    document.querySelectorAll('[id^="tts-btn-"]').forEach(b => {
      b.classList.remove('playing');
      const ic = b.querySelector('[id^="tts-icon-"]');
      if (ic) ic.textContent = '🔊';
    });
  }
  
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  let text = '';
  const title = section.querySelector('h2');
  const lead = section.querySelector('.lead');
  
  // Se tabId for null, usa a aba ativa; caso contrário, usa a aba especificada
  let targetTab = null;
  if (tabId === null) {
    targetTab = section.querySelector('.tab-content.active');
  } else {
    targetTab = section.querySelector(`#${tabId}`);
  }
  
  if (title) {
    const titleText = cleanTextForSpeech(title.textContent);
    text += titleText + '. ';
  }
  
  if (lead) {
    const leadText = cleanTextForSpeech(lead.textContent);
    text += leadText + '. ';
  }
  
  if (targetTab) {
    const cards = targetTab.querySelectorAll('.card');
    cards.forEach((card, index) => {
      const cardTitle = card.querySelector('h4');
      const cardText = card.querySelectorAll('p');
      const cardList = card.querySelectorAll('ul.info li');
      
      if (cardTitle) {
        const titleText = cleanTextForSpeech(cardTitle.textContent);
        text += titleText + '. ';
      }
      
      cardText.forEach(p => {
        const pText = cleanTextForSpeech(p.textContent);
        if (pText) text += pText + '. ';
      });
      
      cardList.forEach(li => {
        const liText = cleanTextForSpeech(li.textContent);
        if (liText) text += liText + '. ';
      });
    });
  }
  
  if (text.trim()) {
    // Aguarda vozes carregarem se necessário
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        speakText(text, btn, icon, sectionId);
      }, { once: true });
    } else {
      speakText(text, btn, icon, sectionId);
    }
  }
}

function speakText(text, btn, icon, sectionId) {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getBestVoice();
  
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || 'pt-BR';
  } else {
    utterance.lang = 'pt-BR';
  }
  
  // Configurações otimizadas para melhor qualidade
  utterance.rate = 0.85; // Velocidade um pouco mais lenta para melhor compreensão
  utterance.pitch = 1.0; // Tom natural
  utterance.volume = 1.0; // Volume máximo
  
  utterance.onstart = () => {
    isSpeaking = true;
    currentSectionId = sectionId;
    if (btn) {
      btn.classList.add('playing');
      if (icon) icon.textContent = '⏸️';
    }
  };
  
  utterance.onend = () => {
    isSpeaking = false;
    currentSectionId = null;
    if (btn) {
      btn.classList.remove('playing');
      if (icon) icon.textContent = '🔊';
    }
  };
  
  utterance.onerror = (e) => {
    console.error('Erro na síntese de voz:', e);
    isSpeaking = false;
    currentSectionId = null;
    if (btn) {
      btn.classList.remove('playing');
      if (icon) icon.textContent = '🔊';
    }
    alert('Erro ao reproduzir áudio. Verifique se seu navegador suporta síntese de voz.');
  };
  
  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

window.readContent = readContent;
window.toggleTTSMenu = toggleTTSMenu;

// Sistema de Abas
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      const container = btn.closest('.tabs-container');
      if (!container) return;
      
      // Remove active de todas as abas e conteúdos
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Adiciona active na aba clicada e seu conteúdo
      btn.classList.add('active');
      const content = container.querySelector(`#${tabId}`);
      if (content) content.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  showProfessorPanel();
  initTabs();
  updateProgress();
  // Atualiza as estatísticas de progresso dos quizzes
  setTimeout(() => {
    if (document.getElementById('quiz-topic-selection')) {
      updateQuizTopicStats();
    }
  }, 300);
});

const originalShowSection = showSection;
showSection = function(id) {
  originalShowSection(id);
  // Reinicializa abas quando mudar de seção
  setTimeout(() => initTabs(), 100);
};

