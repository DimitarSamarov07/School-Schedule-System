# School-Schedule-System

***Installing the required packages*** 
```bash
    cd Backend/
    npm install
```
***Generating a CSRF secret key***
```bash
    touch csrf.key
    openssl rand -base64 20
```
***Generating a private key for JWT***
```bash
    touch private.key
    openssl rand -base64 20
```

***How to run the backend***
```bash
    npm start
```
