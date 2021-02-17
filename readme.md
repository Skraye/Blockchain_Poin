# Projet POIN

L'objectif de ce projet est de créer une blockchain pour sécuriser des documents de santé.

Ce projet est un POC, la partie front-end y est inclus dans le dossier "front" pour plus de praticité et aucun stockage persistent n'est mis en place, tous les blocks sont donc perdu si tous les noeuds sont coupés.

Prérequis:



Pour démarrer le projet :

1. Installer Python 3 (testé avec Python 3.8, avec Pip, inclus par défaut dans l'installer python)
2. Créer un environnement virtuel python et l'activer (si l'activation du venv est bloqué Set-ExecutionPolicy unrestricted)
   ```
        python -m venv ./venv
        . ./venv/Scripts/activate
   ```
3. Installer les dépendances via Pip
   ```
       pip install -r requirements.txt
   ```
4. Démarrer un noeud 
   ``` 
       flask run --port 8000
   ```
- Démarrer plusieurs autres noeud en changeant le port
- Essayer les API via un outil tel que Postman ou bien utiliser le front-end fourni.

source : https://github.com/nealkumar/Blockchain
