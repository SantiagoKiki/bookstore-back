
Docker muere o hace cosas raras:
wsl --shutdown

Puerto lleno:
netstat -ano | findstr :8080


Empezar - inicializar el docker
docker build -t bookstore .
luego:
docker run -p 8080:8080 bookstore

En el front:
cd bookstore-front      # entrar a la carpeta
code .                  # abrir en VS Code
npm run dev 
