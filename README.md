# LINKCUT

Aplicacion web ligera para acortar enlaces con panel de administracion y estadisticas de clics

## Herramientas

- **Backend:** Typescript
- **Frontend:** EJS
- **Base de datos:** SQLite

## Caracteristicas

- autenticación
- Panel de administracion
- Generacion de enlaces cortos
- Estadisticas de clics
- Codigo QR del enlace
- Generacion de codigos QR de un texto

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Jorge-Marco5/LINKCUT.git
cd LINKCUT
```

2. Configurar las variables de entorno:
Copia el archivo de ejemplo para crear tu propio archivo `.env` y ajusta las variables según sea necesario.
```bash
cp .env.example .env
```

3. Instalar dependencias:
```bash
pnpm install
```

> **Solución de problemas (sqlite3):** Si al iniciar el servidor aparece el error `Could not locate the bindings file`, se debe a que `sqlite3` no compiló los binarios para tu versión de Node. Para solucionarlo, fuerza la compilación ejecutando:
> ```bash
> cd node_modules/sqlite3 && npm run install && cd ../..
> ```

4. Ejecutar el proyecto:
```bash
pnpm run dev
```

El proyecto se ejecutará por defecto en [http://localhost:3000](http://localhost:3000) (o en el puerto especificado en tu archivo `.env`).
