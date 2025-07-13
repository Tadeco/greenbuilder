#!/usr/bin/env python3
"""
Script para converter HTML em PDF
Suporte para Windows, macOS e Linux
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def check_weasyprint():
    """Verifica se o WeasyPrint está instalado"""
    try:
        import weasyprint
        return True
    except ImportError:
        return False

def install_weasyprint():
    """Instala o WeasyPrint"""
    print("Instalando WeasyPrint...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "weasyprint"])
        print("✅ WeasyPrint instalado com sucesso!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Erro ao instalar WeasyPrint")
        return False

def convert_html_to_pdf(html_file, pdf_file):
    """Converte HTML para PDF usando WeasyPrint"""
    try:
        from weasyprint import HTML, CSS
        from weasyprint.text.fonts import FontConfiguration
        
        print(f"Convertendo {html_file} para {pdf_file}...")
        
        # Configuração de fontes
        font_config = FontConfiguration()
        
        # Carrega o HTML
        html_doc = HTML(filename=html_file)
        
        # Converte para PDF
        html_doc.write_pdf(pdf_file, font_config=font_config)
        
        print(f"✅ PDF criado com sucesso: {pdf_file}")
        return True
        
    except Exception as e:
        print(f"❌ Erro na conversão: {e}")
        return False

def open_in_browser(html_file):
    """Abre o arquivo HTML no navegador para conversão manual"""
    try:
        webbrowser.open(f'file://{os.path.abspath(html_file)}')
        print(f"🌐 Arquivo HTML aberto no navegador: {html_file}")
        print("\n📋 Instruções para conversão manual:")
        print("1. No navegador, pressione Ctrl+P (ou Cmd+P no Mac)")
        print("2. Selecione 'Salvar como PDF' como destino")
        print("3. Configure as margens como 'Mínimas'")
        print("4. Ative 'Gráficos de fundo' nas opções")
        print("5. Clique em 'Salvar'")
        return True
    except Exception as e:
        print(f"❌ Erro ao abrir no navegador: {e}")
        return False

def main():
    """Função principal"""
    print("🔄 Conversor HTML para PDF")
    print("=" * 40)
    
    # Verifica arquivos
    html_file = "reducao_custos_operacionais.html"
    pdf_file = "reducao_custos_operacionais.pdf"
    
    if not os.path.exists(html_file):
        print(f"❌ Arquivo HTML não encontrado: {html_file}")
        return
    
    print(f"📄 Arquivo HTML encontrado: {html_file}")
    
    # Tenta conversão automática
    if check_weasyprint():
        print("✅ WeasyPrint encontrado")
        if convert_html_to_pdf(html_file, pdf_file):
            print(f"\n🎉 Conversão concluída! PDF salvo como: {pdf_file}")
            return
    else:
        print("⚠️ WeasyPrint não encontrado")
        print("💡 No Windows, o WeasyPrint pode ter problemas de dependências.")
        install_choice = input("Deseja tentar instalar o WeasyPrint? (s/n): ").lower()
        if install_choice == 's':
            if install_weasyprint():
                try:
                    if convert_html_to_pdf(html_file, pdf_file):
                        print(f"\n🎉 Conversão concluída! PDF salvo como: {pdf_file}")
                        return
                except Exception as e:
                    print(f"❌ Erro na conversão: {e}")
                    print("💡 Usando método alternativo...")
    
    # Fallback: conversão manual
    print("\n🔄 Método Recomendado para Windows:")
    print("📋 Conversão manual via navegador")
    browser_choice = input("Abrir no navegador para conversão manual? (s/n): ").lower()
    if browser_choice == 's':
        open_in_browser(html_file)
    else:
        print("\n📋 Instruções detalhadas para conversão manual:")
        print(f"1. Abra o arquivo {html_file} no seu navegador")
        print("2. Pressione Ctrl+P (ou Cmd+P no Mac)")
        print("3. Selecione 'Salvar como PDF' como destino")
        print("4. Configure as margens como 'Mínimas'")
        print("5. Ative 'Gráficos de fundo' nas opções avançadas")
        print("6. Clique em 'Salvar'")
        print("\n💡 Este método garante melhor qualidade e compatibilidade no Windows!")

if __name__ == "__main__":
    main() 