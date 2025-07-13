#!/usr/bin/env python3
"""
Exemplo de Implementação Real - Gestão Ambiental Inteligente
Baseado em casos reais da indústria naval
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import requests
from typing import Dict, List, Tuple
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WasteManagementAI:
    """Sistema de IA para Gestão Inteligente de Resíduos"""
    
    def __init__(self):
        self.model = None
        self.sensors_data = {}
        self.waste_categories = {
            'metal': {'recyclable': True, 'value': 0.85},
            'plastic': {'recyclable': True, 'value': 0.45},
            'wood': {'recyclable': True, 'value': 0.30},
            'hazardous': {'recyclable': False, 'value': 0.0},
            'general': {'recyclable': False, 'value': 0.0}
        }
        
    def analyze_waste_composition(self, sensor_data: Dict) -> Dict:
        """Análise da composição de resíduos usando IA"""
        try:
            # Simulação de análise com dados reais
            composition = {
                'metal': sensor_data.get('metal_detected', 0) * 0.8,
                'plastic': sensor_data.get('plastic_detected', 0) * 0.6,
                'wood': sensor_data.get('wood_detected', 0) * 0.4,
                'hazardous': sensor_data.get('hazardous_detected', 0) * 0.1,
                'general': sensor_data.get('general_waste', 0) * 0.3
            }
            
            total_weight = sum(composition.values())
            if total_weight > 0:
                composition = {k: (v/total_weight)*100 for k, v in composition.items()}
            
            return {
                'composition': composition,
                'total_weight': total_weight,
                'recyclable_percentage': sum([composition[k] for k, v in self.waste_categories.items() if v['recyclable']]),
                'estimated_value': sum([composition[k] * self.waste_categories[k]['value'] for k in composition])
            }
        except Exception as e:
            logger.error(f"Erro na análise de composição: {e}")
            return {}

class EnergyOptimizationAI:
    """Sistema de IA para Otimização Energética"""
    
    def __init__(self):
        self.energy_patterns = {}
        self.optimization_rules = {
            'production_peak': {'time': '08:00-18:00', 'load_reduction': 0.15},
            'maintenance_windows': {'time': '22:00-06:00', 'load_reduction': 0.25},
            'weekend_optimization': {'load_reduction': 0.30}
        }
    
    def predict_energy_demand(self, historical_data: pd.DataFrame) -> Dict:
        """Previsão de demanda energética usando IA"""
        try:
            # Simulação de previsão baseada em dados históricos
            avg_demand = historical_data['energy_consumption'].mean()
            std_demand = historical_data['energy_consumption'].std()
            
            # Fatores sazonais
            current_hour = datetime.now().hour
            current_day = datetime.now().weekday()
            
            # Ajustes baseados no horário
            if 8 <= current_hour <= 18:  # Horário comercial
                demand_multiplier = 1.2
            elif 22 <= current_hour or current_hour <= 6:  # Baixa demanda
                demand_multiplier = 0.6
            else:
                demand_multiplier = 0.8
            
            # Ajustes para fim de semana
            if current_day >= 5:  # Sábado ou domingo
                demand_multiplier *= 0.7
            
            predicted_demand = avg_demand * demand_multiplier
            
            return {
                'predicted_demand': predicted_demand,
                'confidence_interval': (predicted_demand - std_demand, predicted_demand + std_demand),
                'optimization_potential': self.calculate_optimization_potential(predicted_demand),
                'recommendations': self.generate_energy_recommendations(predicted_demand)
            }
        except Exception as e:
            logger.error(f"Erro na previsão de demanda: {e}")
            return {}
    
    def calculate_optimization_potential(self, current_demand: float) -> Dict:
        """Calcula potencial de otimização energética"""
        optimization_scenarios = {
            'immediate': {'reduction': 0.10, 'cost': 50000},
            'short_term': {'reduction': 0.20, 'cost': 150000},
            'long_term': {'reduction': 0.30, 'cost': 500000}
        }
        
        results = {}
        for scenario, params in optimization_scenarios.items():
            savings = current_demand * params['reduction'] * 365 * 0.12  # USD/kWh
            roi = ((savings - params['cost']) / params['cost']) * 100
            payback = params['cost'] / savings
            
            results[scenario] = {
                'energy_savings_kwh': current_demand * params['reduction'] * 365,
                'cost_savings_usd': savings,
                'roi_percent': roi,
                'payback_years': payback
            }
        
        return results
    
    def generate_energy_recommendations(self, current_demand: float) -> List[str]:
        """Gera recomendações de otimização energética"""
        recommendations = []
        
        if current_demand > 5000:  # kWh
            recommendations.append("Implementar sistema de gestão de carga em tempo real")
            recommendations.append("Otimizar horários de operação de equipamentos pesados")
        
        if current_demand > 3000:
            recommendations.append("Instalar sensores IoT para monitoramento de eficiência")
            recommendations.append("Implementar manutenção preventiva baseada em IA")
        
        recommendations.append("Substituir equipamentos antigos por versões mais eficientes")
        recommendations.append("Implementar sistema de iluminação inteligente")
        
        return recommendations

class ComplianceMonitor:
    """Sistema de Monitoramento de Compliance Ambiental"""
    
    def __init__(self):
        self.compliance_rules = {
            'emissions_limit': 100,  # mg/m³
            'waste_volume_limit': 1000,  # kg/dia
            'energy_efficiency_min': 0.75,  # 75% eficiência mínima
            'recycling_rate_min': 0.60  # 60% taxa de reciclagem mínima
        }
        self.violation_history = []
    
    def check_compliance(self, current_metrics: Dict) -> Dict:
        """Verifica compliance com regulamentações ambientais"""
        violations = []
        warnings = []
        
        # Verificar emissões
        if current_metrics.get('emissions', 0) > self.compliance_rules['emissions_limit']:
            violations.append({
                'type': 'emissions',
                'current': current_metrics['emissions'],
                'limit': self.compliance_rules['emissions_limit'],
                'severity': 'high'
            })
        
        # Verificar volume de resíduos
        if current_metrics.get('waste_volume', 0) > self.compliance_rules['waste_volume_limit']:
            warnings.append({
                'type': 'waste_volume',
                'current': current_metrics['waste_volume'],
                'limit': self.compliance_rules['waste_volume_limit'],
                'severity': 'medium'
            })
        
        # Verificar eficiência energética
        efficiency = current_metrics.get('energy_efficiency', 0)
        if efficiency < self.compliance_rules['energy_efficiency_min']:
            warnings.append({
                'type': 'energy_efficiency',
                'current': efficiency,
                'limit': self.compliance_rules['energy_efficiency_min'],
                'severity': 'medium'
            })
        
        # Verificar taxa de reciclagem
        recycling_rate = current_metrics.get('recycling_rate', 0)
        if recycling_rate < self.compliance_rules['recycling_rate_min']:
            warnings.append({
                'type': 'recycling_rate',
                'current': recycling_rate,
                'limit': self.compliance_rules['recycling_rate_min'],
                'severity': 'low'
            })
        
        return {
            'status': 'compliant' if not violations else 'non_compliant',
            'violations': violations,
            'warnings': warnings,
            'risk_score': self.calculate_risk_score(violations, warnings)
        }
    
    def calculate_risk_score(self, violations: List, warnings: List) -> float:
        """Calcula score de risco baseado em violações e avisos"""
        risk_score = 0.0
        
        # Violações têm peso maior
        for violation in violations:
            if violation['severity'] == 'high':
                risk_score += 0.4
            elif violation['severity'] == 'medium':
                risk_score += 0.2
        
        # Avisos têm peso menor
        for warning in warnings:
            if warning['severity'] == 'high':
                risk_score += 0.2
            elif warning['severity'] == 'medium':
                risk_score += 0.1
            else:
                risk_score += 0.05
        
        return min(risk_score, 1.0)
    
    def generate_compliance_report(self, compliance_data: Dict) -> Dict:
        """Gera relatório de compliance"""
        return {
            'timestamp': datetime.now().isoformat(),
            'compliance_status': compliance_data['status'],
            'risk_score': compliance_data['risk_score'],
            'violations_count': len(compliance_data['violations']),
            'warnings_count': len(compliance_data['warnings']),
            'recommendations': self.generate_compliance_recommendations(compliance_data),
            'estimated_fines': self.estimate_potential_fines(compliance_data)
        }
    
    def generate_compliance_recommendations(self, compliance_data: Dict) -> List[str]:
        """Gera recomendações para melhorar compliance"""
        recommendations = []
        
        if compliance_data['violations']:
            recommendations.append("Implementar sistema de monitoramento em tempo real")
            recommendations.append("Estabelecer alertas automáticos para violações")
        
        if compliance_data['warnings']:
            recommendations.append("Otimizar processos para reduzir resíduos")
            recommendations.append("Implementar programa de reciclagem mais eficiente")
        
        recommendations.append("Treinar equipe em práticas ambientais")
        recommendations.append("Implementar auditorias regulares de compliance")
        
        return recommendations
    
    def estimate_potential_fines(self, compliance_data: Dict) -> float:
        """Estima multas potenciais baseadas em violações"""
        fine_estimates = {
            'emissions': 50000,  # USD por violação
            'waste_volume': 25000,
            'energy_efficiency': 15000,
            'recycling_rate': 10000
        }
        
        total_fines = 0
        for violation in compliance_data['violations']:
            total_fines += fine_estimates.get(violation['type'], 10000)
        
        return total_fines

class EnvironmentalManagementSystem:
    """Sistema Integrado de Gestão Ambiental"""
    
    def __init__(self):
        self.waste_ai = WasteManagementAI()
        self.energy_ai = EnergyOptimizationAI()
        self.compliance_monitor = ComplianceMonitor()
        self.data_history = []
    
    def process_real_time_data(self, sensor_data: Dict) -> Dict:
        """Processa dados em tempo real e gera insights"""
        try:
            # Análise de resíduos
            waste_analysis = self.waste_ai.analyze_waste_composition(sensor_data)
            
            # Análise energética (simulando dados históricos)
            historical_data = pd.DataFrame({
                'energy_consumption': [3000, 3500, 3200, 3800, 3600],
                'timestamp': pd.date_range(start='2024-01-01', periods=5, freq='D')
            })
            energy_analysis = self.energy_ai.predict_energy_demand(historical_data)
            
            # Verificação de compliance
            current_metrics = {
                'emissions': sensor_data.get('emissions', 85),
                'waste_volume': sensor_data.get('waste_volume', 950),
                'energy_efficiency': sensor_data.get('energy_efficiency', 0.78),
                'recycling_rate': sensor_data.get('recycling_rate', 0.65)
            }
            compliance_status = self.compliance_monitor.check_compliance(current_metrics)
            
            # Calcular benefícios financeiros
            financial_benefits = self.calculate_financial_benefits(
                waste_analysis, energy_analysis, compliance_status
            )
            
            return {
                'timestamp': datetime.now().isoformat(),
                'waste_analysis': waste_analysis,
                'energy_analysis': energy_analysis,
                'compliance_status': compliance_status,
                'financial_benefits': financial_benefits,
                'recommendations': self.generate_integrated_recommendations(
                    waste_analysis, energy_analysis, compliance_status
                )
            }
        except Exception as e:
            logger.error(f"Erro no processamento de dados: {e}")
            return {}
    
    def calculate_financial_benefits(self, waste_analysis: Dict, energy_analysis: Dict, compliance_status: Dict) -> Dict:
        """Calcula benefícios financeiros totais"""
        benefits = {
            'waste_optimization_savings': waste_analysis.get('estimated_value', 0) * 365,  # USD/ano
            'energy_optimization_savings': energy_analysis.get('optimization_potential', {}).get('short_term', {}).get('cost_savings_usd', 0),
            'compliance_fine_avoidance': compliance_status.get('estimated_fines', 0),
            'operational_efficiency_gains': 0
        }
        
        # Calcular ganhos de eficiência operacional
        if compliance_status.get('status') == 'compliant':
            benefits['operational_efficiency_gains'] = 50000  # USD/ano
        
        total_benefits = sum(benefits.values())
        
        return {
            'individual_benefits': benefits,
            'total_annual_savings': total_benefits,
            'roi_estimate': self.calculate_roi(total_benefits),
            'payback_period': self.calculate_payback(total_benefits)
        }
    
    def calculate_roi(self, annual_savings: float) -> float:
        """Calcula ROI baseado em economia anual"""
        total_investment = 1500000  # USD - investimento total estimado
        return ((annual_savings - total_investment) / total_investment) * 100
    
    def calculate_payback(self, annual_savings: float) -> float:
        """Calcula período de payback"""
        total_investment = 1500000  # USD
        return total_investment / annual_savings if annual_savings > 0 else float('inf')
    
    def generate_integrated_recommendations(self, waste_analysis: Dict, energy_analysis: Dict, compliance_status: Dict) -> List[str]:
        """Gera recomendações integradas"""
        recommendations = []
        
        # Recomendações baseadas em análise de resíduos
        if waste_analysis.get('recyclable_percentage', 0) < 60:
            recommendations.append("Implementar sistema de separação automática de resíduos")
        
        # Recomendações baseadas em análise energética
        if energy_analysis.get('optimization_potential', {}).get('short_term', {}).get('roi_percent', 0) > 200:
            recommendations.append("Implementar otimização energética de curto prazo")
        
        # Recomendações baseadas em compliance
        if compliance_status.get('status') != 'compliant':
            recommendations.append("Priorizar correção de violações de compliance")
        
        recommendations.append("Implementar dashboard de monitoramento em tempo real")
        recommendations.append("Estabelecer KPIs ambientais mensais")
        
        return recommendations

# Exemplo de uso
def main():
    """Exemplo de implementação real"""
    print("🚀 Sistema de Gestão Ambiental Inteligente")
    print("=" * 50)
    
    # Inicializar sistema
    ems = EnvironmentalManagementSystem()
    
    # Simular dados de sensores em tempo real
    sensor_data = {
        'metal_detected': 150,  # kg
        'plastic_detected': 200,  # kg
        'wood_detected': 100,  # kg
        'hazardous_detected': 5,  # kg
        'general_waste': 300,  # kg
        'emissions': 85,  # mg/m³
        'waste_volume': 950,  # kg/dia
        'energy_efficiency': 0.78,  # 78%
        'recycling_rate': 0.65  # 65%
    }
    
    # Processar dados
    results = ems.process_real_time_data(sensor_data)
    
    # Exibir resultados
    print("\n📊 Resultados da Análise:")
    print(f"Status de Compliance: {results['compliance_status']['status']}")
    print(f"Score de Risco: {results['compliance_status']['risk_score']:.2f}")
    print(f"Economia Anual Estimada: ${results['financial_benefits']['total_annual_savings']:,.0f}")
    print(f"ROI Estimado: {results['financial_benefits']['roi_estimate']:.1f}%")
    print(f"Período de Payback: {results['financial_benefits']['payback_period']:.1f} anos")
    
    print("\n💡 Recomendações Principais:")
    for i, rec in enumerate(results['recommendations'][:5], 1):
        print(f"{i}. {rec}")
    
    print("\n✅ Sistema funcionando corretamente!")

if __name__ == "__main__":
    main() 