# 📄 Conversão de Arquivos HTML para PDF

Este guia explica como converter os arquivos HTML criados para PDF.

## 📋 Arquivos Criados

1. **`projeto_piloto_hanwha_ocean.html`** → Projeto técnico detalhado
2. **`apresentacao_mesa_redonda.html`** → Roteiro de apresentação
3. **`dashboard_prototipo.html`** → Demonstração visual do sistema

## 🛠️ Métodos de Conversão

### Método 1: Script Python (Recomendado)

#### Pré-requisitos:
```bash
pip install weasyprint
```

#### Executar conversão:
```bash
python converter_para_pdf.py
```

### Método 2: Navegador Web

1. **Abrir o arquivo HTML** no navegador (Chrome, Firefox, Edge)
2. **Pressionar Ctrl+P** (ou Cmd+P no Mac)
3. **Selecionar "Salvar como PDF"**
4. **Ajustar configurações:**
   - Margens: Mínimas
   - Escala: 100%
   - Páginas: Todas
5. **Clicar em "Salvar"**

### Método 3: Ferramentas Online

- **HTML to PDF Converter** (online)
- **Puppeteer** (Node.js)
- **wkhtmltopdf** (linha de comando)

## 📊 Resultados Esperados

Após a conversão, você terá:

- ✅ `projeto_piloto_hanwha_ocean.pdf` - Documento técnico completo
- ✅ `apresentacao_mesa_redonda.pdf` - Roteiro estratégico
- ✅ `dashboard_prototipo.pdf` - Demonstração visual

## 🎯 Uso na Mesa Redonda

### Para Apresentação:
1. **Imprimir cópias** do projeto piloto para distribuir
2. **Usar o roteiro** como guia durante a apresentação
3. **Mostrar o dashboard** no computador/tablet

### Materiais de Apoio:
- 📄 **Projeto Piloto**: Documento técnico para deixar com a empresa
- 📋 **Apresentação**: Roteiro para seguir durante a mesa redonda
- 🖥️ **Dashboard**: Demonstração visual para mostrar no momento

## 🔧 Solução de Problemas

### Erro: "weasyprint não encontrado"
```bash
pip install weasyprint
```

### Erro: "Fontes não encontradas"
- Instalar fontes do sistema
- Usar fontes web-safe no CSS

### Erro: "Layout quebrado"
- Verificar CSS @media print
- Ajustar margens e tamanhos

## 📱 Visualização

### Antes da Conversão:
- Abrir arquivos HTML no navegador
- Verificar layout e formatação
- Testar em diferentes dispositivos

### Após a Conversão:
- Verificar PDFs gerados
- Confirmar qualidade de impressão
- Testar em diferentes impressoras

## 🎨 Personalização

### Para Modificar Estilos:
1. Editar CSS nos arquivos HTML
2. Ajustar cores, fontes, layout
3. Re-converter para PDF

### Para Adicionar Conteúdo:
1. Editar HTML diretamente
2. Manter estrutura e classes CSS
3. Re-converter para PDF

## 📞 Suporte

Se encontrar problemas:

1. **Verificar dependências** (Python, weasyprint)
2. **Testar em navegador** primeiro
3. **Usar método alternativo** se necessário
4. **Verificar logs** de erro

---

**💡 Dica:** Mantenha os arquivos HTML como backup para futuras modificações! 