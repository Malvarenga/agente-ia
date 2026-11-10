# Agente de ventas

Aplicación web de chat que consulta un catálogo de productos en PostgreSQL y usa Groq para responder preguntas sobre marcas, categorías, precios y disponibilidad.

## Requisitos

- Node.js 20.9 o posterior y npm.
- PostgreSQL instalado y en ejecución, o una instancia PostgreSQL accesible.
- Una clave de API de Groq para usar el chat.

## Configuración desde cero

1. **Obtener el proyecto e instalar dependencias**

   Desde la carpeta del proyecto, ejecuta:

   ```powershell
   npm ci
   ```

2. **Crear la base de datos**

   Crea una base de datos PostgreSQL llamada `agente_ia` (o elige otro nombre). Por ejemplo, desde `psql`, con un usuario que tenga permisos:

   ```sql
   CREATE DATABASE agente_ia;
   ```

   Asegúrate de que el servicio de PostgreSQL esté iniciado y que el usuario pueda conectarse a esa base.

3. **Configurar las variables de entorno**

   Crea un archivo `.env` en la raíz del proyecto con la URL de conexión y tu clave de Groq:

   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/agente_ia?schema=public"
   GROQ_API_KEY="tu_clave_de_groq"
   ```

   Sustituye `usuario`, `contraseña` y la clave por tus valores. Si la contraseña contiene caracteres reservados de URL, codifícalos (por ejemplo, `@` como `%40`). No compartas ni subas el archivo `.env` al repositorio.

4. **Generar Prisma Client y aplicar las migraciones**

   ```powershell
   npx prisma generate
   npx prisma migrate deploy
   ```

   La migración crea las tablas e índices del catálogo. `migrate deploy` aplica las migraciones existentes; no crea una migración nueva.

5. **Cargar productos de ejemplo**

   ```powershell
   npx --yes tsx prisma/seed.ts
   ```

   Este paso es recomendable para probar el agente con productos. El script evita duplicar productos si se ejecuta más de una vez. `npx` descargará `tsx` si no está disponible localmente.

6. **Iniciar la aplicación**

   ```powershell
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en el navegador. Escribe, por ejemplo: “¿Tienes una laptop Dell por menos de $700?”.

## Comandos útiles

```powershell
npm run dev       # Servidor local de desarrollo
npm run lint      # Revisión de código con ESLint
npm run build     # Compilación de producción
npm run start     # Servir la compilación de producción
npx prisma migrate status  # Consultar el estado de las migraciones
```

Para producción, configura `DATABASE_URL` y `GROQ_API_KEY` en el entorno de ejecución, aplica las migraciones con `npx prisma migrate deploy` y luego ejecuta `npm run build` y `npm run start`.

## Solución de problemas

- **No se puede conectar a PostgreSQL**: verifica que el servicio esté en ejecución, que el host y puerto de `DATABASE_URL` sean correctos y que la base de datos exista. El puerto predeterminado de PostgreSQL es `5432`.
- **Error de autenticación de PostgreSQL**: revisa el usuario y la contraseña de la URL; codifica los caracteres reservados de la contraseña.
- **Error al usar Prisma**: confirma que `.env` esté en la raíz y vuelve a ejecutar `npx prisma generate`.
- **El chat no responde**: confirma que `GROQ_API_KEY` esté definida y sea válida. Reinicia `npm run dev` después de modificar `.env`.
- **No aparecen productos**: ejecuta `npx --yes tsx prisma/seed.ts` para cargar los datos de ejemplo.
