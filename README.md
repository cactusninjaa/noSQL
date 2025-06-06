# Projet NoSQL - API de Gestion de Bibliothèque et Pokémon

## Groupe
- **ALLIA Jarjir**
- **Thomas SAUVAGE**

## Description du Projet

Ce projet est une API REST développée avec Node.js, Express et MongoDB qui combine deux domaines :
1. **Gestion de Bibliothèque** : Système complet de gestion de livres, utilisateurs, bibliothèques et prêts

## Technologies Utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM (Object Document Mapper) pour MongoDB
- **Nodemon** - Outil de développement pour le rechargement automatique

## Installation et Configuration

### Prérequis
- Node.js (version 14 ou supérieure)
- MongoDB (local ou distant)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <url-du-projet>
cd noSQL

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos paramètres MongoDB