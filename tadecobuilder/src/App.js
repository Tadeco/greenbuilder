import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'builder', 'impact', 'cases', 'metrics', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="site-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-text">BUILDER</span>
            <span className="logo-subtitle">Engenharia com IA</span>
          </div>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a 
              href="#home" 
              className={activeSection === 'home' ? 'active' : ''}
              onClick={() => scrollToSection('home')}
            >
              Home
            </a>
            <a 
              href="#builder" 
              className={activeSection === 'builder' ? 'active' : ''}
              onClick={() => scrollToSection('builder')}
            >
              BUILDER
            </a>
            <a 
              href="#impact" 
              className={activeSection === 'impact' ? 'active' : ''}
              onClick={() => scrollToSection('impact')}
            >
              Impacto
            </a>
            <a 
              href="#cases" 
              className={activeSection === 'cases' ? 'active' : ''}
              onClick={() => scrollToSection('cases')}
            >
              Cases
            </a>
            <a 
              href="#metrics" 
              className={activeSection === 'metrics' ? 'active' : ''}
              onClick={() => scrollToSection('metrics')}
            >
              Métricas
            </a>
            <a 
              href="#contact" 
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={() => scrollToSection('contact')}
            >
              Contato
            </a>
          </div>
          <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="highlight">BUILDER</span> Engineering
            </h1>
            <h2 className="hero-subtitle">Revolucionando Empresas com IA</h2>
            <p className="hero-description">
              Transformamos organizações através da engenharia de prompt e cultura BUILDER. 
              Criamos soluções inteligentes que geram resultados mensuráveis e sustentáveis.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">+300%</span>
                <span className="stat-label">Eficiência</span>
              </div>
              <div className="stat">
                <span className="stat-number">-60%</span>
                <span className="stat-label">Custos</span>
              </div>
              <div className="stat">
                <span className="stat-number">+150%</span>
                <span className="stat-label">Produtividade</span>
              </div>
            </div>
            <button className="cta-btn" onClick={() => scrollToSection('contact')}>
              Transforme Sua Empresa
            </button>
          </div>
        </div>
      </section>

      {/* BUILDER Section */}
      <section className="builder-section" id="builder">
        <div className="container">
          <h2 className="section-title">O que é <span className="highlight">BUILDER</span> Engineering?</h2>
          <div className="builder-grid">
            <div className="builder-card">
              <div className="card-icon">🔧</div>
              <h3>Build</h3>
              <p>Construímos soluções personalizadas usando IA generativa e automação inteligente</p>
            </div>
            <div className="builder-card">
              <div className="card-icon">🚀</div>
              <h3>Innovate</h3>
              <p>Inovamos processos e criamos novas capacidades através de engenharia de prompt</p>
            </div>
            <div className="builder-card">
              <div className="card-icon">📊</div>
              <h3>Learn</h3>
              <p>Aprendemos continuamente com dados e feedback para otimizar resultados</p>
            </div>
            <div className="builder-card">
              <div className="card-icon">⚡</div>
              <h3>Deploy</h3>
              <p>Implementamos rapidamente soluções escaláveis e sustentáveis</p>
            </div>
            <div className="builder-card">
              <div className="card-icon">🎯</div>
              <h3>Execute</h3>
              <p>Executamos com precisão e medimos impactos em tempo real</p>
            </div>
            <div className="builder-card">
              <div className="card-icon">🔄</div>
              <h3>Repeat</h3>
              <p>Repetimos o ciclo de melhoria contínua para resultados exponenciais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section" id="impact">
        <div className="container">
          <h2 className="section-title">Impacto <span className="highlight">Transformador</span></h2>
          <div className="impact-grid">
            <div className="impact-item">
              <h3>📈 Indicadores de Performance</h3>
              <ul>
                <li>KPIs automatizados em tempo real</li>
                <li>Dashboards inteligentes personalizados</li>
                <li>Alertas proativos de performance</li>
                <li>Análise preditiva de tendências</li>
              </ul>
            </div>
            <div className="impact-item">
              <h3>🌱 Sustentabilidade</h3>
              <ul>
                <li>Redução de 40-60% no consumo energético</li>
                <li>Otimização de recursos hídricos</li>
                <li>Gestão inteligente de resíduos</li>
                <li>Relatórios ESG automatizados</li>
              </ul>
            </div>
            <div className="impact-item">
              <h3>💰 Redução de Custos</h3>
              <ul>
                <li>Automação de processos operacionais</li>
                <li>Otimização de supply chain</li>
                <li>Redução de desperdícios</li>
                <li>Eficiência energética inteligente</li>
              </ul>
            </div>
            <div className="impact-item">
              <h3>🎯 Produtividade</h3>
              <ul>
                <li>Automação de tarefas repetitivas</li>
                <li>Processamento inteligente de dados</li>
                <li>Tomada de decisão baseada em IA</li>
                <li>Colaboração otimizada entre equipes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="cases-section" id="cases">
        <div className="container">
          <h2 className="section-title">Cases de <span className="highlight">Sucesso</span></h2>
          <div className="cases-grid">
            <div className="case-card">
              <div className="case-header">
                <h3>Óleo & Gás Offshore</h3>
                <span className="case-tag">Sustentabilidade</span>
              </div>
              <p>Redução de 35% nas emissões de CO₂ e otimização de 40% no consumo energético em plataformas offshore, utilizando IA para monitoramento ambiental e eficiência operacional.</p>
              <div className="case-metrics">
                <span>-35% Emissões</span>
                <span>-40% Energia</span>
                <span>+60% Eficiência Operacional</span>
              </div>
            </div>
            <div className="case-card">
              <div className="case-header">
                <h3>Indústria Automotiva</h3>
                <span className="case-tag">Manufatura</span>
              </div>
              <p>Redução de 45% nos custos operacionais através de automação inteligente de processos de produção</p>
              <div className="case-metrics">
                <span>+300% Eficiência</span>
                <span>-45% Custos</span>
                <span>+200% Qualidade</span>
              </div>
            </div>
            <div className="case-card">
              <div className="case-header">
                <h3>Logística</h3>
                <span className="case-tag">Supply Chain</span>
              </div>
              <p>Otimização de rotas e gestão inteligente de estoque com IA</p>
              <div className="case-metrics">
                <span>+120% Velocidade</span>
                <span>-50% Custos</span>
                <span>+90% Precisão</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="metrics-section" id="metrics">
        <div className="container">
          <h2 className="section-title">Métricas <span className="highlight">Comprovadas</span></h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-number">95%</div>
              <div className="metric-label">Redução de Erros</div>
              <div className="metric-description">Automação inteligente elimina falhas humanas</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">24/7</div>
              <div className="metric-label">Operação Contínua</div>
              <div className="metric-description">Sistemas funcionam sem interrupção</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">3x</div>
              <div className="metric-label">Mais Rápido</div>
              <div className="metric-description">Processos otimizados com IA</div>
            </div>
            <div className="metric-card">
              <div className="metric-number">60%</div>
              <div className="metric-label">Menos Custos</div>
              <div className="metric-description">Redução significativa de despesas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <h2 className="section-title">Transforme Sua <span className="highlight">Empresa</span></h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Por que escolher BUILDER Engineering?</h3>
              <ul>
                <li>✅ Resultados comprovados em 50+ empresas</li>
                <li>✅ ROI médio de 300% em 6 meses</li>
                <li>✅ Implementação em 30 dias</li>
                <li>✅ Suporte técnico 24/7</li>
                <li>✅ Garantia de resultados</li>
              </ul>
              <div className="contact-details">
                <p><strong>Email:</strong> tadeuscofield@gmail.com</p>
                <p><strong>LinkedIn:</strong> https://www.linkedin.com/in/tadeu-santana-037802a2/</p>
                <p><strong>WhatsApp:</strong> (21) 96446-2281</p>
              </div>
            </div>
            <form className="contact-form" onSubmit={e => {
              e.preventDefault();
              const form = e.target;
              const empresa = form[0].value;
              const nome = form[1].value;
              const email = form[2].value;
              const telefone = form[3].value;
              const setor = form[4].value;
              const desafio = form[5].value;
              const subject = encodeURIComponent('Solicitação de Consultoria Gratuita');
              const body = encodeURIComponent(
                `Empresa: ${empresa}\nNome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nSetor: ${setor}\nDesafio: ${desafio}`
              );
              window.location.href = `mailto:tadeuscofield@gmail.com?subject=${subject}&body=${body}`;
            }}>
              <h3>Solicite uma Consultoria Gratuita</h3>
              <input type="text" placeholder="Nome da Empresa" required />
              <input type="text" placeholder="Seu Nome" required />
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Telefone" required />
              <select required>
                <option value="">Selecione o Setor</option>
                <option value="manufatura">Manufatura</option>
                <option value="varejo">Varejo</option>
                <option value="logistica">Logística</option>
                <option value="servicos">Serviços</option>
                <option value="outro">Outro</option>
              </select>
              <textarea placeholder="Descreva seu desafio atual..." required></textarea>
              <button type="submit" className="submit-btn">Solicitar Consultoria</button>
            </form>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5521964462281"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale no WhatsApp"
      >
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="19" cy="19" r="19" fill="#25D366"/>
          <path d="M27.5 22.5C26.8333 22.5 26.1667 22.5 25.5 22.5C25.1667 22.5 24.8333 22.5 24.5 22.5C24.1667 22.5 23.8333 22.5 23.5 22.5C23.1667 22.5 22.8333 22.5 22.5 22.5C22.1667 22.5 21.8333 22.5 21.5 22.5C21.1667 22.5 20.8333 22.5 20.5 22.5C20.1667 22.5 19.8333 22.5 19.5 22.5C19.1667 22.5 18.8333 22.5 18.5 22.5C18.1667 22.5 17.8333 22.5 17.5 22.5C17.1667 22.5 16.8333 22.5 16.5 22.5C16.1667 22.5 15.8333 22.5 15.5 22.5C15.1667 22.5 14.8333 22.5 14.5 22.5C14.1667 22.5 13.8333 22.5 13.5 22.5C13.1667 22.5 12.8333 22.5 12.5 22.5C12.1667 22.5 11.8333 22.5 11.5 22.5C11.1667 22.5 10.8333 22.5 10.5 22.5C10.1667 22.5 9.83333 22.5 9.5 22.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15.5 16.5C16.5 18.5 18.5 20.5 20.5 21.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>BUILDER Engineering</h4>
              <p>Transformando empresas através da engenharia de prompt e cultura BUILDER</p>
            </div>
            <div className="footer-section">
              <h4>Serviços</h4>
              <ul>
                <li>Engenharia de Prompt</li>
                <li>Automação Inteligente</li>
                <li>Análise de Dados</li>
                <li>Consultoria em IA</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contato</h4>
              <p>tadeuscofield@gmail.com</p>
              <p>https://www.linkedin.com/in/tadeu-santana-037802a2/</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 BUILDER Engineering. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
