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

// Modal de Recuperação de Email
function showRecoveryEmailModal() {
  const modal = document.getElementById('recovery-email-modal');
  const setupDiv = document.getElementById('recovery-email-setup');
  const resetDiv = document.getElementById('recovery-email-reset');
  const storedRecoveryEmail = localStorage.getItem('professor_recovery_email');
  
  // Limpa mensagens de erro/sucesso
  document.getElementById('recovery-email-error').style.display = 'none';
  document.getElementById('recovery-email-success').style.display = 'none';
  document.getElementById('reset-password-error').style.display = 'none';
  document.getElementById('reset-password-success').style.display = 'none';
  
  // Limpa campos
  document.getElementById('setup-recovery-email').value = storedRecoveryEmail || '';
  document.getElementById('reset-recovery-email').value = '';
  document.getElementById('reset-new-password').value = '';
  document.getElementById('reset-confirm-password').value = '';
  
  // Mostra setup se não há email, ou reset se há email
  if (storedRecoveryEmail) {
    setupDiv.style.display = 'none';
    resetDiv.style.display = 'block';
  } else {
    setupDiv.style.display = 'block';
    resetDiv.style.display = 'none';
  }
  
  modal.style.display = 'flex';
}

function closeRecoveryEmailModal() {
  document.getElementById('recovery-email-modal').style.display = 'none';
  document.getElementById('setup-recovery-email').value = '';
  document.getElementById('reset-recovery-email').value = '';
  document.getElementById('reset-new-password').value = '';
  document.getElementById('reset-confirm-password').value = '';
  document.getElementById('recovery-email-error').style.display = 'none';
  document.getElementById('recovery-email-success').style.display = 'none';
  document.getElementById('reset-password-error').style.display = 'none';
  document.getElementById('reset-password-success').style.display = 'none';
}

// Função para configurar email de recuperação
function handleSetupRecoveryEmail(event) {
  event.preventDefault();
  const email = document.getElementById('setup-recovery-email').value.trim();
  const errorDiv = document.getElementById('recovery-email-error');
  const successDiv = document.getElementById('recovery-email-success');
  
  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorDiv.textContent = 'Por favor, insira um email válido!';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }
  
  // Salva o email de recuperação
  localStorage.setItem('professor_recovery_email', email);
  successDiv.textContent = 'Email de recuperação salvo com sucesso!';
  successDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  
  // Atualiza a interface para mostrar opção de reset
  setTimeout(() => {
    document.getElementById('recovery-email-setup').style.display = 'none';
    document.getElementById('recovery-email-reset').style.display = 'block';
    document.getElementById('reset-recovery-email').value = email;
  }, 1500);
}

// Função para redefinir senha usando email de recuperação
function handleResetPassword(event) {
  event.preventDefault();
  const email = document.getElementById('reset-recovery-email').value.trim();
  const newPassword = document.getElementById('reset-new-password').value;
  const confirmPassword = document.getElementById('reset-confirm-password').value;
  const errorDiv = document.getElementById('reset-password-error');
  const successDiv = document.getElementById('reset-password-success');
  
  const storedRecoveryEmail = localStorage.getItem('professor_recovery_email');
  
  // Verifica se o email corresponde
  if (!storedRecoveryEmail || email !== storedRecoveryEmail) {
    errorDiv.textContent = 'Email de recuperação não encontrado ou incorreto!';
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    return;
  }
  
  // Validações de senha
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
  
  // Redefine a senha
  localStorage.setItem('professor_password', newPassword);
  successDiv.textContent = 'Senha redefinida com sucesso! Você pode fazer login agora.';
  successDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  
  // Limpa os campos
  document.getElementById('reset-recovery-email').value = '';
  document.getElementById('reset-new-password').value = '';
  document.getElementById('reset-confirm-password').value = '';
  
  // Fecha o modal após 2 segundos e redireciona para login
  setTimeout(() => {
    closeRecoveryEmailModal();
    // Opcional: limpar campos de login também
    if (document.getElementById('login-username')) {
      document.getElementById('login-username').value = '';
    }
    if (document.getElementById('login-password')) {
      document.getElementById('login-password').value = '';
    }
  }, 2000);
}

// Fecha modais ao clicar fora
document.addEventListener('click', (e) => {
  const changePasswordModal = document.getElementById('change-password-modal');
  const recoveryEmailModal = document.getElementById('recovery-email-modal');
  
  if (e.target === changePasswordModal) {
    closeChangePasswordModal();
  }
  
  if (e.target === recoveryEmailModal) {
    closeRecoveryEmailModal();
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
    // Carrega registros de estudantes
    setTimeout(() => {
      loadStudentRecords();
    }, 300);
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
  const imageUrl = document.getElementById('prof-question-image-url').value.trim();
  const imagePreview = document.getElementById('prof-image-preview-img');
  const imageData = imagePreview && imagePreview.src ? imagePreview.src : (imageUrl || null);
  
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
  
  // Add image if provided
  if (imageData) {
    newQuestion.image = imageData;
  }
  
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
  document.getElementById('prof-question-image-url').value = '';
  document.getElementById('prof-question-image-file').value = '';
  document.querySelectorAll('input[name="prof-correct-answer"]').forEach(r => r.checked = false);
  clearImagePreview();
}

// Handle image file upload
function handleImageFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione um arquivo de imagem válido!');
    event.target.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewDiv = document.getElementById('prof-image-preview');
    const previewImg = document.getElementById('prof-image-preview-img');
    if (previewDiv && previewImg) {
      previewImg.src = e.target.result;
      previewDiv.style.display = 'block';
      // Also set the URL field to the data URL
      document.getElementById('prof-question-image-url').value = e.target.result;
    }
  };
  reader.onerror = function() {
    alert('Erro ao ler o arquivo de imagem!');
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

// Clear image preview
function clearImagePreview() {
  const previewDiv = document.getElementById('prof-image-preview');
  const previewImg = document.getElementById('prof-image-preview-img');
  const urlInput = document.getElementById('prof-question-image-url');
  const fileInput = document.getElementById('prof-question-image-file');
  
  if (previewDiv) previewDiv.style.display = 'none';
  if (previewImg) previewImg.src = '';
  if (urlInput) urlInput.value = '';
  if (fileInput) fileInput.value = '';
}

// Handle URL input changes
document.addEventListener('DOMContentLoaded', () => {
  // Wait for the element to exist
  setTimeout(() => {
    const urlInput = document.getElementById('prof-question-image-url');
    if (urlInput) {
      urlInput.addEventListener('input', function() {
        const url = this.value.trim();
        const previewDiv = document.getElementById('prof-image-preview');
        const previewImg = document.getElementById('prof-image-preview-img');
        
        if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image'))) {
          if (previewDiv && previewImg) {
            previewImg.src = url;
            previewImg.onload = function() {
              previewDiv.style.display = 'block';
            };
            previewImg.onerror = function() {
              previewDiv.style.display = 'none';
            };
          }
        } else if (!url) {
          if (previewDiv) previewDiv.style.display = 'none';
        }
      });
    }
  }, 500);
});

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
          ${q.image ? `
            <div style="margin-bottom:16px; margin-left:8px; text-align:center">
              <img src="${q.image}" alt="Imagem da pergunta" 
                   style="max-width:100%; max-height:300px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); cursor:pointer; object-fit:contain"
                   onclick="if(typeof openImageZoom === 'function') openImageZoom(this.src)">
            </div>
          ` : ''}
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

// Função para obter registros de estudantes (compatível com script.js)
function getAllStudentRecords() {
  try {
    if (typeof localStorage === 'undefined' || localStorage === null) {
      return [];
    }
    return JSON.parse(localStorage.getItem('student_quiz_records') || '[]');
  } catch (e) {
    return [];
  }
}

// Função para carregar e exibir registros de estudantes
function loadStudentRecords() {
  const container = document.getElementById('student-records-container');
  if (!container) return;
  
  const records = getAllStudentRecords();
  
  if (records.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:60px 20px; color:var(--muted)">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px; opacity:0.3">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p style="font-size:1rem; margin:0; font-weight:500">Nenhum registro encontrado</p>
        <p style="font-size:0.9rem; margin:8px 0 0 0; opacity:0.7">Os registros aparecerão aqui quando os estudantes completarem os quizzes</p>
      </div>
    `;
    return;
  }
  
  // Agrupa registros por estudante
  const studentsMap = {};
  records.forEach(record => {
    if (!studentsMap[record.studentName]) {
      studentsMap[record.studentName] = {
        name: record.studentName,
        records: [],
        totalQuizzes: 0,
        totalQuestions: 0,
        totalCorrect: 0
      };
    }
    studentsMap[record.studentName].records.push(record);
    studentsMap[record.studentName].totalQuizzes++;
    studentsMap[record.studentName].totalQuestions += record.totalQuestions;
    studentsMap[record.studentName].totalCorrect += record.correctAnswers;
  });
  
  // Converte para array e ordena por nome
  const students = Object.values(studentsMap).sort((a, b) => a.name.localeCompare(b.name));
  
  // Calcula média geral de cada estudante
  students.forEach(student => {
    student.averagePercentage = student.totalQuestions > 0 
      ? Math.round((student.totalCorrect / student.totalQuestions) * 100) 
      : 0;
  });
  
  // Renderiza os registros
  container.innerHTML = students.map((student, idx) => {
    const topicNames = {
      'alcanos': 'Alcanos',
      'alcenos': 'Alcenos',
      'alcinos': 'Alcinos',
      'oxigenados': 'Oxigenados'
    };
    
    // Ordena registros por data (mais recente primeiro)
    const sortedRecords = student.records.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return `
      <div class="card" style="margin-bottom:16px; border:2px solid rgba(37,99,235,0.15); background:${idx % 2 === 0 ? '#ffffff' : 'rgba(37,99,235,0.02)'}">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:12px">
          <div style="display:flex; align-items:center; gap:12px; flex:1">
            <div style="width:48px; height:48px; border-radius:12px; background:linear-gradient(135deg, #2563eb, #06b6d4); display:flex; align-items:center; justify-content:center; flex-shrink:0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style="flex:1">
              <h4 style="margin:0 0 4px 0; font-size:1.2rem; color:#1e40af; font-weight:600">${student.name}</h4>
              <p style="margin:0; color:var(--muted); font-size:0.9rem">
                ${student.totalQuizzes} quiz${student.totalQuizzes !== 1 ? 'zes' : ''} completado${student.totalQuizzes !== 1 ? 's' : ''} • 
                Média geral: <strong style="color:#2563eb">${student.averagePercentage}%</strong>
              </p>
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.5rem; font-weight:700; color:#2563eb; line-height:1">${student.averagePercentage}%</div>
            <div style="font-size:0.85rem; color:var(--muted); margin-top:4px">Média</div>
          </div>
        </div>
        
        <div style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(37,99,235,0.1)">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px">
            ${sortedRecords.map(record => `
              <div style="padding:12px; background:rgba(37,99,235,0.05); border:1px solid rgba(37,99,235,0.15); border-radius:8px">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px">
                  <span style="font-weight:600; color:#1e40af; font-size:0.95rem">${topicNames[record.topic] || record.topic}</span>
                  <span style="font-size:0.85rem; color:var(--muted)">${record.date}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
                  <span style="font-size:0.9rem; color:#064a6b">Acertos:</span>
                  <strong style="color:${record.percentage >= 70 ? '#10b981' : record.percentage >= 50 ? '#f59e0b' : '#ef4444'}; font-size:1rem">
                    ${record.correctAnswers}/${record.totalQuestions}
                  </strong>
                </div>
                <div style="display:flex; align-items:center; gap:8px">
                  <span style="font-size:0.9rem; color:#064a6b">Porcentagem:</span>
                  <strong style="color:${record.percentage >= 70 ? '#10b981' : record.percentage >= 50 ? '#f59e0b' : '#ef4444'}; font-size:1rem">
                    ${record.percentage}%
                  </strong>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Função para atualizar os registros
function refreshStudentRecords() {
  loadStudentRecords();
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
window.handleImageFileUpload = handleImageFileUpload;
window.clearImagePreview = clearImagePreview;
window.loadStudentRecords = loadStudentRecords;
window.refreshStudentRecords = refreshStudentRecords;
window.getAllStudentRecords = getAllStudentRecords;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  initCredentials();
  checkLogin();
  // Carrega registros de estudantes quando o painel é mostrado
  setTimeout(() => {
    loadStudentRecords();
  }, 500);
});

