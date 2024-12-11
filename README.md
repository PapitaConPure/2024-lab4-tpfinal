# 2024-lab4-tpfinal
 TP final de Laboratorio IV

Prerrequisitos:
1. Postgresql con pgAdmin 4 (BASE DE DATOS CREADA Y CORRIENDO DE FONDO)
2. python 3.12 (NO 3.13)
3. Node.js ~20.12.2 con npm

Para correr:
1. En ./backend/, crear entorno virtual de python (venv)
2. Ejecutar `pip install -r requirements.txt`
3. Crear `.env` adyacente a main.py
4. Contenido de `.env`:
  ```dotenv
  POSTGRES_URI=postgresql+psycopg2://<USUARIO>:<CONTRASEÑA>@<IP>:<PUERTO>/<NOMBRE_BDD>
  ```
5. Ejecutar `uvicorn main:app --reload`
6. En ./frontend/, ejecutar `npm i`
7. Ejecutar `npm run rc:start`
