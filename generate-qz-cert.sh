#!/bin/bash

# Script para gerar certificado autoassinado para QZ Tray
# Execute este script na raiz do projeto

echo "🔐 Gerando certificado autoassinado para QZ Tray..."
echo ""

# Criar diretório para certificados (se não existir)
mkdir -p certificates

# Gerar private key RSA (2048 bits)
echo "📝 Gerando private key..."
openssl genrsa -out certificates/qz-private-key.pem 2048

if [ $? -ne 0 ]; then
    echo "❌ Erro ao gerar private key"
    exit 1
fi

echo "✅ Private key gerada: certificates/qz-private-key.pem"
echo ""

# Gerar certificado autoassinado (válido por 10 anos)
echo "📝 Gerando certificado..."
openssl req -new -x509 -key certificates/qz-private-key.pem -out certificates/qz-cert.crt -days 3650 \
    -subj "/CN=API Studio/O=CERO/C=BR/ST=Estado/L=Cidade"

if [ $? -ne 0 ]; then
    echo "❌ Erro ao gerar certificado"
    exit 1
fi

echo "✅ Certificado gerado: certificates/qz-cert.crt"
echo ""

# Copiar certificado para pasta public
echo "📋 Copiando certificado para /public..."
cp certificates/qz-cert.crt public/qz-cert.crt

if [ $? -ne 0 ]; then
    echo "❌ Erro ao copiar certificado para /public"
    exit 1
fi

echo "✅ Certificado copiado para: public/qz-cert.crt"
echo ""

# Codificar private key em base64
echo "📝 Codificando private key em base64..."
PRIVATE_KEY_BASE64=$(base64 -w 0 certificates/qz-private-key.pem 2>/dev/null || base64 certificates/qz-private-key.pem)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Certificados gerados com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Arquivos gerados:"
echo "   • certificates/qz-private-key.pem (PRIVADO - NÃO COMMITAR)"
echo "   • certificates/qz-cert.crt (público)"
echo "   • public/qz-cert.crt (público)"
echo ""
echo "⚙️  Configuração:"
echo ""
echo "1️⃣  Adicione ao arquivo .env.local:"
echo ""
echo "QZ_PRIVATE_KEY=\"$PRIVATE_KEY_BASE64\""
echo ""
echo "2️⃣  Certifique-se de que .env.local está no .gitignore"
echo ""
echo "3️⃣  O certificado público já foi copiado para /public/qz-cert.crt"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   • NUNCA commite o arquivo qz-private-key.pem"
echo "   • NUNCA commite o arquivo .env.local"
echo "   • Mantenha a private key segura"
echo ""
