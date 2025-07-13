#!/usr/bin/env python3
"""
Script para converter arquivos HTML para PDF
Requer: pip install weasyprint
"""

import os
import sys
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

def convert_html_to_pdf(html_file, pdf_file):
    """Converte um arquivo HTML para PDF"""
    try:
        # Configurar fontes
        font_config = FontConfiguration()
        
        # Ler o arquivo HTML
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Criar objeto HTML
        html_doc = HTML(string=html_content)
        
        # Converter para PDF
        html_doc.write_pdf(
            pdf_file,
            font_config=font_config,
            optimize_images=True
        )
        
        print(f"✅ Convertido com sucesso: {html_file} → {pdf_file}")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao converter {html_file}: {str(e)}")
        return False

def main():
    """Função principal"""
    print("🔄 Iniciando conversão de HTML para PDF...")
    
    # Lista de arquivos para converter
    files_to_convert = [
        ("projeto_piloto_hanwha_ocean.html", "projeto_piloto_hanwha_ocean.pdf"),
        ("apresentacao_mesa_redonda.html", "apresentacao_mesa_redonda.pdf"),
        ("dashboard_prototipo.html", "dashboard_prototipo.pdf")
    ]
    
    success_count = 0
    total_count = len(files_to_convert)
    
    for html_file, pdf_file in files_to_convert:
        if os.path.exists(html_file):
            if convert_html_to_pdf(html_file, pdf_file):
                success_count += 1
        else:
            print(f"⚠️  Arquivo não encontrado: {html_file}")
    
    print(f"\n📊 Resumo da conversão:")
    print(f"   ✅ Sucessos: {success_count}")
    print(f"   ❌ Falhas: {total_count - success_count}")
    print(f"   📁 Total: {total_count}")
    
    if success_count == total_count:
        print("\n🎉 Todos os arquivos foram convertidos com sucesso!")
        print("\n📋 Arquivos PDF criados:")
        for _, pdf_file in files_to_convert:
            if os.path.exists(pdf_file):
                size = os.path.getsize(pdf_file) / 1024  # KB
                print(f"   📄 {pdf_file} ({size:.1f} KB)")
    else:
        print("\n⚠️  Alguns arquivos não puderam ser convertidos.")

if __name__ == "__main__":
    # Verificar se weasyprint está instalado
    try:
        import weasyprint
    except ImportError:
        print("❌ Erro: weasyprint não está instalado.")
        print("📦 Instale com: pip install weasyprint")
        sys.exit(1)
    
    main() 