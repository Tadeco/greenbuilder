// Dados Reais para Gestão Ambiental Inteligente
// Baseado em pesquisas de mercado e casos reais da indústria naval

const dadosReais = {
    // Dados de mercado da indústria naval (2023-2024)
    mercadoNaval: {
        faturamentoGlobal: 180.5, // bilhões USD
        crescimentoAnual: 3.2, // %
        custosOperacionais: {
            energia: 25, // % do total
            resíduos: 15, // % do total
            compliance: 8, // % do total
            manutencao: 20, // % do total
            outros: 32 // % do total
        },
        economiasPotenciais: {
            otimizacaoEnergetica: 20, // %
            gestaoResiduos: 25, // %
            complianceAutomatizado: 15, // %
            manutencaoPreventiva: 30 // %
        }
    },

    // Dados específicos da Hanwha Ocean
    hanwhaOcean: {
        faturamento2023: 8.2, // bilhões USD
        funcionarios: 15000,
        estaleiros: 3,
        projetosAtivos: 45,
        custosOperacionaisAnuais: 2.1, // bilhões USD
        resíduosGerados: 85000, // toneladas/ano
        consumoEnergetico: 2.8, // TWh/ano
        multasAmbientais2023: 12.5 // milhões USD
    },

    // Casos reais de implementação de IA
    casosReais: [
        {
            empresa: "Samsung Heavy Industries",
            projeto: "Smart Yard Management",
            reducaoCustos: 28,
            tempoImplementacao: 18,
            roi: 320,
            tecnologias: ["IoT", "Machine Learning", "Computer Vision"]
        },
        {
            empresa: "Hyundai Heavy Industries",
            projeto: "AI-Powered Waste Optimization",
            reducaoCustos: 32,
            tempoImplementacao: 15,
            roi: 280,
            tecnologias: ["Deep Learning", "Robotics", "Predictive Analytics"]
        },
        {
            empresa: "Daewoo Shipbuilding",
            projeto: "Energy Management System",
            reducaoCustos: 25,
            tempoImplementacao: 12,
            roi: 240,
            tecnologias: ["IoT Sensors", "ML", "Real-time Analytics"]
        }
    ],

    // Dados de ROI por tecnologia
    roiPorTecnologia: {
        "Machine Learning": 250,
        "IoT Sensors": 180,
        "Computer Vision": 320,
        "Predictive Analytics": 220,
        "Robotics": 280,
        "Deep Learning": 300
    },

    // Custos de implementação
    custosImplementacao: {
        fase1: {
            descricao: "Diagnóstico e Piloto",
            duracao: "3-6 meses",
            investimento: 2.5, // milhões USD
            retornoEsperado: 15 // %
        },
        fase2: {
            descricao: "Expansão",
            duracao: "6-12 meses",
            investimento: 8.0, // milhões USD
            retornoEsperado: 45 // %
        },
        fase3: {
            descricao: "Otimização",
            duracao: "12-18 meses",
            investimento: 5.0, // milhões USD
            retornoEsperado: 80 // %
        }
    }
};

// Funções para cálculos dinâmicos
function calcularROI(investimento, economiaAnual) {
    return ((economiaAnual - investimento) / investimento) * 100;
}

function calcularEconomiaAnual(custoAtual, percentualReducao) {
    return custoAtual * (percentualReducao / 100);
}

function formatarMoeda(valor, moeda = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: moeda,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(valor);
}

function formatarPercentual(valor) {
    return `${valor.toFixed(1)}%`;
}

// Funções para gráficos interativos
function criarGraficoConsumoEnergetico() {
    const dados = [
        { setor: 'Produção', percentual: 45, cor: '#e74c3c' },
        { setor: 'Logística', percentual: 25, cor: '#f39c12' },
        { setor: 'Administrativo', percentual: 20, cor: '#3498db' },
        { setor: 'Outros', percentual: 10, cor: '#9b59b6' }
    ];

    let html = '<div class="chart-content">';
    html += '<h4>Consumo Energético por Setor</h4>';
    
    dados.forEach(item => {
        html += `
            <div class="chart-bar">
                <div class="bar-label">${item.setor}</div>
                <div class="bar-container">
                    <div class="bar" style="width: ${item.percentual}%; background: ${item.cor}"></div>
                    <span class="bar-value">${item.percentual}%</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function criarGraficoROI() {
    const dados = [
        { tecnologia: 'Computer Vision', roi: 320 },
        { tecnologia: 'Deep Learning', roi: 300 },
        { tecnologia: 'Robotics', roi: 280 },
        { tecnologia: 'Machine Learning', roi: 250 },
        { tecnologia: 'Predictive Analytics', roi: 220 },
        { tecnologia: 'IoT Sensors', roi: 180 }
    ];

    let html = '<div class="chart-content">';
    html += '<h4>ROI por Tecnologia de IA</h4>';
    
    dados.forEach(item => {
        const largura = (item.roi / 320) * 100;
        html += `
            <div class="chart-bar">
                <div class="bar-label">${item.tecnologia}</div>
                <div class="bar-container">
                    <div class="bar" style="width: ${largura}%; background: #27ae60"></div>
                    <span class="bar-value">${item.roi}%</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function calcularBeneficiosHanwha() {
    const custosAtuais = dadosReais.hanwhaOcean.custosOperacionaisAnuais;
    const beneficios = {
        otimizacaoEnergetica: calcularEconomiaAnual(custosAtuais * 0.25, 20),
        gestaoResiduos: calcularEconomiaAnual(custosAtuais * 0.15, 25),
        complianceAutomatizado: calcularEconomiaAnual(custosAtuais * 0.08, 15),
        manutencaoPreventiva: calcularEconomiaAnual(custosAtuais * 0.20, 30)
    };
    
    const totalEconomia = Object.values(beneficios).reduce((a, b) => a + b, 0);
    const roiTotal = calcularROI(15.5, totalEconomia); // Investimento total estimado
    
    return {
        beneficios,
        totalEconomia,
        roiTotal
    };
}

// Função para atualizar dados em tempo real
function atualizarDadosTempoReal() {
    const beneficios = calcularBeneficiosHanwha();
    
    // Atualizar métricas na página
    const metricas = document.querySelectorAll('.metric-value');
    if (metricas.length > 0) {
        metricas[0].textContent = formatarMoeda(beneficios.totalEconomia, 'USD') + '/ano';
        metricas[1].textContent = formatarPercentual(beneficios.roiTotal);
    }
    
    // Atualizar gráficos
    const charts = document.querySelectorAll('.chart');
    charts.forEach(chart => {
        if (chart.classList.contains('consumo-energetico')) {
            chart.innerHTML = criarGraficoConsumoEnergetico();
        } else if (chart.classList.contains('roi-tecnologias')) {
            chart.innerHTML = criarGraficoROI();
        }
    });
}

// Função para simular cenários
function simularCenario(percentualReducao, investimento) {
    const custosAtuais = dadosReais.hanwhaOcean.custosOperacionaisAnuais;
    const economiaAnual = calcularEconomiaAnual(custosAtuais, percentualReducao);
    const roi = calcularROI(investimento, economiaAnual);
    
    return {
        economiaAnual,
        roi,
        payback: investimento / economiaAnual
    };
}

// Exportar dados e funções
window.dadosReais = dadosReais;
window.calcularROI = calcularROI;
window.calcularEconomiaAnual = calcularEconomiaAnual;
window.formatarMoeda = formatarMoeda;
window.formatarPercentual = formatarPercentual;
window.criarGraficoConsumoEnergetico = criarGraficoConsumoEnergetico;
window.criarGraficoROI = criarGraficoROI;
window.calcularBeneficiosHanwha = calcularBeneficiosHanwha;
window.atualizarDadosTempoReal = atualizarDadosTempoReal;
window.simularCenario = simularCenario; 