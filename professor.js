// Sistema de Login e Gerenciamento de Senha
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin';

// Inicializa credenciais padrão se não existirem
function initCredentials() {
  if (!localStorage.getItem('professor_username')) {
    localStorage.setItem('professor_username', DEFAULT_USERNAME);
  }
  if (!localStorage.getItem('professor_password')) {
    localStorage.setItem('professor_password', DEFAULT_PASSWORD);
  }
}

// Verifica se está logado
function checkLogin() {
  const isLoggedIn = sessionStorage.getItem('professor_logged_in') === 'true';
  if (isLoggedIn) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    showProfessorPanel();
  } else {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
  }
}

// Função de login
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorDiv = document.getElementById('login-error');
  
  const storedUsername = localStorage.getItem('professor_username') || DEFAULT_USERNAME;
  const storedPassword = localStorage.getItem('professor_password') || DEFAULT_PASSWORD;
  
  if (username === storedUsername && password === storedPassword) {
    sessionStorage.setItem('professor_logged_in', 'true');
    errorDiv.style.display = 'none';
    checkLogin();
  } else {
    const errorSpan = errorDiv.querySelector('span');
    if (errorSpan) {
      errorSpan.textContent = 'Usuário ou senha incorretos!';
    }
    errorDiv.style.display = 'flex';
    document.getElementById('login-password').value = '';
    // Adiciona animação de shake
    const loginCard = document.querySelector('#login-screen .card');
    if (loginCard) {
      loginCard.style.animation = 'shake 0.5s';
      setTimeout(() => {
        loginCard.style.animation = '';
      }, 500);
    }
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

// Função de logout
function handleLogout() {
  if (confirm('Deseja realmente sair?')) {
    sessionStorage.removeItem('professor_logged_in');
    checkLogin();
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
  }
}

// Modal de alterar senha
function showChangePasswordModal() {
  document.getElementById('change-password-modal').style.display = 'flex';
  document.getElementById('current-password').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
  document.getElementById('password-error').style.display = 'none';
  document.getElementById('password-success').style.display = 'none';
}

function closeChangePasswordModal() {
  document.getElementById('change-password-modal').style.display = 'none';
  document.getElementById('current-password').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
  document.getElementById('password-error').style.display = 'none';
  document.getElementById('password-success').style.display = 'none';
}

// Função para alterar senha
function handleChangePassword(event) {
  event.preventDefault();
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorDiv = document.getElementById('password-error');
  const successDiv = document.getElementById('password-success');
  
  const storedPassword = localStorage.getItem('professor_password') || DEFAULT_PASSWORD;
  
  // Validações
  if (currentPassword !== storedPassword) {
    errorDiv.textContent = 'Senha atual incorreta!';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }
  
  if (newPassword.length < 3) {
    errorDiv.textContent = 'A nova senha deve ter pelo menos 3 caracteres!';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }
  
  if (newPassword !== confirmPassword) {
    errorDiv.textContent = 'As senhas não coincidem!';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }
  
  if (newPassword === currentPassword) {
    errorDiv.textContent = 'A nova senha deve ser diferente da senha atual!';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }
  
  // Salva a nova senha
  localStorage.setItem('professor_password', newPassword);
  successDiv.textContent = 'Senha alterada com sucesso!';
  successDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  
  // Limpa os campos
  document.getElementById('current-password').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
  
  // Fecha o modal após 2 segundos
  setTimeout(() => {
    closeChangePasswordModal();
  }, 2000);
}

// Fecha modal ao clicar fora
document.addEventListener('click', (e) => {
  const modal = document.getElementById('change-password-modal');
  if (e.target === modal) {
    closeChangePasswordModal();
  }
});

// Estado do professor
let professorState = {
  loggedIn: false,
  currentTopic: 'alcanos'
};

// Funções do painel do professor (reutilizadas do script.js)
function showProfessorPanel() {
  if (document.getElementById('professor-panel')) {
    document.getElementById('professor-panel').style.display = 'block';
    selectProfessorTopic(professorState.currentTopic);
    loadProfessorQuestions();
  }
}

function selectProfessorTopic(topic) {
  professorState.currentTopic = topic;
  const topicColors = {
    'alcanos': { bg: 'rgba(37,99,235,0.1)', border: 'rgba(37,99,235,0.3)', active: 'linear-gradient(135deg, #2563eb, #1e40af)' },
    'alcenos': { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', active: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    'alcinos': { bg: 'rgba(122,209,255,0.1)', border: 'rgba(122,209,255,0.3)', active: 'linear-gradient(135deg, #7ad1ff, #00c1ff)' },
    'oxigenados': { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', active: 'linear-gradient(135deg, #10b981, #059669)' }
  };
  
  ['alcanos', 'alcenos', 'alcinos', 'oxigenados'].forEach(t => {
    const btn = document.getElementById('prof-topic-' + t);
    if (btn) {
      const colors = topicColors[t];
      if (t === topic) {
        btn.style.background = colors.active;
        btn.style.color = 'white';
        btn.style.borderColor = 'transparent';
        btn.style.transform = 'scale(1.05)';
        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      } else {
        btn.style.background = colors.bg;
        btn.style.color = 'var(--text-primary)';
        btn.style.borderColor = colors.border;
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = 'none';
      }
    }
  });
  loadProfessorQuestions();
}

function getProfessorQuestions(topic) {
  const key = 'professor_questions_' + topic;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
}

function saveProfessorQuestions(topic, questions) {
  const key = 'professor_questions_' + topic;
  localStorage.setItem(key, JSON.stringify(questions));
}

function addProfessorQuestion() {
  const topic = professorState.currentTopic;
  const questionText = document.getElementById('prof-question-text').value.trim();
  const options = [
    document.getElementById('prof-option-0').value.trim(),
    document.getElementById('prof-option-1').value.trim(),
    document.getElementById('prof-option-2').value.trim(),
    document.getElementById('prof-option-3').value.trim()
  ];
  const correctAnswer = document.querySelector('input[name="prof-correct-answer"]:checked');
  
  if (!questionText) { 
    alert('Por favor, digite a pergunta!'); 
    return; 
  }
  if (options.some(opt => !opt)) { 
    alert('Por favor, preencha todas as 4 opções!'); 
    return; 
  }
  if (!correctAnswer) { 
    alert('Por favor, selecione qual é a resposta correta!'); 
    return; 
  }
  
  const newQuestion = {
    q: questionText,
    options: options,
    answer: parseInt(correctAnswer.value),
    id: Date.now()
  };
  
  const questions = getProfessorQuestions(topic);
  questions.push(newQuestion);
  saveProfessorQuestions(topic, questions);
  clearProfessorForm();
  loadProfessorQuestions();
  alert('Pergunta adicionada com sucesso!');
}

function clearProfessorForm() {
  document.getElementById('prof-question-text').value = '';
  document.getElementById('prof-option-0').value = '';
  document.getElementById('prof-option-1').value = '';
  document.getElementById('prof-option-2').value = '';
  document.getElementById('prof-option-3').value = '';
  document.querySelectorAll('input[name="prof-correct-answer"]').forEach(r => r.checked = false);
}

function loadProfessorQuestions() {
  const topic = professorState.currentTopic;
  const questions = getProfessorQuestions(topic);
  const container = document.getElementById('professor-questions-list');
  const countEl = document.getElementById('prof-question-count');
  
  if (!container || !countEl) return;
  
  countEl.textContent = questions.length;
  
  if (questions.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:60px 20px; color:var(--muted)">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px; opacity:0.3">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <p style="font-size:1rem; margin:0; font-weight:500">Nenhuma pergunta personalizada ainda</p>
        <p style="font-size:0.9rem; margin:8px 0 0 0; opacity:0.7">Adicione uma pergunta acima para começar!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = questions.map((q, index) => `
    <div class="card" style="margin-bottom:16px; padding:24px; background:rgba(255,255,255,0.98); border:2px solid rgba(139,92,246,0.15); border-radius:16px; transition:all 0.3s; position:relative; overflow:hidden"
         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'"
         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, rgba(139,92,246,0.3), rgba(99,102,241,0.3))"></div>
      <div style="display:flex; justify-content:space-between; align-items:start; gap:20px; flex-wrap:wrap">
        <div style="flex:1; min-width:300px">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px">
            <span style="background:linear-gradient(135deg, #8b5cf6, #6366f1); color:white; padding:6px 16px; border-radius:20px; font-size:0.9rem; font-weight:700; box-shadow:0 2px 8px rgba(139,92,246,0.3)">#${index + 1}</span>
            <strong style="color:var(--text-primary); font-size:1.05rem; line-height:1.5">${q.q}</strong>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:10px; margin-left:8px">
            ${q.options.map((opt, i) => `
              <div style="display:flex; align-items:center; gap:10px; padding:12px 14px; background:${i === q.answer ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))' : 'rgba(0,0,0,0.02)'}; border:2px solid ${i === q.answer ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.05)'}; border-radius:10px; transition:all 0.3s"
                   onmouseover="this.style.background='${i === q.answer ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.04)'}'"
                   onmouseout="this.style.background='${i === q.answer ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))' : 'rgba(0,0,0,0.02)'}'">
                <div style="width:24px; height:24px; border-radius:50%; background:${i === q.answer ? '#10b981' : 'rgba(0,0,0,0.1)'}; display:flex; align-items:center; justify-content:center; flex-shrink:0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${i === q.answer ? 'white' : 'rgba(0,0,0,0.3)'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    ${i === q.answer ? '<polyline points="20 6 9 17 4 12"/>' : '<circle cx="12" cy="12" r="5"/>'}
                  </svg>
                </div>
                <span style="color:${i === q.answer ? '#047857' : 'var(--text-secondary)'}; font-weight:${i === q.answer ? '600' : '400'}; font-size:0.95rem; line-height:1.4">${opt}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <button class="btn ghost" onclick="deleteProfessorQuestion(${q.id})" 
                style="color:#ef4444; border-color:rgba(239,68,68,0.3); flex-shrink:0; padding:12px 20px; font-weight:600; transition:all 0.3s; display:flex; align-items:center; gap:8px"
                onmouseover="this.style.background='rgba(239,68,68,0.1)'; this.style.borderColor='#ef4444'; this.style.transform='scale(1.05)'"
                onmouseout="this.style.background=''; this.style.borderColor='rgba(239,68,68,0.3)'; this.style.transform='scale(1)'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Excluir
        </button>
      </div>
    </div>
  `).join('');
}

function deleteProfessorQuestion(id) {
  if (!confirm('Deseja realmente excluir esta pergunta?')) return;
  
  const topic = professorState.currentTopic;
  const questions = getProfessorQuestions(topic);
  const filtered = questions.filter(q => q.id !== id);
  saveProfessorQuestions(topic, filtered);
  loadProfessorQuestions();
}

// Exporta funções para uso global
window.selectProfessorTopic = selectProfessorTopic;
window.addProfessorQuestion = addProfessorQuestion;
window.clearProfessorForm = clearProfessorForm;
window.deleteProfessorQuestion = deleteProfessorQuestion;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.handleChangePassword = handleChangePassword;
window.showChangePasswordModal = showChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  initCredentials();
  checkLogin();
});

