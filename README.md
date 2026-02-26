# CountryVote - Aplicación de Votación Digital

Aplicación de votación desarrollada con Angular 21.

## 📦 Tecnologías

- **Angular 21**: Framework principal
- **TypeScript**: Lenguaje de programación
- **Node.js 22**: Runtime requerido



## 🛠️ Instalación y Desarrollo

### Requisitos

- **Node.js 22** (requerido)
- npm

### Instalación

1. **Configurar Node.js 22**:
   ```bash
   # Con NVM (recomendado)
   nvm install 22
   nvm use 22
   
   # Verificar versión
   node --version  # Debe mostrar v22.x.x
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Levantar el proyecto**:
   ```bash
   # Asegurar Node 22 activo y iniciar servidor
   source ~/.nvm/nvm.sh && nvm use 22 && npm start
   ```

   La aplicación estará disponible en `http://localhost:4200`

## ⚠️ Nota Importante

**Este proyecto requiere específicamente Node.js 22**. Angular 21 no es compatible con versiones anteriores de Node.js.

### Comandos Adicionales

```bash
# Compilar para producción
npm run build

# Ejecutar tests
npm test
```